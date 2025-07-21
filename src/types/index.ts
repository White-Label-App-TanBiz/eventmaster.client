// =====================================================
// CORE USER TYPES
// =====================================================

export type UserRole = 'super_admin' | 'client_admin' | 'provider' | 'admin' | 'customer';
export type PlanType = 'cloud-based' | 'source-code-based';
export type PlanTier = 'white-label' | 'saas-ready-100' | 'saas-ready-200' | 'saas-ready-400' | 'saas-ready-unlimited';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  permissions: string[];
}

// =====================================================
// SUPER ADMIN TYPES
// =====================================================

export interface SuperAdmin extends BaseUser {
  role: 'super_admin';
}

// =====================================================
// CLIENT ADMIN TYPES
// =====================================================

export interface ClientAdmin extends BaseUser {
  role: 'client_admin';
  company: string;
  subdomain?: string;
  customDomain?: string;
  plan: string;
  planType: PlanType;
  planTier: PlanTier;
  paymentStatus: 'active' | 'overdue' | 'cancelled';
  apiKeyStatus: 'active' | 'expired' | 'revoked';
  customBranding: CustomBranding;
  features: string[];
  billing: BillingInfo;
  maxProviders: number;
  currentProviders: number;
  maxEvents: number;
  maxCustomers: number;
}

// =====================================================
// PROVIDER TYPES
// =====================================================

export interface Provider extends BaseUser {
  role: 'provider';
  clientAdminId: string;
  company: string;
  plan?: string; // Plan provided by client_admin
  planType?: 'paid' | 'non-paid';
  paymentStatus?: 'active' | 'overdue' | 'cancelled';
  maxEvents?: number;
  maxCustomers?: number;
  customBranding?: CustomBranding;
  billing?: BillingInfo;
}

// =====================================================
// ADMIN TYPES
// =====================================================

export interface Admin extends BaseUser {
  role: 'admin';
  providerId: string;
  phone?: string;
  jobTitle?: string;
}

// =====================================================
// CUSTOMER TYPES
// =====================================================

export interface Customer extends BaseUser {
  role: 'customer';
  phone?: string;
  company?: string;
  registrationDate?: string;
  eventPreferences?: string[];
}

// Combined User type
export type User = SuperAdmin | ClientAdmin | Provider | Admin | Customer;

// =====================================================
// PLAN MANAGEMENT TYPES
// =====================================================

export interface SuperAdminPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  planType: PlanType;
  planTier: PlanTier;
  features: string[];
  maxProviders: number; // -1 for unlimited
  maxEvents: number; // -1 for unlimited
  maxCustomers: number; // -1 for unlimited
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ClientAdminProviderPlan {
  id: string;
  clientAdminId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  maxEvents: number;
  maxCustomers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Legacy ProductPlan type for backward compatibility
export type ProductPlan = SuperAdminPlan;

// =====================================================
// BRANDING AND CUSTOMIZATION TYPES
// =====================================================

export interface CustomBranding {
  logo?: string;
  companyName?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontFamily: string;
  customDomain?: string;
  faviconUrl?: string;
  loginBackgroundImage?: string;
  emailHeaderLogo?: string;
}

export interface BrandingTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  previewImage?: string;
  isDefault?: boolean;
}

// =====================================================
// BILLING AND PAYMENT TYPES
// =====================================================

export interface BillingInfo {
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  nextBilling: string;
  lastBilling?: string;
  paymentMethodId?: string;
}

export interface PaymentGateway {
  id: string;
  name: 'stripe' | 'paypal' | 'manual' | 'xendit' | 'midtrans';
  isActive: boolean;
  configuration: {
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'production';
    [key: string]: any;
  };
  fees: {
    percentage: number;
    fixed: number;
  };
  supportedCurrencies?: string[];
  regions?: string[];
}

export interface Transaction {
  id: string;
  invoiceId: string;
  type: 'subscription' | 'event_payment' | 'withdrawal' | 'refund' | 'setup_fee';

  // Payer information
  payerId: string;
  payerName: string;
  payerRole: UserRole;
  payerCompany?: string;

  // Payment details
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled';
  gateway: string;
  description: string;
  date: string;
  paymentMethod?: string;

  // Refund information
  refundAmount?: number;
  refundDate?: string;
  failureReason?: string;

  // Context metadata
  metadata?: {
    planName?: string;
    eventId?: string;
    eventName?: string;
    billingCycle?: string;
    subscriptionId?: string;
    withdrawalRequestId?: string;
    [key: string]: any;
  };
}

export interface WithdrawalRequest {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestDate: string;
  processedDate?: string;
  method: 'bank_transfer' | 'paypal' | 'crypto' | 'manual';
  accountDetails: string;
  description?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// =====================================================
// EVENT MANAGEMENT TYPES
// =====================================================

export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue?: string;
  address?: string;
  directions?: string;
  type: 'virtual' | 'physical' | 'hybrid';
  category?: 'business' | 'technology' | 'entertainment' | 'education' | 'health' | 'sports' | 'other';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  price: number;
  currency?: string;
  capacity?: number;
  registrationEndDate?: string;
  image?: string;
  tags?: string[];
}

export interface Event extends BaseEvent {
  providerId: string;
  provider: string;
  customers: number;
  maxCustomers?: number;
  ticketTypes?: Array<{
    id?: string;
    type: string;
    price: number;
    description?: string;
    available?: number;
    sold?: number;
  }>;
  schedule?: Array<{
    id?: string;
    time: string;
    title: string;
    description?: string;
    speaker?: string;
    duration?: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicEvent extends BaseEvent {
  featured?: boolean;
  provider: string;
  providerImage?: string;
  providerDescription?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerWebsite?: string;
  providerSocial?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  customers: number;
  ticketTypes?: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  schedule?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    title: string;
    bio?: string;
    image?: string;
  }>;
}

export interface UserEvent extends BaseEvent {
  ticketType: string;
  provider: string;
  registrationDate: string;
  checkInStatus: 'checked-in' | 'not-checked-in';
  rating?: number | null;
}

// =====================================================
// CUSTOMER MANAGEMENT TYPES
// =====================================================

export interface CustomerRegistration {
  id: string;
  customerId: string;
  customer: Customer;
  eventId: string;
  eventName: string;
  ticketType: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  registrationDate: string;
  checkInStatus: 'checked-in' | 'not-checked-in';
  checkInDate?: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  transactionId?: string;
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

export interface BaseAnalytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  totalCustomers: number;
  conversionRate: number;
  churnRate: number;
}

export interface SuperAdminAnalytics extends BaseAnalytics {
  totalClientAdmins: number;
  activeClientAdmins: number;
  totalLicenseKeys: number;
  activeLicenseKeys: number;
  expiredLicenseKeys: number;
  totalApiRequests: number;
  monthlyApiRequests: number;
  planDistribution: Record<string, number>;
  topPerformingClients: Array<{
    id: string;
    name: string;
    company: string;
    revenue: number;
    growth: string;
  }>;
}

export interface ClientAdminAnalytics extends BaseAnalytics {
  totalProviders: number;
  activeProviders: number;
  paidProviders: number;
  nonPaidProviders: number;
  avgRevenuePerProvider: number;
  topPerformingProviders: Array<{
    id: string;
    name: string;
    company: string;
    revenue: number;
    growth: string;
  }>;
}

export interface ProviderAnalytics extends BaseAnalytics {
  totalAdmins: number;
  activeAdmins: number;
  eventsPublished: number;
  eventsDraft: number;
  avgAttendeesPerEvent: number;
  topPerformingEvents: Array<{
    id: string;
    title: string;
    attendees: number;
    revenue: number;
    rating: number;
  }>;
}

export type Analytics = SuperAdminAnalytics | ClientAdminAnalytics | ProviderAnalytics;

// =====================================================
// LICENSE AND API TYPES
// =====================================================

export interface ApiLicense {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  licenseKey: string;
  apiKey: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  plan: string;
  environment: 'production' | 'staging' | 'development';
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  usage: {
    currentMonth: number;
    lastMonth: number;
    totalRequests: number;
  };
  domains: string[];
  ipWhitelist: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
}

// =====================================================
// EMAIL TEMPLATE TYPES
// =====================================================

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'welcome' | 'event_confirmation' | 'event_reminder' | 'payment_receipt' | 'password_reset' | 'invoice' | 'custom';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[]; // Available variables like {{user_name}}, {{event_title}}
  clientAdminId?: string; // null for system templates
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EmailConfiguration {
  id: string;
  clientAdminId?: string; // null for system config
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string; // This should be encrypted
  smtpEncryption: 'tls' | 'ssl' | 'none';
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  isActive: boolean;
  lastTested?: string;
  testResult?: 'success' | 'failed';
}

// =====================================================
// SYSTEM CONFIGURATION TYPES
// =====================================================

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string | number | boolean | object;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: 'general' | 'security' | 'email' | 'payment' | 'features';
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface WhiteLabelConfiguration {
  id: string;
  clientAdminId: string;

  // Server Configuration
  nodeVersion: string;
  npmVersion: string;
  webServer: 'nginx' | 'apache';

  // Application Configuration
  companyName: string;
  companyEmail: string;
  adminEmail: string;
  adminPassword: string; // This should be hashed
  customDomain: string;

  // SMTP Configuration
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string; // This should be encrypted
  smtpEncryption: 'tls' | 'ssl' | 'none';

  // Database Configuration
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string; // This should be encrypted

  // Deployment Configuration
  deploymentMethod: 'pm2' | 'docker' | 'systemd';
  sslMethod: 'letsencrypt' | 'custom' | 'none';

  // Installation Status
  installationStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  installationLogs?: string[];

  // Server Checklist
  serverChecklist: {
    nodeInstalled: boolean;
    npmInstalled: boolean;
    webServerInstalled: boolean;
    gitInstalled: boolean;
    sshAccess: boolean;
  };

  createdAt: string;
  updatedAt?: string;
}

// =====================================================
// DEMO AND AUTHENTICATION TYPES
// =====================================================

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  roleDisplayName: string;
  description: string;
  company?: string;
  features?: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// =====================================================
// UI COMPONENT TYPES
// =====================================================

export interface CurrencySettings {
  symbol: string;
  separator: 'none' | 'space';
  code: string;
  decimals: 0 | 2;
}

export interface CurrencyContextType {
  currencySettings: CurrencySettings;
  setCurrencySettings: (settings: CurrencySettings) => void;
  formatCurrency: (amount: number) => string;
}

export type Language = 'en' | 'es' | 'ru' | 'pt' | 'id' | 'fr' | 'tr' | 'de' | 'it';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export type Period = 'last7days' | 'last30days' | 'thisweek' | 'thismonth' | 'lastmonth' | 'thisyear' | 'lastyear' | 'alltime';

export interface PeriodContextType {
  period: Period;
  setPeriod: (period: Period) => void;
  getPeriodLabel: (period: Period) => string;
  getPeriodData: (baseData: any, period: Period) => any;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// =====================================================
// FORM AND INPUT TYPES
// =====================================================

export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  address?: string;
  type: 'virtual' | 'physical' | 'hybrid';
  category: 'business' | 'technology' | 'entertainment' | 'education' | 'health';
  price: number;
  capacity: number;
  image?: string;
  ticketTypes: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  schedule: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  registrationEndDate: string;
}

export interface AddEventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export type SuperAdminPlanCreate = Omit<SuperAdminPlan, 'id' | 'createdAt'>;
export type SuperAdminPlanUpdate = Omit<SuperAdminPlan, 'createdAt'>;

export interface AddProductPlanFormProps {
  initialData?: SuperAdminPlanUpdate;
  onSubmit: (plan: SuperAdminPlanCreate | SuperAdminPlanUpdate) => void;
  onCancel: () => void;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export interface InviteAdminFormProps {
  onSubmit: (data: { email: string; firstName: string; lastName: string; role: string; permissions: string[] }) => void;
  onCancel: () => void;
}

// =====================================================
// HOOK TYPES
// =====================================================

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export interface LoadingState {
  [key: string]: boolean;
}

// =====================================================
// CHART AND METRICS TYPES
// =====================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  icon: any; // React component
  color: string;
  baseAmount: number;
}

// =====================================================
// EXPORTS
// =====================================================

// Re-export everything for convenience
export // Core types are exported above
 type {};

// Legacy exports for backward compatibility
export type { ProductPlan as LegacyProductPlan };
export type { EventFormData as LegacyEventFormData };
