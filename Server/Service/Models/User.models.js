import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Parse allowed domains from .env safely
let allowedDomains = [];
try {
  allowedDomains = JSON.parse(process.env.COLLEGE_EMAIL_DOMAINS || "[]");
  if (!Array.isArray(allowedDomains)) allowedDomains = [];
} catch (err) {
  console.error("Invalid COLLEGE_EMAIL_DOMAINS format in .env");
  allowedDomains = [];
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "College email is required"],
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!allowedDomains.length) return true; // skip check if not configured

          // Build regex: user@domain1.com OR user@domain2.com
          const pattern = `^[a-zA-Z0-9._%+-]+@(${allowedDomains
            .map((d) => d.replace(/^[^@]*@/, "").replace(/\./g, "\\."))
            .join("|")})$`;

          const domainRegex = new RegExp(pattern);
          return domainRegex.test(v);
        },
        message: () =>
          `Only official college emails (${allowedDomains.join(", ")}) are accepted`,
      },
      index: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: [true, "Mobile Number must be Unique"],
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum 6 Characters Needed"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type : String
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.isPasswordValid = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.fullName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// Hash refresh token before saving
userSchema.methods.hashRefreshToken = async function (plainToken) {
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(plainToken, salt);
  this.refreshToken = hashedToken;
  return this.refreshToken;
};

// Compare refresh token
userSchema.methods.compareRefreshToken = async function (plainToken) {
  return await bcrypt.compare(plainToken, this.refreshToken);
};

export const User = mongoose.model("User", userSchema);
