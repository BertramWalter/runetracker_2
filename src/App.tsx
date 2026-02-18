import { useState, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { RUNES, RUNEWORDS } from '@/lib/data';
import { RuneInventory, RuneName } from '@/lib/types';
import { canCraftRuneword, getEmptyInventory } from '@/lib/runeword-utils';
import { RuneCard } from '@/components/RuneCard';
import { RunewordCard } from '@/components/RunewordCard';
import { RuneUpgradeCalculator } from '@/components/RuneUpgradeCalculator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

function App() {
  const [inventory, setInventory] = useKV<RuneInventory>('rune-inventory', getEmptyInventory());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'craftable' | 'weapon' | 'armor'>('all');
  const [minLevel, setMinLevel] = useState<string>('0');
  const [maxLevel, setMaxLevel] = useState<string>('99');
  const [itemTypeFilter, setItemTypeFilter] = useState<string>('all');

  const currentInventory = inventory || getEmptyInventory();

  const handleRuneChange = (runeName: RuneName, increment: boolean) => {
    setInventory((current) => {
      const currentInv = current || getEmptyInventory();
      return {
        ...currentInv,
        [runeName]: Math.max(0, (currentInv[runeName] || 0) + (increment ? 1 : -1))
      };
    });
  };

  const uniqueItemTypes = useMemo(() => {
    const types = new Set<string>();
    RUNEWORDS.forEach(rw => {
      rw.itemTypes.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, []);

  const filteredRunewords = useMemo(() => {
    let filtered = RUNEWORDS;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(rw => 
        rw.name.toLowerCase().includes(lowerSearch) ||
        rw.runes.some(r => r.toLowerCase().includes(lowerSearch))
      );
    }

    const min = parseInt(minLevel) || 0;
    const max = parseInt(maxLevel) || 99;
    filtered = filtered.filter(rw => rw.level >= min && rw.level <= max);

    if (itemTypeFilter !== 'all') {
      filtered = filtered.filter(rw => 
        rw.itemTypes.some(type => type === itemTypeFilter)
      );
    }

    if (filterType === 'craftable') {
      filtered = filtered.filter(rw => canCraftRuneword(rw, currentInventory));
    } else if (filterType === 'weapon') {
      filtered = filtered.filter(rw => 
        rw.itemTypes.some(type => 
          ['Weapon', 'Sword', 'Axe', 'Hammer', 'Mace', 'Polearm', 'Scepter', 'Melee Weapon', 'Missile Weapon', 'Claw', 'Staff', 'Wand'].some(w => type.includes(w))
        )
      );
    } else if (filterType === 'armor') {
      filtered = filtered.filter(rw => 
        rw.itemTypes.some(type => 
          ['Armor', 'Body Armor', 'Shield', 'Helm', 'Paladin Shield'].some(a => type.includes(a))
        )
      );
    }

    return filtered.sort((a, b) => {
      const aCraftable = canCraftRuneword(a, currentInventory);
      const bCraftable = canCraftRuneword(b, currentInventory);
      if (aCraftable && !bCraftable) return -1;
      if (!aCraftable && bCraftable) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [currentInventory, searchTerm, filterType, minLevel, maxLevel, itemTypeFilter]);

  const craftableCount = useMemo(() => 
    RUNEWORDS.filter(rw => canCraftRuneword(rw, currentInventory)).length,
    [currentInventory]
  );

  const clearInventory = () => {
    setInventory(getEmptyInventory());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`
        }}
      />
      
      <div className="relative">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <h1 className="text-4xl font-bold text-center tracking-tight mb-2 text-primary">
              Emil and Bertrams amazing Diablo II Runeword Tracker
            </h1>
            <p className="text-center text-muted-foreground">
              Track your runes • Find craftable runewords • Build your arsenal
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-8 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Rune Inventory</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearInventory}
                className="text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                Clear All
              </Button>
            </div>
            <ScrollArea className="w-full">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3 pb-2">
                {RUNES.map((rune) => (
                  <RuneCard
                    key={rune.name}
                    name={rune.name}
                    count={currentInventory[rune.name] || 0}
                    onIncrement={() => handleRuneChange(rune.name, true)}
                    onDecrement={() => handleRuneChange(rune.name, false)}
                  />
                ))}
              </div>
            </ScrollArea>
          </section>

          <section>
            <RuneUpgradeCalculator 
              inventory={currentInventory} 
              onUpgrade={(newInventory) => setInventory(() => newInventory)}
            />
          </section>

          <section>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search-runewords"
                    placeholder="Search runewords or runes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex gap-4 flex-1 flex-wrap">
                  <div className="flex-1 min-w-[140px]">
                    <Label htmlFor="min-level" className="text-sm font-medium mb-2 block">
                      Min Level
                    </Label>
                    <Input
                      id="min-level"
                      type="number"
                      min="0"
                      max="99"
                      value={minLevel}
                      onChange={(e) => setMinLevel(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <Label htmlFor="max-level" className="text-sm font-medium mb-2 block">
                      Max Level
                    </Label>
                    <Input
                      id="max-level"
                      type="number"
                      min="0"
                      max="99"
                      value={maxLevel}
                      onChange={(e) => setMaxLevel(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <Label htmlFor="item-type" className="text-sm font-medium mb-2 block">
                      Item Type
                    </Label>
                    <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                      <SelectTrigger id="item-type">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueItemTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setMinLevel('0');
                    setMaxLevel('99');
                    setItemTypeFilter('all');
                    setSearchTerm('');
                  }}
                  className="whitespace-nowrap"
                >
                  <Funnel className="mr-2" size={16} />
                  Clear Filters
                </Button>
              </div>
            </div>

            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All ({RUNEWORDS.length})</TabsTrigger>
                <TabsTrigger value="craftable">
                  Craftable ({craftableCount})
                </TabsTrigger>
                <TabsTrigger value="weapon">Weapons</TabsTrigger>
                <TabsTrigger value="armor">Armor</TabsTrigger>
              </TabsList>

              <TabsContent value={filterType} className="mt-0">
                {filteredRunewords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg mb-2">No runewords found</p>
                    <p className="text-sm">
                      {craftableCount === 0 && filterType === 'craftable' 
                        ? 'Add runes to your inventory to see craftable runewords'
                        : 'Try adjusting your search or filter'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRunewords.map((runeword) => (
                      <RunewordCard
                        key={runeword.name}
                        runeword={runeword}
                        isCraftable={canCraftRuneword(runeword, currentInventory)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </main>

        <footer className="border-t border-border/50 mt-12 py-6">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
            <p>Diablo II and all related content © Blizzard Entertainment</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;