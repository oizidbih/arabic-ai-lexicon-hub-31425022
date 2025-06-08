export type Language = 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'

export interface LanguageContextType {
  language: Language
  direction: Direction
  toggleLanguage: () => void
  t: (key: string) => string
}
