import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components";
import { useNavigate, Link } from "react-router-dom";
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
    mode: "onTouched",
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isValid },
  } = methods;
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

  const onSendOtp = async () => {
    const { email, fullName } = methods.getValues();
    if (!email || !fullName) {
      return alert("Please enter Full Name and Email first");
    }
    await handleSendOtp({ email, fullName });
  };

  const onVerifyOtp = async () => {
    const otp = methods.getValues("otp");
    if (!otp) return alert("Enter OTP first");
    await handleVerifyOtp(otp);
  };

  const onSubmit = async (data) => {
    if (!otpVerified) return alert("Verify OTP first");
    await handleSignup(data);
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="min-h-screen w-full bg-white overflow-hidden grid md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-linear-to-br from-indigo-700 via-blue-700 to-sky-600 text-white p-10 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl font-bold">Join Our Community</h2>
            <p className="text-lg opacity-90">
              Sign up and get started in minutes
            </p>
            <ul className="space-y-2 text-base opacity-90">
              <li>Secure OTP verification</li>
              <li>Personal data protection</li>
              <li>Instant activation</li>
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="px-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Fill in your details to get started
          </p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <Input
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                rules={{ required: "Full name is required" }}
              />

              {/* EMAIL + OTP */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  rules={{ required: "Email is required" }}
                />

                {!otpSent && (
                  <div className="flex items-center mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onSendOtp}
                      disabled={loading}
                      className="h-[38px] whitespace-nowrap"
                    >
                      Send OTP
                    </Button>
                  </div>
                )}
              </div>
              {/* OTP Verification Section */}
              {otpSent && (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <Input
                    name="otp"
                    label="OTP"
                    placeholder="Enter OTP"
                    type="tel"
                    rules={{ required: "OTP is required" }}
                  />

                  <div className="flex items-center mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      round="md"
                      onClick={onVerifyOtp}
                      disabled={otpVerified}
                      className="h-[38px] whitespace-nowrap"
                    >
                      {otpVerified ? "Verified" : "Verify"}
                    </Button>
                  </div>
                </div>
              )}

              {/* MOBILE + ROLL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  name="mobileNumber"
                  label="Mobile Number"
                  type="tel"
                  placeholder="9876543210"
                  rules={{ required: "Mobile number is required" }}
                />
                <Input
                  name="rollNumber"
                  label="Roll Number"
                  type="tel"
                  placeholder="2310110XXXX"
                  rules={{ required: "Roll number is required" }}
                />
              </div>

              <Input
                name="dob"
                label="Date of Birth"
                type="date"
                rules={{ required: "Date of Birth is required" }}
              />

              <Input
                name="password"
                label="Password"
                type="password"
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                }}
              />

              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                rules={{
                  required: "Confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                }}
              />

              <Button
                type="submit"
                className="w-full mt-3"
                disabled={loading || !isValid}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          </FormProvider>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
