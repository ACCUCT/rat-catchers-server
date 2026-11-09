/* RAT CATCHERS - shared game data and formulas.
   Used by the server (require) and bundled into the client. The server is the authority:
   the client only uses these numbers to show the same values the server will apply. */
(function (root) {
'use strict';

// ---------- rarities (order matters: index = rank) ----------
const RARITIES = [
  { id: 'common', n: 'Common', col: '#c3cad6', base: 1, diff: 0.00, time: 1.6, xp: 5, size: 0.62, life: 150, pts: 1, glow: 0 },
  { id: 'uncommon', n: 'Uncommon', col: '#5fdc6a', base: 10, diff: 0.04, time: 2.0, xp: 12, size: 0.66, life: 140, pts: 3, glow: 0.3 },
  { id: 'rare', n: 'Rare', col: '#45b0ff', base: 100, diff: 0.08, time: 2.5, xp: 30, size: 0.70, life: 130, pts: 10, glow: 0.5 },
  { id: 'superrare', n: 'Super Rare', col: '#b876ff', base: 500, diff: 0.12, time: 3.0, xp: 80, size: 0.74, life: 120, pts: 30, glow: 0.7 },
  { id: 'legendary', n: 'Legendary', col: '#ffb22e', base: 2000, diff: 0.17, time: 3.6, xp: 200, size: 0.80, life: 110, pts: 100, glow: 0.9 },
  { id: 'mythical', n: 'Mythical', col: '#ff4f6e', base: 3000, diff: 0.22, time: 4.2, xp: 450, size: 0.86, life: 100, pts: 300, glow: 1.0 },
  { id: 'apocryphal', n: 'Apocryphal', col: '#fff3c4', base: 10000, diff: 0.28, time: 5.0, xp: 1000, size: 0.92, life: 90, pts: 1000, glow: 1.1 },
  { id: 'omega', n: 'Omega', col: '#9b5cff', base: 100000, diff: 0.34, time: 5.8, xp: 3000, size: 1.00, life: 80, pts: 5000, glow: 1.25 },
  { id: 'godlike', n: 'God-like', col: '#ffe066', base: 1000000, diff: 0.40, time: 6.6, xp: 10000, size: 1.12, life: 70, pts: 25000, glow: 1.5 },
  { id: 'secret', n: 'Secret', col: '#ff5cf0', base: 10000000, diff: 0.45, time: 7.5, xp: 25000, size: 1.20, life: 70, pts: 100000, glow: 1.6 }];
const RI = {}; RARITIES.forEach((r, i) => { r.i = i; RI[r.id] = r; });

// ---------- species ----------
// look: fur, belly, ear (inner), eye, tail colours; pat: pattern; parts: extra decorations; fields: native fields.
// earn: own base earnings (God-like and Secret rats each have their own value; the owner can change any of them).
const SPECIES = [
  { id: 'brown', n: 'Brown Rat', r: 'common', d: 'The classic. Loves crumbs, long naps and the smell of toast.', fur: '#8a5a3c', belly: '#d9b28c', fields: ['meadow', 'clover'] },
  { id: 'gray', n: 'Gray Rat', r: 'common', d: 'Blends in with every sidewalk in town. Very good at hide and seek.', fur: '#8e939c', belly: '#d6d9de', fields: ['meadow', 'clover', 'mushroom'] },
  { id: 'white', n: 'Snowy White Rat', r: 'common', d: 'Tidy, polite and suspiciously clean for a rat.', fur: '#f2f0ec', belly: '#ffffff', eye: '#d0304a', fields: ['meadow'] },
  { id: 'sewer', n: 'Sewer Rat', r: 'common', d: 'Smells a little funny, but has a heart of gold.', fur: '#5d5446', belly: '#9e9179', fields: ['meadow', 'clover', 'mushroom', 'crystal'] },
  { id: 'clover', n: 'Clover Rat', r: 'uncommon', d: 'Wears a lucky clover. Nobody knows where it found a four-leafed one.', fur: '#7ea65a', belly: '#d8eebc', parts: ['clover'], fields: ['clover', 'meadow'] },
  { id: 'spotted', n: 'Spotted Rat', r: 'uncommon', d: 'Its spots make a different picture every time you look.', fur: '#f4ede2', belly: '#ffffff', pat: 'spots', pc: '#7a4b2c', fields: ['meadow', 'clover', 'mushroom'] },
  { id: 'ginger', n: 'Ginger Rat', r: 'uncommon', d: 'Bright orange and very proud of it.', fur: '#e0813a', belly: '#ffd7a8', fields: ['clover', 'mushroom', 'crystal'] },
  { id: 'puff', n: 'Puffcheek Rat', r: 'uncommon', d: 'Stores snacks in its cheeks for later. Later never comes.', fur: '#c9a27a', belly: '#f6e2c6', parts: ['cheeks'], fields: ['clover', 'frozen'] },
  { id: 'mushroom', n: 'Mushroom Rat', r: 'rare', d: 'A mushroom grew on its head and it simply decided to keep it.', fur: '#9c7a5c', belly: '#e8d4bc', parts: ['shroom'], fields: ['mushroom', 'clover'] },
  { id: 'moss', n: 'Moss Rat', r: 'rare', d: 'Soft green moss fur. Smells like a forest after rain.', fur: '#5c8a3e', belly: '#b6d68f', pat: 'moss', pc: '#3e6a2a', fields: ['mushroom', 'frozen'] },
  { id: 'acorn', n: 'Acorn Rat', r: 'rare', d: 'Wears an acorn cap. Thinks it is a squirrel. Do not tell it.', fur: '#a8683a', belly: '#f0caa0', parts: ['acorn'], fields: ['mushroom', 'clover'] },
  { id: 'bandit', n: 'Bandit Rat', r: 'rare', d: 'The black mask is just its fur. It steals your snacks anyway.', fur: '#6f6f78', belly: '#cfcfd6', pat: 'mask', pc: '#1c1c22', fields: ['crystal', 'frozen', 'lava'] },
  { id: 'crystal', n: 'Crystal Rat', r: 'superrare', d: 'Crystals grow along its back and hum when it is happy.', fur: '#7d8fc9', belly: '#dfe6ff', parts: ['crystals'], fields: ['crystal'] },
  { id: 'glow', n: 'Glowworm Rat', r: 'superrare', d: 'Its tail tip glows so it never gets lost in the dark.', fur: '#3e4a6e', belly: '#9fb4e6', parts: ['glowtail'], fields: ['crystal', 'mushroom', 'reborn'] },
  { id: 'cave', n: 'Cave Rat', r: 'superrare', d: 'Huge ears, tiny eyes. Can hear a cookie crumble from a mile away.', fur: '#d8cfc4', belly: '#f6f0ea', ears: 1.5, fields: ['crystal', 'frozen'] },
  { id: 'frost', n: 'Frost Rat', r: 'legendary', d: 'Leaves tiny frozen footprints and wears a crown of ice.', fur: '#a9dcff', belly: '#eef9ff', parts: ['icecrown'], fields: ['frozen'] },
  { id: 'aurora', n: 'Aurora Rat', r: 'legendary', d: 'Its fur shimmers green and violet like the northern lights.', fur: '#5fd3b0', belly: '#d9c4ff', pat: 'aurora', pc: '#9a6cff', fields: ['frozen', 'heaven', 'reborn'] },
  { id: 'snowball', n: 'Snowball Rat', r: 'legendary', d: 'So fluffy it rolls downhill instead of walking.', fur: '#ffffff', belly: '#ffffff', parts: ['fluff'], fields: ['frozen'] },
  { id: 'ember', n: 'Ember Rat', r: 'mythical', d: 'The tip of its tail is a little flame that never goes out.', fur: '#c2412a', belly: '#ffb27a', parts: ['flametail'], fields: ['lava'] },
  { id: 'magma', n: 'Magma Rat', r: 'mythical', d: 'Cracked stone skin with lava glowing underneath. Warm to hug.', fur: '#3a2a26', belly: '#5a3a30', pat: 'cracks', pc: '#ff7a1a', fields: ['lava'] },
  { id: 'phoenix', n: 'Phoenix Rat', r: 'mythical', d: 'Rises from the ashes of burnt toast with wings of fire.', fur: '#ff8a2a', belly: '#ffd36a', parts: ['firewings'], fields: ['lava', 'heaven', 'reborn'] },
  { id: 'angel', n: 'Angel Rat', r: 'apocryphal', d: 'A halo, soft white wings and a very kind smile.', fur: '#fff9ef', belly: '#ffffff', parts: ['halo', 'wings'], fields: ['heaven'] },
  { id: 'cloudr', n: 'Cloud Rat', r: 'apocryphal', d: 'Made of the fluffiest cloud. Gently rains when sad.', fur: '#e9f3ff', belly: '#ffffff', parts: ['cloudpuff'], fields: ['heaven', 'omega'] },
  { id: 'oracle', n: 'Oracle Rat', r: 'apocryphal', d: 'Its third eye sees every rat that ever was and ever will be.', fur: '#6a4ab8', belly: '#c7b4ff', parts: ['thirdeye', 'robe'], fields: ['heaven', 'omega', 'secret', 'reborn'] },
  { id: 'void', n: 'Void Rat', r: 'omega', d: 'Where it walks, the world forgets to have colour.', fur: '#120c1f', belly: '#2a1a44', eye: '#c56bff', parts: ['voidfx'], fields: ['omega', 'secret'] },
  { id: 'glitch', n: 'Glitch Rat', r: 'omega', d: 'Sometimes it is in two places at once. Sometimes in none.', fur: '#26ffd2', belly: '#ff3fd2', pat: 'glitch', pc: '#ffffff', fields: ['omega', 'secret', 'reborn'] },
  { id: 'omegar', n: 'Omega Rat', r: 'omega', d: 'The last letter. The final rat. Wears the Omega mark with pride.', fur: '#2b2b3a', belly: '#565672', eye: '#ffd24a', parts: ['omegamark'], fields: ['omega', 'secret'] },
  { id: 'ratking', n: 'Rat King', r: 'godlike', earn: 5000000, d: 'Ruler of every rat kingdom. Wears the crown and the cape.', fur: '#7a4a2a', belly: '#e6c49a', parts: ['crown', 'cape'], fields: ['heaven', 'omega', 'secret'] },
  { id: 'celestial', n: 'Celestial Rat', r: 'godlike', earn: 2500000, d: 'Its fur is the night sky, freckled with real stars.', fur: '#1c2a6e', belly: '#3a4fa8', pat: 'stars', pc: '#ffffff', parts: ['starhalo'], fields: ['heaven', 'secret', 'reborn'] },
  { id: 'chrono', n: 'Chrono Rat', r: 'godlike', earn: 7500000, d: 'Carries gears of time. It was caught tomorrow.', fur: '#b08a4a', belly: '#f0dcae', parts: ['gears'], fields: ['omega', 'secret'] },
  { id: 'galaxy', n: 'Galaxy Rat', r: 'godlike', earn: 1000000, d: 'A whole spiral galaxy swirls in its fur.', fur: '#3a1a6e', belly: '#8a4ad8', pat: 'galaxy', pc: '#ff9af0', fields: ['omega', 'secret'] },
  { id: 'cheesegod', n: 'Cheese God', r: 'godlike', earn: 10000000, d: 'Every crumb of cheese in the universe is offered to it.', fur: '#ffcf3a', belly: '#fff0a8', parts: ['cheesecrown'], fields: ['secret'] },
  { id: 'shadow', n: 'Shadow Rat', r: 'secret', earn: 25000000, secret: 1, d: 'Nobody has ever seen it clearly. Only its rainbow eyes.', fur: '#050508', belly: '#111118', eye: 'rainbow', parts: ['shadowfx'], fields: [] },
  { id: 'ratticus', n: 'Golden Ratticus', r: 'secret', earn: 50000000, secret: 1, d: 'A legend in solid gold. Said to bring endless fortune.', fur: '#ffd23a', belly: '#fff2a0', parts: ['crown', 'goldfx'], fields: [] },
  { id: 'firstrat', n: 'The First Rat', r: 'secret', earn: 100000000, secret: 1, d: 'Every rat that ever lived is its great-great-grandchild.', fur: '#e8e4dc', belly: '#ffffff', eye: '#7af7ff', parts: ['ancient', 'halo'], fields: [] },
  // invasion rats: only appear during rat invasions
  { id: 'pirate', n: 'Pirate Rat', r: 'rare', earn: 150, inv: 1, d: 'Arrr. Steals cheese, never hearts. Came with the invasion fleet.', fur: '#6a4a3a', belly: '#d8b894', parts: ['pirate'], fields: [] },
  { id: 'ninja', n: 'Ninja Rat', r: 'superrare', earn: 750, inv: 1, d: 'You only see it when it wants you to.', fur: '#24242c', belly: '#3a3a44', parts: ['ninja'], fields: [] },
  { id: 'robo', n: 'Robo Rat', r: 'legendary', earn: 3000, inv: 1, d: 'Beep boop. Runs on cheese-powered batteries.', fur: '#b8c4d0', belly: '#e8eef4', eye: '#3affff', parts: ['robo'], fields: [] },
  { id: 'alien', n: 'Alien Rat', r: 'mythical', earn: 4500, inv: 1, d: 'Came from a planet made entirely of cheese. Wants to go home.', fur: '#7aff6a', belly: '#d8ffd0', eye: '#111111', parts: ['antennae'], fields: [] },
  { id: 'invader', n: 'Invader King', r: 'apocryphal', earn: 15000, inv: 1, d: 'Leader of the invasion. Its ray gun shoots confetti.', fur: '#5a2a8a', belly: '#c08aff', parts: ['crown', 'antennae'], fields: [] }];
const SP = {}; SPECIES.forEach((s, i) => { s.i = i; SP[s.id] = s; });

// ---------- fields ----------
// w: spawn weight per rarity index (common .. secret).
const FIELDS = [
  { id: 'meadow', n: 'Starter Meadow', lvl: 1, w: [49.81989, 35, 11, 3, 0.8, 0.3, 0.08, 0.0001, 0.00001, 0], song: 'meadow', d: 'Sunny hills, wildflowers and lots of friendly rats.' },
  { id: 'clover', n: 'Clover Fields', lvl: 5, w: [30, 32.79967, 30, 5, 1.5, 0.6, 0.1, 0.0003, 0.00003, 0], song: 'clover', d: 'Rolling clover, windmills and lucky breezes.' },
  { id: 'mushroom', n: 'Mushroom Forest', lvl: 10, w: [25, 25, 36.44945, 10, 2.5, 0.8, 0.25, 0.0005, 0.00005, 0], song: 'mushroom', d: 'Giant glowing mushrooms under a dark green canopy.' },
  { id: 'crystal', n: 'Crystal Caves', lvl: 20, w: [20.89925, 25, 30, 20, 3, 0.8, 0.3, 0.0007, 0.00005, 0], song: 'crystal', d: 'A huge cavern full of humming crystals.' },
  { id: 'frozen', n: 'Frozen Valley', lvl: 30, w: [14.89914, 25, 30, 25, 4, 0.75, 0.35, 0.0008, 0.00006, 0], song: 'frozen', d: 'Snowy pines, a frozen lake and the northern lights.' },
  { id: 'lava', n: 'Lava Lands', lvl: 40, w: [12.49892, 25, 30, 25, 6, 1, 0.5, 0.001, 0.00008, 0], song: 'lava', d: 'Black rock, rivers of lava and a smoking volcano.' },
  { id: 'heaven', n: "Heaven's Garden", lvl: 55, w: [5, 10, 40, 34.2969, 8, 2, 0.7, 0.003, 0.0001, 0], song: 'heaven', d: 'Gardens on the clouds behind the golden gates.' },
  { id: 'omega', n: 'Omega Dimension', lvl: 75, w: [0, 5, 30, 51.1949, 10, 3, 0.8, 0.005, 0.0001, 0], song: 'omega', d: 'Floating shapes in a void that hums with power.' },
  { id: 'secret', n: 'Secret Realm', lvl: 100, w: [0, 0, 28.9925, 50, 15, 5, 1, 0.007, 0.0005, 0], song: 'secret', d: 'Ancient ruins under a rainbow sky. Few have seen it.' },
  // a special area that only reborn players can enter (rebirth unlocks it at any level)
  { id: 'reborn', n: 'Reborn Sanctuary', lvl: 1, reb: 1, w: [72.7913, 0, 0, 5, 15, 6, 1.2, 0.008, 0.0007, 0], song: 'reborn', d: 'A hidden garden of pink crystals. Only reborn catchers may enter.' }];
const FI = {}; FIELDS.forEach((f, i) => { f.i = i; FI[f.id] = f; });

// ---------- mutations ----------
// mat: one material mutation per rat (gold, diamond or rainbow); wx: one weather mutation; disco: a disco ball on the head.
const MUTATIONS = {
  gold: { n: 'Gold', kind: 'mat', col: '#ffcf3a', mult: 3, pts: 10 },
  diamond: { n: 'Diamond', kind: 'mat', col: '#9fe8ff', mult: 6, pts: 25 },
  rainbow: { n: 'Rainbow', kind: 'mat', col: '#ff7ad9', mult: 10, pts: 60 },
  rain: { n: 'Rain', kind: 'wx', col: '#6fb4ff', mult: 2, pts: 5 },
  snow: { n: 'Snow', kind: 'wx', col: '#e8f6ff', mult: 2, pts: 5 },
  thunder: { n: 'Thunder', kind: 'wx', col: '#ffe14a', mult: 2.5, pts: 8 },
  disco: { n: 'Disco', kind: 'disco', col: '#d6a8ff', mult: 2, pts: 8 } };

// ---------- global events ----------
const EVENTS = {
  rain: { n: 'Rain', d: '30% chance for the Rain mutation.', col: '#6fb4ff', dur: 600, eff: { rain: 0.30 }, sky: 'rain' },
  snow: { n: 'Snow', d: '30% chance for the Snow mutation.', col: '#e8f6ff', dur: 600, eff: { snow: 0.30 }, sky: 'snow' },
  thunder: { n: 'Thunderstorm', d: '30% chance for the Thunder mutation.', col: '#ffe14a', dur: 600, eff: { thunder: 0.30 }, sky: 'storm' },
  dj: { n: 'DJ Event', d: '35% chance of a disco ball on a rat’s head.', col: '#d6a8ff', dur: 600, eff: { disco: 0.35 }, sky: 'disco' },
  heaven: { n: "Heaven's Event", d: 'Rare, high-rarity rats appear far more often.', col: '#fff3c4', dur: 600, eff: { heaven: 1 }, sky: 'heaven' },
  goldmoon: { n: 'Gold Moon', d: '80% chance for the Gold mutation.', col: '#ffcf3a', dur: 480, eff: { gold: 0.80 }, sky: 'goldmoon' },
  diamond: { n: 'Diamond Event', d: '50% chance for the Diamond mutation.', col: '#9fe8ff', dur: 480, eff: { diamond: 0.50 }, sky: 'diamond' },
  rainbow: { n: 'Rainbow Event', d: '30% chance for the Rainbow mutation.', col: '#ff7ad9', dur: 480, eff: { rainbow: 0.30 }, sky: 'rainbow' },
  ultra: { n: 'ULTRA EVENT', d: 'Every event at once!', col: '#ff5cf0', dur: 300, eff: { rain: 0.30, snow: 0.30, thunder: 0.30, disco: 0.35, heaven: 1, gold: 0.80, diamond: 0.50, rainbow: 0.30, secret: 1 }, sky: 'ultra' } };

// ---------- rods ----------
const RODS = [
  { id: 'wood', n: 'Wooden Rod', price: 0, luck: 1.0, speed: 1.0, success: 0.75, range: 12, col: '#a8743e' },
  { id: 'copper', n: 'Copper Rod', price: 500, luck: 1.1, speed: 1.1, success: 0.80, range: 13, col: '#d07a45' },
  { id: 'silver', n: 'Silver Rod', price: 10000, luck: 1.25, speed: 1.2, success: 0.84, range: 14, col: '#cfd8e2' },
  { id: 'golden', n: 'Golden Rod', price: 250000, luck: 1.45, speed: 1.35, success: 0.88, range: 15, col: '#ffcf3a' },
  { id: 'diamond', n: 'Diamond Rod', price: 5000000, luck: 1.7, speed: 1.5, success: 0.91, range: 16, col: '#9fe8ff' },
  { id: 'rainbow', n: 'Rainbow Rod', price: 100000000, luck: 2.0, speed: 1.7, success: 0.94, range: 17, col: '#ff7ad9' },
  { id: 'heaven', n: 'Heaven Rod', price: 2500000000, luck: 2.4, speed: 1.9, success: 0.96, range: 18, col: '#fff3c4' },
  { id: 'omega', n: 'Omega Rod', price: 100000000000, luck: 3.0, speed: 2.2, success: 0.98, range: 20, col: '#9b5cff' }];
const ROD = {}; RODS.forEach((r, i) => { r.i = i; ROD[r.id] = r; });

// ---------- potions ----------
// cat: potions in one category never stack. A stronger one replaces a weaker one; the same one extends the time (up to 3x).
const POTIONS = [
  { id: 'luck', n: 'Luck Potion', cat: 'luck', mult: 1.5, dur: 600, price: 2000, col: '#5fdc6a', d: '1.5x luck for 10 minutes.' },
  { id: 'superluck', n: 'Super Luck', cat: 'luck', mult: 2, dur: 600, price: 25000, col: '#2fd8a0', d: '2x luck for 10 minutes.' },
  { id: 'ultraluck', n: 'Ultra Luck', cat: 'luck', mult: 3, dur: 600, price: 500000, col: '#00ffc8', d: '3x luck for 10 minutes.' },
  { id: 'money', n: 'Money Potion', cat: 'money', mult: 2, dur: 900, price: 10000, col: '#ffd23a', d: '2x earnings for 15 minutes.' },
  { id: 'supermoney', n: 'Super Money', cat: 'money', mult: 3, dur: 900, price: 250000, col: '#ff9f1a', d: '3x earnings for 15 minutes.' },
  { id: 'speed', n: 'Speed Potion', cat: 'speed', mult: 1.5, dur: 600, price: 1000, col: '#45b0ff', d: 'Run 1.5x faster for 10 minutes.' },
  { id: 'catch', n: 'Catching Potion', cat: 'catch', mult: 1.6, dur: 600, price: 5000, col: '#ff7a3a', d: 'Catch 1.6x faster with +5% success for 10 minutes.' },
  { id: 'mutation', n: 'Mutation Potion', cat: 'mutation', mult: 3, dur: 600, price: 50000, col: '#ff5cf0', d: '3x natural mutation chances for 10 minutes.' }];
const POT = {}; POTIONS.forEach(p => { POT[p.id] = p; });

// ---------- eggs ----------
// The names come from the game plan. Prices are in in-game money; the owner can change prices and odds.
const EGGS = [
  { id: 'egg2', n: '$2 Egg', price: 2500, col: '#8fd8ff', odds: { common: 60, uncommon: 25, rare: 10, superrare: 3.5, legendary: 1.1, mythical: 0.35, apocryphal: 0.05 } },
  { id: 'egg5', n: '$5 Egg', price: 250000, col: '#b876ff', odds: { common: 40, uncommon: 30, rare: 15, superrare: 8, legendary: 4, mythical: 2, apocryphal: 0.9, omega: 0.1 } },
  { id: 'eggltd', n: 'Limited-Time Egg', price: 50000000, col: '#ff5c8a', limited: 1, odds: { mythical: 60, apocryphal: 30, omega: 7.5, godlike: 2.5 } },
  { id: 'egg25', n: '$25 Egg', price: 2500000000, col: '#ffe066', odds: { common: 5, rare: 5, apocryphal: 20, omega: 40, godlike: 20, secret: 10 } }];
const EGG = {}; EGGS.forEach(e => { EGG[e.id] = e; });

// mystery box: can hold better rods
const MYSTERY = { id: 'mystery', n: 'Mystery Box', price: 50000, d: 'Money, potions, cosmetics, and a chance at a better rod.',
  table: [['money', 46], ['potion', 38], ['cosmetic', 9], ['rod', 7]] };

// ---------- rat cosmetics ----------
// slot: where it sits on the rat. cat: the shop category. src: how to get it (shop, achievement, daily, event, promo, rebirth).
const COSMETICS = [
  { id: 'partyhat', n: 'Party Hat', slot: 'head', cat: 'Hats', price: 5000, src: 'shop', col: '#ff5c8a' },
  { id: 'beanie', n: 'Cozy Beanie', slot: 'head', cat: 'Hats', price: 8000, src: 'shop', col: '#45b0ff' },
  { id: 'cowboy', n: 'Cowboy Hat', slot: 'head', cat: 'Hats', price: 20000, src: 'shop', col: '#a8743e' },
  { id: 'tophat', n: 'Top Hat', slot: 'head', cat: 'Hats', price: 100000, src: 'shop', col: '#222230' },
  { id: 'chefhat', n: 'Chef Hat', slot: 'head', cat: 'Hats', src: 'daily', col: '#ffffff' },
  { id: 'piratehat', n: 'Pirate Hat', slot: 'head', cat: 'Hats', src: 'event', tokens: 30, col: '#1c1c22' },
  { id: 'catchercap', n: 'Catcher Cap', slot: 'head', cat: 'Hats', src: 'achievement', col: '#ff7a3a' },
  { id: 'tinycrown', n: 'Tiny Crown', slot: 'head', cat: 'Crowns', price: 1000000, src: 'shop', col: '#ffcf3a' },
  { id: 'weeklycrown', n: 'Weekly Crown', slot: 'head', cat: 'Crowns', src: 'daily', col: '#ffd98a' },
  { id: 'divinecrown', n: 'Divine Crown', slot: 'head', cat: 'Crowns', src: 'achievement', col: '#fff3c4' },
  { id: 'laurel', n: 'Laurel Crown', slot: 'head', cat: 'Crowns', src: 'achievement', col: '#7ad35a' },
  { id: 'rebirthcrown', n: 'Reborn Crown', slot: 'head', cat: 'Crowns', src: 'rebirth', col: '#ff9af0' },
  { id: 'shades', n: 'Cool Shades', slot: 'face', cat: 'Sunglasses', price: 15000, src: 'shop', col: '#111118' },
  { id: 'starglasses', n: 'Star Glasses', slot: 'face', cat: 'Sunglasses', price: 75000, src: 'shop', col: '#ffcf3a' },
  { id: 'heartglasses', n: 'Heart Glasses', slot: 'face', cat: 'Sunglasses', src: 'daily', col: '#ff5c8a' },
  { id: 'glasses3d', n: '3D Glasses', slot: 'face', cat: 'Sunglasses', src: 'event', tokens: 20, col: '#ff3a3a' },
  { id: 'discoshades', n: 'Disco Shades', slot: 'face', cat: 'Disco', src: 'event', tokens: 25, col: '#d6a8ff' },
  { id: 'bowtie', n: 'Bow Tie', slot: 'neck', cat: 'Chains', price: 10000, src: 'shop', col: '#e3262f' },
  { id: 'silverchain', n: 'Silver Chain', slot: 'neck', cat: 'Chains', price: 50000, src: 'shop', col: '#dfe6ee' },
  { id: 'goldchain', n: 'Gold Chain', slot: 'neck', cat: 'Chains', src: 'achievement', col: '#ffcf3a' },
  { id: 'diamondchain', n: 'Diamond Chain', slot: 'neck', cat: 'Chains', price: 10000000, src: 'shop', col: '#9fe8ff' },
  { id: 'discopendant', n: 'Disco Ball Pendant', slot: 'neck', cat: 'Disco', src: 'event', tokens: 35, col: '#e8e8ff' },
  { id: 'backpack', n: 'Tiny Backpack', slot: 'back', cat: 'Back', price: 30000, src: 'shop', col: '#ff9f1a' },
  { id: 'cape', n: 'Hero Cape', slot: 'back', cat: 'Back', price: 500000, src: 'shop', col: '#e3262f' },
  { id: 'jetpack', n: 'Jetpack', slot: 'back', cat: 'Back', price: 5000000, src: 'shop', col: '#9aa4b0' },
  { id: 'fairywings', n: 'Fairy Wings', slot: 'back', cat: 'Wings', price: 2000000, src: 'shop', col: '#9af0ff' },
  { id: 'angelwings', n: 'Angel Wings', slot: 'back', cat: 'Wings', price: 50000000, src: 'shop', col: '#ffffff' },
  { id: 'batwings', n: 'Bat Wings', slot: 'back', cat: 'Wings', src: 'event', tokens: 40, col: '#3a2a4a' },
  { id: 'voidwings', n: 'Void Wings', slot: 'back', cat: 'Wings', src: 'achievement', col: '#9b5cff' },
  { id: 'sparkletrail', n: 'Sparkle Trail', slot: 'trail', cat: 'Trails', price: 100000, src: 'shop', col: '#fff3a8' },
  { id: 'firetrail', n: 'Fire Trail', slot: 'trail', cat: 'Trails', price: 3000000, src: 'shop', col: '#ff7a1a' },
  { id: 'bubbletrail', n: 'Bubble Trail', slot: 'trail', cat: 'Trails', src: 'daily', col: '#9fe8ff' },
  { id: 'rainbowtrail', n: 'Rainbow Trail', slot: 'trail', cat: 'Trails', src: 'achievement', col: '#ff7ad9' },
  { id: 'hearts', n: 'Floating Hearts', slot: 'fx', cat: 'Particles', price: 40000, src: 'shop', col: '#ff5c8a' },
  { id: 'stars', n: 'Twinkle Stars', slot: 'fx', cat: 'Particles', price: 200000, src: 'shop', col: '#ffe066' },
  { id: 'notes', n: 'Music Notes', slot: 'fx', cat: 'Disco', src: 'event', tokens: 25, col: '#d6a8ff' },
  { id: 'snowflakes', n: 'Snowflakes', slot: 'fx', cat: 'Particles', src: 'event', tokens: 20, col: '#e8f6ff' },
  { id: 'discolights', n: 'Disco Lights', slot: 'fx', cat: 'Disco', src: 'promo', price: 750000, col: '#ff5cf0' },
  { id: 'flameaura', n: 'Flame Aura', slot: 'aura', cat: 'Auras', src: 'achievement', col: '#ff7a1a' },
  { id: 'shadowaura', n: 'Shadow Aura', slot: 'aura', cat: 'Auras', src: 'achievement', col: '#5a2a8a' },
  { id: 'frostaura', n: 'Frost Aura', slot: 'aura', cat: 'Auras', price: 20000000, src: 'shop', col: '#9fe8ff' },
  { id: 'goldaura', n: 'Golden Aura', slot: 'aura', cat: 'Auras', price: 100000000, src: 'shop', col: '#ffcf3a' },
  { id: 'rebirthaura', n: 'Reborn Aura', slot: 'aura', cat: 'Auras', src: 'rebirth', col: '#ff9af0' }];
const COS = {}; COSMETICS.forEach(c => { COS[c.id] = c; });
const COS_SLOTS = ['head', 'face', 'neck', 'back', 'trail', 'fx', 'aura'];
const COS_CATS = ['Hats', 'Sunglasses', 'Crowns', 'Chains', 'Wings', 'Back', 'Trails', 'Particles', 'Auras', 'Disco'];

// ---------- achievements ----------
// stat: what is counted; goal: target. rw: rewards (money, title, potion, cosmetic, egg).
const ACHIEVEMENTS = [
  { id: 'first', n: 'First Rat Caught', d: 'Catch your very first rat.', stat: 'caught', goal: 1, rw: { money: 100, title: 'Rookie Catcher' } },
  { id: 'c100', n: 'Catch 100 Rats', d: 'Catch 100 rats.', stat: 'caught', goal: 100, rw: { money: 10000, potion: 'luck' } },
  { id: 'c1000', n: 'Catch 1,000 Rats', d: 'Catch 1,000 rats.', stat: 'caught', goal: 1000, rw: { money: 1000000, title: 'Rat Wrangler', cos: 'catchercap' } },
  { id: 'c10000', n: 'Catch 10,000 Rats', d: 'Catch 10,000 rats.', stat: 'caught', goal: 10000, rw: { money: 100000000, title: 'Rat Legend', potion: 'ultraluck' } },
  { id: 'firstmut', n: 'Something Shiny', d: 'Catch a rat with any mutation.', stat: 'mutCaught', goal: 1, rw: { money: 2500, potion: 'mutation' } },
  { id: 'firstleg', n: 'First Legendary', d: 'Catch a Legendary rat.', stat: 'r_legendary', goal: 1, rw: { money: 25000, potion: 'superluck', title: 'Legend Finder' } },
  { id: 'firstmyth', n: 'First Mythical', d: 'Catch a Mythical rat.', stat: 'r_mythical', goal: 1, rw: { money: 50000, cos: 'flameaura' } },
  { id: 'firstapoc', n: 'First Apocryphal', d: 'Catch an Apocryphal rat.', stat: 'r_apocryphal', goal: 1, rw: { money: 250000, potion: 'supermoney' } },
  { id: 'firstomega', n: 'First Omega', d: 'Catch an Omega rat.', stat: 'r_omega', goal: 1, rw: { money: 1000000, potion: 'ultraluck', title: 'Omega Hunter', cos: 'voidwings' } },
  { id: 'firstgod', n: 'First God-like', d: 'Catch a God-like rat.', stat: 'r_godlike', goal: 1, rw: { money: 10000000, title: 'Godcatcher', cos: 'divinecrown' } },
  { id: 'firstsecret', n: 'First Secret', d: 'Find a Secret rat.', stat: 'r_secret', goal: 1, rw: { money: 50000000, title: 'Keeper of Secrets', cos: 'shadowaura' } },
  { id: 'index', n: 'Discover Every Rat', d: 'Fill every page of the Rat Index.', stat: 'indexN', goal: SPECIES.length, rw: { money: 500000000, title: 'Ratologist', cos: 'rainbowtrail' } },
  { id: 'fields', n: 'Complete Every Field', d: 'Catch every native rat of all nine fields.', stat: 'fieldsDone', goal: FIELDS.length, rw: { money: 250000000, title: 'Explorer Supreme', potion: 'superluck' } },
  { id: 't1', n: 'First Trade', d: 'Complete a trade with another player.', stat: 'trades', goal: 1, rw: { money: 5000 } },
  { id: 't100', n: 'Complete 100 Trades', d: 'Complete 100 trades.', stat: 'trades', goal: 100, rw: { money: 5000000, title: 'Master Trader', cos: 'goldchain' } },
  { id: 'l10', n: 'Level 10', d: 'Reach player level 10.', stat: 'level', goal: 10, rw: { money: 5000, potion: 'money' } },
  { id: 'l50', n: 'Level 50', d: 'Reach player level 50.', stat: 'level', goal: 50, rw: { money: 5000000, title: 'Veteran' } },
  { id: 'l100', n: 'Reach Level 100', d: 'Reach player level 100.', stat: 'level', goal: 100, rw: { money: 1000000000, title: 'Centurion', cos: 'laurel' } },
  { id: 'chests', n: 'Treasure Hunter', d: 'Open 25 treasure chests.', stat: 'chests', goal: 25, rw: { money: 100000, potion: 'luck' } },
  { id: 'rebirth1', n: 'Born Again', d: 'Rebirth for the first time.', stat: 'rebirths', goal: 1, rw: { title: 'Reborn', cos: 'rebirthcrown' } },
  { id: 'rebirth5', n: 'Phoenix Catcher', d: 'Rebirth 5 times.', stat: 'rebirths', goal: 5, rw: { title: 'Phoenix', cos: 'rebirthaura' } },
  { id: 'evolve', n: 'Evolution!', d: 'Evolve a rat.', stat: 'evolved', goal: 1, rw: { money: 20000 } },
  { id: 'rich', n: 'Millionaire', d: 'Have $1,000,000 at once.', stat: 'peakMoney', goal: 1e6, rw: { title: 'Millionaire' } },
  { id: 'billion', n: 'Billionaire', d: 'Have $1,000,000,000 at once.', stat: 'peakMoney', goal: 1e9, rw: { title: 'Billionaire', potion: 'supermoney' } }];
const ACH = {}; ACHIEVEMENTS.forEach(a => { ACH[a.id] = a; });

// ---------- daily rewards (7-day cycle, the 7th is special) ----------
const DAILY = [
  { money: 1 }, { potion: 'luck' }, { potion: 'catch', money: 1 }, { potion: 'money', money: 1 }, { mystery: 1, rod: 'next' }, { cos: 'chefhat', potion: 'catch' },
  { special: 1, money: 5, potion: 'superluck', cos: 'weeklycrown' }];
const DAILY_COS_ROTATION = ['chefhat', 'heartglasses', 'bubbletrail']; // day 6 cycles through these

// ---------- daily quests ----------
const QUESTS = [
  { id: 'catch', d: 'Catch {n} rats', stat: 'caught', n: [10, 20, 35] },
  { id: 'catchrare', d: 'Catch {n} Rare or better rats', stat: 'caughtRare', n: [3, 6, 10] },
  { id: 'sell', d: 'Sell {n} rats', stat: 'sold', n: [5, 10, 20] },
  { id: 'fields', d: 'Visit {n} different fields', stat: 'fieldsToday', n: [2, 3, 4] },
  { id: 'mutated', d: 'Catch a mutated rat', stat: 'mutCaught', n: [1, 1, 2] },
  { id: 'earn', d: 'Earn {money}', stat: 'earned', n: [1, 3, 6], money: 1 },
  { id: 'chest', d: 'Open {n} treasure chests', stat: 'chests', n: [1, 2, 3] },
  { id: 'trade', d: 'Complete a trade', stat: 'trades', n: [1, 1, 2] },
  { id: 'levelup', d: 'Level up rats {n} times', stat: 'ratLevels', n: [3, 6, 10] }];

// ---------- lobby ----------
// Stations stand on a ring around the plaza (angle in degrees: 0 is north, toward the field portals).
const STATIONS = [
  { id: 'shop', n: 'Item Shop', a: 76, r: 24, key: 'Shop' },
  { id: 'bank', n: 'Rat Bank', a: 114, r: 24, key: 'Money slots' },
  { id: 'inventory', n: 'Rat Inventory', a: 133, r: 24, key: 'Inventory' },
  { id: 'daily', n: 'Daily Rewards', a: 152, r: 25, key: 'Daily rewards' },
  { id: 'achievements', n: 'Achievement Hall', a: 168, r: 26, key: 'Achievements' },
  { id: 'showcase', n: 'Showcase Hall', a: 184, r: 31, key: 'Showcases' },
  { id: 'index', n: 'Rat Index', a: 200, r: 26, key: 'Rat Index' },
  { id: 'leaderboard', n: 'Leaderboards', a: 216, r: 25, key: 'Leaderboards' },
  { id: 'events', n: 'Event Board', a: 235, r: 24, key: 'Events' },
  { id: 'computer', n: 'Room Computer', a: 254, r: 24, key: 'Rooms' },
  { id: 'storage', n: 'Rat Storage', a: 273, r: 24, key: 'Storage' },
  { id: 'trading', n: 'Trading Area', a: 292, r: 22, key: 'Trading' },
  { id: 'rebirth', n: 'Rebirth Altar', a: 184, r: 43, key: 'Rebirth' }];
const ST = {}; STATIONS.forEach(s => { const a = s.a * Math.PI / 180; s.x = Math.sin(a) * s.r; s.z = Math.cos(a) * s.r; s.h = Math.atan2(-s.x, -s.z); ST[s.id] = s; });
const PORTALS = FIELDS.map((f, i) => { if (f.reb) return { f: f.id, x: 0, z: 41.5, h: Math.PI, reb: f.reb }; const a = (-64 + i * 16) * Math.PI / 180; return { f: f.id, x: Math.sin(a) * 33, z: Math.cos(a) * 33, h: Math.atan2(-Math.sin(a), -Math.cos(a)) }; });
// can this player enter a field? (level and rebirth requirements)
function canEnter(f, level, rebirths) { return !!f && level >= f.lvl && (rebirths || 0) >= (f.reb || 0); }
function lockText(f) { return f.reb ? 'Rebirth to enter ' + f.n + '.' : 'Reach level ' + f.lvl + ' to enter ' + f.n + '.'; }
const LOBBY = { R: 47, spawn: [0, 12], showcaseStands: 20 };
function showcaseStand(i) { // stands for players' showcases in the Showcase Hall (south)
  const row = i < 10 ? 0 : 1, k = i % 10, a = (155 + k * 6.6) * Math.PI / 180, r = row ? 39 : 34;
  return { x: Math.sin(a) * r, z: Math.cos(a) * r, h: Math.atan2(-Math.sin(a), -Math.cos(a)) };
}

// ---------- field layouts (shared so the server keeps rats and chests out of rocks and trees) ----------
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const FIELD_R = 78; // fields are squares from -78 to 78 m
const layoutCache = {};
function fieldLayout(fid) {
  if (layoutCache[fid]) return layoutCache[fid];
  const f = FI[fid]; const rnd = mulberry(9173 + f.i * 7919);
  const obs = [], spawn = [0, -62], portal = [0, -70];
  const kinds = { meadow: ['tree', 'rock'], clover: ['tree', 'windmill', 'rock'], mushroom: ['bigshroom', 'tree', 'rock'], crystal: ['crystal', 'pillar', 'rock'], frozen: ['pine', 'iceberg', 'rock'],
    lava: ['volcanic', 'rock', 'vent'], heaven: ['pillar', 'cloudtree', 'fountain'], omega: ['monolith', 'shard', 'floater'], secret: ['ruin', 'monolith', 'tree'], reborn: ['crystal', 'tree', 'fountain', 'ruin'] }[fid];
  const count = { meadow: 34, clover: 30, mushroom: 46, crystal: 40, frozen: 40, lava: 34, heaven: 30, omega: 32, secret: 36, reborn: 32 }[fid];
  let tries = 0;
  while (obs.length < count && tries++ < 4000) {
    const x = (rnd() * 2 - 1) * (FIELD_R - 6), z = (rnd() * 2 - 1) * (FIELD_R - 6);
    const kind = kinds[(rnd() * kinds.length) | 0];
    const r = kind === 'windmill' ? 3.2 : kind === 'bigshroom' ? 2.2 + rnd() * 1.6 : kind === 'rock' ? 1.2 + rnd() * 2 : kind === 'iceberg' ? 2 + rnd() * 2 : kind === 'volcanic' ? 2.5 + rnd() * 2.5 : kind === 'monolith' ? 1.2 + rnd() * 0.8 : kind === 'fountain' ? 3 : 1.0 + rnd() * 0.8;
    if (Math.hypot(x - spawn[0], z - spawn[1]) < 14) continue;
    if (Math.hypot(x, z) < 8) continue; // keep the centre open
    if (obs.some(o => Math.hypot(o.x - x, o.z - z) < o.r + r + 4)) continue;
    obs.push({ x, z, r, kind, s: rnd() * 1000 | 0 });
  }
  return (layoutCache[fid] = { fid, R: FIELD_R, spawn, portal, obs });
}
function blocked(L, x, z, pad) {
  if (Math.abs(x) > L.R - 3 || Math.abs(z) > L.R - 3) return true;
  for (const o of L.obs) if (Math.hypot(o.x - x, o.z - z) < o.r + (pad || 0.8)) return true;
  return false;
}

// ---------- default configuration (the owner can change all of it from the admin app) ----------
const DEFAULT_CONFIG = {
  rarityEarn: Object.fromEntries(RARITIES.map(r => [r.id, r.base])),
  speciesEarn: Object.fromEntries(SPECIES.filter(s => s.earn).map(s => [s.id, s.earn])),
  mutMult: Object.fromEntries(Object.entries(MUTATIONS).map(([k, m]) => [k, m.mult])),
  natural: { gold: 0.01, diamond: 0.003, rainbow: 0.001 },
  levelMult: 0.1,        // each rat level adds 10% earnings
  evoMult: 2,            // each evolution stage doubles earnings
  rebirthLuck: 0.10,     // +10% luck for every rebirth
  rebirthEarn: 0.05,     // +5% earnings for every rebirth
  globalLuck: 1, globalEarn: 1,
  heavenBoost: 3,        // Heaven's Event: high-rarity spawn weights x3 (Legendary and up)
  rarityBoost: Object.fromEntries(RARITIES.map(r => [r.id, 1])), // owner's extra spawn multipliers per rarity
  fieldWeights: Object.fromEntries(FIELDS.map(f => [f.id, f.w.slice()])),
  offlineRate: 0.10, offlineMaxHours: 24,
  ratMaxLevel: 50, ratCapStep: 10, ratCapMax: 100,
  sellSeconds: 30,       // a rat sells for 30 seconds of its earnings
  startSlots: 3, maxSlots: 12, slotPrices: [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000],
  startStorage: 5, storageStep: 5, maxStorage: 100,
  startInventory: 30, inventoryStep: 10, maxInventory: 300,
  startEquip: 1, maxEquip: 3, equipPrices: [50000, 5000000],
  potionMax: 3,          // a potion can be extended up to 3x its time
  eggs: Object.fromEntries(EGGS.map(e => [e.id, { price: e.price, odds: Object.assign({}, e.odds) }])),
  rods: Object.fromEntries(RODS.map(r => [r.id, { price: r.price, luck: r.luck, speed: r.speed, success: r.success }])),
  potions: Object.fromEntries(POTIONS.map(p => [p.id, { price: p.price, mult: p.mult, dur: p.dur }])),
  cosPrices: Object.fromEntries(COSMETICS.filter(c => c.price).map(c => [c.id, c.price])),
  mysteryPrice: MYSTERY.price,
  ltdEgg: { on: true, ends: 0 }, // 0 = no end date
  promo: { on: true, items: ['discolights'], ends: 0 },
  autoEvents: true, eventEvery: [1200, 2400], // seconds between automatic events
  eventDur: {},          // the owner's own event lengths in seconds, e.g. { rain: 900 }
  autoInvasions: true, invasionEvery: [2700, 5400], invasionDur: 240,
  rebirthLevel: 50, rebirthStep: 10, rebirthResetsMoney: true,
  maxRatsPerField: 18, spawnEvery: 2.5,
  chestEvery: [120, 240], maxChests: 2,
  catchBonus: 0 };

// ---------- formulas ----------
const fmtN = n => Math.floor(n).toLocaleString('en-US');
const SUFFIX = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
// "a Brown Rat", "an Omega rat", "The First Rat"
function aName(n) { n = String(n); return /^the\s/i.test(n) ? n : (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n; }
function fmtMoney(n, exact) {
  if (!isFinite(n)) return '$∞';
  const neg = n < 0; n = Math.abs(n);
  if (exact || n < 1000) return (neg ? '-$' : '$') + (n < 1000 && n % 1 ? n.toFixed(n < 10 ? 2 : 1) : fmtN(n));
  let i = 0; while (n >= 1000 && i < SUFFIX.length - 1) { n /= 1000; i++; }
  return (neg ? '-$' : '$') + (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1') + SUFFIX[i];
}
function fmtDur(s) { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h ? h + 'h ' + m + 'm' : m ? m + 'm ' + (x < 10 ? '0' : '') + x + 's' : x + 's'; }
const ratXpNeed = l => Math.round(30 * Math.pow(l, 1.6));     // XP from level l to l+1 (1 XP a second in a slot)
const playerXpNeed = L => Math.round(50 * Math.pow(L, 1.7));  // player XP from level L to L+1
function baseEarn(cfg, sp) { const s = SP[sp]; if (!s) return 0; if (cfg.speciesEarn[sp] != null) return +cfg.speciesEarn[sp]; return +cfg.rarityEarn[s.r] || 0; }
// mods: { money: potion multiplier, rebirths }
function ratEarn(cfg, rat, mods) {
  mods = mods || {}; const s = SP[rat.sp]; if (!s) return { total: 0, parts: [] };
  const parts = [], base = baseEarn(cfg, rat.sp);
  parts.push({ k: 'base', n: cfg.speciesEarn[rat.sp] != null ? s.n + ' value' : RI[s.r].n + ' base', v: base });
  let t = base;
  for (const m of [rat.mut, rat.wx, rat.disco ? 'disco' : null]) if (m && cfg.mutMult[m]) { parts.push({ k: 'mut', n: MUTATIONS[m].n + ' mutation', x: +cfg.mutMult[m] }); t *= cfg.mutMult[m]; }
  const lm = 1 + cfg.levelMult * ((rat.lvl || 1) - 1); if (lm !== 1) { parts.push({ k: 'lvl', n: 'Level ' + rat.lvl, x: lm }); t *= lm; }
  if (rat.evo) { const em = Math.pow(cfg.evoMult, rat.evo); parts.push({ k: 'evo', n: 'Evolution ' + ['', 'I', 'II', 'III'][rat.evo], x: em }); t *= em; }
  if (mods.rebirths) { const rm = 1 + cfg.rebirthEarn * mods.rebirths; parts.push({ k: 'reb', n: mods.rebirths + ' rebirth' + (mods.rebirths > 1 ? 's' : ''), x: rm }); t *= rm; }
  if (mods.money && mods.money !== 1) { parts.push({ k: 'pot', n: 'Money potion', x: mods.money }); t *= mods.money; }
  if (cfg.globalEarn && cfg.globalEarn !== 1) { parts.push({ k: 'glob', n: 'Server boost', x: cfg.globalEarn }); t *= cfg.globalEarn; }
  return { total: t, parts };
}
function sellPrice(cfg, rat) { return Math.max(1, Math.round(ratEarn(cfg, rat, {}).total * cfg.sellSeconds)); }
function slotPrice(cfg, slots) { return cfg.slotPrices[slots - cfg.startSlots]; }
function storagePrice(cfg, size) { const n = Math.round((size - cfg.startStorage) / cfg.storageStep); return Math.round(1000 * Math.pow(3, n)); }
function inventoryPrice(cfg, size) { const n = Math.round((size - cfg.startInventory) / cfg.inventoryStep); return Math.round(2000 * Math.pow(2.5, n)); }
function capPrice(rat) { const r = RI[SP[rat.sp].r]; return Math.round(5000 * Math.pow(r.i + 1, 2.4) * Math.pow(2, ((rat.cap || 50) - 50) / 10)); }
function rebirthNeed(cfg, rebirths) { return cfg.rebirthLevel + cfg.rebirthStep * rebirths; }
// spawn weights for a field with a given luck
function spawnWeights(cfg, fid, luck, ev) {
  const w = (cfg.fieldWeights[fid] || FI[fid].w).slice();
  for (let i = 0; i < w.length; i++) {
    w[i] *= (cfg.rarityBoost[RARITIES[i].id] || 1);
    if (i > 0) w[i] *= Math.pow(Math.max(0.01, luck), i / 3);
    if (ev && ev.heaven && i >= 4) w[i] *= cfg.heavenBoost;
  }
  return w;
}
function pickWeighted(w, r) { let t = 0; for (const x of w) t += Math.max(0, x); if (t <= 0) return 0; let v = r() * t; for (let i = 0; i < w.length; i++) { v -= Math.max(0, w[i]); if (v <= 0) return i; } return w.length - 1; }
// species of a rarity that can appear in a field (or in eggs when fid is null)
function speciesFor(rid, fid, opts) {
  opts = opts || {};
  let list = SPECIES.filter(s => s.r === rid && !s.inv && !(s.secret && !opts.secret));
  if (fid) { const native = list.filter(s => s.fields.includes(fid)); if (native.length) list = native; }
  return list;
}
// ev: merged event effects; mutMul: Mutation potion multiplier for natural chances
function rollMutations(cfg, ev, mutMul, r) {
  ev = ev || {}; mutMul = mutMul || 1; const out = { mut: null, wx: null, disco: 0 };
  const ch = k => Math.min(0.95, Math.max(ev[k] || 0, (cfg.natural[k] || 0) * mutMul));
  if (r() < ch('rainbow')) out.mut = 'rainbow'; else if (r() < ch('diamond')) out.mut = 'diamond'; else if (r() < ch('gold')) out.mut = 'gold';
  const wx = ['rain', 'snow', 'thunder'].filter(k => ev[k]); if (wx.length) { const k = wx[(r() * wx.length) | 0]; if (r() < ev[k]) out.wx = k; }
  if (ev.disco && r() < ev.disco) out.disco = 1;
  return out;
}
function mergeEvents(active) { const e = {}; for (const a of active || []) { const d = EVENTS[a.id]; if (!d) continue; for (const k in d.eff) e[k] = Math.max(e[k] || 0, d.eff[k]); } return e; }
function deepMerge(base, over) {
  if (over == null || typeof over !== 'object' || Array.isArray(over)) return over === undefined ? base : over;
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  for (const k of Object.keys(over)) out[k] = (base && typeof base[k] === 'object' && base[k] && !Array.isArray(base[k])) ? deepMerge(base[k], over[k]) : over[k];
  return out;
}
function ratName(rat) { const s = SP[rat.sp]; if (!s) return 'Rat'; const m = []; if (rat.mut) m.push(MUTATIONS[rat.mut].n); if (rat.wx) m.push(MUTATIONS[rat.wx].n); if (rat.disco) m.push('Disco'); return (m.length ? m.join(' ') + ' ' : '') + s.n + (rat.evo ? ' ' + ['', 'I', 'II', 'III'][rat.evo] : ''); }

const RCDATA = { RARITIES, RI, SPECIES, SP, FIELDS, FI, MUTATIONS, EVENTS, RODS, ROD, POTIONS, POT, EGGS, EGG, MYSTERY, COSMETICS, COS, COS_SLOTS, COS_CATS, ACHIEVEMENTS, ACH,
  DAILY, DAILY_COS_ROTATION, QUESTS, STATIONS, ST, PORTALS, LOBBY, showcaseStand, canEnter, lockText, aName, mulberry, FIELD_R, fieldLayout, blocked, DEFAULT_CONFIG,
  fmtN, fmtMoney, fmtDur, ratXpNeed, playerXpNeed, baseEarn, ratEarn, sellPrice, slotPrice, storagePrice, inventoryPrice, capPrice, rebirthNeed, spawnWeights, pickWeighted,
  speciesFor, rollMutations, mergeEvents, deepMerge, ratName, VERSION: 1 };
if (typeof module !== 'undefined' && module.exports) module.exports = RCDATA; else root.RCDATA = RCDATA;
})(typeof self !== 'undefined' ? self : this);
