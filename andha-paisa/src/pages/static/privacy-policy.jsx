import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, FileText, Mail, Printer, Download } from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";

export default function PrivacyPolicy() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      id: "information",
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      title: "1. Information We Collect",
      content: [
        "Personal Information: When you register, we collect your name, email address, phone number.",
        "Account Information: Your payment details (bank account) are collected and are optional(mandatory for withdrawal)",
        "Usage Data: We collect information about surveys you complete, offers you try, and games you play.",
        "Device Information: IP address, browser type, device model, and operating system for security and optimization."
      ]
    },
    {
      id: "usage",
      icon: <Eye className="w-6 h-6 text-emerald-600" />,
      title: "2. How We Use Your Information",
      content: [
        "To create and manage your CashCash account",
        "To process survey completions and credit rewards to your account",
        "To process withdrawal requests and send payments",
        "To verify your identity and prevent fraud",
        "To improve our platform and user experience",
        "To send important notifications about your account and rewards",
        "To comply with legal obligations and age verification requirements"
      ]
    },
    {
      id: "sharing",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: "3. Information Sharing & Disclosure",
      content: [
        "We do NOT sell your personal information to third parties.",
        "Survey Partners: Survey responses are shared with our survey partners. No personal identifiers are included.",
        "Service Providers: We share necessary information with payment processors to send your withdrawals.",
        "Legal Requirements: We may disclose information if required by law or to protect our rights.",
        "Business Transfers: In case of merger or acquisition, your information may be transferred (you'll be notified)."
      ]
    },
    {
      id: "security",
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      title: "4. Data Security",
      content: [
        "Passwords are hashed and salted - we never store plain text passwords.",
        "Regular security audits and vulnerability assessments are conducted.",
        "Access to user data is restricted to authorized personnel only.",
        "In case of a data breach, affected users will be notified within 72 hours."
      ]
    },
    {
      id: "cookies",
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: "5. Cookies & Tracking Technologies",
      content: [
        "We do not use third-party tracking for advertising or behavioral profiling."
      ]
    },
    {
      id: "user-rights",
      icon: <Mail className="w-6 h-6 text-emerald-600" />,
      title: "6. Your Rights & Choices",
      content: [
        "Right to Access: Request a copy of all data we hold about you.",
        "Right to Rectification: Correct inaccurate or incomplete information.",
        "Right to Deletion: Request permanent deletion of your account and data.",
        "Right to Restrict Processing: Limit how we use your data.",
        "Right to Data Portability: Receive your data in a machine-readable format.",
        "To exercise these rights, contact us at privacy@cashcash.com"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm text-green-700 mb-4">
                  <Shield className="w-4 h-4" />
                  Last Updated: January 1, 2024
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Privacy Policy
                </h1>
                <p className="text-slate-600 max-w-2xl">
                  Your privacy is important to us. This policy explains how CashCash collects, uses, 
                  and protects your personal information.
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* Table of Contents - Optional */}
        <section className="border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <span className="text-sm font-medium text-slate-600">Jump to:</span>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-slate-500 hover:text-emerald-600 transition px-3 py-1 rounded-full hover:bg-green-50"
                >
                  {section.title.replace(/^\d+\.\s/, '')}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-10 border border-green-100">
              <h2 className="text-xl font-bold text-slate-800 mb-3">Introduction</h2>
              <p className="text-slate-600 mb-3">
                CashCash ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our platform, website, and services.
              </p>
              <p className="text-slate-600">
                By using CashCash, you consent to the data practices described in this policy. If you do not agree with 
                any part of this policy, please do not use our services.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all duration-200 scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-50 p-2 rounded-xl">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3 pl-4">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Data Retention */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-50 p-2 rounded-xl">
                  <Database className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">7. Data Retention</h2>
              </div>
              <ul className="space-y-3 pl-4">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Active Accounts:</strong> Data is retained as long as your account is active.</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Deleted Accounts:</strong> Data is deleted within 30 days of account deletion request.</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Inactive Accounts:</strong> Accounts with no activity for 2 years may be archived.</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Legal Requirements:</strong> Some data may be retained longer if required by law.</span>
                </li>
              </ul>
            </div>

            {/* Changes to Policy */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mt-8 border border-amber-100">
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Changes to This Privacy Policy</h2>
              <p className="text-slate-600 mb-3">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Sending an email to the address associated with your account</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Posting a notice on our website</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Updating the "Last Updated" date at the top of this policy</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-8 text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-3">Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy or your data, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span>privacy@cashcash.com</span>
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <div className="text-center mt-10">
              <button
                onClick={scrollToTop}
                className="px-6 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm"
              >
                ↑ Back to top
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}