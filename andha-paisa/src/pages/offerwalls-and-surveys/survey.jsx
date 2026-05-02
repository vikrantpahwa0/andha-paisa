import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSurveyById, clearCurrentSurvey } from "../../store/slices/user-survey-slice";
import AppLayout from "../../components/common/app-layout";

export default function Survey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSurvey, isLoading, error } = useSelector((state) => state.userSurvey);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    dispatch(getSurveyById(id));
    
    return () => {
      dispatch(clearCurrentSurvey());
    };
  }, [dispatch, id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    // Submit answers - to be implemented
    console.log("Answers:", answers);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="text-center py-8">Loading survey...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!currentSurvey) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-green-600 mb-4 inline-block hover:text-green-700"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-slate-800">{currentSurvey.name}</h1>
          <p className="text-emerald-600 font-semibold mt-1">
            Reward: +{parseInt(currentSurvey.reward) * 10} Points
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentSurvey.questions?.map((question, index) => (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">
                {index + 1}. {question.question_text}
              </h3>

              {/* Input Type */}
              {question.question_type === "input" && (
                <input
                  type="text"
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Your answer"
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              )}

              {/* Email Type */}
              {question.question_type === "email" && (
                <input
                  type="email"
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="your@email.com"
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              )}

              {/* Mobile Type */}
              {question.question_type === "mobile" && (
                <input
                  type="tel"
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Your mobile number"
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              )}

              {/* With Options Type */}
              {question.question_type === "with_options" && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 max-w-md">
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option.id}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-slate-700">{option.option_text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 mb-12">
          <button
            onClick={handleSubmit}
            className="w-full max-w-md bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-semibold py-3 rounded-xl hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-md"
          >
            Submit Survey
          </button>
        </div>
      </div>
    </AppLayout>
  );
}