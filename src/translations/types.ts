export interface TranslationKeys {
  // Common translations
  error: string;
  success: string;
  warning: string;
  loading: string;
  submit: string;
  cancel: string;

  // Form titles
  editTerm: string;
  suggestTranslation: string;

  // Field labels
  englishTerm: string;
  arabicTranslation: string;
  englishDefinition: string;
  arabicDefinition: string;
  category: string;
  editReason: string;

  // Placeholders
  optionalEnglishDefinition: string;
  optionalArabicDefinition: string;
  explainEditReason: string;

  // Messages
  pleaseEnterBothTerms: string;
  noChangesDetected: string;
  mustBeLoggedInToEdit: string;
  suggestionSubmitted: string;
  editSuggestionSubmitted: string;
  failedToSubmit: string;
  errorSubmittingEdit: string;

  // Buttons
  submitEdit: string;

  // App specific
  appTitle: string;
  searchPlaceholder: string;
  searchInArabic: string;
  searchInEnglish: string;
  searchResults: string;
  noResults: string;
  addComment: string;
  comments: string;
  definition: string;
  adminPanel: string;
  pendingSuggestions: string;
  approve: string;
  reject: string;
  viewAll: string;
  addNew: string;
  feedback: string;
  status: string;
  actions: string;
}

export interface Translations {
  en: TranslationKeys;
  ar: TranslationKeys;
}
