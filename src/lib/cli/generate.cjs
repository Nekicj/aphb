const fs = require("fs");
const path = require("path");

// Base directory for i18n files
const i18nDir = path.join(__dirname, "../i18n");
// Target base directory for language-specific pages
const pagesBaseDir = path.join(__dirname, "../../pages");

// Languages to generate pages for
const languages = ["en", "ru", "kz"];
const defaultLang = "ru";

// Read filenames from the i18n directory, ignoring 'base.ts'
const filenames = fs.readdirSync(i18nDir).filter((file) => file !== "base.ts");

// File name mappings for cases where i18n file names don't match page file names
const fileNameMappings = {
  "results": "results-and-tasks"
};

// Iterate over each language
languages.forEach((lang) => {
  if (lang === defaultLang) return;

  // Destination directory for the current language
  const langDir = path.join(pagesBaseDir, lang);

  // Ensure the language directory exists
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  // Iterate over each filename and copy it to the destination with an .astro extension
  filenames.forEach((filename) => {
    const baseFilename = filename.replace(/\.[^/.]+$/, "");
    const sourceFilename = fileNameMappings[baseFilename] || baseFilename;
    
    const sourcePath = path.join(pagesBaseDir, sourceFilename + ".astro");
    const destPath = path.join(langDir, sourceFilename + ".astro");

    // Check if source file exists before copying
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Created ${destPath}`);
    } else {
      console.warn(`Warning: Source file ${sourcePath} does not exist, skipping...`);
    }
  });
});

console.log("Internationalization files generated.");
