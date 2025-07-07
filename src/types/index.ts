export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "client_admin" | "organizer" | "admin" | "attendee";
  status: "active" | "inactive" | "pending" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export interface ClientAdmin extends User {
  company: string;
  plan: string;
  paymentStatus: "active" | "overdue" | "cancelled";
  apiKeyStatus: "active" | "expired" | "revoked";
  customBranding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  features: string[];
  billing: {
    amount: number;
    currency: string;
    billingCycle: "monthly" | "yearly";
    nextBilling: string;
  };
}

export interface ProductPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
  features: string[];
  maxOrganizers: number;
  maxEvents: number;
  maxAttendees: number;
  isActive: boolean;
  createdAt: string;
}

export interface PaymentGateway {
  id: string;
  name: "stripe" | "paypal" | "manual";
  isActive: boolean;
  configuration: {
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    environment: "sandbox" | "production";
  };
  fees: {
    percentage: number;
    fixed: number;
  };
}

export interface Transaction {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  company: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded" | "cancelled";
  gateway: "stripe" | "paypal" | "manual";
  description: string;
  date: string;
  paymentMethod?: string;
  refundAmount?: number;
  refundDate?: string;
  failureReason?: string;
  metadata?: {
    planName?: string;
    billingCycle?: string;
    subscriptionId?: string;
  };
}

export interface Analytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  totalClientAdmins: number;
  activeClientAdmins: number;
  totalEvents: number;
  totalAttendees: number;
  conversionRate: number;
  churnRate: number;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
