import { useUI } from "../store/ui";

export function Toast() {
  const toast = useUI((s) => s.toast);
  return (
    <div className={"vt-toast" + (toast ? " show" : "") + (toast?.warn ? " warn" : "")}>
      {toast ? (toast.warn ? "⚠ " : "✓ ") + toast.msg : ""}
    </div>
  );
}
