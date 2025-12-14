import React, { useState } from "react";
import { Card, Button, Input } from "../../Components/index";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import useCreateContest from "../../Hooks/Admin/CreateContestHook";

const QUESTIONS_PER_PAGE = 1;

const CreateContest = () => {
  const methods = useForm({
    defaultValues: {
      contestName: "",
      description: "",
      duration: "",
      contestDate: "",
      contestTime: "",
      questions: [
        {
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
        },
      ],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(fields.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = fields.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const {
    createContest,
    saveDraftContest,
    loading,
    success,
    error,
    resetContestState,
  } = useCreateContest();

  // Format data for backend
  const formatContestData = (data) => {
    return {
      contestName: data.contestName,
      description: data.description,
      contestDate: data.contestDate,
      contestTime: data.contestTime,
      duration: Number(data.duration),
      questions: data.questions.map((q) => ({
        questionText: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctOption: ["A", "B", "C", "D"].indexOf(
          q.correctAnswer.toUpperCase()
        ),
      })),
    };
  };

  // Handle publish
  const handlePublish = (data) => {
    const payload = formatContestData(data);
    createContest(payload);
    if (!error) {
      reset();
      setCurrentPage(1);
    }
  };

  // Handle save draft
  const handleSaveDraft = (data) => {
    const payload = formatContestData(data);
    saveDraftContest(payload);
    if (!error) {
      reset();
      setCurrentPage(1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="min-h-screen flex flex-col space-y-6 md:pl-64">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New Contest
            </h1>
            <p className="text-gray-500 text-sm">
              Add contest details and questions for participants.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              round="md"
              onClick={handleSubmit(handleSaveDraft)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="indigo"
              size="md"
              round="md"
              onClick={handleSubmit(handlePublish)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Publish Contest
            </Button>
          </div>
        </div>

        {/* Contest Info Section */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Contest Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="contestName"
              label="Contest Name"
              placeholder="Enter contest title"
              rules={{ required: "Contest name is required" }}
            />
            <Input
              name="duration"
              label="Duration (in minutes)"
              type="tel"
              placeholder="e.g., 60"
              rules={{ required: "Duration is required" }}
            />
            <Input
              name="contestDate"
              label="Contest Date"
              type="date"
              rules={{ required: "Contest date is required" }}
            />
            <Input
              name="contestTime"
              label="Contest Start Time"
              type="time"
              rules={{ required: "Contest time is required" }}
            />
          </div>

          <Input
            name="description"
            label="Description"
            placeholder="Brief description of the contest"
            rules={{ required: "Description is required" }}
          />
        </Card>

        {/* Questions Section */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Contest Questions
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              round="md"
              onClick={() => {
                append({
                  question: "",
                  optionA: "",
                  optionB: "",
                  optionC: "",
                  optionD: "",
                  correctAnswer: "",
                });
                setCurrentPage(totalPages + 1);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>

          {currentQuestions.map((field, index) => {
            const actualIndex = startIndex + index;
            return (
              <Card
                key={field.id}
                className="p-5 mb-5 border border-gray-200 rounded-xl bg-gray-50 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-gray-700">
                    Question {actualIndex + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(actualIndex);
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <Input
                  name={`questions.${actualIndex}.question`}
                  label="Question"
                  placeholder="Enter the question text"
                  rules={{ required: "Question is required" }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name={`questions.${actualIndex}.optionA`}
                    label="Option A"
                    rules={{ required: "Option A is required" }}
                  />
                  <Input
                    name={`questions.${actualIndex}.optionB`}
                    label="Option B"
                    rules={{ required: "Option B is required" }}
                  />
                  <Input
                    name={`questions.${actualIndex}.optionC`}
                    label="Option C"
                    rules={{ required: "Option C is required" }}
                  />
                  <Input
                    name={`questions.${actualIndex}.optionD`}
                    label="Option D"
                    rules={{ required: "Option D is required" }}
                  />
                </div>
                <Input
                  name={`questions.${actualIndex}.correctAnswer`}
                  label="Correct Answer"
                  placeholder="A, B, C, or D"
                  rules={{ required: "Correct answer is required" }}
                />
              </Card>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>

        {/* API feedback */}
        {loading && <p>Processing contest...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">
            Contest {success === "draft" ? "saved as draft" : "published"}{" "}
            successfully!
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export default CreateContest;
