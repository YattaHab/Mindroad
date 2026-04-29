import { useState } from "react";
import { Check, X, Shield, Zap, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser, isLoggedIn } from "../services/authService";
//console
const plans = [
  {
    name: "Free",
    icon: <Star size={20} className="text-gray-500" />,
    price: { monthly: 0, yearly: 0 },
    description: "Start your journey with no commitment.",
    cta: "Get Started Free",
    ctaStyle: "bg-black text-white hover:bg-gray-800",
    popular: false,
    features: [
      { text: "Access to 2 tracks", included: true },
      { text: "Basic roadmap view", included: true },
      { text: "3 projects per track", included: true },
      { text: "Community access (read-only)", included: true },
      { text: "Progress tracking", included: true },
      { text: "All tracks unlocked", included: false },
      { text: "Project submissions & reviews", included: false },
      { text: "Certificates of completion", included: false },
      { text: "Community posting & Q&A", included: false },
      { text: "Priority mentor support", included: false },
    ],
  },
  {
    name: "Pro",
    icon: <Zap size={20} className="text-white" />,
    price: { monthly: 19, yearly: 15 },
    description: "For serious learners ready to level up.",
    cta: "Start 7-Day Free Trial",
    ctaStyle: "bg-white text-primary hover:bg-gray-100",
    subCta: "No credit card required",
    popular: true,
    features: [
      { text: "All 12 tracks unlocked", included: true },
      { text: "Full roadmap access", included: true },
      { text: "Unlimited projects", included: true },
      { text: "Project submissions & reviews", included: true },
      { text: "Certificates of completion", included: true },
      { text: "Community posting & Q&A", included: true },
      { text: "Progress analytics dashboard", included: true },
      { text: "Resource library access", included: true },
      { text: "Priority mentor support", included: false },
      { text: "Team management", included: false },
    ],
  },
  {
    name: "Enterprise",
    icon: (
      <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">E</span>
      </div>
    ),
    price: { monthly: null, yearly: null },
    description: "Custom solutions for teams and organizations.",
    cta: "Contact Sales",
    ctaStyle: "bg-black text-white hover:bg-gray-800",
    popular: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Team management portal", included: true },
      { text: "Custom learning paths", included: true },
      { text: "Priority mentor support", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SSO & advanced security", included: true },
      { text: "Analytics & reporting", included: true },
      { text: "API access", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Custom billing", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "Absolutely. The Pro plan comes with a 7-day free trial. No credit card is required to start — just create an account and explore everything Pro has to offer.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, MasterCard, American Express), as well as PayPal and bank transfers for Enterprise plans.",
  },
  {
    q: "Do certificates expire?",
    a: "No, certificates earned on MindRoad never expire. Once you complete a roadmap and earn your certificate, it's yours to keep and share forever.",
  },
  {
    q: "What happens to my progress if I downgrade?",
    a: "Your progress and completed content are always saved. If you downgrade, you'll lose access to Pro-only features but your existing data remains intact.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team and we'll process a full refund — no questions asked.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div
        className="bg-[#030712] "
        style={{
          background:
            "radial-gradient(circle at center, #0c0828 0%, #030712 80%)",
        }}
      >
        <Navbar isLoggedIn={loggedIn} user={user} />

        <section className=" text-center px-6 py-32">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Simple Pricing
          </p>
          <h1 className="font-bold text-4xl md:text-5xl text-white mb-4">
            Invest in your <span className="text-primary">future</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Start free. Upgrade when you're ready. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition duration-200 flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                -21%
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Plans */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "bg-primary border-2 border-primary/80 shadow-2xl shadow-primary/30 scale-105 z-10"
                  : "bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ffb900] text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon + Name */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  plan.popular ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {plan.icon}
              </div>
              <h3
                className={`text-xl font-bold mb-1 ${
                  plan.popular ? "text-white" : "text-black"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  plan.popular ? "text-white/70" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {plan.price.monthly === null ? (
                  <p
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-white" : "text-black"
                    }`}
                  >
                    Custom
                  </p>
                ) : plan.price.monthly === 0 ? (
                  <p
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-white" : "text-black"
                    }`}
                  >
                    Free
                  </p>
                ) : (
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-lg font-bold ${
                        plan.popular ? "text-white" : "text-black"
                      }`}
                    >
                      $
                    </span>
                    <span
                      className={`text-5xl font-bold ${
                        plan.popular ? "text-white" : "text-black"
                      }`}
                    >
                      {billing === "yearly"
                        ? plan.price.yearly
                        : plan.price.monthly}
                    </span>
                    <span
                      className={`text-sm mb-2 ${
                        plan.popular ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      /month
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.included ? (
                      <Check
                        size={16}
                        className={`flex-shrink-0 ${
                          plan.popular ? "text-white" : "text-green-500"
                        }`}
                      />
                    ) : (
                      <X
                        size={16}
                        className={`flex-shrink-0 ${
                          plan.popular ? "text-white/30" : "text-gray-300"
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm ${
                        f.included
                          ? plan.popular
                            ? "text-white"
                            : "text-gray-700"
                          : plan.popular
                            ? "text-white/40"
                            : "text-gray-300"
                      }`}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/"
                className={`w-full py-3 rounded-xl text-center font-semibold text-sm transition duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
              {plan.subCta && (
                <p
                  className={`text-center text-xs mt-2 ${
                    plan.popular ? "text-white/60" : "text-gray-400"
                  }`}
                >
                  {plan.subCta}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Money-back */}
      <section className="px-6 max-w-4xl mx-auto mb-20">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={24} className="text-green-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">
              30-Day Money-Back Guarantee
            </p>
            <p className="text-gray-500 text-sm">
              Not happy within 30 days? We'll refund you in full, no questions
              asked.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 max-w-3xl mx-auto mb-20">
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-3">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Everything you need to know about pricing and plans.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/5 border border-gray-400 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 flex-shrink-0 transition-transform  ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Still have questions?
          <a href="/" className="text-primary font-medium hover:underline">
            Chat with us
          </a>
        </p>
      </section>

      <Footer />
    </div>
  );
}
