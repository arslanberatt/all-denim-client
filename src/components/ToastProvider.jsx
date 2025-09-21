import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#1e293b",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
