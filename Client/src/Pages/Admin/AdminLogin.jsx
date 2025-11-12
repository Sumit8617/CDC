import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Button, Input } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { loginAdmin } from "../../lib/AdminSlice";

const AdminLogin = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // === Login Handler ===
  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginAdmin(data)).unwrap();
      console.log("Admin login success:", res);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed:", err);
      alert(err.message || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* === Left Side (Info Panel) === */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">Admin Portal 🔐</h1>
        <p className="text-gray-300 text-center max-w-md">
          Manage contests, users, and analytics securely from your admin panel.
        </p>
        <img
          src="/assets/admin-login.svg"
          alt="Admin illustration"
          className="mt-8 w-4/5 max-w-md"
        />
      </div>

      {/* === Right Side (Login Form) === */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Admin Login
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <Input
                name="email"
                label="Admin Email"
                type="email"
                placeholder="Enter your admin email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                }}
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

              <div className="flex justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-4"
              >
                Login
              </Button>
            </form>
          </FormProvider>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Not an admin?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Go back to user login
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
