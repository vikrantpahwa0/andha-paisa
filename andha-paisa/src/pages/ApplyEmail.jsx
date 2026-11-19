import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Plus,
  X,
  Mail,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  Paperclip,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Header from "../components/static/header";
import Footer from "../components/static/footer";
import { fetchTemplates } from "../store/slices/templates-slice";
import {
  sendApplication,
  fetchApplications,
  toggleFollowUp,
  clearError,
  clearLastSent,
} from "../store/slices/applications-slice";
import { POSITION_LABELS, extractVariables } from "../constants/positions";

export default function ApplyEmail() {
  const dispatch = useDispatch();
  const { templates } = useSelector((s) => s.template);
  const { applications, isLoading, isSending, isToggling, error, lastSent } =
    useSelector((s) => s.application);

  const [templateId, setTemplateId] = useState("");
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [variables, setVariables] = useState({});
  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");

  // State for the popup modal
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchApplications());
  }, [dispatch]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedApp(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) || null,
    [templates, templateId],
  );

  const detectedVars = useMemo(() => {
    if (!selectedTemplate) return [];
    const main = extractVariables(
      selectedTemplate.subject || "",
      selectedTemplate.body || "",
    );
    const fu1 = extractVariables(
      selectedTemplate.follow_up_1_subject || "",
      selectedTemplate.follow_up_1_body || "",
    );
    const fu2 = extractVariables(
      selectedTemplate.follow_up_2_subject || "",
      selectedTemplate.follow_up_2_body || "",
    );
    return Array.from(new Set([...main, ...fu1, ...fu2]));
  }, [selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) return;
    setVariables((prev) => {
      const next = {};
      detectedVars.forEach((v) => {
        next[v] = prev[v] ?? "";
      });
      return next;
    });
    setCustomSubject("");
  }, [selectedTemplate, detectedVars]);

  const addEmail = () => {
    const value = emailInput.trim().toLowerCase();
    if (!value || emails.includes(value)) return;
    setEmails((prev) => [...prev, value]);
    setEmailInput("");
  };

  const removeEmail = (email) =>
    setEmails((prev) => prev.filter((e) => e !== email));

  const addCustomVariable = () => {
    if (!customKey.trim()) return;
    setVariables((prev) => ({ ...prev, [customKey.trim()]: customValue }));
    setCustomKey("");
    setCustomValue("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    let finalEmails = [...emails];
    const pendingEmail = emailInput.trim().toLowerCase();
    if (pendingEmail && !finalEmails.includes(pendingEmail)) {
      finalEmails.push(pendingEmail);
    }

    if (!templateId || finalEmails.length === 0) return;

    dispatch(clearLastSent());
    await dispatch(
      sendApplication({
        templateId,
        toEmails: finalEmails,
        customSubject: customSubject || undefined,
        variables,
      }),
    );

    if (pendingEmail) setEmailInput("");
    setEmails([]);
    setCustomSubject("");
    setVariables({});
  };

  const handleToggleFollowUp = async (id) => {
    await dispatch(toggleFollowUp(id));
  };

  const renderPreview = (text) => {
    if (!text) return "";
    return text.replace(
      /\{+\s*([a-zA-Z_][a-zA-Z0-9_.-]*)\s*\}+/g,
      (match, key) => {
        return variables[key] || match;
      },
    );
  };

  const pendingEmailValue = emailInput.trim().toLowerCase();
  const totalRecipients =
    emails.length +
    (pendingEmailValue && !emails.includes(pendingEmailValue) ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Apply</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pick a template, add recipients, fill variables and send.
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

        {lastSent && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3">
            ✅ Sent to {lastSent.sentCount} recipient(s)
            {lastSent.failedCount > 0 && ` • ${lastSent.failedCount} failed`}
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">
              Select Template *
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="">Select a template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {POSITION_LABELS[t.position]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Recipient Emails *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onBlur={addEmail}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                placeholder="hr@company.com"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {emails.map((em) => (
                  <span
                    key={em}
                    className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    {em}
                    <button type="button" onClick={() => removeEmail(em)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Custom Subject <span className="text-slate-400">(optional)</span>
            </label>
            <input
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder={
                selectedTemplate
                  ? selectedTemplate.subject
                  : "Application for {position}"
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {selectedTemplate && detectedVars.length > 0 && (
            <div>
              <label className="text-sm font-medium text-slate-700">
                Variables
              </label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {detectedVars.map((v) => (
                  <div key={v}>
                    <span className="text-xs text-slate-500">{`{${v}}`}</span>
                    <input
                      value={variables[v] || ""}
                      onChange={(e) =>
                        setVariables((prev) => ({
                          ...prev,
                          [v]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Add custom variable
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="variableName"
                className="w-40 rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="value"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="button"
                onClick={addCustomVariable}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {selectedTemplate && (
            <div className="bg-slate-50 rounded-xl p-1 border border-slate-200">
              <div className="bg-white rounded-lg p-5 space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Eye className="w-5 h-5 text-emerald-600" /> Final Review
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                      Template
                    </span>
                    <span className="font-medium text-slate-800">
                      {selectedTemplate.name} (
                      {POSITION_LABELS[selectedTemplate.position]})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                      Recipients ({totalRecipients})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {emails.map((e) => (
                        <span
                          key={e}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs"
                        >
                          {e}
                        </span>
                      ))}
                      {pendingEmailValue &&
                        !emails.includes(pendingEmailValue) && (
                          <span
                            className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs border border-yellow-200 border-dashed"
                            title="Will be added on send"
                          >
                            {pendingEmailValue} (pending)
                          </span>
                        )}
                      {totalRecipients === 0 && (
                        <span className="text-red-500 text-xs italic">
                          No recipients added yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                      Subject
                    </span>
                    <span className="font-medium text-emerald-700">
                      {renderPreview(customSubject || selectedTemplate.subject)}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                      Attachment
                    </span>
                    {selectedTemplate.resume_original_name ? (
                      <span className="font-medium text-blue-600 flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4" />{" "}
                        {selectedTemplate.resume_original_name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">
                        No resume attached to this template
                      </span>
                    )}
                  </div>
                </div>

                {/* ============ EMAIL BODY + FOLLOW-UP PREVIEWS ============ */}
                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-slate-500 block mb-2 text-xs uppercase tracking-wider font-semibold">
                      Email Body
                    </span>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                      {renderPreview(selectedTemplate.body)}
                    </div>
                  </div>

                  {(selectedTemplate.follow_up_1_body ||
                    selectedTemplate.follow_up_2_body) && (
                    <div>
                      <span className="text-slate-500 block mb-2 text-xs uppercase tracking-wider font-semibold">
                        Follow-Up Emails{" "}
                        <span className="text-emerald-600 normal-case tracking-normal font-normal">
                          (sent automatically)
                        </span>
                      </span>

                      <div className="space-y-2">
                        {/* ---------------- FU1 ---------------- */}
                        {selectedTemplate.follow_up_1_body && (
                          <details
                            open
                            className="bg-slate-50 rounded-lg border border-slate-100 group"
                          >
                            <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">
                              <span className="flex items-center gap-2">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                                  Day 2
                                </span>
                                Follow-Up 1
                              </span>
                              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-slate-200">
                              <div>
                                <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                                  Subject
                                </span>
                                {selectedTemplate.follow_up_1_subject ? (
                                  <div className="text-emerald-700 font-medium text-sm">
                                    {renderPreview(
                                      selectedTemplate.follow_up_1_subject,
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-slate-400 italic text-sm">
                                    (no subject set — email will be sent without
                                    a subject line)
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                                  Body
                                </span>
                                <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                                  {renderPreview(
                                    selectedTemplate.follow_up_1_body,
                                  )}
                                </div>
                              </div>
                            </div>
                          </details>
                        )}

                        {/* ---------------- FU2 ---------------- */}
                        {selectedTemplate.follow_up_2_body && (
                          <details
                            open
                            className="bg-slate-50 rounded-lg border border-slate-100 group"
                          >
                            <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">
                              <span className="flex items-center gap-2">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                                  Day 4
                                </span>
                                Follow-Up 2
                              </span>
                              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-slate-200">
                              <div>
                                <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                                  Subject
                                </span>
                                {selectedTemplate.follow_up_2_subject ? (
                                  <div className="text-emerald-700 font-medium text-sm">
                                    {renderPreview(
                                      selectedTemplate.follow_up_2_subject,
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-slate-400 italic text-sm">
                                    (no subject set — email will be sent without
                                    a subject line)
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                                  Body
                                </span>
                                <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                                  {renderPreview(
                                    selectedTemplate.follow_up_2_body,
                                  )}
                                </div>
                              </div>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSending || !templateId || totalRecipients === 0}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-bold text-lg hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-sm disabled:opacity-60 flex justify-center items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {isSending ? "Sending..." : `Send Application`}
          </button>
        </form>

        {/* ================= HISTORY TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
            <History className="w-4 h-4" /> Application History
          </h2>

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading history...</p>
          ) : applications.length === 0 ? (
            <p className="text-sm text-slate-500">No applications sent yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Date</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Recipients</th>
                    <th className="px-4 py-3">Follow-Ups</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Stop FU</th>
                    <th className="px-4 py-3 rounded-tr-xl text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {app.template?.position
                          ? POSITION_LABELS[app.template.position]
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {app.template?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                          {app.to_emails?.length || 0} recipient(s)
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1 text-xs">
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              app.follow_up_1_sent_at
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                            title={
                              app.follow_up_1_sent_at
                                ? `Sent ${new Date(app.follow_up_1_sent_at).toLocaleString()}`
                                : "Pending"
                            }
                          >
                            FU1
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              app.follow_up_2_sent_at
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                            title={
                              app.follow_up_2_sent_at
                                ? `Sent ${new Date(app.follow_up_2_sent_at).toLocaleString()}`
                                : "Pending"
                            }
                          >
                            FU2
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {app.status === "SENT" ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Sent
                          </span>
                        ) : app.status === "PARTIAL" ? (
                          <span className="flex items-center gap-1 text-yellow-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Partial
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <XCircle className="w-4 h-4" /> Failed
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <label
                          className={`flex items-center gap-2 ${
                            isToggling
                              ? "cursor-wait opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={!!app.stop_follow_up}
                              disabled={isToggling}
                              onChange={() => handleToggleFollowUp(app.id)}
                            />
                            <div
                              className={`block w-10 h-6 rounded-full transition-colors ${
                                app.stop_follow_up
                                  ? "bg-red-400"
                                  : "bg-slate-300"
                              }`}
                            />
                            <div
                              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                app.stop_follow_up
                                  ? "transform translate-x-4"
                                  : ""
                              }`}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {app.stop_follow_up ? "Stopped" : "Active"}
                          </span>
                        </label>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ================= POPUP MODAL ================= */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Application Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sent on {new Date(selectedApp.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Template & Position
                  </span>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedApp.template?.name}
                    <span className="text-slate-500 text-sm ml-2">
                      (
                      {POSITION_LABELS[selectedApp.template?.position] || "N/A"}
                      )
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </span>
                  <p className="mt-1">
                    {selectedApp.status === "SENT" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Successfully Sent
                      </span>
                    ) : selectedApp.status === "PARTIAL" ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Partially Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                        <XCircle className="w-4 h-4" /> Failed
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Follow-Up Tracking
                </span>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      selectedApp.follow_up_1_sent_at
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    FU1:{" "}
                    {selectedApp.follow_up_1_sent_at
                      ? `Sent ${new Date(
                          selectedApp.follow_up_1_sent_at,
                        ).toLocaleString()}`
                      : "Pending"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      selectedApp.follow_up_2_sent_at
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    FU2:{" "}
                    {selectedApp.follow_up_2_sent_at
                      ? `Sent ${new Date(
                          selectedApp.follow_up_2_sent_at,
                        ).toLocaleString()}`
                      : "Pending"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      selectedApp.stop_follow_up
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedApp.stop_follow_up ? "🚫 Stopped" : "✓ Active"}
                  </span>
                </div>
              </div>

              {selectedApp.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 flex gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-1 font-semibold">
                      Error Log:
                    </strong>
                    <p className="whitespace-pre-wrap">{selectedApp.error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Recipients ({selectedApp.to_emails?.length || 0})
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                    {selectedApp.to_emails?.map((email) => (
                      <div
                        key={email}
                        className="text-sm text-slate-700 flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {email}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Variables Used
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 font-mono text-xs text-slate-600 max-h-32 overflow-y-auto space-y-1">
                    {Object.keys(selectedApp.variables || {}).length > 0 ? (
                      Object.entries(selectedApp.variables).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-emerald-600 font-semibold">
                            {k}
                          </span>
                          : "{v}"
                        </div>
                      ))
                    ) : (
                      <span className="italic text-slate-400">
                        No variables used
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Subject Sent
                </span>
                <p className="text-emerald-700 font-medium mt-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  {selectedApp.rendered_subject}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Body
                </span>
                <div className="mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedApp.rendered_body}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
