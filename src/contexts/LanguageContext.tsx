
import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar'
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
  language: Language
  direction: Direction
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    appTitle: 'AI Arabic Dictionary',
    searchPlaceholder: 'Search for AI terms...',
    searchInArabic: 'Search in Arabic',
    searchInEnglish: 'Search in English',
    searchResults: 'Search Results',
    noResults: 'No results found',
    suggestTranslation: 'Suggest Translation',
    addComment: 'Add Comment',
    comments: 'Comments',
    englishTerm: 'English Term',
    arabicTranslation: 'Arabic Translation',
    definition: 'Definition',
    category: 'Category',
    submit: 'Submit',
    cancel: 'Cancel',
    adminPanel: 'Admin Panel',
    pendingSuggestions: 'Pending Suggestions',
    approve: 'Approve',
    reject: 'Reject',
    viewAll: 'View All Terms',
    addNew: 'Add New Term',
    feedback: 'Feedback',
    status: 'Status',
    actions: 'Actions',
    loading: 'Loading...',
    success: 'Success!',
    error: 'An error occurred'
  },
  ar: {
    appTitle: 'قاموس الذكاء الاصطناعي العربي',
    searchPlaceholder: 'ابحث عن مصطلحات الذكاء الاصطناعي...',
    searchInArabic: 'البحث بالعربية',
    searchInEnglish: 'البحث بالإنجليزية',
    searchResults: 'نتائج البحث',
    noResults: 'لم يتم العثور على نتائج',
    suggestTranslation: 'اقتراح ترجمة',
    addComment: 'إضافة تعليق',
    comments: 'التعليقات',
    englishTerm: 'المصطلح الإنجليزي',
    arabicTranslation: 'الترجمة العربية',
    definition: 'التعريف',
    category: 'الفئة',
    submit: 'إرسال',
    cancel: 'إلغاء',
    adminPanel: 'لوحة الإدارة',
    pendingSuggestions: 'الاقتراحات المعلقة',
    approve: 'موافقة',
    reject: 'رفض',
    viewAll: 'عرض جميع المصطلحات',
    addNew: 'إضافة مصطلح جديد',
    feedback: 'التقييم',
    status: 'الحالة',
    actions: 'الإجراءات',
    loading: 'جارٍ التحميل...',
    success: 'نجح!',
    error: 'حدث خطأ'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
