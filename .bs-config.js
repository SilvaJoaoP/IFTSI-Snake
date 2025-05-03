module.exports = {
  server: {
    baseDir: "./",
    routes: {
      "/node_modules": "node_modules",
      "/snake-game": "./",
    },
  },
  files: ["./dist/**/*.js", "./**/*.{html,css}"],
  startPath: "/index.html",
  open: true,
};
