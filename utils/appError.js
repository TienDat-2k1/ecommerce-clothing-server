class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // không thêm vào error.stack khi hàm contructor được gọi
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
