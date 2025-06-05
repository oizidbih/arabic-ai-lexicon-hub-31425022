
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase, type Suggestion, type Word } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

const AdminPanel: React.FC = () => {
  const { t } = useLanguage()
  const [pendingSuggestions, setPendingSuggestions] = useState<Suggestion[]>([])
  const [allWords, setAllWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPendingSuggestions()
    loadAllWords()
  }, [])

  const loadPendingSuggestions = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingSuggestions(data || [])
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAllWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllWords(data || [])
    } catch (error) {
      console.error('Error loading words:', error)
    }
  }

  const handleApproveSuggestion = async (suggestion: Suggestion) => {
    try {
      // Add to words table
      const { error: insertError } = await supabase
        .from('words')
        .insert([{
          english_term: suggestion.english_term,
          arabic_translation: suggestion.suggested_arabic,
          definition_english: suggestion.definition_english,
          definition_arabic: suggestion.definition_arabic,
          category: suggestion.category,
          status: 'approved'
        }])

      if (insertError) throw insertError

      // Update suggestion status
      const { error: updateError } = await supabase
        .from('suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.id)

      if (updateError) throw updateError

      toast({
        title: t('success'),
        description: "Suggestion approved and added to dictionary"
      })

      loadPendingSuggestions()
      loadAllWords()
    } catch (error) {
      console.error('Error approving suggestion:', error)
      toast({
        title: t('error'),
        description: "Failed to approve suggestion",
        variant: "destructive"
      })
    }
  }

  const handleRejectSuggestion = async (suggestionId: number) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ status: 'rejected' })
        .eq('id', suggestionId)

      if (error) throw error

      toast({
        title: t('success'),
        description: "Suggestion rejected"
      })

      loadPendingSuggestions()
    } catch (error) {
      console.error('Error rejecting suggestion:', error)
      toast({
        title: t('error'),
        description: "Failed to reject suggestion",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('adminPanel')}</h2>
        <p className="text-slate-600">Manage dictionary entries and user suggestions</p>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions">{t('pendingSuggestions')} ({pendingSuggestions.length})</TabsTrigger>
          <TabsTrigger value="words">{t('viewAll')} ({allWords.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-slate-500">{t('loading')}</p>
          ) : pendingSuggestions.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">No pending suggestions</p>
            </Card>
          ) : (
            pendingSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-yellow-500">
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span>{suggestion.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">{suggestion.suggested_arabic}</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  {suggestion.category && (
                    <Badge variant="outline" className="mb-3">
                      {suggestion.category}
                    </Badge>
                  )}
                  
                  {(suggestion.definition_english || suggestion.definition_arabic) && (
                    <div className="mb-4 space-y-2">
                      {suggestion.definition_english && (
                        <p className="text-slate-600">
                          <strong>Definition:</strong> {suggestion.definition_english}
                        </p>
                      )}
                      {suggestion.definition_arabic && (
                        <p className="text-slate-600 text-right">
                          <strong>التعريف:</strong> {suggestion.definition_arabic}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApproveSuggestion(suggestion)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t('approve')}
                    </Button>
                    <Button
                      onClick={() => handleRejectSuggestion(suggestion.id)}
                      variant="destructive"
                    >
                      {t('reject')}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-3">
                    Submitted: {new Date(suggestion.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="words" className="space-y-4">
          <div className="grid gap-4">
            {allWords.map((word) => (
              <Card key={word.id} className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span>{word.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">{word.arabic_translation}</span>
                    </div>
                    <Badge 
                      variant={word.status === 'approved' ? 'default' : 'secondary'}
                      className={word.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {word.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  {word.category && (
                    <Badge variant="outline" className="mb-2">
                      {word.category}
                    </Badge>
                  )}
                  
                  {(word.definition_english || word.definition_arabic) && (
                    <div className="space-y-1 text-sm">
                      {word.definition_english && (
                        <p className="text-slate-600">{word.definition_english}</p>
                      )}
                      {word.definition_arabic && (
                        <p className="text-slate-600 text-right">{word.definition_arabic}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPanel
