import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { type Term } from '@/lib/supabase'
import SuggestionForm from './SuggestionForm'
import CommentSection from './CommentSection'
import EditTermForm from './EditTermForm'

interface SearchResultsProps {
  results: Term[]
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50">
        <p className={`text-slate-600 text-lg ${language === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>
          {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
        </p>
        <Button
          onClick={() => setShowSuggestionForm(true)}
          className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
        >
          {language === 'ar' ? 'اقتراح ترجمة' : 'Suggest Translation'}
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
        {results.map((term) => (
          <Card key={term.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-800">{term.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-slate-800 font-arabic text-right">{term.arabic_term}</span>
                    </div>
                  </CardTitle>
                  {term.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {term.category}
                    </Badge>
                  )}
                </div>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTerm(term)}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {(term.description_en || term.description_ar) && (
                <div className="mb-4 space-y-2">
                  {term.description_en && (
                    <p className="text-slate-600">
                      <strong>Definition:</strong> {term.description_en}
                    </p>
                  )}
                  {term.description_ar && (
                    <p className="text-slate-600 text-right font-arabic">
                      <strong>التعريف:</strong> {term.description_ar}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTerm(selectedTerm?.id === term.id ? null : term)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  {t('comments')}
                </Button>
              </div>
              
              {selectedTerm?.id === term.id && (
                <div className="mt-4 border-t pt-4">
                  <CommentSection termId={term.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showSuggestionForm && (
        <SuggestionForm onClose={() => setShowSuggestionForm(false)} />
      )}

      {editingTerm && (
        <EditTermForm 
          term={editingTerm}
          onClose={() => setEditingTerm(null)}
          onSuccess={() => {
            // Optionally refresh results or show success message
          }}
        />
      )}
    </div>
  )
}

export default SearchResults
