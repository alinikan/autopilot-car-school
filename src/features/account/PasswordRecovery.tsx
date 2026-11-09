import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check } from 'lucide-react';

export function PasswordRecovery({ close }: { close: () => void }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="account-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setBusy(true);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setMessage(error.message);
          setBusy(false);
        } else {
          history.replaceState(null, '', '/');
          close();
        }
      }}
    >
      <p>Use at least eight characters. This updates the account opened by your recovery link.</p>
      <label>
        New password
        <input
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="btn dark" disabled={busy}>
        {busy ? 'Updating…' : 'Save new password'}
        <Check size={17} />
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}
