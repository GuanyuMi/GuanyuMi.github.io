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
        <h1>Sign in to publish</h1>
        <p className="login-copy">
          {configured
            ? 'Local resume files stay private until you publish.'
            : 'Add the Supabase URL and publishable key to apps/resume-studio/.env.local.'}
        </p>
        <label>
          Email
          <input autoComplete="email" disabled={!configured || isSubmitting} onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </label>
        <label>
          Password
          <input autoComplete="current-password" disabled={!configured || isSubmitting} onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
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
