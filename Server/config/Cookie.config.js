const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
};

export { cookieOptions };
