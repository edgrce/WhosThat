import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0b1b2a] p-6 flex justify-end">
      <button
        onClick={() => navigate('/profile')}
        className="focus:outline-none"
        aria-label="Profile"
      >
        <FaUserCircle size={48} className="cursor-pointer text-[#ffe7a0] border-2 border-[#ffe7a0] rounded-full p-1 bg-[#0b1b2a]" />
      </button>
    </header>
  );
}