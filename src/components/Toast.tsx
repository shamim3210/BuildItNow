import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface Props {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const icons = {
  success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
};

const colors = {
  success: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", icon: "#16a34a" },
  error: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", icon: "#dc2626" },
  warning: { bg: "#fffbeb", text: "#92400e", border: "#fde68a", icon: "#d97706" },
  info: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe", icon: "#2563eb" }
};

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const c = colors[toast.type];
  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="animate-toast-in flex items-start gap-3 px-4 py-3 rounded shadow-lg border max-w-sm"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      <span style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}>{icons[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 transition-opacity" style={{ color: c.text }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={() => removeToast(t.id)} />)}
    </div>
  );
}
