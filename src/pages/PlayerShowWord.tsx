import { useLocation, useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpeg";
import cardIcon from "../assets/cards.png";

export default function PlayerShowWord() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer,
    assignedRoles = [],
    assignedNames = [],
    username,
    role,
    word,
  } = state || {};

  const nextPlayer = currentPlayer + 1;

  const handleOk = () => {
    if (nextPlayer <= playersCount) {
      // Lanjut ke player berikutnya
      navigate("/playerdraw", {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer: nextPlayer,
          assignedRoles,
          assignedNames,
        }
      });
    } else {
      // Semua player sudah dapat card, lanjut ke tahap berikutnya (misal: game start)
      navigate("/votescreen", { state: { gameId } });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />
      <div className="relative z-10 bg-[#e5e5e5] rounded-xl shadow-xl p-10 flex flex-col items-center w-[90vw] max-w-xl">
        <img src={cardIcon} alt="player" className="w-24 h-24 mb-2" />
        <div className="text-xl font-bold mb-2">{username}</div>
        <div className="bg-gray-300 rounded-xl w-full h-48 flex items-center justify-center text-4xl font-bold mb-8">
          {role === "mrWhite" ? <span className="text-gray-500 text-center">No Word <br />you're Mr.White</span> : word}
        </div>
        <button
          className="bg-[#0b1b2a] text-white px-10 py-2 rounded-lg text-lg font-bold hover:bg-[#22364a] transition"
          onClick={handleOk}
        >
          Ok
        </button>
      </div>
    </div>
  );
}