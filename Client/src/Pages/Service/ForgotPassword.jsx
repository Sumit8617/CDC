import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Button, Input } from "../../Components/index";
import { Mail } from "lucide-react";
import { useForgotPassword } from "../../Hooks/ForgotPasswordHook";

const ForgotPassword = () => {
  const methods = useForm();
  const { handleSubmit } = methods;

  const { loading, success, error, handleSendEmail, clearState } =
    useForgotPassword();

  const [isSent, setIsSent] = useState(false);

  // Submit form → call Redux thunk
  const onSubmit = async (data) => {
    await handleSendEmail(data.email); // backend call
  };

  // When backend succeeds update UI
  useEffect(() => {
    if (success) {
      setIsSent(true);
    }
  }, [success]);

  // Cleanup slice on unmount
  useEffect(() => {
    return () => clearState();
  }, [clearState]);

  return (
    <>
      <title>CDC JGEC | Forgot Password</title>
      <meta name="description" content="Forgot password page for CDC JGEC" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-sm border border-gray-100 bg-white text-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Forgot Password
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your registered email address and we’ll send you instructions
            to reset your password.
          </p>

          {/* Form Section */}
          {!isSent ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      rules={{ required: "Email is required" }}
                      className="w-full pr-10"
                    />
                    <Mail
                      className="absolute right-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>

                  {/* REDUX ERROR MESSAGE */}
                  {error && (
                    <p className="text-red-500 text-sm mt-1 text-center">
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </FormProvider>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                A password reset link has been sent to your email.
              </div>

              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg"
                onClick={() => {
                  clearState();
                  setIsSent(false);
                }}
              >
                Resend Email
              </Button>
            </div>
          )}

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:underline font-medium"
              >
                Back to Login
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;
