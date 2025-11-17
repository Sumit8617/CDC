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

  const { handleSubmit, watch, reset, register } = methods;

  const navigate = useNavigate();

  const {
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    loading,
    error,
    otpSent,
    otpVerified,
  } = useSignup();

  const password = watch("password");

  // === SEND OTP ===
  const onSendOtp = async () => {
    const email = methods.getValues("email");
    const fullName = methods.getValues("fullName");

    if (!email || !fullName) {
      alert("Please enter Full Name and Email first");
      return;
    }

    try {
      await handleSendOtp({ email, fullName });
      alert("OTP sent successfully!");
    } catch {
      alert("Failed to send OTP");
    }
  };

  // === VERIFY OTP ===
  const onVerifyOtp = async () => {
    const otp = methods.getValues("otp");
    if (!otp) return alert("Enter OTP before verifying");

    try {
      await handleVerifyOtp(otp);
      alert("OTP Verified!");
    } catch {
      alert("Invalid OTP");
    }
  };

  // === SIGNUP ===
  const onSubmit = async (data) => {
    if (!otpVerified) {
      alert("Please verify your OTP before signing up.");
      return;
    }

    try {
      await handleSignup(data);
      reset();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-auto w-full flex items-center justify-center">
      <div className="flex w-full shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex relative flex-col justify-center items-center w-1/2 text-white bg-linear-to-br from-indigo-700 via-blue-700 to-sky-600">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-bold font-ubuntu">
              Join Our Community
            </h2>
            <p className="text-lg mt-4">
              Sign up today and get started in minutes.
            </p>

            <ul className="space-y-3 text-lg mt-4">
              <li>Secure verification with OTP</li>
              <li>Protected personal information</li>
              <li>Instant account activation</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Create Account
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* FULL NAME */}
              <Input
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                rules={{ required: "Full name is required" }}
              />

              {/* EMAIL + SEND OTP IN ROW */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    rules={{ required: "Email is required" }}
                  />
                </div>

                {!otpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onSendOtp}
                    disabled={loading}
                    className="h-[42px]"
                  >
                    Send OTP
                  </Button>
                )}
              </div>

              {/* OTP + VERIFY IN ROW */}
              {otpSent && (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      name="otp"
                      placeholder="Enter OTP"
                      type="number"
                      rules={{ required: "OTP is required" }}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onVerifyOtp}
                    disabled={otpVerified}
                    className="h-[42px]"
                  >
                    {otpVerified ? "Verified" : "Verify"}
                  </Button>
                </div>
              )}

              {/* MOBILE + ROLL NUMBER ROW */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    name="mobileNumber"
                    label="Mobile Number"
                    type="tel"
                    placeholder="9876543210"
                    rules={{ required: "Mobile number is required" }}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name="rollNumber"
                    label="College Roll Number"
                    type="number"
                    placeholder="2310110XXXX"
                    rules={{ required: "Roll number is required" }}
                  />
                </div>
              </div>

              {/* ROLE + DOB ROW */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex-1">
                  <Input
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    rules={{ required: "Date of Birth is required" }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                }}
              />

              {/* CONFIRM PASSWORD */}
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                rules={{
                  required: "Confirm password",
                  validate: (v) => v === password || "Passwords do not match",
                }}
              />

              {/* SUBMIT BUTTON */}
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              {error && (
                <p className="text-red-500 text-center mt-2">{error}</p>
              )}
            </form>
          </FormProvider>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
