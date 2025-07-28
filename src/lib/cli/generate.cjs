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
    const sourcePath = path.join(
      pagesBaseDir,
      filename.replace(/\.[^/.]+$/, "") + ".astro"
    );
    const destPath = path.join(
      langDir,
      filename.replace(/\.[^/.]+$/, "") + ".astro"
    );

    fs.copyFileSync(sourcePath, destPath);
    console.log(`Created ${destPath}`);
  });
});

console.log("Internationalization files generated.");
