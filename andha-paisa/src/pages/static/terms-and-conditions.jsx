import { Link } from "react-router-dom";
import { 
  FileText, Scale, Users, AlertCircle, DollarSign, 
  Clock, Gavel, Mail, Shield, UserCheck, Ban, 
  Activity, Lock, Award
} from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";

export default function TermsConditions() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      id: "eligibility",
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      title: "1. Eligibility Requirements",
      content: [
        "You must provide accurate and complete registration information.",
        "You cannot use the platform if you're in a country where such services are prohibited.",
      ]
    },
    {
      id: "account",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: "2. Account Responsibilities",
      content: [
        "You are responsible for maintaining your account security.",
        "You must not share your password or allow others to access your account.",
        "You must notify us immediately of any unauthorized account access.",
        "You are responsible for all activities that occur under your account.",
        "CashCash is not liable for losses due to compromised accounts."
      ]
    },
    {
      id: "earnings",
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      title: "3. Earnings & Rewards",
      content: [
        "Rewards are credited upon successful completion of surveys, offers, or games.",
        "All earnings may be displayed in your local currency (USD, EUR, GBP, etc.).Currently Rupee.",
        "Minimum withdrawal threshold is Rs. 300",
        "Rewards may take up to 72 hours to process after completion.",
        "Fraudulent or invalid completions will result in reward reversal.",
        "CashCash reserves the right to adjust or revoke rewards for suspicious activity."
      ]
    },
    {
      id: "withdrawals",
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
      title: "4. Withdrawal Process",
      content: [
        "Withdrawals can be requested via bank transfer and gift cards.",
        "Payment processing takes 5-7 business days for bank transfers.",
        "A minimum of Rs. 300 is required for all withdrawal requests.",
        "Withdrawal fees may apply based on payment method.",
        "You must verify your identity before processing first withdrawal.",
        "CashCash reserves the right to hold withdrawals for fraud review."
      ]
    },
    {
      id: "prohibited",
      icon: <Ban className="w-6 h-6 text-emerald-600" />,
      title: "5. Prohibited Activities",
      content: [
        "Using bots, scripts, or automated tools to complete offers.",
        "Providing false or misleading information on surveys.",
        "Attempting to hack, exploit, or manipulate the platform.",
        "Sharing referral links in spam or unauthorized channels.",
        "Selling or transferring your account to another person.",
        "Using VPNs or proxies to access restricted offers."
      ]
    },
    {
      id: "termination",
      icon: <Gavel className="w-6 h-6 text-emerald-600" />,
      title: "6. Account Termination",
      content: [
        "Violation of terms may result in immediate account suspension.",
        "Fraudulent activity leads to permanent ban and forfeiture of rewards.",
        "CashCash reserves the right to terminate inactive accounts.",
        "You may delete your account anytime via settings.",
        "Upon termination, pending rewards may be voided.",
        "We will notify you before account termination when possible."
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
                  <FileText className="w-4 h-4" />
                  Last Updated: January 1, 2024
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Terms & Conditions
                </h1>
                <p className="text-slate-600 max-w-2xl">
                  Please read these terms carefully before using CashCash. By using our platform, 
                  you agree to be bound by these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
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
              <a
                href="#liability"
                className="text-sm text-slate-500 hover:text-emerald-600 transition px-3 py-1 rounded-full hover:bg-green-50"
              >
                Liability
              </a>
              <a
                href="#disputes"
                className="text-sm text-slate-500 hover:text-emerald-600 transition px-3 py-1 rounded-full hover:bg-green-50"
              >
                Disputes
              </a>
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
                Welcome to CashCash ("we", "our", or "us"). These Terms and Conditions ("Terms") govern your use 
                of our website, mobile application, and services (collectively, the "Platform").
              </p>
              <p className="text-slate-600">
                By accessing or using CashCash, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms. If you do not agree with any part of these Terms, please do not use our Platform.
              </p>
            </div>

            {/* Terms Sections */}
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

              {/* Limitation of Liability */}
              <div 
                id="liability"
                className="bg-white rounded-2xl border border-slate-100 p-6 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-50 p-2 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">7. Limitation of Liability</h2>
                </div>
                <ul className="space-y-3 pl-4">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>CashCash is not liable for any indirect, incidental, or consequential damages.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>We do not guarantee uninterrupted or error-free service.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Maximum liability is limited to the total rewards earned in the past 6 months.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>We are not responsible for third-party survey provider actions or policies.</span>
                  </li>
                </ul>
              </div>

              {/* Dispute Resolution */}
              <div 
                id="disputes"
                className="bg-white rounded-2xl border border-slate-100 p-6 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-50 p-2 rounded-xl">
                    <Scale className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">8. Dispute Resolution</h2>
                </div>
                <ul className="space-y-3 pl-4">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Governing Law:</strong> These terms are governed by the laws of India.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Informal Resolution:</strong> Contact cashcashsupport@gmail.com to resolve disputes informally.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Arbitration:</strong> Any unresolved disputes shall be resolved through binding arbitration.</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Class Action Waiver:</strong> You agree to resolve disputes on an individual basis only.</span>
                  </li>
                </ul>
              </div>

              {/* Changes to Terms */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mt-8 border border-amber-100">
                <h2 className="text-xl font-bold text-slate-800 mb-3">9. Changes to These Terms</h2>
                <p className="text-slate-600 mb-3">
                  We reserve the right to modify these Terms at any time. Changes become effective when:
                </p>
                <ul className="space-y-2 pl-4">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Posted on this page with an updated "Last Updated" date</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Email notification sent to registered users (for material changes)</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Continued use of the platform after changes constitutes acceptance</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-8 text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-3">Contact Us</h2>
                <p className="text-slate-600 mb-4">
                  If you have questions about these Terms & Conditions, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span>cashcashsupport@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>cashcashsupport@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8 border border-blue-100 text-center">
                <Award className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">By using CashCash, you acknowledge that:</h3>
                <p className="text-slate-600 text-sm">
                  You have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}