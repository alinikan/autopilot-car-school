import { useState } from 'react';
import type { FormEvent } from 'react';
import { cloudConfigured, supabase } from '../../lib/supabase';
import { Modal } from '../../components/ui/Modal';
import { PasswordRecovery } from './PasswordRecovery';
import { ArrowRight, HelpCircle, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { ViewTabs } from '../../components/ui/ViewTabs';

export function AccountModal({
  userEmail,
  close,
  ready,
  recovery = false,
}: {
  userEmail?: string;
  close: () => void;
  ready: boolean;
  recovery?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'email' | 'signin' | 'signup'>('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + '/' },
        });
        if (error) throw error;
        setSent(true);
        setMessage(
          'Check your inbox for your secure sign-in link. New here? Confirming the link finishes setting up your account.',
        );
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + '/' },
        });
        if (error) throw error;
        if (!data.session)
          setMessage('Check your inbox to confirm your email, then come back and sign in.');
        else close();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        close();
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'Sign-in could not complete. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
  const switchMode = (next: 'email' | 'signin' | 'signup') => {
    setMode(next);
    setMessage('');
    setSent(false);
  };
  return (
    <Modal
      title={recovery ? 'Choose a new password' : userEmail ? 'Your account' : 'Save your progress'}
      close={close}
    >
      {recovery ? (
        <PasswordRecovery close={close} />
      ) : userEmail ? (
        <>
          <div className="account-connected">
            <ShieldCheck size={38} />
            <h3>You’re signed in.</h3>
            <p>{userEmail}</p>
          </div>
          <p>
            Your learning progress is saved to your private Supabase account. You can keep learning
            on another device after signing in.
          </p>
          <button
            className="btn outline"
            onClick={async () => {
              await supabase?.auth.signOut();
              close();
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </>
      ) : (
        <>
          <p className="modal-intro">
            Save your learning journey and pick up where you left off across devices.
          </p>
          {!cloudConfigured ? (
            <div className="info-strip">
              <HelpCircle size={20} />
              <p>
                Account sync is being configured. You can keep learning now; progress is saved on
                this device.
              </p>
            </div>
          ) : (
            <>
              <ViewTabs
                value={mode}
                onChange={(v) => switchMode(v as 'email' | 'signin' | 'signup')}
                options={[
                  { id: 'email', label: 'Email link' },
                  { id: 'signin', label: 'Sign in' },
                  { id: 'signup', label: 'Sign up' },
                ]}
                label="Account sign-in method"
              >
                <form className="account-form" onSubmit={submit}>
                  <label>
                    Email address
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSent(false);
                      }}
                      required
                      placeholder="you@example.com"
                    />
                  </label>
                  {mode !== 'email' && (
                    <label>
                      Password
                      <input
                        type="password"
                        minLength={8}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="At least 8 characters"
                      />
                    </label>
                  )}
                  {mode === 'email' && (
                    <p className="small muted">
                      We’ll email you a secure link. Click it to sign in or finish creating your
                      account. No password needed.
                    </p>
                  )}
                  <button className="btn dark" disabled={loading || !ready || sent} type="submit">
                    {loading
                      ? 'One moment…'
                      : mode === 'email'
                        ? sent
                          ? 'Check your email'
                          : 'Email me a sign-in link'
                        : mode === 'signup'
                          ? 'Create your account'
                          : 'Sign in'}
                    {mode === 'email' ? <Mail size={17} /> : <ArrowRight size={17} />}
                  </button>
                </form>
              </ViewTabs>
              {mode === 'signin' && (
                <button
                  className="text-button guest-button"
                  disabled={loading}
                  onClick={async () => {
                    if (!email.trim()) {
                      setMessage('Enter your email address first, then request a reset link.');
                      return;
                    }
                    setLoading(true);
                    setMessage('');
                    try {
                      const { error } = await supabase!.auth.resetPasswordForEmail(email.trim(), {
                        redirectTo: window.location.origin + '/reset-password',
                      });
                      if (error) throw error;
                      setMessage(
                        'If an account exists, check your inbox for a password reset link.',
                      );
                    } catch (err) {
                      setMessage(
                        err instanceof Error
                          ? err.message
                          : 'Could not request a reset link. Please try again.',
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Forgot your password?
                </button>
              )}
              {message && (
                <div className="form-message" role="status">
                  {message}
                </div>
              )}
              <p className="small muted">
                Your first account starts with this device’s progress. Signing into an existing
                account loads that account’s saved journey.
              </p>
            </>
          )}
          <button className="text-button guest-button" onClick={close}>
            Keep learning on this device <ArrowRight size={14} />
          </button>
        </>
      )}
    </Modal>
  );
}
