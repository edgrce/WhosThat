import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../firebase/services';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import backgroundImage from '../assets/bg.jpeg';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email atau password salah');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Gagal login dengan Google');
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full h-full flex items-start justify-start p-10">
        <div className="bg-[#000A1B] border border-[#D9D9D9] p-10 rounded-xl shadow-lg max-w-md w-full text-[#D9D9D9]">
          <h1 className="text-3xl font-bold mb-6 tracking-wider text-[#FFE3A9]">Login</h1>

          {error && <div className="text-red-400 mb-4">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-transparent border border-[#D9D9D9] placeholder-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#686DE0]"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-transparent border border-[#D9D9D9] placeholder-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#686DE0]"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-[#686DE0] hover:bg-[#5a60d6] text-white font-semibold py-2 rounded transition duration-200"
            >
              Login
            </button>
          </form>

          <div className="my-6 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative bg-[#000A1B] px-4 text-gray-400 text-sm inline-block">Atau</div>
          </div>

          <GoogleAuthButton onClick={handleGoogleLogin} />

          <div className="cursor-pointer text-center text-sm mt-6 text-gray-400">
            Belum punya akun?{' '}
            <a href="/register" className="text-[#FFE3A9] hover:underline">
              Daftar disini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
