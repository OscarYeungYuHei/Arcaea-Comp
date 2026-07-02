import { useState, useCallback } from 'react';
import type { ISong } from '@/data/songs';
import { Image } from '@/components/ui/image';

function getSongImageUrl(songName: string): string {
  const fileName = `Jacket_${songName.replace(/ /g, '_')}.png`;
  return `https://arcaea.fandom.com/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

function isLongName(name: string): boolean {
  return name.length > 18;
}

function getDifficultyClass(difficulty: string): string {
  const type = difficulty.split(' ')[0].toLowerCase();
  if (type === 'beyond') return 'border-red-500';
  if (type === 'eternal') return 'border-[#c4b5fd]';
  return 'border-purple-500';
}

function getDifficultyInfoBg(difficulty: string): string {
  const type = difficulty.split(' ')[0].toLowerCase();
  if (type === 'beyond') return 'bg-red-500/35';
  if (type === 'eternal') return 'bg-[#c4b5fd]/35';
  return 'bg-purple-500/35';
}

interface SongCardProps {
  song: ISong;
  isBanned: boolean;
  isSelected: boolean;
  disabled: boolean;
  onClick: (song: ISong) => void;
}

function SongCard({ song, isBanned, isSelected, disabled, onClick }: SongCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleClick = useCallback(() => {
    if (!isBanned && !isSelected && !disabled) {
      onClick(song);
    }
  }, [isBanned, isSelected, disabled, onClick, song]);

  const borderClass = getDifficultyClass(song.difficulty);
  const infoBgClass = getDifficultyInfoBg(song.difficulty);
  const isClickable = !isBanned && !isSelected && !disabled;

  return (
    <div className="flex justify-center">
      <div
        onClick={handleClick}
        className={`
          w-[100px] h-[140px] md:w-[160px] md:h-[220px]
          relative cursor-pointer rounded-md border-8
          bg-[#1e1b4b] overflow-hidden flex flex-col
          transition-transform duration-200 ease-out
          shadow-lg
          ${borderClass}
          ${isClickable ? 'hover:scale-105 hover:shadow-[0_8px_20px_rgba(167_139_250_0.5)]' : ''}
          ${isBanned || isSelected ? 'cursor-default' : ''}
        `}
      >
        {/* Jacket image area */}
        <div className="w-full flex-1 min-h-0 overflow-hidden bg-[#1e1b4b] relative">
          {!imgError ? (
            <Image
              src={getSongImageUrl(song.name)}
              alt={song.name}
              loading="lazy"
              className="w-full h-full object-cover block"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-2">
              <span className="text-white text-xs md:text-sm font-semibold text-center leading-tight">
                {song.name}
              </span>
            </div>
          )}

          {/* Overlay badge */}
          {(isBanned || isSelected) && (
            <div
              className={`
                absolute inset-x-0 top-1/2 -translate-y-1/2
                py-2 md:py-3
                flex items-center justify-center rounded-md
                text-xs md:text-sm font-black tracking-widest uppercase text-white
                z-10
                ${isBanned ? 'bg-red-500/70' : 'bg-green-500/70'}
              `}
            >
              {isBanned ? 'BANNED' : 'SELECTED'}
            </div>
          )}
        </div>

        {/* Song info */}
        <div className={`px-1.5 py-1 md:px-2 md:py-1.5 ${infoBgClass} text-center shrink-0`}>
          <div
            className={`
              font-semibold text-white leading-tight mb-0.5
              flex items-center justify-center
              ${isLongName(song.name) ? 'text-[0.54rem] md:text-[0.68rem]' : 'text-[0.62rem] md:text-[0.78rem]'}
            `}
            style={{ minHeight: '1.6em' }}
          >
            {song.name}
          </div>
          <div className="text-[0.65rem] md:text-[0.85rem] font-bold uppercase tracking-wide text-white">
            {song.difficulty}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameBoardSectionProps {
  songs: ISong[];
  bannedSongs: string[];
  selectedSongs: string[];
  clickCount: number;
  currentRound: number;
  totalRounds: number;
  onSongClick: (song: ISong) => void;
  onNextRound: () => void;
  onUndo: () => void;
}

export default function GameBoardSection({
  songs,
  bannedSongs,
  selectedSongs,
  clickCount,
  currentRound,
  totalRounds,
  onSongClick,
  onNextRound,
  onUndo,
}: GameBoardSectionProps) {
  const isRoundComplete = clickCount >= 4;
  const isAllComplete = currentRound >= totalRounds && isRoundComplete;

  const statusText = (() => {
    if (isRoundComplete) return 'Round complete!';
    if (clickCount < 2) {
      const bansLeft = 2 - clickCount;
      return `Click any song to ban it. Bans remaining: ${bansLeft}`;
    }
    const picksLeft = 4 - clickCount;
    return `Click any unbanned song to select it. Picks remaining: ${picksLeft}`;
  })();

  return (
    <div className="flex flex-col items-center">
      {/* Status bar */}
      <div className="text-base text-[#94a3b8] mb-5 min-h-[1.5rem] text-center">
        {statusText}
      </div>

      {/* Grid container: 3 columns on desktop, 2 columns on mobile */}
      <div className="w-full max-w-[900px] mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {songs.map((song) => (
            <SongCard
              key={song.name}
              song={song}
              isBanned={bannedSongs.includes(song.name)}
              isSelected={selectedSongs.includes(song.name)}
              disabled={isRoundComplete}
              onClick={onSongClick}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        {/* Undo button */}
        {clickCount > 0 && (
          <button
            onClick={onUndo}
            className="px-6 py-3 text-base font-semibold bg-[#a78bfa] text-white
                       border-none rounded-lg cursor-pointer
                       transition-colors duration-200
                       hover:bg-[#8b5cf6]"
          >
            Undo
          </button>
        )}

        {/* Next Round button */}
        {isRoundComplete && (
          <button
            onClick={onNextRound}
            className="px-8 py-3 text-base font-semibold bg-[#7c3aed] text-white
                       border-none rounded-lg cursor-pointer
                       transition-colors duration-200
                       hover:bg-[#6d28d9]"
          >
            {isAllComplete ? 'Show Final Summary' : 'Next Round'}
          </button>
        )}
      </div>
    </div>
  );
}
