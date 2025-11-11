import React, { useState, useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "../../Components/index";

const questionsData = [
  { id: 1, question: "What is 2 + 2?", options: ["3", "4", "5", "6"] },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
  },
  {
    id: 3,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 4,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 5,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },

  {
    id: 6,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 7,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 8,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 9,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 10,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 11,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 12,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 13,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 14,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 15,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 16,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 17,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 18,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 19,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
  {
    id: 20,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
  },
];

// Reusable Custom Radio Component
const CustomRadio = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-center gap-2 border rounded-lg px-3 sm:px-4 py-2 text-left w-full transition text-sm sm:text-base ${
      checked
        ? "bg-blue-100 border-blue-500 text-blue-800"
        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
    }`}
  >
    {checked ? (
      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
    ) : (
      <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
    )}
    <span>{label}</span>
  </button>
);

// Question Card uses CustomRadio
const QuestionCard = ({ question, selectedOption, setSelectedOption }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full border-2 border-gray-200">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      {question.question}
    </h3>
    <div className="flex flex-col gap-3">
      {question.options.map((option, idx) => (
        <CustomRadio
          key={idx}
          label={option}
          checked={selectedOption[question.id] === option}
          onChange={() => setSelectedOption(question.id, option)}
        />
      ))}
    </div>
  </div>
);

const Contest = () => {
  const [selectedOption, setSelectedOptionState] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          alert("Time is up! Submitting your answers...");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const setSelectedOption = (questionId, option) => {
    setSelectedOptionState((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () =>
    currentQuestion < questionsData.length - 1 &&
    setCurrentQuestion(currentQuestion + 1);
  const handlePrevious = () =>
    currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1);

  const handleSubmit = () => {
    console.log("Selected Answers:", selectedOption);
    alert("Answers submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Topbar */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-40">
        <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-6">
          {/* Title */}
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 shrink">
            Contest NO. 1
          </h1>

          {/* Timer */}
          <div className="bg-gray-100 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base text-red-600 text-center shrink-0">
            Remaining Time {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sm:px-6 px-3">
        <div
          className="flex flex-col justify-center items-center"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            {/* Question Dashboard */}
            <div className="my-5 flex flex-wrap gap-1.5 sm:gap-2">
              {questionsData.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border text-xs sm:text-sm cursor-pointer transition-all duration-200
        ${
          currentQuestion === idx
            ? "bg-blue-500 border-blue-700 text-white" // Highlight current question
            : selectedOption[q.id]
              ? "bg-green-500 border-green-700 text-white" // Answered question
              : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200" // Default
        }
      `}
                >
                  {q.id}
                </div>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <QuestionCard
            question={questionsData[currentQuestion]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          {/* Pagination Buttons */}
          <div className="mt-4 sm:mt-6 flex justify-between w-full gap-2 sm:gap-0">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === questionsData.length - 1 ? (
              <Button variant="primary" onClick={handleSubmit}>
                Submit Answers
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
