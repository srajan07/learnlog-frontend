import React from "react";
import { Link } from "react-router-dom";

import samplePost from "../../assets/sample.png";

const STEPS = [
  {
    n: "01",
    q: "What were you learning?",
    a: "Say what topic or problem you were working on.",
  },
  {
    n: "02",
    q: "What confused you?",
    a: "Say what part didn't make sense at first.",
  },
  {
    n: "03",
    q: "What finally clicked?",
    a: "Explain what helped you understand it.",
  },
  {
    n: "04",
    q: "Can you show an example?",
    a: "Add a short example, like code or a picture, if it helps.",
  },
];

const TIPS = [
  {
    emoji: "💭",
    title: "Use simple words.",
    body: "Write like you're talking to a friend. You don't need perfect wording.",
  },
  {
    emoji: "🎯",
    title: "Explain one idea.",
    body: "A short note about one thing helps more than a long tutorial.",
  },
  {
    emoji: "🔍",
    title: "It's okay to share what confused you.",
    body: "Other learners feel the same way. It helps them know they're not alone.",
  },
  {
    emoji: "✨",
    title: "Say what helped you understand.",
    body: "This is the part people find most useful.",
  },
];

function Sample() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#20242B]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#253044] hover:underline mb-10"
        >
          ← Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
            A good learning post is simple.
          </h1>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-[#70757D] leading-relaxed">
            You don't need to write a big tutorial. Share what you were
            learning, what confused you, and what finally made sense.
          </p>
        </div>

        {/* Steps + tips, side by side */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">

          {/* Left: four steps */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Share what helped you understand.
            </h2>

            <p className="mt-2 text-sm text-[#70757D] leading-relaxed">
              Think about the moment it stopped being confusing. That
              moment can help someone who feels stuck right now.
            </p>

            <div className="mt-6 space-y-3">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl p-4"
                >
                  <p className="text-sm font-semibold text-[#20242B]">
                    {step.q}
                  </p>
                  <p className="mt-1 text-sm text-[#70757D] leading-relaxed">
                    {step.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: tips */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              A few tips that help.
            </h2>

            <p className="mt-2 text-sm text-[#70757D] leading-relaxed">
              Simple habits that make a post easier to write and easier
              to read.
            </p>

            <div className="mt-6 space-y-3">
              {TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl p-4 flex gap-3"
                >
                  <span className="text-sm shrink-0">{tip.emoji}</span>

                  <div>
                    <p className="text-sm font-semibold text-[#20242B]">
                      {tip.title}
                    </p>
                    <p className="mt-1 text-sm text-[#70757D] leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Example */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Here's what that can look like.
          </h2>

          <p className="mt-2 text-sm text-[#70757D] leading-relaxed">
            Notice how the example focuses on the confusion and what
            finally clicked.
          </p>

          <article className="mt-6 bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl overflow-hidden">

            <div className="p-5 sm:p-7">

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-full bg-[#EEF1EA] text-[#587A63] flex items-center justify-center text-sm font-semibold shrink-0">
                  A
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#20242B]">
                    Ananya
                  </p>

                  <p className="text-xs text-[#8A8F96]">
                    A learning note
                  </p>
                </div>

              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold tracking-tight">
                Understanding C++ References
              </h3>

              {/* Learning Story */}
              <div className="mt-4 space-y-3">

                <p className="text-sm sm:text-base text-[#70757D] leading-relaxed">
                  I was confused about references in C++. I thought a
                  reference created another copy of the variable.
                </p>

                <p className="text-sm sm:text-base text-[#70757D] leading-relaxed">
                  What finally clicked was that a reference is just another
                  name for the same variable.
                </p>

              </div>

              {/* Code */}
              <div className="mt-5 rounded-xl border border-[#E2E3DE] overflow-hidden bg-[#F7F7F3]">

                <div className="px-4 py-2.5 border-b border-[#E2E3DE]">
                  <span className="text-xs font-medium text-[#8A8F96]">
                    Example
                  </span>
                </div>

                <pre className="p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-[#253044] overflow-x-auto">
{`int x = 5;
int& ref = x;

ref = 10;

cout << x; // 10`}
                </pre>

              </div>

              {/* Image */}
              <div className="mt-5">
                <div className="rounded-xl overflow-hidden border border-[#E2E3DE] bg-[#F7F7F3]">
                  <img
                    src={samplePost}
                    alt="Visual explanation of C++ references"
                    className="w-full h-auto block"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">

                <span className="rounded-full bg-[#F0F1EC] px-3 py-1 text-[11px] text-[#70757D]">
                  C++
                </span>

                <span className="rounded-full bg-[#F0F1EC] px-3 py-1 text-[11px] text-[#70757D]">
                  References
                </span>

                <span className="rounded-full bg-[#F0F1EC] px-3 py-1 text-[11px] text-[#70757D]">
                  Beginner
                </span>

              </div>

            </div>

            {/* Note */}
            <div className="border-t border-[#E2E3DE] bg-[#F7F7F3] px-5 sm:px-7 py-4 sm:py-5">

              <p className="text-xs sm:text-sm text-[#70757D] leading-relaxed">
                <span className="font-semibold text-[#20242B]">
                  What makes this useful?
                </span>{" "}
                It shares the confusion, explains what finally clicked,
                and gives an example that another learner can try.
              </p>

            </div>

          </article>
        </section>
      </div>
    </main>
  );
}

export default Sample;