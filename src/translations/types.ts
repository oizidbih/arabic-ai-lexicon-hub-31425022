export interface TranslationKeys {
  // Common translations
  error: string;
  success: string;
  warning: string;
  loading: string;
  submit: string;
  cancel: string;
  approve: string;
  reject: string;
  add: string;
  edit: string;
  delete: string;
  save: string;
  view: string;
  pending: string;
  approved: string;

  // Form titles
  editTerm: string;
  suggestTranslation: string;
  editSuggestion: string;

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
  suggestionApproved: string;
  suggestionRejected: string;
  suggestionApproveFailed: string;
  suggestionRejectFailed: string;
  editApproved: string;
  editApproveFailed: string;
  editRejected: string;
  editRejectFailed: string;
  editSaved: string;
  editSaveFailed: string;
  confirmApproveAll: string;
  approveAllSuccess: string;
  approveAllError: string;

  // Buttons
  submitEdit: string;
  saveEdits: string;

  // App specific
  appTitle: string;
  tagline: string;
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
  viewAll: string;
  addNew: string;
  feedback: string;
  status: string;
  actions: string;
  allTerms: string;
  pendingEdits: string;

  // Auth specific
  signIn: string;
  signUp: string;
  createAccount: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  email: string;
  password: string;
  fullName: string;
  enterFullName: string;
  enterEmail: string;
  enterPassword: string;
  signOut: string;
  search: string;

  // Admin Panel Specific
  approveAll: string;
  approving: string;
  allSuggestionsApproved: string;
  failedToApproveAll: string;
  adminPanelDescription: string;
  noPendingSuggestions: string;
  noPendingEdits: string;
  noPendingTerms: string;
  reason: string;
  submitted: string;
  suggestedEditForTerm: string;
  suggestedEnglishTerm: string;
  suggestedArabicTranslation: string;
  suggestedEnglishDefinition: string;
  suggestedArabicDefinition: string;
  reasonForEdit: string;
}

export interface Translations {
  en: TranslationKeys;
  ar: TranslationKeys;
}
