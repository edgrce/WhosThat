import { useState } from "react";
import { FaBookOpen, FaTrophy, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Button: Visible only on mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0b1b2a] text-[#ffe7a0] rounded focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#0b1b2a] text-[#ffe7a0] flex flex-col
          w-64 min-w-[220px] z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:transform-none
        `}
      >
        {/* Logo */}
        <div className="p-8 border-b border-[#2c3a4a] flex items-center justify-center">
          <button
            onClick={() => {
              navigate("/dashboard");
              setIsOpen(false); // close sidebar on mobile click
            }}
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
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-xl font-bold text-[#dbeafe] hover:text-[#ffe7a0] transition"
              >
                <FaBookOpen size={32} />
                <span>Library</span>
              </a>
              <hr className="border-[#ffe7a0]/30 mt-4" />
            </li>
            <li>
              <a
                href="/leaderboardpage"
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
    </>
  );
}
