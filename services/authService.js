import jwt from 'jsonwebtoken';

export const signToken = (id, secret_key, exp) => {
  return jwt.sign({ id }, secret_key, {
    expiresIn: exp,
  });
};

export const sendToken = (user, statusCode, res, accessToken) => {
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token: accessToken,
    data: {
      user,
    },
  });
};

export const createSendToken = async (user, statusCode, req, res) => {
  const accessToken = signToken(
    user._id,
    process.env.ACCESS_TOKEN_SECRET,
    '3m'
  );
  const refreshToken = signToken(
    user._id,
    process.env.REFRESH_TOKEN_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  // console.log(req.secure || req.headers['x-forwarded-proto'] === 'https');
  // console.log(req.headers['x-forwarded-proto']);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'None',
    // secure: req.secure || req.get('x-forwarded-proto') === 'https',
    secure: true,
  };

  // if (req.secure || req.headers['x-forwarded-proto'] === 'https')
  //   cookieOptions.secure = true;

  res.cookie('jwt', refreshToken, cookieOptions);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  sendToken(user, statusCode, res, accessToken);
};
