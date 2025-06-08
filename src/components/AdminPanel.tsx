import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";
import {
  supabase,
  type Suggestion,
  type Term,
  type EditSuggestion,
} from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface SuggestionWithTerm extends Suggestion {
  terms: {
    english_term: string;
  };
  // Add optional fields for pending terms
  english_term?: string;
  description_en?: string;
  description_ar?: string;
}

interface EditingSuggestion extends SuggestionWithTerm {
  is_term: boolean; // true if it's a pending term, false if it's a suggestion
}

const AdminPanel: React.FC = () => {
  const { t, language } = useLanguage();
  const [pendingSuggestions, setPendingSuggestions] = useState<
    SuggestionWithTerm[]
  >([]);
  const [pendingEdits, setPendingEdits] = useState<EditSuggestion[]>([]);
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSuggestion, setEditingSuggestion] =
    useState<EditingSuggestion | null>(null);
  const [editForm, setEditForm] = useState({
    english_term: "",
    suggested_arabic_term: "",
    description_en: "",
    description_ar: "",
  });

  useEffect(() => {
    loadPendingSuggestions();
    loadPendingEdits();
    loadAllTerms();
  }, []);

  const loadPendingSuggestions = async () => {
    setIsLoading(true);
    try {
      // Load pending suggestions from suggestions table
      const { data: suggestionData, error: suggestionError } = await supabase
        .from("suggestions")
        .select(
          `
          *,
          terms:terms(english_term)
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (suggestionError) throw suggestionError;

      // Load pending terms from terms table
      const { data: pendingTermsData, error: termsError } = await supabase
        .from("terms")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (termsError) throw termsError;

      // Convert pending terms to the same format as suggestions
      const pendingTermsAsSuggestions: SuggestionWithTerm[] = (
        pendingTermsData || []
      ).map((term) => ({
        id: term.id,
        term_id: term.id,
        suggested_arabic_term: term.arabic_term || "",
        status: "pending",
        created_at: term.created_at,
        terms: {
          english_term: term.english_term,
        },
      }));

      // Combine both types of pending items
      setPendingSuggestions([
        ...(suggestionData || []),
        ...pendingTermsAsSuggestions,
      ]);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingEdits = async () => {
    try {
      const { data, error } = await supabase
        .from("edit_suggestions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingEdits(data || []);
    } catch (error) {
      console.error("Error loading edit suggestions:", error);
    }
  };

  const loadAllTerms = async () => {
    try {
      const { data, error } = await supabase
        .from("terms")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllTerms(data || []);
    } catch (error) {
      console.error("Error loading terms:", error);
    }
  };

  const handleApproveSuggestion = async (suggestion: Suggestion) => {
    try {
      // Update the existing term with the suggested Arabic translation
      const { error: updateError } = await supabase
        .from("terms")
        .update({
          arabic_term: suggestion.suggested_arabic_term,
          status: "approved",
        })
        .eq("id", suggestion.term_id);

      if (updateError) throw updateError;

      // Update suggestion status
      const { error: suggestionError } = await supabase
        .from("suggestions")
        .update({ status: "approved" })
        .eq("id", suggestion.id);

      if (suggestionError) throw suggestionError;

      toast({
        title: t("success"),
        description: "Suggestion approved and term updated",
      });

      loadPendingSuggestions();
      loadAllTerms();
    } catch (error) {
      console.error("Error approving suggestion:", error);
      toast({
        title: t("error"),
        description: "Failed to approve suggestion",
        variant: "destructive",
      });
    }
  };

  const handleApproveEdit = async (editSuggestion: EditSuggestion) => {
    try {
      const updateData: Partial<Term> = {};

      if (editSuggestion.suggested_english_term) {
        updateData.english_term = editSuggestion.suggested_english_term;
      }
      if (editSuggestion.suggested_arabic_term) {
        updateData.arabic_term = editSuggestion.suggested_arabic_term;
      }
      if (editSuggestion.suggested_description_en !== undefined) {
        updateData.description_en = editSuggestion.suggested_description_en;
      }
      if (editSuggestion.suggested_description_ar !== undefined) {
        updateData.description_ar = editSuggestion.suggested_description_ar;
      }

      // Update the term
      const { error: updateError } = await supabase
        .from("terms")
        .update(updateData)
        .eq("id", editSuggestion.term_id);

      if (updateError) throw updateError;

      // Update edit suggestion status
      const { error: suggestionError } = await supabase
        .from("edit_suggestions")
        .update({ status: "approved" })
        .eq("id", editSuggestion.id);

      if (suggestionError) throw suggestionError;

      toast({
        title: t("success"),
        description: "تم قبول التعديل وتحديث المصطلح",
      });

      loadPendingEdits();
      loadAllTerms();
    } catch (error) {
      console.error("Error approving edit:", error);
      toast({
        title: t("error"),
        description: "فشل في قبول التعديل",
        variant: "destructive",
      });
    }
  };

  const handleRejectSuggestion = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from("suggestions")
        .update({ status: "rejected" })
        .eq("id", suggestionId);

      if (error) throw error;

      toast({
        title: t("success"),
        description: "Suggestion rejected",
      });

      loadPendingSuggestions();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      toast({
        title: t("error"),
        description: "Failed to reject suggestion",
        variant: "destructive",
      });
    }
  };

  const handleRejectEdit = async (editId: string) => {
    try {
      const { error } = await supabase
        .from("edit_suggestions")
        .update({ status: "rejected" })
        .eq("id", editId);

      if (error) throw error;

      toast({
        title: t("success"),
        description: "تم رفض التعديل",
      });

      loadPendingEdits();
    } catch (error) {
      console.error("Error rejecting edit:", error);
      toast({
        title: t("error"),
        description: "فشل في رفض التعديل",
        variant: "destructive",
      });
    }
  };

  const handleEditSuggestion = (
    suggestion: SuggestionWithTerm,
    is_term: boolean
  ) => {
    setEditingSuggestion({ ...suggestion, is_term });
    setEditForm({
      english_term: is_term
        ? suggestion.english_term || ""
        : suggestion.terms?.english_term || "",
      suggested_arabic_term: suggestion.suggested_arabic_term || "",
      description_en: suggestion.description_en || "",
      description_ar: suggestion.description_ar || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingSuggestion) return;

    try {
      if (editingSuggestion.is_term) {
        // Update the pending term
        const { error } = await supabase
          .from("terms")
          .update({
            english_term: editForm.english_term,
            arabic_term: editForm.suggested_arabic_term,
            description_en: editForm.description_en,
            description_ar: editForm.description_ar,
          })
          .eq("id", editingSuggestion.id);

        if (error) throw error;
      } else {
        // Update the suggestion and its term
        // First update the term's English name
        let error = null;
        if (editForm.english_term !== editingSuggestion.terms?.english_term) {
          const { error: termError } = await supabase
            .from("terms")
            .update({
              english_term: editForm.english_term,
            })
            .eq("id", editingSuggestion.term_id);
          error = termError;
        }

        if (!error) {
          // Then update the suggestion
          const { error: suggestionError } = await supabase
            .from("suggestions")
            .update({
              suggested_arabic_term: editForm.suggested_arabic_term,
            })
            .eq("id", editingSuggestion.id);
          error = suggestionError;
        }

        if (error) throw error;
      }

      toast({
        title: t("success"),
        description: "تم حفظ التعديلات بنجاح",
      });

      loadPendingSuggestions();
      setEditingSuggestion(null);
    } catch (error) {
      console.error("Error saving edits:", error);
      toast({
        title: t("error"),
        description: "فشل في حفظ التعديلات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {t("adminPanel")}
        </h2>
        <p className="text-slate-600">
          {language === "ar"
            ? "إدارة إدخالات القاموس واقتراحات المستخدمين"
            : "Manage dictionary entries and user suggestions"}
        </p>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">
            {t("pendingSuggestions")} ({pendingSuggestions.length})
          </TabsTrigger>
          <TabsTrigger
            value="edits"
            className={language === "ar" ? "font-arabic" : ""}
          >
            {language === "en"
              ? `Pending Edits (${pendingEdits.length})`
              : `تعديلات معلقة (${pendingEdits.length})`}
          </TabsTrigger>
          <TabsTrigger value="terms">
            {t("viewAll")} ({allTerms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-slate-500">{t("loading")}</p>
          ) : pendingSuggestions.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">No pending suggestions</p>
            </Card>
          ) : (
            pendingSuggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="border-l-4 border-l-yellow-500"
              >
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span>
                        {suggestion.terms?.english_term ||
                          suggestion.english_term}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">
                        {suggestion.suggested_arabic_term}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleEditSuggestion(
                            suggestion,
                            !!suggestion.english_term
                          )
                        }
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {language === "ar" ? "تعديل" : t("edit")}
                      </Button>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        {language === "ar" ? "معلق" : "Pending"}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  {(suggestion.description_en || suggestion.description_ar) && (
                    <div className="mb-4">
                      {suggestion.description_en && (
                        <p className="text-slate-600 mb-2">
                          <strong>English Definition:</strong>{" "}
                          {suggestion.description_en}
                        </p>
                      )}
                      {suggestion.description_ar && (
                        <p className="text-slate-600 text-right">
                          <strong>التعريف بالعربية:</strong>{" "}
                          {suggestion.description_ar}
                        </p>
                      )}
                    </div>
                  )}
                  {suggestion.reason && (
                    <div className="mb-4">
                      <p className="text-slate-600">
                        <strong>Reason:</strong> {suggestion.reason}
                      </p>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      language === "ar"
                        ? "space-x-reverse space-x-3"
                        : "space-x-3"
                    }`}
                  >
                    <Button
                      onClick={() => handleApproveSuggestion(suggestion)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t("approve")}
                    </Button>
                    <Button
                      onClick={() => handleRejectSuggestion(suggestion.id)}
                      variant="destructive"
                    >
                      {t("reject")}
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 mt-3">
                    {language === "ar" ? "تاريخ الإرسال: " : "Submitted: "}
                    {new Date(suggestion.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="edits" className="space-y-4">
          {pendingEdits.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">
                {language === "en"
                  ? "No pending edits"
                  : "لا توجد تعديلات معلقة"}
              </p>
            </Card>
          ) : (
            pendingEdits.map((edit) => (
              <Card key={edit.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {language === "en"
                        ? `Suggested edit for term: ${edit.term_id}`
                        : `تعديل مقترح للمصطلح: ${edit.term_id}`}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`bg-orange-100 text-orange-800 ${
                        language === "ar" ? "font-arabic" : ""
                      }`}
                    >
                      {language === "en" ? "Pending" : "معلق"}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    {edit.suggested_english_term && (
                      <div>
                        <strong>
                          {language === "en"
                            ? "Suggested English Term:"
                            : "المصطلح الإنجليزي المقترح:"}
                        </strong>{" "}
                        {edit.suggested_english_term}
                      </div>
                    )}
                    {edit.suggested_arabic_term && (
                      <div className={language === "ar" ? "text-right" : ""}>
                        <strong>
                          {language === "en"
                            ? "Suggested Arabic Translation:"
                            : "الترجمة العربية المقترحة:"}
                        </strong>{" "}
                        {edit.suggested_arabic_term}
                      </div>
                    )}
                    {edit.suggested_description_en && (
                      <div>
                        <strong>
                          {language === "en"
                            ? "Suggested English Definition:"
                            : "التعريف الإنجليزي المقترح:"}
                        </strong>{" "}
                        {edit.suggested_description_en}
                      </div>
                    )}
                    {edit.suggested_description_ar && (
                      <div className={language === "ar" ? "text-right" : ""}>
                        <strong>
                          {language === "en"
                            ? "Suggested Arabic Definition:"
                            : "التعريف العربي المقترح:"}
                        </strong>{" "}
                        {edit.suggested_description_ar}
                      </div>
                    )}
                    {edit.change_reason && (
                      <div>
                        <strong>
                          {language === "en"
                            ? "Reason for Edit:"
                            : "سبب التعديل:"}
                        </strong>{" "}
                        {edit.change_reason}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApproveEdit(edit)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <span className={language === "ar" ? "font-arabic" : ""}>
                        {language === "en" ? "Approve" : "قبول"}
                      </span>
                    </Button>
                    <Button
                      onClick={() => handleRejectEdit(edit.id)}
                      variant="destructive"
                    >
                      <span className={language === "ar" ? "font-arabic" : ""}>
                        {language === "en" ? "Reject" : "رفض"}
                      </span>
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 mt-3">
                    {language === "en" ? "Submitted: " : "تاريخ الإرسال: "}{" "}
                    {new Date(edit.created_at).toLocaleDateString(
                      language === "en" ? "en-US" : "ar-SA"
                    )}
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
                      <span className="text-right font-arabic">
                        {term.arabic_term}
                      </span>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      approved
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
                        <p className="text-slate-600 text-right font-arabic">
                          {term.description_ar}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Suggestion Dialog */}
      {editingSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle
                className={`text-xl text-slate-800 ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {language === "en" ? "Edit Suggestion" : "تعديل الاقتراح"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    English Term *
                  </label>
                  <Input
                    value={editForm.english_term}
                    onChange={(e) =>
                      setEditForm({ ...editForm, english_term: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Arabic Translation *
                  </label>
                  <Input
                    value={editForm.suggested_arabic_term}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        suggested_arabic_term: e.target.value,
                      })
                    }
                    className="text-right font-arabic"
                    required
                  />
                </div>

                {editingSuggestion.is_term && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        English Definition
                      </label>
                      <Textarea
                        value={editForm.description_en}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description_en: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Arabic Definition
                      </label>
                      <Textarea
                        value={editForm.description_ar}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description_ar: e.target.value,
                          })
                        }
                        className="text-right font-arabic"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingSuggestion(null)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <span className="font-arabic">حفظ التعديلات</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
