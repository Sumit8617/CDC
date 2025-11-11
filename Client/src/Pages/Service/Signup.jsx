import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import { useNavigate } from "react-router-dom";

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
      rollNumber : "",
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

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    navigate("/");
    reset();
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-xl shadow-lg p-8 md:p-10 border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Your Account
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

              <Input
                name="otp"
                label="Verify OTP"
                type="number"
                placeholder="OTP"
                rules={{ required: "OTP is required" }}
              />

              <Input
                name="mobileNumber"
                label="Enter your Mobile Number"
                type="number"
                placeholder="Mobile"
                rules={{ required: "Mobile number is required" }}
              />

              <Input
                name="rollNumber"
                label="Enter your Roll Number"
                type="number"
                placeholder="Roll "
                rules={{ required: "Roll number is required" }}
              />

              <Input
                name="dob"
                label="Enter your Birth Date"
                type="date"
                placeholder="DOB"
                rules={{ required: "DOB number is required" }}
              />

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

            {/* Select for User Role */}
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

            <Button
              type="submit"
              variant="primary"
              size="md"
              round="md"
              className="w-full mt-6"
            >
              Sign Up
            </Button>
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
