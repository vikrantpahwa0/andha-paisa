import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../components/common/admin-app-layout";
import QuestionModal from "../components/surveys/question-modal";
import {
  createUpdateSurvey,
  clearError,
  clearSuccessMessage,
} from "../store/slices/survey-slice";

export default function AdminSurveys() {
  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector(
    (state) => state.survey,
  );

  const [surveys, setSurveys] = useState([]);
  const [form, setForm] = useState({
    name: "",
    reward: "",
  });
  const [questions, setQuestions] = useState([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

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
        id: Date.now(),
      };
      setQuestions(updatedQuestions);
    } else {
      const newQuestion = {
        id: Date.now(),
        ...questionData,
      };
      setQuestions([...questions, newQuestion]);
    }
    closeQuestionModal();
  };

  const deleteQuestion = (indexToDelete) => {
    setQuestions(questions.filter((_, index) => index !== indexToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      alert("Please add at least one question to the survey");
      return;
    }

    // Format questions for API
    const formattedQuestions = questions.map((q) => ({
      question_text: q.text,
      question_type: q.type,
      is_active: true,
      ...(q.type === "with_options" && {
        options: q.options.map((opt) => ({
          option_text: opt,
          is_active: true,
        })),
      }),
    }));

    const result = await dispatch(
      createUpdateSurvey({
        surveyBasicInfo: {
          name: form.name,
          reward: form.reward,
          is_active: true,
        },
        questions: formattedQuestions,
        surveyId: null,
      }),
    );

    if (result.payload?.success) {
      // Add to local list
      const newSurvey = {
        id: result.payload.surveyId,
        name: form.name,
        reward: form.reward,
        questions: questions,
        createdAt: new Date().toISOString(),
      };
      setSurveys([newSurvey, ...surveys]);

      // Reset form
      setForm({ name: "", reward: "" });
      setQuestions([]);
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      input: "Text Input", // Changed from "text" to "input"
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
        {/* CREATE FORM */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Create New Survey
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {questions.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-4">
                    No questions added yet. Click "Add Question" to start.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {questions.map((question, idx) => (
                      <div
                        key={question.id || idx}
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
                                    {question.options.map((option, optIdx) => (
                                      <li key={optIdx}>{option}</li>
                                    ))}
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
                    ))}
                  </div>
                )}

                {questions.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Total questions: {questions.length}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Survey"}
              </button>
            </form>
          </div>
        </div>

        {/* LIST - Existing Surveys */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Existing Surveys
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {surveys.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No surveys created yet. Create your first survey!
                </p>
              )}

              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">
                        {survey.name}
                      </h4>
                      <p className="text-sm text-emerald-600 font-medium mt-1">
                        Reward: ₹{survey.reward}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created:{" "}
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <h5 className="text-sm font-medium text-slate-600 mb-3">
                      Questions ({survey.questions.length}):
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
                            className="bg-gray-50 p-2 rounded"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium text-slate-500 mt-0.5">
                                {idx + 1}.
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-slate-700">
                                  {question.text}
                                </p>
                                <span className="text-xs text-gray-400">
                                  Type: {getQuestionTypeLabel(question.type)}
                                </span>
                                {question.type === "with_options" &&
                                  question.options.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-xs text-gray-500">
                                        Options: {question.options.join(", ")}
                                      </p>
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
