

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { language } = useLanguage();

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
          title: language === "en" ? "Error" : "خطأ",
          description: result.error.message,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: language === "en" ? "Success" : "نجح",
          description:
            language === "en"
              ? "Account created successfully! Please check your email to verify your account."
              : "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتحقق من حسابك.",
        });
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description:
          language === "en"
            ? "An unexpected error occurred"
            : "حدث خطأ غير متوقع",
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
            {language === "en" ? "Back" : "رجوع"}
          </Button>
          <h1
            className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent ${
              language === "ar" ? "font-arabic" : ""
            }`}
          >
            {language === "en"
              ? "AI Arabic Dictionary"
              : "قاموس الذكاء الاصطناعي العربي"}
          </h1>
        </div>

        <Card className="shadow-xl border-blue-200">
          <CardHeader className="space-y-4 text-center">
            <div className="space-y-2 flex flex-col items-center justify-center">
              <CardTitle className={`text-2xl ${language === "ar" ? "font-arabic" : ""}`}>
                {isLogin
                  ? language === "en"
                    ? "Sign In"
                    : "تسجيل الدخول"
                  : language === "en"
                  ? "Create Account"
                  : "إنشاء حساب"}
              </CardTitle>
              <p className={`text-slate-600 ${language === "ar" ? "font-arabic" : ""}`}>
                {isLogin
                  ? language === "en"
                    ? "Enter your credentials to access the admin panel"
                    : "أدخل بياناتك للوصول إلى لوحة الإدارة"
                  : language === "en"
                  ? "Create an account to get started"
                  : "أنشئ حسابًا للبدء"}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {language === "en" ? "Full Name" : "الاسم الكامل"}
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Enter your full name"
                        : "أدخل اسمك الكامل"
                    }
                    className={language === "ar" ? "text-right" : ""}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === "en" ? "Email" : "البريد الإلكتروني"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your email"
                      : "أدخل بريدك الإلكتروني"
                  }
                  required
                  className={language === "ar" ? "text-right font-arabic" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === "en" ? "Password" : "كلمة المرور"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your password"
                      : "أدخل كلمة المرور"
                  }
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
                  language === "en" ? (
                    "Loading..."
                  ) : (
                    "جاري التحميل..."
                  )
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="h-4 w-4 mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {isLogin
                      ? language === "en"
                        ? "Sign In"
                        : "تسجيل الدخول"
                      : language === "en"
                      ? "Create Account"
                      : "إنشاء حساب"}
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
                {isLogin
                  ? language === "en"
                    ? "Don't have an account? Sign up"
                    : "لا تملك حسابًا؟ سجل الآن"
                  : language === "en"
                  ? "Already have an account? Sign in"
                  : "لديك حساب بالفعل؟ سجل الدخول"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

