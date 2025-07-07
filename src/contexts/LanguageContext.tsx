import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es" | "ru" | "pt" | "id" | "fr" | "tr" | "de" | "it";

export const languages = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  ru: { name: "Русский", flag: "🇷🇺" },
  pt: { name: "Português", flag: "🇧🇷" },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩" },
  fr: { name: "Français", flag: "🇫🇷" },
  tr: { name: "Türkçe", flag: "🇹🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  it: { name: "Italiano", flag: "🇮🇹" },
};

const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      customers: "Customers",
      plans: "Product Plans",
      payments: "Payment Gateways",
      analytics: "Analytics",
      licenses: "API Licenses",
      transactions: "Transactions",
      settings: "Settings",
    },
    // Header
    header: {
      search: "Search anything...",
      profile: "Profile Settings",
      account: "Account Settings",
      security: "Security",
      signOut: "Sign Out",
    },
    // Dashboard
    dashboard: {
      title: "Dashboard Overview",
      totalRevenue: "Total Revenue",
      monthlyRecurringRevenue: "Monthly Recurring Revenue",
      activeCustomers: "Active Customers",
      totalEvents: "Total Events",
      totalAttendees: "Total Attendees",
      churnRate: "Churn Rate",
      recentActivity: "Recent Activity",
      revenueBreakdown: "Revenue Breakdown",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
    },
    // Customers
    customers: {
      title: "Customers",
      addCustomer: "Add Customer",
      searchCustomers: "Search customers...",
      allStatus: "All Status",
      active: "Active",
      pending: "Pending",
      suspended: "Suspended",
      filter: "Filter",
      export: "Export",
      customer: "Customer",
      plan: "Plan",
      status: "Status",
      payment: "Payment",
      revenue: "Revenue",
      lastLogin: "Last Login",
      actions: "Actions",
      never: "Never",
      viewDetails: "View Details",
      editCustomer: "Edit Customer",
      sendEmail: "Send Email",
      billingDetails: "Billing Details",
      apiKeys: "API Keys",
      suspendAccount: "Suspend Account",
      activateAccount: "Activate Account",
      deleteCustomer: "Delete Customer",
      showing: "Showing",
      of: "of",
      customersText: "customers",
      previous: "Previous",
      next: "Next",
    },
    // Periods
    periods: {
      last7days: "Last 7 days",
      last30days: "Last 30 days",
      thisweek: "This Week",
      thismonth: "This Month",
      lastmonth: "Last Month",
      thisyear: "This Year",
      lastyear: "Last Year",
      alltime: "All Time",
    },
  },
  es: {
    // Navigation
    nav: {
      dashboard: "Panel de Control",
      customers: "Clientes",
      plans: "Planes de Productos",
      payments: "Pasarelas de Pago",
      analytics: "Analíticas",
      licenses: "Licencias API",
      transactions: "Transacciones",
      settings: "Configuración",
    },
    // Header
    header: {
      search: "Buscar cualquier cosa...",
      profile: "Configuración de Perfil",
      account: "Configuración de Cuenta",
      security: "Seguridad",
      signOut: "Cerrar Sesión",
    },
    // Dashboard
    dashboard: {
      title: "Resumen del Panel",
      totalRevenue: "Ingresos Totales",
      monthlyRecurringRevenue: "Ingresos Recurrentes Mensuales",
      activeCustomers: "Clientes Activos",
      totalEvents: "Eventos Totales",
      totalAttendees: "Asistentes Totales",
      churnRate: "Tasa de Abandono",
      recentActivity: "Actividad Reciente",
      revenueBreakdown: "Desglose de Ingresos",
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Últimos 90 días",
    },
    // Customers
    customers: {
      title: "Clientes",
      addCustomer: "Agregar Cliente",
      searchCustomers: "Buscar clientes...",
      allStatus: "Todos los Estados",
      active: "Activo",
      pending: "Pendiente",
      suspended: "Suspendido",
      filter: "Filtrar",
      export: "Exportar",
      customer: "Cliente",
      plan: "Plan",
      status: "Estado",
      payment: "Pago",
      revenue: "Ingresos",
      lastLogin: "Último Acceso",
      actions: "Acciones",
      never: "Nunca",
      viewDetails: "Ver Detalles",
      editCustomer: "Editar Cliente",
      sendEmail: "Enviar Email",
      billingDetails: "Detalles de Facturación",
      apiKeys: "Claves API",
      suspendAccount: "Suspender Cuenta",
      activateAccount: "Activar Cuenta",
      deleteCustomer: "Eliminar Cliente",
      showing: "Mostrando",
      of: "de",
      customersText: "clientes",
      previous: "Anterior",
      next: "Siguiente",
    },
    // Periods
    periods: {
      last7days: "Últimos 7 días",
      last30days: "Últimos 30 días",
      thisweek: "Esta Semana",
      thismonth: "Este Mes",
      lastmonth: "Mes Pasado",
      thisyear: "Este Año",
      lastyear: "Año Pasado",
      alltime: "Todo el Tiempo",
    },
  },
  ru: {
    // Navigation
    nav: {
      dashboard: "Панель управления",
      customers: "Клиенты",
      plans: "Планы продуктов",
      payments: "Платёжные шлюзы",
      analytics: "Аналитика",
      licenses: "API лицензии",
      transactions: "Транзакции",
      settings: "Настройки",
    },
    // Header
    header: {
      search: "Поиск...",
      profile: "Настройки профиля",
      account: "Настройки аккаунта",
      security: "Безопасность",
      signOut: "Выйти",
    },
    // Dashboard
    dashboard: {
      title: "Обзор панели",
      totalRevenue: "Общий доход",
      monthlyRecurringRevenue: "Ежемесячный повторяющийся доход",
      activeCustomers: "Активные клиенты",
      totalEvents: "Всего событий",
      totalAttendees: "Всего участников",
      churnRate: "Коэффициент оттока",
      recentActivity: "Недавняя активность",
      revenueBreakdown: "Разбивка доходов",
      last7Days: "Последние 7 дней",
      last30Days: "Последние 30 дней",
      last90Days: "Последние 90 дней",
    },
    // Customers
    customers: {
      title: "Клиенты",
      addCustomer: "Добавить клиента",
      searchCustomers: "Поиск клиентов...",
      allStatus: "Все статусы",
      active: "Активный",
      pending: "В ожидании",
      suspended: "Приостановлен",
      filter: "Фильтр",
      export: "Экспорт",
      customer: "Клиент",
      plan: "План",
      status: "Статус",
      payment: "Платёж",
      revenue: "Доход",
      lastLogin: "Последний вход",
      actions: "Действия",
      never: "Никогда",
      viewDetails: "Просмотр деталей",
      editCustomer: "Редактировать клиента",
      sendEmail: "Отправить email",
      billingDetails: "Детали выставления счетов",
      apiKeys: "API ключи",
      suspendAccount: "Приостановить аккаунт",
      activateAccount: "Активировать аккаунт",
      deleteCustomer: "Удалить клиента",
      showing: "Показано",
      of: "из",
      customersText: "клиентов",
      previous: "Предыдущий",
      next: "Следующий",
    },
    // Periods
    periods: {
      last7days: "Последние 7 дней",
      last30days: "Последние 30 дней",
      thisweek: "Эта неделя",
      thismonth: "Этот месяц",
      lastmonth: "Прошлый месяц",
      thisyear: "Этот год",
      lastyear: "Прошлый год",
      alltime: "Всё время",
    },
  },
  pt: {
    // Navigation
    nav: {
      dashboard: "Painel de Controle",
      customers: "Clientes",
      plans: "Planos de Produtos",
      payments: "Gateways de Pagamento",
      analytics: "Análises",
      licenses: "Licenças API",
      transactions: "Transações",
      settings: "Configurações",
    },
    // Header
    header: {
      search: "Pesquisar qualquer coisa...",
      profile: "Configurações do Perfil",
      account: "Configurações da Conta",
      security: "Segurança",
      signOut: "Sair",
    },
    // Dashboard
    dashboard: {
      title: "Visão Geral do Painel",
      totalRevenue: "Receita Total",
      monthlyRecurringRevenue: "Receita Recorrente Mensal",
      activeCustomers: "Clientes Ativos",
      totalEvents: "Total de Eventos",
      totalAttendees: "Total de Participantes",
      churnRate: "Taxa de Rotatividade",
      recentActivity: "Atividade Recente",
      revenueBreakdown: "Detalhamento da Receita",
      last7Days: "Últimos 7 dias",
      last30Days: "Últimos 30 dias",
      last90Days: "Últimos 90 dias",
    },
    // Customers
    customers: {
      title: "Clientes",
      addCustomer: "Adicionar Cliente",
      searchCustomers: "Pesquisar clientes...",
      allStatus: "Todos os Status",
      active: "Ativo",
      pending: "Pendente",
      suspended: "Suspenso",
      filter: "Filtrar",
      export: "Exportar",
      customer: "Cliente",
      plan: "Plano",
      status: "Status",
      payment: "Pagamento",
      revenue: "Receita",
      lastLogin: "Último Login",
      actions: "Ações",
      never: "Nunca",
      viewDetails: "Ver Detalhes",
      editCustomer: "Editar Cliente",
      sendEmail: "Enviar Email",
      billingDetails: "Detalhes de Cobrança",
      apiKeys: "Chaves API",
      suspendAccount: "Suspender Conta",
      activateAccount: "Ativar Conta",
      deleteCustomer: "Excluir Cliente",
      showing: "Mostrando",
      of: "de",
      customersText: "clientes",
      previous: "Anterior",
      next: "Próximo",
    },
    // Periods
    periods: {
      last7days: "Últimos 7 dias",
      last30days: "Últimos 30 dias",
      thisweek: "Esta Semana",
      thismonth: "Este Mês",
      lastmonth: "Mês Passado",
      thisyear: "Este Ano",
      lastyear: "Ano Passado",
      alltime: "Todo o Tempo",
    },
  },
  id: {
    // Navigation
    nav: {
      dashboard: "Dasbor",
      customers: "Pelanggan",
      plans: "Paket Produk",
      payments: "Gateway Pembayaran",
      analytics: "Analitik",
      licenses: "Lisensi API",
      transactions: "Transaksi",
      settings: "Pengaturan",
    },
    // Header
    header: {
      search: "Cari apa saja...",
      profile: "Pengaturan Profil",
      account: "Pengaturan Akun",
      security: "Keamanan",
      signOut: "Keluar",
    },
    // Dashboard
    dashboard: {
      title: "Ringkasan Dasbor",
      totalRevenue: "Total Pendapatan",
      monthlyRecurringRevenue: "Pendapatan Berulang Bulanan",
      activeCustomers: "Pelanggan Aktif",
      totalEvents: "Total Acara",
      totalAttendees: "Total Peserta",
      churnRate: "Tingkat Churn",
      recentActivity: "Aktivitas Terbaru",
      revenueBreakdown: "Rincian Pendapatan",
      last7Days: "7 hari terakhir",
      last30Days: "30 hari terakhir",
      last90Days: "90 hari terakhir",
    },
    // Customers
    customers: {
      title: "Pelanggan",
      addCustomer: "Tambah Pelanggan",
      searchCustomers: "Cari pelanggan...",
      allStatus: "Semua Status",
      active: "Aktif",
      pending: "Tertunda",
      suspended: "Ditangguhkan",
      filter: "Filter",
      export: "Ekspor",
      customer: "Pelanggan",
      plan: "Paket",
      status: "Status",
      payment: "Pembayaran",
      revenue: "Pendapatan",
      lastLogin: "Login Terakhir",
      actions: "Aksi",
      never: "Tidak Pernah",
      viewDetails: "Lihat Detail",
      editCustomer: "Edit Pelanggan",
      sendEmail: "Kirim Email",
      billingDetails: "Detail Penagihan",
      apiKeys: "Kunci API",
      suspendAccount: "Tangguhkan Akun",
      activateAccount: "Aktifkan Akun",
      deleteCustomer: "Hapus Pelanggan",
      showing: "Menampilkan",
      of: "dari",
      customersText: "pelanggan",
      previous: "Sebelumnya",
      next: "Selanjutnya",
    },
    // Periods
    periods: {
      last7days: "7 hari terakhir",
      last30days: "30 hari terakhir",
      thisweek: "Minggu Ini",
      thismonth: "Bulan Ini",
      lastmonth: "Bulan Lalu",
      thisyear: "Tahun Ini",
      lastyear: "Tahun Lalu",
      alltime: "Sepanjang Waktu",
    },
  },
  fr: {
    // Navigation
    nav: {
      dashboard: "Tableau de Bord",
      customers: "Clients",
      plans: "Plans Produits",
      payments: "Passerelles de Paiement",
      analytics: "Analyses",
      licenses: "Licences API",
      transactions: "Transactions",
      settings: "Paramètres",
    },
    // Header
    header: {
      search: "Rechercher n'importe quoi...",
      profile: "Paramètres du Profil",
      account: "Paramètres du Compte",
      security: "Sécurité",
      signOut: "Se Déconnecter",
    },
    // Dashboard
    dashboard: {
      title: "Aperçu du Tableau de Bord",
      totalRevenue: "Revenus Totaux",
      monthlyRecurringRevenue: "Revenus Récurrents Mensuels",
      activeCustomers: "Clients Actifs",
      totalEvents: "Total des Événements",
      totalAttendees: "Total des Participants",
      churnRate: "Taux de Désabonnement",
      recentActivity: "Activité Récente",
      revenueBreakdown: "Répartition des Revenus",
      last7Days: "7 derniers jours",
      last30Days: "30 derniers jours",
      last90Days: "90 derniers jours",
    },
    // Customers
    customers: {
      title: "Clients",
      addCustomer: "Ajouter un Client",
      searchCustomers: "Rechercher des clients...",
      allStatus: "Tous les Statuts",
      active: "Actif",
      pending: "En Attente",
      suspended: "Suspendu",
      filter: "Filtrer",
      export: "Exporter",
      customer: "Client",
      plan: "Plan",
      status: "Statut",
      payment: "Paiement",
      revenue: "Revenus",
      lastLogin: "Dernière Connexion",
      actions: "Actions",
      never: "Jamais",
      viewDetails: "Voir les Détails",
      editCustomer: "Modifier le Client",
      sendEmail: "Envoyer un Email",
      billingDetails: "Détails de Facturation",
      apiKeys: "Clés API",
      suspendAccount: "Suspendre le Compte",
      activateAccount: "Activer le Compte",
      deleteCustomer: "Supprimer le Client",
      showing: "Affichage",
      of: "de",
      customersText: "clients",
      previous: "Précédent",
      next: "Suivant",
    },
    // Periods
    periods: {
      last7days: "7 derniers jours",
      last30days: "30 derniers jours",
      thisweek: "Cette Semaine",
      thismonth: "Ce Mois",
      lastmonth: "Mois Dernier",
      thisyear: "Cette Année",
      lastyear: "Année Dernière",
      alltime: "Tout le Temps",
    },
  },
  tr: {
    // Navigation
    nav: {
      dashboard: "Kontrol Paneli",
      customers: "Müşteriler",
      plans: "Ürün Planları",
      payments: "Ödeme Geçitleri",
      analytics: "Analitik",
      licenses: "API Lisansları",
      transactions: "İşlemler",
      settings: "Ayarlar",
    },
    // Header
    header: {
      search: "Herhangi bir şey ara...",
      profile: "Profil Ayarları",
      account: "Hesap Ayarları",
      security: "Güvenlik",
      signOut: "Çıkış Yap",
    },
    // Dashboard
    dashboard: {
      title: "Kontrol Paneli Genel Bakış",
      totalRevenue: "Toplam Gelir",
      monthlyRecurringRevenue: "Aylık Yinelenen Gelir",
      activeCustomers: "Aktif Müşteriler",
      totalEvents: "Toplam Etkinlik",
      totalAttendees: "Toplam Katılımcı",
      churnRate: "Kayıp Oranı",
      recentActivity: "Son Aktivite",
      revenueBreakdown: "Gelir Dağılımı",
      last7Days: "Son 7 gün",
      last30Days: "Son 30 gün",
      last90Days: "Son 90 gün",
    },
    // Customers
    customers: {
      title: "Müşteriler",
      addCustomer: "Müşteri Ekle",
      searchCustomers: "Müşteri ara...",
      allStatus: "Tüm Durumlar",
      active: "Aktif",
      pending: "Beklemede",
      suspended: "Askıya Alınmış",
      filter: "Filtrele",
      export: "Dışa Aktar",
      customer: "Müşteri",
      plan: "Plan",
      status: "Durum",
      payment: "Ödeme",
      revenue: "Gelir",
      lastLogin: "Son Giriş",
      actions: "İşlemler",
      never: "Hiçbir Zaman",
      viewDetails: "Detayları Görüntüle",
      editCustomer: "Müşteriyi Düzenle",
      sendEmail: "E-posta Gönder",
      billingDetails: "Fatura Detayları",
      apiKeys: "API Anahtarları",
      suspendAccount: "Hesabı Askıya Al",
      activateAccount: "Hesabı Etkinleştir",
      deleteCustomer: "Müşteriyi Sil",
      showing: "Gösteriliyor",
      of: "toplam",
      customersText: "müşteri",
      previous: "Önceki",
      next: "Sonraki",
    },
    // Periods
    periods: {
      last7days: "Son 7 gün",
      last30days: "Son 30 gün",
      thisweek: "Bu Hafta",
      thismonth: "Bu Ay",
      lastmonth: "Geçen Ay",
      thisyear: "Bu Yıl",
      lastyear: "Geçen Yıl",
      alltime: "Tüm Zamanlar",
    },
  },
  de: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      customers: "Kunden",
      plans: "Produktpläne",
      payments: "Zahlungs-Gateways",
      analytics: "Analytik",
      licenses: "API-Lizenzen",
      transactions: "Transaktionen",
      settings: "Einstellungen",
    },
    // Header
    header: {
      search: "Alles durchsuchen...",
      profile: "Profil-Einstellungen",
      account: "Konto-Einstellungen",
      security: "Sicherheit",
      signOut: "Abmelden",
    },
    // Dashboard
    dashboard: {
      title: "Dashboard-Übersicht",
      totalRevenue: "Gesamtumsatz",
      monthlyRecurringRevenue: "Monatlich wiederkehrende Einnahmen",
      activeCustomers: "Aktive Kunden",
      totalEvents: "Gesamte Veranstaltungen",
      totalAttendees: "Gesamte Teilnehmer",
      churnRate: "Abwanderungsrate",
      recentActivity: "Letzte Aktivität",
      revenueBreakdown: "Umsatzaufschlüsselung",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
    },
    // Customers
    customers: {
      title: "Kunden",
      addCustomer: "Kunde hinzufügen",
      searchCustomers: "Kunden suchen...",
      allStatus: "Alle Status",
      active: "Aktiv",
      pending: "Ausstehend",
      suspended: "Gesperrt",
      filter: "Filter",
      export: "Exportieren",
      customer: "Kunde",
      plan: "Plan",
      status: "Status",
      payment: "Zahlung",
      revenue: "Umsatz",
      lastLogin: "Letzte Anmeldung",
      actions: "Aktionen",
      never: "Nie",
      viewDetails: "Details anzeigen",
      editCustomer: "Kunde bearbeiten",
      sendEmail: "E-Mail senden",
      billingDetails: "Abrechnungsdetails",
      apiKeys: "API-Schlüssel",
      suspendAccount: "Konto sperren",
      activateAccount: "Konto aktivieren",
      deleteCustomer: "Kunde löschen",
      showing: "Zeige",
      of: "von",
      customersText: "Kunden",
      previous: "Vorherige",
      next: "Nächste",
    },
    // Periods
    periods: {
      last7days: "Letzte 7 Tage",
      last30days: "Letzte 30 Tage",
      thisweek: "Diese Woche",
      thismonth: "Dieser Monat",
      lastmonth: "Letzter Monat",
      thisyear: "Dieses Jahr",
      lastyear: "Letztes Jahr",
      alltime: "Alle Zeit",
    },
  },
  it: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      customers: "Clienti",
      plans: "Piani Prodotto",
      payments: "Gateway di Pagamento",
      analytics: "Analisi",
      licenses: "Licenze API",
      transactions: "Transazioni",
      settings: "Impostazioni",
    },
    // Header
    header: {
      search: "Cerca qualsiasi cosa...",
      profile: "Impostazioni Profilo",
      account: "Impostazioni Account",
      security: "Sicurezza",
      signOut: "Disconnetti",
    },
    // Dashboard
    dashboard: {
      title: "Panoramica Dashboard",
      totalRevenue: "Ricavi Totali",
      monthlyRecurringRevenue: "Ricavi Ricorrenti Mensili",
      activeCustomers: "Clienti Attivi",
      totalEvents: "Eventi Totali",
      totalAttendees: "Partecipanti Totali",
      churnRate: "Tasso di Abbandono",
      recentActivity: "Attività Recente",
      revenueBreakdown: "Suddivisione Ricavi",
      last7Days: "Ultimi 7 giorni",
      last30Days: "Ultimi 30 giorni",
      last90Days: "Ultimi 90 giorni",
    },
    // Customers
    customers: {
      title: "Clienti",
      addCustomer: "Aggiungi Cliente",
      searchCustomers: "Cerca clienti...",
      allStatus: "Tutti gli Stati",
      active: "Attivo",
      pending: "In Attesa",
      suspended: "Sospeso",
      filter: "Filtra",
      export: "Esporta",
      customer: "Cliente",
      plan: "Piano",
      status: "Stato",
      payment: "Pagamento",
      revenue: "Ricavi",
      lastLogin: "Ultimo Accesso",
      actions: "Azioni",
      never: "Mai",
      viewDetails: "Visualizza Dettagli",
      editCustomer: "Modifica Cliente",
      sendEmail: "Invia Email",
      billingDetails: "Dettagli Fatturazione",
      apiKeys: "Chiavi API",
      suspendAccount: "Sospendi Account",
      activateAccount: "Attiva Account",
      deleteCustomer: "Elimina Cliente",
      showing: "Mostrando",
      of: "di",
      customersText: "clienti",
      previous: "Precedente",
      next: "Successivo",
    },
    // Periods
    periods: {
      last7days: "Ultimi 7 giorni",
      last30days: "Ultimi 30 giorni",
      thisweek: "Questa Settimana",
      thismonth: "Questo Mese",
      lastmonth: "Mese Scorso",
      thisyear: "Quest'Anno",
      lastyear: "Anno Scorso",
      alltime: "Tutto il Tempo",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && languages[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      if (languages[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to English if translation not found
    if (!value) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }

    return value || key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};
