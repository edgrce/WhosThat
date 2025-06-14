type Props = {
  totalPlayers: number;
  cardImage: string;
  names?: string[];
  numbers?: boolean;
  selectedIdx?: number;
  onCardClick?: (idx: number) => void;
};

export default function PlayerCardGrid({
  totalPlayers,
  cardImage,
  names,
  numbers,
  selectedIdx,
  onCardClick,
}: Props) {
  return (
    <div
      className="grid gap-8"
      style={{
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gridTemplateRows: `repeat(${Math.ceil(totalPlayers / 3)}, minmax(0, 1fr))`,
        minWidth: 340,
        maxWidth: 700,
      }}
    >
      {Array.from({ length: totalPlayers }).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="relative">
            <button
              className={`bg-[#ffe7a0] rounded-xl shadow-lg w-[120px] h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center border-4 border-[#22364a] transition hover:scale-105
                ${selectedIdx === idx ? "ring-4 ring-blue-400" : ""}
              `}
              onClick={() => onCardClick && onCardClick(idx)}
              style={{ outline: "none" }}
            >
              <img src={cardImage} alt="?" className="w-16 h-16 md:w-20 md:h-20 opacity-90" />
            </button>
            {numbers && (
              <span
                className="absolute -top-4 -left-4 bg-[#8fa9d9] text-[#22364a] font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white text-lg"
                style={{ fontFamily: "'Luckiest Guy', cursive" }}
              >
                {idx + 1}
              </span>
            )}
          </div>
          {names && (
            <div
              className="mt-2 text-xl font-bold text-white drop-shadow"
              style={{ fontFamily: "'Luckiest Guy', cursive" }}
            >
              {names[idx]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}