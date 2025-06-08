import { type Translations } from './types'

export const translations: Translations = {
  en: {
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
    editReason: "Edit Reason (Optional)",

    // Placeholders
    optionalEnglishDefinition: "Optional definition in English",
    optionalArabicDefinition: "Optional definition in Arabic",
    explainEditReason: "Explain why you suggest this edit...",

    // Messages
    pleaseEnterBothTerms: "Please fill in both English term and Arabic translation",
    noChangesDetected: "No changes were made",
    mustBeLoggedInToEdit: "You must be logged in to submit edits",
    suggestionSubmitted: "Your suggestion has been submitted for review",
    editSuggestionSubmitted: "Your edit suggestion has been submitted for review",
    failedToSubmit: "Failed to submit suggestion",
    errorSubmittingEdit: "Failed to submit edit",

    // Buttons
    submitEdit: "Submit Edit",
  },
  ar: {
    // Common translations
    error: "خطأ",
    success: "تم بنجاح",
    warning: "تنبيه",
    loading: "جاري التحميل...",
    submit: "إرسال",
    cancel: "إلغاء",

    // Form titles
    editTerm: "تعديل المصطلح",
    suggestTranslation: "اقتراح ترجمة",

    // Field labels
    englishTerm: "المصطلح بالإنجليزية",
    arabicTranslation: "الترجمة بالعربية",
    englishDefinition: "التعريف بالإنجليزية",
    arabicDefinition: "التعريف بالعربية",
    category: "التصنيف",
    editReason: "سبب التعديل (اختياري)",

    // Placeholders
    optionalEnglishDefinition: "تعريف اختياري بالإنجليزية",
    optionalArabicDefinition: "تعريف اختياري بالعربية",
    explainEditReason: "اشرح سبب اقتراحك لهذا التعديل...",

    // Messages
    pleaseEnterBothTerms: "يرجى ملء المصطلح بالإنجليزية والترجمة بالعربية",
    noChangesDetected: "لم يتم إجراء أي تعديلات",
    mustBeLoggedInToEdit: "يجب تسجيل الدخول لإرسال التعديلات",
    suggestionSubmitted: "تم إرسال اقتراحك للمراجعة",
    editSuggestionSubmitted: "تم إرسال اقتراح التعديل للمراجعة",
    failedToSubmit: "فشل في إرسال الاقتراح",
    errorSubmittingEdit: "فشل في إرسال التعديل",

    // Buttons
    submitEdit: "إرسال التعديل",
  },
};
