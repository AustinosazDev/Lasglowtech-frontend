/**
 * Parse quiz CSV and convert to admin quiz form questions.
 *
 * Expected columns (header row required):
 *   question, option_a, option_b, option_c, option_d, correct
 *
 * Also supports: option1..option6, correct as A/B/C/D or 1/2/3/4 or exact option text.
 */

const QUESTION_HEADERS = new Set(["question", "question_text", "q", "prompt"]);
const CORRECT_HEADERS = new Set(["correct", "correct_answer", "answer", "correct_option"]);

const parseCsvRows = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field.trim());
    field = "";
  };

  const pushRow = () => {
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      rows.push(row);
    }
    row = [];
  };

  const normalized = String(text || "").replace(/^\uFEFF/, "");

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      pushField();
    } else if (char === "\n") {
      pushField();
      pushRow();
    } else if (char === "\r") {
      // ignore; \r\n handled when \n arrives
    } else {
      field += char;
    }
  }

  pushField();
  if (row.length) pushRow();
  return rows;
};

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const isOptionHeader = (header) =>
  /^option[_-]?[a-z0-9]+$/i.test(header) || /^option\d+$/i.test(header);

const optionHeaderSortKey = (header) => {
  const letterMatch = header.match(/^option[_-]?([a-z])$/i);
  if (letterMatch) return letterMatch[1].charCodeAt(0);
  const numMatch = header.match(/^option[_-]?(\d+)$/i);
  if (numMatch) return Number(numMatch[1]);
  return 999;
};

const resolveCorrectIndex = (correctRaw, options) => {
  const correct = String(correctRaw || "").trim();
  if (!correct) return -1;

  const upper = correct.toUpperCase();
  if (/^[A-Z]$/.test(upper)) {
    return upper.charCodeAt(0) - 65;
  }

  if (/^\d+$/.test(correct)) {
    return Number(correct) - 1;
  }

  const exactIdx = options.findIndex((opt) => opt.toLowerCase() === correct.toLowerCase());
  if (exactIdx >= 0) return exactIdx;

  return -1;
};

export const QUIZ_CSV_TEMPLATE = `question,option_a,option_b,option_c,option_d,correct
"What is HTML used for?",Structuring web content,Styling web pages,Running a database,Sending email,A
"What does CSS stand for?",Cascading Style Sheets,Creative Style System,Computer Style Syntax,Content Structure Sheets,A
"Which tag creates a hyperlink?",<link>,<a>,<href>,<url>,B`;

export const parseQuizCsv = (text) => {
  const rows = parseCsvRows(text);
  const errors = [];
  const warnings = [];

  if (!rows.length) {
    return { questions: [], errors: ["CSV file is empty."], warnings };
  }

  const headers = rows[0].map(normalizeHeader);
  const questionIdx = headers.findIndex((h) => QUESTION_HEADERS.has(h));
  const correctIdx = headers.findIndex((h) => CORRECT_HEADERS.has(h));

  if (questionIdx < 0) {
    return {
      questions: [],
      errors: ['Missing "question" column. Use header: question, option_a, option_b, ..., correct'],
      warnings,
    };
  }

  if (correctIdx < 0) {
    return {
      questions: [],
      errors: ['Missing "correct" column. Use A/B/C/D or 1/2/3/4, or the exact correct option text.'],
      warnings,
    };
  }

  const optionIndices = headers
    .map((header, index) => ({ header, index }))
    .filter(({ header, index }) => index !== questionIdx && index !== correctIdx && isOptionHeader(header))
    .sort((a, b) => optionHeaderSortKey(a.header) - optionHeaderSortKey(b.header))
    .map(({ index }) => index);

  if (optionIndices.length < 2) {
    return {
      questions: [],
      errors: ["Need at least two option columns (option_a, option_b, ... or option1, option2, ...)."],
      warnings,
    };
  }

  const questions = [];

  for (let r = 1; r < rows.length; r += 1) {
    const cells = rows[r];
    if (!cells.some((cell) => String(cell || "").trim())) continue;

    const questionText = String(cells[questionIdx] || "").trim();
    if (!questionText) {
      warnings.push(`Row ${r + 1}: skipped — question text is empty.`);
      continue;
    }

    const optionTexts = optionIndices
      .map((idx) => String(cells[idx] || "").trim())
      .filter(Boolean);

    if (optionTexts.length < 2) {
      errors.push(`Row ${r + 1}: needs at least two non-empty options.`);
      continue;
    }

    const correctRaw = cells[correctIdx];
    const correctIndex = resolveCorrectIndex(correctRaw, optionTexts);
    if (correctIndex < 0 || correctIndex >= optionTexts.length) {
      errors.push(
        `Row ${r + 1}: invalid correct value "${correctRaw}". Use A–${String.fromCharCode(65 + optionTexts.length - 1)}, 1–${optionTexts.length}, or exact option text.`
      );
      continue;
    }

    questions.push({
      questionText,
      options: optionTexts.map((optionText, index) => ({
        optionText,
        isCorrect: index === correctIndex,
      })),
    });
  }

  if (!questions.length && !errors.length) {
    errors.push("No valid question rows found in CSV.");
  }

  return { questions, errors, warnings };
};

export const quizCsvToFormQuestions = (parsedQuestions) =>
  parsedQuestions.map((question, qIndex) => ({
    key: `q-import-${Date.now()}-${qIndex}-${Math.random()}`,
    questionText: question.questionText,
    options: question.options.map((option, oIndex) => ({
      key: `opt-import-${Date.now()}-${qIndex}-${oIndex}-${Math.random()}`,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
    })),
  }));

export const downloadQuizCsvTemplate = () => {
  const blob = new Blob([QUIZ_CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quiz-import-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
