import { cn } from "../lib/utils";

interface MenuIconProps {
  open?: boolean;
  className?: string;
}

export function MenuIcon({ open, className }: MenuIconProps) {
  return (
    <div className={cn("flex size-5 flex-col items-center justify-center gap-1", className)}>
      <span
        className={cn(
          "h-0.5 w-4 rounded-full bg-current transition-all duration-200",
          open && "translate-y-1.5 rotate-45"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-4 rounded-full bg-current transition-all duration-200",
          open && "opacity-0"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-4 rounded-full bg-current transition-all duration-200",
          open && "-translate-y-1.5 -rotate-45"
        )}
      />
    </div>
  );
}
