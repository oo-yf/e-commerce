const fs = require("fs");
const path = require("path");

function getJsFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      results = results.concat(getJsFiles(p));
    } else if (p.endsWith(".js")) {
      results.push(p);
    }
  }
  return results;
}

function containsJSX(content) {
  // Heuristic: look for tags like <Div ...> or <div ...>
  // Good enough for renaming purposes; not a full parser.
  return /<\s*[A-Za-z][A-Za-z0-9]*(\s|>|\/>)/.test(content);
}

function findCandidates(srcDir) {
  const jsFiles = getJsFiles(srcDir);
  const candidates = [];
  for (const file of jsFiles) {
    const code = fs.readFileSync(file, "utf8");
    if (containsJSX(code)) {
      candidates.push(file);
    }
  }
  return candidates;
}

function renameFiles(files, dryRun = true) {
  let renamed = 0;
  for (const file of files) {
    const newPath = file.replace(/\.js$/, ".jsx");
    if (fs.existsSync(newPath)) {
      console.log(`[skip] ${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), newPath)} (target exists)`);
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] ${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), newPath)}`);
    } else {
      fs.renameSync(file, newPath);
      console.log(`[renamed] ${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), newPath)}`);
      renamed++;
    }
  }
  return renamed;
}

(function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes("--apply");
  const srcDir = path.join(process.cwd(), "src");

  if (!fs.existsSync(srcDir)) {
    console.error(`src directory not found at: ${srcDir}`);
    process.exit(1);
  }

  console.log(`Scanning for .js files containing JSX under: ${srcDir}`);
  const candidates = findCandidates(srcDir);

  if (candidates.length === 0) {
    console.log("No .js files with JSX were found. Nothing to rename.");
    return;
  }

  console.log(`Found ${candidates.length} candidate(s):`);
  candidates.forEach((f) => console.log(" - " + path.relative(process.cwd(), f)));

  console.log(dryRun ? "\nRunning in DRY RUN mode (no files will be changed)." : "\nApplying renames...");
  const count = renameFiles(candidates, dryRun);

  if (dryRun) {
    console.log("\nTo apply changes, re-run with: node rename-jsx-files.js --apply");
  } else {
    console.log(`\nDone. Renamed ${count} file(s).`);
  }
})();