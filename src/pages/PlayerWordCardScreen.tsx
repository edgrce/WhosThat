import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import bg from '../assets/bg.jpeg';
import logo from '../assets/logo.png';
import cardSilhouette from '../assets/cards.png';
import GameLogo from '../components/GameLogo';
import RoleList from '../components/RoleList';
import ROLE_META from "../constants/RoleMeta";

interface GameState {
  gameId: string;
  playersCount: number;
  roles: {
    civilian: number;
    undercover: number;
    mrwhite: number;
  };
  difficulty: string;
  currentPlayer?: number;
  assignedRoles?: string[];
  assignedNames?: string[];
}

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
  } = location.state as GameState || {};

  const [playerName, setPlayerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = async (idx: number) => {
    try {
      if (idx < assignedNames.length) return;

      if (!playerName) {
        navigate('/login-username', { state: location.state });
        return;
      }

      const playerRef = doc(db, 'games', gameId, 'players', auth.currentUser?.uid || '');
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const playerData = playerSnap.data();
        navigate('/playershowword', {
          state: {
            ...location.state,
            username: playerName,
            role: playerData.role,
            word: playerData.word,
          },
        });
      } else {
        navigate('/login-username', { state: location.state });
      }
    } catch (err) {
      setError('Failed to process card selection');
      console.error(err);
    }
  };

  const assignWords = async () => {
    try {
      const wordsQuery = query(
        collection(db, 'words'), 
        where('difficulty', '==', difficulty)
      );
      const wordsSnap = await getDocs(wordsQuery);
      const words = wordsSnap.docs.map(doc => doc.data().word);
      
      if (words.length === 0) {
        throw new Error('No words found for selected difficulty');
      }

      const selectedWord = words[Math.floor(Math.random() * words.length)];
      const similarWord = getSimilarWord(selectedWord); // Implement this function

      const playersSnap = await getDocs(collection(db, 'games', gameId, 'players'));
      const batch = writeBatch(db);

      playersSnap.forEach(playerDoc => {
        const player = playerDoc.data();
        const word = 
          player.role === 'undercover' ? similarWord :
          player.role === 'civilian' ? selectedWord :
          null;
        
        batch.update(playerDoc.ref, { word });
      });

      await batch.commit();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (assignedNames && assignedNames.length >= currentPlayer) {
      setPlayerName(assignedNames[currentPlayer - 1]);
    } else {
      setPlayerName(null);
    }

    // Assign words when component mounts
    assignWords();
  }, []);

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

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

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
              const isPicked = idx < assignedNames.length;
              return (
                <div key={idx} className="flex items-center justify-center">
                  <button
                    className={`bg-[#ffe7a0] rounded-xl shadow-lg w-[120px] h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center border-4 border-[#22364a] transition
                      ${isPicked ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}
                    `}
                    onClick={() => handleCardClick(idx)}
                    disabled={isPicked}
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

// Helper function - implement according to your word matching logic
function getSimilarWord(word: string): string {
  // Example implementation
  const similarWords: Record<string, string> = {
    'pizza': 'pasta',
    'apple': 'orange',
    'car': 'bus'
  };
  return similarWords[word.toLowerCase()] || word;
}