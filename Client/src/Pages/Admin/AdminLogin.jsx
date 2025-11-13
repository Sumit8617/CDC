import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Card, Button, Input } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { loginAdmin } from "../../lib/AdminSlice";

const AdminLogin = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      mobileNumber: "",
    },
  });

  const { handleSubmit } = methods;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ State for show/hide password
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 border-2 w-full">
      {/* === Login Form === */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
        {/* Card with background image */}
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 bg-[url('/')] bg-cover bg-center bg-no-repeat relative overflow-hidden rounded-xl">
          {/* Optional overlay for readability */}
          <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-ubuntu font-semibold text-gray-800 mb-8 text-center">
              Admin Login
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
                  className="border-2 border-black text-black"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                />

                {/* Mobile Number */}
                <Input
                  name="mobileNumber"
                  type="tel"
                  placeholder="Enter your Mobile Number"
                  rules={{
                    required: "Mobile Number is required",
                    maxLength: {
                      value: 10,
                      message: "Mobile Number must be 10 digits long",
                    },
                  }}
                />

                {/* Password with show/hide toggle */}
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="border-2 border-black text-black pr-10
      [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
      [appearance:textfield]"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end text-sm">
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
