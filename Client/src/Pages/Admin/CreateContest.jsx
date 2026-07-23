import React, { useState } from "react";
import { Card, Button, Input, Modal, FileUpload, ImageUpload } from "../../Components/index";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import useCreateContest from "../../Hooks/Admin/CreateContestHook";
import { useDispatch, useSelector } from "react-redux";
import { parseQuestionsFromFile, resetParserState } from "../../lib/Admin/QuestionParserSlice";

const QUESTIONS_PER_PAGE = 1;

const CreateContest = () => {
  const dispatch = useDispatch();

  // Parser state
  const { questions: extractedQuestions, loading: parserLoading, success: parserSuccess, error: parserError } = useSelector(
    (state) => state.questionParser
  );

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
          questionImage: null,
        },
      ],
    },
  });

  const { control, handleSubmit, reset, setValue, getValues } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
        questionImage: q.questionImage || null,
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

  // File upload handlers
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleExtractQuestions = async () => {
    if (!selectedFile) return;
    await dispatch(parseQuestionsFromFile(selectedFile));
  };

  const handleAddExtractedQuestions = () => {
    if (extractedQuestions && extractedQuestions.length > 0) {
      // Get current number of questions before adding
      const currentLength = fields.length;

      // Convert extracted questions to form format
      const newQuestions = extractedQuestions.map((q) => ({
        question: q.questionText || "",
        optionA: q.options?.[0] || "",
        optionB: q.options?.[1] || "",
        optionC: q.options?.[2] || "",
        optionD: q.options?.[3] || "",
        correctAnswer: ["A", "B", "C", "D"][q.correctOption] || "",
        questionImage: q.questionImage || null,
      }));

      // Append all extracted questions at once
      for (const q of newQuestions) {
        append(q);
      }

      // Close modal and reset state
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      dispatch(resetParserState());

      // Navigate to the first of the new questions
      setCurrentPage(currentLength + 1);
    }
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    dispatch(resetParserState());
    setSelectedFile(null);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    dispatch(resetParserState());
  };

  return (
    <>
      <title>CDC JGEC | Create Contest</title>
      <meta name="description" content="This is the create contest page" />
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  round="md"
                  onClick={openUploadModal}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload File
                </Button>
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
                      questionImage: null,
                    });
                    setCurrentPage(totalPages + 1);
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>
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

                  {/* Question Image Display */}
                  <div className="mb-4">
                    <ImageUpload
                      currentImage={getValues(`questions.${actualIndex}.questionImage`)}
                      onImageSelect={(image) => setValue(`questions.${actualIndex}.questionImage`, image)}
                      label="Question Image (Optional)"
                    />
                  </div>

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

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
          title="Upload Questions from File"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a Word file containing questions. The file should be
              formatted with numbered questions and A/B/C/D options.
            </p>

            <FileUpload
              onFileSelect={handleFileSelect}
              isLoading={parserLoading}
            />

            {parserError && (
              <p className="text-red-500 text-sm">{parserError}</p>
            )}

            {parserSuccess && extractedQuestions.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm font-medium">
                  ✓ Successfully extracted {extractedQuestions.length} questions!
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                round="md"
                onClick={closeUploadModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="indigo"
                size="md"
                round="md"
                onClick={handleExtractQuestions}
                disabled={!selectedFile || parserLoading}
                className="flex-1"
              >
                {parserLoading ? "Extracting..." : "Extract Questions"}
              </Button>
            </div>

            {parserSuccess && extractedQuestions.length > 0 && (
              <Button
                type="button"
                variant="success"
                size="md"
                round="md"
                onClick={handleAddExtractedQuestions}
                className="w-full"
              >
                Add {extractedQuestions.length} Questions to Contest
              </Button>
            )}
          </div>
        </Modal>
      </FormProvider>
    </>
  );
};

export default CreateContest;
