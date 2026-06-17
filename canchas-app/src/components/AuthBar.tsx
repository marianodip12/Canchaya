import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../store/ui";

export function AuthBar() {
  const { user } = useAuth();
  const showToast = useUI((s) => s.showToast);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <div className="auth-bar">
        <span className="auth-who">{user.email}</span>
        <button className="auth-btn ghost" onClick={() => supabase.auth.signOut()}>Salir</button>
      </div>
    );
  }
  if (!open) return <button className="auth-btn" onClick={() => setOpen(true)}>Ingresar</button>;

  async function login(signup: boolean) {
    if (!email || !pass) { showToast("Completá email y contraseña", true); return; }
    setBusy(true);
    try {
      // OJO: llamar los métodos directo sobre supabase.auth para no perder el `this`
      const { error } = signup
        ? await supabase.auth.signUp({ email, password: pass })
        : await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) showToast(error.message, true);
      else { showToast(signup ? "Cuenta creada, revisá tu mail" : "Sesión iniciada"); setOpen(false); }
    } catch (e: any) {
      showToast(e?.message ?? "Error de autenticación", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-form">
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      <button className="auth-btn" disabled={busy} onClick={() => login(false)}>Entrar</button>
      <button className="auth-btn ghost" disabled={busy} onClick={() => login(true)}>Crear</button>
    </div>
  );
}
