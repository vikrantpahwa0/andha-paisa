import { useState } from "react";
import AdminLayout from "../components/common/admin-app-layout";

export default function AdminSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [form, setForm] = useState({
    title: "",
    reward: "",
    link: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSurvey = {
      id: Date.now(),
      ...form,
    };

    setSurveys([newSurvey, ...surveys]);
    setForm({ title: "", reward: "", link: "" });
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CREATE FORM */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Create Survey
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Survey Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border p-2 rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Reward (₹)"
                value={form.reward}
                onChange={(e) => setForm({ ...form, reward: e.target.value })}
                className="w-full border p-2 rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Survey Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full border p-2 rounded-lg"
                required
              />

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                Create Survey
              </button>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Survey List
            </h3>

            <div className="space-y-3">
              {surveys.length === 0 && (
                <p className="text-sm text-gray-500">No surveys created yet</p>
              )}

              {surveys.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center border p-4 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-slate-800">{s.title}</h4>
                    <p className="text-sm text-gray-500">Reward: ₹{s.reward}</p>
                  </div>

                  <a
                    href={s.link}
                    target="_blank"
                    className="text-emerald-600 text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
