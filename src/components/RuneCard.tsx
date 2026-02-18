import { RuneName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Minus } from '@phosphor-icons/react';
import { RuneIcon } from '@/components/RuneIcon';

interface RuneCardProps {
  name: RuneName;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function RuneCard({ name, count, onIncrement, onDecrement }: RuneCardProps) {
  return (
    <Card className="p-2 flex flex-col items-center gap-1.5 bg-card border-border hover:border-accent/50 transition-colors">
      <RuneIcon name={name} size={48} />
      <div className="text-accent font-semibold text-xs tracking-widest">{name}</div>
      <div className="text-lg font-bold text-foreground">{count}</div>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onDecrement}
          disabled={count === 0}
          className="h-6 w-6 p-0"
        >
          <Minus className="text-destructive" size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onIncrement}
          className="h-6 w-6 p-0"
        >
          <Plus className="text-accent" size={14} />
        </Button>
      </div>
    </Card>
  );
}
