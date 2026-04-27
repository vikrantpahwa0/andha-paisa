import { useState, useEffect } from "react";

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  editingQuestion = null,
}) {
  const [questionForm, setQuestionForm] = useState({
    text: "",
    type: "input",
    options: [], // Each option will be { text: "", is_active: true }
  });
  const [newOption, setNewOption] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingOptionText, setEditingOptionText] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      // Convert options to objects with is_active if they're strings
      let options = editingQuestion.options || [];
      if (options.length > 0 && typeof options[0] === "string") {
        options = options.map((opt) => ({ text: opt, is_active: true }));
      }

      setQuestionForm({
        text: editingQuestion.text,
        type: editingQuestion.type,
        options: options,
      });
    } else {
      setQuestionForm({ text: "", type: "input", options: [] });
      setNewOption("");
    }
    setEditingOptionIndex(null);
    setEditingOptionText("");
  }, [editingQuestion, isOpen]);

  const addOption = () => {
    if (newOption.trim()) {
      setQuestionForm({
        ...questionForm,
        options: [
          ...questionForm.options,
          { text: newOption.trim(), is_active: true },
        ],
      });
      setNewOption("");
    }
  };

  const startEditOption = (index, option) => {
    setEditingOptionIndex(index);
    setEditingOptionText(option.text);
  };

  const saveEditOption = () => {
    if (editingOptionText.trim() && editingOptionIndex !== null) {
      const updatedOptions = [...questionForm.options];
      updatedOptions[editingOptionIndex] = {
        ...updatedOptions[editingOptionIndex],
        text: editingOptionText.trim(),
        is_active: true,
      };
      setQuestionForm({
        ...questionForm,
        options: updatedOptions,
      });
      setEditingOptionIndex(null);
      setEditingOptionText("");
    }
  };

  const cancelEditOption = () => {
    setEditingOptionIndex(null);
    setEditingOptionText("");
  };

  const deleteOption = (indexToDelete) => {
    const updatedOptions = [...questionForm.options];
    const optionToDelete = updatedOptions[indexToDelete];

    if (optionToDelete.id) {
      // Mark as inactive (soft delete)
      updatedOptions[indexToDelete] = {
        ...optionToDelete,
        is_active: false,
      };
    } else {
      // New option that hasn't been saved - remove completely
      updatedOptions.splice(indexToDelete, 1);
    }

    setQuestionForm({
      ...questionForm,
      options: updatedOptions,
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
              <option value="input">Text Input</option>
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

              {/* Options list with edit and soft delete */}
              {questionForm.options.filter((opt) => opt.is_active !== false)
                .length > 0 && (
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => {
                    if (option.is_active === false) return null;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                      >
                        {editingOptionIndex === index ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={editingOptionText}
                              onChange={(e) =>
                                setEditingOptionText(e.target.value)
                              }
                              className="flex-1 border border-gray-300 rounded-lg p-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              autoFocus
                              onKeyPress={(e) =>
                                e.key === "Enter" && saveEditOption()
                              }
                            />
                            <button
                              type="button"
                              onClick={saveEditOption}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditOption}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-slate-700 flex-1">
                              {option.text}
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => startEditOption(index, option)}
                                className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteOption(index)}
                                className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Show message if no active options */}
              {questionForm.options.filter((opt) => opt.is_active !== false)
                .length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-2">
                  No active options. Add some options above.
                </p>
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
