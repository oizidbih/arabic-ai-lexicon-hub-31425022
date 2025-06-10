import type { TranslationKeys } from './types'

export const englishTranslations: TranslationKeys = {
  // Common translations
  error: "Error",
  success: "Success",
  warning: "Warning",
  loading: "Loading...",
  submit: "Submit",
  cancel: "Cancel",

  // Form titles
  editTerm: "Edit Term",
  suggestTranslation: "Suggest Translation",

  // Field labels
  englishTerm: "English Term",
  arabicTranslation: "Arabic Translation",
  englishDefinition: "English Definition",
  arabicDefinition: "Arabic Definition",
  category: "Category",
  editReason: "Reason for Edit",

  // Placeholders
  optionalEnglishDefinition: "Optional English definition",
  optionalArabicDefinition: "Optional Arabic definition",
  explainEditReason: "Explain your reason for this edit (optional)",

  // Messages
  pleaseEnterBothTerms: "Please enter both English and Arabic terms.",
  noChangesDetected: "No changes detected.",
  mustBeLoggedInToEdit: "You must be logged in to suggest edits.",
  suggestionSubmitted: "Suggestion submitted successfully!",
  editSuggestionSubmitted: "Edit suggestion submitted successfully!",
  failedToSubmit: "Failed to submit suggestion.",
  errorSubmittingEdit: "Error submitting edit.",

  // Buttons
  submitEdit: "Submit Edit",

  // App specific
  appTitle: "Arabic AI Lexicon",
  tagline: "Empowering Arabic NLP with comprehensive AI terminology",
  searchPlaceholder: "Search for a term...",
  searchInArabic: "Search in Arabic",
  searchInEnglish: "Search in English",
  searchResults: "Search Results",
  noResults: "No results found.",
  addComment: "Add Comment",
  comments: "Comments",
  definition: "Definition",
  adminPanel: "Admin Panel",
  pendingSuggestions: "Pending Suggestions",
  viewAll: "View All",
  addNew: "Add New",
  feedback: "Feedback",
  status: "Status",
  actions: "Actions",
  allTerms: "All Terms",

  // Auth specific
  signIn: "Sign In",
  signUp: "Sign Up",
  createAccount: "Create Account",
  dontHaveAccount: "Don't have an account?",
  alreadyHaveAccount: "Already have an account?",
  email: "Email",
  password: "Password",
  fullName: "Full Name",
  enterFullName: "Enter your full name",
  enterEmail: "Enter your email",
  enterPassword: "Enter your password",
  signOut: "Sign Out",
  search: "Search",

  // Admin Panel Specific
  approveAll: "Approve All",
  approving: "Approving...",
  allSuggestionsApproved: "All suggestions approved successfully",
  failedToApproveAll: "Failed to approve all suggestions",
  adminPanelDescription: "Manage dictionary entries and user suggestions",
  noPendingSuggestions: "No pending suggestions",
  noPendingEdits: "No pending edits",
  noPendingTerms: "No pending terms",
  reason: "Reason",
  submitted: "Submitted: ",
  suggestedEditForTerm: "Suggested edit for term: ",
  suggestedEnglishTerm: "Suggested English Term:",
  suggestedArabicTranslation: "Suggested Arabic Translation:",
  suggestedEnglishDefinition: "Suggested English Definition:",
  suggestedArabicDefinition: "Suggested Arabic Definition:",
  reasonForEdit: "Reason for Edit:",
  pendingEdits: "Pending Edits",

  // Common actions (moved to a more logical place)
  approve: "Approve",
  reject: "Reject",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  view: "View",
  saveEdits: "Save Edits",
  pending: "Pending",
  approved: "Approved",
  editSuggestion: "Edit Suggestion",

  // Existing messages from AdminPanel.tsx
  suggestionApproved: "Suggestion approved and term updated",
  suggestionRejected: "Suggestion rejected",
  suggestionApproveFailed: "Failed to approve suggestion",
  suggestionRejectFailed: "Failed to reject suggestion",
  editApproved: "Edit approved and term updated",
  editApproveFailed: "Failed to approve edit",
  editRejected: "Edit rejected",
  editRejectFailed: "Failed to reject edit",
  editSaved: "Edits saved successfully",
  editSaveFailed: "Failed to save edits",
  confirmApproveAll: "Are you sure you want to approve all pending suggestions?",
  approveAllSuccess: "All suggestions have been approved successfully",
  approveAllError: "Failed to approve all suggestions",
}
