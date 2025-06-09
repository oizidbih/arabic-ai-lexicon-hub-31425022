import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Term } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface EditTermFormProps {
  term: Term;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTermForm: React.FC<EditTermFormProps> = ({
  term,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    english_term: term.english_term,
    arabic_term: term.arabic_term || "",
    description_en: term.description_en || "",
    description_ar: term.description_ar || "",
    change_reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: t("error"),
        description: t("mustBeLoggedInToEdit"),
        variant: "destructive",
      });
      return;
    }

    // Check if any changes were made
    const hasChanges =
      formData.english_term !== term.english_term ||
      formData.arabic_term !== (term.arabic_term || "") ||
      formData.description_en !== (term.description_en || "") ||
      formData.description_ar !== (term.description_ar || "");

    if (!hasChanges) {
      toast({
        title: t("Warning"),
        description: t("No changes detected"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const termData = {
        english_term: formData.english_term,
        arabic_term: formData.arabic_term,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        status: "pending",
        // Store the change reason in the description_en field if it exists
        ...(formData.change_reason && {
          description_en: `${formData.description_en || ""}\n\nReason for edit: ${formData.change_reason}`
        })
      };

      const { error } = await supabase
        .from("terms")
        .insert([termData]);

      if (error) throw error;

      toast({
        title: t("Success"),
        description: t("Edit suggestion submitted"),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting edit suggestion:", error);
      toast({
        title: t("Error"),
        description: t("Error submitting edit"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
          <CardTitle
            className={`text-xl text-slate-800 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("editTerm")}
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
                {t("englishDefinition")}
              </label>
              <Textarea
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
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
                  setFormData({ ...formData, description_ar: e.target.value })
                }
                className="text-right font-arabic"
                dir="rtl"
                rows={3}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 mb-2 ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {t("editReason")}
              </label>
              <Textarea
                value={formData.change_reason}
                onChange={(e) =>
                  setFormData({ ...formData, change_reason: e.target.value })
                }
                placeholder={t("explainEditReason")}
                className={language === "ar" ? "text-right font-arabic" : ""}
                dir={language === "ar" ? "rtl" : "ltr"}
                rows={2}
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
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {isSubmitting ? t("loading") : t("submit")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTermForm;
