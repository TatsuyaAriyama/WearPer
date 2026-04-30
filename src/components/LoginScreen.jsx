import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, hasFirebaseConfig } from '../firebase/config.js';

export default function LoginScreen({ onDemoLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');

  async function handleEmailAuth(event) {
    event.preventDefault();
    setError('');

    if (!hasFirebaseConfig || !auth) {
      onDemoLogin({ email, displayName: email.split('@')[0] || 'WearPer User' });
      return;
    }

    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: email.split('@')[0] || 'WearPer User',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (authError) {
      setError(toReadableAuthError(authError.code));
    }
  }

  async function handleGoogleLogin() {
    setError('');

    if (!hasFirebaseConfig || !auth) {
      onDemoLogin({ email: 'demo@wearper.app', displayName: 'WearPer User' });
      return;
    }

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (authError) {
      setError(toReadableAuthError(authError.code));
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <div>
          <p>WearPer</p>
          <h1>Sign in</h1>
        </div>

        <button type="button" className="google-button" onClick={handleGoogleLogin}>
          Googleで続ける
        </button>

        <form className="login-form" onSubmit={handleEmailAuth}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="メールアドレス"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="パスワード"
            required
          />
          {error && <span>{error}</span>}
          <button type="submit">{mode === 'signup' ? '登録' : 'ログイン'}</button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
        >
          {mode === 'login' ? 'アカウント作成へ' : 'ログインへ戻る'}
        </button>
      </section>
    </main>
  );
}

function toReadableAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスはすでに登録されています。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式を確認してください。';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが違います。';
    case 'auth/weak-password':
      return 'パスワードは6文字以上で入力してください。';
    case 'auth/popup-closed-by-user':
      return 'Googleログインがキャンセルされました。';
    default:
      return 'ログインに失敗しました。時間をおいて再度お試しください。';
  }
}
