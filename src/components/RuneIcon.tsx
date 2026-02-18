import { RuneName } from '@/lib/types';
import { RUNE_IMAGES } from '@/lib/rune-images';
import { cn } from '@/lib/utils';

interface RuneIconProps {
  name: RuneName;
  size?: number;
  className?: string;
}

export function RuneIcon({ name, size = 32, className }: RuneIconProps) {
  return (
    <img 
      src={RUNE_IMAGES[name]}
      alt={`${name} Rune`}
      className={cn("object-contain", className)}
      style={{ 
        width: size, 
        height: size,
      }}
      title={name}
    />
  );
}
