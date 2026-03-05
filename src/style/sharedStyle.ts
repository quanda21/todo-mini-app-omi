// file: sharedStyle.ts
export const sharedStyle = `
:host {
  font-family: "Be Vietnam Pro",Inter, system-ui, Avenir, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

/* Color Variables */
:root,
html,
:host {
  --primary: var(--my-app-primary-color, #01684b);
  --ai-tag-bg: #ffffff;
  --member-bg: #e6f0fa;
  --customer-bg: #f5f7fa;
  --vb-bg: #ffffff;
  --vb-secondary-bg: #fff;
  --vb-text: #000000;
  --vb-button: #01684b;
  --vb-accent: #01684b;
  --vb-section-separator: #e5e7eb;
}

:root.dark,
html.dark,
:host(.dark) {
  --primary: #16c090;
  --ai-tag-bg: #141414;
  --member-bg: #153b75;
  --customer-bg: #2a3846;
  --vb-bg: #141414;
  --vb-secondary-bg: #141414;
  --vb-text: #ffffff;
   --vb-button: #16c090;
  --vb-accent: #16c090;
  --vb-section-separator: #414243;
}

/* Scrollbar */

:host {
  --scrollbar-width: 8px;
  --scrollbar-height: 8px;
  --scrollbar-radius: 4px;
  --scrollbar-border-width: 2px;
}


/* Light mode */
:host ::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-height);
}

:host ::-webkit-scrollbar-track {
  background: #ffffff;
}

:host ::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: var(--scrollbar-radius);
  border: 2px solid #ffffff;
}

:host {
  scrollbar-width: thin;
  scrollbar-color: #dbdcde #ffffff;
}

/* Dark mode */
:host(.dark) ::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-height);
}

:host(.dark) ::-webkit-scrollbar-track {
  background: #141414;
}

:host(.dark) ::-webkit-scrollbar-thumb {
  background-color: #3b3c3f;
  border-radius: var(--scrollbar-radius);
  border: 2px solid #141414;
}

:host(.dark) {
  scrollbar-width: thin;
  scrollbar-color: #3b3c3f #141414;
}
`
