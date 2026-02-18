import { Runeword } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RuneIcon } from '@/components/RuneIcon';

interface RunewordCardProps {
  runeword: Runeword;
  isCraftable: boolean;
}

export function RunewordCard({ runeword, isCraftable }: RunewordCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-300",
        isCraftable 
          ? "craftable-glow border-2" 
          : "opacity-60 hover:opacity-80"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl tracking-wide">{runeword.name}</CardTitle>
          {isCraftable && (
            <Badge className="bg-accent text-accent-foreground font-semibold">
              CRAFTABLE
            </Badge>
          )}
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          {runeword.runes.map((rune, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50 border border-border"
            >
              <RuneIcon name={rune} size={20} />
              <span className="text-xs font-semibold text-secondary-foreground tracking-wide">
                {rune}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>Level: {runeword.level}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{runeword.itemTypes.join(', ')}</span>
        </div>
        <div className="space-y-1">
          {runeword.properties.slice(0, 5).map((prop, idx) => (
            <div key={idx} className="text-sm text-card-foreground/80">
              • {prop}
            </div>
          ))}
          {runeword.properties.length > 5 && (
            <div className="text-sm text-muted-foreground italic">
              +{runeword.properties.length - 5} more properties...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
