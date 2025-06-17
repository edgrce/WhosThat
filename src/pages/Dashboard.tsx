import { useNavigate } from 'react-router-dom';
import { IoPlayCircleOutline } from 'react-icons/io5';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import bg from '../assets/bg.jpeg';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-[#0b1b2a]/60 -z-10" />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center relative z-10 px-4">
          <button
            onClick={() => navigate('/gamesetup')}
            className="cursor-pointer flex items-center justify-center rounded-full bg-[#fff3] hover:bg-[#ffe7a0]/30 transition w-40 h-40 md:w-56 md:h-56 shadow-xl"
            aria-label="Play"
          >
            <IoPlayCircleOutline size={120} className="text-[#ffe7a0] md:text-[140px]" />
          </button>
        </main>
      </div>
    </div>
  );
}
