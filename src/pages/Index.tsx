
import React, { useState } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import SearchSection from '@/components/SearchSection'
import SearchResults from '@/components/SearchResults'
import AdminPanel from '@/components/AdminPanel'
import { type Term } from '@/lib/supabase'

const Index = () => {
  const [searchResults, setSearchResults] = useState<Term[]>([])
  const [isAdminMode, setIsAdminMode] = useState(false)

  const handleSearchResults = (results: Term[]) => {
    setSearchResults(results)
  }

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode)
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <Header onAdminClick={toggleAdminMode} isAdminMode={isAdminMode} />
        
        <main className="container mx-auto px-4 py-8">
          {isAdminMode ? (
            <AdminPanel />
          ) : (
            <div className="space-y-8">
              <SearchSection onResults={handleSearchResults} />
              {searchResults.length > 0 && (
                <SearchResults results={searchResults} />
              )}
            </div>
          )}
        </main>
        
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400">
              AI Arabic Dictionary - Bridging technology terminology across languages
            </p>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  )
}

export default Index
