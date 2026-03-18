import { PropertyValue } from "./PropertyValue.js";
import Language from "./Language.js";

/** @deprecated Use PropertyValue instead */
export class LanguageMap extends Array<Language> {
  /** @deprecated Use the `PropertyValue#getValue` instance method instead */
  static getValue(
    languageCollection: LanguageMap,
    locale?: string
  ): string | null {
    return (languageCollection as PropertyValue).getValue(locale, "<br/>");
  }

  /** @deprecated Use the `PropertyValue#getValues` instance method instead */
  static getValues(
    languageCollection: LanguageMap,
    locale?: string
  ): Array<string | null> {
    return (languageCollection as PropertyValue).getValues(locale);
  }
}
