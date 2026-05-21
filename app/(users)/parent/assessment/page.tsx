"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp, AlertCircle, Brain, Stethoscope } from "lucide-react";
import { questions } from "@/assets/assets";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { analyzeAssessment, saveAssessmentResult } from "@/server/assessmentActions";

const mockResult = {
  score: 82,
  analysis: [
    { area: "Reading Comprehension", score: 72, status: "attention" },
    { area: "Letter Recognition", score: 85, status: "good" },
    { area: "Attention Span", score: 65, status: "attention" },
    { area: "Number Skills", score: 90, status: "good" },
    { area: "Writing Skills", score: 78, status: "good" },
    { area: "Following Instructions", score: 60, status: "attention" },
  ],
  recommendations: [
    "Consider a professional evaluation for reading and attention patterns.",
    "Practice multi-step instructions with visual aids at home.",
    "Reading aloud for 15 minutes daily can strengthen comprehension.",
    "Consult with your child's teacher about classroom accommodations.",
  ]
};

const Assessment = () => {
  const [current, setCurrent] = useState(-1);
  const [childAge, setChildAge] = useState<number | "">("");
  const [childGender, setChildGender] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);
  const [resultData, setResultData] = useState<{
    score: number;
    analysis: Array<{ area: string; score: number; status: string }>;
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % 3);
      }, 2000);
    } else {
      setLoadingStage(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    "Submitting responses to AI screening engine...",
    "Analyzing developmental patterns and benchmarks...",
    "Generating custom guidelines and recommendations...",
  ];

  const question = current === -1 ? null : questions[current];
  const progress =
    current === -1 ? 0 : ((current + (answers[question?.id || ""] ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (option: string) => {
    if (!question) return;
    setAnswers({ ...answers, [question.id]: option });
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        setLoading(true);
        const qaPairs = questions.map((q) => ({
          question: q.text,
          answer: answers[q.id] || "No answer",
        }));

        const res = await analyzeAssessment(qaPairs);
        if (res.success && res.result) {
          localStorage.setItem("neuronest_assessment_results", JSON.stringify(res.result));
          await saveAssessmentResult(res.result, { age: Number(childAge) || 7, gender: childGender || "Other" });
          setResultData(res.result);
          setCompleted(true);
        } else {
          toast.error("AI analysis failed", {
            description: res.message || "Failed to parse screening results.",
          });
          await saveAssessmentResult(mockResult, { age: Number(childAge) || 7, gender: childGender || "Other" });
          setResultData(mockResult);
          setCompleted(true); // Fallback to mock
        }
      } catch (error) {
        console.error("AI analysis error:", error);
        toast.error("Screening analysis error", {
          description: "An unexpected error occurred during AI analysis.",
        });
        await saveAssessmentResult(mockResult, { age: Number(childAge) || 7, gender: childGender || "Other" });
        setResultData(mockResult);
        setCompleted(true); // Fallback to mock
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-4 border-accent/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full border-4 border-secondary/40 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-6 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
        <motion.h2
          key={loadingStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-heading font-bold text-foreground max-w-md h-8"
        >
          {loadingMessages[loadingStage]}
        </motion.h2>
        <p className="text-muted-foreground text-sm mt-4 animate-pulse">
          Please do not close this window
        </p>
      </div>
    );
  }

  if (completed) {
    const resultsObj = resultData || mockResult;
    const score = resultsObj.score;
    const analysis = resultsObj.analysis;
    const recommendations = resultsObj.recommendations;

    return (
      <div className="space-y-6">
        <Toaster />
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
              Assessment Results
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-Generated Screening Analysis completed successfully.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Link
              href="/parent/find-doctor"
              className="btn-accent !px-4 !py-2.5 text-sm flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              Find a Specialist
            </Link>
            <Link
              href="/parent/results"
              className="btn-outline-primary !px-4 !py-2.5 text-sm flex items-center gap-1.5"
            >
              View Assessment History
            </Link>
            <Link
              href="/parent"
              className="btn-primary !px-4 !py-2.5 text-sm flex items-center gap-1.5"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <div className="card-soft !p-8 text-center">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3 font-heading">
            Overall Score
          </p>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.512} 251.2`}
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${score * 2.512} 251.2` }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-heading font-bold text-foreground">
                {score}%
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {score >= 80
              ? "Above average with some areas needing attention"
              : score >= 50
                ? "Average but has notable areas of concern"
                : "Needs immediate professional assessment"}
          </p>
        </div>

        {/* Area breakdown */}
        <div className="card-soft">
          <h2 className="font-heading font-bold text-lg text-foreground mb-6">
            Score Breakdown
          </h2>
          <div className="space-y-4">
            {analysis.map((r, i) => (
              <motion.div
                key={r.area}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="w-5 flex justify-center">
                  {r.status === "attention" ? (
                    <AlertCircle className="w-4 h-4 text-accent" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {r.area}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {r.score}%
                    </span>
                  </div>
                  <div className="progress-track !h-2">
                    <motion.div
                      className={`h-full rounded-full ${r.status === "attention" ? "bg-accent" : "bg-secondary"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${r.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card-soft">
          <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" /> Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action: Consult a Specialist */}
        <div className="card-soft border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 p-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading font-bold text-base text-foreground flex items-center justify-center md:justify-start gap-2">
              <Brain className="w-5 h-5 text-primary" /> Need a Professional Evaluation?
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Connect with certified child psychologists, pediatric neurologists, and speech therapists in your area.
            </p>
          </div>
          <Link
            href="/parent/find-doctor"
            className="btn-accent !px-5 !py-2.5 text-sm flex items-center gap-1.5 shrink-0"
          >
            <Stethoscope className="w-4 h-4" /> Find Specialists Nearby
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toaster />
      <Link
        href="/parent"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Exit
      </Link>

      <motion.div layout className="card-soft !rounded-[40px] !p-8 lg:!p-10">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">
            {current === -1 ? "Initial Setup" : `Question ${current + 1} of ${questions.length}`}
          </span>
          <div className="w-32">
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {current === -1 ? (
            <motion.div
              key="initial-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl lg:text-2xl font-heading font-bold text-foreground mb-4">
                Child Information
              </h2>
              <p className="text-muted-foreground mb-8 text-sm">
                Before we begin the assessment, please provide a few details about your child to help personalize the screening.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Age (in years)</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="e.g. 7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setChildGender(g)}
                        className={`py-3 rounded-xl border-2 transition-all text-sm font-medium ${childGender === g
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-primary/30"
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : question && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl lg:text-2xl font-heading font-bold text-foreground mb-8">
                {question.text}
              </h2>
              <div className="grid gap-3">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 flex justify-between items-center group ${answers[question.id] === option
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    style={{
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <span className="font-semibold text-foreground">
                      {option}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${answers[question.id] === option
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                        }`}
                    >
                      {answers[question.id] === option && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrent(Math.max(-1, current - 1))}
            disabled={current === -1}
            className="btn-outline-primary !px-5 !py-2.5 text-sm disabled:opacity-30"
          >
            Previous
          </button>
          {current === -1 ? (
            <button
              onClick={() => setCurrent(0)}
              disabled={childAge === "" || !childGender}
              className="btn-accent !px-5 !py-2.5 text-sm disabled:opacity-30 flex items-center gap-2"
            >
              Start Assessment <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!question || !answers[question.id]}
              className="btn-accent !px-5 !py-2.5 text-sm disabled:opacity-30 flex items-center gap-2"
            >
              {current === questions.length - 1 ? "See Results" : "Next"}{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Assessment;
