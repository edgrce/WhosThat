import bg from '../assets/bg.jpeg';
import { useNavigate, useLocation } from 'react-router-dom';
import cardPlayIcon from '../assets/game-icons_card-play.svg';

export default function PlayerDraw() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer = 1,
    assignedRoles = [],
    assignedNames = [],
    usernames = [],
    isNextRound = false, // ✅ flag default
  } = location.state || {};

  // ✅ Ambil username: NextRound pakai usernames; FirstRound pakai Player X
  const currentUsername = usernames.length > 0
    ? usernames[currentPlayer - 1] || `Player ${currentPlayer}`
    : `Player ${currentPlayer}`;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />

      <div
        className="relative z-10 bg-[#e5e5e5] rounded-xl flex flex-col items-center justify-center w-[90vw] max-w-xl h-[60vw] max-h-[420px] min-h-[320px] min-w-[270px] p-4"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <div
          className="text-[#0b1b2a] text-3xl md:text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "'Luckiest Guy', 'Comic Sans MS', cursive, sans-serif" }}
        >
          {currentUsername}
        </div>

        <img
          src={cardPlayIcon}
          alt="Draw Card"
          className="mb-10 w-28 h-28 md:w-32 md:h-32 object-contain"
          style={{ maxWidth: '35vw', maxHeight: '35vw' }}
        />

        <button
          className="w-1/2 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#ffe7a0] text-[#22364a] font-bold text-2xl shadow-lg transition hover:bg-[#ffe7a0]/90 hover:shadow-xl cursor-pointer"
          onClick={() =>
            navigate('/playerwordcard', {
              state: {
                gameId,
                playersCount,
                roles,
                difficulty,
                currentPlayer,
                assignedRoles,
                assignedNames,
                usernames,
                username: currentUsername, // ✅ bawa nama sesuai urutan
                isNextRound,               // ✅ bawa flag
              },
            })
          }
        >
          OK
        </button>
      </div>
    </div>
  );
}
