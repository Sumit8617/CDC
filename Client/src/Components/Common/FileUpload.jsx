import React, { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import Button from "./Button";

const FileUpload = ({ onFileSelect, isLoading, accept = ".docx,.doc" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const allowedExtensions = [".docx", ".doc"];

    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return "Invalid file type. Please upload a Word file (.docx or .doc).";
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return "File too large. Maximum size is 10MB.";
    }

    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError("");

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError("");

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : error
            ? "border-red-300 bg-red-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={isLoading}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`p-4 rounded-full ${
                dragActive ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`w-8 h-8 ${
                  dragActive ? "text-indigo-600" : "text-gray-500"
                }`}
              />
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                {dragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or{" "}
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                  disabled={isLoading}
                >
                  browse
                </button>{" "}
                to choose
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supports DOCX, DOC (max 10MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-700 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message when file is selected */}
      {selectedFile && !error && (
        <div className="mt-3 flex items-center space-x-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>File selected - click "Extract Questions" to continue</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
