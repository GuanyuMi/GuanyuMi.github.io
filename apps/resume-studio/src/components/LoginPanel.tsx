import { useState, type FormEvent } from 'react';

interface LoginPanelProps {
  configured: boolean;
  onSubmit: (email: string, password: string) => Promise<string | null>;
}

const LoginPanel = ({ configured, onSubmit }: LoginPanelProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(await onSubmit(email, password));
    setIsSubmitting(false);
  };

  return (
    <main className="login-shell">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Resume Studio</p>
        <h1>Sign in to edit</h1>
        <p className="login-copy">
          {configured
            ? 'Your drafts stay private until you publish them.'
            : 'Add Supabase settings to .env.local before signing in.'}
        </p>
        <label>
          Email
          <input disabled={!configured || isSubmitting} onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </label>
        <label>
          Password
          <input disabled={!configured || isSubmitting} onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={!configured || isSubmitting} type="submit">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
};

export default LoginPanel;
