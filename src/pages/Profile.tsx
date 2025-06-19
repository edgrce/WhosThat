import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCamera, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ✅ Ambil current user dari Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setUsername(auth.currentUser.displayName || auth.currentUser.email);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImg(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col min-h-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-[#0b1b2a]/60 -z-10" />

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="relative bg-[#071829]/70 backdrop-blur-lg rounded-xl shadow-2xl px-3 py-8 w-full max-w-sm flex flex-col items-center">
            
            {/* Avatar */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                {/* ✅ Selalu pakai icon */}
                <FaUserCircle className="w-24 h-24 text-[#ffe7a0] bg-[#0b1b2a] rounded-full border-4 border-[#ffe7a0]" />

                <button
                  onClick={handleProfileClick}
                  className="absolute bottom-1 right-1 bg-[#ffe7a0] text-[#0b1b2a] rounded-full p-1 border-2 border-white hover:bg-[#ffe7a0]/80 transition"
                  title="Upload Photo"
                >
                  <FaCamera size={16} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="mt-6 mb-2 text-center">
              <h1 className="text-[#ffe7a0] text-xl font-bold break-words">
                {username || "Anonymous"}
              </h1>
            </div>

            {/* Stats */}
            <div className="w-full">
              <h2 className="text-[#ffe7a0] text-lg font-bold mb-4 font-[cursive] text-center">
                activity
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Match", value: "0", bg: "#cbe3e8" },
                  { label: "Winrate", value: "0%", bg: "#fbb6ce" },
                  { label: "Active days", value: "0", bg: "#ffe7a0" },
                  { label: "Rank", value: "0", bg: "#a5a1f8" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg flex flex-col items-center justify-center py-4 hover:scale-105 transition"
                    style={{ backgroundColor: item.bg }}
                  >
                    <span className="text-2xl font-bold italic text-white drop-shadow">
                      {item.value}
                    </span>
                    <span className="text-[#071829] text-sm font-semibold mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-[#e57373] hover:bg-[#fbb6ce] text-[#ffe7a0] font-bold py-3 rounded-lg transition text-base"
              >
                <FaSignOutAlt />
                Log out
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
