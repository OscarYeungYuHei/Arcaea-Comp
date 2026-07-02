import { useState, useCallback, useEffect, useRef } from 'react';
import type { ISong } from '@/data/songs';
import { MOCK_SONGS } from '@/data/songs';
import HeaderSection from './sections/HeaderSection';
import GameBoardSection from './sections/GameBoardSection';
import SummarySection from './sections/SummarySection';

const TOTAL_ROUNDS = 14;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function pickSongsForRound(
  unusedSongs: ISong[],
  allSongs: ISong[],
): { picked: ISong[]; remaining: ISong[] } {
  let picked: ISong[] = [];
  const shuffled = shuffleArray(unusedSongs);
  const take = Math.min(6, shuffled.length);
  picked = shuffled.slice(0, take);

  const pickedNames = new Set(picked.map((s) => s.name));
  const remaining = unusedSongs.filter((s) => !pickedNames.has(s.name));

  if (picked.length < 6) {
    const needed = 6 - picked.length;
    const pool = allSongs.filter((s) => !pickedNames.has(s.name));
    const extra = shuffleArray(pool).slice(0, needed);
    picked = [...picked, ...extra];
  }

  return { picked: shuffleArray(picked), remaining };
}

export default function BanPickPage() {
  const [currentRound, setCurrentRound] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [bannedSongs, setBannedSongs] = useState<string[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [currentSongs, setCurrentSongs] = useState<ISong[]>([]);
  const [unusedSongs, setUnusedSongs] = useState<ISong[]>([...MOCK_SONGS]);
  const [allBannedHistory, setAllBannedHistory] = useState<string[][]>([]);
  const [allSelectedHistory, setAllSelectedHistory] = useState<string[][]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [operationHistory, setOperationHistory] = useState<
    { type: 'ban' | 'pick'; songName: string }[]
  >([]);

  const initialized = useRef(false);

  const startRound = useCallback((round: number, unused: ISong[]) => {
    const { picked, remaining } = pickSongsForRound(unused, MOCK_SONGS);
    setCurrentRound(round);
    setClickCount(0);
    setBannedSongs([]);
    setSelectedSongs([]);
    setCurrentSongs(picked);
    setUnusedSongs(remaining);
    setOperationHistory([]);
  }, []);

  // Initialize first round on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startRound(1, [...MOCK_SONGS]);
    }
  }, [startRound]);

  const handleSongClick = useCallback(
    (song: ISong) => {
      if (clickCount >= 4) return;
      if (bannedSongs.includes(song.name) || selectedSongs.includes(song.name)) return;

      if (clickCount < 2) {
        setBannedSongs((prev) => [...prev, song.name]);
        setOperationHistory((prev) => [...prev, { type: 'ban', songName: song.name }]);
      } else {
        setSelectedSongs((prev) => [...prev, song.name]);
        setOperationHistory((prev) => [...prev, { type: 'pick', songName: song.name }]);
      }
      setClickCount((prev) => prev + 1);
    },
    [clickCount, bannedSongs, selectedSongs],
  );

  const handleUndo = useCallback(() => {
    if (operationHistory.length === 0) return;
    const lastOp = operationHistory[operationHistory.length - 1];
    setOperationHistory((prev) => prev.slice(0, -1));
    if (lastOp.type === 'ban') {
      setBannedSongs((prev) => prev.filter((name) => name !== lastOp.songName));
    } else {
      setSelectedSongs((prev) => prev.filter((name) => name !== lastOp.songName));
    }
    setClickCount((prev) => prev - 1);
  }, [operationHistory]);

  const handleNextRound = useCallback(() => {
    // Record current round history
    const newBannedHistory = [...allBannedHistory, [...bannedSongs]];
    const newSelectedHistory = [...allSelectedHistory, [...selectedSongs]];
    setAllBannedHistory(newBannedHistory);
    setAllSelectedHistory(newSelectedHistory);

    if (currentRound >= TOTAL_ROUNDS) {
      setGameComplete(true);
      return;
    }

    startRound(currentRound + 1, unusedSongs);
  }, [
    currentRound,
    bannedSongs,
    selectedSongs,
    unusedSongs,
    allBannedHistory,
    allSelectedHistory,
    startRound,
  ]);

  // Show nothing while initializing
  if (currentRound === 0) {
    return null;
  }

  const pageShell = (children: React.ReactNode) => (
    <div
      className="min-h-screen text-[#e0e0e0] flex flex-col items-center px-4 py-8 relative"
      style={{
        background: '#12121e url(https://aka.doubaocdn.com/s/RBzj1whnrJ) center/cover no-repeat fixed',
      }}
    >
      <div className="absolute inset-0 bg-[rgba(18_18_30_0.75)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-[1100px]">
        {children}
      </div>
    </div>
  );

  if (gameComplete) {
    return pageShell(
      <>
        <HeaderSection round={TOTAL_ROUNDS} totalRounds={TOTAL_ROUNDS} />
        <p className="text-center text-[#a78bfa] text-lg font-semibold mb-8">
          All Rounds Complete!
        </p>
        <SummarySection
          allBannedHistory={allBannedHistory}
          allSelectedHistory={allSelectedHistory}
          totalRounds={TOTAL_ROUNDS}
        />
      </>,
    );
  }

  return pageShell(
    <>
      <HeaderSection round={currentRound} totalRounds={TOTAL_ROUNDS} />
        <GameBoardSection
          songs={currentSongs}
          bannedSongs={bannedSongs}
          selectedSongs={selectedSongs}
          clickCount={clickCount}
          currentRound={currentRound}
          totalRounds={TOTAL_ROUNDS}
          onSongClick={handleSongClick}
          onNextRound={handleNextRound}
          onUndo={handleUndo}
        />
    </>,
  );
}
