import React, { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import instance from "../config/axios.config";
import { CACHE_KEYS, readCache, removeCache, writeCache } from "../utils/localCache";

const getOptionLabel = (question, optionId) =>
  question?.options?.find((o) => Number(o.id) === Number(optionId))?.optionText || null;

const quizDataCacheKey = (enrollmentId, moduleId) =>
  `lasglowtech-quiz-data-${enrollmentId}-${moduleId}`;

const ModuleQuiz = ({ enrollmentId, moduleId, token, moduleTitle = "", hasQuizHint = false, onSubmitted }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState("question");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [usingOfflineQuiz, setUsingOfflineQuiz] = useState(false);

  const draftKey = enrollmentId && moduleId ? CACHE_KEYS.quizDraft(enrollmentId, moduleId) : null;

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id]).length,
    [questions, answers]
  );

  const clearDraft = () => {
    if (draftKey) removeCache(draftKey);
  };

  const resetAttempt = () => {
    setAnswers({});
    setCurrentIndex(0);
    setStep("question");
    setResults(null);
    setError("");
    clearDraft();
  };

  const restoreDraft = () => {
    const draft = draftKey ? readCache(draftKey) : null;
    if (draft && draft.step !== "results") {
      setAnswers(draft.answers || {});
      setCurrentIndex(Number(draft.currentIndex) || 0);
      setStep(draft.step || "question");
      setResults(null);
      setError("");
      return;
    }
    setAnswers({});
    setCurrentIndex(0);
    setStep("question");
    setResults(null);
    setError("");
  };

  useEffect(() => {
    if (!enrollmentId || !moduleId || !token) {
      setQuiz(null);
      setLoading(false);
      setLoadFailed(false);
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadFailed(false);
      setUsingOfflineQuiz(false);
      setError("");

      try {
        const res = await instance.get(`/lms/my/enrollments/${enrollmentId}/modules/${moduleId}/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        const data = res.data || null;
        setQuiz(data);
        if (data?.questions?.length) {
          writeCache(quizDataCacheKey(enrollmentId, moduleId), data);
        }
        restoreDraft();
      } catch (err) {
        if (cancelled) return;
        const cachedQuiz = readCache(quizDataCacheKey(enrollmentId, moduleId));
        if (cachedQuiz?.questions?.length) {
          setQuiz(cachedQuiz);
          restoreDraft();
          setUsingOfflineQuiz(true);
          setError("You're offline. Your quiz progress is saved on this device.");
        } else {
          setQuiz(null);
          setLoadFailed(true);
          setError(err.response?.data?.error || "Could not load the quiz. Connect and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enrollmentId, moduleId, token]);

  useEffect(() => {
    if (!draftKey || !quiz?.questions?.length || step === "results") return;
    writeCache(draftKey, { answers, currentIndex, step });
  }, [answers, currentIndex, step, draftKey, quiz]);

  const submitQuiz = async () => {
    if (!totalQuestions) return;
    const unanswered = questions.find((q) => !answers[q.id]);
    if (unanswered) {
      setError("Please answer every question before submitting.");
      setStep("review");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await instance.post(
        `/lms/my/enrollments/${enrollmentId}/modules/${moduleId}/quiz/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
      setStep("results");
      clearDraft();
      setUsingOfflineQuiz(false);
      onSubmitted?.(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to submit quiz. Your answers are saved — try again when you're back online."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goToNext = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) {
      setError("Select an answer to continue.");
      return;
    }
    setError("");
    if (currentIndex >= totalQuestions - 1) {
      setStep("review");
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const goToPrevious = () => {
    setError("");
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const renderOptions = (question, { readOnly = false, showResults = false, result = null } = {}) => (
    <div className="mt-3 space-y-1.5 md:space-y-2">
      {question.options.map((option) => {
        const selected = Number(answers[question.id]) === option.id;
        const isCorrectOption = showResults && result && result.correctOptionId === option.id;
        const isWrongSelected = showResults && result && selected && !result.isCorrect;

        let optionClass =
          "flex items-start gap-2.5 w-full text-left px-2 py-3 md:px-3 md:py-2.5 md:rounded-lg text-sm transition-colors ";
        if (showResults) {
          if (isCorrectOption) optionClass += "bg-emerald-50 text-emerald-900 md:border md:border-emerald-300";
          else if (isWrongSelected) optionClass += "bg-red-50 text-red-900 md:border md:border-red-300";
          else optionClass += "bg-transparent text-slate-600 md:border md:border-slate-100";
        } else if (selected) {
          optionClass += " bg-violet-50 text-slate-900 border border-violet-300 rounded-lg";
        } else if (readOnly) {
          optionClass += " bg-transparent text-slate-600";
        } else {
          optionClass +=
            " bg-white text-slate-800 border border-slate-200 rounded-lg hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer";
        }

        return (
          <label key={option.id} className={optionClass}>
            <input
              type="radio"
              name={`quiz-q-${question.id}`}
              value={option.id}
              checked={selected}
              disabled={readOnly || showResults}
              onChange={() => {
                if (readOnly || showResults) return;
                setAnswers((prev) => ({ ...prev, [question.id]: option.id }));
                setError("");
              }}
              className="mt-0.5 flex-shrink-0 text-[#8700ff] focus:ring-[#8700ff]"
            />
            <span className="flex-1 min-w-0 leading-relaxed break-words">{option.optionText}</span>
            {showResults && isCorrectOption && (
              <FaCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            {showResults && isWrongSelected && (
              <FaTimes className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
          </label>
        );
      })}
    </div>
  );

  const panelClass =
    "module-quiz-panel w-full overflow-hidden rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)]";

  if (loading) {
    return (
      <div className={`${panelClass} px-4 py-5`} id="module-quiz">
        <p className="text-sm text-slate-600">Loading quiz…</p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className={`${panelClass} px-4 py-5 border-red-200 bg-red-50/80`} id="module-quiz">
        <p className="text-sm font-semibold text-red-800">Quiz unavailable</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (!totalQuestions) {
    if (!hasQuizHint) return null;
    return (
      <div className={`${panelClass} px-4 py-5 bg-slate-50/90`} id="module-quiz">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">Module quiz</p>
        <p className="text-sm text-slate-700 mt-2 leading-relaxed">
          No quiz has been added to <strong className="text-slate-900">{moduleTitle || "this module"}</strong> yet.
        </p>
      </div>
    );
  }

  const progressPercent = step === "question" ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 100;

  return (
    <div className={panelClass} id="module-quiz">
      <div className="px-4 py-4 border-b border-violet-100 bg-gradient-to-b from-violet-50/90 to-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">Module quiz</p>
        <h4 className="text-lg font-semibold text-slate-900 mt-1 leading-snug">{quiz.title || "Module quiz"}</h4>
        {usingOfflineQuiz && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
            Offline mode — answers are saved on this device until you submit when online.
          </p>
        )}
        {step === "question" && (
          <>
            <p className="text-sm text-slate-700 mt-1">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#8700ff] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        )}
        {step === "review" && (
          <p className="text-sm text-slate-600 mt-1">
            Review your {totalQuestions} answers before submitting. You can retake or submit when ready.
          </p>
        )}
        {step === "results" && results && (
          <p className="text-sm text-slate-600 mt-2">
            You scored <strong>{results.score}</strong> out of <strong>{results.total}</strong> ({results.percent}%)
          </p>
        )}
      </div>

      <div className="px-4 py-4 md:px-5 md:py-5 space-y-4 bg-white">
        {step === "question" && currentQuestion && (
          <div className="w-full">
            <p className="text-base font-semibold text-slate-900 leading-relaxed break-words">
              {currentIndex + 1}. {currentQuestion.questionText}
            </p>
            {renderOptions(currentQuestion)}
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-5 pt-2">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="dash-btn-soft w-full sm:w-auto !py-2.5 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNext}
                disabled={!answers[currentQuestion.id]}
                className="dash-btn-primary w-full sm:w-auto !py-2.5 disabled:opacity-50"
              >
                {currentIndex >= totalQuestions - 1 ? "Review answers" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="py-3 border-b border-slate-100 last:border-0">
                <p className="text-sm font-semibold text-slate-900 leading-relaxed break-words">
                  {index + 1}. {question.questionText}
                </p>
                <p className="mt-2 text-sm text-slate-800 bg-violet-50/80 rounded-lg px-3 py-2.5 break-words leading-relaxed">
                  {getOptionLabel(question, answers[question.id]) || (
                    <span className="text-red-600">No answer selected</span>
                  )}
                </p>
              </div>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
              <button type="button" onClick={resetAttempt} className="dash-btn-soft w-full sm:w-auto !py-2.5">
                Retake quiz
              </button>
              <button
                type="button"
                onClick={submitQuiz}
                disabled={submitting || answeredCount < totalQuestions || usingOfflineQuiz}
                title={usingOfflineQuiz ? "Connect to the internet to submit" : undefined}
                className="dash-btn-primary w-full sm:w-auto !py-2.5 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : usingOfflineQuiz ? "Submit when online" : "Submit quiz"}
              </button>
            </div>
          </div>
        )}

        {step === "results" &&
          questions.map((question, index) => {
            const result = results?.results?.find((r) => r.questionId === question.id);
            return (
              <div
                key={question.id}
                className={`pb-4 border-b last:border-0 last:pb-0 md:rounded-xl md:p-4 md:mb-3 md:border ${
                  result?.isCorrect
                    ? "border-emerald-100 md:bg-emerald-50/60 md:border-emerald-200"
                    : "border-red-100 md:bg-red-50/60 md:border-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {result && (
                    <span className="mt-0.5 flex-shrink-0">
                      {result.isCorrect ? (
                        <FaCheckCircle className="w-5 h-5 text-emerald-600" aria-label="Correct" />
                      ) : (
                        <FaTimes className="w-5 h-5 text-red-600" aria-label="Incorrect" />
                      )}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed break-words">
                      {index + 1}. {question.questionText}
                    </p>
                    {renderOptions(question, { showResults: true, result })}
                    {result && !result.isCorrect && result.correctOptionText && (
                      <p className="text-xs text-red-700 mt-2">
                        Correct answer: <strong>{result.correctOptionText}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {step === "results" && (
          <div className="pt-2">
            <button type="button" onClick={resetAttempt} className="dash-btn-soft w-full sm:w-auto !py-2.5">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleQuiz;
