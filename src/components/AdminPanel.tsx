import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase, type Suggestion, type Term, type EditSuggestion } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

const AdminPanel: React.FC = () => {
  const { t } = useLanguage()
  const [pendingSuggestions, setPendingSuggestions] = useState<Suggestion[]>([])
  const [pendingEdits, setPendingEdits] = useState<EditSuggestion[]>([])
  const [allTerms, setAllTerms] = useState<Term[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPendingSuggestions()
    loadPendingEdits()
    loadAllTerms()
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

  const loadPendingEdits = async () => {
    try {
      const { data, error } = await supabase
        .from('edit_suggestions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingEdits(data || [])
    } catch (error) {
      console.error('Error loading edit suggestions:', error)
    }
  }

  const loadAllTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllTerms(data || [])
    } catch (error) {
      console.error('Error loading terms:', error)
    }
  }

  const handleApproveSuggestion = async (suggestion: Suggestion) => {
    try {
      // Update the existing term with the suggested Arabic translation
      const { error: updateError } = await supabase
        .from('terms')
        .update({ 
          arabic_term: suggestion.suggested_arabic_term,
          status: 'approved'
        })
        .eq('id', suggestion.term_id)

      if (updateError) throw updateError

      // Update suggestion status
      const { error: suggestionError } = await supabase
        .from('suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.id)

      if (suggestionError) throw suggestionError

      toast({
        title: t('success'),
        description: "Suggestion approved and term updated"
      })

      loadPendingSuggestions()
      loadAllTerms()
    } catch (error) {
      console.error('Error approving suggestion:', error)
      toast({
        title: t('error'),
        description: "Failed to approve suggestion",
        variant: "destructive"
      })
    }
  }

  const handleApproveEdit = async (editSuggestion: EditSuggestion) => {
    try {
      const updateData: any = {}
      
      if (editSuggestion.suggested_english_term) {
        updateData.english_term = editSuggestion.suggested_english_term
      }
      if (editSuggestion.suggested_arabic_term) {
        updateData.arabic_term = editSuggestion.suggested_arabic_term
      }
      if (editSuggestion.suggested_description_en !== undefined) {
        updateData.description_en = editSuggestion.suggested_description_en
      }
      if (editSuggestion.suggested_description_ar !== undefined) {
        updateData.description_ar = editSuggestion.suggested_description_ar
      }

      // Update the term
      const { error: updateError } = await supabase
        .from('terms')
        .update(updateData)
        .eq('id', editSuggestion.term_id)

      if (updateError) throw updateError

      // Update edit suggestion status
      const { error: suggestionError } = await supabase
        .from('edit_suggestions')
        .update({ status: 'approved' })
        .eq('id', editSuggestion.id)

      if (suggestionError) throw suggestionError

      toast({
        title: t('success'),
        description: "تم قبول التعديل وتحديث المصطلح"
      })

      loadPendingEdits()
      loadAllTerms()
    } catch (error) {
      console.error('Error approving edit:', error)
      toast({
        title: t('error'),
        description: "فشل في قبول التعديل",
        variant: "destructive"
      })
    }
  }

  const handleRejectSuggestion = async (suggestionId: string) => {
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

  const handleRejectEdit = async (editId: string) => {
    try {
      const { error } = await supabase
        .from('edit_suggestions')
        .update({ status: 'rejected' })
        .eq('id', editId)

      if (error) throw error

      toast({
        title: t('success'),
        description: "تم رفض التعديل"
      })

      loadPendingEdits()
    } catch (error) {
      console.error('Error rejecting edit:', error)
      toast({
        title: t('error'),
        description: "فشل في رفض التعديل",
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">{t('pendingSuggestions')} ({pendingSuggestions.length})</TabsTrigger>
          <TabsTrigger value="edits">تعديلات معلقة ({pendingEdits.length})</TabsTrigger>
          <TabsTrigger value="terms">{t('viewAll')} ({allTerms.length})</TabsTrigger>
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
                      <span>Term ID: {suggestion.term_id}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">{suggestion.suggested_arabic_term}</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  {suggestion.reason && (
                    <div className="mb-4">
                      <p className="text-slate-600">
                        <strong>Reason:</strong> {suggestion.reason}
                      </p>
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

        <TabsContent value="edits" className="space-y-4">
          {pendingEdits.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">لا توجد تعديلات معلقة</p>
            </Card>
          ) : (
            pendingEdits.map((edit) => (
              <Card key={edit.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center justify-between">
                    <span>تعديل مقترح للمصطلح: {edit.term_id}</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      معلق
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    {edit.suggested_english_term && (
                      <div>
                        <strong>المصطلح الإنجليزي المقترح:</strong> {edit.suggested_english_term}
                      </div>
                    )}
                    {edit.suggested_arabic_term && (
                      <div className="text-right">
                        <strong>الترجمة العربية المقترحة:</strong> {edit.suggested_arabic_term}
                      </div>
                    )}
                    {edit.suggested_description_en && (
                      <div>
                        <strong>التعريف الإنجليزي المقترح:</strong> {edit.suggested_description_en}
                      </div>
                    )}
                    {edit.suggested_description_ar && (
                      <div className="text-right">
                        <strong>التعريف العربي المقترح:</strong> {edit.suggested_description_ar}
                      </div>
                    )}
                    {edit.change_reason && (
                      <div>
                        <strong>سبب التعديل:</strong> {edit.change_reason}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApproveEdit(edit)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      قبول
                    </Button>
                    <Button
                      onClick={() => handleRejectEdit(edit.id)}
                      variant="destructive"
                    >
                      رفض
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-3">
                    تاريخ الإرسال: {new Date(edit.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4">
          <div className="grid gap-4">
            {allTerms.map((term) => (
              <Card key={term.id} className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span>{term.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">{term.arabic_term}</span>
                    </div>
                    <Badge 
                      variant={term.status === 'approved' ? 'default' : 'secondary'}
                      className={term.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {term.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  {term.category && (
                    <Badge variant="outline" className="mb-2">
                      {term.category}
                    </Badge>
                  )}
                  
                  {(term.description_en || term.description_ar) && (
                    <div className="space-y-1 text-sm">
                      {term.description_en && (
                        <p className="text-slate-600">{term.description_en}</p>
                      )}
                      {term.description_ar && (
                        <p className="text-slate-600 text-right">{term.description_ar}</p>
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
