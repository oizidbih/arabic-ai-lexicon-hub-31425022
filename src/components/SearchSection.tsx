
import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase, type Term } from '@/lib/supabase'

interface SearchSectionProps {
  onResults: (results: Term[]) => void
}

const SearchSection: React.FC<SearchSectionProps> = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { t, language } = useLanguage()
  const isArabic = language === 'ar'

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    console.log('Starting search for:', searchTerm)
    setIsLoading(true)
    
    try {
      // First, let's check what terms exist in the database
      console.log('Checking all terms in database...')
      const { data: allTerms, error: allTermsError } = await supabase
        .from('terms')
        .select('*')
      
      console.log('All terms in database:', allTerms)
      console.log('All terms error:', allTermsError)

      // Check specifically for approved terms
      console.log('Checking approved terms...')
      const { data: approvedTerms, error: approvedError } = await supabase
        .from('terms')
        .select('*')
        .eq('status', 'approved')
      
      console.log('Approved terms:', approvedTerms)
      console.log('Approved terms error:', approvedError)

      // Now try the search - if no approved terms, search all terms
      const searchPattern = `%${searchTerm.trim()}%`
      console.log('Search pattern:', searchPattern)
      
      // Try searching without status filter first
      const { data: searchResults, error: searchError } = await supabase
        .from('terms')
        .select('*')
        .or(`english_term.ilike.${searchPattern},arabic_term.ilike.${searchPattern},description_en.ilike.${searchPattern},description_ar.ilike.${searchPattern}`)

      console.log('Search results (all statuses):', searchResults)
      console.log('Search error:', searchError)

      if (searchError) {
        console.error('Search error:', searchError)
        throw searchError
      }
      
      // If we have results, use them; otherwise try approved only
      let finalResults = searchResults || []
      
      if (finalResults.length === 0) {
        console.log('No results found in general search, trying approved only...')
        const { data: approvedSearchResults, error: approvedSearchError } = await supabase
          .from('terms')
          .select('*')
          .eq('status', 'approved')
          .or(`english_term.ilike.${searchPattern},arabic_term.ilike.${searchPattern},description_en.ilike.${searchPattern},description_ar.ilike.${searchPattern}`)
        
        console.log('Approved search results:', approvedSearchResults)
        finalResults = approvedSearchResults || []
      }
      
      console.log('Final results to display:', finalResults)
      onResults(finalResults)
    } catch (error) {
      console.error('Search failed:', error)
      onResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {language === 'en' ? 'Search AI Terms' : 'البحث في المصطلحات'}
          </h2>
          <p className="text-slate-600">
            {language === 'en' 
              ? 'Find AI terminology in English and Arabic' 
              : 'اعثر على مصطلحات الذكاء الاصطناعي بالإنجليزية والعربية'
            }
          </p>
        </div>
        
        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 ${
            isArabic ? 'right-4' : 'left-4'
          }`} />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`py-6 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-white ${
              isArabic ? 'pr-12 pl-4' : 'pl-12 pr-4'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg px-6 ${
              isArabic ? 'left-2' : 'right-2'
            }`}
          >
            {isLoading ? t('loading') : t('searchInEnglish')}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default SearchSection
