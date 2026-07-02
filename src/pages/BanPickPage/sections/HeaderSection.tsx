interface HeaderSectionProps {
  round: number;
  totalRounds: number;
}

export default function HeaderSection({ round, totalRounds }: HeaderSectionProps) {
  return (
    <header className="text-center mb-2">
      <h1 className="text-3xl md:text-4xl font-bold text-[#a78bfa] leading-tight mb-1">
        ACAHKU Arcaea Competition
      </h1>
      <p className="text-lg text-[#c4b5fd] font-medium mb-2">
        Double Elimination Round
      </p>
      <p className="text-xl font-semibold text-[#c4b5fd]">
        Round {round} of {totalRounds}
      </p>
    </header>
  );
}
