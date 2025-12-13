"use client";
import { Toaster } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      richColors
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        error: <XCircle className="h-5 w-5 text-red-600" />,
      }}
    />
  );
};
