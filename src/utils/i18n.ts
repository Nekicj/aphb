import { enApply, kzApply, ruApply } from "~/lib/i18n/apply";
import { en, kz, ru } from "~/lib/i18n/base";
import { enHome, kzHome, ruHome } from "~/lib/i18n/index";

export const languages = {
  en: "en",
  ru: "ru",
  kz: "kz",
};

export const defaultLang = "ru";

export const translations = {
  home: {
    en: enHome,
    kz: kzHome,
    ru: ruHome,
  },
  apply: {
    en: enApply,
    kz: kzApply,
    ru: ruApply,
  },
  base: {
    en,
    ru,
    kz,
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslatedPath(lang: keyof typeof languages) {
  return function translatePath(path: string, l: string = lang) {
    const langRegex = /^\/(en|kz|ru)(\/|$)/;
    // Remove the existing language code if present
    const pathWithoutLang = path.replace(langRegex, '/');
    // If the target language is the default, return the path without the language code
    if (l === defaultLang) {
      return pathWithoutLang;
    } else {
      // Ensure we don't have double slashes after removing the language code
      const normalizedPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
      // Append the new language code
      return `/${l}${normalizedPath}`;
    }
  };
}

type LanguageKey = keyof typeof languages;
type PageKey = keyof typeof translations;

type TranslationKeys<
  Page extends PageKey,
  Lang extends LanguageKey
> = keyof (typeof translations)[Page][Lang];

export function useTranslations<Page extends PageKey, Lang extends LanguageKey>(
  page: Page,
  lang: Lang
) {
  return function t(key: TranslationKeys<Page, Lang>) {
    return translations[page][lang][key];
  };
}
