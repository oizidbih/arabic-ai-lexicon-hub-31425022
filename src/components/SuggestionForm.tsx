import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/useLanguage";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface SuggestionFormProps {
  onClose: () => void;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    english_term: "",
    arabic_term: "",
    description_en: "",
    description_ar: "",
    category: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.english_term || !formData.arabic_term) {
      toast({
        title: t("Error"),
        description: t("Please enter both terms"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("terms").insert([formData]);

      if (error) throw error;

      toast({
        title: t("Success"),
        description: t("Term submitted for review"),
      });
      onClose();
    } catch (error) {
      console.error("Error submitting term:", error);
      toast({
        title: t("Error"),
        description: t("Failed to submit"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
          <CardTitle
            className={`text-xl text-slate-800 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("suggestTranslation")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("englishTerm")} *
              </label>
              <Input
                value={formData.english_term}
                onChange={(e) =>
                  setFormData({ ...formData, english_term: e.target.value })
                }
                placeholder="e.g., Machine Learning"
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("arabicTranslation")} *
              </label>
              <Input
                value={formData.arabic_term}
                onChange={(e) =>
                  setFormData({ ...formData, arabic_term: e.target.value })
                }
                placeholder="مثال: تعلم الآلة"
                className="text-right font-arabic"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("category")}
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Machine Learning, NLP, Computer Vision"
                dir={language === "ar" ? "rtl" : "ltr"}
                className={language === "ar" ? "text-right" : ""}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("englishDefinition")}
              </label>
              <Textarea
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description_en: e.target.value,
                  })
                }
                placeholder={t("optionalEnglishDefinition")}
                rows={3}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("arabicDefinition")}
              </label>
              <Textarea
                value={formData.description_ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description_ar: e.target.value,
                  })
                }
                placeholder={t("optionalArabicDefinition")}
                className="text-right font-arabic"
                dir="rtl"
                rows={3}
              />
            </div>

            <div
              className={`flex ${
                language === "ar" ? "flex-row-reverse" : ""
              } justify-end space-x-3 pt-4`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className={language === "ar" ? "ml-3" : "mr-3"}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                {isSubmitting ? t("Loading") : t("Submit")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionForm;
