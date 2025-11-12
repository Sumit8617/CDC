export const asynchandler = (requestHandler) => async (req, res, next) => {
  try {
    return await requestHandler(req, res, next);
  } catch (error) {
    console.error("ERR From Asynchandler", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
