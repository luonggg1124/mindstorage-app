import { toast as sonnerToast } from "sonner";

type ToastOptions = Record<string, any>;

const CLOSE_ACTION = {
  label: "Đóng",
  onClick: () => console.log("Đóng"),
};

function withCloseAction(options?: ToastOptions): ToastOptions {
  return {
    ...(options || {}),
    action: (options as any)?.action ?? CLOSE_ACTION,
  };
}

// Proxy để tự động gắn action mặc định cho các toast dạng message/success/error/...
export const toast = new Proxy(sonnerToast as any, {
  get(target, prop) {
    const value = target[prop];

    // các method phổ biến của sonner nhận (message, options?)
    if (
      typeof value === "function" &&
      ["message", "success", "error", "info", "warning", "loading"].includes(
        String(prop)
      )
    ) {
      return (message: any, options?: ToastOptions) =>
        value(message, withCloseAction(options));
    }

    // default: trả nguyên bản (dismiss, promise, custom, ...)
    return value;
  },
}) as typeof sonnerToast;


