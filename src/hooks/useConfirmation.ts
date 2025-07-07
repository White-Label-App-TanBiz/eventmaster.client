import { useState, useCallback } from "react";

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
}

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((confirmOptions: ConfirmationOptions, confirmCallback: () => void | Promise<void>) => {
    setOptions(confirmOptions);
    setOnConfirm(() => confirmCallback);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (onConfirm) {
      setIsLoading(true);
      try {
        await onConfirm();
        setIsOpen(false);
        setOnConfirm(null);
        setOptions(null);
      } catch (error) {
        console.error("Confirmation action failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setOnConfirm(null);
    setOptions(null);
    setIsLoading(false);
  }, []);

  return {
    isOpen,
    options,
    isLoading,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
