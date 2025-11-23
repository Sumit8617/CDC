export const asynchandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    console.error("ERR From Asynchandler:", error);

    const status = error?.status || 500;
    const message = error?.message || "Internal Server Error";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
