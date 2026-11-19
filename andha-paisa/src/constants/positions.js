export const POSITIONS = [
  { value: "FULL_STACK", label: "Full Stack" },
  { value: "NODE_JS", label: "Node.js" },
  { value: "MERN", label: "MERN" },
  { value: "BACKEND", label: "Backend" },
  { value: "PYTHON", label: "Python" },
  { value: "PYTHON_BACKEND", label: "Python Backend" },
];

export const POSITION_LABELS = POSITIONS.reduce((acc, p) => {
  acc[p.value] = p.label;
  return acc;
}, {});

export const extractVariables = (...texts) => {
  const regex = /\{+\s*([a-zA-Z_][a-zA-Z0-9_.-]*)\s*\}+/g;
  const found = new Set();
  texts.forEach((text) => {
    if (!text) return;
    for (const m of text.matchAll(regex)) found.add(m[1]);
  });
  return [...found];
};
