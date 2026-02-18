# Planning Guide

A Diablo 2 rune tracking application that helps players manage their rune inventory and identify which runewords they can craft with their current stash.


1. **Efficient** - Players should quickly scan their inventory and identify craftable runewords without manual calculation
2. **Organized** - Runes and runewords should be systematically categorized and easy to navigate
3. **Informative** - Clear presentation of runeword recipes, stats, and requirements at a glance

**Complexity Level**: Light Application (multiple features with basic state)
  - The app manages rune inventory state and filters runewords based on availability, with straightforward CRUD operations and visual filtering

- Trigger: Automatic 

**Runeword Database Display**
- Functionality: Track quantity of each rune (El through Zod) in player's stash
- Purpose: Maintain accurate count of available crafting materials
- Trigger: Player clicks +/- buttons or directly inputs quantities
- Functionality: Visually distinguish runewords that can be crafted with current inventory
- Trigger: Automatic when rune quantities change

**Search and Filter**
- Purpose: Quickly find specific runewords in the extensive list
- Progression: Enter search term → Results filter in real-time


- **No Upgrades Available**: Display helpful message when player doesn't 

- **Missing Data**: Gracef
## Design Direction
The design should evoke the dark, medieval fantasy aesthetic of 
## Color Selection
A dark fantasy palette inspired by Diablo 2's atmosphere with glowing magical accents.
- **Primary Color**: Deep crimson red `oklch(0.35 0.15 25)` - commun

  - Background (Dark 
- Functionality: Filter runewords by name, rune composition, or item type
- Purpose: Quickly find specific runewords in the extensive list
- Trigger: Player types in search field or selects filter options
- Progression: Enter search term → Results filter in real-time → Clear to reset
- Success criteria: Filtering is instant and intuitive

## Edge Case Handling

- **Empty Inventory**: Show message encouraging player to add runes to see craftable runewords
- **All Craftable**: Celebrate with subtle visual indicator when player has materials for many runewords
- **Invalid Input**: Prevent negative numbers or non-numeric input in rune quantities
- **Missing Data**: Gracefully handle if runeword data structure is incomplete

## Design Direction

The design should evoke the dark, medieval fantasy aesthetic of Diablo 2 - gritty, powerful, and mysterious. Think ancient tomes, gothic architecture, and the contrast between darkness and magical energy.

## Color Selection

A dark fantasy palette inspired by Diablo 2's atmosphere with glowing magical accents.

- **Primary Color**: Deep crimson red `oklch(0.35 0.15 25)` - communicates danger, power, and the demonic theme
- **Secondary Colors**: Dark charcoal `oklch(0.15 0.01 270)` for backgrounds, stone gray `oklch(0.35 0.02 270)` for cards
- **Accent Color**: Glowing amber/gold `oklch(0.75 0.15 75)` - represents magical runes and craftable states, draws attention to actionable items
- **Foreground/Background Pairings**:
  - Background (Dark Charcoal `oklch(0.15 0.01 270)`): Light gray text `oklch(0.90 0.02 270)` - Ratio 11.2:1 ✓
  - Card (Stone Gray `oklch(0.35 0.02 270)`): White text `oklch(0.95 0.01 270)` - Ratio 6.8:1 ✓
  - Primary (Crimson `oklch(0.35 0.15 25)`): White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓
  - Accent (Amber `oklch(0.75 0.15 75)`): Dark text `oklch(0.20 0.02 270)` - Ratio 8.9:1 ✓

## Font Selection

Typography should feel medieval and game-like, evoking ancient manuscripts and runic inscriptions while maintaining readability for game data.

- **Typographic Hierarchy**:
  - H1 (App Title): Cinzel Bold/32px/tight letter-spacing - medieval, authoritative
















































