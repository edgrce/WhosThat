import { FaBookOpen, FaTrophy, FaInfoCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-70 min-w-[220px] h-full bg-[#0b1b2a] text-[#ffe7a0] flex flex-col">
      {/* Logo */}
     <div className="p-8 border-b border-[#2c3a4a] flex items-center justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="focus:outline-none"
          aria-label="Go to Dashboard"
        >
          <img src={logo} alt="WhosThat Logo" className="cursor-pointer h-8 object-contain" />
        </button>
      </div>
      {/* Menu */}
      <nav className="flex-1 px-6 py-10">
        <ul className="space-y-8">
          <li>
            <a 
              href="/library" 
              className="flex items-center gap-4 text-xl font-bold text-[#dbeafe] hover:text-[#ffe7a0] transition"
            >
              <FaBookOpen size={32} />
              <span>Library</span>
            </a>
            <hr className="border-[#ffe7a0]/30 mt-4" />
          </li>
          <li>
            <a 
              href="/leaderboard" 
              className="flex items-center gap-4 text-xl font-bold text-[#ffe7a0] hover:text-[#dbeafe] transition"
            >
              <FaTrophy size={32} />
              <span>Leaderboard</span>
            </a>
            <hr className="border-[#ffe7a0]/30 mt-4" />
          </li>
          <li>
            <a 
              href="/information" 
              className="flex items-center gap-4 text-xl font-bold text-[#fbb6ce] hover:text-[#ffe7a0] transition"
            >
              <FaInfoCircle size={32} />
              <span>Information</span>
            </a>
            <hr className="border-[#fbb6ce]/30 mt-4" />
          </li>
        </ul>
      </nav>
    </div>
  );
}