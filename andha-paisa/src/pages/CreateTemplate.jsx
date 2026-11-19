import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Upload, X, Copy, Send, Trash2, Edit } from "lucide-react";
import Header from "../components/static/header";
import Footer from "../components/static/footer";
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  clearError,
} from "../store/slices/templates-slice";
import {
  POSITIONS,
  POSITION_LABELS,
  extractVariables,
} from "../constants/positions";

const emptyForm = {
  name: "",
  position: "",
  recruiterEmail: "",
  subject: "",
  body: "",
  // NEW
  follow_up_1_subject: "",
  follow_up_1_body: "",
  follow_up_2_subject: "",
  follow_up_2_body: "",
};

export default function CreateTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates, isSaving, error } = useSelector((s) => s.template);

  const [form, setForm] = useState(emptyForm);
  const [resume, setResume] = useState(null);
  const [copyFrom, setCopyFrom] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // NEW: include variables from follow-ups so the user sees everything to fill
  const variables = useMemo(() => {
    const main = extractVariables(form.subject || "", form.body || "");
    const fu1 = extractVariables(
      form.follow_up_1_subject || "",
      form.follow_up_1_body || "",
    );
    const fu2 = extractVariables(
      form.follow_up_2_subject || "",
      form.follow_up_2_body || "",
    );
    return Array.from(new Set([...main, ...fu1, ...fu2]));
  }, [
    form.subject,
    form.body,
    form.follow_up_1_subject,
    form.follow_up_1_body,
    form.follow_up_2_subject,
    form.follow_up_2_body,
  ]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCopyFrom = (e) => {
    const id = e.target.value;
    setCopyFrom(id);
    if (!id) return;
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    setForm((prev) => ({
      ...prev,
      position: t.position,
      recruiterEmail: t.recruiter_email,
      subject: t.subject,
      body: t.body,
      // NEW
      follow_up_1_subject: t.follow_up_1_subject || "",
      follow_up_1_body: t.follow_up_1_body || "",
      follow_up_2_subject: t.follow_up_2_subject || "",
      follow_up_2_body: t.follow_up_2_body || "",
    }));
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      position: t.position,
      recruiterEmail: t.recruiter_email,
      subject: t.subject,
      body: t.body,
      // NEW
      follow_up_1_subject: t.follow_up_1_subject || "",
      follow_up_1_body: t.follow_up_1_body || "",
      follow_up_2_subject: t.follow_up_2_subject || "",
      follow_up_2_body: t.follow_up_2_body || "",
    });
    setResume(null);
    setSuccessMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setResume(null);
    setCopyFrom("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("position", form.position);
    fd.append("recruiterEmail", form.recruiterEmail);
    fd.append("subject", form.subject);
    fd.append("body", form.body);
    // NEW: always append — empty string becomes null server-side,
    // which lets users clear an existing follow-up on edit.
    fd.append("follow_up_1_subject", form.follow_up_1_subject || "");
    fd.append("follow_up_1_body", form.follow_up_1_body || "");
    fd.append("follow_up_2_subject", form.follow_up_2_subject || "");
    fd.append("follow_up_2_body", form.follow_up_2_body || "");
    if (resume) fd.append("resume", resume);

    if (editingId) {
      const res = await dispatch(
        updateTemplate({ id: editingId, formData: fd }),
      );
      if (updateTemplate.fulfilled.match(res)) {
        setSuccessMsg("Template updated successfully ✅");
        handleCancelEdit();
      }
    } else {
      const res = await dispatch(createTemplate(fd));
      if (createTemplate.fulfilled.match(res)) {
        setSuccessMsg("Template created successfully ✅");
        setForm(emptyForm);
        setResume(null);
        setCopyFrom("");
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this template?")) dispatch(deleteTemplate(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            {editingId ? "Edit Template" : "Create Template"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build a reusable email template. Use{" "}
            <code className="bg-slate-100 px-1 rounded">{"{variable}"}</code> in
            subject and body.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={() => dispatch(clearError())}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5"
        >
          {!editingId && (
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copy from existing template
              </label>
              <select
                value={copyFrom}
                onChange={handleCopyFrom}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">— Start from scratch —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({POSITION_LABELS[t.position]})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Template Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Backend Developer — Generic"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Position *
              </label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select position</option>
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Recruiter Email *
            </label>
            <input
              type="email"
              name="recruiterEmail"
              value={form.recruiterEmail}
              onChange={handleChange}
              required
              placeholder="hr@company.com"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Subject * (supports variables)
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Application for {position} — {name}"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email Template * (supports variables)
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows={10}
              placeholder={`Hi {recruiterName},\n\nI am {name}, a {position} developer with {experience} of experience...\n\nBest,\n{name}`}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* ============= NEW: FOLLOW-UP EMAILS ============= */}
          <div className="border-t border-slate-200 pt-6 mt-6 space-y-5">
            <div>
              <h3 className="text-lg font-medium text-slate-800">
                Follow-Up Emails
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                These are sent automatically if the recipient doesn&apos;t stop
                them. Leave blank to disable a follow-up.
              </p>
            </div>

            {/* Follow-up 1 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-700">
                Follow-Up 1{" "}
                <span className="text-slate-400 font-normal text-sm">
                  (sent after 2 days)
                </span>
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  name="follow_up_1_subject"
                  value={form.follow_up_1_subject}
                  onChange={handleChange}
                  placeholder="Re: Application for {position} — {name}"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Body
                </label>
                <textarea
                  name="follow_up_1_body"
                  value={form.follow_up_1_body}
                  onChange={handleChange}
                  rows={4}
                  placeholder={`Hi {recruiterName},\n\nJust following up on my application for {position}. Let me know if you need anything else.\n\nBest,\n{name}`}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>

            {/* Follow-up 2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-700">
                Follow-Up 2{" "}
                <span className="text-slate-400 font-normal text-sm">
                  (sent after 4 days)
                </span>
              </h4>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  name="follow_up_2_subject"
                  value={form.follow_up_2_subject}
                  onChange={handleChange}
                  placeholder="Final follow up: {position}"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Body
                </label>
                <textarea
                  name="follow_up_2_body"
                  value={form.follow_up_2_body}
                  onChange={handleChange}
                  rows={4}
                  placeholder={`Hi {recruiterName},\n\nI know you're busy — just wanted to leave this here in case you missed my previous emails.\n\nBest,\n{name}`}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>
          </div>

          {variables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">
                Detected variables (across all emails):
              </span>
              {variables.map((v) => (
                <span
                  key={v}
                  className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {`{${v}}`}
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Resume{" "}
              {editingId
                ? "(leave blank to keep current)"
                : "(PDF / DOC / DOCX)"}
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700">
                Choose file
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
              </label>
              {resume && (
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  {resume.name}
                  <button type="button" onClick={() => setResume(null)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-semibold hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-sm disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Update Template"
                  : "Create Template"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Templates list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Saved Templates
          </h2>

          {templates.length === 0 ? (
            <p className="text-sm text-slate-500">No templates yet.</p>
          ) : (
            <div className="grid gap-3">
              {templates.map((t) => {
                const fuCount =
                  (t.follow_up_1_body ? 1 : 0) + (t.follow_up_2_body ? 1 : 0);
                return (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-100 p-4 flex justify-between items-center hover:shadow-md transition"
                  >
                    <div>
                      <h3 className="font-medium text-slate-800">{t.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {POSITION_LABELS[t.position]} • {t.recruiter_email}
                      </p>
                      {fuCount > 0 && (
                        <span className="inline-block mt-2 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                          {fuCount} follow-up{fuCount > 1 ? "s" : ""} configured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/apply-jobs")}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 text-sm font-semibold hover:from-green-300 hover:to-green-500 transition active:scale-95"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
