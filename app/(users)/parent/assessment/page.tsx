"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { questions } from "@/assets/assets";

const Assessment = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const question = questions[current];
  const progress =
    ((current + (answers[question?.id] ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [question.id]: option });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Great job!
        </h1>
        <p className="text-muted-foreground">
          We've gathered the insights. A doctor will review this shortly.
        </p>
        <Link
          href="/parent/results"
          className="btn-accent inline-flex items-center gap-2"
        >
          See Results <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/parent"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Exit
      </Link>

      <motion.div layout className="card-soft !rounded-[40px] !p-8 lg:!p-10">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">
            Question {current + 1} of {questions.length}
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
                  className={`w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 flex justify-between items-center group ${
                    answers[question.id] === option
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
                    className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      answers[question.id] === option
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
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="btn-outline-primary !px-5 !py-2.5 text-sm disabled:opacity-30"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="btn-accent !px-5 !py-2.5 text-sm disabled:opacity-30 flex items-center gap-2"
          >
            {current === questions.length - 1 ? "See Results" : "Next"}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Assessment;
