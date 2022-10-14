import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';
import * as authService from '../services/authService.js';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  await authService.createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check ì email and password exits
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password incorrect
  const user = await User.findOne({ email }).select('+password +active');
  if (!user) return next(new AppError('Invalid email or password!'));

  console.log(user);

  // Check if account is active
  if (!user.active)
    return next(new AppError('Your account has been disabled!', 403));

  const correctPassword = await user.correctPassword(password, user.password);

  if (!correctPassword) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // If everything ok, send token to client
  await authService.createSendToken(user, 200, res);
});

export const refresh = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  console.log(req.cookies);

  if (!cookies?.jwt) return next(new AppError('Unauthorized', 401));
  const refreshToken = cookies.jwt;

  // 3) Check if user still exists
  const currentUser = await User.findOne({ refreshToken });
  if (!currentUser) return next(new AppError('Not found user', 404));

  // 2) Verification token

  const decoded = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log(decoded);

  // access
  await authService.createSendToken(currentUser, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Check refreshToken in database
  const currentUser = await User.findOne({ refreshToken });
  if (!currentUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return next(new AppError('Not loggin yet!!', 204));
  }

  // delete refreshToken in db
  currentUser.refreshToken = '';
  await currentUser.save({ validateBeforeSave: false });

  // clear Cookies
  res.clearCookie('jwt', { httpOnly: true });

  // send status
  res.status(200).json({ status: 'success' });
});

// function protect route handler
export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  // 2) Verification token

  const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist.')
    );

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again!')
    );
  }

  // access
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3)Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Ty again later!', 500)
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If the token has not expired, and there is user, set the new password

  if (!user) return new AppError('Token is invalid or has expired!', 400);

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  authService.createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  authService.createSendToken(user, 200, res);
});
