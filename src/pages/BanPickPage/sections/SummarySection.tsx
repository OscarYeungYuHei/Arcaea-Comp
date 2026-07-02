interface SummarySectionProps {
  allBannedHistory: string[][];
  allSelectedHistory: string[][];
  totalRounds: number;
}

export default function SummarySection({
  allBannedHistory,
  allSelectedHistory,
  totalRounds,
}: SummarySectionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-[#a78bfa] text-xl font-bold mb-6 text-center">
        Ban &amp; Pick Summary
      </h3>
      <div className="space-y-4">
        {Array.from({ length: totalRounds }, (_, i) => (
          <div
            key={i}
            className="bg-[#1e1b4b] rounded-lg p-4"
          >
            <h4 className="text-[#a78bfa] font-semibold mb-2">
              Round {i + 1}
            </h4>
            <p className="text-sm leading-relaxed mb-1">
              <strong className="text-[#c4b5fd]">Banned:</strong>{' '}
              {allBannedHistory[i]?.join(' • ') || '—'}
            </p>
            <p className="text-sm leading-relaxed">
              <strong className="text-[#c4b5fd]">Selected:</strong>{' '}
              {allSelectedHistory[i]?.join(' • ') || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
