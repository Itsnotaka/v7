function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface ProgressDisplayProps {
  currentMs: number;
  durationMs: number;
}

export function ProgressDisplay({ currentMs, durationMs }: ProgressDisplayProps) {
  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {formatTime(currentMs)} / {formatTime(durationMs)}
    </span>
  );
}
