import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, PageLoaderWrapper } from "../../Components/index";
import { useContestDetails } from "../../Hooks/TestDetailsHook";

const QuestionCard = ({ question, selectedOption, setSelectedOption }) => (
  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow w-full max-w-3xl border-2 border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      {question.questionText}
    </h3>
    <div className="flex flex-col gap-3">
      {question.options.map((opt, idx) => {
        let style = "bg-gray-50 border-gray-300 hover:bg-gray-100";
        if (idx === question.correctOption)
          style = "bg-green-100 border-green-500 text-green-800";
        if (
          selectedOption[question._id] === idx &&
          idx !== question.correctOption
        )
          style = "bg-red-100 border-red-500 text-red-800";

        return (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedOption(question._id, idx)}
            className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-left w-full transition text-sm ${style}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

const PreviousQuestions = () => {
  const { id: contestId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOptionState] = useState({});

  const {
    questions = [],
    loading,
    error,
    getPreviousQuestions,
  } = useContestDetails();

  const setSelectedOption = (questionId, optionIndex) => {
    setSelectedOptionState((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  useEffect(() => {
    if (contestId) {
      getPreviousQuestions(contestId);
    }
  }, [contestId]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  if (loading)
    return (
      <div>
        {" "}
        <PageLoaderWrapper loading={loading} />{" "}
      </div>
    );
  if (error)
    return (
      <p className="pt-24 px-4 md:pl-64 text-2xl font-bold text-center">
        <span className="text-red-500">ERROR :</span> {error}
      </p>
    );
  if (!questions.length)
    return <p className="pt-24 px-4">No questions found</p>;

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64 pb-16">
      {/* Topbar */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-3 px-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Previous Contest Questions
          </h1>
        </div>
      </div>

      {/* Question navigation dots */}
      <div className="flex justify-center flex-wrap gap-2 mt-24 px-4">
        {questions.map((q, idx) => (
          <div
            key={q._id}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs cursor-pointer transition-all duration-200
              ${
                currentQuestion === idx
                  ? "bg-blue-500 border-blue-700 text-white"
                  : selectedOption[q._id] !== undefined
                    ? "bg-green-500 border-green-700 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="pt-6 px-4 sm:px-6 md:px-8 flex flex-col items-center gap-6">
        {questions[currentQuestion] && (
          <QuestionCard
            question={questions[currentQuestion]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full max-w-3xl gap-2">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviousQuestions;
