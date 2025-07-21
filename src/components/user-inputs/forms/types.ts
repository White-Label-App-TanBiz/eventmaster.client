import { SuperAdminPlan, SuperAdminPlanCreate, SuperAdminPlanUpdate } from '../../../types';

interface EventFormData {
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

interface AddEventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

interface AddProductPlanFormProps {
  initialData?: SuperAdminPlanUpdate;
  onSubmit: (plan: SuperAdminPlanCreate | SuperAdminPlanUpdate) => void;
  onCancel: () => void;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

interface InviteAdminFormProps {
  onSubmit: (data: { email: string; firstName: string; lastName: string; role: string; permissions: string[] }) => void;
  onCancel: () => void;
}

export type {
  EventFormData,
  AddEventFormProps,
  SuperAdminPlan as ProductPlan, // Legacy alias
  SuperAdminPlanCreate as ProductPlanCreate, // Legacy alias
  SuperAdminPlanUpdate as ProductPlanUpdate, // Legacy alias
  AddProductPlanFormProps,
  Permission,
  InviteAdminFormProps,
};
