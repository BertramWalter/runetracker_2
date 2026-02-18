import { useState } from 'react';
import { RuneInventory } from '@/lib/types';
import { getRuneUpgrades, applyRuneUpgrade, type RuneUpgrade } from '@/lib/runeword-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkle, CaretDown } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RuneIcon } from '@/components/RuneIcon';

interface RuneUpgradeCalculatorProps {
  inventory: RuneInventory;
  onUpgrade: (newInventory: RuneInventory) => void;
}

export function RuneUpgradeCalculator({ inventory, onUpgrade }: RuneUpgradeCalculatorProps) {
  const [upgradeAmounts, setUpgradeAmounts] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(false);
  const upgrades = getRuneUpgrades(inventory);

  if (upgrades.length === 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle className="text-accent" />
                  <CardTitle>Rune Upgrader</CardTitle>
                </div>
                <CaretDown 
                  className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  size={20}
                />
              </div>
              <CardDescription>
                Combine 3 runes + gem in Horadric Cube to create the next tier
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">No upgrades available</p>
                <p className="text-sm">You need at least 3 of the same rune to upgrade</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  const handleUpgrade = (upgrade: RuneUpgrade) => {
    const amount = upgradeAmounts[upgrade.from] || 1;
    const actualAmount = Math.min(amount, upgrade.maxUpgrades);
    const newInventory = applyRuneUpgrade(inventory, upgrade.from, upgrade.to, actualAmount);
    onUpgrade(newInventory);
    setUpgradeAmounts({ ...upgradeAmounts, [upgrade.from]: 1 });
  };

  const handleAmountChange = (runeName: string, value: string) => {
    const num = parseInt(value) || 1;
    setUpgradeAmounts({ ...upgradeAmounts, [runeName]: Math.max(1, num) });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkle className="text-accent" />
                <CardTitle>Rune Upgrader</CardTitle>
                <span className="text-sm text-muted-foreground font-normal">
                  ({upgrades.length} upgrade{upgrades.length !== 1 ? 's' : ''} available)
                </span>
              </div>
              <CaretDown 
                className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                size={20}
              />
            </div>
            <CardDescription>
              Combine 3 runes + gem in Horadric Cube to create the next tier
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {upgrades.map((upgrade) => {
                  const amount = upgradeAmounts[upgrade.from] || 1;
                  const maxAmount = upgrade.maxUpgrades;
                  
                  return (
                    <div
                      key={upgrade.from}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30 hover:border-accent/50 transition-colors"
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <RuneIcon name={upgrade.from} size={28} />
                          <span className="font-medium text-foreground">{upgrade.from}</span>
                          <span className="text-xs text-muted-foreground">
                            ×{inventory[upgrade.from]}
                          </span>
                        </div>
                        
                        <ArrowRight weight="bold" className="text-muted-foreground" />
                        
                        <div className="flex items-center gap-2">
                          <RuneIcon name={upgrade.to} size={28} />
                          <span className="font-medium text-accent">{upgrade.to}</span>
                        </div>
                        
                        <div className="flex-1 text-xs text-muted-foreground">
                          {upgrade.gem} Gem
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          id={`upgrade-${upgrade.from}`}
                          type="number"
                          min="1"
                          max={maxAmount}
                          value={amount}
                          onChange={(e) => handleAmountChange(upgrade.from, e.target.value)}
                          className="w-16 h-8 text-center text-sm"
                        />
                        <span className="text-xs text-muted-foreground w-12">
                          / {maxAmount}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleUpgrade(upgrade)}
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
