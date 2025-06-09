import React from "react";
import { Search, User, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { englishTranslations } from "@/translations/en";
import { arabicTranslations } from "@/translations/ar";

interface HeaderProps {
  onAdminClick: () => void;
  isAdminMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdminMode }) => {
  const { language, toggleLanguage, direction } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const t = language === "en" ? englishTranslations : arabicTranslations;

  const handleAdminClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      return;
    }
    onAdminClick();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r from-blue-400 to-teal-400 p-3 rounded-xl ${language === "ar" ? "ml-4" : "mr-4"}`}>
              <Search className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {t.appTitle}
              </h1>
              <p
                className={`text-blue-200 text-sm ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {t.tagline}
              </p>
            </div>
          </div>

          <div className={`flex items-center space-x-4${language === "ar" ? " space-x-reverse" : ""}`}>
            <Button
              onClick={toggleLanguage}
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:border-white/50 font-medium"
            >
              {language === "en" ? "العربية" : "English"}
            </Button>

            {user ? (
              <>
                <Button
                  onClick={handleAdminClick}
                  variant={isAdminMode ? "default" : "secondary"}
                  className={`flex items-center space-x-2 font-medium ${
                    isAdminMode
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                      : isAdmin
                      ? "bg-white/20 hover:bg-white/30 text-white border-white/30"
                      : "bg-slate-600/50 opacity-50 cursor-not-allowed text-white/70"
                  }`}
                  disabled={!isAdmin}
                >
                  {isAdmin ? (
                    isAdminMode ? (
                      <Search className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>
                    {isAdminMode ? t.search : t.adminPanel}
                  </span>
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-300/50 text-white bg-red-500/20 hover:bg-red-500/30 hover:border-red-300/70 font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.signOut}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                {t.signIn}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
