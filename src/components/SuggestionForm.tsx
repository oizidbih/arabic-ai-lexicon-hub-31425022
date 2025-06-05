
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface SuggestionFormProps {
  onClose: () => void
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onClose }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    english_term: '',
    suggested_arabic: '',
    definition_english: '',
    definition_arabic: '',
    category: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.english_term || !formData.suggested_arabic) {
      toast({
        title: "Error",
        description: "Please fill in both English term and Arabic translation",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert([{
          ...formData,
          status: 'pending'
        }])

      if (error) throw error

      toast({
        title: t('success'),
        description: "Your suggestion has been submitted for review"
      })
      onClose()
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      toast({
        title: t('error'),
        description: "Failed to submit suggestion",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
          <CardTitle className="text-xl text-slate-800">{t('suggestTranslation')}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('englishTerm')} *
              </label>
              <Input
                value={formData.english_term}
                onChange={(e) => setFormData({ ...formData, english_term: e.target.value })}
                placeholder="e.g., Machine Learning"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('arabicTranslation')} *
              </label>
              <Input
                value={formData.suggested_arabic}
                onChange={(e) => setFormData({ ...formData, suggested_arabic: e.target.value })}
                placeholder="مثال: تعلم الآلة"
                className="text-right"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('category')}
              </label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Machine Learning, NLP, Computer Vision"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Definition (English)
              </label>
              <Textarea
                value={formData.definition_english}
                onChange={(e) => setFormData({ ...formData, definition_english: e.target.value })}
                placeholder="Optional definition in English"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                التعريف (العربية)
              </label>
              <Textarea
                value={formData.definition_arabic}
                onChange={(e) => setFormData({ ...formData, definition_arabic: e.target.value })}
                placeholder="تعريف اختياري بالعربية"
                className="text-right"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                {isSubmitting ? t('loading') : t('submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuggestionForm
