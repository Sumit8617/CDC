import React, { useState } from "react";
import { Card, Button, Input } from "../../Components/index";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";

const CreateContest = () => {
  const methods = useForm({
    defaultValues: {
      contestName: "",
      description: "",
      duration: "",
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

  const onSubmit = (data) => {
    console.log("Contest Created:", data);
    alert("✅ Contest created successfully!");
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen flex flex-col space-y-6 md:pl-64"
      >
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
          <Button
            type="submit"
            variant="indigo"
            size="md"
            round="md"
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Publish Contest
          </Button>
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
              placeholder="e.g., 60"
              type="number"
              rules={{ required: "Duration is required" }}
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
              className="flex items-center gap-2"
              onClick={() =>
                append({
                  question: "",
                  optionA: "",
                  optionB: "",
                  optionC: "",
                  optionD: "",
                  correctAnswer: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="p-5 mb-5 border border-gray-200 rounded-xl bg-gray-50 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-700">
                  Question {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <Input
                name={`questions.${index}.question`}
                label="Question"
                placeholder="Enter the question text"
                rules={{ required: "Question is required" }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name={`questions.${index}.optionA`}
                  label="Option A"
                  placeholder="Enter option A"
                  rules={{ required: "Option A is required" }}
                />
                <Input
                  name={`questions.${index}.optionB`}
                  label="Option B"
                  placeholder="Enter option B"
                  rules={{ required: "Option B is required" }}
                />
                <Input
                  name={`questions.${index}.optionC`}
                  label="Option C"
                  placeholder="Enter option C"
                  rules={{ required: "Option C is required" }}
                />
                <Input
                  name={`questions.${index}.optionD`}
                  label="Option D"
                  placeholder="Enter option D"
                  rules={{ required: "Option D is required" }}
                />
              </div>

              <Input
                name={`questions.${index}.correctAnswer`}
                label="Correct Answer"
                placeholder="Enter correct option (A, B, C, or D)"
                rules={{ required: "Correct answer is required" }}
              />
            </Card>
          ))}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="indigo"
            size="md"
            round="md"
            className="px-6"
          >
            Save Contest
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateContest;
