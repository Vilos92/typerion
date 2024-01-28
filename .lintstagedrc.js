// .lintstagedrc.js
const escape = require("shell-quote").quote;

module.exports = {
  "**/*": (filenames) =>
    filenames.map((filename) => `prettier --check "${escape([filename])}"`),
};
