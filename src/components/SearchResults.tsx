
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { type Word } from '@/lib/supabase'
import SuggestionForm from './SuggestionForm'
import CommentSection from './CommentSection'

interface SearchResultsProps {
  results: Word[]
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const { t, language } = useLanguage()
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50">
        <p className="text-slate-600 text-lg">{t('noResults')}</p>
        <Button
          onClick={() => setShowSuggestionForm(true)}
          className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
        >
          {t('suggestTranslation')}
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-800">
          {t('searchResults')} ({results.length})
        </h3>
        <Button
          onClick={() => setShowSuggestionForm(true)}
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
        >
          {t('suggestTranslation')}
        </Button>
      </div>

      <div className="grid gap-6">
        {results.map((word) => (
          <Card key={word.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-800">{word.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-slate-800 font-arabic text-right">{word.arabic_translation}</span>
                    </div>
                  </CardTitle>
                  {word.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {word.category}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {(word.definition_english || word.definition_arabic) && (
                <div className="mb-4 space-y-2">
                  {word.definition_english && (
                    <p className="text-slate-600">
                      <strong>Definition:</strong> {word.definition_english}
                    </p>
                  )}
                  {word.definition_arabic && (
                    <p className="text-slate-600 text-right font-arabic">
                      <strong>التعريف:</strong> {word.definition_arabic}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWord(selectedWord?.id === word.id ? null : word)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  {t('comments')}
                </Button>
              </div>
              
              {selectedWord?.id === word.id && (
                <div className="mt-4 border-t pt-4">
                  <CommentSection wordId={word.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showSuggestionForm && (
        <SuggestionForm onClose={() => setShowSuggestionForm(false)} />
      )}
    </div>
  )
}

export default SearchResults
