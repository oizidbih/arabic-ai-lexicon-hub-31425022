import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import SearchResults from "@/components/SearchResults";
import AdminPanel from "@/components/AdminPanel";
import { type Term } from "@/lib/supabase";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Term[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { isAdmin } = useAuth();

  const handleSearchResults = (results: Term[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 pb-20">
      <Header onAdminClick={toggleAdminMode} isAdminMode={isAdminMode} />

      <main className="container mx-auto px-4 py-8">
        {isAdminMode && isAdmin ? (
          <AdminPanel />
        ) : (
          <div className="space-y-8">
            <SearchSection onResults={handleSearchResults} />
            {hasSearched && <SearchResults results={searchResults} />}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-8 fixed bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            AI Arabic Dictionary - Bridging technology terminology across
            languages
          </p>
          <p className="text-slate-400 mt-2">
            Powered by{" "}
            <a
              href="https://www.el-technology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-400"
            >
              El Technology
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
