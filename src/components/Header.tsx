
import React from 'react'
import { Search, User, LogOut, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onAdminClick: () => void
  isAdminMode: boolean
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdminMode }) => {
  const { language, toggleLanguage, t, direction } = useLanguage()
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleAdminClick = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (!isAdmin) {
      return
    }
    onAdminClick()
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-400 to-teal-400 p-3 rounded-xl">
              <Search className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
                {t('appTitle')}
              </h1>
              <p className="text-blue-200 text-sm">
                {language === 'en' ? 'Bridging AI terminology across languages' : 'ربط مصطلحات الذكاء الاصطناعي عبر اللغات'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              className="border-blue-300 text-blue-100 hover:bg-blue-800 hover:border-blue-200"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            
            {user ? (
              <>
                <Button
                  onClick={handleAdminClick}
                  variant={isAdminMode ? "default" : "secondary"}
                  className={`flex items-center space-x-2 ${
                    isAdminMode 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600' 
                      : isAdmin 
                        ? 'bg-slate-700 hover:bg-slate-600'
                        : 'bg-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isAdmin}
                >
                  {isAdmin ? <User className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span>{t('adminPanel')}</span>
                </Button>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-300 text-red-100 hover:bg-red-800 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="secondary"
                className="bg-slate-700 hover:bg-slate-600"
              >
                <User className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
