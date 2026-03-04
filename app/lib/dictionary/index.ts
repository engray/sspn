import { pl } from "./pl";

const dictionaries = {
    pl,
    // en: () => import('./en').then((module) => module.en),
};

export type Dictionary = typeof pl;

export function getDictionary(locale: "pl" = "pl"): Dictionary {
    // Currently synchronously returning Polish since it's the default and only.
    // Can be extended to async later for other languages.
    return dictionaries[locale];
}
