import { useState, useEffect } from "react";

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  editingQuestion = null,
}) {
  const [questionForm, setQuestionForm] = useState({
    text: "",
    type: "input", // Changed from "text" to "input"
    options: [],
  });
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setQuestionForm({
        text: editingQuestion.text,
        type: editingQuestion.type,
        options: editingQuestion.options || [],
      });
    } else {
      setQuestionForm({ text: "", type: "input", options: [] }); // Changed from "text" to "input"
      setNewOption("");
    }
  }, [editingQuestion, isOpen]);

  const addOption = () => {
    if (newOption.trim()) {
      setQuestionForm({
        ...questionForm,
        options: [...questionForm.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (indexToRemove) => {
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  const handleSave = () => {
    if (!questionForm.text.trim()) return;
    onSave(questionForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-800">
              {editingQuestion ? "Edit Question" : "Add Question"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={questionForm.text}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, text: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows="3"
              placeholder="Enter your question here..."
              required
            />
          </div>

          {/* Question Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question Type *
            </label>
            <select
              value={questionForm.type}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  type: e.target.value,
                  options: [],
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="input">Text Input</option>{" "}
              {/* Changed value to "input" */}
              <option value="email">Email</option>
              <option value="mobile">Mobile Number</option>
              <option value="with_options">
                With Options (Multiple Choice)
              </option>
            </select>
          </div>

          {/* Options Section (only for with_options type) */}
          {questionForm.type === "with_options" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Options
              </label>

              {/* Add new option */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                  placeholder="Enter an option"
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                >
                  Add
                </button>
              </div>

              {/* Options list */}
              {questionForm.options.length > 0 && (
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                    >
                      <span className="text-sm text-slate-700">{option}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              {editingQuestion ? "Update" : "Add"} Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
