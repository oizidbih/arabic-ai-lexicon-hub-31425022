import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Term } from "@/lib/supabase";

interface SearchSectionProps {
  onResults: (results: Term[]) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isArabic = language === "ar";

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    console.log("Starting search for:", searchTerm);
    setIsLoading(true);

    try {
      const searchPattern = `%${searchTerm.trim()}%`;
      console.log("Search pattern:", searchPattern);

      // Build the base query
      let query = supabase
        .from("terms")
        .select("*")
        .or(
          `english_term.ilike.${searchPattern},` +
            `arabic_term.ilike.${searchPattern},` +
            `description_en.ilike.${searchPattern},` +
            `description_ar.ilike.${searchPattern}`
        );

      // If user is not logged in, only show approved terms
      // If user is logged in, show approved, pending and rejected terms
      if (!user) {
        query = query.eq("status", "approved");
      }

      console.log("User auth state:", user ? "logged in" : "logged out");
      const { data: searchResults, error: searchError } = await query;

      console.log("Search results:", searchResults);

      if (searchError) {
        console.error("Search error:", searchError);
        throw searchError;
      }

      onResults(searchResults || []);
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {language === "en" ? "Search AI Terms" : "البحث في المصطلحات"}
          </h2>
          <p className="text-slate-600">
            {language === "en"
              ? "Find AI terminology in English and Arabic"
              : "اعثر على مصطلحات الذكاء الاصطناعي بالإنجليزية والعربية"}
          </p>
        </div>

        <div className="relative">
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 ${
              isArabic ? "right-4" : "left-4"
            }`}
          />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`py-6 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-white ${
              isArabic ? "pr-12 pl-4" : "pl-12 pr-4"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-blue-600 rounded-lg px-6 ${
              isArabic ? "left-2" : "right-2"
            }`}
          >
            {isLoading ? t("loading") : t("searchInEnglish")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchSection;
