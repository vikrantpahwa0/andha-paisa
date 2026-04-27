import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../components/common/admin-app-layout";
import QuestionModal from "../components/surveys/question-modal";
import {
  createUpdateSurvey,
  getSurveysList,
  clearError,
  clearSuccessMessage,
} from "../store/slices/survey-slice";

export default function AdminSurveys() {
  const dispatch = useDispatch();
  const { surveys, isLoading, error, successMessage } = useSelector(
    (state) => state.survey,
  );

  const [form, setForm] = useState({
    name: "",
    reward: "",
  });
  const [questions, setQuestions] = useState([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [openSurveyId, setOpenSurveyId] = useState(null);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch surveys on component mount
  useEffect(() => {
    dispatch(getSurveysList());
  }, [dispatch]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const toggleSurvey = (surveyId) => {
    setOpenSurveyId(openSurveyId === surveyId ? null : surveyId);
  };

  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey);
    setForm({
      name: survey.name,
      reward: survey.reward,
    });
    // Transform API questions format to component format
    const transformedQuestions = survey.questions.map((q) => ({
      id: q.id,
      text: q.question_text,
      type: q.question_type,
      options: q.options.map((opt) => opt.option_text),
      is_active: q.is_active,
    }));
    setQuestions(transformedQuestions);
    setIsEditMode(true);
    document
      .getElementById("survey-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteSurvey = async (surveyId, surveyName) => {
    if (window.confirm(`Are you sure you want to delete "${surveyName}"?`)) {
      // Call the same API with is_active: false
      const deleteData = {
        surveyBasicInfo: {
          id: surveyId,
          is_active: false,
        },
        questions: [],
      };

      try {
        const result = await dispatch(createUpdateSurvey(deleteData)).unwrap();

        if (result?.success && result?.data?.surveyId) {
          await dispatch(getSurveysList());
          alert(`Survey "${surveyName}" deleted successfully!`);
        } else {
          alert("Failed to delete survey");
        }
      } catch (error) {
        console.error("Error deleting survey:", error);
        alert(error || "Failed to delete survey");
      }
    }
  };

  const cancelEdit = () => {
    setEditingSurvey(null);
    setForm({ name: "", reward: "" });
    setQuestions([]);
    setIsEditMode(false);
  };

  const openQuestionModal = (question = null, index = null) => {
    setEditingQuestion(question);
    setEditingQuestionIndex(index);
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
  };

  const saveQuestion = (questionData) => {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {
        ...questionData,
        id: editingQuestion?.id,
        is_active: true,
      };
      setQuestions(updatedQuestions);
    } else {
      const newQuestion = {
        ...questionData,
        is_active: true,
      };
      setQuestions([...questions, newQuestion]);
    }
    closeQuestionModal();
  };

  const deleteQuestion = (indexToDelete) => {
    const updatedQuestions = [...questions];
    const questionToDelete = updatedQuestions[indexToDelete];

    if (questionToDelete.id) {
      // Mark as inactive (soft delete)
      updatedQuestions[indexToDelete] = {
        ...questionToDelete,
        is_active: false,
      };
    } else {
      // New question that hasn't been saved - remove completely
      updatedQuestions.splice(indexToDelete, 1);
    }

    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeQuestions = questions.filter((q) => q.is_active !== false);

    if (activeQuestions.length === 0) {
      alert("Please add at least one question to the survey");
      return;
    }

    // Format questions for API
    const formattedQuestions = questions.map((q) => {
      const questionObj = {
        question_text: q.text,
        question_type: q.type,
        is_active: q.is_active !== undefined ? q.is_active : true,
      };

      if (q.id) {
        questionObj.id = q.id;
      }

      if (q.type === "with_options" && q.options) {
        questionObj.options = q.options.map((opt) => ({
          option_text: opt,
          is_active: true,
        }));
      }

      return questionObj;
    });

    // Prepare request data
    const requestData = {
      surveyBasicInfo: {
        name: form.name,
        reward: form.reward,
        is_active: true,
      },
      questions: formattedQuestions,
    };

    if (isEditMode && editingSurvey) {
      requestData.surveyBasicInfo.id = editingSurvey.id;
    }

    try {
      const result = await dispatch(createUpdateSurvey(requestData)).unwrap();

      // Check for success using the response structure
      if (result?.success && result?.data?.surveyId) {
        // Refresh the surveys list
        await dispatch(getSurveysList());
        alert(
          result.message ||
            (isEditMode
              ? "Survey updated successfully!"
              : "Survey created successfully!"),
        );
        cancelEdit();
      } else {
        alert("Failed to save survey");
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      alert(error || "Failed to save survey");
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      input: "Text Input",
      email: "Email",
      mobile: "Mobile Number",
      with_options: "Multiple Choice",
    };
    return types[type] || type;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Manage Surveys
        </h1>
        <p className="text-sm text-gray-500">
          Create and manage survey offers for users
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CREATE/EDIT FORM */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-5 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              {isEditMode ? "Edit Survey" : "Create New Survey"}
            </h3>

            <form
              id="survey-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Survey Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter survey name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reward Amount (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Enter reward amount"
                  value={form.reward}
                  onChange={(e) => setForm({ ...form, reward: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Questions Section */}
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Survey Questions *
                  </label>
                  <button
                    type="button"
                    onClick={() => openQuestionModal()}
                    className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition"
                  >
                    + Add Question
                  </button>
                </div>

                {/* Questions List */}
                {questions.filter((q) => q.is_active !== false).length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-4">
                    No questions added yet. Click "Add Question" to start.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {questions.map((question, idx) => {
                      if (question.is_active === false) return null;
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-slate-600">
                                  Q{idx + 1}.
                                </span>
                                <span className="text-sm font-medium text-slate-800">
                                  {question.text}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-slate-600">
                                  {getQuestionTypeLabel(question.type)}
                                </span>
                              </div>

                              {question.type === "with_options" &&
                                question.options.length > 0 && (
                                  <div className="mt-2 ml-6">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Options:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                      {question.options.map(
                                        (option, optIdx) => (
                                          <li key={optIdx}>{option}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-2">
                              <button
                                type="button"
                                onClick={() => openQuestionModal(question, idx)}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteQuestion(idx)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {questions.filter((q) => q.is_active !== false).length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Total questions:{" "}
                    {questions.filter((q) => q.is_active !== false).length}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                      ? "Update Survey"
                      : "Create Survey"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition mt-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST - Existing Surveys with Dropdown */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Existing Surveys
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading && surveys.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Loading surveys...
                </p>
              )}

              {!isLoading && surveys.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No surveys created yet. Create your first survey!
                </p>
              )}

              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
                >
                  {/* Survey Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleSurvey(survey.id)}
                        className="flex-1 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:text-gray-600 ${
                              openSurveyId === survey.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <h4 className="font-semibold text-slate-800 text-lg">
                            {survey.name}
                          </h4>
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            {survey.questions.length} questions
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 ml-7">
                          <p className="text-sm text-emerald-600 font-medium">
                            ₹{survey.reward}
                          </p>
                          <p className="text-xs text-gray-400">
                            Code: {survey.code}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(survey.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </button>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditSurvey(survey)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit Survey"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSurvey(survey.id, survey.name)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Survey"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Questions List - Collapsible */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openSurveyId === survey.id ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="p-4 border-t bg-gray-50">
                      <h5 className="text-sm font-medium text-slate-600 mb-3">
                        Questions:
                      </h5>
                      {survey.questions.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">
                          No questions in this survey
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {survey.questions.map((question, idx) => (
                            <div
                              key={question.id}
                              className="bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-slate-500 mt-0.5">
                                  {idx + 1}.
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm text-slate-700">
                                      {question.question_text}
                                    </p>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-slate-600">
                                      {getQuestionTypeLabel(
                                        question.question_type,
                                      )}
                                    </span>
                                  </div>
                                  {question.question_type === "with_options" &&
                                    question.options.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">
                                          Options:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {question.options.map(
                                            (opt, optIdx) => (
                                              <span
                                                key={optIdx}
                                                className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600"
                                              >
                                                {opt.option_text}
                                              </span>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={closeQuestionModal}
        onSave={saveQuestion}
        editingQuestion={editingQuestion}
      />
    </AdminLayout>
  );
}
