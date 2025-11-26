import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.name": "FraudEye",
    "nav.dashboard": "Dashboard",
    "nav.fraudCheck": "Fraud Check",
    "nav.transactions": "Transactions",
    "nav.integrations": "Integrations",
    "nav.admin": "Admin Panel",
    "nav.overview": "Overview",
    "nav.management": "Management",
    "nav.signOut": "Sign Out",
    "header.search": "Search transactions, users, or alerts...",
    "dash.title": "Executive Overview",
    "dash.totalTx": "Total Transactions",
    "dash.fraud": "Fraud Detected",
    "dash.volume": "Total Volume",
    "dash.avg": "Avg Transaction",
    "dash.chart.vol": "Transaction Volume vs Fraud",
    "dash.chart.cat": "Fraud by Category",
    "time.last7": "Last 7 Days",
    "time.last30": "Last 30 Days",
    "time.year": "This Year",
    "lang.en": "English",
    "lang.ar": "Arabic",
    "lang.fr": "French",
    "notif.new": "New",
    "notif.empty": "No notifications yet",
    "notif.viewAll": "View All Activity",
    "auth.loginTitle": "Sign In",
    "auth.registerTitle": "Create Account",
    "auth.name": "Full Name",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.submitLogin": "Sign In",
    "auth.submitRegister": "Sign Up",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.adminHint": "Use admin@bank.com for Admin access."
  },
  ar: {
    "app.name": "عين الاحتيال",
    "nav.dashboard": "لوحة التحكم",
    "nav.fraudCheck": "فحص الاحتيال",
    "nav.transactions": "العمليات",
    "nav.integrations": "الربط والتكامل",
    "nav.admin": "لوحة الإدارة",
    "nav.overview": "نظرة عامة",
    "nav.management": "الإدارة",
    "nav.signOut": "تسجيل الخروج",
    "header.search": "بحث في العمليات، المستخدمين...",
    "dash.title": "الملخص التنفيذي",
    "dash.totalTx": "إجمالي العمليات",
    "dash.fraud": "حالات الاحتيال",
    "dash.volume": "حجم التعاملات",
    "dash.avg": "متوسط العملية",
    "dash.chart.vol": "حجم العمليات مقابل الاحتيال",
    "dash.chart.cat": "الاحتيال حسب الفئة",
    "time.last7": "آخر 7 أيام",
    "time.last30": "آخر 30 يوم",
    "time.year": "هذا العام",
    "lang.en": "الإنجليزية",
    "lang.ar": "العربية",
    "lang.fr": "الفرنسية",
    "notif.new": "جديد",
    "notif.empty": "لا توجد إشعارات",
    "notif.viewAll": "عرض كل النشاط",
    "auth.loginTitle": "تسجيل الدخول",
    "auth.registerTitle": "إنشاء حساب جديد",
    "auth.name": "الاسم الكامل",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.submitLogin": "دخول",
    "auth.submitRegister": "إنشاء حساب",
    "auth.haveAccount": "لديك حساب بالفعل؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.signIn": "دخول",
    "auth.signUp": "تسجيل جديد",
    "auth.adminHint": "استخدم admin@bank.com لصلاحيات المدير."
  },
  fr: {
    "app.name": "FraudEye",
    "nav.dashboard": "Tableau de bord",
    "nav.fraudCheck": "Vérification",
    "nav.transactions": "Transactions",
    "nav.integrations": "Intégrations",
    "nav.admin": "Administration",
    "nav.overview": "Aperçu",
    "nav.management": "Gestion",
    "nav.signOut": "Se déconnecter",
    "header.search": "Rechercher des transactions...",
    "dash.title": "Vue d'ensemble",
    "dash.totalTx": "Total Transactions",
    "dash.fraud": "Fraudes Détectées",
    "dash.volume": "Volume Total",
    "dash.avg": "Moyenne",
    "dash.chart.vol": "Volume vs Fraude",
    "dash.chart.cat": "Fraude par Catégorie",
    "time.last7": "7 derniers jours",
    "time.last30": "30 derniers jours",
    "time.year": "Cette année",
    "lang.en": "Anglais",
    "lang.ar": "Arabe",
    "lang.fr": "Français",
    "notif.new": "Nouveau",
    "notif.empty": "Aucune notification",
    "notif.viewAll": "Voir toute l'activité",
    "auth.loginTitle": "Connexion",
    "auth.registerTitle": "Créer un compte",
    "auth.name": "Nom complet",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.submitLogin": "Se connecter",
    "auth.submitRegister": "S'inscrire",
    "auth.haveAccount": "Vous avez déjà un compte ?",
    "auth.noAccount": "Pas de compte ?",
    "auth.signIn": "Connexion",
    "auth.signUp": "Inscription",
    "auth.adminHint": "Utilisez admin@bank.com pour l'accès Admin."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};