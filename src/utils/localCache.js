/** Lightweight localStorage cache for offline / failed network recovery. */

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const readCache = (key, maxAgeMs = DEFAULT_MAX_AGE_MS) => {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed == null || typeof parsed !== "object" || !("data" in parsed)) return null;
    if (maxAgeMs > 0 && parsed.savedAt && Date.now() - parsed.savedAt > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

export const writeCache = (key, data) => {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }));
  } catch {
    // quota or private mode
  }
};

export const removeCache = (key) => {
  if (!key) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const CACHE_KEYS = {
  learnerDashboard: "lasglowtech-learner-dashboard",
  learnerModules: (enrollmentId) => `lasglowtech-learner-modules-${enrollmentId}`,
  quizDraft: (enrollmentId, moduleId) => `lasglowtech-quiz-draft-${enrollmentId}-${moduleId}`,
  careersApplicationDraft: "lasglowtech-careers-application-draft",
};
