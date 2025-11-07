class APIERR extends Error {
  constructor(
    status,
    message = "Something Went Wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.status = status;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { APIERR };
