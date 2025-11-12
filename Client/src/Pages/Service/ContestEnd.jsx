import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../Components/index";

const ContestEnd = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // get reason from query string (e.g. /contest-ended?reason=fullscreen)
  const params = new URLSearchParams(location.search);
  const reason = params.get("reason");

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contest Ended</h1>
        <p className="text-gray-600 mb-6">
          {reason
            ? `Your contest ended because: ${reason}.`
            : "Your contest session has ended successfully."}
        </p>

        <Button
          variant="primary"
          onClick={handleGoHome}
          className="mt-4 w-full"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default ContestEnd;
