import { cn } from "~/lib/utils";

interface VinylRecordProps {
  isPlaying: boolean;
  className?: string;
}

export function VinylRecord({ isPlaying, className }: VinylRecordProps) {
  return (
    <div
      className={cn("relative aspect-square rounded-full bg-[#1a1a1a]", className)}
      style={{
        animation: "vinyl-spin 3s linear infinite",
        animationPlayState: isPlaying ? "running" : "paused",
      }}
    >
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="absolute inset-[8%] rounded-full border border-white/[0.03]" />
      <div className="absolute inset-[15%] rounded-full border border-white/[0.05]" />
      <div className="absolute inset-[22%] rounded-full border border-white/[0.03]" />
      <div className="absolute inset-[29%] rounded-full border border-white/[0.05]" />
      <div className="absolute inset-[36%] rounded-full border border-white/[0.03]" />

      <div
        className="absolute inset-[38%] rounded-full"
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
        }}
      />

      <div className="absolute inset-[46%] rounded-full bg-white" />

      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
        }}
      />
    </div>
  );
}
