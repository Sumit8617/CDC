import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Input, Button } from "../../Components/index";
import { useAdminStats } from "../../Hooks/AdminStatsHook";
import { Save, Lock, UserCog } from "lucide-react";
import { PageLoaderWrapper } from "../../Components/Common/Pageloader";

const AdminSettings = () => {
  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { adminDetails, loading, error } = useAdminStats();
  const admin = adminDetails?.[0] || {};
  const [adminName, setAdminName] = useState(admin.fullName);
  const [adminMail, setAdminMail] = useState(admin.email);

  useEffect(() => {
    setAdminName(admin.fullName || "");
    setAdminMail(admin.email || "");
  }, [admin.fullName, admin.email]);

  const onSubmit = (data) => {
    console.log("Updated Admin Settings:", data);
    alert("Settings updated successfully!");
    reset(data);
  };

  const newPassword = watch("newPassword");

  return (
    <>
      {/* Page Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <PageLoaderWrapper loading={loading} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="p-8 text-center bg-red-50 border border-red-300 rounded-xl">
          <p className="text-red-600 font-semibold">
            {error || "Something went wrong."}
          </p>
        </Card>
      )}

      {/* Main Form */}
      {!loading && !error && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen flex flex-col gap-6 md:pl-64"
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Admin Settings
              </h1>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="indigo"
                size="md"
                round="md"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Profile Settings */}
            <Card
              className="p-6 border border-gray-500 rounded-2xl shadow-sm"
              variant="outlined"
            >
              <div className="flex items-center gap-3 mb-4">
                <UserCog className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Profile Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Full Name"
                  placeholder="Enter your name"
                  value={adminName}
                  rules={{ required: "Name is required" }}
                  readOnly
                />

                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  value={adminMail}
                  placeholder="Enter your email"
                  readOnly
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }}
                />
              </div>
            </Card>

            {/* Password Settings */}
            <Card
              className="p-6 bg-white border border-gray-500 rounded-2xl shadow-sm"
              variant="outlined"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Change Password
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  name="oldPassword"
                  type="password"
                  label="Old Password"
                  placeholder="Enter old password"
                  rules={{ required: "Old password is required" }}
                />
                <Input
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  rules={{
                    required: "Please confirm password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  }}
                />
              </div>
            </Card>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default AdminSettings;
