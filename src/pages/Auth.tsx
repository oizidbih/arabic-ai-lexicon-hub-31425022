import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/useLanguage";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { englishTranslations } from "@/translations/en";
import { arabicTranslations } from "@/translations/ar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { language } = useLanguage();
  const t = language === "en" ? englishTranslations : arabicTranslations;

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        toast({
          title: t.error,
          description: result.error.message,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: t.success,
          description: t.suggestionSubmitted,
        });
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorSubmittingEdit,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.cancel}
          </Button>
          <h1
            className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent ${
              language === "ar" ? "font-arabic" : ""
            }`}
          >
            {t.appTitle}
          </h1>
        </div>

        <Card className="shadow-xl border-blue-200">
          <CardHeader className="space-y-6 text-center">
            <div className={`flex flex-col items-center justify-center ${language === "ar" ? "items-end text-right" : "items-center text-center"} space-y-2`}>
              <CardTitle
                className={`text-2xl font-bold leading-tight ${language === "ar" ? "font-arabic" : ""}`}
              >
                {isLogin ? t.signIn : t.createAccount}
              </CardTitle>
              <span
                className={`text-slate-600 leading-relaxed text-base ${language === "ar" ? "font-arabic" : ""}`}
              >
                {isLogin ? t.mustBeLoggedInToEdit : t.dontHaveAccount}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.enterFullName}
                    className={language === "ar" ? "text-right" : ""}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmail}
                  required
                  className={language === "ar" ? "text-right font-arabic" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPassword}
                  required
                  className={language === "ar" ? "text-right" : ""}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  t.loading
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="h-4 w-4 mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {isLogin ? t.signIn : t.createAccount}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800"
              >
                {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
