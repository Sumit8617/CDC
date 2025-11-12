import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import { useNavigate } from "react-router-dom";
import useSignup from "../../Hooks/AuthHooks";

const Signup = () => {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      otp: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      dob: "",
      rollNumber: "",
      role: "user",
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();

  const {
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    loading,
    error,
    success,
    otpSent,
    otpVerified,
  } = useSignup();

  const password = watch("password");

  // === OTP Send Handler ===
  const onSendOtp = async () => {
    const fullName = methods.getValues("fullName");
    const email = methods.getValues("email");
    if (!email || !fullName) {
      alert("Please enter your email and fullName before sending OTP.");
      return;
    }
    try {
      await handleSendOtp({ email, fullName });
      alert("OTP sent successfully to your email!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP.");
    }
  };

  // === OTP Verify Handler ===
  const onVerifyOtp = async () => {
    const otp = methods.getValues("otp");
    if (!otp) {
      alert("Please enter both email and OTP to verify.");
      return;
    }
    try {
      await handleVerifyOtp(otp);
      alert("OTP verified successfully!");
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP. Please try again.");
    }
  };

  // === Signup Handler ===
  const onSubmit = async (data) => {
    try {
      if (!otpVerified) {
        alert("Please verify your OTP before signing up.");
        return;
      }
      await handleSignup(data);
      navigate("/");
      reset();
      console.log("Sign UP User Data =>", data);
    } catch (err) {
      console.log("Sign UP User Data =>", data);
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-xl shadow-lg p-8 md:p-10 border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Your Account
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Full Name */}
              <Input
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters",
                  },
                }}
              />

              {/* === Email with OTP Buttons === */}
              <div className="flex flex-col">
                <Input
                  name="email"
                  label="College Email"
                  type="email"
                  placeholder="Enter your college mail"
                  rules={{
                    required: "Please enter your college mail",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                />

                {/* SEND AND VERIFY OTP BUTTON */}
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onSendOtp}
                    disabled={loading || otpSent}
                  >
                    {otpSent ? "OTP Sent" : "Send OTP"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onVerifyOtp}
                    disabled={!otpSent || otpVerified}
                  >
                    {otpVerified ? "Verified" : "Verify OTP"}
                  </Button>
                </div>
              </div>
              {/* OTP  */}
              <Input
                name="otp"
                label="Verify OTP"
                type="number"
                placeholder="OTP"
                rules={{ required: "OTP is required" }}
              />
              {/* Mobile Number */}
              <Input
                name="mobileNumber"
                label="Enter your Mobile Number"
                type="number"
                placeholder="Mobile"
                rules={{ required: "Mobile number is required" }}
              />
              {/* Roll Number */}
              <Input
                name="rollNumber"
                label="Enter your Roll Number"
                type="number"
                placeholder="Roll"
                rules={{ required: "Roll number is required" }}
              />
              {/* DOB */}
              <Input
                name="dob"
                label="Enter your Birth Date"
                type="date"
                placeholder="DOB"
                rules={{ required: "DOB is required" }}
              />
              {/* Password */}
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                }}
              />
              {/* Confirm Password */}
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
              />
            </div>

            {/* Role Select */}
            <div className="mt-6 mb-4 flex flex-col">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Select Role
              </label>
              <select
                id="role"
                {...register("role", { required: "Please select a role" })}
                defaultValue=""
                className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  -- Select your role --
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.role.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              round="md"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            {error && <p className="text-center text-red-500 mt-3">{error}</p>}
            {success && (
              <p className="text-center text-green-600 mt-3">
                Account created successfully!
              </p>
            )}
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
