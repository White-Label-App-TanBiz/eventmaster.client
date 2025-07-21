interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

interface LoadingState {
  [key: string]: boolean;
}

export type {
  ConfirmationOptions, //
  LoadingState,
};
