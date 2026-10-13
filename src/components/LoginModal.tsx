"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { writeSession } from "@/lib/auth";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LoginModal({ open, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || password.trim().length < 4) {
      setError("ای میل اور کم از کم ۴ حرف کا پاس ورڈ درج کریں۔");
      return;
    }

    // Lightweight local session for now — credits backend later.
    writeSession({
      email: email.trim(),
      name: email.split("@")[0] || "Trader",
      credits: 25,
      signedInAt: new Date().toISOString(),
    });

    onClose();
    router.push("/dashboard");
  }

  return (
    <div className="glass-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button type="button" className="glass-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="glass-card glass-modal__panel">
        <p className="eyebrow">Secure Access</p>
        <h2 id="login-title" className="glass-modal__title">
          Sign in to Signal Board
        </h2>
        <p className="glass-modal__lede">
          لاگ اِن کے بعد آن ڈیمانڈ سگنلز اور کریڈٹ بیلنس دستیاب ہوں گے۔
        </p>

        <form className="glass-form" onSubmit={onSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="glass-form__error">{error}</p> : null}

          <button type="submit" className="btn btn--primary btn--block">
            Continue
          </button>
        </form>

        <p className="glass-modal__note">
          Demo auth: کوئی بھی ای میل + پاس ورڈ (۴+ حروف)۔ حقیقی اکاؤنٹس اگلے مرحلے میں۔
        </p>
      </div>
    </div>
  );
}
