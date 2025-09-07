const fs = require("fs");
const path = require("path");

// Recursively collect .js files under src
function getJsFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getJsFiles(filePath));
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  });
  return results;
}

// Detect if file contains JSX
function containsJSX(content) {
  // naive check: if file has <Something> that's not a comment/string
  return /<([A-Za-z][A-Za-z0-9]*)\s*[^>]*>/.test(content);
}

const srcDir = path.join(__dirname, "src");
const jsFiles = getJsFiles(srcDir);

const jsxCandidates = [];

jsFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  if (containsJSX(content)) {
    jsxCandidates.push(file);
  }
});

if (jsxCandidates.length === 0) {
  console.log("✅ No .js files contain JSX. All good!");
} else {
  console.log("⚠️ These .js files contain JSX and should probably be renamed to .jsx:");
  jsxCandidates.forEach((f) => console.log(" - " + path.relative(srcDir, f)));
}