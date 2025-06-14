import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import bg from '../assets/bg.jpeg';
import logo from '../assets/logo.png';
import civilianIcon from '../assets/civilain.png';
import undercoverIcon from '../assets/undercover.png';
import mrWhiteIcon from '../assets/mrwhite.png';
import cardSilhouette from '../assets/cards.png';
import GameLogo from '../components/GameLogo';
import RoleList from '../components/RoleList';

type Roles = {
  civilian: number;
  undercover: number;
  mrWhite: number;
};

const ROLE_META = {
  civilian: {
    label: 'Civilian',
    color: '#8fa9d9',
    icon: civilianIcon,
  },
  undercover: {
    label: 'Undercover',
    color: '#2d2e3e',
    icon: undercoverIcon,
  },
  mrWhite: {
    label: 'Mr. White',
    color: '#ffe7a0',
    icon: mrWhiteIcon,
  },
};

export default function PlayerWordCardScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer = 1,
    assignedRoles = [],
    assignedNames = [],
  } = location.state || {};

  // State untuk menyimpan username player yang sedang memilih card
  const [playerName, setPlayerName] = useState<string | null>(null);

  // Handler ketika card diklik
  const handleCardClick = async (idx: number) => {
    // Hanya card giliran player saat ini yang bisa diklik
    if (idx !== assignedNames.length) return;

    // Cek apakah playerName sudah ada di assignedNames
    if (!playerName) {
      // Redirect ke login username
      navigate('/login-username', {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer,
          assignedRoles,
          assignedNames,
        },
      });
      return;
    }

    // Cek di Firestore apakah player sudah ada
    const playerRef = doc(db, 'games', gameId, 'players', playerName);
    const playerSnap = await getDoc(playerRef);
    if (playerSnap.exists()) {
      // Sudah login, langsung ke PlayerShowWord
      const data = playerSnap.data();
      navigate('/playershowword', {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer,
          assignedRoles,
          assignedNames,
          username: playerName,
          role: data.role,
          word: data.word,
        },
      });
    } else {
      // Belum login, redirect ke login username
      navigate('/login-username', {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer,
          assignedRoles,
          assignedNames,
        },
      });
    }
  };

  // Untuk demo, playerName diambil dari assignedNames[currentPlayer-1] jika sudah ada
  useEffect(() => {
    if (assignedNames && assignedNames.length >= currentPlayer) {
      setPlayerName(assignedNames[currentPlayer - 1]);
    } else {
      setPlayerName(null);
    }
  }, [assignedNames, currentPlayer]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center font-sans"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />

      {/* Logo */}
      <GameLogo src={logo} />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full max-w-7xl px-2 md:px-8">
        {/* Left Card: Player & Roles */}
        <div className="bg-[#f5f6f7]/90 rounded-2xl shadow-xl w-[320px] min-h-[420px] flex flex-col px-8 py-8 mr-4 md:mr-12">
          <div className="text-3xl font-bold text-[#22364a] mb-2" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
            Player {currentPlayer}
          </div>
          <div className="text-[#3b5c7e] text-lg mb-4">choose a card</div>
          <RoleList roles={roles} meta={ROLE_META} />
        </div>

        {/* Cards Grid */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: `repeat(${Math.ceil(playersCount / 3)}, minmax(0, 1fr))`,
              minWidth: 340,
              maxWidth: 600,
            }}
          >
            {Array.from({ length: playersCount }).map((_, idx) => {
              // Card sudah dipilih
              const isPicked = idx < assignedNames.length;
              // Card giliran player saat ini
              const isCurrent = idx === assignedNames.length;
              return (
                <div key={idx} className="flex items-center justify-center">
                  <button
                    className={`bg-[#ffe7a0] rounded-xl shadow-lg w-[120px] h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center border-4 border-[#22364a] transition
                      ${isPicked ? "opacity-40 cursor-not-allowed" : ""}
                      ${isCurrent ? "ring-4 ring-blue-400" : ""}
                    `}
                    onClick={() => handleCardClick(idx)}
                    disabled={!isCurrent || isPicked}
                    style={{ outline: 'none' }}
                  >
                    <img src={cardSilhouette} alt="?" className="w-16 h-16 md:w-20 md:h-20 opacity-90" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}