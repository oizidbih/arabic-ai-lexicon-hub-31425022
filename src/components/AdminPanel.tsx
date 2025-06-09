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
  const [pendingSuggestions, setPendingSuggestions] = useState<SuggestionWithTerm[]>([]);
  const [pendingTerms, setPendingTerms] = useState<Term[]>([]);
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [totalTermsCount, setTotalTermsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<EditingSuggestion | null>(null);
  const [editForm, setEditForm] = useState({
    english_term: "",
    suggested_arabic_term: "",
    description_en: "",
    description_ar: "",
  });

  useEffect(() => {
    loadPendingSuggestions();
    loadPendingTerms();
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
      setPendingSuggestions(suggestionData || []);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingTerms = async () => {
    try {
      const { data, error } = await supabase
        .from("terms")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingTerms(data || []);
    } catch (error) {
      console.error("Error loading pending terms:", error);
    }
  };

  const loadAllTerms = async () => {
    try {
      const { data, count, error } = await supabase
        .from("terms")
        .select("*", { count: "exact" })
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(1000); // Limit to 1000 items for display

      if (error) throw error;
      setAllTerms(data || []);
      setTotalTermsCount(count || 0);
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
        description: t("suggestionApproved"),
      });

      loadPendingSuggestions();
      loadAllTerms();
    } catch (error) {
      console.error("Error approving suggestion:", error);
      toast({
        title: t("error"),
        description: t("suggestionApproveFailed"),
        variant: "destructive",
      });
    }
  };

  const handleApproveTerm = async (term: Term) => {
    try {
      const { error } = await supabase
        .from("terms")
        .update({ status: "approved" })
        .eq("id", term.id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("editApproved"),
      });

      loadPendingTerms();
      loadAllTerms();
    } catch (error) {
      console.error("Error approving term:", error);
      toast({
        title: t("error"),
        description: t("editApproveFailed"),
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
        description: t("suggestionRejected"),
      });

      loadPendingSuggestions();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      toast({
        title: t("error"),
        description: t("suggestionRejectFailed"),
        variant: "destructive",
      });
    }
  };

  const handleRejectTerm = async (termId: string) => {
    try {
      const { error } = await supabase
        .from("terms")
        .update({ status: "rejected" })
        .eq("id", termId);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("editRejected"),
      });

      loadPendingTerms();
    } catch (error) {
      console.error("Error rejecting term:", error);
      toast({
        title: t("error"),
        description: t("editRejectFailed"),
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
        description: t("editSaved"),
      });

      loadPendingSuggestions();
      setEditingSuggestion(null);
    } catch (error) {
      console.error("Error saving edits:", error);
      toast({
        title: t("error"),
        description: t("editSaveFailed"),
        variant: "destructive",
      });
    }
  };

  const handleApproveAllSuggestions = async () => {
    if (!pendingSuggestions.length) return;
    
    setIsApprovingAll(true);
    try {
      // Process all suggestions in parallel
      await Promise.all(
        pendingSuggestions.map(async (suggestion) => {
          if (suggestion.term_id) {
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
          }
        })
      );

      toast({
        title: t("success"),
        description: t("allSuggestionsApproved"),
      });

      loadPendingSuggestions();
      loadAllTerms();
    } catch (error) {
      console.error("Error approving all suggestions:", error);
      toast({
        title: t("error"),
        description: t("failedToApproveAll"),
        variant: "destructive",
      });
    } finally {
      setIsApprovingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {t("adminPanel")}
        </h2>
        <p className="text-slate-600">
          {t("adminPanelDescription")}
        </p>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">
            {t("pendingSuggestions")} ({pendingSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="edits">{t("pendingEdits")} ({pendingTerms.length})</TabsTrigger>
          <TabsTrigger value="terms">
            {t("allTerms")}{totalTermsCount > 0 ? ` (${totalTermsCount})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("pendingSuggestions")}</CardTitle>
                {pendingSuggestions.length > 0 && (
                  <Button
                    onClick={handleApproveAllSuggestions}
                    disabled={isApprovingAll}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isApprovingAll ? t("approving") : t("approveAll")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-slate-500">{t("loading")}</p>
              ) : pendingSuggestions.length === 0 ? (
                <Card className="p-8 text-center bg-slate-50">
                  <p className="text-slate-600">{t("noPendingSuggestions")}</p>
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
                            {t("edit")}
                          </Button>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            {t("pending")}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                      {(suggestion.description_en || suggestion.description_ar) && (
                        <div className="mb-4">
                          {suggestion.description_en && (
                            <p className="text-slate-600 mb-2">
                              <strong>{t("englishDefinition")}:</strong>{" "}
                              {suggestion.description_en}
                            </p>
                          )}
                          {suggestion.description_ar && (
                            <p className="text-slate-600 text-right">
                              <strong>{t("arabicDefinition")}:</strong>{" "}
                              {suggestion.description_ar}
                            </p>
                          )}
                        </div>
                      )}
                      {suggestion.reason && (
                        <div className="mb-4">
                          <p className="text-slate-600">
                            <strong>{t("reason")}:</strong> {suggestion.reason}
                          </p>
                        </div>
                      )}

                      <div className="flex">
                        <Button
                          className="mx-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveSuggestion(suggestion)}
                        >
                          {t("approve")}
                        </Button>
                        <Button
                          className="mx-2"
                          onClick={() => handleRejectSuggestion(suggestion.id)}
                          variant="destructive"
                        >
                          {t("reject")}
                        </Button>
                      </div>

                      <p className="text-xs text-slate-400 mt-3">
                        {t("submitted")}
                        {new Date(suggestion.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edits" className="space-y-4">
          {pendingTerms.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">
                {t("noPendingEdits")}
              </p>
            </Card>
          ) : (
            pendingTerms.map((term) => (
              <Card key={term.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span>{term.english_term}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-right font-arabic">
                        {term.arabic_term}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`bg-orange-100 text-orange-800 ${
                        language === "ar" ? "font-arabic" : ""
                      }`}
                    >
                      {t("pending")}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    {term.description_en && (
                      <div>
                        <strong>{t("englishDefinition")}</strong>{" "}
                        {term.description_en}
                      </div>
                    )}
                    {term.description_ar && (
                      <div className={language === "ar" ? "text-right" : ""}>
                        <strong>{t("arabicDefinition")}</strong>{" "}
                        {term.description_ar}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="mx-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveTerm(term)}
                    >
                      <span className={language === "ar" ? "font-arabic" : ""}>
                        {t("approve")}
                      </span>
                    </Button>
                    <Button
                      className="mx-2"
                      onClick={() => handleRejectTerm(term.id)}
                      variant="destructive"
                    >
                      <span className={language === "ar" ? "font-arabic" : ""}>
                        {t("reject")}
                      </span>
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 mt-3">
                    {t("submitted")}{" "}
                    {new Date(term.created_at).toLocaleDateString(
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
                      {t("approved")}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4">
                  {term.category && (
                    <Badge variant="outline" className="mb-2">
                      {t("category")}
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
                {t("editSuggestion")}
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
                    {t("englishTerm")} *
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
                    {t("arabicTranslation")} *
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
                        {t("englishDefinition")}
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
                        {t("arabicDefinition")}
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
                    {t("saveEdits")}
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
