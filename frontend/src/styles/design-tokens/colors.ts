export const colors = {
  text: {
    primary: "#2b2622",
    secondary: "#5f584f",
    muted: "#8a8178",
    inverse: "#ffffff",
  },

  background: {
    app: "#f3efe8",
    base: "#ffffff",
    subtle: "#faf7f2",
    muted: "#eee9e1",

    accentSubtle: "#efe4d9",
    accent: "#d8c1b1",
    accentStrong: "#7a5a48",
  },

  border: {
    default: "#d8d1c7",
    focus: "#6b4f3f",
  },

  accent: {
    strong: "#5c4032",
    primary: "#6b4f3f",
    subtle: "#bfa89a",
  },

  state: {
    running: "#6f8f8b",
    needsFinalize: "#b38b5e",
    done: "#6f8b6a",
    danger: "#b35c4e",
  },
} as const;
