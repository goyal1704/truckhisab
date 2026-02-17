import { useState } from 'react';

export default function AuthForm({ type = 'login', onSubmit, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '', email: '' });

  const isLogin = type === 'login';

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="auth-card">
      <h1>{isLogin ? 'Login' : 'Forgot Password'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </label>

        {!isLogin && (
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
        )}

        {isLogin && (
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
        )}

        <button type="submit">{isLogin ? 'Login' : 'Send Reset Link'}</button>
      </form>
      <button className="link-btn" onClick={onSwitch}>
        {isLogin ? 'Forgot Password?' : 'Back to Login'}
      </button>
    </div>
  );
}
