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
  { id: 'meadow', n: 'Starter Meadow', lvl: 1, w: [70, 24, 5, 1, 0, 0, 0, 0, 0, 0], song: 'meadow', d: 'Sunny hills, wildflowers and lots of friendly rats.' },
  { id: 'clover', n: 'Clover Fields', lvl: 5, w: [45, 33, 15, 5.5, 1.5, 0, 0, 0, 0, 0], song: 'clover', d: 'Rolling clover, windmills and lucky breezes.' },
  { id: 'mushroom', n: 'Mushroom Forest', lvl: 10, w: [25, 32, 25, 12, 4.5, 1.5, 0, 0, 0, 0], song: 'mushroom', d: 'Giant glowing mushrooms under a dark green canopy.' },
  { id: 'crystal', n: 'Crystal Caves', lvl: 20, w: [8, 22, 32, 23, 10, 4, 1, 0, 0, 0], song: 'crystal', d: 'A huge cavern full of humming crystals.' },
  { id: 'frozen', n: 'Frozen Valley', lvl: 30, w: [0, 10, 25, 30, 20, 10, 4.5, 0.5, 0, 0], song: 'frozen', d: 'Snowy pines, a frozen lake and the northern lights.' },
  { id: 'lava', n: 'Lava Lands', lvl: 40, w: [0, 0, 12, 25, 30, 20, 10, 2.8, 0.2, 0], song: 'lava', d: 'Black rock, rivers of lava and a smoking volcano.' },
  { id: 'heaven', n: "Heaven's Garden", lvl: 55, w: [0, 0, 0, 10, 25, 30, 25, 9, 1, 0], song: 'heaven', d: 'Gardens on the clouds behind the golden gates.' },
  { id: 'omega', n: 'Omega Dimension', lvl: 75, w: [0, 0, 0, 0, 10, 20, 35, 30, 5, 0], song: 'omega', d: 'Floating shapes in a void that hums with power.' },
  { id: 'secret', n: 'Secret Realm', lvl: 100, w: [0, 0, 0, 0, 0, 10, 30, 45, 15, 0], song: 'secret', d: 'Ancient ruins under a rainbow sky. Few have seen it.' },
  // a special area that only reborn players can enter (rebirth unlocks it at any level)
  { id: 'reborn', n: 'Reborn Sanctuary', lvl: 1, reb: 1, w: [0, 0, 12, 24, 28, 19, 10, 5, 2, 0], song: 'reborn', d: 'A hidden garden of pink crystals. Only reborn catchers may enter.' }];
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
const MYSTERY = { id: 'mystery', n: 'Mystery Box', price: 50000, d: 'Money, potions, eggs, cosmetics, and a chance at a better rod.',
  table: [['money', 40], ['potion', 30], ['egg2', 14], ['cosmetic', 8], ['rod', 7], ['egg5', 1]] };

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
  { id: 'firstleg', n: 'First Legendary', d: 'Catch or hatch a Legendary rat.', stat: 'r_legendary', goal: 1, rw: { money: 25000, potion: 'superluck', title: 'Legend Finder' } },
  { id: 'firstmyth', n: 'First Mythical', d: 'Catch or hatch a Mythical rat.', stat: 'r_mythical', goal: 1, rw: { money: 50000, cos: 'flameaura' } },
  { id: 'firstapoc', n: 'First Apocryphal', d: 'Catch or hatch an Apocryphal rat.', stat: 'r_apocryphal', goal: 1, rw: { money: 250000, potion: 'supermoney' } },
  { id: 'firstomega', n: 'First Omega', d: 'Catch or hatch an Omega rat.', stat: 'r_omega', goal: 1, rw: { money: 1000000, potion: 'ultraluck', title: 'Omega Hunter', cos: 'voidwings' } },
  { id: 'firstgod', n: 'First God-like', d: 'Catch or hatch a God-like rat.', stat: 'r_godlike', goal: 1, rw: { money: 10000000, title: 'Godcatcher', cos: 'divinecrown' } },
  { id: 'firstsecret', n: 'First Secret', d: 'Find a Secret rat.', stat: 'r_secret', goal: 1, rw: { money: 50000000, title: 'Keeper of Secrets', cos: 'shadowaura' } },
  { id: 'index', n: 'Discover Every Rat', d: 'Fill every page of the Rat Index.', stat: 'indexN', goal: SPECIES.length, rw: { money: 500000000, title: 'Ratologist', cos: 'rainbowtrail' } },
  { id: 'fields', n: 'Complete Every Field', d: 'Catch every native rat of all nine fields.', stat: 'fieldsDone', goal: FIELDS.length, rw: { money: 250000000, title: 'Explorer Supreme', egg: 'egg5' } },
  { id: 't1', n: 'First Trade', d: 'Complete a trade with another player.', stat: 'trades', goal: 1, rw: { money: 5000 } },
  { id: 't100', n: 'Complete 100 Trades', d: 'Complete 100 trades.', stat: 'trades', goal: 100, rw: { money: 5000000, title: 'Master Trader', cos: 'goldchain' } },
  { id: 'l10', n: 'Level 10', d: 'Reach player level 10.', stat: 'level', goal: 10, rw: { money: 5000, potion: 'money' } },
  { id: 'l50', n: 'Level 50', d: 'Reach player level 50.', stat: 'level', goal: 50, rw: { money: 5000000, title: 'Veteran' } },
  { id: 'l100', n: 'Reach Level 100', d: 'Reach player level 100.', stat: 'level', goal: 100, rw: { money: 1000000000, title: 'Centurion', cos: 'laurel' } },
  { id: 'eggs10', n: 'Egg Cracker', d: 'Hatch 10 eggs.', stat: 'eggs', goal: 10, rw: { money: 10000, egg: 'egg2' } },
  { id: 'eggs100', n: 'Egg Master', d: 'Hatch 100 eggs.', stat: 'eggs', goal: 100, rw: { money: 2500000, egg: 'egg5' } },
  { id: 'chests', n: 'Treasure Hunter', d: 'Open 25 treasure chests.', stat: 'chests', goal: 25, rw: { money: 100000, potion: 'luck' } },
  { id: 'rebirth1', n: 'Born Again', d: 'Rebirth for the first time.', stat: 'rebirths', goal: 1, rw: { title: 'Reborn', cos: 'rebirthcrown' } },
  { id: 'rebirth5', n: 'Phoenix Catcher', d: 'Rebirth 5 times.', stat: 'rebirths', goal: 5, rw: { title: 'Phoenix', cos: 'rebirthaura' } },
  { id: 'evolve', n: 'Evolution!', d: 'Evolve a rat.', stat: 'evolved', goal: 1, rw: { money: 20000 } },
  { id: 'rich', n: 'Millionaire', d: 'Have $1,000,000 at once.', stat: 'peakMoney', goal: 1e6, rw: { title: 'Millionaire' } },
  { id: 'billion', n: 'Billionaire', d: 'Have $1,000,000,000 at once.', stat: 'peakMoney', goal: 1e9, rw: { title: 'Billionaire', potion: 'supermoney' } }];
const ACH = {}; ACHIEVEMENTS.forEach(a => { ACH[a.id] = a; });

// ---------- daily rewards (7-day cycle, the 7th is special) ----------
const DAILY = [
  { money: 1 }, { potion: 'luck' }, { egg: 'egg2', n: 2 }, { potion: 'money', money: 1 }, { mystery: 1, rod: 'next' }, { cos: 'chefhat', potion: 'catch' },
  { special: 1, money: 5, egg: 'egg5', potion: 'superluck', cos: 'weeklycrown' }];
const DAILY_COS_ROTATION = ['chefhat', 'heartglasses', 'bubbletrail']; // day 6 cycles through these

// ---------- daily quests ----------
const QUESTS = [
  { id: 'catch', d: 'Catch {n} rats', stat: 'caught', n: [10, 20, 35] },
  { id: 'catchrare', d: 'Catch {n} Rare or better rats', stat: 'caughtRare', n: [3, 6, 10] },
  { id: 'sell', d: 'Sell {n} rats', stat: 'sold', n: [5, 10, 20] },
  { id: 'fields', d: 'Visit {n} different fields', stat: 'fieldsToday', n: [2, 3, 4] },
  { id: 'mutated', d: 'Catch a mutated rat', stat: 'mutCaught', n: [1, 1, 2] },
  { id: 'earn', d: 'Earn {money}', stat: 'earned', n: [1, 3, 6], money: 1 },
  { id: 'eggs', d: 'Hatch {n} eggs', stat: 'eggs', n: [1, 3, 5] },
  { id: 'chest', d: 'Open {n} treasure chests', stat: 'chests', n: [1, 2, 3] },
  { id: 'trade', d: 'Complete a trade', stat: 'trades', n: [1, 1, 2] },
  { id: 'levelup', d: 'Level up rats {n} times', stat: 'ratLevels', n: [3, 6, 10] }];

// ---------- lobby ----------
// Stations stand on a ring around the plaza (angle in degrees: 0 is north, toward the field portals).
const STATIONS = [
  { id: 'shop', n: 'Item Shop', a: 76, r: 24, key: 'Shop' },
  { id: 'eggs', n: 'Egg Hatchery', a: 95, r: 24, key: 'Eggs' },
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

/* RAT CATCHERS - the game server, running inside the page for solo play without a server. */
(function () {
'use strict';
const hex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
function rnd(n) { const b = new Uint8Array(n); (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(b) : b.forEach((_, i) => { b[i] = Math.random() * 256 | 0; }); b.toString = enc => enc === 'hex' ? hex(b) : enc === 'base64url' ? btoa(String.fromCharCode.apply(null, b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : hex(b); return b; }
function fnv(s) { let h1 = 0x811c9dc5, h2 = 0x1234567, out = ''; s = String(s); for (let k = 0; k < 8; k++) { for (let i = 0; i < s.length; i++) { h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619); h2 = Math.imul(h2 ^ (s.charCodeAt(i) + k), 2246822519); } out += ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0'); } return out; }
const CRYPTO = { randomBytes: rnd, createHash: () => { let d = ''; const o = { update(x) { d += x; return o; }, digest: () => fnv(d) }; return o; }, scryptSync: (p, s) => ({ toString: () => fnv(p + '|' + s) }), timingSafeEqual: (a, b) => a.v === b.v };
const Buffer = { from: v => ({ v }) };
const setImmediate = f => setTimeout(f, 0);
const console = { log() {}, warn() {}, error: (...a) => window.console && window.console.error(...a) };
const CACHE = {}, MODS = {};
function req(n) { if (n === 'node:crypto') return CRYPTO; if (n === '../shared/data.js') return window.RCDATA; if (CACHE[n]) return CACHE[n].exports; const m = CACHE[n] = { exports: {} }; MODS[n](m, m.exports, req); return m.exports; }
MODS['./saves.js'] = function (module, exports, require) {
'use strict';
// Device saves: for a free host whose disk is wiped on every restart. Each player's save lives on their own
// device; they bring it when they connect, and the server sends it back every few seconds while they play.
const D = require('../shared/data.js');
const PL_NUM = ['money', 'level', 'xp', 'rebirths', 'caught', 'trades', 'rarity_score', 'mutation_score', 'last_seen'];
const RAT_NUM = ['disco', 'lvl', 'xp', 'cap', 'evo', 'fav', 'lock', 'slot', 'born'];
// check a save that came from a device: right shapes, sane numbers, known rats
function clean(b) {
  if (!b || typeof b !== 'object' || !b.pl || !Array.isArray(b.rats) || b.rats.length > 6000) return null;
  const pl = {}; for (const k of PL_NUM) { const v = Number(b.pl[k]); if (!isFinite(v) || v < 0 || v > 1e300) return null; pl[k] = v; }
  if (typeof b.pl.data !== 'string' || b.pl.data.length > 400000) return null; try { JSON.parse(b.pl.data); } catch (e) { return null; }
  pl.data = b.pl.data; pl.color = /^#[0-9a-fA-F]{6}$/.test(b.pl.color) ? b.pl.color : '#ff9f1a';
  const rats = [], ids = new Set();
  for (const r of b.rats) {
    if (!r || typeof r.id !== 'string' || r.id.length > 24 || ids.has(r.id) || !D.SP[r.sp]) continue;
    const o = { id: r.id, sp: r.sp, mut: typeof r.mut === 'string' ? r.mut.slice(0, 24) : null, wx: typeof r.wx === 'string' ? r.wx.slice(0, 24) : null, place: ['inv', 'sto', 'slot', 'eq'].includes(r.place) ? r.place : 'sto', cos: typeof r.cos === 'string' ? r.cos.slice(0, 2000) : '{}', src: typeof r.src === 'string' ? r.src.slice(0, 40) : '' };
    for (const k of RAT_NUM) { const v = Number(r[k]); o[k] = isFinite(v) ? v : 0; }
    ids.add(r.id); rats.push(o);
  }
  return { name: String(b.name || '').replace(/[^A-Za-z0-9_ ]/g, '').trim().slice(0, 16), pl, rats };
}
function exportAcc(G, id) {
  const st = G.db.st, a = st.accById.get(id), p = st.plGet.get(id); if (!a || !p) return null;
  const pl = {}; for (const k of PL_NUM) pl[k] = p[k]; pl.data = p.data; pl.color = p.color;
  return { name: a.name, pl, rats: st.ratsOf.all(id).map(r => { const o = Object.assign({}, r); delete o.owner; return o; }) };
}
function writeAcc(G, id, b) {
  const st = G.db.st, p = b.pl;
  if (!st.plGet.get(id)) st.plInsert.run(id, p.money, p.data, p.last_seen, p.color);
  st.plSave.run(p.money, p.level, p.xp, p.rebirths, p.caught, p.trades, p.rarity_score, p.mutation_score, p.data, p.last_seen, p.color, id);
  for (const r of st.ratsOf.all(id)) st.ratDelete.run(r.id, id);
  for (const r of b.rats) { if (st.ratGet.get(r.id)) continue; st.ratInsert.run(r.id, id, r.sp, r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, r.fav, r.lock, r.place, r.slot, r.cos, r.born, r.src); } // a rat someone else owns now stays theirs
}
module.exports = { clean, exportAcc, writeAcc };

};
MODS['./player.js'] = function (module, exports, require) {
'use strict';
// Player state, inventory, money, levels, quests, achievements, the Rat Index and rewards.
// Everything here runs on the server; the client only ever asks.
const crypto = require('node:crypto');
const D = require('../shared/data.js');
const { SP, RI, RARITIES, MUTATIONS, ROD, POT, ACH, ACHIEVEMENTS, COS, FIELDS, SPECIES, QUESTS } = D;

const dayNow = () => Math.floor(Date.now() / 86400000);
const newId = () => crypto.randomBytes(9).toString('base64url');

function newData() {
  return { rods: ['wood'], rod: 'wood', potions: {}, eff: {}, eggs: {}, boxes: 0, snacks: 0, slots: 0, storage: 0, inv: 0, equip: 0, cos: {}, ach: {}, titles: [], title: '',
    daily: { streak: 0, last: -1 }, quests: { day: -1, list: [] }, index: {}, idxMs: [], stats: {}, showcase: { rats: [], theme: 'classic' }, tokens: 0, fieldsVisited: {}, joined: Date.now() };
}
function ratFromRow(r) { let cos = {}; try { cos = JSON.parse(r.cos || '{}'); } catch (e) {} return { id: r.id, sp: r.sp, mut: r.mut || null, wx: r.wx || null, disco: r.disco ? 1 : 0, lvl: r.lvl, xp: r.xp, cap: r.cap, evo: r.evo, fav: r.fav ? 1 : 0, lock: r.lock ? 1 : 0, place: r.place, slot: r.slot, cos, born: r.born, src: r.src }; }
function ratView(r) { return { id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, lvl: r.lvl, xp: Math.floor(r.xp), cap: r.cap, evo: r.evo, fav: r.fav, lock: r.lock, place: r.place, slot: r.slot, cos: r.cos, born: r.born }; }
function lookView(r) { return { sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, evo: r.evo, lvl: r.lvl, cos: r.cos }; }

function load(G, acc) {
  const row = G.db.st.plGet.get(acc.id); if (!row) return null;
  let d = {}; try { d = JSON.parse(row.data || '{}'); } catch (e) {}
  d = Object.assign(newData(), d);
  const P = { id: acc.id, name: acc.name, money: row.money, level: row.level, xp: row.xp, rebirths: row.rebirths, caught: row.caught, trades: row.trades, d, last_seen: row.last_seen, color: row.color || '#ff9f1a', rats: new Map(), dirty: false };
  for (const r of G.db.st.ratsOf.all(acc.id)) P.rats.set(r.id, ratFromRow(r));
  return P;
}
function scores(P) {
  let rs = 0, ms = 0;
  for (const r of P.rats.values()) { const s = SP[r.sp]; if (!s) continue; rs += RI[s.r].pts * (1 + (r.evo || 0)); for (const m of [r.mut, r.wx, r.disco ? 'disco' : null]) if (m) ms += MUTATIONS[m].pts; }
  return [rs, ms];
}
function save(G, P) {
  const [rs, ms] = scores(P);
  G.db.st.plSave.run(P.money, P.level, P.xp, P.rebirths, P.caught, P.trades, rs, ms, JSON.stringify(P.d), P.online ? Date.now() : P.last_seen, P.color, P.id);
  P.dirty = false;
}
function saveRat(G, P, r) { G.db.st.ratSave.run(r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, r.fav, r.lock, r.place, r.slot, JSON.stringify(r.cos || {}), r.id, P.id); }

// ---------- capacity ----------
const cap = (G, P) => ({ slots: G.cfg.startSlots + P.d.slots, storage: G.cfg.startStorage + P.d.storage * G.cfg.storageStep, inv: G.cfg.startInventory + P.d.inv * G.cfg.inventoryStep, equip: G.cfg.startEquip + P.d.equip });
function countPlace(P, place) { let n = 0; for (const r of P.rats.values()) if (r.place === place) n++; return n; }
// where a new rat goes: the backpack, then storage, else nowhere
function roomFor(G, P) { const c = cap(G, P); if (countPlace(P, 'inv') < c.inv) return 'inv'; if (countPlace(P, 'sto') < c.storage) return 'sto'; return null; }

// ---------- money, luck and earnings ----------
function eff(P, cat) { const e = P.d.eff[cat]; return e && e.ends > Date.now() ? e : null; }
function petLuck(r) { const s = SP[r.sp]; return s ? 0.02 * (RI[s.r].i + 1) * (1 + 0.5 * (r.evo || 0)) : 0; }
function luckOf(G, P) {
  const rod = ROD[P.d.rod] || ROD.wood, rc = G.cfg.rods[rod.id] || rod;
  let l = rc.luck * (1 + G.cfg.rebirthLuck * P.rebirths) * (G.cfg.globalLuck || 1);
  const e = eff(P, 'luck'); if (e) l *= e.mult;
  let pet = 0; for (const r of P.rats.values()) if (r.place === 'eq') pet += petLuck(r);
  return l * (1 + pet);
}
function earnMods(P, withPotion) { const e = withPotion ? eff(P, 'money') : null; return { money: e ? e.mult : 1, rebirths: P.rebirths }; }
function mps(G, P, withPotion) {
  const mods = earnMods(P, withPotion !== false); let t = 0; const per = {};
  for (const r of P.rats.values()) if (r.place === 'slot') { const v = D.ratEarn(G.cfg, r, mods).total; per[r.id] = v; t += v; }
  return { total: t, per };
}
function stat(P, k) { return P.d.stats[k] || 0; }
function bump(G, P, k, n) { P.d.stats[k] = (P.d.stats[k] || 0) + (n == null ? 1 : n); questProgress(G, P, k, n == null ? 1 : n); P.dirty = true; }
function addMoney(G, P, v, earned) {
  P.money += v; if (P.money < 0) P.money = 0;
  if (P.money > (P.d.stats.peakMoney || 0)) { P.d.stats.peakMoney = P.money; }
  if (earned && v > 0) { P.d.stats.earned = (P.d.stats.earned || 0) + v; questProgress(G, P, 'earned', v); }
  P.dirty = true;
}
function addXP(G, P, xp) {
  P.xp += xp; let up = 0;
  while (P.xp >= D.playerXpNeed(P.level)) { P.xp -= D.playerXpNeed(P.level); P.level++; up++; }
  if (up) { G.toast(P, { kind: 'level', text: 'Level up! You are now level ' + P.level + '.' }); checkAch(G, P); }
  P.dirty = true; return up;
}

// ---------- Rat Index ----------
function discover(G, P, r) {
  const e = P.d.index[r.sp] || (P.d.index[r.sp] = { n: 0, m: {} }); const isNew = !e.n; e.n++;
  for (const m of [r.mut, r.wx, r.disco ? 'disco' : null]) if (m) e.m[m] = 1;
  if (r.evo) e.m['evo' + r.evo] = 1;
  const s = SP[r.sp]; if (s) { P.d.stats['r_' + s.r] = (P.d.stats['r_' + s.r] || 0) + 1; }
  if (isNew) {
    G.toast(P, { kind: 'index', text: 'New in your Rat Index: ' + (s ? s.n : r.sp) + '!' });
    const pct = Math.floor(indexCount(P) / SPECIES.length * 100);
    for (const ms of [10, 25, 50, 75, 100]) if (pct >= ms && !P.d.idxMs.includes(ms)) { P.d.idxMs.push(ms); const rw = INDEX_RW[ms]; grant(G, P, rw, 'Rat Index ' + ms + '% complete'); }
  }
  checkAch(G, P);
}
const INDEX_RW = { 10: { money: 5000, potion: 'luck' }, 25: { money: 50000, egg: 'egg2', n: 3 }, 50: { money: 2500000, potion: 'superluck' }, 75: { money: 100000000, egg: 'egg5' }, 100: { money: 1000000000, potion: 'ultraluck' } };
const indexCount = P => Object.keys(P.d.index).filter(k => SP[k] && P.d.index[k].n > 0).length;
function fieldsDone(P) { let n = 0; for (const f of FIELDS) { const nat = SPECIES.filter(s => s.fields.includes(f.id)); if (nat.length && nat.every(s => P.d.index[s.id] && P.d.index[s.id].n)) n++; } return n; }

// ---------- achievements ----------
function achValue(P, a) {
  switch (a.stat) { case 'caught': return P.caught; case 'trades': return P.trades; case 'level': return P.level; case 'rebirths': return P.rebirths;
    case 'indexN': return indexCount(P); case 'fieldsDone': return fieldsDone(P); default: return stat(P, a.stat); }
}
function checkAch(G, P) {
  for (const a of ACHIEVEMENTS) {
    if (P.d.ach[a.id]) continue;
    if (achValue(P, a) >= a.goal) { P.d.ach[a.id] = Date.now(); grant(G, P, a.rw, 'Achievement: ' + a.n); G.toast(P, { kind: 'ach', text: 'Achievement unlocked: ' + a.n, sub: a.d }); }
  }
}
function achList(P) { return ACHIEVEMENTS.map(a => ({ id: a.id, v: Math.min(achValue(P, a), a.goal), done: P.d.ach[a.id] || 0 })); }

// ---------- rewards ----------
function grant(G, P, rw, why) {
  if (!rw) return [];
  const got = [];
  if (rw.money) { const m = rw.special || rw.money < 20 ? rewardMoney(G, P, rw.money) : rw.money; addMoney(G, P, m, false); got.push(D.fmtMoney(m)); }
  if (rw.potion) { P.d.potions[rw.potion] = (P.d.potions[rw.potion] || 0) + 1; got.push(POT[rw.potion].n); }
  if (rw.egg) { const n = rw.n || 1; P.d.eggs[rw.egg] = (P.d.eggs[rw.egg] || 0) + n; got.push((n > 1 ? n + 'x ' : '') + D.EGG[rw.egg].n); }
  if (rw.cos) { P.d.cos[rw.cos] = (P.d.cos[rw.cos] || 0) + 1; got.push(COS[rw.cos].n); }
  if (rw.title && !P.d.titles.includes(rw.title)) { P.d.titles.push(rw.title); if (!P.d.title) P.d.title = rw.title; got.push('title “' + rw.title + '”'); }
  if (rw.mystery) { P.d.boxes += rw.mystery; got.push('Mystery Box'); }
  if (rw.tokens) { P.d.tokens += rw.tokens; got.push(rw.tokens + ' event tokens'); }
  if (rw.rod === 'next') { // the next rod after the best one the player owns
    const best = Math.max(...P.d.rods.map(r => ROD[r].i)), up = D.RODS[best + 1];
    if (up && !P.d.rods.includes(up.id)) { P.d.rods.push(up.id); got.push(up.n); } else { const m = rewardMoney(G, P, 3); addMoney(G, P, m, false); got.push(D.fmtMoney(m) + ' (you have every rod!)'); }
  } else if (rw.rod) { if (!P.d.rods.includes(rw.rod)) P.d.rods.push(rw.rod); got.push(ROD[rw.rod].n); }
  P.dirty = true;
  if (why && got.length) G.toast(P, { kind: 'reward', text: why, sub: got.join(' · ') });
  return got;
}
// small money rewards scale with how far the player has come
function rewardMoney(G, P, k) { const m = mps(G, P, false).total; return Math.round(Math.max(1000 * k, Math.min(m * 300 * k, 1e15)) * (1 + P.level / 20)); }

// ---------- daily rewards ----------
function dailyState(P) { const today = dayNow(), d = P.d.daily; const can = d.last !== today; const streak = can ? (d.last === today - 1 ? d.streak + 1 : 1) : d.streak; return { can, streak, day: ((streak - 1) % 7 + 7) % 7, last: d.last }; }
function claimDaily(G, P) {
  const s = dailyState(P); if (!s.can) return { ok: false, why: 'Come back tomorrow for your next reward.' };
  P.d.daily = { streak: s.streak, last: dayNow() };
  const rw = Object.assign({}, D.DAILY[s.day]);
  if (rw.cos === 'chefhat') rw.cos = D.DAILY_COS_ROTATION[Math.floor((s.streak - 1) / 7) % D.DAILY_COS_ROTATION.length];
  const got = grant(G, P, rw, s.day === 6 ? 'Day 7 special reward!' : 'Daily reward, day ' + (s.day + 1));
  P.dirty = true; return { ok: true, day: s.day, streak: s.streak, got };
}

// ---------- daily quests ----------
function ensureQuests(G, P) {
  const today = dayNow(); if (P.d.quests.day === today) return;
  const r = D.mulberry(P.id * 7919 + today * 104729), tier = P.level < 15 ? 0 : P.level < 50 ? 1 : 2;
  const pool = QUESTS.slice(), list = [], count = 3 + ((r() * 3) | 0);
  const m = Math.max(1, mps(G, P, false).total);
  while (list.length < count && pool.length) {
    const q = pool.splice((r() * pool.length) | 0, 1)[0];
    let n = q.n[tier]; if (q.money) n = Math.round(Math.max(5000, m * 300) * q.n[tier]);
    const rwRoll = r(), reward = { money: Math.round(Math.max(800, m * 90) * (1 + tier) * (1 + list.length * 0.25)) };
    if (rwRoll < 0.35) reward.potion = ['luck', 'money', 'catch', 'speed'][(r() * 4) | 0]; else if (rwRoll < 0.55) reward.egg = tier ? 'egg5' : 'egg2';
    list.push({ id: q.id, stat: q.stat, n, prog: 0, claimed: 0, rw: reward, d: q.d.replace('{n}', D.fmtN(n)).replace('{money}', D.fmtMoney(n)) });
  }
  P.d.quests = { day: today, list }; P.d.fieldsVisited = {}; P.dirty = true;
}
function questProgress(G, P, k, n) {
  if (!P.d.quests || P.d.quests.day !== dayNow()) return;
  let ch = false, done = false;
  for (const q of P.d.quests.list) if (q.stat === k && q.prog < q.n) { q.prog = Math.min(q.n, q.prog + n); ch = true; if (q.prog >= q.n) { done = true; G.toast(P, { kind: 'quest', text: 'Quest complete: ' + q.d, sub: 'Claim your reward in Quests.' }); } }
  // money quests move every second; tell the player about them now and then, not every tick
  if (ch) { P.dirty = true; const t = Date.now(); if (done || k !== 'earned' || t - (P.qSyncT || 0) > 15000) { P.qSyncT = t; G.questDirty(P); } }
}
function claimQuest(G, P, i) {
  ensureQuests(G, P); const q = P.d.quests.list[i | 0];
  if (!q) return { ok: false, why: 'No such quest.' }; if (q.claimed) return { ok: false, why: 'Already claimed.' }; if (q.prog < q.n) return { ok: false, why: 'Not finished yet.' };
  q.claimed = 1; grant(G, P, q.rw, 'Quest reward'); return { ok: true };
}

// ---------- new rats ----------
function giveRat(G, P, spec, src, opts) {
  opts = opts || {}; const place = opts.place || roomFor(G, P); if (!place) return null;
  const r = { id: newId(), sp: spec.sp, mut: spec.mut || null, wx: spec.wx || null, disco: spec.disco ? 1 : 0, lvl: 1, xp: 0, cap: G.cfg.ratMaxLevel, evo: spec.evo || 0, fav: 0, lock: 0, place, slot: -1, cos: {}, born: Date.now(), src: src || '' };
  G.db.st.ratInsert.run(r.id, P.id, r.sp, r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, 0, 0, r.place, -1, '{}', r.born, r.src);
  P.rats.set(r.id, r);
  discover(G, P, r);
  P.dirty = true; return r;
}
function removeRat(G, P, r) { // returns its cosmetics to the owner and forgets it
  for (const s in r.cos) if (r.cos[s]) P.d.cos[r.cos[s]] = (P.d.cos[r.cos[s]] || 0) + 1;
  G.db.st.ratDelete.run(r.id, P.id); P.rats.delete(r.id);
  P.d.showcase.rats = P.d.showcase.rats.filter(x => x !== r.id); P.dirty = true;
}

function view(G, P) {
  ensureQuests(G, P);
  const d = P.d;
  return { id: P.id, name: P.name, money: P.money, level: P.level, xp: P.xp, rebirths: P.rebirths, caught: P.caught, trades: P.trades, color: P.color,
    d: { rods: d.rods, rod: d.rod, potions: d.potions, eff: d.eff, eggs: d.eggs, boxes: d.boxes, snacks: d.snacks, cos: d.cos, ach: d.ach, titles: d.titles, title: d.title, daily: dailyState(P), quests: d.quests, index: d.index, idxMs: d.idxMs, stats: d.stats, showcase: d.showcase, tokens: d.tokens },
    cap: cap(G, P), luck: luckOf(G, P), mps: mps(G, P).total, rats: [...P.rats.values()].map(ratView), achs: achList(P), hasPass: !!P.hasPass };
}

module.exports = { newData, newId, dayNow, load, save, saveRat, ratView, lookView, cap, countPlace, roomFor, eff, luckOf, mps, earnMods, bump, stat, addMoney, addXP, discover, indexCount, fieldsDone,
  checkAch, achList, grant, rewardMoney, dailyState, claimDaily, ensureQuests, questProgress, claimQuest, giveRat, removeRat, view, petLuck };

};
MODS['./events.js'] = function (module, exports, require) {
'use strict';
// Global events, weather, rat invasions and announcements. One server process runs every room,
// so an event started here reaches every room at once.
const D = require('../shared/data.js');

function create(G) {
  const E = { active: [], weather: null, inv: null, ann: [], nextEvent: 0, nextInv: 0, sig: '' };
  const now = () => Date.now(), rnd = Math.random;
  const live = () => E.active.filter(e => e.ends > now());
  function schedule(t) {
    const c = G.cfg; E.nextEvent = t + 1000 * (c.eventEvery[0] + rnd() * (c.eventEvery[1] - c.eventEvery[0]));
    if (!E.nextInv) E.nextInv = t + 1000 * (c.invasionEvery[0] + rnd() * (c.invasionEvery[1] - c.invasionEvery[0]));
  }
  const durOf = id => (G.cfg.eventDur && G.cfg.eventDur[id]) || D.EVENTS[id].dur;
  function weather() {
    if (E.weather) return E.weather;
    const ids = live().map(e => e.id);
    if (ids.includes('ultra')) return 'ultra';
    if (ids.includes('thunder')) return 'storm'; if (ids.includes('rain')) return 'rain'; if (ids.includes('snow')) return 'snow';
    return 'clear';
  }
  function state() { return { active: live().map(e => ({ id: e.id, ends: e.ends, by: e.by || '' })), weather: weather(), forced: E.weather || null, inv: E.inv && E.inv.ends > now() ? { ends: E.inv.ends } : null, srv: now() }; }
  function push() { const st = state(); const sig = JSON.stringify([st.active.map(a => a.id + a.ends), st.weather, st.inv && st.inv.ends]); if (sig === E.sig) return; E.sig = sig; G.broadcast(Object.assign({ t: 'events' }, st)); }
  function announce(a) {
    const m = { t: 'ann', kind: a.kind || 'normal', text: String(a.text || '').slice(0, 220), col: a.col || null, sound: a.sound || null, dur: Math.max(2, Math.min(60, +a.dur || 6)), at: now(), by: a.by || '' };
    if (a.room) { const r = G.rooms.get(a.room); if (r) for (const s of r.players) G.send(s, m); return m; }
    E.ann.push(m); if (E.ann.length > 30) E.ann.shift();
    G.broadcast(m); return m;
  }
  function start(id, dur, by) {
    const d = D.EVENTS[id]; if (!d) return false;
    const t = now(), ends = t + 1000 * (dur || durOf(id));
    const ex = E.active.find(e => e.id === id && e.ends > t);
    if (ex) ex.ends = Math.max(ex.ends, ends); else E.active.push({ id, ends, by: by || '' });
    E.active = E.active.filter(e => e.ends > t);
    announce({ kind: 'event', text: d.n + ' has started! ' + d.d, col: d.col, dur: 8, by });
    push(); return true;
  }
  function stop(id, by) { const before = E.active.length; E.active = E.active.filter(e => e.id !== id); if (E.active.length !== before) { announce({ kind: 'event', text: D.EVENTS[id].n + ' has ended.', col: D.EVENTS[id].col, dur: 5, by }); push(); } return true; }
  function startInvasion(dur, by) {
    const t = now(); E.inv = { ends: t + 1000 * (dur || G.cfg.invasionDur), by };
    announce({ kind: 'event', text: 'RAT INVASION! Strange rats are pouring into every field. Catch the invaders before they leave!', col: '#ff3a5c', sound: 'siren', dur: 10, by });
    push(); return true;
  }
  function stopInvasion(by) { if (E.inv) { E.inv = null; announce({ kind: 'event', text: 'The rat invasion is over. The invaders have gone home.', col: '#ff3a5c', dur: 6, by }); push(); } return true; }
  function setWeather(w, by) { E.weather = ['clear', 'rain', 'snow', 'storm'].includes(w) ? w : null; push(); return true; }
  function tick(t) {
    let ch = false;
    for (const e of E.active) if (e.ends <= t) { ch = true; announce({ kind: 'event', text: D.EVENTS[e.id].n + ' has ended.', col: D.EVENTS[e.id].col, dur: 5 }); }
    if (ch) E.active = E.active.filter(e => e.ends > t);
    if (E.inv && E.inv.ends <= t) { E.inv = null; ch = true; announce({ kind: 'event', text: 'The rat invasion is over.', col: '#ff3a5c', dur: 6 }); }
    if (!E.nextEvent) schedule(t);
    if (G.cfg.autoEvents && t >= E.nextEvent) {
      const ids = Object.keys(D.EVENTS).filter(k => k !== 'ultra'), pick = rnd() < 0.06 ? 'ultra' : ids[(rnd() * ids.length) | 0];
      if (G.sessions.size) start(pick, 0, 'auto'); E.nextEvent = 0; schedule(t);
    }
    if (G.cfg.autoInvasions && E.nextInv && t >= E.nextInv) { if (G.sessions.size && !E.inv) startInvasion(0, 'auto'); E.nextInv = t + 1000 * (G.cfg.invasionEvery[0] + rnd() * (G.cfg.invasionEvery[1] - G.cfg.invasionEvery[0])); }
    if (ch) push();
  }
  function rareSpawn(a, r) { // let players in that field know something special turned up
    const s = D.SP[r.sp], rr = D.RI[s.r];
    for (const p of a.players) G.send(p, { t: 'toast', kind: 'rare', text: D.aName(rr.n + ' rat').replace(/^./, c => c.toUpperCase()) + ' appeared nearby!', sub: 'Look for the ' + rr.n.toLowerCase() + ' glow.', col: rr.col });
  }
  G.events = { effects: () => D.mergeEvents(live()), active: live, invasion: () => !!(E.inv && E.inv.ends > now()), state, recent: () => E.ann.filter(a => now() - a.at < 60000).slice(-3),
    start, stop, startInvasion, stopInvasion, setWeather, announce, tick, rareSpawn, push, all: () => E.ann.slice() };
}
module.exports = { create };

};
MODS['./trade.js'] = function (module, exports, require) {
'use strict';
// Trading between two players in the same room. Both sides add rats, both press Ready, both confirm,
// a 5 second countdown runs, and then the server moves the rats in one database transaction.
const D = require('../shared/data.js');
const PL = require('./player.js');
const MAX_RATS = 9, COUNTDOWN = 5000;

function create(G) {
  const trades = new Map(); // session -> trade
  const asks = new Map();   // target player id -> { from session, at }
  let seq = 0;
  const now = () => Date.now();
  const side = (T, s) => T.a === s ? 'a' : 'b', other = (T, s) => T.a === s ? T.b : T.a;
  function tview(T, s) {
    const me = side(T, s), them = me === 'a' ? 'b' : 'a', ratsOf = (sess, ids) => ids.map(id => sess.P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.ratView(r), { earn: D.ratEarn(G.cfg, r, { rebirths: sess.P.rebirths }).total }));
    return { t: 'trade', id: T.id, with: { id: other(T, s).P.id, n: other(T, s).P.name }, mine: ratsOf(s, T.off[me]), theirs: ratsOf(other(T, s), T.off[them]), ready: { me: T.ready[me], them: T.ready[them] }, conf: { me: T.conf[me], them: T.conf[them] }, ends: T.ends || 0, srv: now() };
  }
  const update = T => { G.send(T.a, tview(T, T.a)); G.send(T.b, tview(T, T.b)); };
  function reset(T) { T.ready = { a: 0, b: 0 }; T.conf = { a: 0, b: 0 }; T.ends = 0; if (T.timer) { clearTimeout(T.timer); T.timer = null; } }
  function cancel(T, why) {
    if (T.done) return; T.done = true; if (T.timer) clearTimeout(T.timer);
    trades.delete(T.a); trades.delete(T.b);
    for (const s of [T.a, T.b]) G.send(s, { t: 'tradeEnd', ok: false, why: why || 'The trade was cancelled.' });
  }
  function cancelFor(s, why) { const T = trades.get(s); if (T) cancel(T, (s.P ? s.P.name : 'The other player') + ' ' + (why || 'left') + '. Trade cancelled.'); asks.delete(s.P && s.P.id); }
  const holds = (s, id) => { const T = trades.get(s); return !!(T && T.off[side(T, s)].includes(id)); };
  const H = {};
  H.tReq = (s, m) => {
    const o = s.room && [...s.room.players].find(x => x.P.id === (m.to | 0));
    if (!o || o === s) return G.send(s, { t: 'err', text: 'That player isn’t in your room.' });
    if (trades.get(s)) return G.send(s, { t: 'err', text: 'Finish your current trade first.' });
    if (trades.get(o)) return G.send(s, { t: 'err', text: o.P.name + ' is already trading.' });
    asks.set(o.P.id, { from: s, at: now() });
    G.send(o, { t: 'tAsk', from: s.P.id, n: s.P.name }); G.send(s, { t: 'toast', kind: 'trade', text: 'Trade request sent to ' + o.P.name + '.' });
  };
  H.tAns = (s, m) => {
    const q = asks.get(s.P.id); asks.delete(s.P.id);
    if (!q || q.from.P == null || q.from.P.id !== (m.from | 0) || now() - q.at > 60000) return G.send(s, { t: 'err', text: 'That trade request expired.' });
    const o = q.from; if (!m.ok) return G.send(o, { t: 'toast', kind: 'trade', text: s.P.name + ' said no to trading.' });
    if (o.room !== s.room) return G.send(s, { t: 'err', text: o.P.name + ' left the room.' });
    if (trades.get(s) || trades.get(o)) return G.send(s, { t: 'err', text: 'One of you is already trading.' });
    const T = { id: ++seq, a: o, b: s, off: { a: [], b: [] }, ready: { a: 0, b: 0 }, conf: { a: 0, b: 0 }, ends: 0, timer: null, done: false };
    trades.set(o, T); trades.set(s, T); update(T);
  };
  H.tAdd = (s, m) => {
    const T = trades.get(s); if (!T || T.ends) return; const me = side(T, s), r = s.P.rats.get(String(m.id || ''));
    if (!r) return; if (T.off[me].includes(r.id)) return;
    if (r.lock) return G.send(s, { t: 'err', text: 'Locked rats can’t be traded. Unlock it first.' });
    if (r.place === 'slot' || r.place === 'eq') return G.send(s, { t: 'err', text: 'Take that rat out of its ' + (r.place === 'slot' ? 'money slot' : 'equipped spot') + ' first.' });
    if (T.off[me].length >= MAX_RATS) return G.send(s, { t: 'err', text: 'You can offer up to ' + MAX_RATS + ' rats in one trade.' });
    if (r.fav && !m.confirm) return G.send(s, { t: 'confirm', what: 'tradefav', id: r.id, text: D.ratName(r) + ' is one of your favorites. Offer it in this trade?' });
    T.off[me].push(r.id); reset(T); update(T);
  };
  H.tRem = (s, m) => { const T = trades.get(s); if (!T || T.ends) return; const me = side(T, s); T.off[me] = T.off[me].filter(id => id !== String(m.id)); reset(T); update(T); };
  H.tReady = (s, m) => { const T = trades.get(s); if (!T) return; const me = side(T, s); if (T.ends && !m.v) { reset(T); update(T); return; } T.ready[me] = m.v ? 1 : 0; if (!T.ready[me]) T.conf = { a: 0, b: 0 }; update(T); };
  H.tConfirm = s => {
    const T = trades.get(s); if (!T || !T.ready.a || !T.ready.b || T.ends) return; const me = side(T, s);
    if (!T.off.a.length && !T.off.b.length) return G.send(s, { t: 'err', text: 'Add at least one rat first.' });
    T.conf[me] = 1;
    if (T.conf.a && T.conf.b) { T.ends = now() + COUNTDOWN; T.timer = setTimeout(() => commit(T), COUNTDOWN); }
    update(T);
  };
  H.tCancel = s => { const T = trades.get(s); if (T) cancel(T, s.P.name + ' cancelled the trade.'); };
  function commit(T) {
    T.timer = null; if (T.done) return;
    const A = T.a.P, B = T.b.P;
    if (!A || !B || !T.a.ws.open || !T.b.ws.open) return cancel(T, 'Someone disconnected. Trade cancelled.');
    let res;
    try {
      res = G.db.tx(() => {
        const ra = T.off.a.map(id => A.rats.get(id)), rb = T.off.b.map(id => B.rats.get(id));
        if (ra.some(r => !r || r.lock || r.place === 'slot' || r.place === 'eq') || rb.some(r => !r || r.lock || r.place === 'slot' || r.place === 'eq')) throw new Error('changed');
        const free = (P, out, inc) => { const c = PL.cap(G, P); return (c.inv - PL.countPlace(P, 'inv')) + (c.storage - PL.countPlace(P, 'sto')) + out - inc; };
        if (free(A, ra.length, rb.length) < 0) throw new Error('full:' + A.name);
        if (free(B, rb.length, ra.length) < 0) throw new Error('full:' + B.name);
        const move = (from, to, r) => {
          from.rats.delete(r.id); from.d.showcase.rats = from.d.showcase.rats.filter(x => x !== r.id);
          const place = PL.countPlace(to, 'inv') < PL.cap(G, to).inv ? 'inv' : 'sto';
          const ch = G.db.st.ratOwner.run(to.id, place, r.id, from.id); if (!ch.changes) throw new Error('changed');
          r.place = place; r.slot = -1; r.fav = 0; to.rats.set(r.id, r); PL.discover(G, to, r);
        };
        for (const r of ra) move(A, B, r); for (const r of rb) move(B, A, r);
        A.trades++; B.trades++; PL.bump(G, A, 'trades'); PL.bump(G, B, 'trades');
        G.db.st.tradeInsert.run(A.id, B.id, JSON.stringify(ra.map(r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, lvl: r.lvl, evo: r.evo }))), JSON.stringify(rb.map(r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, lvl: r.lvl, evo: r.evo }))), now());
        PL.checkAch(G, A); PL.checkAch(G, B); PL.save(G, A); PL.save(G, B);
        return { ra, rb };
      });
    } catch (e) {
      const msg = String(e.message || ''); return cancel(T, msg.startsWith('full:') ? msg.slice(5) + ' has no room for the new rats. Trade cancelled.' : 'Something changed during the countdown. Trade cancelled.');
    }
    T.done = true; trades.delete(T.a); trades.delete(T.b);
    G.send(T.a, { t: 'tradeEnd', ok: true, got: res.rb.map(PL.ratView), gave: res.ra.map(r => r.id) });
    G.send(T.b, { t: 'tradeEnd', ok: true, got: res.ra.map(PL.ratView), gave: res.rb.map(r => r.id) });
    G.sendRats(A, res.rb, res.ra.map(r => r.id)); G.sendRats(B, res.ra, res.rb.map(r => r.id));
    if (T.a.room) G.sendRoster(T.a.room);
  }
  G.trade = { H, cancelFor, holds, active: () => trades.size / 2 };
}
module.exports = { create };

};
MODS['./game.js'] = function (module, exports, require) {
'use strict';
// The game server: accounts, rooms (up to 20 players each), the lobby and fields, rat spawning and catching,
// money ticks, and every player request. The server decides every outcome.
const crypto = require('node:crypto');
const D = require('../shared/data.js');
const PL = require('./player.js');
const SAVES = require('./saves.js');
const { SP, RI, RARITIES, FI, FIELDS, ROD, POT, EGG, COS, MUTATIONS } = D;

const ROOM_MAX = 20;
const CODE_AB = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const hash = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const rnd = Math.random;
const now = () => Date.now();

function create(G) {
  G.rooms = new Map(); G.sessions = new Set(); G.byPlayer = new Map(); let sid = 0, ratSeq = 0, chestSeq = 0;

  // ---------- messaging helpers ----------
  const send = (s, m) => { if (s && s.ws && s.ws.open) s.ws.send(JSON.stringify(m)); };
  G.send = send;
  G.sessionOf = P => G.byPlayer.get(P.id);
  G.toast = (P, t) => { const s = G.byPlayer.get(P.id); if (s) send(s, Object.assign({ t: 'toast' }, t)); };
  const syncQ = new Set(); let syncT = null;
  G.sync = P => { syncQ.add(P.id); if (!syncT) syncT = setImmediate(flushSync); };
  G.questDirty = P => G.sync(P);
  function flushSync() { syncT = null; for (const id of syncQ) { const s = G.byPlayer.get(id); if (s && s.P) { const v = PL.view(G, s.P); delete v.rats; send(s, Object.assign({ t: 'me' }, v)); } } syncQ.clear(); }
  G.sendRats = (P, up, del) => { const s = G.byPlayer.get(P.id); if (s) send(s, { t: 'rats', up: (up || []).map(PL.ratView), del: del || [] }); G.sync(P); };
  G.broadcast = (m, filter) => { const str = JSON.stringify(m); for (const s of G.sessions) if (s.P && (!filter || filter(s))) s.ws.send(str); };

  // ---------- rooms and areas ----------
  function newCode() { let c; do { c = ''; const b = crypto.randomBytes(6); for (let i = 0; i < 6; i++) c += CODE_AB[b[i] % CODE_AB.length]; } while (G.rooms.has(c)); return c; }
  function makeRoom(pub, owner, name) {
    const code = newCode(), room = { code, pub: !!pub, owner: owner || 0, name: name || (pub ? 'Public room' : 'Private room'), players: new Set(), areas: {}, made: now(), emptySince: now() };
    room.areas.lobby = { id: 'lobby', room, players: new Set(), rats: new Map(), chests: new Map() };
    for (const f of FIELDS) room.areas[f.id] = { id: f.id, room, field: f, L: D.fieldLayout(f.id), players: new Set(), rats: new Map(), chests: new Map(), spawnT: 0, chestT: now() + 1000 * D.FIELD_R, out: { rs: [], rp: [], rg: [] } };
    G.rooms.set(code, room); return room;
  }
  G.makeRoom = makeRoom;
  function publicRoom() {
    let best = null; for (const r of G.rooms.values()) if (r.pub && r.players.size < ROOM_MAX && (!best || r.players.size > best.players.size)) best = r;
    return best || makeRoom(true);
  }
  const roomInfo = r => ({ code: r.code, pub: r.pub, name: r.name, n: r.players.size, max: ROOM_MAX, owner: r.owner });
  function pubView(s) { const P = s.P; return { id: P.id, n: P.name, ti: P.d.title || '', c: P.color, lvl: P.level, reb: P.rebirths, p: s.pos, h: s.h, a: s.anim, rod: P.d.rod, pets: [...P.rats.values()].filter(r => r.place === 'eq').map(PL.lookView) }; }
  function rosterOf(room) { return [...room.players].map(s => ({ id: s.P.id, n: s.P.name, ti: s.P.d.title || '', c: s.P.color, lvl: s.P.level, reb: s.P.rebirths, area: s.area ? s.area.id : 'lobby', vc: s.voice ? 1 : 0, sc: { theme: s.P.d.showcase.theme, rats: s.P.d.showcase.rats.map(id => s.P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.lookView(r), { id: r.id })) } })); }
  function sendRoster(room) { const m = { t: 'roster', room: roomInfo(room), l: rosterOf(room) }; for (const s of room.players) send(s, m); }
  G.sendRoster = sendRoster;
  function enterRoom(s, room) {
    if (s.room === room) return;
    if (s.room) leaveRoom(s, true);
    s.room = room; room.players.add(s); room.emptySince = 0;
    enterArea(s, 'lobby');
    send(s, { t: 'room', room: roomInfo(room) }); sendRoster(room);
  }
  function leaveRoom(s, quiet) {
    const room = s.room; if (!room) return;
    G.trade && G.trade.cancelFor(s, 'left the room');
    leaveArea(s); room.players.delete(s); s.room = null;
    if (!room.players.size) room.emptySince = now();
    if (!quiet || room.players.size) sendRoster(room);
  }
  function areaSnapshot(a, s) {
    const t = now();
    return { t: 'area', a: a.id, you: s.pos, players: [...a.players].filter(x => x !== s).map(pubView), rats: [...a.rats.values()].map(r => ratNet(r)), chests: [...a.chests.values()].map(chestNet), srv: t };
  }
  function enterArea(s, aid) {
    const a = s.room.areas[aid]; if (!a) return;
    leaveArea(s);
    const wasEmpty = !a.players.size;
    s.area = a; a.players.add(s); s.catching = null;
    const L = a.L; const sp = aid === 'lobby' ? [D.LOBBY.spawn[0] + rnd() * 4 - 2, 0, D.LOBBY.spawn[1] + rnd() * 3] : [L.spawn[0] + rnd() * 4 - 2, 0, L.spawn[1] + rnd() * 3];
    s.pos = sp; s.h = aid === 'lobby' ? Math.PI : 0; s.lastMv = now();
    if (a.field && a.rats.size < 6) for (let i = 0; i < 8; i++) spawnRat(a); // a field wakes up with some rats in it
    send(s, areaSnapshot(a, s));
    if (a.field && wasEmpty) { a.out.rs = []; a.out.rp = []; a.out.rg = []; }
    const pv = pubView(s); for (const o of a.players) if (o !== s) send(o, { t: 'pj', p: pv });
    if (a.field) { const P = s.P; if (!P.d.fieldsVisited[aid]) { P.d.fieldsVisited[aid] = 1; PL.questProgress(G, P, 'fieldsToday', 1); } }
  }
  function leaveArea(s) {
    const a = s.area; if (!a) return;
    if (s.catching) releaseCatch(s, false);
    a.players.delete(s); s.area = null;
    for (const o of a.players) send(o, { t: 'pl', id: s.P.id });
    if (a.field && !a.players.size) { a.rats.clear(); a.chests.clear(); } // empty fields sleep
  }

  // ---------- rats in the fields ----------
  const ratNet = r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, st: r.st, ax: +r.ax.toFixed(2), az: +r.az.toFixed(2), bx: +r.bx.toFixed(2), bz: +r.bz.toFixed(2), t0: r.t0, t1: r.t1, by: r.by || 0, ev: r.ev || 0 });
  const ratPos = (r, t) => { if (t >= r.t1 || r.t1 <= r.t0) return [r.bx, r.bz]; const k = (t - r.t0) / (r.t1 - r.t0); return [r.ax + (r.bx - r.ax) * k, r.az + (r.bz - r.az) * k]; };
  function luckRoller(a) { const ps = [...a.players]; return ps.length ? ps[(rnd() * ps.length) | 0] : null; }
  function spawnRat(a, forced) {
    const L = a.L, inv = G.events.invasion(), ev = G.events.effects(); let x, z, tries = 0;
    do { x = (rnd() * 2 - 1) * (L.R - 6); z = (rnd() * 2 - 1) * (L.R - 6); tries++; } while (tries < 40 && (D.blocked(L, x, z, 1.2) || [...a.players].some(s => Math.hypot(s.pos[0] - x, s.pos[2] - z) < 9)));
    if (tries >= 40) return null;
    const roller = luckRoller(a), luck = roller ? PL.luckOf(G, roller.P) : 1;
    let sp = forced && forced.sp, rid;
    if (!sp) {
      if (inv && rnd() < 0.5) { const list = D.SPECIES.filter(s => s.inv); sp = list[(rnd() * list.length) | 0].id; }
      else if (ev.secret && (a.id === 'omega' || a.id === 'secret') && rnd() < 0.004) { const list = D.SPECIES.filter(s => s.secret); sp = list[(rnd() * list.length) | 0].id; }
      else { const w = D.spawnWeights(G.cfg, a.id, luck, ev); rid = RARITIES[D.pickWeighted(w, rnd)].id; const list = D.speciesFor(rid, a.id); if (!list.length) return null; sp = list[(rnd() * list.length) | 0].id; }
    }
    const mp = roller && PL.eff(roller.P, 'mutation') ? PL.eff(roller.P, 'mutation').mult : 1;
    const m = forced && forced.muts ? forced.muts : D.rollMutations(G.cfg, ev, mp, rnd);
    const rr = RI[SP[sp].r], t = now();
    const r = { id: (++ratSeq).toString(36), sp, mut: m.mut || null, wx: m.wx || null, disco: m.disco ? 1 : 0, ax: x, az: z, bx: x, bz: z, t0: t, t1: t, idle: t + 500 + rnd() * 2000, st: 'w', dies: t + rr.life * 1000 * (forced ? 2 : 1) * (inv ? 1.3 : 1), ev: forced ? 1 : (SP[sp].inv ? 2 : 0) };
    a.rats.set(r.id, r); a.out.rs.push(ratNet(r));
    if (rr.i >= 7 && !forced) G.events.rareSpawn && G.events.rareSpawn(a, r);
    return r;
  }
  G.spawnRat = spawnRat;
  function moveRat(a, r, t, flee, from) {
    const L = a.L, [x, z] = ratPos(r, t); let bx = x, bz = z, ok = false;
    for (let i = 0; i < 12 && !ok; i++) {
      let ang = rnd() * Math.PI * 2; const d = flee ? 10 + rnd() * 6 : 5 + rnd() * 10;
      if (flee && from) ang = Math.atan2(x - from[0], z - from[2]) + (rnd() - 0.5) * 1.2;
      bx = x + Math.sin(ang) * d; bz = z + Math.cos(ang) * d;
      ok = !D.blocked(L, bx, bz, 1.0);
      if (ok) for (let k = 1; k < 4; k++) if (D.blocked(L, x + (bx - x) * k / 4, z + (bz - z) * k / 4, 0.6)) { ok = false; break; }
    }
    if (!ok) { bx = x; bz = z; }
    const spd = flee ? 7 : 1.4 + rnd() * 1.4 + RI[SP[r.sp].r].i * 0.12, dd = Math.hypot(bx - x, bz - z);
    r.ax = x; r.az = z; r.bx = bx; r.bz = bz; r.t0 = t; r.t1 = t + (dd / spd) * 1000; r.idle = r.t1 + (flee ? 300 : 700 + rnd() * 3200);
    a.out.rp.push([r.id, +x.toFixed(2), +z.toFixed(2), +bx.toFixed(2), +bz.toFixed(2), r.t0, Math.round(r.t1), r.st]);
  }
  function removeRatFromArea(a, r, why, by) { a.rats.delete(r.id); a.out.rg.push([r.id, why, by || 0]); }

  // ---------- catching ----------
  function rodOf(P) { const rod = ROD[P.d.rod] || ROD.wood; return Object.assign({}, rod, G.cfg.rods[rod.id] || {}); }
  function catchOdds(P, r) {
    const rod = rodOf(P), rr = RI[SP[r.sp].r], cp = PL.eff(P, 'catch');
    return Math.min(0.98, Math.max(0.05, rod.success - rr.diff + (cp ? 0.05 : 0) + (G.cfg.catchBonus || 0)));
  }
  function catchTime(P, r) { const rod = rodOf(P), rr = RI[SP[r.sp].r], cp = PL.eff(P, 'catch'); return rr.time / rod.speed / (cp ? cp.mult : 1); }
  function releaseCatch(s, flee) {
    const c = s.catching; s.catching = null; if (!c || !s.area) return;
    const r = s.area.rats.get(c.id); if (!r || r.st !== 'h' || r.by !== s.P.id) return;
    r.st = 'w'; r.by = 0; const t = now(); r.t0 = r.t1 = t; r.idle = t;
    if (flee) moveRat(s.area, r, t, true, s.pos); else s.area.out.rp.push([r.id, +r.bx.toFixed(2), +r.bz.toFixed(2), +r.bx.toFixed(2), +r.bz.toFixed(2), t, t, 'w']);
  }
  const H = {}; // message handlers: H[type](session, msg)
  H.cast = (s, m) => {
    const a = s.area, P = s.P; if (!a || !a.field) return;
    if (s.catching) return send(s, { t: 'castNo', why: 'You are already catching a rat.' });
    const r = a.rats.get(String(m.r)); if (!r || r.st !== 'w') return send(s, { t: 'castNo', why: 'That rat got away.', r: m.r });
    if (!PL.roomFor(G, P)) return send(s, { t: 'castNo', why: 'Your inventory and storage are full. Sell or store some rats first.' });
    const t = now(), [x, z] = ratPos(r, t), rod = rodOf(P);
    if (Math.hypot(x - s.pos[0], z - s.pos[2]) > rod.range + 4) return send(s, { t: 'castNo', why: 'Too far away. Get closer!', r: r.id });
    r.st = 'h'; r.by = P.id; r.ax = r.bx = x; r.az = r.bz = z; r.t0 = r.t1 = t;
    const dur = catchTime(P, r), p = catchOdds(P, r);
    s.catching = { id: r.id, start: t, dur };
    a.out.rp.push([r.id, +x.toFixed(2), +z.toFixed(2), +x.toFixed(2), +z.toFixed(2), t, t, 'h', P.id]);
    send(s, { t: 'castOk', r: r.id, dur, p });
  };
  H.uncast = s => { if (s.catching) { releaseCatch(s, true); send(s, { t: 'miss', why: 'The line snapped!' }); } };
  H.reel = (s, m) => {
    const c = s.catching, a = s.area, P = s.P; if (!c || !a || String(m.r) !== c.id) return;
    const t = now(); if (t < c.start + c.dur * 1000 - 400) return send(s, { t: 'castNo', why: 'Keep reeling!' });
    const r = a.rats.get(c.id); s.catching = null; if (!r || r.st !== 'h' || r.by !== P.id) return send(s, { t: 'miss', why: 'It got away.' });
    if (rnd() < catchOdds(P, r)) {
      const rat = G.db.tx(() => {
        const got = PL.giveRat(G, P, { sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco }, 'catch');
        if (!got) return null;
        P.caught++; const rr = RI[SP[r.sp].r]; PL.bump(G, P, 'caught');
        if (rr.i >= 2) PL.bump(G, P, 'caughtRare');
        if (r.mut || r.wx || r.disco) PL.bump(G, P, 'mutCaught');
        PL.addXP(G, P, rr.xp * (r.mut ? 2 : 1));
        PL.checkAch(G, P); PL.save(G, P); return got;
      });
      if (!rat) { r.st = 'w'; r.by = 0; moveRat(a, r, t, true, s.pos); return send(s, { t: 'miss', why: 'No room for it! Your inventory and storage are full.' }); }
      removeRatFromArea(a, r, 'caught', P.id);
      send(s, { t: 'got', rat: PL.ratView(rat), xp: RI[SP[r.sp].r].xp });
      G.sendRats(P, [rat]);
      if (RI[SP[r.sp].r].i >= 7) G.events.announce({ kind: 'rare', text: P.name + ' caught ' + D.ratName(rat) + '!', col: RI[SP[r.sp].r].col, dur: 8 });
    } else {
      r.st = 'w'; r.by = 0; moveRat(a, r, t, true, s.pos);
      send(s, { t: 'miss', why: 'It got away!' });
    }
  };

  // ---------- movement and travel ----------
  H.mv = (s, m) => {
    if (!s.area || !Array.isArray(m.p)) return;
    const t = now(), dt = Math.max(0.05, (t - (s.lastMv || t)) / 1000), x = +m.p[0], y = +m.p[1], z = +m.p[2];
    if (![x, y, z].every(Number.isFinite)) return;
    const sp = PL.eff(s.P, 'speed') ? 1.5 : 1, maxd = 13 * sp * dt + 3, d = Math.hypot(x - s.pos[0], z - s.pos[2]), lim = s.area.id === 'lobby' ? D.LOBBY.R + 2 : D.FIELD_R + 1;
    if (d > maxd || Math.abs(x) > lim || Math.abs(z) > lim) { send(s, { t: 'pos', p: s.pos }); return; } // too fast: put them back
    s.pos = [x, Math.max(-50, Math.min(200, y)), z]; s.h = +m.h || 0; s.anim = (m.a | 0) & 15; s.lastMv = t; s.moved = true;
  };
  H.go = (s, m) => {
    const aid = String(m.a || ''); if (!s.room || !s.room.areas[aid] || (s.area && s.area.id === aid)) return;
    const f = FI[aid]; if (f && !D.canEnter(f, s.P.level, s.P.rebirths)) return send(s, { t: 'err', text: D.lockText(f) });
    G.trade && G.trade.cancelFor(s, 'left the lobby');
    enterArea(s, aid); sendRoster(s.room);
  };

  // ---------- chests ----------
  const chestNet = c => ({ id: c.id, x: +c.x.toFixed(2), z: +c.z.toFixed(2), k: c.k });
  function spawnChest(a) {
    let x, z, tries = 0; do { x = (rnd() * 2 - 1) * (a.L.R - 8); z = (rnd() * 2 - 1) * (a.L.R - 8); } while (++tries < 40 && D.blocked(a.L, x, z, 2));
    if (tries >= 40) return;
    const c = { id: 'c' + (++chestSeq).toString(36), x, z, k: a.field.i < 3 ? 0 : a.field.i < 6 ? 1 : 2, dies: now() + 180000 };
    a.chests.set(c.id, c); for (const s of a.players) send(s, { t: 'chs', c: chestNet(c) });
  }
  H.chest = (s, m) => {
    const a = s.area; if (!a || !a.field) return; const c = a.chests.get(String(m.id)); if (!c) return send(s, { t: 'err', text: 'Someone already opened that chest.' });
    if (Math.hypot(c.x - s.pos[0], c.z - s.pos[2]) > 5) return send(s, { t: 'err', text: 'Walk up to the chest to open it.' });
    a.chests.delete(c.id); for (const o of a.players) send(o, { t: 'chg', id: c.id, by: s.P.id });
    const P = s.P, fi = a.field.i, roll = rnd(), rw = {}; const ev = G.events.active().length > 0;
    const base = Math.round(Math.max(500, PL.mps(G, P, false).total * 120) * (1 + fi * 0.6) * (c.k + 1));
    if (roll < 0.40) rw.money = base;
    else if (roll < 0.65) { rw.potion = D.POTIONS[(rnd() * D.POTIONS.length) | 0].id; rw.money = Math.round(base / 3); }
    else if (roll < 0.80) { rw.egg = fi >= 4 && rnd() < 0.4 ? 'egg5' : 'egg2'; }
    else if (roll < 0.90) rw.mystery = 1;
    else if (roll < 0.96) { const list = D.COSMETICS.filter(x => x.src === 'shop' && (G.cfg.cosPrices[x.id] || 0) < 5e6); rw.cos = list[(rnd() * list.length) | 0].id; }
    else { const next = D.RODS.find(r => !P.d.rods.includes(r.id) && r.i <= 2 + Math.floor(fi / 2)); if (next) rw.rod = next.id; else rw.money = base * 3; }
    if (ev) rw.tokens = 2 + c.k * 2;
    G.db.tx(() => { const got = PL.grant(G, P, rw, 'Treasure chest!'); PL.bump(G, P, 'chests'); PL.checkAch(G, P); PL.save(G, P); send(s, { t: 'chestOpen', id: c.id, got, k: c.k }); });
  };

  // ---------- the world tick (10 times a second) ----------
  let lastEcon = now(), lastSave = now(), lastRatXp = now(), lastDev = 0;
  function tick() {
    const t = now();
    for (const room of G.rooms.values()) {
      if (!room.players.size && room.emptySince && t - room.emptySince > 60000 && G.rooms.size > 1 && !(room.pub && [...G.rooms.values()].filter(r => r.pub).length === 1)) { G.rooms.delete(room.code); continue; }
      for (const aid in room.areas) {
        const a = room.areas[aid]; if (!a.players.size) continue;
        if (a.field) {
          const inv = G.events.invasion(), max = Math.round(G.cfg.maxRatsPerField * (inv ? 2.5 : 1)), every = G.cfg.spawnEvery * 1000 / (inv ? 3 : 1);
          if (a.rats.size < max && t - a.spawnT > every) { a.spawnT = t; spawnRat(a); }
          for (const r of a.rats.values()) {
            if (r.st === 'h') { const s = [...a.players].find(x => x.P.id === r.by); if (!s || !s.catching || t > s.catching.start + s.catching.dur * 1000 + 15000) { if (s) { s.catching = null; send(s, { t: 'miss', why: 'It wriggled free.' }); } r.st = 'w'; r.by = 0; r.idle = t; } continue; }
            if (t > r.dies && t >= r.t1) { removeRatFromArea(a, r, 'gone'); continue; }
            if (r.st === 'f' && t >= r.t1) r.st = 'w';
            if (t >= r.idle) moveRat(a, r, t, false);
          }
          for (const c of a.chests.values()) if (t > c.dies) { a.chests.delete(c.id); for (const s of a.players) send(s, { t: 'chg', id: c.id }); }
          if (t > a.chestT) { a.chestT = t + 1000 * (G.cfg.chestEvery[0] + rnd() * (G.cfg.chestEvery[1] - G.cfg.chestEvery[0])); if (a.chests.size < G.cfg.maxChests) spawnChest(a); }
          const o = a.out;
          if (o.rs.length || o.rp.length || o.rg.length) { const msg = JSON.stringify({ t: 'rw', rs: o.rs, rp: o.rp, rg: o.rg, srv: t }); for (const s of a.players) s.ws.send(msg); o.rs = []; o.rp = []; o.rg = []; }
        }
        // other players' positions
        const moved = [...a.players].filter(s => s.moved);
        if (moved.length) { const l = moved.map(s => [s.P.id, +s.pos[0].toFixed(2), +s.pos[1].toFixed(2), +s.pos[2].toFixed(2), +s.h.toFixed(2), s.anim | 0]); moved.forEach(s => { s.moved = false; }); const msg = JSON.stringify({ t: 'pm', l }); for (const s of a.players) s.ws.send(msg); }
      }
    }
    if (t - lastEcon >= 1000) { const dt = Math.min(5, (t - lastEcon) / 1000); lastEcon = t; econ(dt, t); }
    if (t - lastSave >= 5000) { lastSave = t; saveAll(false); }
    if (G.devSaves && t - lastDev >= 8000) { lastDev = t; devPush(); }
    if (t - lastRatXp >= 30000) { lastRatXp = t; saveRatXp(); }
    G.events.tick(t);
  }
  // money and rat XP every second
  function econ(dt, t) {
    for (const s of G.sessions) {
      const P = s.P; if (!P) continue;
      const m = PL.mps(G, P, true).total; if (m > 0) PL.addMoney(G, P, m * dt, true);
      for (const cat in P.d.eff) if (P.d.eff[cat].ends <= t) { const e = P.d.eff[cat]; delete P.d.eff[cat]; G.toast(P, { kind: 'potion', text: (POT[e.id] ? POT[e.id].n : 'Potion') + ' wore off.' }); G.sync(P); }
      const lv = []; for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') if (ratXp(P, r, dt)) lv.push(r);
      if (lv.length) { G.db.tx(() => { for (const r of lv) PL.saveRat(G, P, r); }); G.sendRats(P, lv); }
      send(s, { t: 'money', m: P.money, mps: m });
      if (P.d.stats.peakMoney >= 1e6 && !P.d.ach.rich || P.d.stats.peakMoney >= 1e9 && !P.d.ach.billion) PL.checkAch(G, P);
    }
  }
  function ratXp(P, r, amt) {
    if (r.lvl >= r.cap) { r.xp = 0; return false; }
    r.xp += amt; let up = false;
    while (r.lvl < r.cap && r.xp >= D.ratXpNeed(r.lvl)) { r.xp -= D.ratXpNeed(r.lvl); r.lvl++; up = true; PL.bump(G, P, 'ratLevels'); if ([10, 25, 50, 75, 100].includes(r.lvl)) G.toast(P, { kind: 'ratlvl', text: SP[r.sp].n + ' reached level ' + r.lvl + '!', rat: r.id }); }
    if (r.lvl >= r.cap) r.xp = 0;
    return up;
  }
  G.ratXp = ratXp;
  function saveRatXp() { for (const s of G.sessions) if (s.P) { const P = s.P; G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); }); } }
  function saveAll(force) { G.db.tx(() => { for (const s of G.sessions) if (s.P && (s.P.dirty || force)) PL.save(G, s.P); }); }
  G.saveAll = saveAll;

  // ---------- accounts ----------
  const validName = n => typeof n === 'string' && /^[A-Za-z0-9_ ]{3,16}$/.test(n.trim()) && !/^ | $|  /.test(n.trim());
  function passHash(pass, salt) { return crypto.scryptSync(String(pass), salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex'); }
  function issueToken(acc) { const tok = crypto.randomBytes(32).toString('hex'); G.db.st.accToken.run(hash(tok), now(), acc.id); return tok; }
  function register(s, m) {
    const name = String(m.name || '').trim();
    if (!validName(name)) return send(s, { t: 'authErr', text: 'Names are 3 to 16 letters, numbers or spaces.' });
    if (G.db.st.accByName.get(name)) return send(s, { t: 'authErr', text: 'That name is taken. Try another one.' });
    let ph = null, salt = null; if (m.pass) { if (String(m.pass).length < 4) return send(s, { t: 'authErr', text: 'Passwords need at least 4 characters.' }); salt = crypto.randomBytes(16).toString('hex'); ph = passHash(m.pass, salt); }
    const tok = crypto.randomBytes(32).toString('hex'), t = now();
    const col = ['#ff9f1a', '#45b0ff', '#5fdc6a', '#ff5c8a', '#b876ff', '#ffcf3a', '#2fd8c0'][(rnd() * 7) | 0];
    let id; G.db.tx(() => { const r = G.db.st.accInsert.run(name, ph, salt, hash(tok), t, t); id = Number(r.lastInsertRowid); G.db.st.plInsert.run(id, 0, JSON.stringify(PL.newData()), 0, col); });
    login(s, G.db.st.accById.get(id), tok);
  }
  function loginPass(s, m) {
    const acc = G.db.st.accByName.get(String(m.name || '').trim());
    if (!acc || !acc.pass_hash) return send(s, { t: 'authErr', text: acc ? 'That player has no password yet. Log in on your first device and set one in Settings.' : 'No player with that name.' });
    if (s.fails > 6) return send(s, { t: 'authErr', text: 'Too many tries. Wait a minute.' });
    const ok = crypto.timingSafeEqual(Buffer.from(passHash(m.pass || '', acc.pass_salt), 'hex'), Buffer.from(acc.pass_hash, 'hex'));
    if (!ok) { s.fails = (s.fails || 0) + 1; return send(s, { t: 'authErr', text: 'Wrong password.' }); }
    login(s, acc, issueToken(acc));
  }
  function login(s, acc, tok) {
    if (acc.banned) return send(s, { t: 'authErr', text: 'This player is banned from the server.' });
    const old = G.byPlayer.get(acc.id);
    if (old && old !== s) { send(old, { t: 'kicked', text: 'You logged in somewhere else.' }); drop(old); old.ws.close(4000, 'replaced'); }
    const P = PL.load(G, acc); if (!P) return send(s, { t: 'authErr', text: 'Could not load your save.' });
    P.hasPass = !!acc.pass_hash;
    s.P = P; P.online = true; G.byPlayer.set(P.id, s);
    // offline earnings: 10% of what the money slots would have made, from the server's clock only
    let offline = null; const t = now(), lastSeen = P.last_seen;
    if (P.last_seen > 0) {
      const secs = Math.min((t - P.last_seen) / 1000, G.cfg.offlineMaxHours * 3600);
      if (secs > 60) {
        const base = PL.mps(G, P, false).total, e = P.d.eff.money; let extra = 0;
        if (e && e.ends > P.last_seen) extra = base * (e.mult - 1) * Math.min(secs, (e.ends - P.last_seen) / 1000);
        const amt = G.cfg.offlineRate * (base * secs + extra);
        const lv = []; for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') if (ratXp(P, r, secs * G.cfg.offlineRate)) lv.push(r);
        G.db.tx(() => { if (amt > 0) PL.addMoney(G, P, amt, true); for (const r of lv) PL.saveRat(G, P, r); P.last_seen = t; PL.save(G, P); });
        offline = { secs: Math.round(secs), amt, rate: G.cfg.offlineRate, capped: (t - lastSeen) / 1000 > G.cfg.offlineMaxHours * 3600, away: Math.round((t - lastSeen) / 1000), maxH: G.cfg.offlineMaxHours };
      }
    }
    P.last_seen = t; PL.ensureQuests(G, P); PL.checkAch(G, P); PL.save(G, P);
    send(s, { t: 'welcome', token: tok || undefined, you: PL.view(G, P), cfg: G.publicCfg(), srv: t, events: G.events.state(), ann: G.events.recent(), offline });
    let room = null; if (s.want && G.rooms.has(s.want) && G.rooms.get(s.want).players.size < ROOM_MAX) room = G.rooms.get(s.want);
    enterRoom(s, room || publicRoom());
  }
  function drop(s) {
    if (!s.P) return;
    const P = s.P;
    G.trade && G.trade.cancelFor(s, 'disconnected');
    leaveRoom(s);
    P.online = false; P.last_seen = now();
    try { G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); PL.save(G, P); }); } catch (e) { console.error('save on leave failed', e); }
    if (G.byPlayer.get(P.id) === s) G.byPlayer.delete(P.id);
    s.P = null;
  }

  // ---------- device saves (a free host that forgets everything on restart) ----------
  // The player's device brings its save; the server hands it back every few seconds and the device keeps it.
  G.sid = crypto.randomBytes(6).toString('hex'); const devN = new Map();
  function devLogin(s, m) {
    const dev = String(m.dev || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    if (dev.length < 6) return send(s, { t: 'authErr', text: 'This device has no player code yet. Reload the game.' });
    const b = SAVES.clean(m.blob); if (!b) return send(s, { t: 'authErr', text: 'Your save could not be read.' });
    const sy = m.sync && typeof m.sync === 'object' ? m.sync : null;
    let id = G.db.kvGet('dev:' + dev), acc = id && G.db.st.accById.get(id);
    // the server's copy is newer when this device missed some of this server's saves and has not played since
    const keep = acc && sy && sy.sid === G.sid && (devN.get(id) || 0) > (sy.n | 0);
    const old = acc && G.byPlayer.get(id); if (old && old !== s) { send(old, { t: 'kicked', text: 'You opened the game somewhere else.' }); drop(old); old.ws.close(4000, 'replaced'); }
    try {
      G.db.tx(() => {
        const base = validName(b.name) ? b.name.trim() : 'Catcher ' + dev.slice(0, 3); let n = base, i = 2;
        for (;;) { const o = G.db.st.accByName.get(n); if (!o || (acc && o.id === acc.id)) break; n = base.slice(0, 13) + ' ' + i++; }
        if (!acc) { const t = now(); const r = G.db.st.accInsert.run(n, null, null, '', t, t); id = Number(r.lastInsertRowid); G.db.kvSet('dev:' + dev, id); acc = G.db.st.accById.get(id); }
        if (!keep) SAVES.writeAcc(G, id, b);
      });
    } catch (e) { console.error('device save', e); return send(s, { t: 'authErr', text: 'Your save could not be loaded on the server.' }); }
    s.dev = dev; acc = G.db.st.accById.get(id);
    login(s, acc, null);
    if (s.P) devSend(s);
  }
  function devSend(s) {
    const P = s.P; if (!P) return;
    G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); PL.save(G, P); });
    const blob = SAVES.exportAcc(G, P.id); if (!blob) return;
    const n = (devN.get(P.id) || 0) + 1; devNSet(P.id, n);
    send(s, { t: 'save', blob, sync: { sid: G.sid, n } });
  }
  const devNSet = (id, n) => devN.set(id, n);
  function devPush() { for (const s of G.sessions) if (s.dev && s.P) { try { devSend(s); } catch (e) { console.error('device save push', e); } } }
  G.devSend = devSend;

  // ---------- connections ----------
  G.onConnection = ws => {
    const s = { id: ++sid, ws, P: null, room: null, area: null, pos: [0, 0, 0], h: 0, anim: 0, tokens: 60, last: now(), catching: null };
    G.sessions.add(s);
    ws.on('message', raw => {
      const t = now(); s.tokens = Math.min(80, s.tokens + (t - s.last) / 1000 * 40); s.last = t;
      if (--s.tokens < 0) { if (s.tokens < -200) ws.close(4008, 'slow down'); return; }
      let m; try { m = JSON.parse(raw); } catch (e) { return; }
      if (!m || typeof m.t !== 'string') return;
      try { handle(s, m); } catch (e) { console.error('handler', m.t, e); send(s, { t: 'err', text: 'Something went wrong on the server.' }); }
    });
    ws.on('close', () => { drop(s); G.sessions.delete(s); });
  };
  function handle(s, m) {
    if (m.t === 'ping') return send(s, { t: 'pong', c: m.c, s: now() });
    if (!s.P) {
      if (m.t === 'hello') {
        if (m.room) s.want = String(m.room).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (G.devSaves && m.blob) return devLogin(s, m);
        if (m.token) { const acc = G.db.st.accByToken.get(hash(m.token)); if (acc) return login(s, acc, null); }
        return send(s, { t: 'auth' });
      }
      if (m.t === 'register') return register(s, m);
      if (m.t === 'login') return loginPass(s, m);
      return;
    }
    const f = H[m.t] || (G.trade && G.trade.H[m.t]); if (f) f(s, m);
  }
  G.H = H;

  // ---------- chat: text for everyone in the room, and voice-chat signaling between players ----------
  // The filter hides swear words, links, e-mail addresses and phone numbers (players are often kids).
  const BAD = /\b(f+u+c+k+\w*|sh+i+t+\w*|b+i+t+c+h+\w*|c+u+n+t+\w*|d+i+c+k+s?|p+u+s+s+y+|a+s+s+h+o+l+e+s?|bastard\w*|wh+o+r+e+s?|sl+u+t+s?|n+i+g+g+\w*|f+a+g+\w*|retard\w*|k+y+s+|porn\w*|sex+y?|nudes?|rape\w*)\b/gi;
  function cleanChat(t) {
    t = String(t || '').replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
    t = t.replace(/\b(https?:\/\/|www\.)\S+/gi, '***').replace(/\b\S+\.(com|net|org|gg|io|co|me|tv|xyz|ly)(\/\S*)?\b/gi, '***').replace(/\S+@\S+\.\S+/g, '***').replace(/(\+?\d[\d\s().-]{7,}\d)/g, '***');
    return t.replace(BAD, w => w[0] + '*'.repeat(w.length - 1));
  }
  H.chat = (s, m) => {
    if (!s.room) return; const t = now(); s.chatT = (s.chatT || []).filter(x => t - x < 10000);
    if (s.chatT.length >= 5) return send(s, { t: 'err', text: 'Slow down a little before chatting again.' });
    const x = cleanChat(m.x); if (!x) return; s.chatT.push(t);
    const msg = { t: 'chat', id: s.P.id, n: s.P.name, c: s.P.color, x, at: t };
    for (const o of s.room.players) send(o, msg);
  };
  H.voice = (s, m) => { const v = m.on ? 1 : 0; if (!!s.voice === !!v) return; s.voice = v; if (s.room) sendRoster(s.room); };
  H.vsig = (s, m) => {
    if (!s.room || !s.voice || typeof m.d !== 'object' || !m.d) return;
    const raw = JSON.stringify(m.d); if (raw.length > 12000) return;
    const o = [...s.room.players].find(x => x.P && x.P.id === (m.to | 0)); if (!o || o === s || !o.voice) return;
    send(o, { t: 'vsig', from: s.P.id, d: m.d });
  };

  // ---------- rooms ----------
  H.rooms = s => send(s, { t: 'roomList', l: [...G.rooms.values()].filter(r => r.pub).map(roomInfo) });
  H.mkroom = (s, m) => { const r = makeRoom(!!m.pub, s.P.id, m.pub ? s.P.name + "'s room" : s.P.name + "'s private room"); enterRoom(s, r); send(s, { t: 'toast', kind: 'room', text: 'Room created. Code: ' + r.code }); };
  H.join = (s, m) => {
    const code = String(m.code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), r = G.rooms.get(code);
    if (!r) return send(s, { t: 'err', text: 'No room with the code ' + code + '.' });
    if (r === s.room) return send(s, { t: 'err', text: 'You are already in that room.' });
    if (r.players.size >= ROOM_MAX) return send(s, { t: 'err', text: 'That room is full (20 players).' });
    enterRoom(s, r);
  };
  H.joinPub = s => { let best = null; for (const r of G.rooms.values()) if (r.pub && r !== s.room && r.players.size < ROOM_MAX && (!best || r.players.size > best.players.size)) best = r; enterRoom(s, best || makeRoom(true)); };
  H.invite = (s, m) => {
    const o = [...G.sessions].find(x => x.P && x.P.name.toLowerCase() === String(m.name || '').trim().toLowerCase());
    if (!o) return send(s, { t: 'err', text: 'That player is not online right now.' });
    if (o === s) return; if (o.room === s.room) return send(s, { t: 'err', text: o.P.name + ' is already in your room.' });
    send(o, { t: 'invited', from: s.P.name, code: s.room.code, priv: !s.room.pub }); send(s, { t: 'toast', kind: 'room', text: 'Invite sent to ' + o.P.name + '.' });
  };

  // ---------- inventory ----------
  const own = (s, id) => s.P.rats.get(String(id || ''));
  function busyInTrade(s, r) { return G.trade && G.trade.holds(s, r.id); }
  H.fav = (s, m) => { const r = own(s, m.id); if (!r) return; r.fav = m.v ? 1 : 0; PL.saveRat(G, s.P, r); G.sendRats(s.P, [r]); };
  H.lock = (s, m) => {
    const r = own(s, m.id); if (!r) return;
    if (!m.v && r.lock && RI[SP[r.sp].r].i >= 4 && !m.confirm) return send(s, { t: 'confirm', what: 'unlock', id: r.id, text: 'Unlock ' + D.ratName(r) + '? Unlocked rats can be sold, traded and evolved.' });
    r.lock = m.v ? 1 : 0; PL.saveRat(G, s.P, r); G.sendRats(s.P, [r]);
  };
  H.sell = (s, m) => {
    const P = s.P, ids = Array.isArray(m.ids) ? m.ids.slice(0, 300) : [m.id], list = ids.map(id => own(s, id)).filter(Boolean);
    if (!list.length) return;
    if (list.some(r => r.lock)) return send(s, { t: 'err', text: 'Locked rats can’t be sold. Unlock them first.' });
    if (list.some(r => busyInTrade(s, r))) return send(s, { t: 'err', text: 'One of those rats is in a trade.' });
    const favs = list.filter(r => r.fav); if (favs.length && !m.confirmFav) return send(s, { t: 'confirm', what: 'sellfav', ids: list.map(r => r.id), text: 'Sell ' + favs.length + ' favorite rat' + (favs.length > 1 ? 's' : '') + '? Favorites are usually rats you want to keep.' });
    let total = 0;
    G.db.tx(() => { for (const r of list) { total += D.sellPrice(G.cfg, r); PL.removeRat(G, P, r); } PL.addMoney(G, P, total, false); PL.bump(G, P, 'sold', list.length); PL.save(G, P); });
    send(s, { t: 'sold', n: list.length, money: total }); G.sendRats(P, [], list.map(r => r.id));
  };
  function moveTo(s, r, place, slot) {
    const P = s.P, c = PL.cap(G, P);
    if (busyInTrade(s, r)) return 'That rat is in a trade.';
    if (place === 'inv' && r.place !== 'inv' && PL.countPlace(P, 'inv') >= c.inv) return 'Your inventory is full.';
    if (place === 'sto' && r.place !== 'sto' && PL.countPlace(P, 'sto') >= c.storage) return 'Your storage is full. Upgrade it in the shop.';
    if (place === 'eq' && r.place !== 'eq' && PL.countPlace(P, 'eq') >= c.equip) return 'You can equip ' + c.equip + ' rat' + (c.equip > 1 ? 's' : '') + '. Unequip one first.';
    if (place === 'slot') {
      if (slot == null || slot < 0 || slot >= c.slots) return 'That money slot is locked.';
      const other = [...P.rats.values()].find(x => x.place === 'slot' && x.slot === slot);
      if (other && other !== r) { other.place = r.place === 'slot' ? 'inv' : (r.place || 'inv'); other.slot = -1; if (other.place === 'inv' && PL.countPlace(P, 'inv') >= c.inv) other.place = 'sto'; PL.saveRat(G, P, other); }
    }
    r.place = place; r.slot = place === 'slot' ? slot : -1; PL.saveRat(G, P, r); return null;
  }
  const placeH = (place) => (s, m) => {
    const r = own(s, m.id); if (!r) return;
    const before = [...s.P.rats.values()].filter(x => x.place === 'slot').map(x => x.id);
    const err = G.db.tx(() => moveTo(s, r, place, m.slot == null ? null : m.slot | 0)); if (err) return send(s, { t: 'err', text: err });
    const changed = [r, ...before.map(id => s.P.rats.get(id)).filter(x => x && x !== r && x.place !== 'slot')];
    G.sendRats(s.P, changed); if (place === 'eq' || r.place === 'eq' || changed.some(x => x.place === 'eq')) petsChanged(s);
  };
  H.store = placeH('sto'); H.unstore = placeH('inv'); H.slot = placeH('slot'); H.unslot = placeH('inv'); H.equip = placeH('eq'); H.unequip = (s, m) => { placeH('inv')(s, m); petsChanged(s); };
  function petsChanged(s) { if (!s.area) return; const pv = pubView(s); for (const o of s.area.players) send(o, { t: 'pu', p: pv }); }
  G.petsChanged = petsChanged;

  // ---------- shop ----------
  function pay(P, price) { if (!(price >= 0) || P.money < price) return false; P.money -= price; P.dirty = true; return true; }
  H.buy = (s, m) => {
    const P = s.P, cfg = G.cfg, kind = String(m.kind || ''), id = String(m.id || ''), n = Math.max(1, Math.min(99, m.n | 0 || 1));
    const fail = text => send(s, { t: 'err', text });
    const done = (text, extra) => { PL.save(G, P); G.sync(P); send(s, Object.assign({ t: 'bought', kind, id, text }, extra || {})); };
    G.db.tx(() => {
      if (kind === 'rod') { const r = D.ROD[id]; if (!r) return fail('Unknown rod.'); if (P.d.rods.includes(id)) return fail('You already own the ' + r.n + '.'); if (!pay(P, cfg.rods[id].price)) return fail('Not enough money.'); P.d.rods.push(id); P.d.rod = id; return done('You bought the ' + r.n + '!'); }
      if (kind === 'potion') { const p = POT[id]; if (!p) return fail('Unknown potion.'); if (!pay(P, cfg.potions[id].price * n)) return fail('Not enough money.'); P.d.potions[id] = (P.d.potions[id] || 0) + n; return done('You bought ' + n + 'x ' + p.n + '.'); }
      if (kind === 'slot') { const c = PL.cap(G, P); if (c.slots >= cfg.maxSlots) return fail('All 12 money slots are unlocked.'); if (!pay(P, D.slotPrice(cfg, c.slots))) return fail('Not enough money.'); P.d.slots++; return done('Money slot ' + (c.slots + 1) + ' unlocked!'); }
      if (kind === 'storage') { const c = PL.cap(G, P); if (c.storage >= cfg.maxStorage) return fail('Storage is as big as it gets.'); if (!pay(P, D.storagePrice(cfg, c.storage))) return fail('Not enough money.'); P.d.storage++; return done('Storage upgraded to ' + (c.storage + cfg.storageStep) + ' spaces.'); }
      if (kind === 'inv') { const c = PL.cap(G, P); if (c.inv >= cfg.maxInventory) return fail('Your inventory is as big as it gets.'); if (!pay(P, D.inventoryPrice(cfg, c.inv))) return fail('Not enough money.'); P.d.inv++; return done('Inventory upgraded to ' + (c.inv + cfg.inventoryStep) + ' spaces.'); }
      if (kind === 'equip') { const c = PL.cap(G, P); if (c.equip >= cfg.maxEquip) return fail('You can already equip ' + cfg.maxEquip + ' rats.'); if (!pay(P, cfg.equipPrices[c.equip - cfg.startEquip])) return fail('Not enough money.'); P.d.equip++; return done('You can now equip ' + (c.equip + 1) + ' rats.'); }
      if (kind === 'cos') { const c = COS[id], price = cfg.cosPrices[id]; if (!c || !price) return fail('That cosmetic is not for sale.'); if (c.src === 'promo' && !(cfg.promo.on && cfg.promo.items.includes(id) && (!cfg.promo.ends || cfg.promo.ends > now()))) return fail('That promotion has ended.'); if (!pay(P, price)) return fail('Not enough money.'); P.d.cos[id] = (P.d.cos[id] || 0) + 1; return done('You bought ' + c.n + '!'); }
      if (kind === 'tokens') { const c = COS[id]; if (!c || !c.tokens) return fail('Not in the event shop.'); if (P.d.tokens < c.tokens) return fail('Not enough event tokens.'); P.d.tokens -= c.tokens; P.d.cos[id] = (P.d.cos[id] || 0) + 1; return done('You got ' + c.n + '!'); }
      if (kind === 'mystery') { if (!pay(P, cfg.mysteryPrice * n)) return fail('Not enough money.'); P.d.boxes += n; return done('You bought ' + n + ' Mystery Box' + (n > 1 ? 'es' : '') + '.'); }
      if (kind === 'snack') { if (!pay(P, snackPrice(P) * n)) return fail('Not enough money.'); P.d.snacks += n; return done('You bought ' + n + ' Rat Snack' + (n > 1 ? 's' : '') + '.'); }
      if (kind === 'egg') { const e = EGG[id]; if (!e) return fail('Unknown egg.'); if (e.limited && !ltdOn()) return fail('The Limited-Time Egg is not available right now.'); if (!PL.roomFor(G, P)) return fail('No room for a new rat. Sell or store some first.'); if (!pay(P, cfg.eggs[id].price)) return fail('Not enough money.'); const rat = hatch(s, id); if (!rat) throw new Error('hatch failed'); return done(null, { rat: PL.ratView(rat) }); }
      return fail('That is not for sale.');
    });
  };
  const snackPrice = P => Math.round(Math.max(500, PL.mps(G, P, false).total * 20));
  G.snackPrice = snackPrice;
  const ltdOn = () => G.cfg.ltdEgg.on && (!G.cfg.ltdEgg.ends || G.cfg.ltdEgg.ends > now());
  G.ltdOn = ltdOn;
  function hatch(s, eggId) { // inside a transaction
    const P = s.P, odds = G.cfg.eggs[eggId].odds, keys = Object.keys(odds), w = keys.map(k => +odds[k] || 0);
    const rid = keys[D.pickWeighted(w, rnd)], list = D.speciesFor(rid, null, { secret: true }); if (!list.length) return null;
    const sp = list[(rnd() * list.length) | 0].id, mp = PL.eff(P, 'mutation') ? PL.eff(P, 'mutation').mult : 1;
    const m = D.rollMutations(G.cfg, G.events.effects(), mp, rnd);
    const rat = PL.giveRat(G, P, { sp, mut: m.mut, wx: m.wx, disco: m.disco }, 'egg:' + eggId); if (!rat) return null;
    PL.bump(G, P, 'eggs'); PL.checkAch(G, P);
    G.sendRats(P, [rat]);
    if (RI[SP[sp].r].i >= 8) G.events.announce({ kind: 'rare', text: P.name + ' hatched ' + D.ratName(rat) + ' from a ' + EGG[eggId].n + '!', col: RI[SP[sp].r].col, dur: 8 });
    return rat;
  }
  H.hatch = (s, m) => { // eggs from rewards
    const P = s.P, id = String(m.id || ''); if (!EGG[id] || !(P.d.eggs[id] > 0)) return send(s, { t: 'err', text: 'You don’t have that egg.' });
    if (!PL.roomFor(G, P)) return send(s, { t: 'err', text: 'No room for a new rat. Sell or store some first.' });
    G.db.tx(() => { P.d.eggs[id]--; const rat = hatch(s, id); if (!rat) throw new Error('hatch failed'); PL.save(G, P); G.sync(P); send(s, { t: 'bought', kind: 'egg', id, rat: PL.ratView(rat) }); });
  };
  H.box = s => { // open a mystery box
    const P = s.P; if (!(P.d.boxes > 0)) return send(s, { t: 'err', text: 'You have no Mystery Boxes.' });
    const k = D.MYSTERY.table[D.pickWeighted(D.MYSTERY.table.map(x => x[1]), rnd)][0], rw = {};
    if (k === 'money') rw.money = Math.round(Math.max(20000, PL.mps(G, P, false).total * 400));
    if (k === 'potion') rw.potion = D.POTIONS[(rnd() * D.POTIONS.length) | 0].id;
    if (k === 'egg2' || k === 'egg5') rw.egg = k;
    if (k === 'cosmetic') { const list = D.COSMETICS.filter(c => c.src === 'shop'); rw.cos = list[(rnd() * list.length) | 0].id; }
    if (k === 'rod') { const owned = Math.max(...P.d.rods.map(r => D.ROD[r].i)); const up = D.RODS[Math.min(D.RODS.length - 1, owned + 1 + (rnd() < 0.15 ? 1 : 0))]; if (P.d.rods.includes(up.id)) rw.money = Math.round(Math.max(50000, PL.mps(G, P, false).total * 900)); else rw.rod = up.id; }
    G.db.tx(() => { P.d.boxes--; const got = PL.grant(G, P, rw, null); PL.save(G, P); G.sync(P); send(s, { t: 'boxOpen', k, got }); });
  };
  H.rodEq = (s, m) => { const P = s.P; if (!P.d.rods.includes(m.id)) return; P.d.rod = m.id; P.dirty = true; G.sync(P); petsChanged(s); };
  H.drink = (s, m) => {
    const P = s.P, p = POT[m.id]; if (!p || !(P.d.potions[p.id] > 0)) return send(s, { t: 'err', text: 'You don’t have that potion.' });
    const pc = G.cfg.potions[p.id], cur = PL.eff(P, p.cat), t = now();
    if (cur && cur.mult > pc.mult) return send(s, { t: 'err', text: 'A stronger ' + p.cat + ' potion is already working. Potions of one kind don’t stack.' });
    if (cur && cur.id === p.id) { const left = cur.ends - t; if (left + pc.dur * 1000 > pc.dur * 1000 * G.cfg.potionMax) return send(s, { t: 'err', text: 'That potion is already at its longest time.' }); cur.ends += pc.dur * 1000; }
    else P.d.eff[p.cat] = { id: p.id, mult: pc.mult, ends: t + pc.dur * 1000 };
    P.d.potions[p.id]--; P.dirty = true; G.sync(P); send(s, { t: 'drank', id: p.id });
  };
  H.snack = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r) return; if (!(P.d.snacks > 0)) return send(s, { t: 'err', text: 'You have no Rat Snacks. Buy some in the shop.' });
    if (r.lvl >= r.cap) return send(s, { t: 'err', text: 'That rat is at its level cap. Raise the cap first.' });
    P.d.snacks--; ratXp(P, r, Math.max(120, D.ratXpNeed(r.lvl) * 0.6)); PL.saveRat(G, P, r); P.dirty = true; G.sendRats(P, [r]);
  };
  H.capUp = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r) return; if (r.cap >= G.cfg.ratCapMax) return send(s, { t: 'err', text: 'This rat’s level cap is already at the maximum (' + G.cfg.ratCapMax + ').' });
    const price = D.capPrice(r); if (!pay(P, price)) return send(s, { t: 'err', text: 'Raising the cap costs ' + D.fmtMoney(price) + '.' });
    G.db.tx(() => { r.cap = Math.min(G.cfg.ratCapMax, r.cap + G.cfg.ratCapStep); PL.saveRat(G, P, r); PL.save(G, P); }); G.sendRats(P, [r]);
  };

  // ---------- favourites, cosmetics, showcase, evolution ----------
  H.cosEq = (s, m) => {
    const P = s.P, r = own(s, m.id), c = COS[m.cos]; if (!r || !c) return;
    if (!(P.d.cos[c.id] > 0)) return send(s, { t: 'err', text: 'You don’t have a spare ' + c.n + '.' });
    G.db.tx(() => { const prev = r.cos[c.slot]; if (prev) P.d.cos[prev] = (P.d.cos[prev] || 0) + 1; r.cos[c.slot] = c.id; P.d.cos[c.id]--; PL.saveRat(G, P, r); PL.save(G, P); });
    G.sendRats(P, [r]); if (r.place === 'eq') petsChanged(s); if (P.d.showcase.rats.includes(r.id)) sendRoster(s.room);
  };
  H.cosUn = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r || !r.cos[m.slot]) return;
    G.db.tx(() => { const c = r.cos[m.slot]; P.d.cos[c] = (P.d.cos[c] || 0) + 1; delete r.cos[m.slot]; PL.saveRat(G, P, r); PL.save(G, P); });
    G.sendRats(P, [r]); if (r.place === 'eq') petsChanged(s); if (P.d.showcase.rats.includes(r.id)) sendRoster(s.room);
  };
  H.showcase = (s, m) => {
    const P = s.P, ids = (Array.isArray(m.ids) ? m.ids : []).map(String).filter((id, i, a) => P.rats.has(id) && a.indexOf(id) === i).slice(0, 6);
    const theme = ['classic', 'royal', 'neon', 'nature', 'galaxy', 'candy'].includes(m.theme) ? m.theme : P.d.showcase.theme;
    P.d.showcase = { rats: ids, theme }; P.dirty = true; G.sync(P); if (s.room) sendRoster(s.room);
  };
  H.title = (s, m) => { const P = s.P; if (m.v && !P.d.titles.includes(m.v)) return; P.d.title = m.v || ''; P.dirty = true; G.sync(P); if (s.room) sendRoster(s.room); petsChanged(s); };
  H.color = (s, m) => { if (!/^#[0-9a-f]{6}$/i.test(m.c || '')) return; s.P.color = m.c; s.P.dirty = true; G.sync(s.P); if (s.room) sendRoster(s.room); petsChanged(s); };
  H.evolve = (s, m) => {
    const P = s.P, list = (Array.isArray(m.ids) ? m.ids : []).map(id => own(s, id)).filter(Boolean);
    if (list.length !== 3 || new Set(list).size !== 3) return send(s, { t: 'err', text: 'Pick three rats to combine.' });
    const a = list[0]; if (!list.every(r => r.sp === a.sp && r.evo === a.evo)) return send(s, { t: 'err', text: 'Evolution needs three of the same rat at the same stage.' });
    if (a.evo >= 3) return send(s, { t: 'err', text: 'This rat is fully evolved.' });
    const eaten = list.slice(1);
    if (eaten.some(r => r.lock)) return send(s, { t: 'err', text: 'Locked rats can’t be used for evolution. Unlock them first.' });
    if (list.some(r => busyInTrade(s, r))) return send(s, { t: 'err', text: 'One of those rats is in a trade.' });
    if (eaten.some(r => r.fav) && !m.confirm) return send(s, { t: 'confirm', what: 'evolve', ids: list.map(r => r.id), text: 'Two of these rats will be combined into one. One of them is a favorite. Continue?' });
    const rank = { rainbow: 3, diamond: 2, gold: 1 };
    G.db.tx(() => {
      for (const r of eaten) { if (!a.mut || (rank[r.mut] || 0) > (rank[a.mut] || 0)) a.mut = r.mut || a.mut; if (!a.wx && r.wx) a.wx = r.wx; if (r.disco) a.disco = 1; a.lvl = Math.max(a.lvl, r.lvl); a.cap = Math.max(a.cap, r.cap); PL.removeRat(G, P, r); }
      a.evo++; PL.saveRat(G, P, a); PL.discover(G, P, a); PL.bump(G, P, 'evolved'); PL.checkAch(G, P); PL.save(G, P);
    });
    send(s, { t: 'evolved', rat: PL.ratView(a), gone: eaten.map(r => r.id) }); G.sendRats(P, [a], eaten.map(r => r.id)); if (a.place === 'eq') petsChanged(s);
  };

  // ---------- rewards, quests, rebirth ----------
  H.daily = s => { const r = G.db.tx(() => { const r = PL.claimDaily(G, s.P); PL.save(G, s.P); return r; }); if (!r.ok) send(s, { t: 'err', text: r.why }); else { send(s, Object.assign({ t: 'dailyOk' }, r)); G.sync(s.P); } };
  H.qclaim = (s, m) => { const r = G.db.tx(() => { const r = PL.claimQuest(G, s.P, m.i); PL.save(G, s.P); return r; }); if (!r.ok) send(s, { t: 'err', text: r.why }); G.sync(s.P); };
  H.rebirth = (s, m) => {
    const P = s.P, need = D.rebirthNeed(G.cfg, P.rebirths);
    if (P.level < need) return send(s, { t: 'err', text: 'Reach level ' + need + ' to rebirth.' });
    if (!m.confirm) return;
    G.db.tx(() => {
      P.rebirths++; P.level = 1; P.xp = 0; if (G.cfg.rebirthResetsMoney) P.money = 0;
      const title = 'Reborn' + (P.rebirths > 1 ? ' ' + roman(P.rebirths) : ''); if (!P.d.titles.includes(title)) P.d.titles.push(title); P.d.title = title;
      PL.checkAch(G, P); PL.save(G, P);
    });
    if (s.area && s.area.field) { enterArea(s, 'lobby'); sendRoster(s.room); }
    send(s, { t: 'reborn', n: P.rebirths }); G.sync(P); petsChanged(s);
    G.events.announce({ kind: 'normal', text: P.name + ' was reborn! (Rebirth ' + P.rebirths + ')', col: '#ff9af0', dur: 6, room: s.room ? s.room.code : null });
  };
  const roman = n => { const v = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [k, c] of v) while (n >= k) { s += c; n -= k; } return s; };

  // ---------- information ----------
  H.lb = (s, m) => { const cat = String(m.cat || ''); if (!G.lbCache[cat]) return; send(s, { t: 'lb', cat, l: G.lbCache[cat], at: G.lbAt || 0, me: G.db.rankOf(cat, s.P.id) }); };
  H.insp = (s, m) => {
    const o = [...(s.room ? s.room.players : [])].find(x => x.P.id === (m.id | 0)); if (!o) return send(s, { t: 'err', text: 'That player left the room.' });
    const P = o.P; send(s, { t: 'insp', id: P.id, n: P.name, ti: P.d.title, lvl: P.level, reb: P.rebirths, c: P.color, theme: P.d.showcase.theme, rats: P.d.showcase.rats.map(id => P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.lookView(r), { id: r.id, earn: D.ratEarn(G.cfg, r, { rebirths: P.rebirths }).total })) });
  };
  H.history = s => send(s, { t: 'history', l: G.db.st.tradesOf.all(s.P.id, s.P.id).map(t => ({ id: t.id, a: t.a, b: t.b, ar: JSON.parse(t.a_rats || '[]'), br: JSON.parse(t.b_rats || '[]'), at: t.at })) });
  H.pw = (s, m) => {
    const acc = G.db.st.accById.get(s.P.id); if (!acc) return;
    if (acc.pass_hash) { const ok = crypto.timingSafeEqual(Buffer.from(passHash(m.old || '', acc.pass_salt), 'hex'), Buffer.from(acc.pass_hash, 'hex')); if (!ok) return send(s, { t: 'err', text: 'Your current password is wrong.' }); }
    if (String(m.pass || '').length < 4) return send(s, { t: 'err', text: 'Passwords need at least 4 characters.' });
    const salt = crypto.randomBytes(16).toString('hex'); G.db.st.accPass.run(passHash(m.pass, salt), salt, s.P.id); s.P.hasPass = true; G.sync(s.P);
    send(s, { t: 'toast', kind: 'ok', text: 'Password saved. You can now log in on other devices.' });
  };
  H.bye = s => { s.ws.close(1000, 'bye'); };

  // ---------- leaderboards (every minute) ----------
  G.lbCache = {}; G.lbAt = 0;
  function computeLb() {
    for (const cat of ['money', 'rarity', 'caught', 'level', 'rebirths', 'mutation', 'trades']) {
      G.lbCache[cat] = G.db.leaderboard(cat, 50).map((r, i) => ({ rank: i + 1, id: r.id, n: r.name, c: r.color || '#ff9f1a', v: cat === 'money' ? r.money : cat === 'rarity' ? r.rarity_score : cat === 'caught' ? r.caught : cat === 'level' ? r.level : cat === 'rebirths' ? r.rebirths : cat === 'mutation' ? r.mutation_score : r.trades, reb: r.rebirths }));
    }
    G.lbAt = now();
  }
  G.computeLb = computeLb;

  // ---------- start ----------
  makeRoom(true, 0, 'Main room');
  computeLb();
  const iv = setInterval(() => { try { tick(); } catch (e) { console.error('tick', e); } }, 100);
  const lbIv = setInterval(() => { try { saveAll(false); computeLb(); } catch (e) { console.error('leaderboards', e); } }, 60000);
  G.stopGame = () => { clearInterval(iv); clearInterval(lbIv); };
  G.dropSession = drop; G.enterArea = enterArea; G.roomInfo = roomInfo; G.ratPos = ratPos; G.pubView = pubView;
}
module.exports = { create };

};
// In-memory stand-in for server/db.js, used when the game runs its server inside the page.
// Same statements and results; transactions roll back by restoring a snapshot.
function MemDB(saved) {
  let T = { accounts: [], players: [], rats: [], trades: [], kv: {}, seq: { accounts: 0, trades: 0 } };
  if (saved && saved.accounts) T = saved;
  const byId = (tab, id) => T[tab].find(r => r.id === id);
  const lc = s => String(s).toLowerCase();
  const st = {
    accByName: { get: n => T.accounts.find(a => lc(a.name) === lc(n)) },
    accById: { get: id => byId('accounts', id) },
    accByToken: { get: h => T.accounts.find(a => a.token_hash === h) },
    accInsert: { run: (name, ph, salt, th, created, last) => { if (T.accounts.some(a => lc(a.name) === lc(name))) throw new Error('UNIQUE'); const id = ++T.seq.accounts; T.accounts.push({ id, name, pass_hash: ph, pass_salt: salt, token_hash: th, created, last_login: last, banned: 0 }); return { lastInsertRowid: id, changes: 1 }; } },
    accToken: { run: (th, last, id) => { const a = byId('accounts', id); if (a) { a.token_hash = th; a.last_login = last; } return { changes: a ? 1 : 0 }; } },
    accPass: { run: (ph, salt, id) => { const a = byId('accounts', id); if (a) { a.pass_hash = ph; a.pass_salt = salt; } return { changes: a ? 1 : 0 }; } },
    plInsert: { run: (id, money, data, last, color) => { T.players.push({ id, money, level: 1, xp: 0, rebirths: 0, caught: 0, trades: 0, rarity_score: 0, mutation_score: 0, data, last_seen: last, color }); return { changes: 1 }; } },
    plGet: { get: id => { const p = byId('players', id); return p && Object.assign({}, p); } },
    plSave: { run: (money, level, xp, rebirths, caught, trades, rs, ms, data, last, color, id) => { const p = byId('players', id); if (p) Object.assign(p, { money, level, xp, rebirths, caught, trades, rarity_score: rs, mutation_score: ms, data, last_seen: last, color }); return { changes: p ? 1 : 0 }; } },
    ratsOf: { all: owner => T.rats.filter(r => r.owner === owner).map(r => Object.assign({}, r)) },
    ratGet: { get: id => { const r = T.rats.find(x => x.id === id); return r && Object.assign({}, r); } },
    ratInsert: { run: (id, owner, sp, mut, wx, disco, lvl, xp, cap, evo, fav, lock, place, slot, cos, born, src) => { T.rats.push({ id, owner, sp, mut, wx, disco, lvl, xp, cap, evo, fav, lock, place, slot, cos, born, src }); return { changes: 1 }; } },
    ratSave: { run: (mut, wx, disco, lvl, xp, cap, evo, fav, lock, place, slot, cos, id, owner) => { const r = T.rats.find(x => x.id === id && x.owner === owner); if (r) Object.assign(r, { mut, wx, disco, lvl, xp, cap, evo, fav, lock, place, slot, cos }); return { changes: r ? 1 : 0 }; } },
    ratOwner: { run: (to, place, id, from) => { const r = T.rats.find(x => x.id === id && x.owner === from && !x.lock); if (r) Object.assign(r, { owner: to, place, slot: -1, fav: 0 }); return { changes: r ? 1 : 0 }; } },
    ratDelete: { run: (id, owner) => { const i = T.rats.findIndex(x => x.id === id && x.owner === owner); if (i >= 0) T.rats.splice(i, 1); return { changes: i >= 0 ? 1 : 0 }; } },
    tradeInsert: { run: (a, b, ar, br, at) => { T.trades.push({ id: ++T.seq.trades, a, b, a_rats: ar, b_rats: br, at }); if (T.trades.length > 200) T.trades.shift(); return { changes: 1 }; } },
    tradesOf: { all: (a, b) => T.trades.filter(t => t.a === a || t.b === b).slice(-50).reverse() }
  };
  let depth = 0;
  function tx(fn) {
    if (depth) return fn();
    const snap = JSON.stringify(T); depth++;
    try { const r = fn(); depth--; return r; } catch (e) { depth--; T = JSON.parse(snap); throw e; }
  }
  const ORDER = { money: p => p.money, caught: p => p.caught, level: p => p.rebirths * 1000 + p.level, rebirths: p => p.rebirths, rarity: p => p.rarity_score, mutation: p => p.mutation_score, trades: p => p.trades };
  function leaderboard(col, limit) {
    const f = ORDER[col]; if (!f) return [];
    return T.players.map(p => ({ p, a: byId('accounts', p.id) })).filter(x => x.a && !x.a.banned).sort((x, y) => f(y.p) - f(x.p) || x.p.id - y.p.id).slice(0, limit || 50)
      .map(({ p, a }) => ({ id: a.id, name: a.name, color: p.color, money: p.money, caught: p.caught, level: p.level, rebirths: p.rebirths, rarity_score: p.rarity_score, mutation_score: p.mutation_score, trades: p.trades }));
  }
  function rankOf(col, id) { const f = ORDER[col], me = byId('players', id); if (!f || !me) return null; const v = f(me); return { rank: T.players.filter(p => f(p) > v || (f(p) === v && p.id < id)).length + 1, v }; }
  return { st, tx, kvGet: k => (k in T.kv ? JSON.parse(T.kv[k]) : null), kvSet: (k, v) => { T.kv[k] = JSON.stringify(v); }, backup: () => '', leaderboard, rankOf, file: 'this device', close() {}, dump: () => T };
}

// Starts the game server inside the page (solo play without a server). Exposes window.RC_LOCAL.
const KEY = 'rc-local-save';
let G = null, saveT = 0;
function loadSave() { try { const s = window.localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function save() { if (!G) return; try { G.saveAll(true); } catch (e) {} try { window.localStorage.setItem(KEY, JSON.stringify(G.db.dump())); } catch (e) {} }
function start() {
  if (G) return G;
  const D = window.RCDATA; G = { D, local: true };
  G.db = MemDB(loadSave());
  G.cfgOver = G.db.kvGet('config') || {}; G.cfg = D.deepMerge(D.DEFAULT_CONFIG, G.cfgOver);
  G.publicCfg = () => G.cfg; G.listBackups = () => [];
  req('./events.js').create(G); req('./game.js').create(G); req('./trade.js').create(G);
  saveT = setInterval(save, 10000);
  window.addEventListener('pagehide', save); document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  return G;
}
// a socket pair: the page's game talks to the page's server exactly like it talks to a real one
function connect() {
  start(); G.db.kvSet('srvSync', null); // playing here: this device's save is now the newest
  const srv = { open: true, ip: 'local', h: {}, on(e, f) { this.h[e] = f; }, send(str) { if (cli.readyState === 1) setTimeout(() => { if (cli.readyState === 1 && cli.onmessage) cli.onmessage({ data: str }); }, 0); }, close() { if (!srv.open) return; srv.open = false; cli.readyState = 3; if (srv.h.close) srv.h.close(); setTimeout(() => cli.onclose && cli.onclose({}), 0); } };
  const cli = { readyState: 0, send(str) { if (cli.readyState === 1) setTimeout(() => { if (srv.open && srv.h.message) srv.h.message(str); }, 0); }, close() { if (cli.readyState === 3) return; cli.readyState = 3; srv.open = false; if (srv.h.close) srv.h.close(); save(); setTimeout(() => cli.onclose && cli.onclose({}), 0); } };
  setTimeout(() => { cli.readyState = 1; G.onConnection(srv); if (cli.onopen) cli.onopen({}); }, 0);
  return cli;
}
// the online server (device saves): take this device's save along, and keep the copies it sends back
function devBlob(tok) {
  start(); const acc = tok && G.db.st.accByToken.get(fnv(tok)); if (!acc) return null;
  const s = G.byPlayer.get(acc.id); if (s) { try { s.ws.close(); } catch (e) {} }
  const blob = exportAcc(acc.id); return blob ? { blob, sync: G.db.kvGet('srvSync') } : null;
}
function devAbsorb(tok, blob, sync) {
  start(); const acc = tok && G.db.st.accByToken.get(fnv(tok)); if (!acc || G.byPlayer.has(acc.id)) return false;
  const b = cleanBlob(blob); if (!b) return false;
  try { G.db.tx(() => writeAcc(acc.id, b, false)); G.db.kvSet('srvSync', sync && typeof sync === 'object' ? { sid: String(sync.sid || ''), n: sync.n | 0 } : null); } catch (e) { return false; }
  save(); return true;
}
window.RC_LOCAL = { connect, save, hasSave: () => !!loadSave(), devBlob, devAbsorb };

// Rooms without a server. Each player's page already runs the game server for solo play; to play together,
// one friend's page hosts the room and the others connect to it directly, browser to browser.
// Finding each other works like ORIONFALL and ORION Racing: a public WebRTC broker (plus a claude.ai page's
// live room, and BroadcastChannel between tabs) carries the handshake, then a WebRTC data channel carries the
// game. If a direct link can't open, the game messages are relayed through the same signaling channels.
// Everyone's progress stays on their own device: the host sends each guest's save back while they play.
const PEER_V = 1, PEER_CAB = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', PEER_MAX = 19;
const PEER_ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }, { urls: 'stun:stun.cloudflare.com:3478' }];
const PEER_RE = new RegExp('^[' + PEER_CAB + ']{6}$');
const normPeer = c => { c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return PEER_RE.test(c) ? c : ''; };
const newPeerCode = () => { const b = rnd(6); let s = ''; for (let i = 0; i < 6; i++) s += PEER_CAB[b[i] % PEER_CAB.length]; return s; };
const showPeer = c => c ? c.slice(0, 3) + '-' + c.slice(3) : '';

// ---------- transport: signaling backends, WebRTC links, relay fallback, ordering and chunking ----------
function PeerHub(cfg) {
  const win = window, my = cfg.code, PFX = 'ratc-';
  const H = { my, status: 'offline', taken: false, backends: [], links: {} };
  const seen = new Map(), outQ = {}, inQ = {}, parts = {}, aliases = new Map(); let dead = false;
  const rid = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const now = () => Date.now();
  const change = () => { try { cfg.onChange && cfg.onChange(); } catch (e) {} };
  function upd() {
    const net = H.backends.filter(b => b.name !== 'local');
    const st = net.some(b => b.ok) ? 'online' : H.taken ? 'taken' : net.length ? 'connecting' : 'offline';
    if (st !== H.status) { H.status = st; change(); }
  }
  const BCAND = { candidate: 'candidate:1 1 udp 1 1.2.3.4 1 typ host', sdpMid: '0', sdpMLineIndex: 0 };
  function brokerBackend(url, alias, onState) {
    if (!url || typeof win.WebSocket !== 'function') return null;
    const id = alias || my;
    const B = { name: 'broker', ok: false, ws: null, retry: 0, closed: false, token: rid() };
    function open() {
      if (B.closed || dead) return;
      let ws; try { ws = new win.WebSocket(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'id=' + PFX + id + '&token=' + B.token + '&version=1.5.4'); } catch (e) { later(); return; }
      B.ws = ws;
      ws.onmessage = ev => {
        let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        const from = m.src && String(m.src).indexOf(PFX) === 0 ? String(m.src).slice(PFX.length) : null;
        if (m.type === 'OPEN') { B.ok = true; B.retry = 0; if (alias) { onState && onState(true); return; } H.taken = false; upd(); }
        else if (m.type === 'ID-TAKEN') { B.ok = false; B.closed = true; try { ws.close(); } catch (e) {} if (alias) { onState && onState(false); return; } H.taken = true; upd(); }
        else if ((m.type === 'OFFER' || m.type === 'ANSWER' || m.type === 'CANDIDATE') && m.payload && m.payload.metadata && m.payload.metadata.rc === 1 && from) recv(from, m.payload.metadata);
      };
      ws.onclose = () => { const was = B.ok; B.ok = false; B.ws = null; if (was && !alias) upd(); later(); };
      ws.onerror = () => {};
    }
    function later() { if (B.closed || dead) return; B.retry = Math.min(B.retry + 1, 7); clearTimeout(B.t); B.t = setTimeout(open, 800 * Math.pow(1.7, B.retry)); upd(); }
    B.hb = setInterval(() => { if (B.ok && B.ws) try { B.ws.send('{"type":"HEARTBEAT"}'); } catch (e) {} }, 5000);
    // the public broker only passes on well-formed PeerJS messages, so ours ride in an ICE candidate's metadata
    B.send = (to, o) => { if (!B.ok || !B.ws) return false; try { B.ws.send(JSON.stringify({ type: 'CANDIDATE', dst: PFX + to, payload: { candidate: BCAND, type: 'data', connectionId: 'ratc', metadata: o } })); return true; } catch (e) { return false; } };
    B.close = () => { B.closed = true; clearInterval(B.hb); clearTimeout(B.t); try { if (B.ws) B.ws.close(); } catch (e) {} };
    open(); return B;
  }
  function roomBackend() {
    if (!win.claude || typeof win.claude.use !== 'function') return null;
    const B = { name: 'room', ok: false, room: null, parts: {} };
    win.claude.use('room').then(room => {
      if (!room || dead) return; B.room = room;
      B.u1 = room.on('rcsig', m => {
        const d = m && m.data; if (!d || (d.to !== my && !aliases.has(d.to)) || m.sameTab || typeof d.fr !== 'string') return;
        if (d.ck) { const k = d.fr + d.ck, P = B.parts[k] || (B.parts[k] = { n: d.n, got: 0, s: [] }); if (P.s[d.i] == null) { P.s[d.i] = d.s; P.got++; } if (P.got >= P.n) { delete B.parts[k]; try { recv(d.fr, JSON.parse(P.s.join(''))); } catch (e) {} } return; }
        recv(d.fr, d.d);
      }, () => { B.ok = false; upd(); });
      B.u2 = room.onConnection(c => { B.ok = !!c; upd(); }, () => { B.ok = false; upd(); });
    }).catch(() => {});
    B.send = (to, o) => {
      if (!B.room || !B.ok) return false;
      const s = JSON.stringify(o);
      if (s.length < 3400) { B.room.emit('rcsig', { to, fr: my, d: o }).catch(() => {}); return true; }
      const id = rid(), n = Math.ceil(s.length / 3000);
      for (let i = 0; i < n; i++) B.room.emit('rcsig', { to, fr: my, ck: id, i, n, s: s.slice(i * 3000, (i + 1) * 3000) }).catch(() => {});
      return true;
    };
    B.close = () => { try { B.u1 && B.u1(); B.u2 && B.u2(); } catch (e) {} };
    return B;
  }
  function localBackend() {
    if (typeof win.BroadcastChannel !== 'function') return null;
    let bc; try { bc = new win.BroadcastChannel('ratc-net'); } catch (e) { return null; }
    const B = { name: 'local', ok: true, bc };
    bc.onmessage = ev => { const d = ev.data; if (d && (d.to === my || aliases.has(d.to)) && d.fr && d.fr !== my) recv(d.fr, d.d); };
    B.send = (to, o) => { try { bc.postMessage({ to, fr: my, d: o }); return true; } catch (e) { return false; } };
    B.close = () => { try { bc.close(); } catch (e) {} };
    return B;
  }
  function sig(to, o) { if (!to || dead) return false; o.rc = 1; o.id = rid(); let ok = false; for (const b of H.backends) if (b.ok && b.send(to, o)) ok = true; return ok; }
  function recv(from, o) {
    if (dead || !o || typeof o.k !== 'string' || !from || from === my || !normPeer(from)) return;
    if (o.id) { if (seen.has(o.id)) return; seen.set(o.id, 1); if (seen.size > 3000) { const it = seen.keys(); for (let i = 0; i < 1000; i++) seen.delete(it.next().value); } }
    if (o.k === 'sdp') return onSdp(from, o);
    if (o.k === 'ice') { const L = H.links[from]; if (!L || L.lid !== o.lid || !L.pc) return; if (L.pc.remoteDescription) L.pc.addIceCandidate(o.c).catch(() => {}); else L.cands.push(o.c); return; }
    if (o.k === 'app') return inApp(from, o.m);
    if (o.k === 'pq' || o.k === 'pa') { try { cfg.onRaw && cfg.onRaw(from, o); } catch (e) {} }
  }

  // app messages are numbered per sender so they come out in order, whichever path each one took
  function inApp(from, p) {
    if (!p || typeof p.q !== 'number') return;
    let Q = inQ[from]; if (!Q || Q.e !== p.e) Q = inQ[from] = { e: p.e, next: p.q === 1 ? 1 : p.q, buf: new Map(), t: 0 };
    if (p.q < Q.next || Q.buf.has(p.q)) return;
    Q.buf.set(p.q, p); flush(from, Q);
    if (Q.buf.size && !Q.t) Q.t = setTimeout(() => { Q.t = 0; if (!Q.buf.size) return; Q.next = Math.min(...Q.buf.keys()); flush(from, Q); }, 2000); // a lost message: skip it
  }
  function flush(from, Q) {
    while (Q.buf.has(Q.next)) { const p = Q.buf.get(Q.next); Q.buf.delete(Q.next); Q.next++; try { unpack(from, p); } catch (e) { if (win.console) console.error('RAT CATCHERS rooms', e); } }
    if (!Q.buf.size && Q.t) { clearTimeout(Q.t); Q.t = 0; }
  }
  function unpack(from, p) {
    if (p.ck) { const k = from + p.ck, P = parts[k] || (parts[k] = { n: p.n, got: 0, s: [] }); if (P.s[p.i] == null) { P.s[p.i] = p.s; P.got++; } if (P.got >= P.n) { delete parts[k]; cfg.onMsg(from, JSON.parse(P.s.join(''))); } return; }
    cfg.onMsg(from, p.m);
  }
  function send(to, m) {
    if (!to || dead) return;
    const s = JSON.stringify(m), Q = outQ[to] || (outQ[to] = { q: 0, e: rid() }), list = [];
    if (s.length <= 12000) list.push({ m });
    else { const ck = rid(), n = Math.ceil(s.length / 12000); for (let i = 0; i < n; i++) list.push({ ck, i, n, s: s.slice(i * 12000, (i + 1) * 12000) }); }
    const L = H.links[to];
    for (const p of list) {
      p.e = Q.e; p.q = ++Q.q;
      if (L && L.open && L.dc && L.dc.readyState === 'open') { try { L.dc.send(JSON.stringify(p)); continue; } catch (e) {} }
      sig(to, { k: 'app', m: p });
    }
  }

  // ---------- WebRTC links ----------
  function mkLink(c) { const L = { c, lid: null, pc: null, dc: null, open: false, relay: false, cands: [] }; H.links[c] = L; return L; }
  function setupPC(L) {
    if (typeof win.RTCPeerConnection !== 'function') { L.relay = true; return false; }
    let pc; try { pc = new win.RTCPeerConnection({ iceServers: PEER_ICE }); } catch (e) { L.relay = true; return false; }
    L.pc = pc;
    pc.onicecandidate = e => { if (e.candidate) { const c = e.candidate; sig(L.c, { k: 'ice', lid: L.lid, c: { candidate: c.candidate, sdpMid: c.sdpMid, sdpMLineIndex: c.sdpMLineIndex } }); } };
    pc.ondatachannel = e => { L.dc = e.channel; wireDC(L, e.channel); };
    pc.onconnectionstatechange = () => { if ((pc.connectionState === 'failed' || pc.connectionState === 'closed') && H.links[L.c] === L) { L.relay = true; L.open = false; change(); } };
    return true;
  }
  function wireDC(L, ch) {
    ch.onopen = () => { L.open = true; L.relay = false; change(); };
    ch.onclose = () => { L.open = false; change(); };
    ch.onmessage = e => { let p; try { p = JSON.parse(e.data); } catch (er) { return; } inApp(L.c, p); };
  }
  function link(c) {
    closeLink(c); const L = mkLink(c); L.lid = rid();
    if (!setupPC(L)) return;
    L.dc = L.pc.createDataChannel('r', { ordered: true }); wireDC(L, L.dc);
    L.pc.createOffer().then(o => L.pc.setLocalDescription(o)).then(() => sig(c, { k: 'sdp', lid: L.lid, d: { type: 'offer', sdp: L.pc.localDescription.sdp } })).catch(() => { L.relay = true; });
    setTimeout(() => { if (H.links[c] === L && !L.open) { L.relay = true; change(); } }, 9000);
  }
  function onSdp(from, o) {
    if (!o.d || typeof o.d.sdp !== 'string') return;
    if (o.d.type === 'offer') {
      closeLink(from); const L = mkLink(from); L.lid = o.lid;
      if (!setupPC(L)) return;
      L.pc.setRemoteDescription(o.d).then(() => { for (const c of L.cands) L.pc.addIceCandidate(c).catch(() => {}); L.cands = []; return L.pc.createAnswer(); })
        .then(a => L.pc.setLocalDescription(a)).then(() => sig(from, { k: 'sdp', lid: L.lid, d: { type: 'answer', sdp: L.pc.localDescription.sdp } })).catch(() => { L.relay = true; });
    } else if (o.d.type === 'answer') {
      const L = H.links[from]; if (!L || L.lid !== o.lid || !L.pc) return;
      L.pc.setRemoteDescription(o.d).then(() => { for (const c of L.cands) L.pc.addIceCandidate(c).catch(() => {}); L.cands = []; }).catch(() => { L.relay = true; });
    }
  }
  function closeLink(c) { const L = H.links[c]; if (!L) return; delete H.links[c]; try { L.dc && L.dc.close(); } catch (e) {} try { L.pc && L.pc.close(); } catch (e) {} }
  function forget(c) { closeLink(c); delete outQ[c]; delete inQ[c]; }
  const linkState = c => { const L = H.links[c]; return !L ? '' : L.open ? 'direct' : L.relay ? 'relay' : 'opening'; };

  H.backends = [roomBackend(), cfg.broker ? brokerBackend(cfg.broker) : null, localBackend()].filter(Boolean);
  upd();
  // a second, well-known name (a public lobby slot): the broker gives each name to one page only
  H.claim = alias => new Promise(ok => {
    if (aliases.has(alias)) return ok(true);
    if (!cfg.broker) { aliases.set(alias, null); return ok(true); } // offline: only tabs on this computer can find it
    let done = false; const fin = v => { if (done) return; done = true; if (!v) { aliases.delete(alias); B && B.close(); } ok(v); };
    aliases.set(alias, null); const B = brokerBackend(cfg.broker, alias, fin); aliases.set(alias, B);
    setTimeout(() => fin(!!(B && B.ok)), 6000);
  });
  H.release = alias => { const B = aliases.get(alias); aliases.delete(alias); if (B) B.close(); };
  H.raw = (to, o) => sig(to, o);
  H.send = send; H.link = link; H.forget = forget; H.linkState = linkState;
  H.close = () => { for (const a of [...aliases.keys()]) H.release(a); dead = true; for (const c of Object.keys(H.links)) closeLink(c); for (const b of H.backends) b.close(); };
  return H;
}

// ---------- saves: what travels between a guest's device and the host ----------
const PL_NUM = ['money', 'level', 'xp', 'rebirths', 'caught', 'trades', 'rarity_score', 'mutation_score', 'last_seen'];
const RAT_NUM = ['disco', 'lvl', 'xp', 'cap', 'evo', 'fav', 'lock', 'slot', 'born'];
function exportAcc(id) {
  const T = G.db.dump(), a = T.accounts.find(x => x.id === id), p = T.players.find(x => x.id === id);
  if (!a || !p) return null;
  const pl = {}; for (const k of PL_NUM) pl[k] = p[k]; pl.data = p.data; pl.color = p.color;
  return { name: a.name, pl, rats: T.rats.filter(r => r.owner === id).map(r => { const o = Object.assign({}, r); delete o.owner; return o; }) };
}
function cleanBlob(b) {
  if (!b || typeof b !== 'object' || !b.pl || !Array.isArray(b.rats) || b.rats.length > 6000) return null;
  const pl = {}; for (const k of PL_NUM) { const v = Number(b.pl[k]); if (!isFinite(v) || v < 0) return null; pl[k] = v; }
  if (typeof b.pl.data !== 'string' || b.pl.data.length > 400000) return null; try { JSON.parse(b.pl.data); } catch (e) { return null; }
  pl.data = b.pl.data; pl.color = /^#[0-9a-fA-F]{6}$/.test(b.pl.color) ? b.pl.color : '#ff9f1a';
  const SP = (window.RCDATA || {}).SP || {}, rats = [], ids = new Set();
  for (const r of b.rats) {
    if (!r || typeof r.id !== 'string' || r.id.length > 24 || ids.has(r.id) || !SP[r.sp]) continue;
    const o = { id: r.id, sp: r.sp, mut: typeof r.mut === 'string' ? r.mut.slice(0, 24) : null, wx: typeof r.wx === 'string' ? r.wx.slice(0, 24) : null, place: ['inv', 'sto', 'slot', 'eq'].includes(r.place) ? r.place : 'sto', cos: typeof r.cos === 'string' ? r.cos.slice(0, 2000) : '{}', src: typeof r.src === 'string' ? r.src.slice(0, 40) : '' };
    for (const k of RAT_NUM) { const v = Number(r[k]); o[k] = isFinite(v) ? v : 0; }
    ids.add(r.id); rats.push(o);
  }
  return { name: String(b.name || '').replace(/[^A-Za-z0-9_ ]/g, '').trim().slice(0, 16), pl, rats };
}
function writeAcc(id, b, skipTaken) {
  const T = G.db.dump();
  const p = T.players.find(x => x.id === id); if (p) Object.assign(p, b.pl); else T.players.push(Object.assign({ id }, b.pl));
  T.rats = T.rats.filter(r => r.owner !== id);
  const taken = skipTaken ? new Set(T.rats.map(r => r.id)) : null; // a rat that now belongs to someone else on this device stays theirs
  for (const r of b.rats) if (!taken || !taken.has(r.id)) T.rats.push(Object.assign({}, r, { owner: id }));
}

// ---------- the room layer: hosting friends, or visiting a friend ----------
const PUB_N = 24, pubName = k => 'pub' + PEER_V + 'x' + k;
const PEER = { pub: '', finds: [], hub: null, code: '', name: '', guests: new Map(), host: null, joining: null, tick: 0, onChange: null };
const peerChange = () => { try { PEER.onChange && PEER.onChange(); } catch (e) {} };
function hostSession() { if (!G) return null; for (const s of G.sessions) if (s.ws && s.ws.ip === 'local' && s.P) return s; return null; }
function peerStart(o) {
  o = o || {}; PEER.onChange = o.onChange || PEER.onChange; PEER.name = o.name || PEER.name;
  if (PEER.hub) return peerInfo();
  start();
  PEER.code = normPeer(o.code) || newPeerCode();
  PEER.hub = PeerHub({ code: PEER.code, broker: o.broker, onMsg: peerMsg, onRaw: peerRaw, onChange: () => { if (PEER.hub && PEER.hub.taken && !PEER.retook) { PEER.retook = 1; PEER.hub.close(); PEER.code = newPeerCode(); PEER.hub = PeerHub({ code: PEER.code, broker: o.broker, onMsg: peerMsg, onRaw: peerRaw, onChange: peerChange }); } peerChange(); } });
  PEER.tick = setInterval(peerTick, 2000);
  window.addEventListener('pagehide', peerHostLeaving);
  return peerInfo();
}
function peerInfo() {
  const h = PEER.host;
  return { code: PEER.code, status: PEER.hub ? PEER.hub.status : 'off', guests: [...PEER.guests.entries()].map(([c, g]) => ({ code: c, name: g.name, link: PEER.hub.linkState(c) })),
    pub: PEER.pub, visiting: h ? { code: h.code, name: h.name, link: PEER.hub.linkState(h.code) } : null, joining: PEER.joining ? PEER.joining.code : '' };
}
function peerMsg(from, m) {
  if (!m || typeof m.k !== 'string') return;
  const hub = PEER.hub, g = PEER.guests.get(from), h = PEER.host;
  // ----- as the host -----
  if (m.k === 'join') {
    if (g && g.j === m.j && g.reply) return hub.send(from, g.reply); // the same request again
    const no = why => hub.send(from, { k: 'jno', why, j: m.j });
    if (m.v !== PEER_V) return no('version');
    if (h || PEER.joining) return no('away');
    const hs = hostSession(); if (!hs || !hs.room) return no('notplaying');
    if (!g && PEER.guests.size >= PEER_MAX) return no('full');
    if (hs.room.players.size >= 20) return no('full');
    const b = cleanBlob(m.blob); if (!b) return no('bad');
    if (g) closeGuest(from, '', true);
    let id, nm = b.name || 'Friend';
    try {
      G.db.tx(() => {
        const T = G.db.dump(), key = 'peer:' + from; id = G.db.kvGet(key);
        const old = id && G.byPlayer.get(id); if (old) { try { old.ws.close(4000, 'replaced'); } catch (e) {} }
        let a = id && T.accounts.find(x => x.id === id);
        const base = b.name.length >= 3 ? b.name : 'Friend ' + from.slice(0, 3); let n = base, i = 2;
        while ((T.accounts.find(x => x.name.toLowerCase() === n.toLowerCase() && x !== a))) n = base.slice(0, 13) + ' ' + i++;
        nm = n; if (!a) { id = ++T.seq.accounts; a = { id, name: n, pass_hash: null, pass_salt: null, token_hash: '', created: Date.now(), last_login: Date.now(), banned: 0 }; T.accounts.push(a); G.db.kvSet(key, id); }
        else a.name = n;
        nm = n;
        writeAcc(id, b, true);
      });
    } catch (e) { return no('bad'); }
    const tok = rnd(24).toString('hex'); G.db.st.accToken.run(fnv(tok), Date.now(), id);
    const reply = { k: 'jok', j: m.j, tok, room: hs.room.code, hn: hs.P.name };
    PEER.guests.set(from, { id, name: nm, srv: null, last: Date.now(), j: m.j, reply, saved: 0 });
    hub.send(from, reply); peerChange(); return;
  }
  if (m.k === 'c') {
    if (!g) return hub.send(from, { k: 'end', why: 'gone' });
    g.last = Date.now();
    if (!g.srv) {
      const srv = g.srv = { open: true, ip: 'peer:' + from, h: {}, on(e, f) { this.h[e] = f; },
        send(str) { if (srv.open) hub.send(from, { k: 's', d: str }); },
        close(code, why) { if (!srv.open) return; closeGuest(from, why || 'closed'); } };
      G.onConnection(srv);
    }
    if (g.srv.open && g.srv.h.message && typeof m.d === 'string' && m.d.length < 20000) g.srv.h.message(m.d);
    return;
  }
  if (m.k === 'bye') { if (g) closeGuest(from, ''); return; }
  if (m.k === 'hb') { if (g) g.last = Date.now(); if (h && h.code === from) h.last = Date.now(); return; }
  // ----- as a guest -----
  const J = PEER.joining;
  if (m.k === 'jok' && J && J.code === from && J.j === m.j) { PEER.joining = null; clearTimeout(J.t); clearInterval(J.iv); PEER.host = { code: from, name: String(m.hn || 'Friend').slice(0, 16), last: Date.now(), cli: null, acc: J.acc }; J.ok({ tok: String(m.tok || ''), room: String(m.room || ''), host: PEER.host.name }); peerChange(); return; }
  if (m.k === 'jno' && J && J.code === from && J.j === m.j) { PEER.joining = null; clearTimeout(J.t); clearInterval(J.iv); J.no(m.why || 'no'); peerChange(); return; }
  const pv = PEER.prev;
  if (m.k === 'save' && pv && pv.code === from && (!h || h.code !== from)) { const b = cleanBlob(m.blob); if (b && G && !G.byPlayer.has(pv.acc)) { try { G.db.tx(() => writeAcc(pv.acc, b, false)); save(); } catch (e) {} } PEER.prev = null; pv.done(); return; }
  if (!h || h.code !== from) return;
  h.last = Date.now();
  if (m.k === 's') { const c = h.cli; if (c && c.readyState === 1 && c.onmessage) c.onmessage({ data: String(m.d) }); return; }
  if (m.k === 'save') { const b = cleanBlob(m.blob); if (b && G && !G.byPlayer.has(h.acc)) { try { G.db.tx(() => writeAcc(h.acc, b, false)); save(); h.saved = Date.now(); } catch (e) {} } return; }
  if (m.k === 'end') { endVisit(m.why || 'closed'); return; }
}
function sendSave(code, g) { try { G.saveAll(true); } catch (e) {} const blob = exportAcc(g.id); if (blob) { PEER.hub.send(code, { k: 'save', blob }); g.saved = Date.now(); } }
function closeGuest(code, why, quiet) {
  const g = PEER.guests.get(code); if (!g) return;
  PEER.guests.delete(code);
  if (g.srv && g.srv.open) { g.srv.open = false; try { g.srv.h.close && g.srv.h.close(); } catch (e) {} }
  sendSave(code, g); // their progress goes home with them
  if (!quiet && why) PEER.hub.send(code, { k: 'end', why });
  setTimeout(() => { if (!PEER.guests.has(code) && !(PEER.host && PEER.host.code === code)) PEER.hub.forget(code); }, 4000);
  save(); peerChange();
}
function endVisit(why) {
  const h = PEER.host; if (!h) return;
  PEER.host = null; PEER.lastEnd = why;
  if (why === 'left') { // the host sends this device's save one last time: wait a moment for it
    if (PEER.prev) PEER.prev.done();
    const pv = PEER.prev = { code: h.code, acc: h.acc, waits: [] };
    pv.done = () => { if (PEER.prev === pv) PEER.prev = null; const w = pv.waits; pv.waits = []; for (const f of w) f(); };
    setTimeout(pv.done, 3500);
  }
  const c = h.cli; if (c && c.readyState !== 3) { c.readyState = 3; setTimeout(() => c.onclose && c.onclose({ code: 4100, reason: why }), 0); }
  setTimeout(() => { if (!PEER.host || PEER.host.code !== h.code) PEER.hub.forget(h.code); }, 4000);
  peerChange();
}
function peerTick() {
  const t = Date.now();
  for (const [code, g] of PEER.guests) {
    if (t - g.last > (g.srv ? 45000 : 30000)) { closeGuest(code, 'timeout'); continue; }
    PEER.hub.send(code, { k: 'hb' });
    if (g.srv && t - g.saved > 8000) sendSave(code, g);
  }
  const h = PEER.host;
  if (h) { if (t - h.last > 45000) endVisit('lost'); else PEER.hub.send(h.code, { k: 'hb' }); }
}
// visit a friend's room: send them this device's save, get a key for their game
function peerJoin(code, localTok) {
  return peerLeave().then(() => new Promise((ok, no) => {
    code = normPeer(code);
    if (!PEER.hub) return no('off');
    if (!code) return no('code');
    if (code === PEER.code) return no('self');
    if (PEER.joining) { clearTimeout(PEER.joining.t); clearInterval(PEER.joining.iv); PEER.joining = null; }
    for (const c of [...PEER.guests.keys()]) closeGuest(c, 'hostleft');
    if (PEER.pub) { PEER.hub.release(PEER.pub); PEER.pub = ''; }
    start();
    const acc = localTok && G.db.st.accByToken.get(fnv(localTok)); if (!acc) return no('nosave');
    if (G.byPlayer.has(acc.id)) { const s = G.byPlayer.get(acc.id); try { s.ws.close(); } catch (e) {} }
    const blob = exportAcc(acc.id); if (!blob) return no('nosave');
    const j = Math.random().toString(36).slice(2, 10), msg = { k: 'join', v: PEER_V, j, n: PEER.name || acc.name, blob };
    const J = PEER.joining = { code, j, ok, no, acc: acc.id };
    PEER.hub.link(code); PEER.hub.send(code, msg);
    J.iv = setInterval(() => { if (PEER.joining === J) PEER.hub.send(code, msg); }, 4000);
    J.t = setTimeout(() => { if (PEER.joining !== J) return; clearInterval(J.iv); PEER.joining = null; PEER.hub.forget(code); no('noanswer'); peerChange(); }, 24000);
    peerChange();
  }));
}
// a socket to the host's game, shaped like the local one
function peerConnect(code) {
  const h = PEER.host; if (!h || h.code !== normPeer(code)) throw new Error('not joined');
  const cli = { readyState: 0,
    send(str) { if (cli.readyState === 1 && PEER.host === h) PEER.hub.send(h.code, { k: 'c', d: str }); },
    close() { if (cli.readyState === 3) return; cli.readyState = 3; if (PEER.host === h) peerLeave(); setTimeout(() => cli.onclose && cli.onclose({ code: 1000 }), 0); } };
  h.cli = cli; setTimeout(() => { if (cli.readyState === 0) { cli.readyState = 1; cli.onopen && cli.onopen({}); } }, 0);
  return cli;
}
function peerLeave() {
  return new Promise(ok => {
    const h = PEER.host;
    if (h) { if (h.cli && h.cli.readyState !== 3) h.cli.readyState = 3; PEER.hub.send(h.code, { k: 'bye' }); endVisit('left'); }
    if (PEER.prev) PEER.prev.waits.push(ok); else ok();
  });
}
function peerHostLeaving() { // this page is closing: tell guests, and send their saves home
  if (PEER.host) PEER.hub.send(PEER.host.code, { k: 'bye' });
  for (const c of [...PEER.guests.keys()]) closeGuest(c, 'hostleft');
}
// public lobbies: a host that is open to anyone holds one of a few well-known names; others ask them all
function peerRaw(from, o) {
  if (o.k === 'pq') {
    if (!PEER.pub || PEER.host || o.v !== PEER_V) return;
    const hs = hostSession(); if (!hs || !hs.room) return;
    PEER.hub.raw(from, { k: 'pa', q: o.q, v: PEER_V, n: hs.room.players.size, hn: hs.P.name });
    return;
  }
  if (o.k === 'pa') { for (const f of PEER.finds) if (f.q === o.q && o.v === PEER_V) f.got.set(from, { code: from, n: Math.max(1, o.n | 0), host: String(o.hn || '').slice(0, 16) }); }
}
function peerFind() {
  return new Promise(ok => {
    if (!PEER.hub) return ok([]);
    const f = { q: Math.random().toString(36).slice(2, 10), got: new Map() }; PEER.finds.push(f);
    for (let k = 0; k < PUB_N; k++) PEER.hub.raw(pubName(k), { k: 'pq', q: f.q, v: PEER_V });
    setTimeout(() => { PEER.finds = PEER.finds.filter(x => x !== f); ok([...f.got.values()]); }, 3000);
  });
}
async function peerPublish(on) {
  if (!PEER.hub) return false;
  if (!on) { if (PEER.pub) { PEER.hub.release(PEER.pub); PEER.pub = ''; peerChange(); } return true; }
  if (PEER.pub) return true;
  const order = [...Array(PUB_N).keys()].sort(() => Math.random() - 0.5);
  for (const k of order) { if (await PEER.hub.claim(pubName(k))) { PEER.pub = pubName(k); peerChange(); return true; } }
  return false;
}
function peerKick(code) { if (PEER.guests.has(code)) closeGuest(code, 'kicked'); }
window.RC_PEER = { start: peerStart, info: () => PEER.hub ? peerInfo() : null, join: peerJoin, leave: peerLeave, find: peerFind, publish: peerPublish, connect: peerConnect, kick: peerKick, norm: normPeer, show: showPeer,
  cancel: () => { const J = PEER.joining; if (J) { clearTimeout(J.t); clearInterval(J.iv); PEER.joining = null; PEER.hub.forget(J.code); J.no('cancel'); peerChange(); } },
  lastEnd: () => PEER.lastEnd || '' };

})();

(function () {
'use strict';
const RC = (typeof RCDATA !== 'undefined' ? RCDATA : self.RCDATA);
const TAU = Math.PI * 2, DEG = Math.PI / 180;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t), easeOut = t => 1 - (1 - t) * (1 - t) * (1 - t), easeIn = t => t * t * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const sgn = v => v < 0 ? -1 : 1;
const wrapA = a => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };
const approach = (v, t, d) => v < t ? Math.min(t, v + d) : Math.max(t, v - d);
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const madd = (a, b, s) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
const norm = a => { const l = len(a); return l > 1e-9 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 1, 0]; };
const vlerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const dist = (a, b) => { const x = a[0] - b[0], y = a[1] - b[1], z = a[2] - b[2]; return Math.sqrt(x * x + y * y + z * z); };
const dist2 = (a, b) => { const x = a[0] - b[0], z = a[2] - b[2]; return Math.sqrt(x * x + z * z); };
const rotA = (v, k, g) => { const c = Math.cos(g), s = Math.sin(g), d = dot(k, v), x = cross(k, v); return [v[0] * c + x[0] * s + k[0] * d * (1 - c), v[1] * c + x[1] * s + k[1] * d * (1 - c), v[2] * c + x[2] * s + k[2] * d * (1 - c)]; };
const UP = [0, 1, 0];
// heading h: forward = (sin h, 0, cos h); a bigger h turns left
const fwdOf = h => [Math.sin(h), 0, Math.cos(h)];
const rightOf = h => [-Math.cos(h), 0, Math.sin(h)];
const hexc = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]; };
const css = c => 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
const cmul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const cmix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// ---------- matrices (column-major, WebGL style) ----------
const m4 = () => new Float32Array(16);
function persp(o, fy, as, n, f) { const t = 1 / Math.tan(fy / 2), nf = 1 / (n - f); o.fill(0); o[0] = t / as; o[5] = t; o[10] = (f + n) * nf; o[11] = -1; o[14] = 2 * f * n * nf; return o; }
function lookAt(o, e, c, up) {
  let z0 = e[0] - c[0], z1 = e[1] - c[1], z2 = e[2] - c[2]; let l = 1 / (Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2) || 1); z0 *= l; z1 *= l; z2 *= l;
  let x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0; l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!l) { x0 = 1; x1 = x2 = 0; } else { l = 1 / l; x0 *= l; x1 *= l; x2 *= l; }
  let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0; l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2) || 1; y0 /= l; y1 /= l; y2 /= l;
  o[0] = x0; o[1] = y0; o[2] = z0; o[3] = 0; o[4] = x1; o[5] = y1; o[6] = z1; o[7] = 0; o[8] = x2; o[9] = y2; o[10] = z2; o[11] = 0;
  o[12] = -(x0 * e[0] + x1 * e[1] + x2 * e[2]); o[13] = -(y0 * e[0] + y1 * e[1] + y2 * e[2]); o[14] = -(z0 * e[0] + z1 * e[1] + z2 * e[2]); o[15] = 1; return o;
}
function mmul(o, a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  for (let i = 0; i < 4; i++) { const b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
    o[i * 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; o[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    o[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; o[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33; }
  return o;
}
function minv(o, a) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; if (!det) return o; det = 1 / det;
  o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return o;
}
// Model matrix from a basis. Meshes face +z (front), +y is up and +x is the mesh's left side, as in ORIONFALL.
function model(o, p, f, u, sx, sy, sz) {
  const r = cross(u, f);
  sy = sy == null ? sx : sy; sz = sz == null ? sx : sz;
  o[0] = r[0] * sx; o[1] = r[1] * sx; o[2] = r[2] * sx; o[3] = 0; o[4] = u[0] * sy; o[5] = u[1] * sy; o[6] = u[2] * sy; o[7] = 0;
  o[8] = f[0] * sz; o[9] = f[1] * sz; o[10] = f[2] * sz; o[11] = 0; o[12] = p[0]; o[13] = p[1]; o[14] = p[2]; o[15] = 1; return o;
}
// an orthonormal (forward, up) pair from a heading and a surface normal
function frameOf(h, n) { const f0 = fwdOf(h); const f = norm(sub(f0, mul(n, dot(f0, n)))); return [f, n]; }
function xform(M, p) { return [M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12], M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13], M[2] * p[0] + M[6] * p[1] + M[10] * p[2] + M[14]]; }
function project(M, p) { const x = p[0], y = p[1], z = p[2]; return [M[0] * x + M[4] * y + M[8] * z + M[12], M[1] * x + M[5] * y + M[9] * z + M[13], M[2] * x + M[6] * y + M[10] * z + M[14], M[3] * x + M[7] * y + M[11] * z + M[15]]; }
function frustum(VP) {
  const m = VP, P = [];
  const pl = (a, b, c, d) => { const l = Math.sqrt(a * a + b * b + c * c) || 1; P.push([a / l, b / l, c / l, d / l]); };
  pl(m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]); pl(m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]);
  pl(m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]); pl(m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]);
  pl(m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14]);
  return P;
}
function boxVisible(P, mn, mx) {
  for (const p of P) { const x = p[0] > 0 ? mx[0] : mn[0], y = p[1] > 0 ? mx[1] : mn[1], z = p[2] > 0 ? mx[2] : mn[2]; if (p[0] * x + p[1] * y + p[2] * z + p[3] < 0) return false; }
  return true;
}
function sphereVisible(P, c, r) { for (const p of P) if (p[0] * c[0] + p[1] * c[1] + p[2] * c[2] + p[3] < -r) return false; return true; }

// ---------- noise ----------
const PERM = new Uint8Array(512);
(function () { const r = mulberry(20261107), p = []; for (let i = 0; i < 256; i++) p.push(i); for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; } for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]; })();
const hsh2 = (x, y) => PERM[(PERM[x & 255] + y) & 255] / 255;
function vnoise2(x, y) {
  const X = Math.floor(x), Y = Math.floor(y), fx = x - X, fy = y - Y, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return lerp(lerp(hsh2(X, Y), hsh2(X + 1, Y), u), lerp(hsh2(X, Y + 1), hsh2(X + 1, Y + 1), u), v);
}
function fbm2(x, y, oct) { let s = 0, a = 0.5, n = 0; for (let i = 0; i < (oct || 4); i++) { s += a * vnoise2(x, y); n += a; x = x * 2.03 + 17.1; y = y * 2.03 + 5.3; a *= 0.5; } return s / n; }
function ridge2(x, y, oct) { let s = 0, a = 0.5, n = 0; for (let i = 0; i < (oct || 4); i++) { s += a * (1 - Math.abs(vnoise2(x, y) * 2 - 1)); n += a; x = x * 2.1 + 3.7; y = y * 2.1 + 9.2; a *= 0.5; } return s / n; }


const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ORD = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const { RARITIES, RI, SPECIES, SP, FIELDS, FI, MUTATIONS, EVENTS, RODS, ROD, POTIONS, POT, EGGS, EGG, COSMETICS, COS, ACHIEVEMENTS, ACH, STATIONS, ST, PORTALS, LOBBY } = RC;
const fmtMoney = RC.fmtMoney, fmtN = RC.fmtN, fmtDur = RC.fmtDur;


  // ===================== styles =====================
  const CSS = `
.rc{position:absolute;inset:0;overflow:hidden;background:#0d1020;color:#2b1d3a;font-family:"Fredoka","Baloo 2","Nunito","Arial Rounded MT Bold",system-ui,sans-serif;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;--ink:#2b1d3a;--cream:#fff8ec;--cheese:#ffd23a;--orange:#ff9f1a;--purple:#7a4dff;--green:#45c95c;--red:#ff5a5a;--blue:#3fa9ff;--pink:#ff6fb5}
.rc *{box-sizing:border-box}
.rc canvas.rc-3d,.rc canvas.rc-2d{position:absolute;inset:0;width:100%;height:100%;display:block}
.rc canvas.rc-2d{pointer-events:none}
.rc-ui{position:absolute;inset:0;pointer-events:none}
.rc-ui>*{pointer-events:auto}
.rc-ui .rc-pass{pointer-events:none}
.rc button{font:inherit;color:inherit;cursor:pointer}
.rc [hidden]{display:none!important}
/* chunky buttons */
.rc-b{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 18px;border:3px solid var(--ink);border-radius:16px;background:#fff;color:var(--ink);font-weight:700;font-size:16px;line-height:1.1;box-shadow:0 4px 0 var(--ink);transition:transform .08s,box-shadow .08s,filter .1s;white-space:nowrap}
.rc-b:hover{filter:brightness(1.06)}
.rc-b:active,.rc-b.press{transform:translateY(3px);box-shadow:0 1px 0 var(--ink)}
.rc-b[disabled]{opacity:.5;cursor:default;transform:none;box-shadow:0 4px 0 var(--ink)}
.rc-b.y{background:var(--cheese)}.rc-b.o{background:var(--orange);color:#fff}.rc-b.g{background:var(--green);color:#fff}.rc-b.r{background:var(--red);color:#fff}.rc-b.p{background:var(--purple);color:#fff}.rc-b.bl{background:var(--blue);color:#fff}.rc-b.k{background:#3a2c4f;color:#fff}
.rc-b.sm{padding:6px 12px;font-size:14px;border-radius:12px;box-shadow:0 3px 0 var(--ink)}
.rc-b.xs{padding:3px 8px;font-size:12px;border-radius:10px;border-width:2px;box-shadow:0 2px 0 var(--ink)}
.rc-b.wide{width:100%}
.rc-b.sel{outline:4px solid #fff;outline-offset:2px}
/* HUD */
.rc-hud-tl{position:absolute;left:14px;top:12px;display:grid;gap:8px;pointer-events:none}
.rc-money{display:flex;align-items:center;gap:10px;padding:6px 16px 6px 8px;border:3px solid var(--ink);border-radius:999px;background:linear-gradient(#ffe066,#ffc21a);box-shadow:0 4px 0 var(--ink);font-weight:700;font-size:24px;color:var(--ink);min-width:150px}
.rc-money i{width:34px;height:34px;border-radius:50%;border:3px solid var(--ink);background:radial-gradient(circle at 35% 35%,#fff6c2,#ffcf1a 55%,#e8a200);display:grid;place-items:center;font-style:normal;font-size:18px}
.rc-money small{display:block;font-size:13px;font-weight:600;margin-top:-3px;color:#5a3d00}
.rc-lvl{display:flex;align-items:center;gap:8px}
.rc-lvl b{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;border:3px solid var(--ink);background:var(--purple);color:#fff;font-size:18px;box-shadow:0 3px 0 var(--ink)}
.rc-xp{width:150px;height:16px;border:3px solid var(--ink);border-radius:999px;background:#fff;overflow:hidden;box-shadow:0 3px 0 var(--ink)}
.rc-xp i{display:block;height:100%;background:linear-gradient(90deg,#9a7bff,#c9a8ff);border-radius:999px}
.rc-lvl small{font-weight:700;color:#fff;text-shadow:0 2px 0 var(--ink),0 0 6px rgba(0,0,0,.6);font-size:13px}
.rc-effects{display:flex;gap:6px;flex-wrap:wrap;max-width:260px}
.rc-effects span{display:flex;align-items:center;gap:4px;padding:3px 9px;border:2px solid var(--ink);border-radius:999px;background:#fff;font-size:12px;font-weight:700;box-shadow:0 2px 0 var(--ink)}
.rc-effects span i{width:10px;height:10px;border-radius:50%;border:2px solid var(--ink);display:inline-block}
.rc-hud-tr{position:absolute;right:12px;top:12px;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.rc-where{padding:6px 14px;border:3px solid var(--ink);border-radius:14px;background:#fff;font-weight:700;font-size:15px;box-shadow:0 3px 0 var(--ink);text-align:right;pointer-events:none}
.rc-where small{display:block;font-size:12px;font-weight:600;color:#6a5a7a}
.rc-menu{display:grid;grid-template-columns:repeat(2,auto);gap:19px 9px}
.rc-ib{display:grid;place-items:center;width:52px;height:52px;border:3px solid var(--ink);border-radius:16px;background:#fff;box-shadow:0 4px 0 var(--ink);font-size:22px;position:relative}
.rc-ib:active{transform:translateY(3px);box-shadow:0 1px 0 var(--ink)}
.rc-ib small{position:absolute;bottom:-2px;left:50%;transform:translate(-50%,100%);font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 0 var(--ink),0 0 4px #000;white-space:nowrap;pointer-events:none}
.rc-ib .dot{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;border:2px solid var(--ink);border-radius:999px;background:var(--red);color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center}
.rc-events{position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:60%;pointer-events:none}
.rc-events span{padding:5px 12px;border:3px solid var(--ink);border-radius:999px;background:var(--c,#fff);font-weight:700;font-size:14px;box-shadow:0 3px 0 var(--ink);animation:rcPulse 2s infinite}
@keyframes rcPulse{50%{transform:scale(1.05)}}
.rc-ann{position:absolute;left:50%;top:58px;transform:translateX(-50%);display:grid;gap:8px;justify-items:center;width:min(760px,92%);pointer-events:none}
.rc-ann div{padding:12px 24px;border:4px solid var(--ink);border-radius:20px;background:var(--c,#fff);color:var(--ink);font-weight:700;font-size:20px;text-align:center;box-shadow:0 5px 0 var(--ink);animation:rcDrop .45s cubic-bezier(.2,1.6,.4,1)}
.rc-ann div small{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
.rc-ann div.out{animation:rcUp .4s forwards}
@keyframes rcDrop{from{transform:translateY(-40px) scale(.8);opacity:0}}
@keyframes rcUp{to{transform:translateY(-30px);opacity:0}}
.rc-chat{position:absolute;left:14px;top:150px;width:min(360px,46vw);display:grid;gap:6px;pointer-events:none;z-index:2}.rc-chatlog{display:grid;gap:3px;max-height:170px;overflow:hidden;font:600 14px/1.3 Fredoka,sans-serif;color:#fff}.rc-chat.open .rc-chatlog{max-height:300px;overflow-y:auto;pointer-events:auto;background:rgba(43,29,58,.55);border-radius:12px;padding:8px}.rc-chatlog p{margin:0;padding:3px 8px;border-radius:9px;background:rgba(43,29,58,.62);text-shadow:0 1px 0 #2b1d3a;justify-self:start;word-break:break-word}.rc-chatlog p.sys{background:rgba(63,169,255,.6);font-weight:500}.rc-chatlog b{font-weight:700;filter:brightness(1.35)}.rc-chatin{display:flex;gap:6px;pointer-events:auto}.rc-chatin input{flex:1;min-width:0;font:600 15px Fredoka,sans-serif;padding:8px 12px;border-radius:12px;border:3px solid #2b1d3a;outline:none}.rc-chatbar{display:flex;gap:6px;pointer-events:auto}.rc-cb{display:flex;align-items:center;gap:5px;font:600 13px Fredoka,sans-serif;padding:5px 10px;border-radius:12px;border:3px solid #2b1d3a;background:rgba(255,255,255,.92);color:#2b1d3a;cursor:pointer;touch-action:none;user-select:none}.rc-cb small{font-size:12px}.rc-cb.on{background:#c9f5cf}.rc-cb.talk{background:#5fdc6a;color:#fff}@media (max-width:700px),(max-height:500px){.rc-chat{top:118px;width:min(300px,60vw)}.rc-chatlog{font-size:12.5px;max-height:120px}.rc-cb small{display:none}}.rc-toasts{position:absolute;left:14px;bottom:14px;display:grid;gap:8px;width:min(360px,80%);pointer-events:none}
.rc-toast{display:flex;gap:10px;align-items:center;padding:10px 14px;border:3px solid var(--ink);border-radius:16px;background:#fff;box-shadow:0 4px 0 var(--ink);font-weight:700;font-size:15px;animation:rcIn .3s cubic-bezier(.2,1.5,.4,1);pointer-events:auto}
.rc-toast small{display:block;font-weight:600;font-size:13px;color:#6a5a7a}
.rc-toast .ic{font-size:24px}
.rc-toast.out{animation:rcOut .35s forwards}
@keyframes rcIn{from{transform:translateX(-40px);opacity:0}}
@keyframes rcOut{to{transform:translateX(-40px);opacity:0}}
.rc-prompt{position:absolute;left:50%;bottom:22%;transform:translateX(-50%);padding:10px 18px;border:3px solid var(--ink);border-radius:16px;background:#fff;font-weight:700;font-size:18px;box-shadow:0 4px 0 var(--ink);pointer-events:none;display:flex;gap:10px;align-items:center}
.rc-prompt kbd{display:grid;place-items:center;min-width:32px;height:32px;border:3px solid var(--ink);border-radius:10px;background:var(--cheese);font:inherit;font-size:16px}
.rc-bottom{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;gap:8px;pointer-events:none}
.rc-hint{padding:6px 12px;border-radius:12px;background:rgba(20,12,36,.55);color:#fff;font-size:13px;font-weight:600}
.rc-hint kbd{font:inherit;font-weight:700;padding:1px 6px;border-radius:6px;background:rgba(255,255,255,.2);margin:0 2px}
/* catching */
.rc-catch{position:absolute;left:50%;top:50%;transform:translate(-50%,64px);display:grid;justify-items:center;gap:4px;pointer-events:none}
.rc-catch b{padding:4px 14px;border:3px solid var(--ink);border-radius:999px;background:#fff;font-size:17px;box-shadow:0 3px 0 var(--ink)}
.rc-catch small{color:#fff;font-weight:700;text-shadow:0 2px 0 var(--ink),0 0 6px #000}
.rc-big{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);display:grid;justify-items:center;gap:6px;pointer-events:none;text-align:center}
.rc-big b{font-size:52px;font-weight:700;color:#fff;-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;text-shadow:0 6px 0 var(--ink);animation:rcPop .5s cubic-bezier(.2,1.8,.4,1)}
.rc-big span{padding:6px 16px;border:3px solid var(--ink);border-radius:999px;background:var(--c,#fff);font-size:20px;font-weight:700;box-shadow:0 4px 0 var(--ink);animation:rcPop .6s .08s cubic-bezier(.2,1.8,.4,1) backwards}
@keyframes rcPop{from{transform:scale(.3);opacity:0}}
/* windows */
.rc-modal{position:absolute;inset:0;display:grid;place-items:center;padding:16px;background:rgba(20,12,36,.45);backdrop-filter:blur(2px);z-index:5;animation:rcFade .15s}
@keyframes rcFade{from{opacity:0}}
.rc-win{position:relative;display:flex;flex-direction:column;width:min(980px,100%);max-height:min(760px,100%);border:4px solid var(--ink);border-radius:26px;background:var(--cream);box-shadow:0 8px 0 var(--ink),0 30px 60px rgba(0,0,0,.35);animation:rcWin .25s cubic-bezier(.2,1.4,.4,1);overflow:hidden}
.rc-win.narrow{width:min(520px,100%)}
.rc-win.mid{width:min(760px,100%)}
@keyframes rcWin{from{transform:scale(.85);opacity:0}}
.rc-wh{display:flex;align-items:center;gap:12px;padding:12px 14px 12px 18px;background:var(--hc,var(--orange));border-bottom:4px solid var(--ink);color:#fff}
.rc-wh .ic{font-size:28px;filter:drop-shadow(0 2px 0 var(--ink))}
.rc-wh h2{flex:1;margin:0;font-size:26px;font-weight:700;-webkit-text-stroke:2px var(--ink);paint-order:stroke fill;text-shadow:0 3px 0 var(--ink);letter-spacing:.01em}
.rc-wh h2 small{display:block;font-size:13px;-webkit-text-stroke:0;text-shadow:none;font-weight:600;opacity:.95}
.rc-x{width:44px;height:44px;border:3px solid var(--ink);border-radius:14px;background:var(--red);color:#fff;font-size:22px;font-weight:700;box-shadow:0 3px 0 var(--ink);display:grid;place-items:center}
.rc-tabs{display:flex;gap:6px;padding:10px 14px 0;flex-wrap:wrap;background:var(--cream)}
.rc-tabs button{padding:7px 14px;border:3px solid var(--ink);border-bottom:0;border-radius:14px 14px 0 0;background:#efe3cf;font-weight:700;font-size:14px}
.rc-tabs button.on{background:#fff;transform:translateY(3px)}
.rc-body{flex:1;overflow:auto;padding:14px 16px 18px;background:#fff;border-top:3px solid var(--ink);scrollbar-width:thin}
.rc-body.nt{border-top:0}
.rc-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.rc-row.end{justify-content:flex-end}
.rc-sp{flex:1}
.rc-note{margin:0;font-size:14px;font-weight:500;color:#5e4e70;line-height:1.45}
.rc-h3{margin:4px 0 8px;font-size:18px;font-weight:700}
.rc-pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border:2px solid var(--ink);border-radius:999px;background:var(--c,#fff);font-size:12px;font-weight:700;white-space:nowrap}
/* rat cards */
.rc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px}
.rc-card{position:relative;display:grid;justify-items:center;gap:2px;padding:8px 6px 8px;border:3px solid var(--ink);border-radius:18px;background:linear-gradient(180deg,#fff 40%,color-mix(in srgb,var(--rc,#ccc) 28%,#fff));box-shadow:0 3px 0 var(--ink);text-align:center;cursor:pointer;min-width:0}
.rc-card:hover{transform:translateY(-2px)}
.rc-card.on{outline:4px solid var(--blue);outline-offset:1px}
.rc-card.dim{opacity:.45}
.rc-card img{width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 3px 2px rgba(0,0,0,.25))}
.rc-card b{font-size:13px;line-height:1.15;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-card small{font-size:11px;font-weight:700;color:var(--rc);-webkit-text-stroke:.3px var(--ink)}
.rc-card .tl{position:absolute;left:6px;top:4px;display:flex;flex-direction:column;gap:2px;font-size:15px}
.rc-card .tr{position:absolute;right:6px;top:4px;font-size:11px;font-weight:700;padding:1px 6px;border:2px solid var(--ink);border-radius:999px;background:#fff}
.rc-card .mu{display:flex;gap:2px;justify-content:center;flex-wrap:wrap;min-height:14px}
.rc-card .mu i{width:12px;height:12px;border-radius:50%;border:2px solid var(--ink);background:var(--c);display:inline-block}
.rc-card .earn{font-size:11px;font-weight:700;color:#2a8a3a}
.rc-empty{display:grid;place-items:center;gap:6px;padding:30px;border:3px dashed #c9b9a6;border-radius:18px;color:#8a7a6a;text-align:center;font-weight:600}
/* rat detail */
.rc-det{display:grid;grid-template-columns:minmax(0,240px) minmax(0,1fr);gap:16px}
.rc-det .pic{position:relative;display:grid;place-items:center;border:3px solid var(--ink);border-radius:22px;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--rc) 35%,#fff),#fff 70%);aspect-ratio:1;box-shadow:0 4px 0 var(--ink)}
.rc-det .pic img{width:92%;height:92%;object-fit:contain}
.rc-det h3{margin:0;font-size:24px}
.rc-break{display:grid;gap:4px;padding:10px 12px;border:3px solid var(--ink);border-radius:16px;background:#fbf6ee;font-size:14px;font-weight:600}
.rc-break div{display:flex;justify-content:space-between;gap:10px}
.rc-break .tot{border-top:2px dashed #c9b9a6;padding-top:5px;font-size:17px;font-weight:700;color:#1d7a2e}
.rc-bar{height:14px;border:3px solid var(--ink);border-radius:999px;background:#fff;overflow:hidden}
.rc-bar i{display:block;height:100%;background:linear-gradient(90deg,#5fdc6a,#a8f0a0)}
/* lists */
.rc-list{display:grid;gap:8px}
.rc-li{display:flex;align-items:center;gap:12px;padding:10px 12px;border:3px solid var(--ink);border-radius:16px;background:#fff;box-shadow:0 3px 0 var(--ink)}
.rc-li.done{background:#e9fbe8}
.rc-li .ic{font-size:26px;width:40px;text-align:center}
.rc-li .t{flex:1;min-width:0}
.rc-li .t b{display:block;font-size:15px}
.rc-li .t small{display:block;font-size:13px;font-weight:500;color:#6a5a7a}
.rc-li .rc-bar{margin-top:4px}
.rc-shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
.rc-item{display:grid;gap:6px;padding:12px;border:3px solid var(--ink);border-radius:18px;background:#fff;box-shadow:0 3px 0 var(--ink);align-content:start}
.rc-item .ic{display:grid;place-items:center;height:64px;font-size:40px;border-radius:12px;background:color-mix(in srgb,var(--c,#ffd23a) 30%,#fff)}
.rc-item b{font-size:16px}
.rc-item small{font-size:12.5px;font-weight:500;color:#6a5a7a;line-height:1.35}
.rc-item .pr{font-weight:700;color:#1d7a2e}
.rc-item.own{background:#f0fbef}
.rc-odds{display:grid;gap:3px;font-size:13px;font-weight:600}
.rc-odds div{display:flex;justify-content:space-between;gap:8px;padding:2px 8px;border-radius:8px;background:color-mix(in srgb,var(--c) 22%,#fff)}
/* forms */
.rc-in{width:100%;padding:11px 14px;border:3px solid var(--ink);border-radius:14px;background:#fff;font:inherit;font-size:17px;font-weight:600;color:var(--ink);outline:none}
.rc-in:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(122,77,255,.25)}
.rc-label{font-size:13px;font-weight:700;color:#6a5a7a;margin:2px 0 -4px}
.rc-seg{display:inline-flex;border:3px solid var(--ink);border-radius:14px;overflow:hidden;box-shadow:0 3px 0 var(--ink)}
.rc-seg button{border:0;padding:7px 12px;background:#fff;font-weight:700;font-size:14px;border-right:2px solid var(--ink)}
.rc-seg button:last-child{border-right:0}
.rc-seg button.on{background:var(--cheese)}
/* trading */
.rc-trade{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.rc-trade .side{display:grid;gap:8px;align-content:start;padding:10px;border:3px solid var(--ink);border-radius:18px;background:#fbf6ee;min-height:200px}
.rc-trade .side.ready{background:#e9fbe8}
.rc-trade .side h4{margin:0;font-size:16px;display:flex;justify-content:space-between;align-items:center}
.rc-count{font-size:44px;font-weight:700;text-align:center;color:var(--orange);-webkit-text-stroke:2px var(--ink);paint-order:stroke fill;animation:rcPulse .5s infinite}
/* login */
.rc-login{position:absolute;inset:0;display:grid;place-items:center;padding:16px;z-index:6;background:radial-gradient(circle at 50% 30%,rgba(255,210,58,.25),rgba(20,12,36,.55))}
.rc-logo{font-size:min(72px,13vw);font-weight:700;color:var(--cheese);-webkit-text-stroke:5px var(--ink);paint-order:stroke fill;text-shadow:0 8px 0 var(--ink);letter-spacing:.02em;line-height:.95;text-align:center;transform:rotate(-3deg);margin-bottom:6px}
.rc-logo small{display:block;font-size:.3em;color:#fff;-webkit-text-stroke:2px var(--ink);letter-spacing:.2em;margin-top:8px}
.rc-err{padding:8px 12px;border:3px solid var(--ink);border-radius:12px;background:#ffe0e0;font-weight:600;font-size:14px}
.rc-load{position:absolute;inset:0;display:grid;place-items:center;z-index:7;background:#ffcf3a}
.rc-load .rc-logo{animation:rcPulse 1.4s infinite}
.rc-fade{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .25s;z-index:4}
.rc-fade.on{opacity:1}
/* egg opening */
.rc-egg{position:absolute;inset:0;z-index:8;display:grid;place-items:center;background:radial-gradient(circle,rgba(255,240,200,.95),rgba(40,20,60,.92) 70%);overflow:hidden}
.rc-egg canvas{position:absolute;inset:0;width:100%;height:100%}
.rc-egg .res{position:relative;display:grid;justify-items:center;gap:8px;text-align:center}
.rc-egg .res img{width:min(280px,60vw);height:min(280px,60vw);object-fit:contain;animation:rcPop .7s cubic-bezier(.2,1.8,.4,1)}
.rc-egg .res b{font-size:40px;color:#fff;-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;text-shadow:0 5px 0 var(--ink)}
.rc-confirm p{margin:0 0 12px;font-size:17px;font-weight:600;line-height:1.4}
.rc-kbd{display:inline-grid;place-items:center;min-width:26px;padding:0 6px;height:24px;border:2px solid var(--ink);border-radius:8px;background:#fff;font-size:13px;font-weight:700}
.rc-lb{display:grid;gap:6px}
.rc-lb div{display:grid;grid-template-columns:44px 36px 1fr auto;gap:10px;align-items:center;padding:6px 10px;border:3px solid var(--ink);border-radius:14px;background:#fff}
.rc-lb div.me{background:#fff3c4}
.rc-lb .rk{font-size:18px;font-weight:700;text-align:center}
.rc-lb .av{width:34px;height:34px;border-radius:50%;border:3px solid var(--ink);display:grid;place-items:center;color:#fff;font-weight:700}
.rc-idx{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.rc-idx .rc-card.unk img{filter:brightness(0) opacity(.35)}
.rc-cos{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}
.rc-cos button{display:grid;justify-items:center;gap:3px;padding:8px 6px;border:3px solid var(--ink);border-radius:14px;background:#fff;font-weight:700;font-size:12px;box-shadow:0 2px 0 var(--ink)}
.rc-cos button.on{background:#fff3c4}
.rc-cos button i{font-style:normal;font-size:26px}
@media (max-width:760px){.rc-det,.rc-trade{grid-template-columns:1fr}.rc-det .pic{max-width:220px;justify-self:center;width:100%}.rc-money{font-size:19px;min-width:0}.rc-xp{width:110px}.rc-wh h2{font-size:21px}}
@media (max-height:520px){.rc-win{max-height:100%}.rc-wh{padding:8px 12px}.rc-wh h2{font-size:20px}}
`;


  // ===================== start =====================
  window.RATCATCHERS = function (root, opts) {
    opts = opts || {};
    const doc = root.ownerDocument || document, win = doc.defaultView || window;
    let alive = true;
    if (!doc.getElementById('rc-style')) { const st = doc.createElement('style'); st.id = 'rc-style'; st.textContent = CSS; (doc.head || doc.documentElement).appendChild(st); }
    if (!doc.getElementById('rc-font') && opts.fonts !== false) { try { const l = doc.createElement('link'); l.id = 'rc-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap'; doc.head.appendChild(l); } catch (e) {} }
    const el = (tag, cls, parent, html) => { const e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
    const wrap = el('div', 'rc', root); wrap.tabIndex = -1; wrap.setAttribute('role', 'application'); wrap.setAttribute('aria-label', 'RAT CATCHERS');
    const cv = el('canvas', 'rc-3d', wrap), c2 = el('canvas', 'rc-2d', wrap), x2 = c2.getContext('2d');
    const ui = el('div', 'rc-ui', wrap), fadeEl = el('div', 'rc-fade', wrap);
    const loadEl = el('div', 'rc-load', wrap, '<div><div class="rc-logo">RAT<br>CATCHERS<small>AN ORION ORIGINAL</small></div></div>');

    // ---------- local settings (game progress lives on the server) ----------
    const LSK = 'ratcatchers';
    const store = Object.assign({ server: '', tokens: {}, vol: 0.8, music: 0.55, sens: 1, invertY: false, quality: 'auto', room: '', seenHelp: 0 }, (() => { try { return JSON.parse(win.localStorage.getItem(LSK) || '{}'); } catch (e) { return {}; } })());
    function persist() { try { win.localStorage.setItem(LSK, JSON.stringify(store)); } catch (e) {} }
    function fatal(msg) { loadEl.hidden = true; el('div', 'rc-login', wrap, '<div class="rc-win narrow" style="padding:22px"><div class="rc-logo" style="font-size:44px">RAT CATCHERS</div><p class="rc-note" style="font-size:17px;text-align:center">' + esc(msg) + '</p></div>'); }


  // ===================== WebGL =====================
  // WebGL 2 when the browser has it (for smooth edges with the glow and colour pass), WebGL 1 otherwise.
  let gl = null, GL2 = false;
  // (automated tests run on a software renderer, where the multisampled canvas costs most of the frame: they turn it off)
  const CTXO = { antialias: !opts.noAA, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.test };
  try {
    if (!opts.gl1) { gl = cv.getContext('webgl2', CTXO); GL2 = !!gl; }
    if (!gl) gl = cv.getContext('webgl', CTXO) || cv.getContext('experimental-webgl', CTXO);
  } catch (e) { gl = null; GL2 = false; }
  if (!gl) { fatal("This device can't show 3D graphics, so RAT CATCHERS can't start here."); return { destroy() { alive = false; try { root.removeChild(wrap); } catch (e) {} } }; }
  const HI = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
  // material ids (vertex attribute aX.x)
  const M = { PLAIN: 0, GRASS: 1, PATH: 2, WATER: 3, LAVA: 4, ICE: 5, SNOW: 6, CRYSTAL: 7, CLOUD: 8, VOID: 9, GLOSS: 10, TEX: 11, GLASS: 12, ROCK: 13, GLOW: 14, WOOD: 15, METAL: 16, LEAF: 17, FUR: 18, PORTAL: 19, SAND: 20, MOSS: 21, GOLD: 22, NEON: 23 };
  // ---------- shader pieces shared by several programs ----------
  // sun shadows: depth packed into RGBA, four taps blended for soft edges, fading out at the edge of the shadow box
  const G_SHADOW = 'uniform sampler2D uSM;uniform vec3 uSMI;' +
    'float unpackD(vec4 v){return dot(v,vec4(1.0,1.0/255.0,1.0/65025.0,1.0/16581375.0));}' +
    'float shadowAt(vec3 s,float bias){if(uSMI.z<0.5)return 1.0;vec2 e=abs(s.xy-0.5);float em=max(e.x,e.y);if(em>0.499||s.z>0.999)return 1.0;' +
    'vec2 st=s.xy*uSMI.y-0.5;vec2 f=fract(st);vec2 b=(floor(st)+0.5)*uSMI.x;float z=s.z-bias;' +
    'float a0=step(z,unpackD(texture2D(uSM,b)));float a1=step(z,unpackD(texture2D(uSM,b+vec2(uSMI.x,0.0))));' +
    'float a2=step(z,unpackD(texture2D(uSM,b+vec2(0.0,uSMI.x))));float a3=step(z,unpackD(texture2D(uSM,b+uSMI.xx)));' +
    'return mix(mix(mix(a0,a1,f.x),mix(a2,a3,f.x),f.y),1.0,smoothstep(0.43,0.499,em));}';
  // the ground's height from the area's height texture (same triangles as the ground mesh)
  const G_HM = 'uniform sampler2D uHM;uniform vec4 uHMI;' +
    'vec4 hmTex(vec2 ij){return texture2D(uHM,(ij+0.5)/uHMI.w);}' +
    'float hmDec(vec4 t){return (t.r*65280.0+t.g*255.0)/65535.0*128.0-64.0;}' +
    'float hmTri(vec2 f,float ha,float hb,float hc,float hd){return f.y>f.x?ha+f.x*(hc-hd)+f.y*(hd-ha):ha+f.x*(hb-ha)+f.y*(hc-hb);}' +
    'float hmH(vec2 xz){vec2 g=(xz-uHMI.xy)*uHMI.z;vec2 i=clamp(floor(g),vec2(0.0),vec2(uHMI.w-2.0));vec2 f=clamp(g-i,0.0,1.0);' +
    'return hmTri(f,hmDec(hmTex(i)),hmDec(hmTex(i+vec2(1.0,0.0))),hmDec(hmTex(i+vec2(1.0,1.0))),hmDec(hmTex(i+vec2(0.0,1.0))));}';
  // fog that picks up a little sunlight when you look towards the sun, and a gentle tone curve so bright things roll off instead of going flat white
  const G_FOG = 'vec3 fogC(vec3 c,vec3 w,out float k){vec3 d=w-uCam;float l=max(length(d),0.001);float fd=l*uFogD;k=clamp(1.0-exp(-fd*fd),0.0,1.0);' +
    'float s=pow(max(dot(d/l,uSun),0.0),8.0);return mix(c,uFog+uSunC*(s*0.16),k);}';
  const G_TONE = 'uniform float uExpo;vec3 tone(vec3 c){c=max(c*uExpo,0.0);vec3 k=vec3(0.62);vec3 h=k+(1.0-k)*(1.0-exp(-(c-k)/(1.0-k)));return mix(c,h,step(k,c));}';
  const NOISE = 'float h21(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}' +
    'float vn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h21(i),h21(i+vec2(1.0,0.0)),f.x),mix(h21(i+vec2(0.0,1.0)),h21(i+vec2(1.0,1.0)),f.x),f.y);}' +
    'vec3 hue(float h){return clamp(abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);}';
  // ---------- the world shader: every solid thing ----------
  const VS_W = 'attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;attribute vec2 aU;attribute vec2 aX;uniform mat4 uM;uniform mat4 uVP;uniform mat4 uSVP;uniform float uSMO;' +
    'varying vec3 vW;varying vec3 vN;varying vec3 vC;varying vec2 vU;varying vec2 vX;varying vec3 vL;varying vec3 vS;' +
    'void main(){vec4 w=uM*vec4(aP,1.0);vW=w.xyz;vN=(uM*vec4(aN,0.0)).xyz;vC=aC;vU=aU;vX=aX;vL=aP;vec3 nn=vN/max(length(vN),0.0001);vS=(uSVP*vec4(w.xyz+nn*uSMO,1.0)).xyz;gl_Position=uVP*w;}';
  const FS_W = HI + 'varying vec3 vW;varying vec3 vN;varying vec3 vC;varying vec2 vU;varying vec2 vX;varying vec3 vL;varying vec3 vS;' +
    'uniform vec3 uCam;uniform vec3 uSun;uniform vec3 uSunC;uniform vec3 uSky;uniform vec3 uGnd;uniform vec3 uFog;uniform float uFogD;uniform float uT;uniform float uGlow;' +
    'uniform vec3 uTint;uniform float uEm;uniform float uA;uniform vec3 uFlash;uniform sampler2D uTex;uniform vec4 uLP[4];uniform vec4 uLC[4];uniform float uMut;uniform vec3 uRim;' + NOISE + G_SHADOW + G_HM + G_FOG + G_TONE +
    'void main(){vec3 n=normalize(vN);vec3 V=normalize(uCam-vW);float m=vX.x;if(dot(n,V)<0.0&&abs(m-12.0)>0.5)n=-n;' +
    'vec3 b=vC*uTint;float em=vX.y+uEm;float sp=0.0;float sh=40.0;float al=uA;float rk=0.18;float wrap=0.0;float tr=0.0;' +
    'if(m>0.5){' +
    ' if(m<1.5){float g=vn(vW.xz*0.23)*0.55+vn(vW.xz*1.9)*0.3+vn(vW.xz*7.0)*0.15;b*=0.78+0.36*g;}' +
    // stone tiles: two tones, a little colour per tile, darker grout and a soft polish
    ' else if(m<2.5){vec2 q=vW.xz*0.5;vec2 f=fract(q);vec2 i=floor(q);float t=h21(i);float ck=mod(i.x+i.y,2.0);b*=(0.93+0.1*t-0.07*ck)*(0.94+0.06*vn(vW.xz*2.7));float e=min(min(f.x,1.0-f.x),min(f.y,1.0-f.y));b*=0.66+0.34*smoothstep(0.012,0.045,e);sp=0.32;sh=55.0;rk=0.1;}' +
    // water: shallow water is clear and green-blue, deep water dark; foam where it meets the shore
    ' else if(m<3.5){vec2 q=vW.xz*0.35;float a1=vn(q+uT*0.15),a2=vn(q*1.7-uT*0.11);n=normalize(n+vec3(a1-0.5,0.0,a2-0.5)*0.32);float dep=uHMI.w>0.5?vW.y-hmH(vW.xz):1.2;float dk=smoothstep(0.0,1.8,dep);' +
    '  b=mix(mix(b,vec3(0.3,0.92,0.82),0.4)*1.1,b*0.42,dk);float fr=pow(1.0-max(dot(n,V),0.0),3.0);b=mix(b,uSky*1.1,0.12+0.5*fr);' +
    '  float fo=1.0-smoothstep(0.0,0.22,dep+(vn(vW.xz*2.6+uT*0.45)-0.5)*0.18);b=mix(b,vec3(0.96,1.0,1.0),fo*0.8);al*=clamp(mix(0.55,0.95,dk)+fo*0.4,0.0,1.0);sp=1.5;sh=120.0;rk=0.0;}' +
    ' else if(m<4.5){float f=vn(vW.xz*0.07+uT*vec2(0.02,0.035))*0.55+vn(vW.xz*0.29-uT*0.06)*0.45;b=mix(vec3(0.3,0.03,0.01),vec3(1.0,0.55,0.1),smoothstep(0.36,0.78,f));b=mix(b,vec3(1.0,0.92,0.55),smoothstep(0.74,0.9,f));em+=1.1;}' +
    ' else if(m<5.5){float c=abs(vn(vW.xz*0.45)-0.5);b=mix(b,vec3(0.95,0.99,1.0),(1.0-smoothstep(0.0,0.025,c))*0.7);b*=0.9+0.12*vn(vW.xz*3.0);sp=1.0;sh=80.0;float s=step(0.993,h21(floor(vW.xz*5.0)));em+=s*(0.6+0.4*sin(uT*5.0+vW.x));}' +
    ' else if(m<6.5){b*=0.93+0.09*vn(vW.xz*0.4);float s=step(0.992,h21(floor(vW.xz*7.0)+floor(V.xz*3.0)));em+=s*1.2;wrap=0.3;sp=0.25;sh=30.0;}' +
    ' else if(m<7.5){sp=1.3;sh=90.0;em+=0.35+0.25*sin(uT*2.0+vW.y*2.0+vW.x);rk=0.55;}' +
    ' else if(m<8.5){float g=vn(vW.xz*0.6+uT*0.03)*0.5+vn(vW.xz*2.3)*0.5;b*=mix(vec3(0.88,0.88,1.02),vec3(1.04,1.0,0.94),g);em+=0.1;wrap=0.6;rk=0.45;}' +
    ' else if(m<9.5){vec2 q=vW.xz*0.25;vec2 f=abs(fract(q)-0.5);float ln=1.0-smoothstep(0.0,0.03,min(0.5-f.x,0.5-f.y));float pl=0.5+0.5*sin(uT*1.5-length(vW.xz)*0.12);b=mix(vec3(0.04,0.02,0.09),b,0.25);em+=ln*(0.8+0.6*pl);b+=vec3(0.5,0.2,1.0)*ln*0.4;}' +
    ' else if(m<10.5){sp=0.9;sh=70.0;rk=0.3;}' +
    ' else if(m<11.5){vec4 t=texture2D(uTex,vU);b=t.rgb*vC;}' +
    ' else if(m<12.5){float fr=1.0-abs(dot(n,V));al*=0.16+0.7*fr*fr;sp=1.4;sh=120.0;b*=1.2;}' +
    ' else if(m<13.5){float g=vn(vec2(vW.y*0.75,(vW.x+vW.z)*0.035))*0.6+vn(vW.xz*0.9+vW.y)*0.4;b*=0.72+0.4*g;sp=0.15;sh=20.0;}' +
    ' else if(m<14.5){em+=0.55+0.45*sin(uT*3.2+vU.y*0.25+vW.x*0.3);}' +
    ' else if(m<15.5){float p=fract((vL.y+vL.x*0.15)*3.0);b*=(0.82+0.18*vn(vec2(vL.x*30.0,floor((vL.y+vL.x*0.15)*3.0)*7.0)))*(1.0-0.3*(1.0-smoothstep(0.0,0.1,p)));}' +
    ' else if(m<16.5){sp=1.0;sh=60.0;b*=0.92+0.1*vn(vW.xz*4.0+vW.y);rk=0.35;}' +
    ' else if(m<17.5){b*=0.8+0.3*vn(vW.xz*1.6+vW.y*1.1);wrap=0.45;tr=0.45;sp=0.12;sh=16.0;}' +
    ' else if(m<18.5){float f=vn(vL.xy*38.0+vL.z*11.0)*0.5+vn(vL.zy*24.0)*0.5;b*=0.86+0.22*f;wrap=0.55;rk=0.38;sp=0.14;sh=12.0;tr=0.15;}' +
    ' else if(m<19.5){vec2 c=vU-0.5;float r=length(c)*2.0;float a=atan(c.y,c.x);float sw=sin(a*3.0+r*9.0-uT*4.0)*0.5+0.5;b=mix(vC,vec3(1.0),sw*0.45*(1.0-r));em+=1.1+0.4*sw;al*=1.0-smoothstep(0.82,1.0,r);}' +
    ' else if(m<20.5){float g=vn(vW.xz*3.2)*0.4+vn(vW.xz*0.25)*0.6;b*=0.84+0.24*g;}' +
    ' else if(m<21.5){b*=0.66+0.46*vn(vW.xz*0.9+vW.y*0.5);wrap=0.4;}' +
    ' else if(m<22.5){sp=1.7;sh=60.0;b=mix(b,vec3(1.0,0.86,0.35),0.4);rk=0.6;em+=0.06;}' +
    ' else{em+=0.9+0.3*sin(uT*4.0+vW.x+vW.z);}' +
    '}' +
    // mutations: gold, diamond, rainbow
    'if(uMut>0.5){float l=dot(b,vec3(0.3,0.5,0.2));' +
    ' if(uMut<1.5){b=mix(vec3(1.0,0.72,0.12),vec3(1.0,0.93,0.55),l)*1.05;sp=1.8;sh=50.0;rk=0.7;em+=0.1;}' +
    ' else if(uMut<2.5){b=mix(vec3(0.55,0.85,1.0),vec3(0.95,1.0,1.0),l);sp=2.0;sh=110.0;rk=0.9;float fs=step(0.94,h21(floor(vL.xy*14.0)+floor(uT*3.0)));em+=0.15+fs*1.2;}' +
    ' else{b=hue(fract(vW.y*0.35+vW.x*0.12+uT*0.35))*(0.55+0.6*l)+0.15;sp=0.8;sh=40.0;em+=0.25;rk=0.5;}}' +
    // light: sky and ground bounce, the sun (with shadows), nearby lamps and a rim of sky light
    'float hm=n.y*0.5+0.5;vec3 amb=mix(uGnd,uSky,hm);float nd=dot(n,uSun);float nl=max((nd+wrap)/(1.0+wrap),0.0);' +
    'float sdw=shadowAt(vS,0.0004+0.0009*(1.0-clamp(nd,0.0,1.0)));sdw=mix(1.0,sdw,smoothstep(-0.25,0.08,nd));' +
    'vec3 c=b*(amb+uSunC*nl*sdw);float gw=0.0;' +
    'if(tr>0.0){c+=b*uSunC*(tr*pow(max(dot(-V,uSun),0.0),3.0)*sdw);}' +
    'if(sp>0.0){vec3 H=normalize(uSun+V);vec3 s=uSunC*(sp*pow(max(dot(n,H),0.0),sh)*sdw);c+=s;gw+=dot(s,vec3(0.25));}' +
    'for(int i=0;i<4;i++){vec3 L=uLP[i].xyz-vW;float d=max(length(L),0.001);float at=max(0.0,1.0-d/uLP[i].w);at*=at;c+=uLC[i].rgb*(uLC[i].a*at)*(b*max(dot(n,L/d),0.0)*1.4+0.08);}' +
    'float rim=1.0-max(dot(n,V),0.0);c+=uSky*(rim*rim*rim*rk);vec3 rg=uRim*(rim*rim*1.6);c+=rg;gw+=dot(rg,vec3(0.3));' +
    'c+=b*em;gw+=em*0.5;float fk;c=fogC(c,vW,fk);gw*=1.0-fk;' +
    'gl_FragColor=vec4(tone(c)+uFlash,uGlow>0.5?clamp(gw,0.0,1.0)*al:al);}';
  // ---------- the sky ----------
  const VS_SKY = 'attribute vec2 aQ;varying vec2 vQ;void main(){vQ=aQ;gl_Position=vec4(aQ,0.9999,1.0);}';
  const FS_SKY = HI + 'varying vec2 vQ;uniform mat4 uIVP;uniform vec3 uTop;uniform vec3 uHor;uniform vec3 uBot;uniform vec3 uSunD;uniform vec3 uSunC;uniform float uSunS;uniform float uGlow;' +
    'uniform float uT;uniform float uStars;uniform float uClouds;uniform vec3 uCloudC;uniform float uNeb;uniform float uAur;uniform vec3 uNebA;uniform vec3 uNebB;uniform float uMoon;uniform vec3 uMoonC;uniform float uRainbow;' + NOISE + G_TONE +
    'float h31(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}' +
    'float fb(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=0.5;}return s;}' +
    'void main(){vec4 a=uIVP*vec4(vQ,-1.0,1.0);vec4 b=uIVP*vec4(vQ,1.0,1.0);vec3 w=normalize(b.xyz/b.w-a.xyz/a.w);float y=w.y;' +
    'vec3 col=y>0.0?mix(uHor,uTop,pow(clamp(y,0.0,1.0),0.55)):mix(uHor,uBot,pow(clamp(-y*2.5,0.0,1.0),0.6));' +
    'float sd=max(dot(w,uSunD),0.0);float disc=pow(sd,1400.0)*uSunS;col+=uSunC*(disc*7.0+pow(sd,60.0)*0.35*uSunS+pow(sd,6.0)*0.16);float gw=clamp(disc*3.0+pow(sd,90.0)*0.35*uSunS,0.0,1.0);' +
    'if(uNeb>0.0){vec2 q=vec2(atan(w.x,w.z)*1.6,y*3.2);float f=fb(q*1.3+3.0);float g=fb(q*2.6-7.0);col+=uNebA*smoothstep(0.42,0.85,f)*uNeb+uNebB*smoothstep(0.5,0.9,g)*uNeb*0.8;}' +
    'if(uStars>0.0){vec3 q=w*260.0;vec3 i=floor(q);float h=h31(i);vec3 f=fract(q)-0.5;float s=step(0.9955,h)*(1.0-smoothstep(0.0,0.5,length(f)));s*=0.55+0.45*sin(uT*1.7+h*91.0);s*=uStars*smoothstep(-0.15,0.2,y)*(0.6+0.8*h31(i+4.3));col+=vec3(0.9,0.93,1.0)*s;gw+=s*0.8;}' +
    'if(uAur>0.0&&y>0.0){float x=atan(w.x,w.z);float f=fb(vec2(x*2.2,uT*0.04))*3.0;float band=exp(-pow((y-0.22-0.08*sin(x*3.0+f))*7.0,2.0));float curt=0.6+0.4*sin(x*28.0+f*6.0+uT*0.6);' +
    ' vec3 ac=(vec3(0.12,0.95,0.55)*band*curt+vec3(0.55,0.25,0.95)*exp(-pow((y-0.4-0.06*sin(x*2.0+f))*6.0,2.0))*0.6)*uAur;col+=ac;gw+=dot(ac,vec3(0.3));}' +
    'if(uMoon>0.0){vec3 md=normalize(vec3(-0.35,0.42,0.84));float d=acos(clamp(dot(w,md),-1.0,1.0));float mdisc=1.0-smoothstep(0.085,0.092,d);float cr=vn(w.xy*40.0)*0.25;col=mix(col,uMoonC*(1.0-cr),mdisc*uMoon);col+=uMoonC*exp(-d*7.0)*0.6*uMoon;gw+=mdisc*uMoon*0.55;}' +
    'if(uRainbow>0.0&&y>-0.05){vec3 rd=normalize(vec3(0.0,-0.2,1.0));float d=acos(clamp(dot(w,rd),-1.0,1.0));float t=(d-0.62)/0.09;if(t>0.0&&t<1.0){col=mix(col,hue(t*0.82)*1.2,0.45*uRainbow*sin(t*3.14159));}}' +
    'if(uClouds>0.0&&y>0.0){vec2 cp=w.xz/(y+0.1)*0.9+vec2(uT*0.006,uT*0.002);float c=fb(cp);float m=smoothstep(0.48,0.78,c)*uClouds*smoothstep(0.0,0.2,y);' +
    ' vec3 cc=uCloudC*(0.8+0.32*fb(cp*2.0+5.0))+uSunC*pow(sd,4.0)*0.35;col=mix(col,cc,m);gw*=1.0-m;}' +
    'gl_FragColor=vec4(tone(col),uGlow>0.5?clamp(gw,0.0,1.0):1.0);}';
  // ---------- particles and flat effects ----------
  const VS_Q = 'attribute vec3 aP;attribute vec2 aU;attribute vec4 aC;attribute float aM;uniform mat4 uVP;varying vec2 vU;varying vec4 vC;varying float vM;' +
    'void main(){vU=aU;vC=aC;vM=aM;gl_Position=uVP*vec4(aP,1.0);}';
  const FS_Q = HI + 'varying vec2 vU;varying vec4 vC;varying float vM;void main(){float d=length(vU);float a;vec3 c=vC.rgb;' +
    'if(vM<0.5){float g=clamp(1.0-d,0.0,1.0);a=g*g*(0.55+0.45*g);}' +
    'else if(vM<1.5){float g=clamp(1.0-abs(vU.x),0.0,1.0);a=g*g*(3.0-2.0*g);}' +
    'else if(vM<2.5){a=(1.0-smoothstep(0.55,1.0,d));}' +
    'else if(vM<3.5){a=(1.0-smoothstep(0.86,1.0,d))*smoothstep(0.62,0.8,d);}' +
    'else if(vM<4.5){a=(1.0-smoothstep(0.25,1.0,d));a*=a;}' +
    'else if(vM<5.5){float g=clamp(1.0-d,0.0,1.0);a=pow(g,5.0)+g*0.25;c=mix(c,vec3(1.0),pow(g,8.0));}' +
    'else{vec2 p=abs(vU);float s=max(1.0-smoothstep(0.0,0.18,p.x)*1.0,0.0)*(1.0-p.y)+max(1.0-smoothstep(0.0,0.18,p.y),0.0)*(1.0-p.x);a=clamp(s,0.0,1.0)+pow(max(1.0-d,0.0),6.0);c=mix(c,vec3(1.0),pow(max(1.0-d,0.0),4.0));}' +
    'a*=vC.a;gl_FragColor=vec4(c*a,a);}';
  // ---------- the sun's view for shadows: depth packed into colour ----------
  const VS_D = 'attribute vec3 aP;uniform mat4 uM;uniform mat4 uSVP;void main(){gl_Position=uSVP*(uM*vec4(aP,1.0));}';
  const FS_D = HI + 'void main(){vec4 e=fract(gl_FragCoord.z*vec4(1.0,255.0,65025.0,16581375.0));e-=e.yzww*vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);gl_FragColor=e;}';
  // ---------- cartoon outlines: the back of the mesh pushed out a little ----------
  const VS_O = 'attribute vec3 aP;attribute vec3 aN;uniform mat4 uM;uniform mat4 uVP;uniform vec3 uCam;uniform float uOW;varying vec3 vW;' +
    'void main(){vec4 w=uM*vec4(aP,1.0);vec3 n=(uM*vec4(aN,0.0)).xyz;n/=max(length(n),0.0001);float d=length(uCam-w.xyz);w.xyz+=n*(uOW*clamp(d,0.8,26.0));vW=w.xyz;gl_Position=uVP*w;}';
  const FS_O = HI + 'varying vec3 vW;uniform vec3 uCam;uniform vec3 uSun;uniform vec3 uSunC;uniform vec3 uFog;uniform float uFogD;uniform vec3 uOC;' + G_FOG + G_TONE +
    'void main(){float fk;gl_FragColor=vec4(tone(fogC(uOC,vW,fk)),0.0);}';
  // ---------- grass: one patch of blades repeated around the camera, standing on the height texture ----------
  const VS_G = 'attribute vec4 aG;attribute vec3 aH;uniform mat4 uVP;uniform mat4 uSVP;uniform float uSMO;uniform vec4 uTile;uniform vec3 uCam;uniform vec4 uPush[8];uniform float uT;uniform vec4 uGP;uniform vec3 uG1;uniform vec3 uG2;' +
    'varying vec3 vW;varying vec3 vCol;varying float vT;varying vec3 vS;' + G_HM +
    'void main(){vec2 l=aG.xy;float sy=uTile.w;if(mod(sy,2.0)>0.5)l=l.yx;if(mod(floor(sy*0.5),2.0)>0.5)l.x=uTile.z-l.x;if(sy>3.5)l.y=uTile.z-l.y;vec2 wp=uTile.xy+l;' +
    'vec2 g=(wp-uHMI.xy)*uHMI.z;vec2 i=clamp(floor(g),vec2(0.0),vec2(uHMI.w-2.0));vec2 f=clamp(g-i,0.0,1.0);' +
    'vec4 ta=hmTex(i);vec4 tb=hmTex(i+vec2(1.0,0.0));vec4 tc=hmTex(i+vec2(1.0,1.0));vec4 td=hmTex(i+vec2(0.0,1.0));' +
    'float y=hmTri(f,hmDec(ta),hmDec(tb),hmDec(tc),hmDec(td));vec2 da=mix(mix(ta.ba,tb.ba,f.x),mix(td.ba,tc.ba,f.x),f.y);float dens=da.x*uGP.w;' +
    'float dist=length(wp-uCam.xz);float fade=1.0-smoothstep(uGP.x*0.55,uGP.x,dist);float h=uGP.y*(0.6+0.55*aH.y)*step(aH.x,dens)*fade*smoothstep(0.05,0.35,dens);' +
    'float an=aH.z*6.2831853;vec2 sd=vec2(cos(an),sin(an));float t=aG.w;' +
    'float wv=sin(uT*1.7+wp.x*0.23+wp.y*0.19)*0.65+sin(uT*2.9+wp.x*0.8-wp.y*0.55+aH.y*3.0)*0.35;' +
    'vec2 bend=vec2(0.75,0.45)*((0.2+wv*0.3)*min(uGP.z,1.8)*0.7)+vec2(cos(an*3.7),sin(an*3.7))*0.22;' +
    'float fl=0.0;for(int k=0;k<8;k++){vec4 q=uPush[k];vec2 pd=wp-q.xz;float pl=length(pd)+0.001;float pk=(1.0-smoothstep(q.w*0.35,q.w*1.9,pl))*step(abs(q.y-y),1.6);bend+=pd/pl*(pk*1.6);fl=max(fl,pk);}h*=1.0-0.5*fl;' +
    'vec3 p=vec3(wp.x,y-0.03,wp.y);p.xz+=sd*(aG.z*(0.045+0.025*aH.y)*(1.0-0.55*t)*step(0.001,h));' +
    'float bl=min(dot(bend,bend),1.0);p.y+=h*t*(1.0-0.3*bl*t);p.xz+=bend*(h*t*t);' +
    'vW=p;vT=t;vec3 base=mix(uG1,uG2,da.y);vCol=mix(base*0.5,base*1.12+vec3(0.05,0.06,0.0),t)*(0.86+0.28*aH.y);' +
    'vS=(uSVP*vec4(p+vec3(0.0,uSMO,0.0),1.0)).xyz;gl_Position=uVP*vec4(p,1.0);}';
  const FS_G = HI + 'varying vec3 vW;varying vec3 vCol;varying float vT;varying vec3 vS;' +
    'uniform vec3 uCam;uniform vec3 uSun;uniform vec3 uSunC;uniform vec3 uSky;uniform vec3 uGnd;uniform vec3 uFog;uniform float uFogD;uniform float uGlow;' + G_SHADOW + G_FOG + G_TONE +
    'void main(){vec3 V=normalize(uCam-vW);float sdw=shadowAt(vS,0.0012);float nl=max(uSun.y,0.0)*0.75+0.2;' +
    'vec3 amb=mix(uGnd,uSky,0.35+0.65*vT);vec3 c=vCol*(amb+uSunC*(nl*sdw));c+=vCol*uSunC*(pow(max(dot(-V,uSun),0.0),4.0)*vT*sdw*0.8);' +
    'float fk;c=fogC(c,vW,fk);gl_FragColor=vec4(tone(c),uGlow>0.5?0.0:1.0);}';
  // ---------- the finishing pass: glow, smoothing edges and a little colour grading ----------
  const VS_P = 'attribute vec2 aQ;varying vec2 vU;void main(){vU=aQ*0.5+0.5;gl_Position=vec4(aQ,0.0,1.0);}';
  const FS_DOWN = HI + 'varying vec2 vU;uniform sampler2D uS;uniform vec2 uPx;uniform float uMask;' +
    'vec3 tp(vec2 o){vec4 t=texture2D(uS,vU+o*uPx);return uMask>0.5?t.rgb*t.a:t.rgb;}' +
    'void main(){gl_FragColor=vec4((tp(vec2(-1.0,-1.0))+tp(vec2(1.0,-1.0))+tp(vec2(-1.0,1.0))+tp(vec2(1.0,1.0)))*0.25,1.0);}';
  const FS_BLUR = HI + 'varying vec2 vU;uniform sampler2D uS;uniform vec2 uDir;' +
    'void main(){vec3 c=texture2D(uS,vU).rgb*0.227027;c+=(texture2D(uS,vU+uDir*1.384615).rgb+texture2D(uS,vU-uDir*1.384615).rgb)*0.316216;c+=(texture2D(uS,vU+uDir*3.230769).rgb+texture2D(uS,vU-uDir*3.230769).rgb)*0.07027;gl_FragColor=vec4(c,1.0);}';
  const FS_COMP = HI + 'varying vec2 vU;uniform sampler2D uS;uniform sampler2D uB1;uniform sampler2D uB2;uniform vec2 uPx;uniform vec4 uPP;' +
    'vec3 fxaa(vec2 uv){vec3 nw=texture2D(uS,uv+vec2(-1.0,-1.0)*uPx).rgb;vec3 ne=texture2D(uS,uv+vec2(1.0,-1.0)*uPx).rgb;vec3 sw=texture2D(uS,uv+vec2(-1.0,1.0)*uPx).rgb;vec3 se=texture2D(uS,uv+vec2(1.0,1.0)*uPx).rgb;vec3 mm=texture2D(uS,uv).rgb;' +
    'vec3 lu=vec3(0.299,0.587,0.114);float lnw=dot(nw,lu),lne=dot(ne,lu),lsw=dot(sw,lu),lse=dot(se,lu),lm=dot(mm,lu);float mn=min(lm,min(min(lnw,lne),min(lsw,lse)));float mx=max(lm,max(max(lnw,lne),max(lsw,lse)));' +
    'vec2 dir=vec2(-((lnw+lne)-(lsw+lse)),(lnw+lsw)-(lne+lse));float rd=max((lnw+lne+lsw+lse)*0.03125,0.0078125);float rc=1.0/(min(abs(dir.x),abs(dir.y))+rd);dir=clamp(dir*rc,vec2(-8.0),vec2(8.0))*uPx;' +
    'vec3 a=0.5*(texture2D(uS,uv+dir*(1.0/3.0-0.5)).rgb+texture2D(uS,uv+dir*(2.0/3.0-0.5)).rgb);vec3 b=a*0.5+0.25*(texture2D(uS,uv-dir*0.5).rgb+texture2D(uS,uv+dir*0.5).rgb);float lb=dot(b,lu);return (lb<mn||lb>mx)?a:b;}' +
    'void main(){vec3 c=uPP.x>0.5?fxaa(vU):texture2D(uS,vU).rgb;vec3 bl=texture2D(uB1,vU).rgb*0.8+texture2D(uB2,vU).rgb*1.0;' +
    'c=1.0-(1.0-c)*(1.0-clamp(bl*uPP.y,0.0,1.0));float l=dot(c,vec3(0.2126,0.7152,0.0722));c=clamp(mix(vec3(l),c,uPP.z),0.0,1.0);c=mix(c,c*c*(3.0-2.0*c),0.2);' +
    'vec2 v=vU-0.5;c*=1.0-uPP.w*dot(v,v)*1.6;gl_FragColor=vec4(c,1.0);}';

  function shader(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader error'); return s; }
  function program(vs, fs, attrs, unis) {
    const p = gl.createProgram(); gl.attachShader(p, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link error');
    const o = { p, a: {}, u: {} }; attrs.forEach(n => { o.a[n] = gl.getAttribLocation(p, n); }); unis.forEach(n => { o.u[n] = gl.getUniformLocation(p, n); }); return o;
  }
  const LIT_U = ['uCam', 'uSun', 'uSunC', 'uSky', 'uGnd', 'uFog', 'uFogD', 'uExpo', 'uGlow', 'uSM', 'uSMI', 'uSVP', 'uSMO', 'uVP'];
  let PW, PS, PQ, PD = null, PO = null, PG = null, PPD = null, PPB = null, PPC = null;
  try {
    PW = program(VS_W, FS_W, ['aP', 'aN', 'aC', 'aU', 'aX'], LIT_U.concat(['uM', 'uT', 'uTint', 'uEm', 'uA', 'uFlash', 'uTex', 'uLP', 'uLC', 'uMut', 'uRim', 'uHM', 'uHMI']));
    PS = program(VS_SKY, FS_SKY, ['aQ'], ['uIVP', 'uTop', 'uHor', 'uBot', 'uSunD', 'uSunC', 'uSunS', 'uT', 'uStars', 'uClouds', 'uCloudC', 'uNeb', 'uAur', 'uNebA', 'uNebB', 'uMoon', 'uMoonC', 'uRainbow', 'uExpo', 'uGlow']);
    PQ = program(VS_Q, FS_Q, ['aP', 'aU', 'aC', 'aM'], ['uVP']);
  } catch (e) {
    if (win.console) console.error('RAT CATCHERS graphics error:', e);
    fatal("RAT CATCHERS couldn't start its 3D graphics on this device.");
    return { destroy() { alive = false; try { root.removeChild(wrap); } catch (er) {} } };
  }
  // the extras switch themselves off on devices that can't run them
  try { PD = program(VS_D, FS_D, ['aP'], ['uM', 'uSVP']); } catch (e) { PD = null; if (win.console) console.warn('RAT CATCHERS: no shadows here', e); }
  try { PO = program(VS_O, FS_O, ['aP', 'aN'], ['uM', 'uVP', 'uCam', 'uOW', 'uSun', 'uSunC', 'uFog', 'uFogD', 'uOC', 'uExpo']); } catch (e) { PO = null; }
  try { if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0) PG = program(VS_G, FS_G, ['aG', 'aH'], LIT_U.concat(['uTile', 'uPush', 'uT', 'uGP', 'uG1', 'uG2', 'uHM', 'uHMI'])); } catch (e) { PG = null; if (win.console) console.warn('RAT CATCHERS: no grass here', e); }
  try { PPD = program(VS_P, FS_DOWN, ['aQ'], ['uS', 'uPx', 'uMask']); PPB = program(VS_P, FS_BLUR, ['aQ'], ['uS', 'uDir']); PPC = program(VS_P, FS_COMP, ['aQ'], ['uS', 'uB1', 'uB2', 'uPx', 'uPP']); } catch (e) { PPD = PPB = PPC = null; if (win.console) console.warn('RAT CATCHERS: no glow pass here', e); }
  // texture units: 0 pictures, 1 the shadow map, 2 the ground's height; samplers are wired once
  gl.useProgram(PW.p); gl.uniform1i(PW.u.uTex, 0); gl.uniform1i(PW.u.uSM, 1); gl.uniform1i(PW.u.uHM, 2);
  if (PG) { gl.useProgram(PG.p); gl.uniform1i(PG.u.uSM, 1); gl.uniform1i(PG.u.uHM, 2); }
  if (PPC) { gl.useProgram(PPC.p); gl.uniform1i(PPC.u.uS, 0); gl.uniform1i(PPC.u.uB1, 1); gl.uniform1i(PPC.u.uB2, 2); }
  function texOf(w, h, data, linear) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data || null);
    const f = linear ? gl.LINEAR : gl.NEAREST; gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t;
  }
  // a white pixel stands in for the shadow map and the height texture when they're off
  const DUMMY = texOf(1, 1, new Uint8Array([255, 255, 255, 255]), false);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, DUMMY); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, DUMMY); gl.activeTexture(gl.TEXTURE0);
  // which pass is drawing: 0 colour, 1 the sun's depth (shadows), 2 outlines. Meshes bind only what that pass's program reads.
  let PASS = 0, BOUND = null, enabled = [];
  function setPass(p) { PASS = p; BOUND = null; }
  function attribs(list) {
    for (const l of enabled) gl.disableVertexAttribArray(l); enabled = [];
    for (const a of list) { if (a[0] < 0 || a[0] == null) continue; gl.enableVertexAttribArray(a[0]); gl.vertexAttribPointer(a[0], a[1], gl.FLOAT, false, a[2], a[3]); enabled.push(a[0]); }
    BOUND = null;
  }
  const STRIDE = 13;
  function upload(data) {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (let i = 0; i < data.length; i += STRIDE) { for (let k = 0; k < 3; k++) { const v = data[i + k]; if (v < mn[k]) mn[k] = v; if (v > mx[k]) mx[k] = v; } }
    if (!data.length) { mn = [0, 0, 0]; mx = [0, 0, 0]; }
    return { b, n: data.length / STRIDE, mn, mx, c: vlerp(mn, mx, 0.5), r: dist(mn, mx) / 2 };
  }
  function freeMesh(m) { if (m && m.b) { try { gl.deleteBuffer(m.b); } catch (e) {} m.b = null; } }
  function bindMesh(m) {
    if (BOUND === m.b) return; const B = STRIDE * 4; gl.bindBuffer(gl.ARRAY_BUFFER, m.b);
    if (PASS === 1) attribs([[PD.a.aP, 3, B, 0]]);
    else if (PASS === 2) attribs([[PO.a.aP, 3, B, 0], [PO.a.aN, 3, B, 12]]);
    else { const P = PW.a; attribs([[P.aP, 3, B, 0], [P.aN, 3, B, 12], [P.aC, 3, B, 24], [P.aU, 2, B, 36], [P.aX, 2, B, 44]]); }
    BOUND = m.b;
  }
  const skyBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, skyBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
  // ---------- off-screen pictures: the scene (with smooth edges on WebGL 2), the glow chain and the shadow map ----------
  const DEPTH_FMT = GL2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_STENCIL, DEPTH_ATT = GL2 ? gl.DEPTH_ATTACHMENT : gl.DEPTH_STENCIL_ATTACHMENT;
  function rbOf(fmt, w, h, samples) { const r = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, r); if (samples > 1) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, fmt, w, h); else gl.renderbufferStorage(gl.RENDERBUFFER, fmt, w, h); return r; }
  function fbOf(tex, col, dep, att) {
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    if (tex) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (col) gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, col);
    if (dep) gl.framebufferRenderbuffer(gl.FRAMEBUFFER, att, gl.RENDERBUFFER, dep);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!ok) { gl.deleteFramebuffer(f); return null; } return f;
  }
  const RT = { w: 0, h: 0, ms: 0, msWant: 0, fb: null, tex: null, dep: null, mfb: null, mcol: null, mdep: null, bl: [], bad: false, sm: { size: 0, fb: null, tex: null, dep: null, bad: false } };
  function rtFree() {
    for (const k of ['fb', 'mfb']) if (RT[k]) gl.deleteFramebuffer(RT[k]); for (const k of ['dep', 'mcol', 'mdep']) if (RT[k]) gl.deleteRenderbuffer(RT[k]); if (RT.tex) gl.deleteTexture(RT.tex);
    for (const b of RT.bl) { if (b.fb) gl.deleteFramebuffer(b.fb); gl.deleteTexture(b.tex); }
    RT.fb = RT.mfb = RT.dep = RT.mcol = RT.mdep = RT.tex = null; RT.bl = []; RT.w = RT.h = 0;
  }
  function rtSetup(w, h, msWant) {
    if (RT.bad) return false;
    if (RT.w === w && RT.h === h && RT.msWant === msWant) return true;
    rtFree(); RT.w = w; RT.h = h; RT.msWant = msWant;
    RT.tex = texOf(w, h, null, true); let ms = 0;
    if (GL2 && msWant) { try { ms = Math.min(4, gl.getParameter(gl.MAX_SAMPLES) || 0); if (ms > 1) { RT.mcol = rbOf(gl.RGBA8, w, h, ms); RT.mdep = rbOf(gl.DEPTH_COMPONENT24, w, h, ms); RT.mfb = fbOf(null, RT.mcol, RT.mdep, gl.DEPTH_ATTACHMENT); RT.fb = fbOf(RT.tex, null, null); if (!RT.mfb || !RT.fb) ms = 0; } } catch (e) { ms = 0; } }
    if (ms <= 1) { ms = 0; if (RT.fb) gl.deleteFramebuffer(RT.fb); RT.dep = rbOf(DEPTH_FMT, w, h, 0); RT.fb = fbOf(RT.tex, null, RT.dep, DEPTH_ATT); }
    RT.ms = ms;
    // glow: half, two quarter and two eighth size pictures
    const sz = [2, 4, 4, 8, 8];
    for (const d of sz) { const bw = Math.max(1, Math.round(w / d)), bh = Math.max(1, Math.round(h / d)), tex = texOf(bw, bh, null, true); RT.bl.push({ w: bw, h: bh, tex, fb: fbOf(tex, null, null) }); }
    if (!RT.fb || RT.bl.some(b => !b.fb)) { RT.bad = true; rtFree(); if (win.console) console.warn('RAT CATCHERS: the glow pass is off on this device'); return false; }
    gl.bindTexture(gl.TEXTURE_2D, null); return true;
  }
  function smSetup(size) {
    const S_ = RT.sm; if (S_.bad || !PD) return false; if (S_.size === size && S_.fb) return true;
    if (S_.fb) gl.deleteFramebuffer(S_.fb); if (S_.tex) gl.deleteTexture(S_.tex); if (S_.dep) gl.deleteRenderbuffer(S_.dep);
    S_.size = size; S_.tex = texOf(size, size, null, false); S_.dep = rbOf(gl.DEPTH_COMPONENT16, size, size, 0); S_.fb = fbOf(S_.tex, null, S_.dep, gl.DEPTH_ATTACHMENT);
    if (!S_.fb) { S_.bad = true; if (win.console) console.warn('RAT CATCHERS: shadows are off on this device'); return false; }
    return true;
  }

  // ---------- texture atlas: signs and labels (2048 x 1024) ----------
  const ATLAS = { cv: doc.createElement('canvas'), r: {}, tex: null };
  ATLAS.cv.width = 2048; ATLAS.cv.height = 1024;
  const SIGN_FONT = (s, w) => (w || 700) + ' ' + s + 'px "Fredoka","Baloo 2","Arial Rounded MT Bold","Arial Black",sans-serif';
  function atlasBuild() {
    const c = ATLAS.cv.getContext('2d'), W = 2048, Hh = 1024; c.clearRect(0, 0, W, Hh);
    const R = (k, x, y, w, h) => { ATLAS.r[k] = [x / W, y / Hh, (x + w) / W, (y + h) / Hh]; };
    const signs = STATIONS.map(s => ['st_' + s.id, s.n, '#fff8ec', '#2b1d3a', '#ff9f1a'])
      .concat(FIELDS.map(f => ['pt_' + f.id, f.n, '#2b1d3a', '#ffffff', '#ffd23a']))
      .concat([['lv_lock', 'LOCKED', '#2b1d3a', '#ff5a5a', '#ff5a5a'], ['back', 'BACK TO LOBBY', '#2b1d3a', '#ffffff', '#5fdc6a'], ['trade', 'TRADE HERE', '#fff8ec', '#2b1d3a', '#3fa9ff'], ['lv_reborn', 'REBORN ONLY', '#2b1d3a', '#ff9af0', '#ff9af0']]);
    signs.forEach((s, i) => {
      const col = i % 4, row = Math.floor(i / 4), x = col * 512, y = row * 80;
      c.fillStyle = s[4]; c.beginPath(); c.roundRect ? c.roundRect(x + 4, y + 4, 504, 72, 22) : c.rect(x + 4, y + 4, 504, 72); c.fill();
      c.fillStyle = s[2]; c.beginPath(); c.roundRect ? c.roundRect(x + 12, y + 12, 488, 56, 16) : c.rect(x + 12, y + 12, 488, 56); c.fill();
      c.fillStyle = s[3]; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = SIGN_FONT(s[1].length > 15 ? 34 : 40); c.fillText(s[1].toUpperCase(), x + 256, y + 42, 470);
      R(s[0], x + 4, y + 4, 504, 72);
    });
    // big logo for the lobby arch
    { const x = 0, y = 640; const g = c.createLinearGradient(0, y, 0, y + 192); g.addColorStop(0, '#ffe066'); g.addColorStop(1, '#ffb21a'); c.fillStyle = '#2b1d3a'; c.beginPath(); c.roundRect ? c.roundRect(x + 4, y + 4, 1016, 184, 40) : c.rect(x + 4, y + 4, 1016, 184); c.fill(); c.fillStyle = g; c.beginPath(); c.roundRect ? c.roundRect(x + 16, y + 16, 992, 160, 30) : c.rect(x + 16, y + 16, 992, 160); c.fill();
      c.font = SIGN_FONT(104); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = '#2b1d3a'; c.strokeText('RAT CATCHERS', x + 512, y + 102, 940); c.fillStyle = '#fff'; c.fillText('RAT CATCHERS', x + 512, y + 102, 940); R('logo', x + 4, y + 4, 1016, 184); }
    // cheese wheel and lock icons
    { const x = 1024, y = 640; c.fillStyle = '#ffd23a'; c.beginPath(); c.arc(x + 96, y + 96, 88, 0, TAU); c.fill(); c.fillStyle = '#f2b400'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(x + 40 + (i * 53) % 120, y + 40 + ((i * 37) % 120), 9 + (i % 3) * 5, 0, TAU); c.fill(); } R('cheese', x + 8, y + 8, 176, 176); }
    { const x = 1216, y = 640; c.fillStyle = '#2b1d3a'; c.beginPath(); c.arc(x + 96, y + 96, 90, 0, TAU); c.fill(); c.fillStyle = '#ff5a5a'; c.fillRect(x + 56, y + 86, 80, 64); c.strokeStyle = '#ff5a5a'; c.lineWidth = 14; c.beginPath(); c.arc(x + 96, y + 86, 28, Math.PI, 0); c.stroke(); R('lock', x + 6, y + 6, 180, 180); }
    ATLAS.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, ATLAS.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ATLAS.cv);
    gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
  // live boards in the lobby (leaderboard and event board) draw into their own texture
  const BOARD = { cv: doc.createElement('canvas'), tex: gl.createTexture(), dirty: true };
  BOARD.cv.width = 1024; BOARD.cv.height = 512;
  function boardUpload() { gl.bindTexture(gl.TEXTURE_2D, BOARD.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, BOARD.cv); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); BOARD.dirty = false; }


  // ===================== mesh building =====================
  // Vertices are 13 floats: position, normal, colour, uv, material, emissive.
  const NOO = {};
  function MB() { this.d = []; }
  MB.prototype.v = function (p, n, c, u, v, m, e) { this.d.push(p[0], p[1], p[2], n[0], n[1], n[2], c[0], c[1], c[2], u, v, m, e); };
  MB.prototype.t = function (a, b, c, col, o) {
    o = o || NOO;
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (l < 1e-12) return;
    nx /= l; ny /= l; nz /= l;
    let ia = 0, ib = 1, ic = 2, B = b, C = c;
    if (o.h) { const mx = (a[0] + b[0] + c[0]) / 3 - o.h[0], my = (a[1] + b[1] + c[1]) / 3 - o.h[1], mz = (a[2] + b[2] + c[2]) / 3 - o.h[2]; if (nx * mx + ny * my + nz * mz < 0) { B = c; C = b; ib = 2; ic = 1; nx = -nx; ny = -ny; nz = -nz; } }
    else if (o.flip) { B = c; C = b; ib = 2; ic = 1; nx = -nx; ny = -ny; nz = -nz; }
    else if (o.ns) { const q = o.ns; if (nx * (q[0][0] + q[1][0] + q[2][0]) + ny * (q[0][1] + q[1][1] + q[2][1]) + nz * (q[0][2] + q[1][2] + q[2][2]) < 0) { B = c; C = b; ib = 2; ic = 1; nx = -nx; ny = -ny; nz = -nz; } } // wind smooth surfaces to face their normals (outlines rely on it)
    const fn = [nx, ny, nz], m = o.m || 0, e = o.e || 0, uv = o.uv, cs = o.cs, ns = o.ns;
    const P = [a, B, C], I = [ia, ib, ic];
    for (let k = 0; k < 3; k++) { const j = I[k]; this.v(P[k], ns ? ns[j] : fn, cs ? cs[j] : col, uv ? uv[j][0] : 0, uv ? uv[j][1] : 0, m, e); }
  };
  const QUV = [[0, 0], [1, 0], [1, 1], [0, 1]];
  MB.prototype.q = function (a, b, c, d, col, o) {
    o = o || NOO; const uv = o.uv || (o.m ? QUV : null), cs = o.cs, ns = o.ns;
    const o1 = Object.assign({}, o, { uv: uv ? [uv[0], uv[1], uv[2]] : null, cs: cs ? [cs[0], cs[1], cs[2]] : null, ns: ns ? [ns[0], ns[1], ns[2]] : null });
    const o2 = Object.assign({}, o, { uv: uv ? [uv[0], uv[2], uv[3]] : null, cs: cs ? [cs[0], cs[2], cs[3]] : null, ns: ns ? [ns[0], ns[2], ns[3]] : null });
    this.t(a, b, c, col, o1); this.t(a, c, d, col, o2);
  };
  // append another mesh transformed by matrix Mx (optional colour multiplier / override)
  MB.prototype.add = function (src, Mx, tint, over) {
    const S = src.d, D = this.d;
    for (let i = 0; i < S.length; i += STRIDE) {
      const x = S[i], y = S[i + 1], z = S[i + 2], nx = S[i + 3], ny = S[i + 4], nz = S[i + 5];
      const px = Mx[0] * x + Mx[4] * y + Mx[8] * z + Mx[12], py = Mx[1] * x + Mx[5] * y + Mx[9] * z + Mx[13], pz = Mx[2] * x + Mx[6] * y + Mx[10] * z + Mx[14];
      let qx = Mx[0] * nx + Mx[4] * ny + Mx[8] * nz, qy = Mx[1] * nx + Mx[5] * ny + Mx[9] * nz, qz = Mx[2] * nx + Mx[6] * ny + Mx[10] * nz; const l = Math.sqrt(qx * qx + qy * qy + qz * qz) || 1;
      let r = S[i + 6], g = S[i + 7], b = S[i + 8];
      if (over) { r = over[0]; g = over[1]; b = over[2]; } else if (tint) { r *= tint[0]; g *= tint[1]; b *= tint[2]; }
      D.push(px, py, pz, qx / l, qy / l, qz / l, r, g, b, S[i + 9], S[i + 10], S[i + 11], S[i + 12]);
    }
    return this;
  };
  MB.prototype.build = function () { return new Float32Array(this.d); };
  MB.prototype.count = function () { return this.d.length / STRIDE; };
  const TMX = m4();
  function place(dst, src, p, h, s, tint, tilt) { // drop a prefab at p, turned to heading h
    const f = fwdOf(h); let u = UP; if (tilt) { u = norm(add(UP, tilt)); }
    dst.add(src, model(TMX, p, norm(sub(f, mul(u, dot(f, u)))), u, s, s, s), tint);
  }

  // ---------- primitives ----------
  function box(mb, x0, y0, z0, x1, y1, z1, col, o) {
    o = o || NOO; const c = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    const v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    const faces = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]];
    faces.forEach((q, fi) => { const cc = fi === 4 && o.top ? o.top : col; mb.q(v[q[0]], v[q[1]], v[q[2]], v[q[3]], cc, Object.assign({}, o, { h: c, top: undefined })); });
  }
  // oriented box from a centre, axes (right r, up u, forward f) and half sizes
  function obox(mb, c, r, u, f, hx, hy, hz, col, o) {
    const P = (a, b, d) => [c[0] + r[0] * a * hx + u[0] * b * hy + f[0] * d * hz, c[1] + r[1] * a * hx + u[1] * b * hy + f[1] * d * hz, c[2] + r[2] * a * hx + u[2] * b * hy + f[2] * d * hz];
    const v = [P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1), P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)];
    const faces = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]];
    o = Object.assign({}, o || NOO, { h: c });
    faces.forEach((q, fi) => mb.q(v[q[0]], v[q[1]], v[q[2]], v[q[3]], fi === 4 && o.top ? o.top : col, o));
  }
  function cyl(mb, r0, r1, y0, y1, seg, col, o) {
    o = o || NOO; const ox = o.x || 0, oz = o.z || 0, rot = o.rot || 0, cap = o.cap !== false, sm = o.smooth !== false;
    const h = [ox, (y0 + y1) / 2, oz], slope = (r0 - r1) / ((y1 - y0) || 1);
    for (let i = 0; i < seg; i++) {
      const a0 = rot + i / seg * TAU, a1 = rot + (i + 1) / seg * TAU, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      const p00 = [ox + c0 * r0, y0, oz + s0 * r0], p10 = [ox + c1 * r0, y0, oz + s1 * r0], p01 = [ox + c0 * r1, y1, oz + s0 * r1], p11 = [ox + c1 * r1, y1, oz + s1 * r1];
      const n0 = norm([c0, slope, s0]), n1 = norm([c1, slope, s1]);
      const so = Object.assign({}, o, { h, ns: sm ? [n0, n1, n1, n0] : null, uv: o.m ? [[i / seg, 0], [(i + 1) / seg, 0], [(i + 1) / seg, 1], [i / seg, 1]] : null });
      mb.q(p00, p10, p11, p01, col, so);
      if (cap) { const co = Object.assign({}, o, { h, ns: null, uv: null }); const cc = o.capCol || col; if (r0 > 0) mb.t([ox, y0, oz], p10, p00, cc, co); if (r1 > 0) mb.t([ox, y1, oz], p01, p11, cc, co); }
    }
  }
  const ICO = [];
  function icoGeo(d) {
    if (ICO[d]) return ICO[d];
    const t = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm);
    let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let k = 0; k < d; k++) {
      const cache = new Map(), mid = (a, b) => { const key = a < b ? a * 100000 + b : b * 100000 + a; let i = cache.get(key); if (i === undefined) { i = v.length; v.push(norm(vlerp(v[a], v[b], 0.5))); cache.set(key, i); } return i; };
      const nf = []; for (const q of f) { const ab = mid(q[0], q[1]), bc = mid(q[1], q[2]), ca = mid(q[2], q[0]); nf.push([q[0], ab, ca], [q[1], bc, ab], [q[2], ca, bc], [ab, bc, ca]); } f = nf;
    }
    return (ICO[d] = { v, f });
  }
  // ellipsoid; o.sc = [sx, sy, sz], o.flat for faceted look, o.jit for rocks, o.cut = keep only y >= cut (local, -1..1)
  function sph(mb, c, r, det, col, o) {
    o = o || NOO; const g = icoGeo(det), s = o.sc || [1, 1, 1], jr = o.jit ? mulberry(o.seed || 1) : null;
    const P = g.v.map(v => { const k = jr ? 1 + (jr() - 0.5) * o.jit : 1; return [c[0] + v[0] * r * k * s[0], c[1] + v[1] * r * k * s[1], c[2] + v[2] * r * k * s[2]]; });
    const Nn = g.v.map(v => norm([v[0] / s[0], v[1] / s[1], v[2] / s[2]]));
    for (const f of g.f) {
      if (o.cut != null) { const ax = o.cax == null ? 1 : o.cax; if (g.v[f[0]][ax] < o.cut - 0.01 || g.v[f[1]][ax] < o.cut - 0.01 || g.v[f[2]][ax] < o.cut - 0.01) continue; }
      const cc = typeof col === 'function' ? col(g.v[f[0]]) : col;
      mb.t(P[f[0]], P[f[1]], P[f[2]], cc, Object.assign({}, o, { h: c, ns: o.flat || jr ? null : [Nn[f[0]], Nn[f[1]], Nn[f[2]]] }));
    }
  }
  function tor(mb, Rr, r, su, sv, col, o) {
    o = o || NOO; const y = o.y || 0;
    const P = (a, b) => [(Rr + r * Math.cos(b)) * Math.cos(a), y + r * Math.sin(b), (Rr + r * Math.cos(b)) * Math.sin(a)];
    const N = (a, b) => [Math.cos(b) * Math.cos(a), Math.sin(b), Math.cos(b) * Math.sin(a)];
    for (let i = 0; i < su; i++) for (let j = 0; j < sv; j++) {
      const a0 = i / su * TAU, a1 = (i + 1) / su * TAU, b0 = j / sv * TAU, b1 = (j + 1) / sv * TAU;
      mb.q(P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1), col, Object.assign({}, o, { ns: [N(a0, b0), N(a1, b0), N(a1, b1), N(a0, b1)] }));
    }
  }
  // surface of revolution around +y from a profile [[radius, y], ...] listed bottom to top
  function lathe(mb, prof, seg, col, o) {
    o = o || NOO; const n = prof.length, NR = [];
    for (let j = 0; j < n; j++) { const a = prof[Math.max(0, j - 1)], b = prof[Math.min(n - 1, j + 1)]; const tr = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tr, ty) || 1; NR.push([ty / l, -tr / l]); }
    for (let i = 0; i < seg; i++) {
      const a0 = (o.rot || 0) + i / seg * TAU, a1 = (o.rot || 0) + (i + 1) / seg * TAU, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      for (let j = 0; j < n - 1; j++) {
        const p = prof[j], q = prof[j + 1], np = NR[j], nq = NR[j + 1];
        const A = [c0 * p[0], p[1], s0 * p[0]], B = [c1 * p[0], p[1], s1 * p[0]], C = [c1 * q[0], q[1], s1 * q[0]], D = [c0 * q[0], q[1], s0 * q[0]];
        const cc = typeof col === 'function' ? col(j) : col;
        mb.q(A, D, C, B, cc, Object.assign({}, o, { ns: o.flat ? null : [[c0 * np[0], np[1], s0 * np[0]], [c0 * nq[0], nq[1], s0 * nq[0]], [c1 * nq[0], nq[1], s1 * nq[0]], [c1 * np[0], np[1], s1 * np[0]]] }));
      }
    }
  }
  // a flat textured board facing direction f (both sides lit)
  function board(mb, c, r, u, hw, hh, col, uvr, o) {
    const a = madd(madd(c, r, -hw), u, -hh), b = madd(madd(c, r, hw), u, -hh), cc = madd(madd(c, r, hw), u, hh), d = madd(madd(c, r, -hw), u, hh);
    mb.q(a, b, cc, d, col, Object.assign({ m: M.TEX, uv: [[uvr[0], uvr[3]], [uvr[2], uvr[3]], [uvr[2], uvr[1]], [uvr[0], uvr[1]]] }, o || NOO));
  }


  // ===================== models =====================
  // Rats face +z, stand on y = 0 and are about 1.1 m long at size 1. Parts: body, head (pivots at HEADP), one foot (drawn 4 times), tail.
  const HEADP = [0, 0.40, 0.22];
  const FEET = [[0.13, 0.035, 0.2], [-0.13, 0.035, 0.2], [0.15, 0.035, -0.26], [-0.15, 0.035, -0.26]];
  const TAILP = [0, 0.26, -0.43];
  const hx = c => typeof c === 'string' ? hexc(c) : c;
  const lighten = (c, k) => cmix(c, [1, 1, 1], k), darken = (c, k) => cmul(c, 1 - k);
  // pattern colour for a point on the fur (v: unit-sphere direction of the body or head)
  function furCol(s, v, part) {
    const fur = hx(s.fur), belly = hx(s.belly || s.fur), pc = s.pc ? hx(s.pc) : darken(fur, 0.4);
    let c = fur, em = 0;
    const under = part === 'body' ? smooth(clamp((-v[1] - 0.05) / 0.5, 0, 1)) * smooth(clamp((v[2] + 0.75) / 0.5, 0, 1)) : part === 'head' ? smooth(clamp((-v[1] + 0.1) / 0.5, 0, 1)) * smooth(clamp(v[2] / 0.6, 0, 1)) : 0;
    c = cmix(c, belly, under * 0.9);
    const n3 = (k) => vnoise2(v[0] * k + v[2] * 0.7 * k + 13, v[1] * k + v[2] * 0.4 * k + 7);
    switch (s.pat) {
      case 'spots': if (n3(3.2) > 0.62 && under < 0.5) c = pc; break;
      case 'mask': if (part === 'head' && v[1] > -0.05 && v[1] < 0.42 && v[2] > 0.1) c = pc; break;
      case 'moss': if (n3(4) > 0.5 && under < 0.5) c = cmix(c, pc, 0.8); break;
      case 'aurora': c = cmix(c, pc, smooth(clamp(v[0] * 0.5 + v[2] * 0.4 + 0.5, 0, 1))); break;
      case 'cracks': { const r = Math.abs(vnoise2(v[0] * 5 + 3, v[2] * 5 + v[1] * 3) - 0.5); if (r < 0.06 && under < 0.7) { c = pc; em = 1.2; } break; }
      case 'stars': if (vnoise2(v[0] * 23 + 1, v[1] * 23 + v[2] * 9) > 0.86 && under < 0.6) { c = pc; em = 1.0; } break;
      case 'galaxy': { const a = Math.atan2(v[0], v[2]) * 2 + v[1] * 4; c = cmix(c, pc, smooth(clamp(Math.sin(a) * 0.5 + 0.5, 0, 1)) * 0.75); if (vnoise2(v[0] * 25, v[2] * 25 + v[1] * 9) > 0.88) { c = [1, 1, 1]; em = 1; } break; }
      case 'glitch': { const q = Math.floor(v[0] * 4 + 9) * 7 + Math.floor(v[1] * 4 + 9) * 3 + Math.floor(v[2] * 4 + 9); if (q % 5 === 0) c = pc; else if (q % 7 === 0) c = belly; em = 0.25; break; }
    }
    return [c, em];
  }
  // an ellipsoid with a colour function per face: f(unitDir) -> [colour, emissive]
  function sphF(mb, c, r, det, f, o) {
    o = o || NOO; const g = icoGeo(det), s = o.sc || [1, 1, 1];
    const P = g.v.map(v => [c[0] + v[0] * r * s[0], c[1] + v[1] * r * s[1], c[2] + v[2] * r * s[2]]);
    const Nn = g.v.map(v => norm([v[0] / s[0], v[1] / s[1], v[2] / s[2]]));
    for (const fc of g.f) {
      const m = vlerp(vlerp(g.v[fc[0]], g.v[fc[1]], 0.5), g.v[fc[2]], 1 / 3), [col, em] = f(m);
      mb.t(P[fc[0]], P[fc[1]], P[fc[2]], col, Object.assign({}, o, { h: c, e: (o.e || 0) + em, ns: [Nn[fc[0]], Nn[fc[1]], Nn[fc[2]]] }));
    }
  }
  function tube(mb, pts, r0, r1, seg, col, o) { // a tapered tube through points
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], ra = lerp(r0, r1, i / (pts.length - 1)), rb = lerp(r0, r1, (i + 1) / (pts.length - 1));
      const ax = norm(sub(b, a)), up = Math.abs(ax[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0], u = norm(cross(ax, up)), w = cross(u, ax);
      for (let k = 0; k < seg; k++) {
        const t0 = k / seg * TAU, t1 = (k + 1) / seg * TAU;
        const d0 = add(mul(u, Math.cos(t0)), mul(w, Math.sin(t0))), d1 = add(mul(u, Math.cos(t1)), mul(w, Math.sin(t1)));
        const cc = typeof col === 'function' ? col(i / (pts.length - 1)) : col;
        mb.q(madd(a, d0, ra), madd(a, d1, ra), madd(b, d1, rb), madd(b, d0, rb), cc, Object.assign({}, o || NOO, { ns: [d0, d1, d1, d0], e: typeof o === 'object' && o.ef ? o.ef(i / (pts.length - 1)) : (o && o.e) || 0 }));
      }
    }
  }
  function wingShape(mb, side, col, o, kind) { // a flat wing made of feathers on one side (side = 1 left, -1 right)
    const n = kind === 'bat' ? 4 : 5;
    for (let i = 0; i < n; i++) {
      const a = -0.25 + i * 0.22, L = (kind === 'fairy' ? 0.42 : 0.5) - i * 0.04;
      const base = [side * 0.12, 0.52, -0.1 - i * 0.02], tip = [side * (0.12 + Math.cos(a) * L), 0.52 + Math.sin(a) * L * 0.9 + 0.18, -0.16 - i * 0.05];
      const w = kind === 'bat' ? 0.05 : 0.09;
      const mid = vlerp(base, tip, 0.55);
      mb.t(base, madd(mid, [0, 0, 1], w), tip, col, Object.assign({}, o, { h: [side * 0.12, 0.52, -1] }));
      mb.t(base, tip, madd(mid, [0, 0, -1], w), col, Object.assign({}, o, { h: [side * 0.12, 0.52, 1] }));
      mb.t(base, madd(mid, [0, 0, -1], w), madd(mid, [0, 0, 1], w), col, Object.assign({}, o, { h: [side * 0.12, -1, -0.1] }));
    }
  }
  function crownMesh(mb, c, r, h, col, gems, o) {
    cyl(mb, r, r, c[1], c[1] + h * 0.45, 12, col, Object.assign({ x: c[0], z: c[2], m: M.GOLD }, o));
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; const p = [c[0] + Math.cos(a) * r * 0.92, c[1] + h * 0.45, c[2] + Math.sin(a) * r * 0.92]; cyl(mb, r * 0.28, 0, p[1], p[1] + h * 0.6, 4, col, Object.assign({ x: p[0], z: p[2], m: M.GOLD }, o)); if (gems) sph(mb, [c[0] + Math.cos(a) * r * 1.0, c[1] + h * 0.22, c[2] + Math.sin(a) * r * 1.0], r * 0.16, 0, gems[i % gems.length], { m: M.GLOSS, e: 0.4 }); }
  }
  const PARTS = {
    clover: (B, Hd, s) => { for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; sph(Hd, [Math.cos(a) * 0.06, 0.6, 0.3 + Math.sin(a) * 0.06], 0.055, 1, [0.25, 0.7, 0.2], { sc: [1, 0.35, 1], m: M.LEAF }); } cyl(Hd, 0.01, 0.01, 0.52, 0.6, 4, [0.2, 0.5, 0.15], { z: 0.3 }); },
    cheeks: (B, Hd, s) => { for (const sd of [1, -1]) sph(Hd, [sd * 0.15, 0.37, 0.43], 0.09, 1, lighten(hx(s.fur), 0.15), { m: M.FUR }); },
    shroom: (B, Hd) => { sph(Hd, [0, 0.58, 0.32], 0.22, 2, v => (vnoise2(v[0] * 4 + 3, v[2] * 4) > 0.62 ? [1, 1, 1] : [0.9, 0.15, 0.12]), { sc: [1, 0.55, 1], cut: 0, m: M.GLOSS }); cyl(Hd, 0.07, 0.08, 0.5, 0.6, 8, [0.95, 0.9, 0.82], { z: 0.32 }); },
    acorn: (B, Hd) => { sph(Hd, [0, 0.57, 0.33], 0.17, 2, [0.55, 0.35, 0.18], { sc: [1, 0.6, 1], cut: 0, m: M.WOOD }); cyl(Hd, 0.015, 0.01, 0.66, 0.74, 5, [0.4, 0.25, 0.1], { z: 0.33 }); },
    crystals: (B) => { const cols = [[0.45, 0.9, 1], [0.75, 0.55, 1], [0.5, 1, 0.9]]; for (let i = 0; i < 5; i++) { const z = 0.2 - i * 0.14, y = 0.5 - Math.abs(i - 1.5) * 0.02; cyl(B, 0.05, 0, y - 0.02, y + 0.16 + (i % 2) * 0.06, 4, cols[i % 3], { z, m: M.CRYSTAL, e: 0.4 }); } },
    glowtail: () => {},
    icecrown: (B, Hd) => { for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; cyl(Hd, 0.035, 0, 0.55, 0.7 + (i % 2) * 0.06, 4, [0.75, 0.95, 1], { x: Math.cos(a) * 0.1, z: 0.3 + Math.sin(a) * 0.1, m: M.ICE, e: 0.2 }); } },
    fluff: (B, Hd, s) => { const r = mulberry(4); for (let i = 0; i < 16; i++) { const v = norm([r() - 0.5, r() * 0.8, r() - 0.5]); sph(B, [v[0] * 0.25, 0.32 + v[1] * 0.2, -0.06 + v[2] * 0.36], 0.11, 1, [1, 1, 1], { m: M.CLOUD }); } },
    flametail: () => {},
    firewings: (B) => { for (const sd of [1, -1]) wingShape(B, sd, [1, 0.55, 0.1], { e: 1.0 }, 'fire'); },
    halo: (B, Hd) => { const t = new MB(); tor(t, 0.15, 0.022, 20, 6, [1, 0.88, 0.4], { e: 1.2, m: M.GOLD }); Hd.add(t, model(m4(), [0, 0.74, 0.3], [0, 0, 1], UP, 1)); },
    wings: (B) => { for (const sd of [1, -1]) wingShape(B, sd, [1, 1, 1], { m: M.CLOUD }, 'angel'); },
    cloudpuff: (B) => { const r = mulberry(9); for (let i = 0; i < 12; i++) { const a = r() * TAU; sph(B, [Math.cos(a) * 0.28, 0.2 + r() * 0.25, -0.06 + Math.sin(a) * 0.38], 0.1 + r() * 0.06, 1, [0.98, 1, 1], { m: M.CLOUD }); } },
    thirdeye: (B, Hd) => { sph(Hd, [0, 0.55, 0.48], 0.045, 1, [0.9, 0.5, 1], { m: M.GLOSS, e: 1.2 }); },
    robe: (B, Hd, s) => { lathe(B, [[0.3, 0.06], [0.28, 0.2], [0.25, 0.36], [0.16, 0.46]], 14, [0.42, 0.25, 0.75], { m: M.PLAIN }); },
    voidfx: () => {},
    omegamark: (B, Hd) => { const t = new MB(); tor(t, 0.06, 0.016, 14, 5, [1, 0.82, 0.25], { e: 0.8, m: M.GOLD }); Hd.add(t, model(m4(), [0, 0.53, 0.5], [0, -1, 0.4], [0, 0.4, 1], 1)); },
    crown: (B, Hd) => { crownMesh(Hd, [0, 0.56, 0.32], 0.12, 0.16, [1, 0.82, 0.2], [[0.9, 0.1, 0.2], [0.2, 0.5, 1], [0.2, 0.9, 0.4]]); },
    cape: (B) => { const p = [[0.18, 0.5, 0.05], [-0.18, 0.5, 0.05], [-0.3, 0.12, -0.5], [0.3, 0.12, -0.5]]; B.q(p[0], p[1], p[2], p[3], [0.8, 0.1, 0.12], { h: [0, 1.2, 0.3] }); B.q(p[3], p[2], p[1], p[0], [0.95, 0.85, 0.3], { h: [0, -1, -0.8] }); },
    starhalo: (B, Hd) => { for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; sph(Hd, [Math.cos(a) * 0.2, 0.72 + Math.sin(a * 2) * 0.03, 0.28 + Math.sin(a) * 0.2], 0.035, 0, [1, 0.95, 0.6], { e: 1.4, flat: true }); } },
    gears: (B) => { for (const [x, y, z, r] of [[0.1, 0.52, -0.15, 0.11], [-0.08, 0.5, -0.32, 0.08]]) { const t = new MB(); cyl(t, r, r, -0.02, 0.02, 14, [0.75, 0.55, 0.25], { m: M.METAL }); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; box(t, Math.cos(a) * r - 0.02, -0.02, Math.sin(a) * r - 0.02, Math.cos(a) * r + 0.02, 0.02, Math.sin(a) * r + 0.02, [0.7, 0.5, 0.22], { m: M.METAL }); } B.add(t, model(m4(), [x, y, z], [1, 0, 0], [0, 0.2, 1], 1)); } },
    cheesecrown: (B, Hd) => { const t = new MB(); const a = [0, 0, 0.12], b = [0.13, 0, -0.08], c = [-0.13, 0, -0.08]; for (const y of [0, 0.14]) t.t(y ? a : a, y ? b : c, y ? c : b, [1, 0.82, 0.2], { h: [0, y ? -1 : 1, 0] }); const top = p => [p[0], 0.14, p[2]]; for (const [p, q] of [[a, b], [b, c], [c, a]]) t.q(p, q, top(q), top(p), [1, 0.78, 0.15], { h: [0, 0.07, 0] }); t.t(top(a), top(c), top(b), [1, 0.88, 0.3], { h: [0, -1, 0] }); Hd.add(t, model(m4(), [0, 0.57, 0.3], [0, 0, 1], UP, 1)); },
    shadowfx: () => {},
    goldfx: () => {},
    ancient: (B) => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; box(B, Math.cos(a) * 0.25 - 0.012, 0.22 + (i % 3) * 0.06, -0.1 + Math.sin(a) * 0.36 - 0.012, Math.cos(a) * 0.25 + 0.012, 0.3 + (i % 3) * 0.06, -0.1 + Math.sin(a) * 0.36 + 0.012, [0.4, 1, 1], { e: 1.2 }); } },
    pirate: (B, Hd) => { const t = new MB(); cyl(t, 0.2, 0.2, 0, 0.03, 12, [0.12, 0.1, 0.12], {}); sph(t, [0, 0.03, 0], 0.13, 1, [0.12, 0.1, 0.12], { sc: [1, 0.7, 1], cut: 0 }); box(t, -0.03, 0.08, 0.12, 0.03, 0.14, 0.135, [1, 1, 1], { e: 0.3 }); Hd.add(t, model(m4(), [0, 0.56, 0.3], [0, 0, 1], UP, 1)); sph(Hd, [0.1, 0.47, 0.53], 0.055, 1, [0.08, 0.08, 0.1], { sc: [1, 1, 0.4] }); },
    ninja: (B, Hd) => { cyl(Hd, 0.2, 0.2, 0.43, 0.5, 14, [0.85, 0.1, 0.12], { z: 0.36 }); box(Hd, -0.02, 0.44, 0.1, 0.02, 0.48, 0.16, [0.85, 0.1, 0.12]); sph(Hd, [0, 0.36, 0.46], 0.15, 1, [0.12, 0.12, 0.15], { sc: [1.25, 0.5, 0.9], cut: -0.2 }); },
    robo: (B, Hd) => { box(B, -0.2, 0.42, -0.3, 0.2, 0.47, 0.1, [0.6, 0.66, 0.72], { m: M.METAL }); cyl(Hd, 0.012, 0.012, 0.55, 0.78, 4, [0.6, 0.66, 0.72], { z: 0.3 }); sph(Hd, [0, 0.8, 0.3], 0.04, 1, [1, 0.25, 0.2], { e: 1.2 }); box(Hd, -0.13, 0.44, 0.5, 0.13, 0.5, 0.56, [0.2, 0.95, 1], { e: 1.0, m: M.GLOSS }); },
    antennae: (B, Hd) => { for (const sd of [1, -1]) { tube(Hd, [[sd * 0.06, 0.55, 0.38], [sd * 0.09, 0.68, 0.4], [sd * 0.13, 0.76, 0.38]], 0.012, 0.01, 4, [0.3, 0.9, 0.35]); sph(Hd, [sd * 0.13, 0.78, 0.38], 0.035, 1, [0.9, 1, 0.4], { e: 0.8 }); } } };

  const RAT_CACHE = {};
  function ratMeshes(spId) {
    if (RAT_CACHE[spId]) return RAT_CACHE[spId];
    const s = SP[spId] || SP.brown, fur = hx(s.fur), skin = [0.98, 0.66, 0.72], parts = s.parts || [];
    const B = new MB(), Hd = new MB(), Fc = new MB(), F = new MB(), T = new MB();
    // body and head (head built around its pivot so it can turn)
    sphF(B, [0, 0.30, -0.06], 1, 2, v => furCol(s, v, 'body'), { sc: [0.25, 0.22, 0.40], m: M.FUR });
    const hp = HEADP, h0 = [0, 0.40 - hp[1], 0.36 - hp[2]];
    sphF(Hd, h0, 1, 2, v => furCol(s, v, 'head'), { sc: [0.19, 0.18, 0.21], m: M.FUR });
    sphF(Hd, [0, 0.355 - hp[1], 0.55 - hp[2]], 1, 1, v => furCol(s, [v[0], v[1] - 0.3, v[2]], 'head'), { sc: [0.10, 0.085, 0.12], m: M.FUR });
    sph(Fc, [0, 0.375 - hp[1], 0.665 - hp[2]], 0.042, 1, skin, { m: M.GLOSS });
    const eye = s.eye === 'rainbow' ? [1, 0.3, 0.9] : s.eye ? hx(s.eye) : [0.07, 0.05, 0.09], eyeEm = s.eye && s.eye !== '#111111' ? 0.6 : 0;
    for (const sd of [1, -1]) {
      sph(Fc, [sd * 0.095, 0.46 - hp[1], 0.505 - hp[2]], 0.05, 1, eye, { m: M.GLOSS, e: eyeEm });
      sph(Fc, [sd * 0.108, 0.482 - hp[1], 0.548 - hp[2]], 0.017, 0, [1, 1, 1], { e: 1 });
      const er = s.ears || 1;
      sph(Hd, [sd * 0.15 * (1 + (er - 1) * 0.3), 0.58 - hp[1] + (er - 1) * 0.04, 0.3 - hp[2]], 1, 1, fur, { sc: [0.1 * er, 0.11 * er, 0.03], m: M.FUR });
      sph(Fc, [sd * 0.15 * (1 + (er - 1) * 0.3), 0.575 - hp[1] + (er - 1) * 0.04, 0.315 - hp[2]], 1, 1, skin, { sc: [0.07 * er, 0.08 * er, 0.02] });
      for (let k = 0; k < 3; k++) { const a = [sd * 0.07, 0.36 - hp[1] + k * 0.018, 0.6 - hp[2]], b = [sd * 0.25, 0.37 - hp[1] + (k - 1) * 0.05, 0.56 - hp[2]]; Fc.q(a, b, madd(b, UP, 0.006), madd(a, UP, 0.006), [0.95, 0.95, 0.95], { h: [0, -5, 0.6 - hp[2]] }); }
    }
    // a little belly-front blush on cute rats
    sph(F, [0, 0, 0], 1, 1, skin, { sc: [0.06, 0.035, 0.085] });
    // the tail: a curved taper, built from its base
    const tp = []; for (let i = 0; i <= 8; i++) { const t = i / 8; tp.push([Math.sin(t * 2.4) * 0.06, -0.02 - t * 0.12 + t * t * 0.32, -t * 0.72]); }
    const tailCol = parts.includes('robo') ? [0.6, 0.66, 0.72] : parts.includes('fluff') || parts.includes('cloudpuff') ? [1, 1, 1] : s.r === 'secret' || spId === 'void' ? fur : lighten(skin, 0.1);
    tube(T, tp, 0.05, 0.014, 6, tailCol, { m: M.FUR });
    if (parts.includes('glowtail')) sph(T, tp[8], 0.06, 1, [0.6, 1, 0.5], { e: 1.6 });
    if (parts.includes('flametail')) { cyl(T, 0.06, 0, tp[8][1], tp[8][1] + 0.16, 6, [1, 0.6, 0.1], { x: tp[8][0], z: tp[8][2], e: 1.6 }); }
    const Ha = new MB(); // decorations are written in rat coordinates; the head mesh is centred on its pivot
    for (const p of parts) if (PARTS[p]) PARTS[p](B, Ha, s);
    Hd.add(Ha, model(m4(), [-hp[0], -hp[1], -hp[2]], [0, 0, 1], UP, 1));
    const R = { body: upload(B.build()), head: upload(Hd.build()), face: upload(Fc.build()), foot: upload(F.build()), tail: upload(T.build()), tp: tp[8] };
    return (RAT_CACHE[spId] = R);
  }

  // ---------- rat cosmetics ----------
  const COS_CACHE = {};
  function cosMesh(id) {
    if (COS_CACHE[id] !== undefined) return COS_CACHE[id];
    const c = COS[id]; if (!c) return (COS_CACHE[id] = null);
    const B = new MB(), col = hx(c.col), hp = HEADP, top = [0, 0.565 - hp[1], 0.33 - hp[2]], face = [0, 0.47 - hp[1], 0.53 - hp[2]];
    const at = (p, d) => add(p, d);
    switch (id) {
      case 'partyhat': cyl(B, 0.1, 0, top[1], top[1] + 0.26, 12, col, { z: top[2], m: M.GLOSS }); sph(B, at(top, [0, 0.27, 0]), 0.04, 1, [1, 1, 1], {}); for (let i = 0; i < 3; i++) cyl(B, 0.085 - i * 0.025, 0.08 - i * 0.025, top[1] + 0.05 + i * 0.07, top[1] + 0.07 + i * 0.07, 12, [1, 0.9, 0.3], { z: top[2] }); break;
      case 'beanie': sph(B, top, 0.17, 2, col, { sc: [1, 0.7, 1], cut: 0, m: M.FUR }); cyl(B, 0.172, 0.172, top[1] - 0.01, top[1] + 0.035, 14, lighten(col, 0.35), { z: top[2] }); sph(B, at(top, [0, 0.13, 0]), 0.05, 1, [1, 1, 1], { m: M.FUR }); break;
      case 'cowboy': cyl(B, 0.25, 0.25, top[1], top[1] + 0.015, 18, col, { z: top[2], m: M.WOOD }); cyl(B, 0.12, 0.1, top[1], top[1] + 0.13, 12, col, { z: top[2], m: M.WOOD }); cyl(B, 0.122, 0.122, top[1] + 0.02, top[1] + 0.045, 12, [0.3, 0.18, 0.08], { z: top[2] }); break;
      case 'tophat': cyl(B, 0.19, 0.19, top[1], top[1] + 0.015, 18, col, { z: top[2], m: M.GLOSS }); cyl(B, 0.11, 0.11, top[1], top[1] + 0.24, 14, col, { z: top[2], m: M.GLOSS }); cyl(B, 0.113, 0.113, top[1] + 0.02, top[1] + 0.06, 14, [0.85, 0.1, 0.15], { z: top[2] }); break;
      case 'chefhat': cyl(B, 0.12, 0.12, top[1], top[1] + 0.1, 14, col, { z: top[2], m: M.CLOUD }); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; sph(B, at(top, [Math.cos(a) * 0.07, 0.15, Math.sin(a) * 0.07]), 0.08, 1, col, { m: M.CLOUD }); } break;
      case 'piratehat': cyl(B, 0.2, 0.2, top[1], top[1] + 0.03, 3, col, { z: top[2] }); sph(B, at(top, [0, 0.02, 0]), 0.13, 1, col, { sc: [1, 0.75, 1], cut: 0 }); box(B, -0.03, top[1] + 0.07, top[2] + 0.115, 0.03, top[1] + 0.12, top[2] + 0.13, [1, 1, 1], { e: 0.3 }); break;
      case 'catchercap': sph(B, top, 0.165, 2, col, { sc: [1, 0.6, 1], cut: 0, m: M.GLOSS }); cyl(B, 0.1, 0.1, top[1], top[1] + 0.012, 10, darken(col, 0.2), { z: top[2] + 0.15, x: 0 }); break;
      case 'tinycrown': crownMesh(B, top, 0.09, 0.13, col, [[0.9, 0.1, 0.2]]); break;
      case 'weeklycrown': crownMesh(B, top, 0.12, 0.17, col, [[0.2, 0.5, 1], [1, 0.3, 0.6]]); break;
      case 'divinecrown': crownMesh(B, top, 0.13, 0.22, [1, 0.96, 0.8], [[0.6, 0.9, 1], [1, 0.9, 0.4]]); { const t = new MB(); tor(t, 0.17, 0.018, 20, 6, [1, 0.9, 0.5], { e: 1.2 }); B.add(t, model(m4(), at(top, [0, 0.3, 0]), [0, 0, 1], UP, 1)); } break;
      case 'laurel': for (let i = 0; i < 12; i++) { const a = Math.PI * 0.15 + i / 11 * Math.PI * 0.7; for (const sd of [1, -1]) sph(B, at(top, [sd * Math.cos(a) * 0.16, 0.02, -Math.sin(a) * 0.12 + 0.06]), 0.04, 1, col, { sc: [1, 0.4, 1.8], m: M.LEAF }); } break;
      case 'rebirthcrown': crownMesh(B, top, 0.12, 0.18, [1, 0.6, 0.95], [[1, 1, 1]]); break;
      case 'shades': case 'starglasses': case 'heartglasses': case 'glasses3d': case 'discoshades': {
        for (const sd of [1, -1]) { const lc = id === 'glasses3d' ? (sd > 0 ? [1, 0.15, 0.15] : [0.2, 0.6, 1]) : id === 'heartglasses' ? [1, 0.3, 0.55] : id === 'starglasses' ? [1, 0.8, 0.2] : id === 'discoshades' ? [0.85, 0.7, 1] : [0.06, 0.06, 0.08];
          if (id === 'starglasses') { for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; sph(B, at(face, [sd * 0.095 + Math.cos(a) * 0.035, Math.sin(a) * 0.035, 0.035]), 0.03, 0, lc, { m: M.GLOSS, flat: true }); } }
          else sph(B, at(face, [sd * 0.095, 0, 0.03]), 0.065, 1, lc, { sc: [1, id === 'heartglasses' ? 0.9 : 0.75, 0.35], m: M.GLOSS, e: id === 'discoshades' ? 0.5 : 0 }); }
        box(B, -0.04, face[1] - 0.008, face[2] + 0.04, 0.04, face[1] + 0.008, face[2] + 0.055, [0.1, 0.1, 0.1]);
        for (const sd of [1, -1]) box(B, sd * 0.15 - 0.008, face[1] - 0.006, face[2] - 0.14, sd * 0.15 + 0.008, face[1] + 0.006, face[2] + 0.03, [0.1, 0.1, 0.1]);
        break; }
      case 'bowtie': { const n = [0, 0.3, 0.26]; for (const sd of [1, -1]) B.t(n, add(n, [sd * 0.1, 0.05, 0.03]), add(n, [sd * 0.1, -0.05, 0.03]), col, { h: [0, 0.3, 0] }); sph(B, add(n, [0, 0, 0.02]), 0.025, 1, col, {}); return (COS_CACHE[id] = { body: upload(B.build()) }); }
      case 'silverchain': case 'goldchain': case 'diamondchain': case 'discopendant': { const t = new MB(); tor(t, 0.2, 0.018, 18, 5, col, { m: id === 'discopendant' ? M.METAL : M.GOLD }); B.add(t, model(m4(), [0, 0.3, 0.12], [0, 0.6, 0.8], [0, 0.8, -0.6], 1)); const pend = [0, 0.18, 0.3]; if (id === 'discopendant') sph(B, pend, 0.06, 1, [0.9, 0.9, 1], { m: M.METAL, flat: true, e: 0.3 }); else sph(B, pend, 0.04, 1, id === 'diamondchain' ? [0.7, 0.95, 1] : col, { m: M.GLOSS, e: id === 'diamondchain' ? 0.6 : 0.1, flat: id === 'diamondchain' }); return (COS_CACHE[id] = { body: upload(B.build()) }); }
      case 'backpack': box(B, -0.15, 0.36, -0.32, 0.15, 0.6, -0.06, col, { m: M.GLOSS }); box(B, -0.1, 0.38, -0.345, 0.1, 0.5, -0.32, darken(col, 0.25)); return (COS_CACHE[id] = { body: upload(B.build()) });
      case 'cape': { const p = [[0.17, 0.5, 0.08], [-0.17, 0.5, 0.08], [-0.28, 0.1, -0.52], [0.28, 0.1, -0.52]]; B.q(p[0], p[1], p[2], p[3], col, { h: [0, 1.3, 0.4] }); B.q(p[3], p[2], p[1], p[0], [0.95, 0.8, 0.25], { h: [0, -1, -0.8] }); return (COS_CACHE[id] = { body: upload(B.build()) }); }
      case 'jetpack': for (const sd of [1, -1]) { cyl(B, 0.07, 0.07, 0.34, 0.62, 10, col, { x: sd * 0.08, z: -0.22, m: M.METAL }); cyl(B, 0.04, 0.06, 0.28, 0.34, 10, [0.3, 0.3, 0.35], { x: sd * 0.08, z: -0.22 }); } return (COS_CACHE[id] = { body: upload(B.build()), jet: [[0.08, 0.27, -0.22], [-0.08, 0.27, -0.22]] });
      case 'fairywings': case 'angelwings': case 'batwings': case 'voidwings': for (const sd of [1, -1]) wingShape(B, sd, col, { m: id === 'angelwings' ? M.CLOUD : M.GLOSS, e: id === 'voidwings' ? 0.6 : id === 'fairywings' ? 0.35 : 0 }, id === 'batwings' ? 'bat' : id === 'fairywings' ? 'fairy' : 'angel'); return (COS_CACHE[id] = { body: upload(B.build()) });
      default: return (COS_CACHE[id] = null); // trails, particles and auras are effects, not meshes
    }
    return (COS_CACHE[id] = { head: upload(B.build()) });
  }
  // a disco ball for the Disco mutation, sitting on the head
  let DISCO = null;
  function discoMesh() { if (DISCO) return DISCO; const B = new MB(); sph(B, [0, 0.66 - HEADP[1], 0.3 - HEADP[2]], 0.1, 1, [0.92, 0.92, 1], { m: M.METAL, flat: true, e: 0.25 }); cyl(B, 0.006, 0.006, 0.76 - HEADP[1], 0.95 - HEADP[1], 4, [0.8, 0.8, 0.8], { z: 0.3 - HEADP[2] }); return (DISCO = upload(B.build())); }

  // ---------- players ----------
  const AV_CACHE = {};
  function avatarMeshes(col) {
    if (AV_CACHE[col]) return AV_CACHE[col];
    const c = hx(col), skin = [1, 0.84, 0.7], dark = darken(c, 0.35), pants = [0.2, 0.21, 0.36], hair = [0.34, 0.21, 0.13], bag = [0.78, 0.52, 0.28], white = [0.96, 0.96, 0.98];
    const B = new MB(), Hd = new MB(), Fc = new MB(), Arm = new MB(), Leg = new MB();
    // body: a rounded shirt over shorts, a belt with a buckle, a collar and a backpack (you mostly see your catcher from behind)
    const T = new MB(); lathe(T, [[0.0, 0.6], [0.25, 0.61], [0.3, 0.69], [0.315, 0.78], [0.33, 0.93], [0.32, 1.07], [0.27, 1.19], [0.16, 1.28], [0.0, 1.31]], 18, j => j <= 2 ? pants : c, { m: M.FUR });
    B.add(T, model(m4(), [0, 0, 0], [0, 0, 1], UP, 1, 1, 0.84));
    const belt = new MB(); cyl(belt, 0.322, 0.322, 0.79, 0.86, 18, [0.22, 0.16, 0.3], { cap: false }); B.add(belt, model(m4(), [0, 0, 0], [0, 0, 1], UP, 1, 1, 0.86));
    box(B, -0.055, 0.785, 0.265, 0.055, 0.865, 0.3, [1, 0.84, 0.25], { m: M.GOLD });
    const col2 = new MB(); tor(col2, 0.16, 0.035, 16, 6, dark, { y: 1.255 }); B.add(col2, model(m4(), [0, 0, 0], [0, 0, 1], UP, 1, 1, 0.9));
    sph(B, [0, 1.0, -0.27], 1, 2, bag, { sc: [0.19, 0.22, 0.1], m: M.FUR });
    sph(B, [0, 1.1, -0.28], 1, 2, darken(bag, 0.22), { sc: [0.195, 0.1, 0.11], cut: 0, m: M.FUR });
    sph(B, [0, 0.92, -0.365], 1, 1, darken(bag, 0.12), { sc: [0.1, 0.07, 0.025], m: M.FUR });
    for (const sd of [-1, 1]) obox(B, [sd * 0.17, 1.12, 0.0], [1, 0, 0], norm([0, 1, 0.12]), norm([0, -0.12, 1]), 0.035, 0.17, 0.29, darken(bag, 0.3), {});
    // head: a big round face with eyes, brows, a smile, rosy cheeks, ears, hair and the cap
    sph(Hd, [0, 0.25, 0.01], 0.31, 2, skin, { sc: [1, 0.96, 0.97] });
    for (const sd of [1, -1]) {
      sph(Fc, [sd * 0.108, 0.25, 0.272], 1, 2, [0.07, 0.05, 0.09], { sc: [0.05, 0.068, 0.03], m: M.GLOSS });
      sph(Fc, [sd * 0.12, 0.274, 0.298], 0.019, 1, [1, 1, 1], { e: 1 });
      sph(Fc, [sd * 0.108, 0.338, 0.272], 1, 1, hair, { sc: [0.05, 0.012, 0.02] });
      sph(Fc, [sd * 0.18, 0.17, 0.238], 1, 1, [1, 0.6, 0.6], { sc: [0.05, 0.026, 0.02] });
      sph(Hd, [sd * 0.3, 0.23, 0.0], 1, 1, skin, { sc: [0.05, 0.07, 0.05] });
      sph(Hd, [sd * 0.265, 0.2, -0.04], 1, 1, hair, { sc: [0.075, 0.13, 0.11] });
    }
    sph(Fc, [0, 0.195, 0.306], 0.024, 1, darken(skin, 0.05), {});
    sph(Fc, [0, 0.14, 0.29], 1, 1, [0.5, 0.15, 0.2], { sc: [0.045, 0.016, 0.02] });
    sph(Hd, [0, 0.215, -0.07], 0.31, 2, hair, { m: M.FUR });
    for (let k = -1; k <= 1; k++) sph(Hd, [k * 0.1, 0.405, 0.22 - Math.abs(k) * 0.03], 1, 1, hair, { sc: [0.08, 0.05, 0.06], m: M.FUR });
    sph(Hd, [0, 0.36, -0.015], 0.322, 2, c, { sc: [1, 0.6, 1], cut: 0, m: M.GLOSS });
    const band = new MB(); tor(band, 0.318, 0.024, 22, 5, dark, { y: 0.365 }); Hd.add(band, model(m4(), [0, 0, -0.015], [0, 0, 1], UP, 1));
    sph(Hd, [0, 0.368, 0.25], 0.2, 2, dark, { sc: [1, 0.11, 0.85], cut: 0 });
    sph(Hd, [0, 0.553, -0.015], 0.045, 1, white, {});
    // arms: sleeve, forearm and hand, hanging from the shoulder
    sph(Arm, [0, -0.03, 0], 0.1, 1, c, { m: M.FUR }); cyl(Arm, 0.088, 0.078, -0.22, -0.02, 10, c, { m: M.FUR });
    cyl(Arm, 0.064, 0.058, -0.41, -0.21, 10, skin, {}); sph(Arm, [0, -0.46, 0.005], 1, 1, skin, { sc: [0.075, 0.085, 0.07] });
    // legs: shorts, a bit of leg, socks and chunky trainers
    cyl(Leg, 0.11, 0.1, -0.25, 0.02, 10, pants, { m: M.FUR }); cyl(Leg, 0.072, 0.068, -0.41, -0.24, 10, skin, {}); cyl(Leg, 0.074, 0.072, -0.5, -0.4, 10, white, { m: M.FUR });
    sph(Leg, [0, -0.54, 0.05], 1, 2, white, { sc: [0.11, 0.075, 0.17], m: M.GLOSS }); sph(Leg, [0, -0.585, 0.05], 1, 1, [0.25, 0.24, 0.3], { sc: [0.115, 0.03, 0.175] });
    sph(Leg, [0, -0.52, 0.12], 1, 1, c, { sc: [0.112, 0.022, 0.08] });
    const R = { body: upload(B.build()), head: upload(Hd.build()), face: upload(Fc.build()), arm: upload(Arm.build()), leg: upload(Leg.build()) };
    return (AV_CACHE[col] = R);
  }
  const ROD_CACHE = {};
  // a rod in two halves (the top half bends while reeling), with a reel underneath and its crank as a separate piece that turns
  function rodMesh(id) {
    if (ROD_CACHE[id]) return ROD_CACHE[id];
    const r = ROD[id] || ROD.wood, c = hx(r.col), mat = id === 'wood' ? M.WOOD : id === 'rainbow' ? M.GLOSS : M.METAL, em = id === 'heaven' || id === 'omega' ? 0.4 : 0;
    const L = new MB(), U = new MB(), K = new MB(), steel = [0.82, 0.84, 0.9];
    cyl(L, 0.035, 0.026, 0, 0.92, 7, c, { m: mat, e: em });
    cyl(L, 0.047, 0.044, 0.04, 0.36, 8, [0.22, 0.15, 0.12], { m: M.FUR });
    cyl(L, 0.05, 0.05, 0.4, 0.48, 10, steel, { m: M.METAL });
    const reel = new MB(); cyl(reel, 0.062, 0.062, -0.026, 0.026, 14, steel, { m: M.METAL }); cyl(reel, 0.045, 0.045, -0.031, 0.031, 14, [0.24, 0.22, 0.3], { m: M.METAL });
    L.add(reel, model(m4(), [0, 0.44, 0.085], [0, 1, 0], [1, 0, 0], 1));
    box(L, -0.012, 0.42, 0.03, 0.012, 0.46, 0.06, [0.6, 0.6, 0.66], { m: M.METAL });
    cyl(U, 0.026, 0.015, 0, 0.72, 7, c, { m: mat, e: em }); sph(U, [0, 0.74, 0], 0.03, 1, c, { m: M.GLOSS, e: 0.5 });
    box(K, -0.006, 0, -0.006, 0.006, 0.055, 0.006, [0.7, 0.7, 0.76], { m: M.METAL }); sph(K, [0.016, 0.055, 0], 0.014, 1, [0.2, 0.18, 0.24], {});
    return (ROD_CACHE[id] = { lo: upload(L.build()), hi: upload(U.build()), crank: upload(K.build()) });
  }
  let BOB = null;
  function bobberMesh() { if (BOB) return BOB; const B = new MB(); sphF(B, [0, 0, 0], 1, 1, v => [v[1] > 0.05 ? [0.95, 0.16, 0.16] : [0.97, 0.97, 0.97], 0], { sc: [0.07, 0.08, 0.07], m: M.GLOSS }); cyl(B, 0.008, 0.008, 0.07, 0.14, 4, [0.95, 0.16, 0.16], {}); return (BOB = upload(B.build())); }
  // ---------- small props ----------
  let CHEST = null, EGGM = {};
  function chestMeshes() {
    if (CHEST) return CHEST;
    const mk = (wood, band) => { const B = new MB(), L = new MB(); box(B, -0.5, 0, -0.35, 0.5, 0.5, 0.35, wood, { m: M.WOOD }); for (const x of [-0.42, 0.42]) box(B, x - 0.05, -0.01, -0.36, x + 0.05, 0.51, 0.36, band, { m: M.METAL }); box(B, -0.07, 0.3, 0.35, 0.07, 0.45, 0.39, band, { m: M.GOLD });
      sph(L, [0, 0, 0], 1, 2, wood, { sc: [0.5, 0.25, 0.35], cut: 0, m: M.WOOD }); return { body: upload(B.build()), lid: upload(L.build()) }; };
    return (CHEST = [mk([0.55, 0.33, 0.16], [0.4, 0.4, 0.45]), mk([0.6, 0.18, 0.12], [1, 0.8, 0.2]), mk([0.25, 0.2, 0.5], [0.6, 0.95, 1])]);
  }
  function eggMesh(id) { if (EGGM[id]) return EGGM[id]; const e = EGG[id], B = new MB(); sphF(B, [0, 0.5, 0], 1, 2, v => [hx(e.col), Math.abs(Math.sin(v[1] * 9)) < 0.18 ? 0.3 : 0], { sc: [0.38, 0.5, 0.38], m: M.GLOSS }); for (let i = 0; i < 9; i++) { const a = i * 2.4, y = 0.25 + (i % 3) * 0.25; sph(B, [Math.cos(a) * 0.36, y, Math.sin(a) * 0.36], 0.06, 1, [1, 1, 1], { sc: [0.6, 1, 0.6] }); } return (EGGM[id] = upload(B.build())); }


  // ===================== the world: lobby and fields =====================
  const AREAS = {};
  // per-field look: sky, light, fog, ground colours, heights and water
  const THEMES = {
    lobby: { sky: { top: [0.32, 0.6, 1], hor: [0.78, 0.9, 1], bot: [0.55, 0.7, 0.5], sunC: [1, 0.95, 0.82], sunS: 1, stars: 0, clouds: 0.7, cloudC: [1, 1, 1], neb: 0, aur: 0 }, sun: norm([0.42, 0.86, 0.3]), sunC: [1, 0.93, 0.8], amb: [0.5, 0.5, 0.58], gnd: [0.56, 0.46, 0.36], fog: [0.8, 0.86, 0.94], fogD: 0.0035, expo: 0.95, indoor: 1,
      grass: { h: 0.3, d: 1, c1: [0.27, 0.54, 0.18], c2: [0.5, 0.78, 0.28] } },
    meadow: { sky: { top: [0.26, 0.52, 0.98], hor: [0.74, 0.88, 1], bot: [0.5, 0.65, 0.4], sunC: [1, 0.96, 0.8], sunS: 1, stars: 0, clouds: 0.75, cloudC: [1, 1, 1], neb: 0, aur: 0 }, sun: norm([0.45, 0.7, 0.4]), sunC: [1, 0.93, 0.8], amb: [0.42, 0.5, 0.6], gnd: [0.32, 0.36, 0.22], fog: [0.74, 0.86, 0.98], fogD: 0.0065,
      g1: [0.25, 0.5, 0.17], g2: [0.4, 0.62, 0.21], mat: 'GRASS', amp: 2.6, water: { x: 26, z: 18, r: 10, y: -0.5, m: 'WATER', col: [0.3, 0.6, 0.9] }, wall: [0.45, 0.6, 0.3],
      grass: { h: 0.27, d: 1, c1: [0.21, 0.44, 0.13], c2: [0.46, 0.68, 0.2] } },
    clover: { sky: { top: [0.42, 0.62, 1], hor: [1, 0.9, 0.7], bot: [0.6, 0.7, 0.4], sunC: [1, 0.86, 0.6], sunS: 1, stars: 0, clouds: 0.55, cloudC: [1, 0.96, 0.9], neb: 0, aur: 0 }, sun: norm([-0.6, 0.55, 0.4]), sunC: [1, 0.88, 0.66], amb: [0.48, 0.48, 0.52], gnd: [0.4, 0.42, 0.25], fog: [1, 0.92, 0.78], fogD: 0.007,
      g1: [0.28, 0.66, 0.22], g2: [0.48, 0.82, 0.25], mat: 'GRASS', amp: 3.2, wall: [0.4, 0.6, 0.25],
      grass: { h: 0.24, d: 0.95, c1: [0.22, 0.55, 0.16], c2: [0.5, 0.82, 0.24] } },
    mushroom: { sky: { top: [0.08, 0.16, 0.18], hor: [0.22, 0.38, 0.34], bot: [0.1, 0.15, 0.12], sunC: [0.7, 0.9, 0.75], sunS: 0.2, stars: 0.3, clouds: 0, cloudC: [0, 0, 0], neb: 0.25, aur: 0, nebA: [0.1, 0.4, 0.3], nebB: [0.3, 0.2, 0.5] }, sun: norm([0.3, 0.9, 0.2]), sunC: [0.55, 0.75, 0.6], amb: [0.32, 0.45, 0.42], gnd: [0.2, 0.25, 0.18], fog: [0.18, 0.32, 0.3], fogD: 0.016,
      g1: [0.22, 0.42, 0.2], g2: [0.32, 0.5, 0.22], mat: 'MOSS', amp: 1.6, wall: [0.2, 0.3, 0.18],
      grass: { h: 0.2, d: 0.7, c1: [0.16, 0.34, 0.16], c2: [0.3, 0.52, 0.24] } },
    crystal: { sky: { top: [0.04, 0.03, 0.1], hor: [0.18, 0.12, 0.32], bot: [0.06, 0.05, 0.12], sunC: [0.6, 0.5, 1], sunS: 0, stars: 0.6, clouds: 0, cloudC: [0, 0, 0], neb: 0.5, aur: 0, nebA: [0.35, 0.15, 0.6], nebB: [0.1, 0.4, 0.6] }, sun: norm([0.2, 0.9, -0.3]), sunC: [0.45, 0.42, 0.7], amb: [0.3, 0.28, 0.5], gnd: [0.2, 0.16, 0.28], fog: [0.14, 0.1, 0.26], fogD: 0.014,
      g1: [0.32, 0.3, 0.42], g2: [0.4, 0.36, 0.52], mat: 'ROCK', amp: 1.2, cave: 1, water: { x: -24, z: 22, r: 9, y: -0.6, m: 'WATER', col: [0.25, 0.5, 0.9] }, wall: [0.3, 0.26, 0.4] },
    frozen: { sky: { top: [0.12, 0.2, 0.42], hor: [0.62, 0.74, 0.9], bot: [0.7, 0.78, 0.86], sunC: [0.9, 0.95, 1], sunS: 0.6, stars: 0.35, clouds: 0.3, cloudC: [0.9, 0.94, 1], neb: 0, aur: 0.9 }, sun: norm([0.4, 0.5, -0.6]), sunC: [0.85, 0.9, 1], amb: [0.5, 0.58, 0.78], gnd: [0.62, 0.66, 0.76], fog: [0.7, 0.78, 0.9], fogD: 0.009, expo: 0.9,
      g1: [0.84, 0.89, 0.98], g2: [0.76, 0.83, 0.94], mat: 'SNOW', amp: 3.5, water: { x: -20, z: 14, r: 13, y: -0.3, m: 'ICE', col: [0.7, 0.88, 1] }, wall: [0.85, 0.9, 1] },
    lava: { sky: { top: [0.18, 0.04, 0.03], hor: [0.75, 0.25, 0.08], bot: [0.25, 0.06, 0.03], sunC: [1, 0.5, 0.2], sunS: 0.4, stars: 0, clouds: 0.5, cloudC: [0.3, 0.12, 0.08], neb: 0, aur: 0 }, sun: norm([-0.3, 0.6, 0.5]), sunC: [1, 0.55, 0.3], amb: [0.45, 0.25, 0.22], gnd: [0.3, 0.12, 0.08], fog: [0.45, 0.16, 0.08], fogD: 0.011,
      g1: [0.16, 0.13, 0.13], g2: [0.26, 0.2, 0.18], mat: 'ROCK', amp: 2.6, lava: 1, wall: [0.2, 0.14, 0.13] },
    heaven: { sky: { top: [0.36, 0.56, 0.98], hor: [1, 0.86, 0.76], bot: [1, 0.94, 0.9], sunC: [1, 0.9, 0.7], sunS: 1.4, stars: 0, clouds: 0.45, cloudC: [1, 0.96, 0.94], neb: 0, aur: 0, rainbow: 0.6 }, sun: norm([0.45, 0.62, 0.5]), sunC: [1, 0.86, 0.66], amb: [0.56, 0.58, 0.8], gnd: [0.86, 0.72, 0.7], fog: [0.98, 0.86, 0.8], fogD: 0.008, expo: 0.84,
      g1: [0.92, 0.9, 0.97], g2: [0.84, 0.85, 0.96], mat: 'CLOUD', amp: 0.9, wall: [1, 1, 1] },
    omega: { sky: { top: [0.02, 0.01, 0.05], hor: [0.15, 0.04, 0.25], bot: [0.02, 0.01, 0.04], sunC: [0.8, 0.4, 1], sunS: 0.6, stars: 1, clouds: 0, cloudC: [0, 0, 0], neb: 1, aur: 0, nebA: [0.55, 0.1, 0.8], nebB: [0.1, 0.3, 0.9] }, sun: norm([0.3, 0.7, 0.5]), sunC: [0.65, 0.45, 0.9], amb: [0.28, 0.2, 0.42], gnd: [0.1, 0.06, 0.16], fog: [0.08, 0.03, 0.14], fogD: 0.012,
      g1: [0.16, 0.1, 0.3], g2: [0.22, 0.14, 0.38], mat: 'VOID', amp: 0.6, wall: [0.1, 0.06, 0.2] },
    secret: { sky: { top: [0.06, 0.04, 0.16], hor: [0.4, 0.22, 0.5], bot: [0.1, 0.06, 0.12], sunC: [1, 0.7, 1], sunS: 0.5, stars: 0.8, clouds: 0, cloudC: [0, 0, 0], neb: 0.6, aur: 1, nebA: [0.6, 0.2, 0.5], nebB: [0.2, 0.6, 0.7], rainbow: 0.5 }, sun: norm([-0.4, 0.6, 0.4]), sunC: [0.9, 0.75, 1], amb: [0.42, 0.34, 0.55], gnd: [0.18, 0.16, 0.2], fog: [0.25, 0.16, 0.32], fogD: 0.011,
      g1: [0.2, 0.3, 0.24], g2: [0.3, 0.26, 0.38], mat: 'MOSS', amp: 2, wall: [0.3, 0.25, 0.38],
      grass: { h: 0.22, d: 0.75, c1: [0.18, 0.28, 0.23], c2: [0.4, 0.32, 0.5] } },
    reborn: { sky: { top: [0.22, 0.12, 0.42], hor: [1, 0.66, 0.82], bot: [0.4, 0.25, 0.4], sunC: [1, 0.8, 0.9], sunS: 0.9, stars: 0.4, clouds: 0.35, cloudC: [1, 0.85, 0.95], neb: 0.3, aur: 0.3, nebA: [0.7, 0.3, 0.6], nebB: [0.3, 0.3, 0.8], rainbow: 0.35 }, sun: norm([-0.3, 0.5, 0.6]), sunC: [1, 0.82, 0.9], amb: [0.62, 0.5, 0.66], gnd: [0.4, 0.28, 0.36], fog: [0.85, 0.6, 0.78], fogD: 0.009,
      g1: [0.48, 0.66, 0.42], g2: [0.62, 0.78, 0.48], mat: 'GRASS', amp: 1.8, water: { x: 22, z: 20, r: 9, y: -0.5, m: 'WATER', col: [0.75, 0.55, 0.95] }, wall: [0.7, 0.5, 0.7],
      grass: { h: 0.26, d: 0.9, c1: [0.4, 0.6, 0.36], c2: [0.74, 0.86, 0.52] } } };
  // ground height; also used for walking, rats and the camera
  function fieldHeight(fid, x, z) {
    const th = THEMES[fid], L = RC.fieldLayout(fid);
    let h = (fbm2(x * 0.022 + 31, z * 0.022 + 7, 4) - 0.5) * 2 * th.amp + (fbm2(x * 0.09 + 5, z * 0.09, 2) - 0.5) * th.amp * 0.25;
    const ds = Math.hypot(x - L.spawn[0], z - L.spawn[1]); h *= smooth(clamp((ds - 10) / 14, 0, 1)); // flat around the spawn point
    if (th.water) { const w = th.water, d = Math.hypot(x - w.x, z - w.z); if (d < w.r + 6) h = lerp(w.y - 0.9, h, smooth(clamp((d - w.r + 2) / 8, 0, 1))); }
    if (th.lava) { const d = Math.abs(z - 22 - Math.sin(x * 0.05) * 14), d2 = Math.abs(x + 40 - Math.sin(z * 0.06) * 10); const k = Math.min(d, d2 + (z > 30 ? 99 : 0)); if (k < 9) h = lerp(-1.6, h, smooth(clamp((k - 3) / 6, 0, 1))); }
    const edge = Math.max(Math.abs(x), Math.abs(z)) - (RC.FIELD_R - 4);
    if (edge > 0) h += th.cave ? edge * edge * 0.35 + edge * 1.5 : th.mat === 'CLOUD' ? -edge * 0.6 : (edge * edge * 0.045 + edge * 0.55) * (0.62 + 0.76 * fbm2(x * 0.03 + 7, z * 0.03 - 3, 3));
    return h;
  }
  const lavaAt = (x, z) => { const d = Math.abs(z - 22 - Math.sin(x * 0.05) * 14), d2 = Math.abs(x + 40 - Math.sin(z * 0.06) * 10); return Math.min(d, d2 + (z > 30 ? 99 : 0)) < 3.2; };
  function lobbyHeight(x, z) { const r = Math.hypot(x, z); return r < 52 ? 0 : smooth(clamp((r - 52) / 14, 0, 1)) * (2.5 + 7 * fbm2(x * 0.03 + 4, z * 0.03 + 1, 3)) + (fbm2(x * 0.05, z * 0.05, 3) - 0.5) * 1.5 * smooth(clamp((r - 52) / 8, 0, 1)); }
  function heightAt(aid, x, z) { return aid === 'lobby' ? lobbyHeight(x, z) : fieldHeight(aid, x, z); }

  // ---------- building helpers ----------
  function chunked(mbs, size, half) { // split a list of world-space MBs into culling chunks
    const cells = new Map();
    for (const mb of mbs) {
      const d = mb.d;
      for (let i = 0; i < d.length; i += STRIDE * 3) {
        const cx = (d[i] + d[i + STRIDE] + d[i + STRIDE * 2]) / 3, cz = (d[i + 2] + d[i + STRIDE + 2] + d[i + STRIDE * 2 + 2]) / 3;
        const k = Math.floor((cx + half) / size) + ',' + Math.floor((cz + half) / size);
        let arr = cells.get(k); if (!arr) cells.set(k, arr = []);
        for (let j = 0; j < STRIDE * 3; j++) arr.push(d[i + j]);
      }
    }
    return [...cells.values()].map(a => upload(new Float32Array(a)));
  }
  function terrain(mb, aid, R, cell, colf, matf) {
    const N = Math.round(R * 2 / cell), hgt = (x, z) => heightAt(aid, x, z);
    const H = new Float32Array((N + 1) * (N + 1));
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) H[j * (N + 1) + i] = hgt(-R + i * cell, -R + j * cell);
    const nrm = (i, j) => { const l = H[j * (N + 1) + Math.max(0, i - 1)], r = H[j * (N + 1) + Math.min(N, i + 1)], d = H[Math.max(0, j - 1) * (N + 1) + i], u = H[Math.min(N, j + 1) * (N + 1) + i]; return norm([l - r, 2 * cell, d - u]); };
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const P = (a, b) => [-R + (i + a) * cell, H[(j + b) * (N + 1) + i + a], -R + (j + b) * cell];
      const a = P(0, 0), b = P(1, 0), c = P(1, 1), d = P(0, 1), ctr = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2];
      const col = colf(ctr[0], ctr[2], ctr[1]), m = matf ? matf(ctr[0], ctr[2], ctr[1]) : 0;
      mb.q(a, d, c, b, col, { ns: [nrm(i, j), nrm(i, j + 1), nrm(i + 1, j + 1), nrm(i + 1, j)], m, h: [ctr[0], ctr[1] - 5, ctr[2]] });
    }
    return { H, N, R, cell };
  }
  // the ground as a texture: height in red and green, how much grass grows in blue, and the grass shade in alpha
  function hmTexture(T, densf, shadef) {
    const n = T.N + 1, px = new Uint8Array(n * n * 4);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const k = j * n + i, x = -T.R + i * T.cell, z = -T.R + j * T.cell, v = Math.round(clamp((T.H[k] + 64) / 128, 0, 1) * 65535);
      px[k * 4] = v >> 8; px[k * 4 + 1] = v & 255; px[k * 4 + 2] = Math.round(clamp(densf(x, z), 0, 1) * 255); px[k * 4 + 3] = Math.round(clamp(shadef(x, z), 0, 1) * 255);
    }
    return { tex: texOf(n, n, px, false), info: [-T.R, -T.R, 1 / T.cell, n], half: T.R };
  }
  // light and dark patches across a field (the ground and its grass share them)
  const shadeOf = (x, z) => clamp(vnoise2(x * 0.07, z * 0.07) * 0.8 + 0.3 - 0.6 * smooth(clamp((fbm2(x * 0.025 + 3, z * 0.025 + 9, 3) - 0.35) * 2.2, 0, 1)), 0, 1);
  function disc(mb, x, y, z, r, seg, col, o) { for (let i = 0; i < seg; i++) { const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU; mb.t([x, y, z], [x + Math.cos(a1) * r, y, z + Math.sin(a1) * r], [x + Math.cos(a0) * r, y, z + Math.sin(a0) * r], col, Object.assign({ h: [x, y - 1, z] }, o)); } }
  function signBoard(mb, x, y, z, h, w, key, o) { // a sign on two posts, facing heading h
    const f = fwdOf(h), r = rightOf(h), uv = ATLAS.r[key]; if (!uv) return;
    for (const sd of [-1, 1]) cyl(mb, 0.09, 0.09, 0, y, 6, [0.45, 0.3, 0.18], { x: x + r[0] * sd * (w * 0.46), z: z + r[2] * sd * (w * 0.46), m: M.WOOD });
    const hh = w * 72 / 504 / 2, c = [x, y + hh, z];
    board(mb, madd(c, f, 0.06), mul(r, -1), UP, w / 2, hh, [1, 1, 1], uv, Object.assign({ e: 0.15 }, o));
    board(mb, madd(c, f, -0.06), r, UP, w / 2, hh, [1, 1, 1], uv, Object.assign({ e: 0.15 }, o));
    obox(mb, c, r, UP, f, w / 2 + 0.05, hh + 0.05, 0.05, [0.3, 0.2, 0.15], { m: M.WOOD });
  }
  // a soft round tree: a flared trunk and a crown of overlapping blobs whose normals lean out from the crown's centre,
  // darker underneath and sunnier on top
  function crownBlob(mb, p, rad, ctr, col, R, det) {
    const g = icoGeo(det == null ? 2 : det), P = [], N = [], C = [];
    for (const v of g.v) {
      const q = [p[0] + v[0] * rad, p[1] + v[1] * rad * 0.9, p[2] + v[2] * rad], out = norm(sub(q, ctr)), hh = clamp((q[1] - ctr[1]) / (R * 1.5) + 0.5, 0, 1);
      P.push(q); N.push(norm(add(mul(v, 0.4), mul(out, 0.6))));
      C.push(cmul(cmix(cmul(col, 0.74), [col[0] * 1.08 + 0.05, col[1] * 1.1 + 0.06, col[2] * 0.96 + 0.02], hh), 0.6 + 0.4 * hh));
    }
    for (const f of g.f) mb.t(P[f[0]], P[f[1]], P[f[2]], col, { ns: [N[f[0]], N[f[1]], N[f[2]]], cs: [C[f[0]], C[f[1]], C[f[2]]], m: M.LEAF, h: p });
  }
  function tree(mb, x, y, z, s, r, cols, det) {
    const up = norm([(r() - 0.5) * 0.22, 1, (r() - 0.5) * 0.22]), f0 = fwdOf(r() * TAU), tf = norm(sub(f0, mul(up, dot(f0, up))));
    const T = new MB(); lathe(T, [[0.46, -0.4], [0.34, 0.02], [0.24, 0.45], [0.2, 1.5], [0.15, 2.75]], 9, j => j === 0 ? [0.36, 0.25, 0.16] : [0.46, 0.31, 0.19], { m: M.WOOD });
    for (const sd of [-1, 1]) { const b = new MB(); cyl(b, 0.08, 0.04, 0, 1.0, 6, [0.46, 0.31, 0.19], { m: M.WOOD, cap: false }); T.add(b, model(m4(), [0, 1.7 + sd * 0.25, 0], [0, 0, 1], norm([sd * 0.75, 0.66, 0]), 1)); }
    mb.add(T, model(TMX, [x, y, z], tf, up, s));
    const c = cols[(r() * cols.length) | 0], top = madd([x, y, z], up, 3.3 * s), n = det === 1 ? 5 + ((r() * 2) | 0) : 7 + ((r() * 3) | 0), R = 1.3 * s;
    crownBlob(mb, top, R, top, c, R, det);
    for (let k = 0; k < n; k++) {
      const a = k / n * TAU + r() * 0.5, el = -0.3 + r() * 0.95, d = (0.95 + r() * 0.3) * s;
      crownBlob(mb, [top[0] + Math.cos(a) * Math.cos(el) * d * 1.1, top[1] + Math.sin(el) * d * 0.8, top[2] + Math.sin(a) * Math.cos(el) * d * 1.1], (0.72 + r() * 0.4) * s, top, cmul(c, 0.94 + r() * 0.12), R, det);
    }
  }
  function pine(mb, x, y, z, s, r, snow) {
    cyl(mb, 0.24 * s, 0.16 * s, y - 0.3, y + 1.4 * s, 7, [0.4, 0.27, 0.16], { x, z, m: M.WOOD });
    const T = new MB(), dark = [0.09, 0.27, 0.19], mid = [0.13, 0.4, 0.27];
    for (let k = 0; k < 4; k++) {
      const yy = (0.9 + k * 0.95) * s, rr = (1.85 - k * 0.38) * s, hh = 1.7 * s;
      lathe(T, [[0, yy - 0.05 * s], [rr, yy], [rr * 0.82, yy + 0.18 * s], [rr * 0.45, yy + hh * 0.55], [0, yy + hh]], 12, j => j <= 1 ? dark : mid, { m: M.LEAF });
      if (snow) lathe(T, [[rr * 0.6, yy + hh * 0.42], [rr * 0.42, yy + hh * 0.6], [0.0, yy + hh + 0.05 * s]], 12, [0.93, 0.96, 1], { m: M.SNOW });
    }
    mb.add(T, model(TMX, [x, y, z], fwdOf(r() * TAU), UP, 1));
  }
  // boulders: lumpy but smooth, darker at the bottom, with moss on top where moss belongs
  function rock(mb, x, y, z, s, col, seed, m, moss) {
    seed = seed || 1; const g = icoGeo(s < 0.9 ? 1 : 2), sc = [1, 0.68, 1.12], cy = y + 0.25 * s;
    const P = g.v.map(v => { const k = 1 + (vnoise2(v[0] * 2.1 + seed * 0.37, v[2] * 2.1 + v[1] * 1.7) - 0.5) * 0.6; return [x + v[0] * s * k * sc[0], cy + v[1] * s * k * sc[1], z + v[2] * s * k * sc[2]]; });
    const N = g.v.map(() => [0, 0, 0]);
    for (const f of g.f) { const fn = cross(sub(P[f[1]], P[f[0]]), sub(P[f[2]], P[f[0]])); for (const i of f) { N[i][0] += fn[0]; N[i][1] += fn[1]; N[i][2] += fn[2]; } }
    const NN = N.map((n, i) => { const q = norm(n); return dot(q, g.v[i]) < 0 ? mul(q, -1) : q; });
    const C = g.v.map((v, i) => { let c = cmul(col, 0.82 + 0.3 * vnoise2(v[0] * 5 + seed, v[2] * 5 - v[1] * 3)); if (moss && NN[i][1] > 0.4) c = cmix(c, moss, smooth(clamp((NN[i][1] - 0.4) / 0.35, 0, 1)) * 0.85); return cmul(c, 0.66 + 0.34 * clamp(v[1] + 0.6, 0, 1)); });
    for (const f of g.f) mb.t(P[f[0]], P[f[1]], P[f[2]], col, { ns: [NN[f[0]], NN[f[1]], NN[f[2]]], cs: [C[f[0]], C[f[1]], C[f[2]]], m: m == null ? M.ROCK : m, h: [x, cy, z] });
  }
  function flower(mb, x, y, z, col) {
    cyl(mb, 0.025, 0.02, y, y + 0.45, 3, [0.25, 0.6, 0.2], { x, z, cap: false });
    const c = [x, y + 0.47, z], lo = cmul(col, 0.78);
    for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + x, d = [Math.cos(a), 0, Math.sin(a)], s = [-d[2], 0, d[0]], mid = [c[0] + d[0] * 0.08, c[1] + 0.025, c[2] + d[2] * 0.08], tip = [c[0] + d[0] * 0.17, c[1] + 0.05, c[2] + d[2] * 0.17];
      mb.q(c, madd(mid, s, 0.055), tip, madd(mid, s, -0.055), col, { cs: [lo, col, col, col], ns: [UP, UP, UP, UP] }); }
    sph(mb, [x, y + 0.49, z], 0.05, 0, [1, 0.85, 0.2], { flat: true });
  }
  function tuft(mb, x, y, z, col) { const lo = cmul(col, 0.55), hi = cmul(col, 1.15); for (let k = 0; k < 5; k++) { const a = k * 1.26 + x * 3.1, dx = Math.cos(a), dz = Math.sin(a), w = 0.04, l = 0.12 + (k % 3) * 0.06; mb.t([x - dz * w, y - 0.02, z + dx * w], [x + dz * w, y - 0.02, z - dx * w], [x + dx * l, y + 0.3 + (k % 2) * 0.14, z + dz * l], col, { h: [x, y - 1, z], cs: [lo, lo, hi] }); } }
  function bigShroom(mb, x, y, z, s, r, anim) {
    const glow = r() < 0.45, cap = glow ? [0.3, 0.75, 1] : [0.85, 0.15, 0.12];
    cyl(mb, 0.35 * s, 0.45 * s, y - 0.3, y + 2.4 * s, 9, [0.95, 0.9, 0.8], { x, z });
    sph(mb, [x, y + 2.4 * s, z], 1.6 * s, 2, v => (!glow && vnoise2(v[0] * 4 + x, v[2] * 4 + z) > 0.62) ? [1, 1, 1] : cap, { sc: [1, 0.55, 1], cut: -0.05, m: M.GLOSS, e: glow ? 0.65 : 0 });
    if (glow) anim.lights.push({ p: [x, y + 2.6 * s, z], c: [0.3, 0.75, 1], r: 9, k: 0.7 });
  }
  function crystalCluster(mb, x, y, z, s, r, anim) {
    const cols = [[0.7, 0.4, 1], [0.35, 0.85, 1], [1, 0.45, 0.85], [0.5, 1, 0.8]], c = cols[(r() * cols.length) | 0];
    for (let k = 0; k < 6; k++) { const a = r() * TAU, d = r() * 0.8 * s, hh = (1.2 + r() * 2.4) * s; const t = new MB(); cyl(t, 0.32 * s, 0, 0, hh, 5, cmul(c, 0.8 + r() * 0.4), { m: M.CRYSTAL, e: 0.35 }); cyl(t, 0.32 * s, 0.32 * s, -0.4, 0, 5, c, { m: M.CRYSTAL }); mb.add(t, model(m4(), [x + Math.cos(a) * d, y - 0.2, z + Math.sin(a) * d], [0, 0, 1], norm([Math.cos(a) * 0.4, 1, Math.sin(a) * 0.4]), 1)); }
    anim.lights.push({ p: [x, y + 1.5 * s, z], c, r: 10, k: 0.8 });
  }
  function windmill(mb, x, y, z, h, anim) {
    const mbL = new MB(); lathe(mbL, [[2.2, -0.5], [1.9, 3], [1.5, 7.5], [1.4, 8]], 10, [0.95, 0.92, 0.85], {}); cyl(mbL, 1.7, 0, 8, 10, 10, [0.7, 0.25, 0.2], {}); box(mbL, -0.5, 0, 1.6, 0.5, 1.6, 2.3, [0.45, 0.3, 0.2], { m: M.WOOD });
    mb.add(mbL, model(m4(), [x, y, z], fwdOf(h), UP, 1));
    const bl = new MB(); for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; const t = new MB(); box(t, -0.25, 0.3, -0.05, 0.25, 5.2, 0.05, [0.95, 0.95, 0.95], {}); box(t, -0.02, 0, -0.06, 0.02, 5.2, 0.06, [0.45, 0.3, 0.2], { m: M.WOOD }); bl.add(t, model(m4(), [0, 0, 0], [0, 0, 1], [Math.sin(a), Math.cos(a), 0], 1)); }
    anim.props.push({ mesh: upload(bl.build()), p: madd([x, y + 7.6, z], fwdOf(h), 2.3), h, kind: 'spin', sp: 0.8 });
  }
  // ---------- fields ----------
  function buildField(fid) {
    const th = THEMES[fid], L = RC.fieldLayout(fid), r = mulberry(1234 + FI[fid].i * 77), G0 = new MB(), P0 = new MB(), T0 = new MB(), anim = { props: [], lights: [], fx: [] };
    const hgt = (x, z) => fieldHeight(fid, x, z), gr = th.grass;
    // a soft shade on the ground around big things
    const aoAt = (x, z) => { let a = 1; for (const o of L.obs) { const d = Math.hypot(x - o.x, z - o.z), rr = o.r + 0.8; if (d < rr * 2.2) a *= 1 - 0.3 * (1 - smooth(clamp((d - rr * 0.6) / (rr * 1.6), 0, 1))); } return a; };
    const TI = terrain(G0, fid, 96, 2, (x, z, y) => { let c = cmix(cmul(th.g1, 0.78), th.g2, shadeOf(x, z)); if (th.lava && y < -0.9) c = [0.2, 0.08, 0.06]; if (Math.abs(x) > RC.FIELD_R - 4 || Math.abs(z) > RC.FIELD_R - 4) c = cmix(c, cmul(th.wall, 0.82), 0.6 * smooth(clamp((Math.max(Math.abs(x), Math.abs(z)) - RC.FIELD_R + 4) / 6, 0, 1))); if (th.water && Math.hypot(x - th.water.x, z - th.water.z) < th.water.r + 2) c = cmul(c, 0.8); return cmul(c, aoAt(x, z)); }, () => M[th.mat]);
    // where grass grows: everywhere grassy except water, the portal, rocks and the fence, a little thinner in patches
    const densf = (x, z) => {
      if (!gr || Math.abs(x) > RC.FIELD_R - 2.5 || Math.abs(z) > RC.FIELD_R - 2.5) return 0;
      let d = gr.d * (0.72 + 0.28 * smooth(clamp(fbm2(x * 0.06 + 11, z * 0.06 + 3, 2) * 2 - 0.4, 0, 1)));
      if (th.water) { const dd = Math.hypot(x - th.water.x, z - th.water.z) - th.water.r - 1; if (dd < 0) return 0; d *= smooth(clamp(dd / 2.5, 0, 1)); }
      if (Math.hypot(x - L.portal[0], z - L.portal[1]) < 3.5) return 0;
      for (const o of L.obs) { const dd = Math.hypot(x - o.x, z - o.z) - (o.kind === 'tree' || o.kind === 'pine' ? 0.6 : o.r * 0.95); if (dd < 0) return 0; if (dd < 1.5) d *= dd / 1.5; }
      return d;
    };
    const moss = { meadow: [0.3, 0.48, 0.2], clover: [0.32, 0.56, 0.22], mushroom: [0.22, 0.4, 0.22], secret: [0.3, 0.36, 0.3], reborn: [0.5, 0.66, 0.42], frozen: [0.92, 0.95, 1] }[fid];
    // water, ice and lava
    if (th.water) { const w = th.water; disc(T0, w.x, w.y, w.z, w.r + 2.5, 28, w.col, { m: M[w.m], e: w.m === 'WATER' && fid === 'crystal' ? 0.3 : 0 }); }
    if (th.lava) { for (let i = -48; i < 48; i++) { const x0 = i * 2, x1 = x0 + 2, z0 = 22 + Math.sin(x0 * 0.05) * 14, z1 = 22 + Math.sin(x1 * 0.05) * 14; G0.q([x0, -0.7, z0 - 4], [x0, -0.7, z0 + 4], [x1, -0.7, z1 + 4], [x1, -0.7, z1 - 4], [1, 0.5, 0.1], { m: M.LAVA, h: [x0, -5, z0] }); }
      for (let z0 = -80; z0 < 30; z0 += 2) { const z1 = z0 + 2, x0 = -40 + Math.sin(z0 * 0.06) * 10, x1 = -40 + Math.sin(z1 * 0.06) * 10; G0.q([x0 - 4, -0.72, z0], [x1 - 4, -0.72, z1], [x1 + 4, -0.72, z1], [x0 + 4, -0.72, z0], [1, 0.5, 0.1], { m: M.LAVA, h: [x0, -5, z0] }); }
      for (let i = 0; i < 6; i++) anim.lights.push({ p: [-60 + i * 24, 1, 22 + Math.sin((-60 + i * 24) * 0.05) * 14], c: [1, 0.45, 0.1], r: 16, k: 0.9 }); }
    // the big obstacles from the shared layout
    for (const o of L.obs) {
      const y = hgt(o.x, o.z), s = o.r, rr = mulberry(o.s + 3);
      switch (o.kind) {
        case 'tree': tree(P0, o.x, y, o.z, s * 1.1, rr, fid === 'secret' ? [[0.35, 0.25, 0.5], [0.25, 0.4, 0.35]] : fid === 'mushroom' ? [[0.15, 0.4, 0.2], [0.2, 0.35, 0.25]] : fid === 'reborn' ? [[1, 0.62, 0.82], [0.98, 0.5, 0.75], [1, 0.78, 0.9]] : [[0.3, 0.62, 0.22], [0.4, 0.7, 0.25], [0.25, 0.55, 0.3]]); break;
        case 'rock': rock(P0, o.x, y, o.z, s, fid === 'frozen' ? [0.6, 0.65, 0.72] : fid === 'lava' ? [0.18, 0.14, 0.13] : fid === 'crystal' ? [0.35, 0.3, 0.45] : [0.55, 0.53, 0.5], o.s, null, moss); break;
        case 'windmill': windmill(P0, o.x, y, o.z, rr() * TAU, anim); break;
        case 'bigshroom': bigShroom(P0, o.x, y, o.z, s * 0.75, rr, anim); break;
        case 'crystal': crystalCluster(P0, o.x, y, o.z, s * 0.9, rr, anim); break;
        case 'pillar': if (fid === 'heaven') { cyl(P0, 0.7, 0.7, y - 0.4, y + 7, 12, [0.97, 0.96, 0.92], { x: o.x, z: o.z, m: M.GLOSS }); cyl(P0, 0.95, 0.95, y + 7, y + 7.6, 12, [1, 0.85, 0.35], { x: o.x, z: o.z, m: M.GOLD }); cyl(P0, 0.95, 0.95, y - 0.4, y + 0.3, 12, [1, 0.85, 0.35], { x: o.x, z: o.z, m: M.GOLD }); } else { cyl(P0, s * 1.1, 0.08, y - 0.4, y + s * 5, 7, [0.32, 0.28, 0.4], { x: o.x, z: o.z, m: M.ROCK }); } break;
        case 'pine': pine(P0, o.x, y, o.z, s * 1.1, rr, true); break;
        case 'iceberg': sph(P0, [o.x, y + s * 0.4, o.z], s, 1, [0.7, 0.88, 1], { sc: [1, 0.9, 1.2], jit: 0.4, seed: o.s, m: M.ICE }); break;
        case 'volcanic': sph(P0, [o.x, y + s * 0.8, o.z], s, 1, v => (Math.abs(vnoise2(v[0] * 5 + o.x, v[1] * 5 + o.z) - 0.5) < 0.05 ? [1, 0.45, 0.1] : [0.16, 0.12, 0.11]), { sc: [1, 1.8, 1], jit: 0.35, seed: o.s, m: M.ROCK }); break;
        case 'vent': for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; rock(P0, o.x + Math.cos(a) * s, y, o.z + Math.sin(a) * s, 0.6, [0.2, 0.15, 0.14], o.s + k); } disc(P0, o.x, y + 0.15, o.z, s * 0.8, 12, [1, 0.5, 0.1], { m: M.LAVA }); anim.fx.push({ kind: 'vent', p: [o.x, y + 0.3, o.z] }); anim.lights.push({ p: [o.x, y + 1.5, o.z], c: [1, 0.5, 0.15], r: 12, k: 1 }); break;
        case 'cloudtree': cyl(P0, 0.3, 0.22, y - 0.3, y + 3, 7, [1, 0.97, 0.9], { x: o.x, z: o.z, m: M.GLOSS }); for (let k = 0; k < 5; k++) sph(P0, [o.x + (rr() - 0.5) * 2, y + 3.3 + rr() * 1.4, o.z + (rr() - 0.5) * 2], 1.1 + rr() * 0.5, 1, [1, 0.98, 0.95], { m: M.CLOUD }); break;
        case 'fountain': cyl(P0, 3, 3.2, y - 0.3, y + 0.7, 18, [0.97, 0.96, 0.92], { x: o.x, z: o.z, m: M.GLOSS }); disc(T0, o.x, y + 0.6, o.z, 2.8, 18, [0.6, 0.85, 1], { m: M.WATER }); cyl(P0, 0.35, 0.35, y, y + 2.6, 10, [1, 0.85, 0.35], { x: o.x, z: o.z, m: M.GOLD }); anim.fx.push({ kind: 'fountain', p: [o.x, y + 2.6, o.z] }); break;
        case 'monolith': { const hh = 6 + rr() * 5; obox(P0, [o.x, y + hh / 2 - 0.5, o.z], [1, 0, 0], UP, [0, 0, 1], s * 0.8, hh / 2, s * 0.35, [0.06, 0.05, 0.09], { m: M.GLOSS }); for (let k = 0; k < 4; k++) box(P0, o.x - s * 0.82, y + 1 + k * 1.3, o.z - 0.05 - s * 0.36, o.x + s * 0.82, y + 1.08 + k * 1.3, o.z + 0.05 + s * 0.36, fid === 'secret' ? [0.4, 1, 0.9] : [0.75, 0.35, 1], { e: 1.3 }); break; }
        case 'shard': { const t = new MB(); cyl(t, 0.7, 0, 0, 3.2, 4, [1, 0.35, 0.85], { m: M.CRYSTAL, e: 0.5 }); cyl(t, 0, 0.7, -2.2, 0, 4, [0.8, 0.3, 1], { m: M.CRYSTAL, e: 0.5 }); anim.props.push({ mesh: upload(t.build()), p: [o.x, y + 3 + rr() * 2, o.z], h: rr() * TAU, kind: 'float', sp: 0.5 + rr(), ph: rr() * 6, s: 1 }); break; }
        case 'floater': { const t = new MB(); sph(t, [0, 0, 0], 1.2, 0, [0.25, 0.15, 0.45], { flat: true, m: M.GLOSS, e: 0.15 }); box(t, -1.25, -0.05, -1.25, 1.25, 0.05, 1.25, [0.8, 0.4, 1], { e: 1.2 }); anim.props.push({ mesh: upload(t.build()), p: [o.x, y + 4 + rr() * 3, o.z], h: 0, kind: 'float', sp: 0.3 + rr() * 0.4, ph: rr() * 6, s: 1 }); break; }
        case 'ruin': { const c = [0.62, 0.6, 0.58]; const hh = 2 + rr() * 4; cyl(P0, 0.6, 0.6, y - 0.5, y + hh, 10, c, { x: o.x, z: o.z, m: M.ROCK }); cyl(P0, 0.85, 0.85, y - 0.4, y + 0.2, 10, c, { x: o.x, z: o.z, m: M.ROCK }); if (rr() < 0.5) box(P0, o.x - 0.8, y + hh, o.z - 1.5, o.x + 0.8, y + hh + 0.6, o.z + 1.5, c, { m: M.ROCK }); box(P0, o.x - 0.5, y + 0.6, o.z + 0.58, o.x + 0.5, y + 0.66, o.z + 0.62, [0.5, 1, 0.95], { e: 1.4 }); break; }
      }
    }
    // small decorations
    const dec = { meadow: 900, clover: 900, mushroom: 500, crystal: 350, frozen: 260, lava: 260, heaven: 300, omega: 240, secret: 450, reborn: 700 }[fid];
    for (let i = 0; i < dec; i++) {
      const x = (r() * 2 - 1) * 74, z = (r() * 2 - 1) * 74; if (RC.blocked(L, x, z, 0.5)) continue; if (Math.hypot(x - L.portal[0], z - L.portal[1]) < 4) continue;
      const y = hgt(x, z); if (th.water && Math.hypot(x - th.water.x, z - th.water.z) < th.water.r + 2) continue; if (th.lava && lavaAt(x, z)) continue;
      const k = r();
      if (fid === 'meadow') { if (k < 0.35) flower(P0, x, y, z, [[1, 0.4, 0.5], [1, 1, 1], [0.6, 0.5, 1], [1, 0.85, 0.2]][(r() * 4) | 0]); else if (!gr) tuft(P0, x, y, z, cmul(th.g2, 0.9 + r() * 0.2)); }
      else if (fid === 'clover') { if (k < 0.5) { for (let q = 0; q < 3; q++) sph(P0, [x + Math.cos(q * 2.1) * 0.12, y + 0.12, z + Math.sin(q * 2.1) * 0.12], 0.12, 0, [0.25, 0.62, 0.2], { sc: [1, 0.25, 1], flat: true }); } else if (k < 0.62) { cyl(P0, 0.04, 0.03, y, y + 1.3, 4, [0.3, 0.55, 0.2], { x, z }); sph(P0, [x, y + 1.35, z], 0.3, 1, [1, 0.82, 0.1], { sc: [1, 0.3, 1] }); sph(P0, [x, y + 1.38, z], 0.12, 0, [0.45, 0.28, 0.12], { sc: [1, 0.5, 1] }); } else if (!gr) tuft(P0, x, y, z, th.g2); }
      else if (fid === 'mushroom') { if (k < 0.55) { const gl = r() < 0.5; cyl(P0, 0.05, 0.06, y, y + 0.3, 5, [0.95, 0.9, 0.8], { x, z }); sph(P0, [x, y + 0.3, z], 0.17, 1, gl ? [0.4, 1, 0.6] : [0.85, 0.55, 0.3], { sc: [1, 0.5, 1], cut: 0, e: gl ? 0.8 : 0 }); } else if (!gr) tuft(P0, x, y, z, th.g2); }
      else if (fid === 'crystal') { const c = [[0.7, 0.4, 1], [0.35, 0.85, 1], [1, 0.45, 0.85]][(r() * 3) | 0]; cyl(P0, 0.12, 0, y - 0.1, y + 0.4 + r() * 0.6, 4, c, { x, z, m: M.CRYSTAL, e: 0.5 }); }
      else if (fid === 'frozen') { sph(P0, [x, y, z], 0.6 + r() * 0.6, 1, [0.95, 0.97, 1], { sc: [1, 0.35, 1], m: M.SNOW }); }
      else if (fid === 'lava') { rock(P0, x, y - 0.2, z, 0.25 + r() * 0.4, [0.15, 0.12, 0.12], i, M.ROCK); if (k < 0.15) anim.fx.push({ kind: 'smoke', p: [x, y, z] }); }
      else if (fid === 'heaven') { sph(P0, [x, y + 0.2, z], 0.5 + r() * 0.7, 1, [1, 1, 1], { sc: [1, 0.5, 1], m: M.CLOUD }); if (k < 0.1) flower(P0, x, y, z, [1, 0.9, 0.5]); }
      else if (fid === 'omega') { const s = 0.15 + r() * 0.35; box(P0, x - s, y + 0.2, z - s, x + s, y + 0.2 + s * 2, z + s, r() < 0.5 ? [0.2, 1, 0.9] : [0.9, 0.3, 1], { e: 0.9 }); }
      else if (fid === 'reborn') { if (k < 0.3) flower(P0, x, y, z, [[1, 0.5, 0.8], [1, 1, 1], [0.8, 0.6, 1]][(r() * 3) | 0]); else if (k < 0.42) cyl(P0, 0.1, 0, y - 0.1, y + 0.4 + r() * 0.5, 4, [1, 0.5, 0.9], { x, z, m: M.CRYSTAL, e: 0.5 }); else if (!gr) tuft(P0, x, y, z, cmul(th.g2, 0.9 + r() * 0.2)); }
      else if (fid === 'secret') { if (k < 0.3) { const c = [[0.5, 1, 0.9], [1, 0.6, 1], [1, 0.9, 0.5]][(r() * 3) | 0]; G0.q([x - 0.4, y + 0.05, z - 0.4], [x - 0.4, y + 0.05, z + 0.4], [x + 0.4, y + 0.05, z + 0.4], [x + 0.4, y + 0.05, z - 0.4], c, { e: 1.2, h: [x, y - 1, z] }); } else if (!gr) tuft(P0, x, y, z, th.g2); }
    }
    // woods on the hills round the field
    const hillKind = { meadow: 'tree', clover: 'tree', reborn: 'tree', mushroom: 'tree', secret: 'tree', frozen: 'pine' }[fid];
    if (hillKind) for (let i = 0; i < 90; i++) {
      const sd = (r() * 4) | 0, u0 = (r() * 2 - 1) * 92, v0 = RC.FIELD_R + 3 + r() * 14, x = sd === 0 ? u0 : sd === 1 ? -u0 : sd === 2 ? v0 : -v0, z = sd === 0 ? v0 : sd === 1 ? -v0 : sd === 2 ? -u0 : u0;
      if (hillKind === 'pine') pine(P0, x, hgt(x, z), z, 1.2 + r() * 0.8, r, true);
      else tree(P0, x, hgt(x, z), z, 1.3 + r() * 0.7, r, fid === 'secret' ? [[0.35, 0.25, 0.5], [0.25, 0.4, 0.35]] : fid === 'mushroom' ? [[0.15, 0.4, 0.2], [0.2, 0.35, 0.25]] : fid === 'reborn' ? [[1, 0.62, 0.82], [0.98, 0.5, 0.75], [1, 0.78, 0.9]] : [[0.3, 0.62, 0.22], [0.4, 0.7, 0.25], [0.25, 0.55, 0.3]], 1);
    }
    // the way home: a portal back to the lobby
    portalMesh(P0, T0, L.portal[0], hgt(L.portal[0], L.portal[1]), L.portal[1], 0, [0.4, 1, 0.5], 'back', anim);
    // boundary fence or walls
    if (!th.cave && th.mat !== 'CLOUD') { const fc = fid === 'frozen' ? [0.55, 0.42, 0.3] : fid === 'lava' ? [0.25, 0.2, 0.18] : fid === 'omega' ? [0.6, 0.3, 1] : [0.6, 0.45, 0.3], fm = fid === 'omega' ? M.NEON : M.WOOD;
      for (const side of [[1, 0, 1], [1, 0, -1], [0, 1, 1], [0, 1, -1]]) for (let i = -36; i <= 36; i++) {
        const a = side[0] ? [i * 2.1, side[2] * (RC.FIELD_R - 1.5)] : [side[2] * (RC.FIELD_R - 1.5), i * 2.1], y = hgt(a[0], a[1]); cyl(P0, 0.1, 0.09, y - 0.2, y + 1.15, 6, fc, { x: a[0], z: a[1], m: fm });
        if (i < 36) { const b = side[0] ? [(i + 1) * 2.1, a[1]] : [a[0], (i + 1) * 2.1], yb = hgt(b[0], b[1]); for (const hh of [0.45, 0.9]) { const p0 = [a[0], y + hh, a[1]], p1 = [b[0], yb + hh, b[1]], d = norm(sub(p1, p0)), rr = norm(cross(d, UP)), uu = cross(rr, d); obox(P0, vlerp(p0, p1, 0.5), rr, uu, d, 0.035, 0.06, dist(p0, p1) / 2, fc, { m: fm }); } }
      } }
    if (th.mat === 'CLOUD') for (let i = 0; i < 80; i++) { const a = i / 80 * TAU, rr = RC.FIELD_R + 2; const x = Math.cos(a) * rr * 1.1, z = Math.sin(a) * rr * 1.1; cyl(P0, 0.18, 0.18, -2, 1.3, 6, [1, 0.85, 0.35], { x: clamp(x, -RC.FIELD_R, RC.FIELD_R), z: clamp(z, -RC.FIELD_R, RC.FIELD_R), m: M.GOLD }); }
    // the distant view: big shapes past the fence
    const far = new MB();
    for (let i = 0; i < 26; i++) {
      const a = i / 26 * TAU + r() * 0.1, d = 200 + r() * 90, x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (fid === 'lava' && i % 7 === 0) { cyl(far, 34, 8, -10, 46, 14, [0.16, 0.1, 0.09], { x, z, m: M.ROCK }); disc(far, x, 46.2, z, 7.5, 12, [1, 0.5, 0.1], { m: M.LAVA }); anim.fx.push({ kind: 'volcano', p: [x, 46, z] }); continue; }
      if (fid === 'heaven') { sph(far, [x, -6 + r() * 10, z], 18 + r() * 14, 1, [1, 1, 1], { sc: [1.6, 0.6, 1.2], m: M.CLOUD }); continue; }
      if (fid === 'omega') { const t = new MB(); sph(t, [0, 0, 0], 8 + r() * 10, 0, [0.25, 0.12, 0.45], { flat: true, e: 0.25 }); anim.props.push({ mesh: upload(t.build()), p: [x, 20 + r() * 40, z], h: r() * TAU, kind: 'float', sp: 0.1, ph: r() * 6, s: 1, far: 1 }); continue; }
      const hh = 14 + r() * 26, col = cmul(th.wall, 0.7 + r() * 0.3), rad = 34 + r() * 24;
      sph(far, [x, -12, z], rad, 1, col, { sc: [1, hh / rad, 1], jit: 0.25, seed: i, m: th.mat === 'SNOW' ? M.SNOW : M.ROCK });
    }
    const A = { id: fid, chunks: chunked([G0], 32, 96), pchunks: chunked([P0], 32, 96), hm: hmTexture(TI, densf, shadeOf), trans: upload(T0.build()), far: [upload(far.build())], anim, env: th, R: RC.FIELD_R, cols: L.obs.map(o => [o.x, o.z, o.r, hgt(o.x, o.z) + ({ tree: o.r * 5, rock: o.r * 1.15, windmill: 10, bigshroom: o.r * 2.4, crystal: o.r * 3.2, pillar: 8, pine: o.r * 5.5, iceberg: o.r * 1.4, volcanic: o.r * 2.7, vent: 1.2, cloudtree: 5, fountain: 2.7, monolith: 11, ruin: 5.5 }[o.kind] || 0)]), height: (x, z) => hgt(x, z), portalHome: [L.portal[0], hgt(L.portal[0], L.portal[1]), L.portal[1]], spawn: L.spawn };
    return A;
  }
  function portalMesh(P0, T0, x, y, z, h, col, signKey, anim, locked) {
    const f = fwdOf(h), r = rightOf(h);
    for (const sd of [-1, 1]) { cyl(P0, 0.35, 0.4, y - 0.3, y + 4.2, 8, [0.95, 0.9, 0.8], { x: x + r[0] * sd * 2.3, z: z + r[2] * sd * 2.3, m: M.GLOSS }); sph(P0, [x + r[0] * sd * 2.3, y + 4.4, z + r[2] * sd * 2.3], 0.5, 1, col, { e: 0.6, m: M.GLOSS }); }
    const t = new MB(); tor(t, 2.3, 0.28, 28, 8, [0.95, 0.9, 0.8], { m: M.GLOSS }); P0.add(t, model(m4(), [x, y + 2.3, z], UP, f, 1));
    const seg = 32, c = [x, y + 2.3, z];
    for (let i = 0; i < seg; i++) { const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU; const p0 = madd(madd(c, r, Math.cos(a0) * 2.1), UP, Math.sin(a0) * 2.1), p1 = madd(madd(c, r, Math.cos(a1) * 2.1), UP, Math.sin(a1) * 2.1);
      T0.t(c, p0, p1, locked ? cmul(col, 0.35) : col, { m: M.PORTAL, uv: [[0.5, 0.5], [0.5 + Math.cos(a0) * 0.5, 0.5 + Math.sin(a0) * 0.5], [0.5 + Math.cos(a1) * 0.5, 0.5 + Math.sin(a1) * 0.5]], h: madd(c, f, -1) }); }
    if (signKey) signBoard(P0, x + f[0] * 0.4, y + 4.9, z + f[2] * 0.4, h, 4.6, signKey);
    if (locked) { const uv = ATLAS.r.lock; board(P0, madd(c, f, 0.12), mul(r, -1), UP, 0.9, 0.9, [1, 1, 1], uv, { e: 0.3 }); board(P0, madd(c, f, -0.12), r, UP, 0.9, 0.9, [1, 1, 1], uv, { e: 0.3 }); }
    anim.lights.push({ p: c, c: col, r: 8, k: locked ? 0.25 : 0.8 });
  }
  // ---------- the lobby ----------
  function buildLobby(level, reb) {
    const th = THEMES.lobby, r = mulberry(77), G0 = new MB(), P0 = new MB(), T0 = new MB(), anim = { props: [], lights: [], fx: [], boards: [] };
    const TI = terrain(G0, 'lobby', 72, 2, (x, z) => { const d = Math.hypot(x, z); if (d < HALL.R + 0.6) return cmix([0.86, 0.78, 0.66], [0.76, 0.69, 0.59], vnoise2(x * 0.3, z * 0.3)); return cmix(cmul(th.grass.c1, 1.05), th.grass.c2, shadeOf(x, z)); }, (x, z) => Math.hypot(x, z) < HALL.R + 0.6 ? M.PATH : M.GRASS);
    const trees = [];
    lobbyHall(P0, T0, anim);
    // the fountain and the golden rat statue (drawn as a real rat at runtime)
    cyl(P0, 5.25, 5.7, -0.2, 0.86, 40, [0.88, 0.85, 0.8], { m: M.GLOSS }); cyl(P0, 5.9, 6.2, -0.05, 0.22, 40, [0.62, 0.58, 0.55], { m: M.ROCK }); { const t = new MB(); tor(t, 5.25, 0.17, 48, 8, [1, 0.82, 0.3], { m: M.GOLD }); P0.add(t, model(m4(), [0, 0.88, 0], [0, 0, 1], UP, 1)); }
    cyl(P0, 4.9, 4.9, 0.05, 0.12, 40, [0.18, 0.42, 0.6], {}); disc(T0, 0, 0.75, 0, 4.95, 40, [0.35, 0.7, 1], { m: M.WATER });
    cyl(P0, 1.6, 2.0, 0.6, 2.6, 24, [0.88, 0.85, 0.8], { m: M.GLOSS }); cyl(P0, 1.95, 1.95, 2.6, 2.85, 24, [1, 0.82, 0.3], { m: M.GOLD }); { const t = new MB(); tor(t, 1.72, 0.1, 32, 6, [1, 0.82, 0.3], { m: M.GOLD }); P0.add(t, model(m4(), [0, 1.2, 0], [0, 0, 1], UP, 1)); }
    anim.fx.push({ kind: 'fountain', p: [0, 2.9, 0], ring: 1 });
    // the welcome arch with the logo (south of the fountain, facing the spawn)
    { const y = 0; for (const sd of [-1, 1]) cyl(P0, 0.5, 0.6, y, 6.5, 10, [1, 0.82, 0.3], { x: sd * 7, z: 8, m: M.GOLD }); const uv = ATLAS.r.logo; obox(P0, [0, 7.2, 8], [1, 0, 0], UP, [0, 0, 1], 7.8, 1.5, 0.25, [0.17, 0.11, 0.23], {}); board(P0, [0, 7.2, 8.27], [1, 0, 0], UP, 7.4, 1.35, [1, 1, 1], uv, { e: 0.2 }); board(P0, [0, 7.2, 7.73], [-1, 0, 0], UP, 7.4, 1.35, [1, 1, 1], uv, { e: 0.2 }); }
    // portals to the fields
    PORTALS.forEach((p, i) => { const f = FI[p.f], locked = !RC.canEnter(f, level || 1, reb || 0); const col = hexc(['#7be05a', '#3fd16a', '#58e0c8', '#b47bff', '#9fe0ff', '#ff7a2a', '#fff0a0', '#b05cff', '#ff6ae0', '#ff9af0'][i] || '#ffffff'); portalMesh(P0, T0, p.x, 0, p.z, p.h, col, 'pt_' + p.f, anim, locked); if (locked) signBoard(P0, p.x + fwdOf(p.h)[0] * 0.5, 6.3, p.z + fwdOf(p.h)[2] * 0.5, p.h, 2.6, f.reb ? 'lv_reborn' : 'lv_lock');
      if (f.reb) { for (const sd of [-1, 1]) { const q = madd([p.x, 0, p.z], rightOf(p.h), sd * 3.4); cyl(P0, 0.5, 0.55, 0, 5.4, 10, [0.85, 0.75, 0.95], { x: q[0], z: q[2], m: M.GLOSS }); sph(P0, [q[0], 5.7, q[2]], 0.6, 1, [1, 0.6, 0.95], { m: M.CRYSTAL, e: 0.8 }); } } });
    // stations
    for (const s of STATIONS) stationProp(P0, T0, s, anim, level);
    // trees and lamps around the plaza
    for (let i = 0; i < 46; i++) { const a = i / 46 * TAU + r() * 0.05, d = 56 + r() * 12, x = Math.sin(a) * d, z = Math.cos(a) * d; tree(P0, x, lobbyHeight(x, z), z, 1.2 + r() * 0.6, r, [[0.3, 0.62, 0.22], [0.45, 0.72, 0.28], [0.95, 0.6, 0.75]], 1); trees.push([x, z]); }
    const densf = (x, z) => { const d = Math.hypot(x, z); if (d < HALL.R + 2 || d > 70) return 0; let k = smooth(clamp((d - HALL.R - 2) / 2.5, 0, 1)); for (const t of trees) { const dd = Math.hypot(x - t[0], z - t[1]) - 0.8; if (dd < 0) return 0; if (dd < 1.2) k *= dd / 1.2; } return k; };
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + 0.2, x = Math.sin(a) * 40, z = Math.cos(a) * 40; cyl(P0, 0.12, 0.15, 0, 4, 6, [0.25, 0.2, 0.3], { x, z, m: M.METAL }); sph(P0, [x, 4.2, z], 0.4, 1, [1, 0.92, 0.6], { e: 1.3 }); }
    const far = new MB(), rf = mulberry(99);
    for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + rf() * 0.1, d = 190 + rf() * 90, x = Math.sin(a) * d, z = Math.cos(a) * d, hh = 16 + rf() * 26, rad = 34 + rf() * 24; sph(far, [x, -12, z], rad, 1, cmul([0.42, 0.58, 0.3], 0.7 + rf() * 0.3), { sc: [1, hh / rad, 1], jit: 0.25, seed: i, m: M.ROCK }); }
    const A = { id: 'lobby', chunks: chunked([G0], 36, 72), pchunks: chunked([P0], 36, 72), hm: hmTexture(TI, densf, shadeOf), trans: upload(T0.build()), far: [upload(far.build())], anim, env: th, R: LOBBY.R, cols: lobbyColliders().concat(HALL.cols), height: lobbyHeight, level: level || 1, reb: reb || 0, spawn: LOBBY.spawn };
    return A;
  }
  // ---------- the lobby hall: a round atrium with arched windows, a glass dome, banners, planters and carpets ----------
  const HALL = { R: 49, H: 11, N: 40, cols: [] };
  function lobbyHall(P0, T0, anim) {
    const R = HALL.R, H = HALL.H, N = HALL.N, D = 0.7, cream = [0.9, 0.85, 0.76], stone = [0.78, 0.73, 0.66], gold = [1, 0.8, 0.32], frame = [0.95, 0.93, 0.88], wood = [0.42, 0.27, 0.17];
    const hw = 1.8, v0 = 1.3, v1 = 6.6, K = 14; HALL.cols = [];
    for (let i = 0; i < N; i++) {
      const a0 = i / N * TAU, a1 = (i + 1) / N * TAU, p0 = [Math.sin(a0) * R, 0, Math.cos(a0) * R], p1 = [Math.sin(a1) * R, 0, Math.cos(a1) * R];
      const c = vlerp(p0, p1, 0.5), tg = norm(sub(p1, p0)), n = norm([-c[0], 0, -c[2]]), w2 = dist(p0, p1) / 2;
      const Q = (u, v, d) => [c[0] + tg[0] * u - n[0] * (d || 0), v, c[2] + tg[2] * u - n[2] * (d || 0)], col = { m: M.PLAIN };
      // wall around an arched window: the band below it, the sides and the part above the arch
      P0.q(Q(-w2, 0), Q(w2, 0), Q(w2, v0), Q(-w2, v0), wood, { m: M.WOOD });
      P0.q(Q(-w2, v0), Q(-hw, v0), Q(-hw, H), Q(-w2, H), cream, col); P0.q(Q(hw, v0), Q(w2, v0), Q(w2, H), Q(hw, H), cream, col);
      for (let k = 0; k < K; k++) { const t0 = k / K * Math.PI, t1 = (k + 1) / K * Math.PI, A0 = Q(Math.cos(t0) * hw, v1 + Math.sin(t0) * hw), A1 = Q(Math.cos(t1) * hw, v1 + Math.sin(t1) * hw);
        P0.q(A0, A1, Q(Math.cos(t1) * hw, H), Q(Math.cos(t0) * hw, H), cream, col);
        // the arch's reveal through the wall, and its white frame
        P0.q(A0, A1, madd(A1, n, -D), madd(A0, n, -D), stone, col);
        const m0 = vlerp(A0, A1, 0.5), dd = norm(sub(A1, A0)); obox(P0, madd(m0, n, -0.1), norm(cross(dd, n)), dd, n, 0.09, dist(A0, A1) / 2 + 0.02, 0.1, frame, {}); }
      for (const s of [-1, 1]) P0.q(Q(s * hw, v0), Q(s * hw, v1), Q(s * hw, v1, D), Q(s * hw, v0, D), stone, col);
      P0.q(Q(-hw, v0), Q(hw, v0), Q(hw, v0, D), Q(-hw, v0, D), stone, col);
      // window frame, mullion and transom; the glass sits in the middle of the wall
      obox(P0, Q(0, v0 + 0.06, 0.25), tg, UP, n, hw + 0.25, 0.08, 0.32, frame, {});
      for (const s of [-1, 1]) obox(P0, Q(s * hw, (v0 + v1) / 2, 0.1), tg, UP, n, 0.09, (v1 - v0) / 2, 0.1, frame, {});
      obox(P0, Q(0, (v0 + v1 + hw) / 2, D / 2), tg, UP, n, 0.05, (v1 + hw - v0) / 2, 0.05, frame, {});
      obox(P0, Q(0, v1, D / 2), tg, UP, n, hw, 0.05, 0.05, frame, {});
      T0.q(Q(-hw, v0, D / 2), Q(hw, v0, D / 2), Q(hw, v1, D / 2), Q(-hw, v1, D / 2), [0.75, 0.9, 1], { m: M.GLASS, h: madd(c, n, 3) });
      for (let k = 0; k < K; k++) { const t0 = k / K * Math.PI, t1 = (k + 1) / K * Math.PI; T0.t(Q(0, v1, D / 2), Q(Math.cos(t0) * hw, v1 + Math.sin(t0) * hw, D / 2), Q(Math.cos(t1) * hw, v1 + Math.sin(t1) * hw, D / 2), [0.75, 0.9, 1], { m: M.GLASS, h: madd(c, n, 3) }); }
      // a pilaster with a base and a golden capital at the start of each bay
      const pc = [Math.sin(a0) * (R - 0.32), 0, Math.cos(a0) * (R - 0.32)], pn = norm([-pc[0], 0, -pc[2]]), pt = norm(cross(UP, pn));
      obox(P0, [pc[0], H / 2, pc[2]], pt, UP, pn, 0.45, H / 2, 0.32, stone, {}); obox(P0, [pc[0], 0.35, pc[2]], pt, UP, pn, 0.58, 0.35, 0.42, [0.62, 0.56, 0.5], {});
      obox(P0, [pc[0], H - 2.3, pc[2]], pt, UP, pn, 0.6, 0.22, 0.44, gold, { m: M.GOLD });
    }
    // a frieze, a cornice and the rim the dome stands on
    lathe(P0, [[R - 0.42, 8.9], [R - 0.42, 10.0]], 80, [0.42, 0.28, 0.68], { m: M.FUR });
    lathe(P0, [[R - 0.48, 8.82], [R - 0.48, 8.94]], 80, gold, { m: M.GOLD }); lathe(P0, [[R - 0.48, 9.96], [R - 0.48, 10.08]], 80, gold, { m: M.GOLD });
    lathe(P0, [[R - 0.1, H - 0.6], [R - 0.9, H - 0.2], [R - 1.1, H + 0.2], [R + 0.3, H + 0.2]], 80, [0.93, 0.9, 0.84], {});
    // the glass dome: a shallow cap of glass with white iron ribs and rings, an open lantern at the top
    const DH = 14, RS = (R * R + DH * DH) / (2 * DH), yc = H + DH - RS, prof = [];
    for (let k = 0; k <= 10; k++) { const rr = lerp(R - 0.3, 5, k / 10), y = yc + Math.sqrt(RS * RS - rr * rr); prof.push([rr, y]); }
    lathe(T0, prof.map(q => [q[0], q[1] + 0.05]).reverse(), 40, [0.8, 0.92, 1], { m: M.GLASS });
    const RIB = 24, rib = [0.93, 0.93, 0.9];
    for (let j = 0; j < RIB; j++) { const a = j / RIB * TAU, s = Math.sin(a), cA = Math.cos(a);
      for (let k = 0; k < 10; k++) { const A = [s * prof[k][0], prof[k][1], cA * prof[k][0]], B = [s * prof[k + 1][0], prof[k + 1][1], cA * prof[k + 1][0]], d = norm(sub(B, A)), side = [cA, 0, -s], up = norm(cross(d, side));
        obox(P0, vlerp(A, B, 0.5), side, up, d, 0.14, 0.24, dist(A, B) / 2 + 0.05, rib, { m: M.METAL }); } }
    for (const k of [0, 3, 6, 10]) { const t = new MB(); tor(t, prof[k][0], k === 10 ? 0.35 : 0.2, 64, 6, k === 10 ? gold : rib, { m: k === 10 ? M.GOLD : M.METAL }); P0.add(t, model(m4(), [0, prof[k][1], 0], [0, 0, 1], UP, 1)); }
    // the lantern on top of the dome
    const ty = prof[10][1]; cyl(T0, 5, 5, ty, ty + 2.6, 24, [0.8, 0.92, 1], { m: M.GLASS, cap: false });
    for (let j = 0; j < 12; j++) { const a = j / 12 * TAU; cyl(P0, 0.12, 0.12, ty, ty + 2.6, 5, rib, { x: Math.sin(a) * 5, z: Math.cos(a) * 5, m: M.METAL }); }
    lathe(P0, [[5.6, ty + 2.6], [4.2, ty + 3.6], [0.4, ty + 5.4], [0.0, ty + 5.5]], 24, gold, { m: M.GOLD });
    // a ring chandelier hanging under the lantern
    { const cy = 17.5, t = new MB(); tor(t, 3.2, 0.16, 40, 8, gold, { m: M.GOLD }); P0.add(t, model(m4(), [0, cy, 0], [0, 0, 1], UP, 1));
      for (let j = 0; j < 16; j++) { const a = j / 16 * TAU, x = Math.sin(a) * 3.2, z = Math.cos(a) * 3.2; cyl(P0, 0.05, 0.05, cy, cy + 0.35, 5, gold, { x, z }); sph(P0, [x, cy + 0.5, z], 0.2, 1, [1, 0.93, 0.7], { e: 1.5 }); }
      for (let j = 0; j < 4; j++) { const a = j / 4 * TAU + 0.4, A = [Math.sin(a) * 3.2, cy, Math.cos(a) * 3.2], B = [Math.sin(a) * 4.6, ty, Math.cos(a) * 4.6], d = norm(sub(B, A)); obox(P0, vlerp(A, B, 0.5), norm(cross(d, UP)), d, norm(cross(norm(cross(d, UP)), d)), 0.04, dist(A, B) / 2, 0.04, [0.3, 0.26, 0.24], { m: M.METAL }); }
      anim.lights.push({ p: [0, cy, 0], c: [1, 0.85, 0.6], r: 22, k: 0.55 }); }
    // banners between the windows, each with a cheese badge
    const bc = [[0.45, 0.25, 0.75], [0.95, 0.62, 0.12], [0.2, 0.62, 0.72], [0.85, 0.2, 0.3]], ch = ATLAS.r.cheese;
    for (let i = 0; i < N; i += 2) { const a = i / N * TAU, p = [Math.sin(a) * (R - 0.72), 0, Math.cos(a) * (R - 0.72)], n = norm([-p[0], 0, -p[2]]), tg = norm(cross(UP, n)), col = bc[(i / 2) % 4];
      const T = 8.4, B = 4.2, bw = 0.5; P0.q(madd([p[0], B + 0.6, p[2]], tg, -bw), madd([p[0], B + 0.6, p[2]], tg, bw), madd([p[0], T, p[2]], tg, bw), madd([p[0], T, p[2]], tg, -bw), col, { m: M.FUR, h: madd(p, n, -2) });
      P0.t(madd([p[0], B + 0.6, p[2]], tg, -bw), [p[0], B, p[2]], madd([p[0], B + 0.6, p[2]], tg, bw), col, { m: M.FUR, h: madd(p, n, -2) });
      obox(P0, [p[0], T + 0.08, p[2]], tg, UP, n, bw + 0.14, 0.05, 0.05, gold, { m: M.GOLD });
      if (ch) board(P0, madd([p[0], 6.6, p[2]], n, 0.03), tg, UP, 0.36, 0.36, [1, 1, 1], ch, { e: 0.1 }); }
    // planters with little trees and benches round the edge of the hall (kept clear of the portals, the reborn gate and the showcases)
    const rp = mulberry(321);
    for (let i = 0; i < 16; i++) { const a = (i + 0.5) / 16 * TAU, deg = (a / DEG + 360) % 360; if (deg > 145 && deg < 225) continue; if (deg < 14 || deg > 346) continue;
      const x = Math.sin(a) * 44.5, z = Math.cos(a) * 44.5;
      const t = new MB(); lathe(t, [[0, 0], [1.25, 0], [1.4, 0.75], [1.48, 0.95], [1.3, 0.95], [1.3, 0.85], [0, 0.85]], 20, j => j === 3 || j === 4 ? gold : [0.66, 0.6, 0.55], {}); disc(t, 0, 0.86, 0, 1.3, 20, [0.3, 0.2, 0.13], {});
      P0.add(t, model(m4(), [x, 0, z], [0, 0, 1], UP, 1));
      tree(P0, x, 0.85, z, 0.72, rp, [[0.3, 0.62, 0.22], [0.4, 0.7, 0.26], [0.95, 0.6, 0.75]], 1); HALL.cols.push([x, z, 1.5, 6]);
      const b = (i + 1) / 16 * TAU, bx = Math.sin(b) * 45.6, bz = Math.cos(b) * 45.6, bdeg = (b / DEG + 360) % 360;
      if (bdeg > 145 && bdeg < 225) continue; const bn = norm([-bx, 0, -bz]), bt = norm(cross(UP, bn));
      obox(P0, [bx, 0.5, bz], bt, UP, bn, 1.1, 0.06, 0.28, wood, { m: M.WOOD }); { const bu = norm(add(UP, mul(bn, -0.25))); obox(P0, madd([bx, 0.92, bz], bn, -0.26), bt, bu, norm(cross(bt, bu)), 1.1, 0.25, 0.04, wood, { m: M.WOOD }); }
      for (const s of [-1, 1]) obox(P0, madd([bx, 0.25, bz], bt, s * 0.95), bt, UP, bn, 0.06, 0.25, 0.26, [0.25, 0.22, 0.24], { m: M.METAL });
      HALL.cols.push([bx, bz, 0.9, 1.2]); }
    // a red carpet from the fountain to the portals, and a round rug around the fountain
    obox(P0, [0, 0.02, 18.6], [1, 0, 0], UP, [0, 0, 1], 1.5, 0.02, 11.9, [0.62, 0.1, 0.13], { m: M.FUR });
    for (const s of [-1, 1]) obox(P0, [s * 1.62, 0.025, 18.6], [1, 0, 0], UP, [0, 0, 1], 0.14, 0.02, 11.9, gold, { m: M.FUR });
    floorRing(P0, 6.5, 8.7, 0.022, 64, [0.4, 0.24, 0.62], { m: M.FUR }); floorRing(P0, 8.7, 9.0, 0.026, 64, gold, { m: M.FUR }); floorRing(P0, 6.25, 6.5, 0.026, 64, gold, { m: M.FUR });
    // brass inlays in the floor and a dark band along the wall
    for (const [r0, r1] of [[17.4, 18.6], [33.5, 34.5], [44.1, 44.9]]) floorRing(P0, r0, r1, 0.012, 96, [0.93, 0.68, 0.32], { m: M.GOLD });
    floorRing(P0, R - 1.8, R + 0.2, 0.012, 96, [0.34, 0.26, 0.24], { m: M.PATH });
  }
  function floorRing(mb, r0, r1, y, seg, col, o) { for (let i = 0; i < seg; i++) { const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU, s0 = Math.sin(a0), c0 = Math.cos(a0), s1 = Math.sin(a1), c1 = Math.cos(a1); mb.q([s0 * r0, y, c0 * r0], [s1 * r0, y, c1 * r0], [s1 * r1, y, c1 * r1], [s0 * r1, y, c0 * r1], col, Object.assign({ ns: [UP, UP, UP, UP] }, o)); } }
  function lobbyColliders() { const c = [[0, 0, 5.7, 4.5], [-7, 8, 0.7, 8.8], [7, 8, 0.7, 8.8]]; for (const p of PORTALS) if (p.reb) for (const sd of [-1, 1]) { const q = madd([p.x, 0, p.z], rightOf(p.h), sd * 3.4); c.push([q[0], q[2], 0.65, 6.3]); } for (const s of STATIONS) if (s.id !== 'showcase') c.push([s.x, s.z, s.id === 'rebirth' ? 1.6 : 1.9, s.id === 'leaderboard' ? 6.5 : 4.6]); for (const p of PORTALS) { const r = rightOf(p.h); for (const sd of [-1, 1]) c.push([p.x + r[0] * sd * 2.3, p.z + r[2] * sd * 2.3, 0.55, 5]); } for (let i = 0; i < 20; i++) { const s = RC.showcaseStand(i); c.push([s.x, s.z, 1.0, 0.8]); } return c; }
  function stationProp(P0, T0, s, anim, level) {
    const x = s.x, z = s.z, h = s.h, f = fwdOf(h), r = rightOf(h), loc = (a, b, c) => [x + r[0] * a + f[0] * c, b, z + r[2] * a + f[2] * c];
    const ob = (a, b, c, w, hh, d, col, o) => obox(P0, loc(a, b, c), r, UP, f, w, hh, d, col, o);
    const signY = { showcase: 5.5, rebirth: 6, leaderboard: 6.4, events: 5.2 }[s.id] || 3.8;
    switch (s.id) {
      case 'shop': ob(0, 0.6, 0, 2.2, 0.6, 0.7, [0.6, 0.38, 0.22], { m: M.WOOD }); for (const sd of [-1, 1]) cyl(P0, 0.1, 0.1, 0, 3.3, 6, [0.6, 0.38, 0.22], { x: loc(sd * 2.1, 0, -0.6)[0], z: loc(sd * 2.1, 0, -0.6)[2], m: M.WOOD });
        for (let i = 0; i < 8; i++) ob(-2.1 + i * 0.6 + 0.3, 3.3, 0.1, 0.3, 0.1, 1.2, i % 2 ? [1, 1, 1] : [1, 0.55, 0.15], {});
        for (let i = 0; i < 5; i++) { const p = loc(-1.6 + i * 0.8, 1.25, 0.2); cyl(P0, 0.14, 0.14, 1.2, 1.55, 8, [[0.37, 0.86, 0.42], [1, 0.82, 0.2], [0.27, 0.69, 1], [1, 0.48, 0.23], [1, 0.36, 0.94]][i], { x: p[0], z: p[2], m: M.GLASS }); sph(P0, [p[0], 1.62, p[2]], 0.07, 0, [0.6, 0.4, 0.25], {}); } break;
      case 'eggs': cyl(P0, 2.2, 2.4, 0, 0.5, 18, [1, 0.95, 0.88], { x, z, m: M.GLOSS }); RC.EGGS.forEach((e, i) => { const p = loc(-1.35 + i * 0.9, 0.5, 0.3); cyl(P0, 0.32, 0.36, 0.5, 0.9, 10, [0.95, 0.85, 0.6], { x: p[0], z: p[2], m: M.GOLD }); anim.props.push({ mesh: eggMesh(e.id), p: [p[0], 0.9, p[2]], h, kind: 'egg', ph: i, s: 0.9 }); }); sph(T0, [x, 0.5, z], 2.3, 2, [0.8, 0.95, 1], { sc: [1, 0.8, 1], cut: 0, m: M.GLASS }); break;
      case 'bank': ob(0, 1.6, 0, 1.7, 1.6, 1.1, [0.85, 0.8, 0.72], { m: M.GLOSS }); ob(0, 3.4, 0, 1.9, 0.25, 1.3, [1, 0.82, 0.3], { m: M.GOLD }); cyl(P0, 0.75, 0.75, 1.3, 1.45, 18, [1, 0.82, 0.2], { x: loc(0, 0, 1.12)[0], z: loc(0, 0, 1.12)[2], m: M.GOLD });
        { const t = new MB(); cyl(t, 0.8, 0.8, -0.06, 0.06, 20, [1, 0.8, 0.15], { m: M.GOLD }); anim.props.push({ mesh: upload(t.build()), p: [x, 4.6, z], h, kind: 'coin', ph: 0, s: 1 }); } break;
      case 'inventory': sph(P0, [x, 1.3, z], 1.3, 2, [0.55, 0.35, 0.85], { sc: [1, 1.1, 0.8], m: M.GLOSS }); ob(0, 2.6, 0, 0.6, 0.12, 0.3, [0.35, 0.22, 0.6], {}); ob(0, 1.0, 0.95, 0.7, 0.5, 0.15, [0.45, 0.28, 0.75], { m: M.GLOSS }); ob(0, 1.35, 1.08, 0.08, 0.1, 0.05, [1, 0.82, 0.2], { m: M.GOLD }); break;
      case 'daily': ob(0, 1.3, 0, 1.0, 1.3, 0.25, [1, 1, 1], { m: M.GLOSS }); ob(0, 2.4, 0.02, 1.0, 0.25, 0.27, [1, 0.35, 0.35], {}); for (let i = 0; i < 7; i++) ob(-0.75 + (i % 4) * 0.5, 1.75 - Math.floor(i / 4) * 0.55, 0.26, 0.2, 0.2, 0.02, i === 6 ? [1, 0.82, 0.2] : [0.9, 0.86, 0.8], { e: i === 6 ? 0.4 : 0 });
        ob(1.6, 0.45, 0.4, 0.45, 0.45, 0.45, [0.3, 0.6, 1], { m: M.GLOSS }); ob(1.6, 0.45, 0.4, 0.1, 0.47, 0.47, [1, 0.85, 0.2], {}); break;
      case 'achievements': cyl(P0, 1.4, 1.6, 0, 0.9, 12, [0.4, 0.3, 0.55], { x, z, m: M.GLOSS });
        { const t = new MB(); lathe(t, [[0.0, 0], [0.4, 0.05], [0.12, 0.3], [0.12, 0.7], [0.7, 1.2], [0.75, 1.9], [0.0, 1.9]], 14, [1, 0.82, 0.25], { m: M.GOLD }); for (const sd of [-1, 1]) { const tt = new MB(); tor(tt, 0.32, 0.06, 12, 5, [1, 0.82, 0.25], { m: M.GOLD }); t.add(tt, model(m4(), [sd * 0.75, 1.45, 0], [0, 0, 1], UP, 1)); } anim.props.push({ mesh: upload(t.build()), p: [x, 0.9, z], h: 0, kind: 'spinY', sp: 0.6, s: 1 }); } break;
      case 'showcase': for (let i = 0; i < 20; i++) { const st = RC.showcaseStand(i); cyl(P0, 0.9, 1.0, 0, 0.7, 12, [0.95, 0.9, 0.82], { x: st.x, z: st.z, m: M.GLOSS }); cyl(P0, 0.92, 0.92, 0.7, 0.78, 12, [1, 0.82, 0.3], { x: st.x, z: st.z, m: M.GOLD }); } break;
      case 'index': ob(0, 0.7, 0, 0.5, 0.7, 0.4, [0.5, 0.32, 0.2], { m: M.WOOD }); { const t = new MB(); box(t, -1.0, -0.06, -0.7, 0, 0.06, 0.7, [1, 0.97, 0.9], {}); box(t, 0, -0.06, -0.7, 1.0, 0.06, 0.7, [1, 0.97, 0.9], {}); box(t, -1.05, -0.12, -0.75, 1.05, -0.06, 0.75, [0.75, 0.2, 0.2], {}); P0.add(t, model(m4(), loc(0, 1.55, 0.1), norm(add(f, [0, 0.8, 0])), norm(add(UP, mul(f, -0.6))), 1)); } break;
      case 'leaderboard': for (const sd of [-1, 1]) cyl(P0, 0.18, 0.18, 0, 5.6, 8, [0.3, 0.25, 0.4], { x: loc(sd * 3.1, 0, 0)[0], z: loc(sd * 3.1, 0, 0)[2], m: M.METAL }); ob(0, 3.4, 0, 3.0, 2.2, 0.12, [0.17, 0.11, 0.23], {}); anim.boards.push({ c: loc(0, 3.4, 0.14), r: mul(r, -1), hw: 2.85, hh: 2.05, uv: [0, 0, 0.5, 1], f }); break;
      case 'events': ob(0, 2.3, 0, 2.4, 1.6, 0.1, [0.55, 0.36, 0.22], { m: M.WOOD }); for (const sd of [-1, 1]) cyl(P0, 0.14, 0.14, 0, 4.2, 6, [0.55, 0.36, 0.22], { x: loc(sd * 2.3, 0, 0)[0], z: loc(sd * 2.3, 0, 0)[2], m: M.WOOD }); anim.boards.push({ c: loc(0, 2.3, 0.12), r: mul(r, -1), hw: 2.25, hh: 1.45, uv: [0.5, 0, 1, 1], f }); break;
      case 'computer': ob(0, 0.85, 0, 1.5, 0.08, 0.7, [0.85, 0.85, 0.9], { m: M.METAL }); for (const a of [-1.3, 1.3]) for (const c of [-0.5, 0.5]) ob(a, 0.4, c, 0.06, 0.42, 0.06, [0.4, 0.4, 0.45], { m: M.METAL }); ob(0, 1.9, -0.2, 1.2, 0.8, 0.08, [0.15, 0.15, 0.2], { m: M.GLOSS }); ob(0, 1.9, -0.13, 1.1, 0.7, 0.02, [0.3, 0.85, 1], { e: 1.0 }); ob(0, 0.97, 0.25, 0.7, 0.03, 0.25, [0.25, 0.25, 0.3], {}); anim.lights.push({ p: loc(0, 1.9, 0.6), c: [0.3, 0.85, 1], r: 6, k: 0.6 }); break;
      case 'storage': ob(0, 1.5, 0, 1.8, 1.5, 1.2, [0.55, 0.36, 0.2], { m: M.WOOD }); ob(0, 1.5, 1.21, 0.9, 1.2, 0.04, [0.45, 0.28, 0.15], { m: M.WOOD }); cyl(P0, 0.45, 0.45, 0, 0.1, 16, [0.85, 0.85, 0.9], { x: loc(0, 0, 1.3)[0], z: loc(0, 0, 1.3)[2], m: M.METAL }); for (const b of [0.4, 2.6]) ob(0, b, 0, 1.85, 0.08, 1.25, [0.4, 0.4, 0.45], { m: M.METAL }); break;
      case 'trading': cyl(P0, 3.0, 3.2, 0, 0.35, 24, [0.3, 0.6, 1], { x, z, m: M.GLOSS }); for (const sd of [-1, 1]) { const p = loc(sd * 1.6, 0, 0); cyl(P0, 0.6, 0.7, 0.35, 1.1, 12, [0.95, 0.95, 1], { x: p[0], z: p[2], m: M.GLOSS }); } break;
      case 'rebirth': { cyl(P0, 2.4, 2.8, 0, 0.6, 18, [0.85, 0.75, 0.95], { x, z, m: M.GLOSS }); const t = new MB(); cyl(t, 0.7, 0, 0, 2.2, 6, [1, 0.5, 0.95], { m: M.CRYSTAL, e: 0.7 }); cyl(t, 0, 0.7, -1.4, 0, 6, [0.8, 0.4, 1], { m: M.CRYSTAL, e: 0.7 }); anim.props.push({ mesh: upload(t.build()), p: [x, 2.6, z], h: 0, kind: 'float', sp: 0.8, ph: 0, s: 1 }); anim.lights.push({ p: [x, 2.8, z], c: [1, 0.5, 0.95], r: 9, k: 0.9 });
        for (const sd of [-1, 1]) { const p = loc(sd * 4.2, 0, 5.2); cyl(P0, 0.4, 0.45, 0, 4.4, 8, [0.85, 0.75, 0.95], { x: p[0], z: p[2], m: M.GLOSS }); } break; }
    }
    signBoard(P0, x + f[0] * (s.id === 'showcase' ? 6 : 1.3), signY, z + f[2] * (s.id === 'showcase' ? 6 : 1.3), h, s.id === 'showcase' ? 5 : 3.6, 'st_' + s.id);
  }
  // ---------- environment ----------
  function getArea(aid, level, reb) {
    if (aid === 'lobby') { const lvlKey = PORTALS.filter(p => RC.canEnter(FI[p.f], level || 1, reb || 0)).map(p => p.f).join(); if (AREAS.lobby && AREAS.lobby.lk === lvlKey) return AREAS.lobby; if (AREAS.lobby) freeArea(AREAS.lobby); const A = buildLobby(level, reb); A.lk = lvlKey; return (AREAS.lobby = A); }
    if (AREAS[aid]) return AREAS[aid];
    // keep at most two fields built besides the lobby
    const built = Object.keys(AREAS).filter(k => k !== 'lobby'); if (built.length >= 2) { freeArea(AREAS[built[0]]); delete AREAS[built[0]]; }
    return (AREAS[aid] = buildField(aid));
  }
  function freeArea(A) { if (A.boardMesh) A.boardMesh.forEach(freeMesh); for (const c of A.chunks) freeMesh(c); for (const c of A.pchunks || []) freeMesh(c); if (A.hm) { try { gl.deleteTexture(A.hm.tex); } catch (e) {} A.hm = null; } freeMesh(A.trans); for (const m of A.far) freeMesh(m); for (const p of A.anim.props) if (p.mesh && p.kind !== 'egg') freeMesh(p.mesh); }


  // ===================== audio (all synthesized) =====================
  const AU = { c: null, eng: [], other: null };
  let soundOn = opts.muted ? false : true;
  const baseVol = clamp(opts.volume == null ? 0.7 : opts.volume, 0, 1);
  function ainit() {
    if (AU.c) { if (AU.c.state === 'suspended') AU.c.resume().catch(() => {}); return; }
    const AC = win.AudioContext || win.webkitAudioContext; if (!AC) return;
    try {
      const c = new AC(); AU.c = c;
      AU.m = c.createGain(); AU.m.gain.value = soundOn ? baseVol : 0;
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; AU.m.connect(comp); comp.connect(c.destination);
      AU.fx = c.createGain(); AU.fx.gain.value = store.vol; AU.fx.connect(AU.m);
      AU.mu = c.createGain(); AU.mu.gain.value = store.music * 0.55; AU.mu.connect(AU.m);
      AU.en = c.createGain(); AU.en.gain.value = store.vol; AU.en.connect(AU.m);
      AU.dl = c.createDelay(1); AU.dl.delayTime.value = 0.27; const fb = c.createGain(); fb.gain.value = 0.3; const lp = c.createBiquadFilter(); lp.frequency.value = 2600;
      AU.dl.connect(lp); lp.connect(fb); fb.connect(AU.dl); lp.connect(AU.m); AU.send = c.createGain(); AU.send.gain.value = 0.35; AU.send.connect(AU.dl);
      const nb = c.createBuffer(1, c.sampleRate, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; AU.nb = nb;
      MUS.next = c.currentTime + 0.1;
    } catch (e) { AU.c = null; }
  }
  function setVolumes() { if (!AU.c) return; const t = AU.c.currentTime; AU.fx.gain.setTargetAtTime(store.vol, t, 0.05); AU.en.gain.setTargetAtTime(store.vol, t, 0.05); AU.mu.gain.setTargetAtTime(store.music * 0.55, t, 0.05); }
  function setSound(on) { soundOn = on; if (AU.m) AU.m.gain.setTargetAtTime(on ? baseVol : 0, AU.c.currentTime, 0.05); }
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  function tone(f, dur, o) {
    if (!AU.c || !soundOn) return; o = o || NOO; const c = AU.c, t = c.currentTime + (o.delay || 0), os = c.createOscillator(), g = c.createGain();
    os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t); if (o.slide) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t + dur);
    const v = o.v == null ? 0.2 : o.v; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.att || 0.006)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    os.connect(g); g.connect(o.to || AU.fx); if (o.send) { const s = c.createGain(); s.gain.value = o.send; g.connect(s); s.connect(AU.send); }
    os.start(t); os.stop(t + dur + 0.05);
  }
  function noise(dur, o) {
    if (!AU.c || !soundOn) return; o = o || NOO; const c = AU.c, t = c.currentTime + (o.delay || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = AU.nb; s.loop = true; f.type = o.type || 'lowpass'; f.Q.value = o.q || 1; f.frequency.setValueAtTime(o.f0 || 1200, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, o.f1 || 200), t + dur);
    const v = o.v == null ? 0.25 : o.v; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.att || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(o.to || AU.fx); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  const SFX = {
    click() { tone(midi(84), 0.05, { type: 'triangle', v: 0.06 }); },
    open() { tone(midi(76), 0.08, { type: 'triangle', v: 0.07 }); tone(midi(83), 0.12, { type: 'triangle', v: 0.06, delay: 0.05 }); },
    close() { tone(midi(79), 0.07, { type: 'triangle', v: 0.05 }); tone(midi(72), 0.1, { type: 'triangle', v: 0.05, delay: 0.04 }); },
    err() { tone(220, 0.12, { type: 'square', v: 0.05 }); tone(180, 0.16, { type: 'square', v: 0.05, delay: 0.09 }); },
    step(k) { noise(0.06, { type: 'bandpass', f0: k ? 900 : 600, f1: 300, v: 0.025, q: 2 }); },
    jump() { tone(300, 0.16, { type: 'triangle', slide: 560, v: 0.06 }); },
    land() { noise(0.09, { f0: 500, f1: 120, v: 0.06 }); },
    cast() { noise(0.35, { type: 'bandpass', f0: 3000, f1: 700, v: 0.1, q: 3 }); tone(900, 0.25, { type: 'sine', slide: 400, v: 0.03 }); },
    hook() { tone(midi(79), 0.07, { type: 'square', v: 0.05 }); noise(0.12, { type: 'highpass', f0: 2000, f1: 4000, v: 0.06 }); },
    reel() { tone(midi(88 + (Math.random() * 5 | 0)), 0.035, { type: 'square', v: 0.015 }); },
    squeak() { tone(1800 + Math.random() * 600, 0.08, { type: 'sine', slide: 2600, v: 0.035 }); },
    caught(ri) { const top = ri >= 4; const notes = top ? [72, 76, 79, 84, 88, 91, 96] : [72, 76, 79, 84]; notes.forEach((n, i) => tone(midi(n), 0.2, { type: 'triangle', v: 0.07, delay: i * 0.06, send: 0.4 })); noise(0.3, { type: 'highpass', f0: 3000, f1: 8000, v: 0.05 }); if (ri >= 7) { tone(midi(60), 1.2, { type: 'sawtooth', v: 0.05, slide: midi(72) }); [96, 100, 103, 108].forEach((n, i) => tone(midi(n), 0.4, { type: 'sine', v: 0.05, delay: 0.5 + i * 0.08, send: 0.6 })); } },
    miss() { tone(midi(67), 0.15, { type: 'triangle', v: 0.06 }); tone(midi(60), 0.3, { type: 'triangle', v: 0.06, delay: 0.12 }); noise(0.2, { type: 'highpass', f0: 1500, f1: 400, v: 0.06 }); },
    snap() { noise(0.12, { type: 'highpass', f0: 5000, f1: 2000, v: 0.12 }); },
    coin() { tone(midi(88), 0.06, { type: 'square', v: 0.035 }); tone(midi(95), 0.16, { type: 'square', v: 0.035, delay: 0.06 }); },
    cash() { [84, 88, 91, 96].forEach((n, i) => tone(midi(n), 0.12, { type: 'square', v: 0.03, delay: i * 0.05 })); noise(0.25, { type: 'highpass', f0: 6000, f1: 9000, v: 0.04 }); },
    buy() { tone(midi(79), 0.08, { type: 'triangle', v: 0.06 }); tone(midi(86), 0.18, { type: 'triangle', v: 0.06, delay: 0.07, send: 0.3 }); },
    drink() { for (let i = 0; i < 5; i++) tone(300 + i * 90, 0.07, { type: 'sine', v: 0.05, delay: i * 0.07, slide: 500 + i * 90 }); },
    level() { [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => tone(midi(n), 0.18, { type: 'square', v: 0.04, delay: i * 0.08, send: 0.4 })); },
    ach() { [76, 81, 85, 88].forEach((n, i) => tone(midi(n), 0.3, { type: 'triangle', v: 0.06, delay: i * 0.09, send: 0.5 })); },
    toast() { tone(midi(86), 0.08, { type: 'sine', v: 0.05 }); },
    eggShake() { noise(0.12, { type: 'bandpass', f0: 800, f1: 400, v: 0.08, q: 3 }); },
    eggCrack() { noise(0.25, { type: 'highpass', f0: 2500, f1: 900, v: 0.14 }); tone(1400, 0.08, { type: 'square', v: 0.03 }); },
    reveal(ri) { const base = 60 + Math.min(ri, 9) * 2; [0, 4, 7, 12, 16, 19, 24].forEach((n, i) => tone(midi(base + n), 0.35, { type: ri >= 7 ? 'sawtooth' : 'triangle', v: 0.05, delay: i * 0.07, send: 0.6 })); },
    evolve() { tone(200, 1.4, { type: 'sawtooth', slide: 1600, v: 0.05 }); [84, 88, 91, 96, 100].forEach((n, i) => tone(midi(n), 0.4, { type: 'triangle', v: 0.05, delay: 1.2 + i * 0.07, send: 0.6 })); },
    chest() { tone(midi(67), 0.1, { type: 'square', v: 0.04 }); [79, 83, 86, 91].forEach((n, i) => tone(midi(n), 0.2, { type: 'triangle', v: 0.06, delay: 0.12 + i * 0.07, send: 0.4 })); },
    trade() { [76, 79, 83, 88].forEach((n, i) => tone(midi(n), 0.2, { type: 'triangle', v: 0.06, delay: i * 0.06, send: 0.4 })); },
    tick() { tone(1200, 0.05, { type: 'square', v: 0.035 }); },
    portal() { tone(200, 0.9, { type: 'sine', slide: 900, v: 0.08 }); noise(0.9, { type: 'bandpass', f0: 400, f1: 3000, v: 0.06, q: 2 }); },
    ann(kind) { if (kind === 'siren') { for (let i = 0; i < 3; i++) { tone(600, 0.35, { type: 'square', slide: 900, v: 0.04, delay: i * 0.7 }); tone(900, 0.35, { type: 'square', slide: 600, v: 0.04, delay: i * 0.7 + 0.35 }); } return; }
      if (kind === 'alarm') { for (let i = 0; i < 4; i++) tone(880, 0.15, { type: 'square', v: 0.04, delay: i * 0.3 }); return; }
      if (kind === 'fanfare') { [72, 76, 79, 84, 79, 84, 88, 91].forEach((n, i) => tone(midi(n), 0.22, { type: 'square', v: 0.035, delay: i * 0.1, send: 0.4 })); return; }
      if (kind === 'chime' || !kind) { [84, 88, 91].forEach((n, i) => tone(midi(n), 0.3, { type: 'sine', v: 0.05, delay: i * 0.1, send: 0.5 })); return; }
      if (kind === 'rare') { [79, 86, 91, 98].forEach((n, i) => tone(midi(n), 0.4, { type: 'triangle', v: 0.05, delay: i * 0.08, send: 0.6 })); return; }
      if (kind === 'gift') { [76, 80, 83, 88, 92].forEach((n, i) => tone(midi(n), 0.2, { type: 'sine', v: 0.05, delay: i * 0.07, send: 0.5 })); } },
    thunder() { noise(2.2, { f0: 900, f1: 40, v: 0.35, att: 0.02 }); tone(50, 1.6, { slide: 30, v: 0.2 }); }
  };

  // ---------- music: a song for the lobby, each field and special moments ----------
  const SONGS = {
    lobby: { bpm: 108, key: 60, prog: [[0, 'M'], [5, 'M'], [9, 'm'], [7, 'M']], bass: [0, 6, 8, 14], lead: [0, -1, 1, 2, -1, 1, 0, -1, 2, -1, 3, -1, 2, 1, -1, -1], leadT: 'triangle', pad: 0.028, drum: 'soft', swing: 0.1 },
    meadow: { bpm: 116, key: 62, prog: [[0, 'M'], [7, 'M'], [5, 'M'], [7, 'S']], bass: [0, 4, 8, 12], lead: [2, -1, 1, -1, 0, -1, 1, 2, 3, -1, 2, -1, 1, -1, -1, -1], leadT: 'triangle', pad: 0.025, drum: 'soft', bells: true, swing: 0.12 },
    clover: { bpm: 124, key: 65, prog: [[0, 'M'], [-5, 'M'], [-3, 'm'], [-7, 'M']], bass: [0, 3, 8, 11], lead: [0, 1, 2, -1, 2, 1, 0, -1, 3, -1, 2, 1, 2, -1, -1, -1], leadT: 'square', pad: 0.02, drum: 'toms', swing: 0.14 },
    mushroom: { bpm: 96, key: 57, prog: [[0, 'm7'], [-4, 'M7'], [-2, 'S'], [-5, 'm7']], bass: [0, 7, 10], lead: [3, -1, -1, 2, -1, -1, 1, -1, 0, -1, -1, -1, 2, -1, 1, -1], leadT: 'sine', pad: 0.035, drum: 'soft', bells: true, swing: 0.05 },
    crystal: { bpm: 100, key: 61, prog: [[0, 'M7'], [-3, 'm7'], [-5, 'M7'], [2, 'S']], bass: [0, 8], lead: [0, 2, 1, 3, 2, 4, 3, 1, 0, 2, 1, 3, 2, 4, 3, 2], leadT: 'sine', pad: 0.03, drum: 'soft', bells: true, arp: true, swing: 0 },
    frozen: { bpm: 92, key: 64, prog: [[0, 'M7'], [-3, 'm7'], [5, 'M7'], [7, 'S']], bass: [0, 8], lead: [3, -1, 2, -1, 1, -1, 2, -1, 0, -1, -1, -1, 1, -1, 2, -1], leadT: 'sine', pad: 0.032, drum: 'soft', bells: true, swing: 0 },
    lava: { bpm: 132, key: 52, prog: [[0, 'm'], [1, 'M'], [-2, 'M'], [0, 'm']], bass: [0, 2, 3, 6, 8, 10, 11, 14], lead: [0, -1, 1, -1, 3, -1, 2, 1, 0, -1, 4, -1, 3, -1, 2, -1], leadT: 'sawtooth', pad: 0.018, drum: 'rock', swing: 0 },
    heaven: { bpm: 84, key: 67, prog: [[0, 'M7'], [5, 'M7'], [-3, 'm7'], [7, 'S']], bass: [0, 8], lead: [2, -1, -1, 3, -1, -1, 4, -1, 3, -1, 2, -1, -1, -1, -1, -1], leadT: 'sine', pad: 0.04, drum: 'soft', bells: true, swing: 0 },
    omega: { bpm: 128, key: 50, prog: [[0, 'm'], [-4, 'M'], [3, 'M'], [-2, 'M']], bass: [0, 2, 4, 6, 8, 10, 12, 14], lead: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3], leadT: 'sawtooth', pad: 0.026, drum: 'synth', arp: true, swing: 0 },
    secret: { bpm: 104, key: 55, prog: [[0, 'm7'], [3, 'M7'], [-2, 'M7'], [5, 'S']], bass: [0, 6, 10], lead: [4, -1, 3, -1, 2, -1, 3, 4, -1, -1, 2, -1, 1, -1, 0, -1], leadT: 'triangle', pad: 0.034, drum: 'toms', bells: true, swing: 0.06 },
    reborn: { bpm: 98, key: 63, prog: [[0, 'M7'], [5, 'M7'], [-4, 'M7'], [-2, 'S']], bass: [0, 7, 10], lead: [4, -1, 2, 3, -1, 2, 1, -1, 2, -1, 4, -1, 3, -1, -1, -1], leadT: 'triangle', pad: 0.032, drum: 'soft', bells: true, swing: 0.08 },
    invasion: { bpm: 150, key: 53, prog: [[0, 'm'], [0, 'm'], [1, 'M'], [-1, 'M']], bass: [0, 2, 4, 6, 8, 10, 12, 14], lead: [0, -1, 0, -1, 3, -1, 2, -1, 0, -1, 0, -1, 4, -1, 3, -1], leadT: 'square', pad: 0.02, drum: 'rock', swing: 0 },
    dj: { bpm: 124, key: 58, prog: [[0, 'm7'], [5, 'M7'], [3, 'M7'], [-2, 'S']], bass: [0, 3, 6, 8, 11, 14], lead: [0, -1, 2, -1, 1, -1, 3, -1, 2, -1, 4, -1, 3, -1, 1, -1], leadT: 'square', pad: 0.024, drum: 'synth', arp: true, swing: 0 }
  };
  const QUAL = { M: [0, 4, 7, 12, 16], m: [0, 3, 7, 12, 15], M7: [0, 4, 7, 11, 14], m7: [0, 3, 7, 10, 14], S: [0, 5, 7, 12, 14] };
  const MUS = { next: 0, step: 0, song: null, speed: 1 };
  function playSong(id) { if (MUS.song === id) return; MUS.song = id; MUS.step = 0; MUS.speed = 1; if (AU.c) MUS.next = AU.c.currentTime + 0.15; }
  function music() {
    if (!AU.c || !MUS.song || !soundOn || store.music <= 0) return;
    const c = AU.c, S = SONGS[MUS.song]; if (!S) return;
    const sd = 60 / (S.bpm * MUS.speed) / 4;
    if (MUS.next < c.currentTime - 0.5) MUS.next = c.currentTime + 0.05;
    while (MUS.next < c.currentTime + 0.25) {
      const st = MUS.step, bar = Math.floor(st / 16) % S.prog.length, b16 = st % 16, ch = S.prog[bar], q = QUAL[ch[1]], root = S.key + ch[0];
      const t = MUS.next + (b16 % 2 ? S.swing * sd : 0), phrase = Math.floor(st / 64) % 4;
      const N = (n, dur, type, v, o) => { const os = c.createOscillator(), g = c.createGain(); os.type = type; os.frequency.value = midi(n); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o && o.att || 0.008)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); os.connect(g); g.connect(AU.mu); if (o && o.send) { const s = c.createGain(); s.gain.value = o.send; g.connect(s); s.connect(AU.send); } os.start(t); os.stop(t + dur + 0.05); };
      if (b16 === 0 && S.pad) for (let i = 1; i < 4; i++) { const os = c.createOscillator(), os2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); os.type = os2.type = 'sawtooth'; os.frequency.value = midi(root + q[i] - 12); os2.frequency.value = midi(root + q[i] - 12) * 1.007; f.frequency.value = 900; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(S.pad, t + 0.3); g.gain.setValueAtTime(S.pad, t + sd * 14); g.gain.exponentialRampToValueAtTime(0.0001, t + sd * 16 + 0.2); os.connect(f); os2.connect(f); f.connect(g); g.connect(AU.mu); os.start(t); os2.start(t); os.stop(t + sd * 16 + 0.3); os2.stop(t + sd * 16 + 0.3); }
      if (S.bass.includes(b16)) N(root - 24 + (b16 === 6 || b16 === 14 ? 7 : b16 === 8 && S.drum === 'rock' ? 12 : 0), sd * 1.8, S.drum === 'synth' ? 'sawtooth' : 'triangle', S.drum === 'synth' ? 0.07 : 0.11);
      const li = S.lead[(b16 + (phrase === 3 ? 8 : 0)) % 16];
      if (phrase > 0 && li >= 0) { const n = root + q[(li + (phrase === 2 ? 1 : 0)) % q.length] + 12; N(n, sd * (S.leadT === 'sine' ? 3 : 1.6), S.leadT, S.leadT === 'square' ? 0.03 : S.leadT === 'sawtooth' ? 0.026 : 0.05, { send: 0.3 }); if (S.bells) N(n + 12, sd * 4, 'sine', 0.018, { send: 0.5 }); }
      if (S.arp) N(root + q[st % 4] + 12, sd * 0.9, 'square', 0.014);
      const kick = () => { const os = c.createOscillator(), g = c.createGain(); os.frequency.setValueAtTime(140, t); os.frequency.exponentialRampToValueAtTime(45, t + 0.12); g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); os.connect(g); g.connect(AU.mu); os.start(t); os.stop(t + 0.22); };
      const hat = (v, len) => { const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.nb; f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len); s.connect(f); f.connect(g); g.connect(AU.mu); s.start(t, Math.random() * 0.5); s.stop(t + len + 0.02); };
      const snare = v => { const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.nb; f.type = 'bandpass'; f.frequency.value = 1800; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); s.connect(f); f.connect(g); g.connect(AU.mu); s.start(t, Math.random() * 0.5); s.stop(t + 0.18); N(55, 0.08, 'triangle', v * 0.4); };
      const dr = S.drum;
      if (dr === 'rock' || dr === 'synth') { if (b16 % 4 === 0) kick(); if (b16 === 4 || b16 === 12) snare(0.14); if (b16 % 2 === 0) hat(0.03, 0.04); if (dr === 'synth' && b16 % 2 === 1) hat(0.015, 0.03); }
      else if (dr === 'toms') { if (b16 === 0 || b16 === 6 || b16 === 10) kick(); if (b16 === 4 || b16 === 12) snare(0.1); if (b16 % 4 === 2) N(root - 12, 0.15, 'triangle', 0.05); if (b16 % 2 === 0) hat(0.02, 0.05); }
      else { if (b16 === 0 || b16 === 10) kick(); if (b16 === 8) snare(0.06); if (b16 % 4 === 2) hat(0.018, 0.05); }
      MUS.next += sd; MUS.step++;
    }
  }
  function audioTick() { music(); }


  // ===================== input: keyboard, mouse and gamepad =====================
  // Mouse look uses pointer lock. Where a page can't lock the pointer (some embedded frames), dragging looks around instead and a short click casts.
  const IN = { down: {}, press: {}, mdx: 0, mdy: 0, mbtn: 0, mclick: 0, rclick: 0, wheel: 0, locked: false, noLock: !!opts.noLock, drag: null, last: 'kb', pad: { lx: 0, ly: 0, rx: 0, ry: 0, prev: {} } };
  const GAMEKEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyE', 'KeyI', 'KeyQ', 'KeyB', 'KeyX', 'KeyL', 'KeyO', 'KeyH', 'KeyM', 'KeyT', 'KeyV', 'Enter', 'Slash', 'Tab', 'Escape']);
  const typing = e => { const t = e.target; return !!(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)); };
  const wrapActive = () => doc.activeElement === wrap || wrap.contains(doc.activeElement) || IN.locked || opts.captureKeys;
  const LST = [];
  const on = (t, ev, f, o) => { t.addEventListener(ev, f, o); LST.push([t, ev, f, o]); };
  function kd(e) {
    if (!alive) return;
    if (typing(e)) { if (e.code === 'Escape') { e.target.blur(); e.preventDefault(); } return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!wrapActive()) return;
    if (CHAT.open && CHAT.inp) { if (e.code === 'Escape') { chatClose(); e.preventDefault(); return; } CHAT.inp.focus(); return; } // typing goes to the chat box
    const c = e.code || e.key; if (!IN.down[c]) IN.press[c] = true; IN.down[c] = true; IN.last = 'kb';
    if (GAMEKEYS.has(c)) { e.preventDefault(); e.stopPropagation(); }
    ainit();
  }
  on(win, 'keydown', kd, true);
  on(win, 'keyup', e => { const c = e.code || e.key; IN.down[c] = false; }, true);
  on(win, 'blur', () => { IN.down = {}; IN.mbtn = 0; IN.drag = null; });
  on(cv, 'mousedown', e => {
    if (CHAT.open) chatClose();
    ainit(); wrap.focus({ preventScroll: true });
    if (e.button === 0) {
      if (IN.locked) { IN.mclick = 1; IN.mbtn |= 1; return; }
      if (!IN.noLock && canLock()) { requestLock(); return; }
      IN.drag = { moved: 0 }; IN.mbtn |= 1;
    }
    if (e.button === 2) { IN.rclick = 1; IN.mbtn |= 2; }
  });
  on(win, 'mouseup', e => { if (e.button === 0) { IN.mbtn &= ~1; if (IN.drag && IN.drag.moved < 7 && S.ready && !uiOpen()) IN.mclick = 1; IN.drag = null; } if (e.button === 2) IN.mbtn &= ~2; });
  on(cv, 'contextmenu', e => e.preventDefault());
  on(win, 'mousemove', e => {
    if (IN.locked) { IN.mdx += e.movementX || 0; IN.mdy += e.movementY || 0; return; }
    if (IN.drag) { const dx = e.movementX || 0, dy = e.movementY || 0; IN.drag.moved += Math.abs(dx) + Math.abs(dy); IN.mdx += dx; IN.mdy += dy; }
  });
  on(cv, 'wheel', e => { IN.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
  function canLock() { return S.ready && !uiOpen(); }
  function requestLock() { try { const p = cv.requestPointerLock && cv.requestPointerLock(); if (p && p.catch) p.catch(lockFailed); } catch (e) { lockFailed(); } }
  function lockFailed() { if (IN.noLock) return; IN.noLock = true; toast({ kind: 'info', text: 'Drag with the mouse to look around.', sub: 'A short click casts at the rat in your sights.' }); }
  function releaseLock() { IN.drag = null; try { if (doc.pointerLockElement === cv) doc.exitPointerLock(); } catch (e) {} }
  on(doc, 'pointerlockchange', () => { IN.locked = doc.pointerLockElement === cv; if (!IN.locked) { IN.down = {}; IN.mbtn = 0; } hintsRefresh(); });
  on(doc, 'pointerlockerror', lockFailed);
  // gamepad: left stick walks, right stick looks, RT casts, X uses, A jumps
  function readPads() {
    const pads = (win.navigator.getGamepads && win.navigator.getGamepads()) || []; let p = null; for (const g of pads) if (g && g.connected) { p = g; break; }
    const P = IN.pad; if (!p) { P.lx = P.ly = P.rx = P.ry = 0; return; }
    const dz = v => Math.abs(v) < 0.18 ? 0 : (v - Math.sign(v) * 0.18) / 0.82;
    P.lx = dz(p.axes[0] || 0); P.ly = dz(p.axes[1] || 0); P.rx = dz(p.axes[2] || 0); P.ry = dz(p.axes[3] || 0);
    const b = i => !!(p.buttons[i] && p.buttons[i].pressed), was = P.prev;
    const map = { 0: 'Space', 2: 'KeyE', 7: 'MouseL', 6: 'MouseR', 9: 'Escape', 3: 'KeyI', 10: 'ShiftLeft' };
    for (const k in map) { const isOn = b(+k), name = map[k];
      if (isOn && !was[k]) { if (name === 'MouseL') IN.mclick = 1; else IN.press[name] = true; IN.last = 'pad'; }
      if (name === 'MouseL') { if (isOn) IN.mbtn |= 1; else if (was[k]) IN.mbtn &= ~1; } else if (name === 'MouseR') { if (isOn) IN.mbtn |= 2; else if (was[k]) IN.mbtn &= ~2; } else IN.down[name] = isOn || (IN.last === 'kb' && IN.down[name]);
      was[k] = isOn; }
    if (P.lx || P.ly || P.rx || P.ry) IN.last = 'pad';
  }
  // ---------- touch: left thumb walks, right thumb looks, buttons cast, use and jump ----------
  IN.tx = 0; IN.ty = 0;
  IN.touch = ('ontouchstart' in win) || !!(win.matchMedia && win.matchMedia('(pointer: coarse)').matches);
  const TL = IN.touch ? doc.createElement('div') : null;
  if (TL) {
    IN.noLock = true; TL.className = 'rc-touch'; wrap.insertBefore(TL, ui);
    TL.innerHTML = '<div class="rc-stick" hidden><i></i></div><div class="rc-tbs"><button class="rc-tb use" data-tb="use" hidden>✋<small>Use</small></button><button class="rc-tb jump" data-tb="jump">⤒<small>Jump</small></button><button class="rc-tb cast" data-tb="cast" hidden>🎣<small>Cast</small></button></div>';
    const stickEl = TL.querySelector('.rc-stick'), knob = stickEl.firstChild, P = {};
    on(TL, 'touchstart', e => e.preventDefault(), { passive: false });
    on(TL, 'pointerdown', e => {
      ainit(); const b = e.target.closest('[data-tb]');
      if (b) { const k = b.dataset.tb; if (k === 'cast') IN.mclick = 1; else if (k === 'use') IN.press.KeyE = true; else if (k === 'jump') IN.press.Space = true; b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 150); return; }
      const r = TL.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < r.width * 0.42 && !P.stick) { P.stick = { id: e.pointerId, x, y }; stickEl.hidden = false; stickEl.style.left = x + 'px'; stickEl.style.top = y + 'px'; knob.style.transform = ''; }
      else if (!P.look) P.look = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, t: Date.now() };
      try { TL.setPointerCapture(e.pointerId); } catch (er) {}
    });
    on(TL, 'pointermove', e => {
      if (P.stick && e.pointerId === P.stick.id) { const r = TL.getBoundingClientRect(); let dx = e.clientX - r.left - P.stick.x, dy = e.clientY - r.top - P.stick.y; const d = Math.hypot(dx, dy), m = 55; if (d > m) { dx *= m / d; dy *= m / d; } IN.tx = dx / m; IN.ty = dy / m; knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; }
      else if (P.look && e.pointerId === P.look.id) { const dx = e.clientX - P.look.x, dy = e.clientY - P.look.y; P.look.x = e.clientX; P.look.y = e.clientY; P.look.moved += Math.abs(dx) + Math.abs(dy); IN.mdx += dx * 1.5; IN.mdy += dy * 1.5; }
    });
    const up = e => {
      if (P.stick && e.pointerId === P.stick.id) { P.stick = null; IN.tx = IN.ty = 0; stickEl.hidden = true; }
      if (P.look && e.pointerId === P.look.id) { if (P.look.moved < 12 && Date.now() - P.look.t < 300 && S.ready) IN.mclick = 1; P.look = null; }
    };
    on(TL, 'pointerup', up); on(TL, 'pointercancel', up);
  }
  function touchFrame() {
    if (!TL) return; const f = S.ready && S.aid && S.aid !== 'lobby';
    TL.querySelector('.cast').hidden = !f; TL.querySelector('.cast').classList.toggle('ready', !!S.aimed && !S.catching);
    TL.querySelector('.use').hidden = !(S.near && !uiOpen());
  }
  function endInput() { IN.press = {}; IN.mdx = IN.mdy = 0; IN.mclick = IN.rclick = 0; IN.wheel = 0; }
  function inputOff() { for (const l of LST) l[0].removeEventListener(l[1], l[2], l[3]); LST.length = 0; releaseLock(); }


  // ===================== network =====================
  const NET = { ws: null, url: '', state: 'idle', tries: 0, off: 0, rtt: 0, pingT: 0, retry: 0, kicked: false, log: [] };
  const srvNow = () => Date.now() + NET.off;
  function wsUrl(s) {
    s = String(s || '').trim(); if (!s) return ''; if (s === 'local' || s === 'local:') return 'local:';
    if (/^wss?:\/\//i.test(s)) return s.replace(/\/+$/, '') + (/\/ws$/.test(s) ? '' : '/ws');
    if (/^https?:\/\//i.test(s)) { const u = new URL(s); return (u.protocol === 'https:' ? 'wss://' : 'ws://') + u.host + '/ws'; }
    const secure = win.location && win.location.protocol === 'https:';
    return (secure ? 'wss://' : 'ws://') + s.replace(/\/+$/, '') + '/ws';
  }
  function defaultServer() {
    if (opts.server) return opts.server;
    if (win.RC_SERVER) return win.RC_SERVER;
    return store.server || 'local'; // no server set: play right here
  }
  function connect(url) {
    if (!alive) return;
    NET.url = url; NET.state = 'connecting'; NET.kicked = false;
    let ws; try { ws = url === 'local:' ? win.RC_LOCAL.connect() : /^peer:/.test(url) ? win.RC_PEER.connect(url.slice(5)) : new WebSocket(url); } catch (e) { NET.state = 'error'; onNetDown('That server address doesn’t work here.' + (/^ws:/.test(url) && win.location.protocol === 'https:' ? ' This page is secure (https), so it can only reach secure servers (wss:// or https://).' : '')); return; }
    NET.ws = ws;
    ws.onopen = () => { NET.state = 'open'; NET.tries = 0; const tok = store.tokens[url], dh = url === HOST.url ? NET.devHello : null; nsend(Object.assign({ t: 'hello', v: 1, token: dh ? undefined : tok || undefined, room: (isPeer() ? NET.peerRoom : store.room) || undefined }, dh || {})); nsend({ t: 'ping', c: Date.now() }); };
    ws.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (er) { return; } if (opts.test && /^(castOk|castNo|got|miss|err|bought|drank|toast)$/.test(m.t)) NET.log.push([Date.now() % 100000, 'in', m.t, m.why || m.text || '', m.r || '']); try { onMsg(m); } catch (er) { if (win.console) console.error('RAT CATCHERS message', m && m.t, er); } };
    ws.onclose = () => { if (NET.ws !== ws) return; NET.ws = null; const was = NET.state; NET.state = 'closed'; if (!alive) return; onNetDown(was === 'connecting' ? null : 'Connection lost.'); };
    ws.onerror = () => {};
  }
  const isLocal = () => NET.url === 'local:';
  const isPeer = () => /^peer:/.test(NET.url);

  // ---------- the online server: its address is built in, so players never set anything up ----------
  // It runs on a free host that sleeps when nobody plays and forgets everything when it restarts, so each
  // player's save stays on their device: it goes along when they connect and comes back every few seconds.
  // While the server is asleep or unreachable the game plays on its own (and with friends, without a server).
  const HOSTED_URL = 'wss://rat-catchers-server.onrender.com/ws';
  const HOST = { url: opts.hosted !== undefined ? (opts.hosted ? wsUrl(opts.hosted) : '') : win.RC_HOSTED ? wsUrl(win.RC_HOSTED) : HOSTED_URL, next: 0, probe: null, fails: 0, ready: 0 };
  const isHosted = () => !!HOST.url && NET.url === HOST.url;
  function hostedTick() {
    if (!HOST.url || store.offline || PEERS.busy || !S.ready || opts.server || win.RC_SERVER || !(isLocal() || isPeer())) return;
    const now = Date.now();
    if (HOST.ready && now - HOST.ready < 90000) { // the server answered: move over at a calm moment
      const calm = S.aid === 'lobby' && !WIN && !S.catching && !S.trade && !CHAT.open && !(isLocal() && peerInfo() && peerInfo().guests.length);
      if (calm) goHosted(); return;
    }
    if (HOST.probe || now < HOST.next) return;
    HOST.next = now + Math.min(120000, 20000 * (1 + HOST.fails));
    let ws; try { ws = new WebSocket(HOST.url); } catch (e) { HOST.fails++; return; } // knocking also wakes a sleeping server
    HOST.probe = ws; const t = setTimeout(() => { try { ws.close(); } catch (e) {} }, 75000);
    ws.onopen = () => { clearTimeout(t); HOST.probe = null; HOST.fails = 0; HOST.ready = Date.now(); try { ws.close(); } catch (e) {} };
    ws.onclose = ws.onerror = () => { clearTimeout(t); if (HOST.probe === ws) { HOST.probe = null; HOST.fails++; } };
  }
  function goHosted() {
    HOST.ready = 0; if (PEERS.busy) return; PEERS.busy = true;
    if (!store.pcode) { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 6; i++) c += A[Math.floor(Math.random() * A.length)]; store.pcode = c; persist(); }
    const was = NET.url, old = NET.ws; NET.ws = null; S.ready = false; S.catching = null; releaseLock(); closeWin(true);
    showConn('Joining the online server…', 'Your save comes with you and stays on this device.');
    try { old && old.close(); } catch (e) {}
    (/^peer:/.test(was) && win.RC_PEER ? win.RC_PEER.leave() : Promise.resolve()).then(() => {
      if (win.RC_PEER && win.RC_PEER.info()) win.RC_PEER.publish(false);
      const d = win.RC_LOCAL && win.RC_LOCAL.devBlob(store.tokens['local:']); PEERS.busy = false;
      if (!d) { HOST.next = Date.now() + 600000; connect('local:'); return; }
      NET.devHello = { dev: store.pcode, blob: d.blob, sync: d.sync };
      connect(HOST.url); toast({ kind: 'room', text: 'You’re on the online server!', sub: 'Public rooms, trading, chat and events with everyone. Your save stays on this device.' });
    });
  }
  const noServer = () => isLocal() || isPeer();

  // ---------- rooms without a server: friends' games connect to each other directly ----------
  const BROKER = 'wss://0.peerjs.com:443/peerjs?key=peerjs';
  const PEERS = { known: '', busy: false };
  const peerOk = () => !!(win.RC_PEER && opts.peer !== false);
  const peerInfo = () => peerOk() ? win.RC_PEER.info() : null;
  const showPeer = c => c ? c.slice(0, 3) + '-' + c.slice(3) : '';
  function peerUp() {
    if (!peerOk() || !noServer()) return null;
    const i = win.RC_PEER.start({ code: store.pcode, broker: opts.broker === undefined ? BROKER : opts.broker, name: S.me ? S.me.name : localName(), onChange: peerChanged });
    if (!store.pcode && i && i.code) { store.pcode = i.code; persist(); }
    return i;
  }
  function peerChanged() {
    const i = peerInfo(); if (!i) return;
    const now = i.guests.map(g => g.code + '|' + g.name).join(','), was = PEERS.known; PEERS.known = now;
    if (was !== now && !isPeer()) {
      const before = new Set(was ? was.split(',') : []), after = new Set(now ? now.split(',') : []);
      for (const g of after) if (!before.has(g)) { toast({ kind: 'room', text: g.split('|')[1] + ' joined your room!' }); SFX.ann && SFX.ann('chime'); }
      for (const g of before) if (!after.has(g)) toast({ kind: 'room', text: g.split('|')[1] + ' left your room.' });
    }
    uiRefresh('peer'); hudRefresh();
  }
  const PEER_WHY = { code: 'That room code doesn’t look right. Codes look like K7M-2QX.', self: 'That’s your own room code. Send it to a friend so they can join you.',
    noanswer: 'No answer from that room. Check the code, and that your friend has RAT CATCHERS open and is online.', away: 'Your friend is visiting someone else’s room right now.',
    notplaying: 'Your friend’s game can’t host right now. Ask them to finish loading into the lobby (hosting only works when they play without a server).', full: 'That room is full (20 players).',
    version: 'You and your friend have different versions of RAT CATCHERS. Both of you reload the game to update.', bad: 'Your friend’s game couldn’t read your save.',
    nosave: 'Your save on this device couldn’t be loaded.', off: 'Rooms aren’t available on this device.', cancel: '' };
  // visit a friend's room: your save goes with you, and comes back as you play
  function visitRoom(code, pub) {
    const c = win.RC_PEER && win.RC_PEER.norm(code);
    if (!c) { toast({ kind: 'err', text: PEER_WHY.code }); return; }
    if (NET.url === 'peer:' + c) { toast({ kind: 'room', text: 'You are already in that room.' }); return; }
    if (PEERS.busy) return; PEERS.busy = true;
    const old = NET.ws; NET.ws = null; S.ready = false; S.catching = null; releaseLock(); closeWin(true);
    showConn('Joining room ' + showPeer(c) + '…', 'Connecting to your friend’s game. This can take a few seconds.');
    try { old && old.close(); } catch (e) {}
    win.RC_PEER.join(c, store.tokens['local:']).then(r => {
      PEERS.busy = false; delete store.tokens['peer:' + c]; store.tokens['peer:' + c] = r.tok; NET.peerRoom = r.room; NET.peerHost = r.host; persist();
      connect('peer:' + c); toast({ kind: 'room', text: 'You joined ' + r.host + '’s ' + (pub ? 'lobby' : 'room') + '!', sub: 'Your progress is still saved on this device. Press Enter to chat.' });
    }).catch(why => {
      PEERS.busy = false; why = String(why || ''); if (PEER_WHY[why] !== '') toast({ kind: 'err', text: PEER_WHY[why] || 'Couldn’t join that room.' });
      connect('local:'); MATCH.t = 20;
    });
  }
  // look for a lobby now (and join it, or open this room to everyone)
  function findLobby() {
    if (!peerOk() || !noServer()) return;
    const go = () => win.RC_PEER.find().then(list => { const me = peerInfo(), here = isPeer() ? NET.url.slice(5) : me.code; const pick = list.filter(r => r.code !== here && r.code !== me.code && r.n < 20).sort((a, b) => b.n - a.n)[0];
      if (pick) visitRoom(pick.code, true); else { toast({ kind: 'room', text: 'No open lobbies right now.', sub: store.auto ? 'Your room is open, so players looking for a lobby will join you.' : 'Tick “Open to everyone” so players looking for a lobby can join you.' }); if (store.auto && isLocal()) win.RC_PEER.publish(true); } });
    toast({ kind: 'room', text: 'Looking for lobbies…' }); go();
  }
  function goHome(text) {
    if (PEERS.busy) return; PEERS.busy = true;
    const old = NET.ws, was = NET.url; NET.ws = null; S.ready = false; S.catching = null; releaseLock(); closeWin(true);
    showConn('Going back to your own game…', 'Saving your progress on this device.');
    try { old && old.close(); } catch (e) {}
    (win.RC_PEER ? win.RC_PEER.leave() : Promise.resolve()).then(() => { PEERS.busy = false; delete store.tokens[was]; persist(); connect('local:'); MATCH.t = 4; if (text) toast({ kind: 'room', text }); });
  }
  const END_WHY = { hostleft: 'Your friend closed their room. You’re back in your own game.', timeout: 'Lost the connection to your friend’s room. You’re back in your own game.', lost: 'Lost the connection to your friend’s room. You’re back in your own game.',
    kicked: 'The host removed you from their room.', replaced: 'You joined that room from somewhere else.', gone: 'That room was closed. You’re back in your own game.', closed: 'You left your friend’s room.' };
  function nsend(m) { const ws = NET.ws; if (opts.test && m.t !== 'mv' && m.t !== 'ping') NET.log.push([Date.now() % 100000, 'out', m.t, m.r || m.kind || '', m.id || '']); if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); }
  function reconnectSoon(text) {
    if (!alive || NET.kicked) return;
    NET.tries++; const wait = Math.min(15, Math.pow(2, Math.min(4, NET.tries - 1)));
    clearTimeout(NET.retry); NET.retry = setTimeout(() => connect(NET.url), wait * 1000);
    showConn(text || 'Reconnecting…', 'Trying again in ' + wait + ' s.');
  }
  function netTick() {
    if (NET.state === 'open' && Date.now() - NET.pingT > 5000) { NET.pingT = Date.now(); nsend({ t: 'ping', c: Date.now() }); }
  }
  function onPong(m) { const now = Date.now(), rtt = now - m.c; NET.rtt = NET.rtt ? NET.rtt * 0.8 + rtt * 0.2 : rtt; const off = m.s - (m.c + rtt / 2); NET.off = NET.off ? NET.off * 0.8 + off * 0.2 : off; }


  // ===================== playing: you, other players, rats in the fields =====================
  const S = { ready: false, me: null, rats: new Map(), cfg: RC.DEFAULT_CONFIG, room: null, roster: [], aid: null, A: null,
    you: { p: [0, 0, 12], v: [0, 0, 0], yaw: Math.PI, pitch: -0.18, face: Math.PI, ground: true, walk: 0, anim: 0, camD: 5.4, castT: 0, reelT: 0, stepT: 0 },
    others: new Map(), frats: new Map(), chests: new Map(), catching: null, aimed: null, fly: [], events: { active: [], weather: 'clear', inv: null }, money: 0, mps: 0, moneyShown: 0,
    sendT: 0, near: null, travel: 0, trade: null, flash: 0, shake: 0, lbData: {}, showRats: new Map(), t: 0, rt: 0 };
  const G = S; // short alias used by the renderer
  const LV = () => (S.me ? S.me.level : 1);
  function luckNow() { return S.me ? S.me.luck : 1; }
  function eff(cat) { const e = S.me && S.me.d.eff[cat]; return e && e.ends > srvNow() ? e : null; }
  function rodNow() { const id = S.me ? S.me.d.rod : 'wood'; return Object.assign({}, ROD[id] || ROD.wood, (S.cfg.rods || {})[id] || {}); }

  // ---------- server messages ----------
  function onMsg(m) {
    switch (m.t) {
      case 'pong': onPong(m); break;
      case 'auth': loadEl.hidden = true; if (isHosted()) { HOST.next = Date.now() + 600000; NET.ws = null; connect('local:'); break; } if (isPeer()) { goHome('Your friend’s game didn’t recognize you. Try joining again.'); break; } if (isLocal() && !S.localTried) { S.localTried = 1; nsend({ t: 'register', name: localName() }); } else showLogin(); break;
      case 'authErr': if (LOGIN.el) loginErr(m.text); else showLogin(); break;
      case 'welcome': {
        if (m.token) { store.tokens[NET.url] = m.token; } store.server = NET.serverInput || store.server; persist();
        NET.off = m.srv - Date.now(); S.cfg = m.cfg || S.cfg; applyMe(m.you); S.rats.clear(); for (const r of m.you.rats) S.rats.set(r.id, r);
        S.money = S.moneyShown = m.you.money; S.mps = m.you.mps; S.events = m.events || S.events;
        hideLogin(); hideConn(); loadEl.hidden = true;
        for (const a of m.ann || []) showAnn(a);
        if (m.offline && m.offline.amt > 0) setTimeout(() => offlinePopup(m.offline), 900);
        hudBuild(); hudRefresh(); peerUp(); chatBuild(); chatRender(); if (VOICE.on) { for (const id of [...VOICE.links.keys()]) vClose(id); nsend({ t: 'voice', on: 1 }); } break;
      }
      case 'kicked': NET.kicked = !m.restart; toast({ kind: 'err', text: m.text }); if (m.restart) setTimeout(() => connect(NET.url), 2500); else showConn(m.text, 'Reload to play again.', true); break;
      case 'room': S.room = m.room; if (!isPeer()) { store.room = m.room.code; persist(); } hudRefresh(); break;
      case 'roster': S.roster = m.l; if (m.room) S.room = m.room; refreshShowcases(); hudRefresh(); uiRefresh('roster'); voiceSync(); break;
      case 'chat': onChat(m); break;
      case 'save': if (isHosted() && win.RC_LOCAL && win.RC_LOCAL.devAbsorb) win.RC_LOCAL.devAbsorb(store.tokens['local:'], m.blob, m.sync); break;
      case 'vsig': onVsig(m); break;
      case 'area': enterArea(m); break;
      case 'pj': addOther(m.p); break;
      case 'pl': S.others.delete(m.id); break;
      case 'pu': { const o = S.others.get(m.p.id); if (o) Object.assign(o, { n: m.p.n, ti: m.p.ti, c: m.p.c, pets: m.p.pets, rod: m.p.rod, lvl: m.p.lvl }); break; }
      case 'pm': for (const l of m.l) { const o = S.others.get(l[0]); if (!o) continue; o.buf.push({ t: S.rt, p: [l[1], l[2], l[3]], h: l[4], a: l[5] }); if (o.buf.length > 8) o.buf.shift(); } break;
      case 'pos': S.you.p = m.p.slice(); S.you.v = [0, 0, 0]; break;
      case 'rw': worldMsg(m); break;
      case 'castOk': startCatch(m); break;
      case 'castNo': if (S.catching && S.catching.r === m.r) S.catching = null; S.you.castT = 0; failCast(); toast({ kind: 'err', text: m.why }); SFX.err(); break;
      case 'got': caught(m); break;
      case 'miss': missed(m); break;
      case 'chs': S.chests.set(m.c.id, chestObj(m.c)); break;
      case 'chg': { const c = S.chests.get(m.id); if (c) { burst([c.x, c.y + 0.6, c.z], 24, 5, [1, 0.85, 0.3, 1], 0.7, 0.35, { kind: 2, up: UP }); S.chests.delete(m.id); } break; }
      case 'chestOpen': SFX.chest(); bigText('TREASURE!', m.got.join(' · '), '#ffd23a'); break;
      case 'me': applyMe(m); hudRefresh(); uiRefresh('me'); break;
      case 'rats': for (const r of m.up) S.rats.set(r.id, r); for (const id of m.del) S.rats.delete(id); uiRefresh('rats'); break;
      case 'money': S.money = m.m; S.mps = m.mps; moneyAt = Date.now(); if (S.me) S.me.money = m.m; uiRefresh('money'); break;
      case 'toast': toast(m); if (m.kind === 'ratlvl') { SFX.level(); burst([S.you.p[0], S.you.p[1] + 1.2, S.you.p[2]], 40, 5, [1, 0.85, 0.3, 1], 1, 0.3, { kind: 6, up: 1 }); } break;
      case 'err': toast({ kind: 'err', text: m.text }); SFX.err(); break;
      case 'events': { const was = (S.events.active || []).map(e => e.id).join(); S.events = m; if (was !== m.active.map(e => e.id).join() || m.inv) envChanged(); hudRefresh(); uiRefresh('events'); break; }
      case 'ann': showAnn(m); break;
      case 'cfg': S.cfg = m.cfg; uiRefresh('cfg'); break;
      case 'bought': onBought(m); break;
      case 'sold': SFX.cash(); toast({ kind: 'money', text: 'Sold ' + m.n + ' rat' + (m.n > 1 ? 's' : '') + ' for ' + fmtMoney(m.money) + '.' }); break;
      case 'drank': SFX.drink(); toast({ kind: 'potion', text: POT[m.id].n + ' is working!', sub: POT[m.id].d }); break;
      case 'dailyOk': SFX.ach(); uiRefresh('daily'); bigText('DAY ' + (m.day + 1) + '!', m.got.join(' · '), '#ffd23a'); break;
      case 'evolved': evolveFx(m); break;
      case 'reborn': SFX.level(); bigText('REBORN!', 'Rebirth ' + m.n + ' · permanent luck bonus', '#ff9af0'); closeWin(); break;
      case 'boxOpen': SFX.chest(); bigText('MYSTERY BOX!', m.got.join(' · '), '#b876ff'); break;
      case 'confirm': askConfirm(m); break;
      case 'lb': m.got = Date.now(); S.lbData[m.cat] = m; drawBoards(); uiRefresh('lb'); break;
      case 'insp': showInspect(m); break;
      case 'history': uiRefresh('history', m); break;
      case 'roomList': uiRefresh('rooms', m); break;
      case 'invited': inviteToast(m); break;
      case 'tAsk': tradeAsk(m); break;
      case 'trade': tradeView(m); break;
      case 'tradeEnd': tradeEnd(m); break;
    }
  }
  function applyMe(v) {
    const keep = S.me; S.me = Object.assign({}, keep || {}, v); delete S.me.rats; if (v.money != null) S.money = v.money; if (v.mps != null) S.mps = v.mps;
    if (keep && v.level > keep.level) { SFX.level(); bigText('LEVEL ' + v.level + '!', unlockText(keep.level, v.level), '#b876ff'); }
    if (keep && (v.level !== keep.level || v.rebirths !== keep.rebirths) && S.aid === 'lobby') S.A = getArea('lobby', v.level, v.rebirths);
  }
  function unlockText(a, b) { const f = FIELDS.find(f => !f.reb && f.lvl > a && f.lvl <= b); return f ? f.n + ' is open!' : 'Keep catching!'; }
  function localName() { const n = String(opts.name || '').replace(/[^A-Za-z0-9_ ]/g, '').trim().slice(0, 16); return n.length >= 3 ? n : 'Catcher ' + (100 + Math.floor(Math.random() * 900)); }
  const canGo = f => RC.canEnter(f, LV(), S.me ? S.me.rebirths : 0);

  // ---------- areas ----------
  function enterArea(m) {
    S.aid = m.a; S.A = getArea(m.a, LV(), S.me ? S.me.rebirths : 0); S.others.clear(); ENV.snap = true; S.frats.clear(); S.chests.clear(); S.catching = null; S.aimed = null; S.fly = []; S.castFx = null;
    for (const p of m.players) addOther(p);
    for (const r of m.rats) S.frats.set(r.id, fratObj(r));
    for (const c of m.chests) S.chests.set(c.id, chestObj(c));
    const y = S.you; y.p = [m.you[0], S.A.height(m.you[0], m.you[2]), m.you[2]]; y.v = [0, 0, 0]; y.yaw = y.face = m.a === 'lobby' ? Math.PI : 0; y.pitch = -0.15;
    camSnap = true; S.travel = 0; fadeEl.classList.remove('on'); S.ready = true;
    playSong(S.events.inv ? 'invasion' : m.a === 'lobby' ? 'lobby' : FI[m.a].song);
    envChanged(); hudRefresh(); drawBoards(); refreshShowcases();
    if (m.a !== 'lobby') bigText(FI[m.a].n.toUpperCase(), FI[m.a].d, '#ffffff', 2.4);
    if (!store.seenHelp && m.a === 'lobby') { store.seenHelp = 1; persist(); setTimeout(helpPopup, 800); }
  }
  function travel(aid) { if (S.travel) return; S.travel = srvNow(); SFX.portal(); fadeEl.classList.add('on'); setTimeout(() => nsend({ t: 'go', a: aid }), 260); setTimeout(() => { if (S.travel) { S.travel = 0; fadeEl.classList.remove('on'); } }, 4000); }
  function addOther(p) { S.others.set(p.id, { id: p.id, n: p.n, ti: p.ti, c: p.c, lvl: p.lvl, rod: p.rod, pets: p.pets || [], buf: [{ t: S.rt, p: p.p.slice(), h: p.h, a: p.a }], p: p.p.slice(), h: p.h, a: p.a, walk: 0 }); }
  function fratObj(r) { const o = Object.assign({}, r, { x: r.ax, z: r.az, y: 0, h: Math.random() * TAU, ph: Math.random() * 10, mv: 0, born: S.rt, gone: 0 }); o.y = S.A ? S.A.height(o.x, o.z) : 0; return o; }
  function chestObj(c) { return { id: c.id, x: c.x, z: c.z, k: c.k, y: S.A ? S.A.height(c.x, c.z) : 0, born: S.rt }; }
  function worldMsg(m) {
    for (const r of m.rs) if (!S.frats.has(r.id)) { const o = fratObj(r); S.frats.set(r.id, o); if (RI[SP[r.sp].r].i >= 4) burst([o.x, o.y + 0.5, o.z], 30, 4, hexc(RI[SP[r.sp].r].col).concat([1]), 0.8, 0.4, { kind: 2, up: UP }); }
    for (const p of m.rp) { const r = S.frats.get(p[0]); if (!r) continue; const was = r.st; r.ax = p[1]; r.az = p[2]; r.bx = p[3]; r.bz = p[4]; r.t0 = p[5]; r.t1 = p[6]; r.st = p[7]; r.by = p[8] || 0; if (r.st === 'h' && was !== 'h') r.hk0 = S.rt; }
    for (const g of m.rg) { const r = S.frats.get(g[0]); if (!r) continue; if (g[1] === 'caught' && g[2] !== (S.me && S.me.id)) { if (S.others.has(g[2])) { S.fly.push({ sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, from: [r.x, r.y, r.z], t: 0, h: r.h, who: g[2], line: g[2] }); S.frats.delete(g[0]); continue; } burst([r.x, r.y + 0.4, r.z], 20, 4, [1, 1, 1, 1], 0.5, 0.3, { kind: 2 }); } if (g[1] !== 'caught' || g[2] !== (S.me && S.me.id)) { r.gone = S.rt; setTimeout(() => S.frats.delete(g[0]), 400); } else S.frats.delete(g[0]); }
  }

  // ---------- moving ----------
  let camSnap = true;
  const CAM = { p: [0, 5, 10], look: [0, 1, 0], fov: 62 };
  function collide(p, R, cols) {
    for (const c of cols) { const dx = p[0] - c[0], dz = p[2] - c[1], d = Math.hypot(dx, dz), rr = c[2] + 0.45; if (d < rr && d > 1e-4) { p[0] = c[0] + dx / d * rr; p[2] = c[1] + dz / d * rr; } }
    if (S.aid === 'lobby') { const d = Math.hypot(p[0], p[2]); if (d > R) { p[0] *= R / d; p[2] *= R / d; } }
    else { p[0] = clamp(p[0], -R + 1.5, R - 1.5); p[2] = clamp(p[2], -R + 1.5, R - 1.5); }
  }
  function movePlayer(dt) {
    const y = S.you, A = S.A; if (!A) return;
    const menu = uiOpen(), sens = 0.0024 * store.sens;
    if (!menu) { y.yaw -= IN.mdx * sens; y.pitch = clamp(y.pitch - IN.mdy * sens * (store.invertY ? -1 : 1), -1.25, 0.95); }
    const P = IN.pad; if (P.rx || P.ry) { y.yaw -= P.rx * dt * 2.6; y.pitch = clamp(y.pitch - P.ry * dt * 1.8, -1.25, 0.95); }
    if (IN.wheel) y.camD = clamp(y.camD + IN.wheel * 0.6, 2.6, 11);
    let mx = 0, mz = 0;
    if (!menu && !S.travel) {
      const k = IN.down; if (k.KeyW || k.ArrowUp) mz += 1; if (k.KeyS || k.ArrowDown) mz -= 1; if (k.KeyA || k.ArrowLeft) mx += 1; if (k.KeyD || k.ArrowRight) mx -= 1;
      mx -= P.lx + IN.tx; mz -= P.ly + IN.ty;
    }
    const ml = Math.hypot(mx, mz); if (ml > 1) { mx /= ml; mz /= ml; }
    const catching = !!S.catching, sp = (IN.down.ShiftLeft || IN.down.ShiftRight || Math.hypot(IN.tx, IN.ty) > 0.92 ? 10.5 : 6.6) * (eff('speed') ? eff('speed').mult : 1) * (catching ? 0.35 : 1);
    const f = fwdOf(y.yaw), r = rightOf(y.yaw), want = [(f[0] * mz - r[0] * mx) * sp, (f[2] * mz - r[2] * mx) * sp];
    const acc = y.ground ? 14 : 4; y.v[0] = damp(y.v[0], want[0], acc, dt); y.v[2] = damp(y.v[2], want[1], acc, dt);
    if (y.ground && (IN.press.Space) && !menu) { y.v[1] = 7.2; y.ground = false; SFX.jump(); }
    y.v[1] -= 22 * dt;
    const np = [y.p[0] + y.v[0] * dt, y.p[1] + y.v[1] * dt, y.p[2] + y.v[2] * dt];
    collide(np, A.R, A.cols);
    const gy = A.height(np[0], np[2]);
    if (np[1] <= gy) { if (!y.ground && y.v[1] < -6) SFX.land(); np[1] = gy; y.v[1] = 0; y.ground = true; } else if (np[1] > gy + 0.05) y.ground = false;
    y.p = np;
    const hs = Math.hypot(y.v[0], y.v[2]);
    if (hs > 0.5 && !(S.aid !== 'lobby' && (IN.mbtn & 2 || catching))) y.face = Math.atan2(y.v[0], y.v[2]);
    if (S.aid !== 'lobby' && (catching || S.aimed)) y.face = y.yaw;
    y.walk += hs * dt; y.anim = !y.ground ? 3 : catching ? 5 : y.castT > 0 || (S.castFx && !S.castFx.ok && S.castFx.fail == null) ? 4 : hs > 7.5 ? 2 : hs > 0.6 ? 1 : 0;
    y.stepT -= dt * hs; if (y.ground && y.stepT <= 0 && hs > 0.6) { y.stepT = 1.6; SFX.step(hs > 7.5); }
    if (y.castT > 0) y.castT -= dt;
    // send our position ten times a second
    S.sendT -= dt; if (S.sendT <= 0) { S.sendT = 0.1; nsend({ t: 'mv', p: [+y.p[0].toFixed(2), +y.p[1].toFixed(2), +y.p[2].toFixed(2)], h: +y.face.toFixed(2), a: y.anim }); }
  }
  function updateCamera(dt) {
    const y = S.you, A = S.A; if (!A) return;
    const head = [y.p[0], y.p[1] + 1.55, y.p[2]], f = fwdOf(y.yaw), r = rightOf(y.yaw), cp = Math.cos(y.pitch), sp = Math.sin(y.pitch);
    const aim = S.aid !== 'lobby' && (IN.mbtn & 2) ? 0.62 : 1, d = y.camD * aim, sh = S.aid === 'lobby' ? 0.0 : 0.75;
    const dir = [f[0] * cp, sp, f[2] * cp];
    let p = [head[0] - dir[0] * d - r[0] * sh, head[1] - dir[1] * d + 0.35, head[2] - dir[2] * d - r[2] * sh];
    // indoors, keep the camera inside the hall's wall
    if (A.env.indoor) { const dx = p[0] - head[0], dz = p[2] - head[2], L2 = dx * dx + dz * dz, lim = HALL.R - 0.9; if (L2 > 1e-4 && Math.hypot(p[0], p[2]) > lim) { const b = head[0] * dx + head[2] * dz, c = head[0] * head[0] + head[2] * head[2] - lim * lim, disc = b * b - L2 * c; if (disc > 0) { const tt = (-b + Math.sqrt(disc)) / L2; if (tt > 0 && tt < 1) p = vlerp(head, p, Math.max(0.1, tt - 0.04)); } } }
    // keep the camera in front of pillars, trees and stalls that would come between it and your head
    if (A.cols) { const dx = p[0] - head[0], dz = p[2] - head[2], L2 = dx * dx + dz * dz; if (L2 > 0.01) { let tmin = 1; for (const c of A.cols) { const rr = c[2] + 0.28, fx = head[0] - c[0], fz = head[2] - c[1], cc = fx * fx + fz * fz - rr * rr; if (cc <= 0) continue; const b = fx * dx + fz * dz, disc = b * b - L2 * cc; if (disc <= 0) continue; const tt = (-b - Math.sqrt(disc)) / L2; if (tt <= 0 || tt >= tmin) continue; if (c[3] != null && head[1] + (p[1] - head[1]) * tt > c[3] + 0.3) continue; tmin = tt; } if (tmin < 1) p = vlerp(head, p, Math.max(0.1, tmin - 0.08)); } }
    const g = A.height(p[0], p[2]) + 0.4; if (p[1] < g) p[1] = g;
    const look = [p[0] + dir[0] * 10, p[1] + dir[1] * 10 - 0.1, p[2] + dir[2] * 10];
    if (camSnap) { CAM.p = p; camSnap = false; } else CAM.p = vlerp(CAM.p, p, 1 - Math.exp(-dt * 22));
    CAM.look = look; CAM.fov = S.aid !== 'lobby' && (IN.mbtn & 2) ? 50 : 62;
    if (S.shake > 0) { S.shake -= dt; const k = S.shake * 0.25; CAM.p = [CAM.p[0] + rnd(-k, k), CAM.p[1] + rnd(-k, k), CAM.p[2] + rnd(-k, k)]; }
  }
  // ---------- others and rats ----------
  function updateOthers(dt) {
    const T = S.rt - 0.12;
    for (const o of S.others.values()) {
      const b = o.buf; let a = b[0], c = b[b.length - 1];
      for (let i = 0; i < b.length - 1; i++) if (b[i].t <= T && b[i + 1].t >= T) { a = b[i]; c = b[i + 1]; break; }
      const k = c.t > a.t ? clamp((T - a.t) / (c.t - a.t), 0, 1) : 1, np = vlerp(a.p, c.p, k);
      o.walk += dist2(np, o.p); o.p = np; o.h = a.h + wrapA(c.h - a.h) * k; o.a = c.a;
      if (S.A && Math.abs(o.p[1] - S.A.height(o.p[0], o.p[2])) < 0.15) o.p[1] = S.A.height(o.p[0], o.p[2]);
    }
  }
  function ratPosAt(r, t) { if (t >= r.t1 || r.t1 <= r.t0) return [r.bx, r.bz]; const k = (t - r.t0) / (r.t1 - r.t0); return [r.ax + (r.bx - r.ax) * k, r.az + (r.bz - r.az) * k]; }
  function updateRats(dt) {
    const t = srvNow();
    for (const r of S.frats.values()) {
      const [x, z] = ratPosAt(r, t), dx = x - r.x, dz = z - r.z, d = Math.hypot(dx, dz);
      r.mv = damp(r.mv, d / Math.max(dt, 1e-3), 10, dt);
      if (d > 0.002) r.h = r.h + wrapA(Math.atan2(dx, dz) - r.h) * (1 - Math.exp(-dt * 12));
      r.x = x; r.z = z; r.y = S.A.height(x, z); r.ph += dt * (r.mv > 0.3 ? 8 + r.mv * 3 : 1.5);
      ratFx(r, dt);
    }
    for (const c of S.chests.values()) if (Math.random() < dt * 6) emit([c.x + rnd(-0.6, 0.6), c.y + 0.5, c.z + rnd(-0.4, 0.4)], [0, rnd(1, 2.5), 0], 1.2, 0.18, 0, [1, 0.85, 0.35, 1], 0.5, 0, 2);
  }
  // particles that make rare rats and mutations stand out
  function ratFx(r, dt) {
    const s = SP[r.sp], ri = RI[s.r].i, col = hexc(RI[s.r].col), sz = RI[s.r].size, p = [r.x, r.y + 0.35 * sz, r.z];
    if (ri >= 3 && Math.random() < dt * (2 + ri * 1.6)) emit(madd(p, [rnd(-0.5, 0.5), rnd(0, 0.6), rnd(-0.5, 0.5)], sz), [0, rnd(0.4, 1.4), 0], 0.9, 0.12 + ri * 0.012, 0, col.concat([1]), 0.5, 0, 2);
    if (ri === 5 && Math.random() < dt * 8) emit(madd(p, [rnd(-0.3, 0.3), 0, rnd(-0.3, 0.3)], sz), [rnd(-0.3, 0.3), rnd(1, 2), rnd(-0.3, 0.3)], 0.6, 0.2, 0.05, [1, 0.45, 0.15, 1], 1, -1, 2);
    if (ri === 7 && Math.random() < dt * 10) emit(madd(p, [rnd(-0.6, 0.6), rnd(-0.2, 0.5), rnd(-0.6, 0.6)], sz), [0, 0.3, 0], 1.0, 0.28, 0.5, [0.25, 0.05, 0.4, 0.55], 0.8, 0, 1);
    if (ri >= 8 && Math.random() < dt * 14) { const a = Math.random() * TAU; emit(madd(p, [Math.cos(a) * 0.7 * sz, rnd(0, 0.8), Math.sin(a) * 0.7 * sz], 1), [0, rnd(0.6, 1.6), 0], 1.1, 0.16, 0, ri === 9 ? hue3(Math.random()).concat([1]) : [1, 0.9, 0.45, 1], 0.4, 0, 2); }
    if (r.wx === 'rain' && Math.random() < dt * 12) emit([r.x + rnd(-0.4, 0.4), r.y + 1.3 * sz, r.z + rnd(-0.4, 0.4)], [0, -5, 0], 0.25, 0.05, 0.05, [0.5, 0.75, 1, 0.8], 0, 0, 0);
    if (r.wx === 'snow' && Math.random() < dt * 6) emit([r.x + rnd(-0.5, 0.5), r.y + 1.2 * sz, r.z + rnd(-0.5, 0.5)], [rnd(-0.2, 0.2), -0.6, rnd(-0.2, 0.2)], 1.6, 0.07, 0.07, [1, 1, 1, 1], 0, 0, 2);
    if (r.wx === 'thunder' && Math.random() < dt * 5) { const a = madd(p, [rnd(-0.4, 0.4), rnd(0.2, 0.6), rnd(-0.4, 0.4)], sz); emit(a, [rnd(-2, 2), rnd(-1, 2), rnd(-2, 2)], 0.15, 0.12, 0, [1, 0.95, 0.4, 1], 2, 0, 2); }
    if (r.mut === 'diamond' && Math.random() < dt * 4) emit(madd(p, [rnd(-0.4, 0.4), rnd(0, 0.5), rnd(-0.4, 0.4)], sz), [0, 0.2, 0], 0.5, 0.18, 0, [0.85, 0.97, 1, 1], 0, 0, 6);
    if (r.mut === 'gold' && Math.random() < dt * 3) emit(madd(p, [rnd(-0.4, 0.4), rnd(0, 0.5), rnd(-0.4, 0.4)], sz), [0, 0.5, 0], 0.7, 0.1, 0, [1, 0.85, 0.3, 1], 0, 0, 2);
    if (r.disco && Math.random() < dt * 6) { const a = Math.random() * TAU, h = hue3(Math.random()); emit([r.x + Math.cos(a) * 0.9, r.y + 0.05, r.z + Math.sin(a) * 0.9], [0, 0, 0], 0.4, 0.3, 0.3, h.concat([0.8]), 0, 0, 0); }
    const parts = s.parts || [];
    if (parts.includes('flametail') && Math.random() < dt * 12) emit(p, [rnd(-0.2, 0.2), rnd(0.6, 1.4), rnd(-0.2, 0.2)], 0.4, 0.12, 0.02, [1, 0.6, 0.15, 1], 1, -1, 2);
    if ((parts.includes('voidfx') || parts.includes('shadowfx')) && Math.random() < dt * 10) emit(madd(p, [rnd(-0.5, 0.5), rnd(-0.2, 0.4), rnd(-0.5, 0.5)], sz), [0, 0.4, 0], 1.0, 0.3, 0.55, [0.08, 0.02, 0.12, 0.6], 0.6, 0, 1);
    if (parts.includes('goldfx') && Math.random() < dt * 10) emit(madd(p, [rnd(-0.5, 0.5), rnd(0, 0.6), rnd(-0.5, 0.5)], sz), [0, 0.8, 0], 0.8, 0.12, 0, [1, 0.85, 0.3, 1], 0.4, 0, 2);
  }
  const hue3 = h => [clamp(Math.abs(h * 6 - 3) - 1, 0, 1), clamp(2 - Math.abs(h * 6 - 2), 0, 1), clamp(2 - Math.abs(h * 6 - 4), 0, 1)];

  // ---------- aiming and catching ----------
  function camRay() { return [CAM.p, norm(sub(CAM.look, CAM.p))]; }
  function findAim() {
    S.aimed = null; if (S.aid === 'lobby' || !S.A || uiOpen()) return;
    const [o, d] = camRay(), y = S.you, range = rodNow().range; let best = null, bs = 1e9;
    for (const r of S.frats.values()) {
      if (r.st === 'h' && r.by !== S.me.id || r.gone) continue;
      const sz = RI[SP[r.sp].r].size, c = [r.x, r.y + 0.35 * sz, r.z], v = sub(c, o), t = dot(v, d); if (t < 1) continue;
      const off = len(sub(v, mul(d, t))), dd = dist2(c, y.p); if (dd > range + 1) continue;
      const tol = (0.55 * sz + t * 0.045) * (IN.touch ? 1.8 : 1); if (off > tol) continue;
      const sc = off / tol + t * 0.01; if (sc < bs) { bs = sc; best = r; }
    }
    if (best) S.aimed = best.id;
  }
  function tryCast() {
    if (S.catching || S.aid === 'lobby' || !S.aimed || S.you.castT > 0) return;
    const r = S.frats.get(S.aimed); if (!r || r.st !== 'w') return;
    S.you.castT = 0.45; S.pendingCast = { r: r.id, t: S.rt }; S.castFx = { t0: S.rt, r: r.id }; SFX.cast(); nsend({ t: 'cast', r: r.id });
  }
  // reel timing uses the real clock, so a slow computer still reels in on time
  const wallNow = () => (win.performance ? win.performance.now() : Date.now()) / 1000;
  function startCatch(m) {
    S.catching = { r: m.r, dur: m.dur, p: m.p, t0: wallNow(), lost: 0, sent: false, reelT: 0 };
    const c = S.castFx; if (c && c.r === m.r && c.fail == null) { c.ok = true; if (c.landed) SFX.hook(); } else { S.castFx = { t0: S.rt - 1, r: m.r, ok: true }; SFX.hook(); } // the hook sound plays when the bobber lands
  }
  // the line goes slack and the bobber comes back to the rod
  function failCast() { const c = S.castFx; if (c && c.fail == null) { c.fail = S.rt; c.failFrom = null; } }
  function updateCatch(dt) {
    const c = S.catching; if (!c) return;
    const r = S.frats.get(c.r); if (!r) { S.catching = null; return; }
    const sz = RI[SP[r.sp].r].size, target = [r.x, r.y + 0.35 * sz, r.z], [o, d] = camRay(), v = sub(target, o), t = dot(v, d), off = t > 0 ? len(sub(v, mul(d, t))) / t : 9;
    const onAim = off < (IN.touch ? 0.32 : 0.2) && dist2(target, S.you.p) < rodNow().range + 4;
    c.lost = onAim ? 0 : c.lost + dt;
    if (c.lost > 0.9 && !c.sent) { nsend({ t: 'uncast' }); S.catching = null; failCast(); SFX.snap(); toast({ kind: 'err', text: 'You lost your aim and the line snapped! Keep the rat in your sights.' }); return; }
    c.reelT -= dt; if (c.reelT <= 0) { c.reelT = 0.11; SFX.reel(); if (Math.random() < 0.3) SFX.squeak(); }
    if (Math.random() < dt * 14) emit(madd(target, [rnd(-0.3, 0.3), rnd(0, 0.4), rnd(-0.3, 0.3)], 1), [rnd(-1.5, 1.5), rnd(1, 2.5), rnd(-1.5, 1.5)], 0.35, 0.1, 0, [1, 1, 1, 1], 1.5, 6, 2);
    if (!c.sent && wallNow() - c.t0 >= c.dur) { c.sent = true; nsend({ t: 'reel', r: c.r }); }
  }
  function caught(m) {
    const c = S.catching, r = c && S.frats.get(c.r); S.catching = null;
    S.rats.set(m.rat.id, m.rat);
    const s = SP[m.rat.sp], ri = RI[s.r].i;
    S.castFx = null; S.you.castT = 0;
    if (r) { S.fly.push({ sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, from: [r.x, r.y, r.z], t: 0, h: r.h, line: 'me' }); S.frats.delete(r.id); }
    SFX.caught(ri); if (ri >= 4) { S.flash = 0.5; S.shake = 0.4; }
    bigText('CAUGHT!', RC.ratName(m.rat) + ' · ' + RI[s.r].n, RI[s.r].col, ri >= 4 ? 3 : 1.8);
    toast({ kind: 'catch', text: 'You caught a ' + RC.ratName(m.rat) + '!', sub: RI[s.r].n + ' · ' + fmtMoney(RC.ratEarn(S.cfg, m.rat, { rebirths: S.me.rebirths }).total) + '/sec', rat: m.rat });
  }
  function missed(m) {
    S.lastMiss = m.why || 'missed'; const c = S.catching; S.catching = null; failCast(); if (c) { const r = S.frats.get(c.r); if (r) burst([r.x, r.y + 0.4, r.z], 14, 3, [0.8, 0.8, 0.8, 0.6], 0.6, 0.3, { kind: 1 }); }
    SFX.miss(); bigText(m.why && /got away|wriggled/i.test(m.why) ? 'IT GOT AWAY!' : 'MISSED!', m.why || '', '#ffffff', 1.4);
  }
  function updateFly(dt) {
    for (const f of S.fly) {
      const o = f.who && S.others.get(f.who), tp = o ? o.p : S.you.p;
      f.t += dt * 1.6; const k = Math.min(1, f.t), target = [tp[0], tp[1] + 1.2, tp[2]];
      f.p = vlerp(f.from, target, easeIn(k)); f.p[1] += Math.sin(k * Math.PI) * 2.2; f.s = 1 - k * 0.8; f.spin = k * 9;
      if (f.t >= 1 && !f.done) { f.done = true; const col = hexc(RI[SP[f.sp].r].col); burst(target, f.who ? 18 : 40, 6, col.concat([1]), 0.8, 0.35, { kind: 2 }); burst(target, f.who ? 8 : 18, 3, [1, 1, 1, 1], 0.5, 0.25, { kind: 6 }); }
    }
    S.fly = S.fly.filter(f => f.t < 1.05);
  }
  // ---------- stations, portals and chests ----------
  function updateNear() {
    S.near = null; if (!S.A || S.travel) return;
    const y = S.you, p = y.p;
    if (S.aid === 'lobby') {
      for (const pt of PORTALS) { if (dist2([pt.x, 0, pt.z], p) < 1.9) { const f = FI[pt.f]; if (canGo(f)) { travel(pt.f); return; } if (!S.lockMsgT || S.rt - S.lockMsgT > 2.5) { S.lockMsgT = S.rt; toast({ kind: 'err', text: RC.lockText(f) }); SFX.err(); } const fw = fwdOf(pt.h); y.p = [pt.x + fw[0] * 2.3, y.p[1], pt.z + fw[2] * 2.3]; } }
      let best = null, bd = 4.4;
      for (const s of STATIONS) { if (s.id === 'showcase') continue; const d = Math.hypot(p[0] - s.x, p[2] - s.z) - (s.id === 'trading' ? 1.5 : s.id === 'rebirth' ? 1 : 0); if (d < bd) { bd = d; best = { kind: 'station', s }; } }
      for (let i = 0; i < S.roster.length && i < 20; i++) { const st = RC.showcaseStand(i), d = Math.hypot(p[0] - st.x, p[2] - st.z); if (d < 2.4 && d < bd + 1) { bd = d; best = { kind: 'stand', who: S.roster[i] }; } }
      for (const o of S.others.values()) { const d = dist2(o.p, p); if (d < 2.6 && d < bd) { bd = d; best = { kind: 'player', o }; } }
      S.near = best;
    } else {
      if (dist2(S.A.portalHome, p) < 2.0) { travel('lobby'); return; }
      let best = null, bd = 3.4; for (const c of S.chests.values()) { const d = Math.hypot(p[0] - c.x, p[2] - c.z); if (d < bd) { bd = d; best = { kind: 'chest', c }; } }
      S.near = best;
    }
  }
  function interact() {
    const n = S.near; if (!n) return;
    if (n.kind === 'station') openStation(n.s.id);
    else if (n.kind === 'stand') nsend({ t: 'insp', id: n.who.id });
    else if (n.kind === 'player') playerMenu(n.o);
    else if (n.kind === 'chest') { nsend({ t: 'chest', id: n.c.id }); }
  }
  // ---------- the world around you ----------
  function envChanged() { /* weather and event looks are applied every frame from S.events */ }
  function weatherNow() { return S.events && S.events.weather || 'clear'; }
  function eventOn(id) { return (S.events.active || []).some(e => e.id === id || e.id === 'ultra'); }
  let thunderT = 3;
  function ambientFx(dt) {
    const A = S.A; if (!A) return; const y = S.you.p, w = weatherNow();
    const around = (n, h, f) => { for (let i = 0; i < n; i++) f([y[0] + rnd(-22, 22), y[1] + h + rnd(0, 6), y[2] + rnd(-22, 22)]); };
    if (!A.env.cave && !A.env.indoor) { // no rain or snow inside caves or the lobby hall
      if (w === 'rain' || w === 'storm' || w === 'ultra') around(Math.round(dt * 260), 6, p => emit(p, [rnd(-0.5, 0.5), -16, rnd(-0.5, 0.5)], 0.6, 0.05, 0.05, [0.7, 0.8, 1, 0.55], 0, 0, 0));
      if (w === 'snow') around(Math.round(dt * 90), 5, p => emit(p, [rnd(-0.6, 0.6), -1.6, rnd(-0.6, 0.6)], 4, 0.09, 0.09, [1, 1, 1, 0.95], 0, 0, 2));
      if ((w === 'storm' || w === 'ultra') && (thunderT -= dt) <= 0) { thunderT = 4 + Math.random() * 7; S.flash = 0.7; setTimeout(() => SFX.thunder(), 300 + Math.random() * 900); }
      if (eventOn('dj') && Math.random() < dt * 30) around(1, 0, p => emit([p[0], A.height(p[0], p[2]) + 0.08, p[2]], [0, 0, 0], 0.6, 1.2, 1.2, hue3(Math.random()).concat([0.5]), 0, 0, 0));
      if (eventOn('diamond') && Math.random() < dt * 30) around(1, 1, p => emit(p, [0, -0.2, 0], 1.0, 0.16, 0, [0.85, 0.97, 1, 1], 0, 0, 6));
      if (eventOn('heaven') && Math.random() < dt * 20) around(1, 3, p => emit(p, [0, -0.4, 0], 2.2, 0.12, 0.05, [1, 0.95, 0.7, 1], 0, 0, 2));
      if (eventOn('goldmoon') && Math.random() < dt * 14) around(1, 2, p => emit(p, [0, 0.3, 0], 1.8, 0.1, 0, [1, 0.85, 0.3, 1], 0, 0, 2));
      if (S.events.inv && Math.random() < dt * 10) around(1, 2, p => emit(p, [0, 0.4, 0], 1.5, 0.2, 0.05, [1, 0.25, 0.35, 0.9], 0, 0, 2));
    }
    // the field's own life
    const fid = S.aid;
    if (fid === 'meadow' && Math.random() < dt * 6) around(1, 0.5, p => emit(p, [rnd(-1, 1), rnd(-0.2, 0.4), rnd(-1, 1)], 3, 0.16, 0.16, hue3(Math.random()).concat([1]), 0, 0, 0));
    if (fid === 'clover' && Math.random() < dt * 8) around(1, 1, p => emit(p, [1.2, rnd(-0.1, 0.3), 0.4], 4, 0.07, 0.07, [1, 1, 1, 0.9], 0, 0, 2));
    if (fid === 'mushroom' && Math.random() < dt * 14) around(1, 0.5, p => emit(p, [rnd(-0.4, 0.4), rnd(-0.2, 0.3), rnd(-0.4, 0.4)], 3, 0.12, 0.12, [0.6, 1, 0.5, 1], 0, 0, 2));
    if (fid === 'crystal' && Math.random() < dt * 10) around(1, 1, p => emit(p, [0, 0.2, 0], 1.6, 0.1, 0, [0.7, 0.6, 1, 1], 0, 0, 6));
    if (fid === 'frozen' && w !== 'snow' && Math.random() < dt * 25) around(1, 4, p => emit(p, [rnd(-0.4, 0.4), -1.2, rnd(-0.4, 0.4)], 4, 0.07, 0.07, [1, 1, 1, 0.9], 0, 0, 2));
    if (fid === 'lava' && Math.random() < dt * 25) around(1, -1, p => emit([p[0], A.height(p[0], p[2]) + 0.2, p[2]], [rnd(-0.3, 0.3), rnd(1.5, 3.5), rnd(-0.3, 0.3)], 1.6, 0.1, 0.02, [1, 0.5, 0.15, 1], 0.2, -0.3, 2));
    if (fid === 'heaven' && Math.random() < dt * 8) around(1, 2, p => emit(p, [rnd(-0.3, 0.3), -0.4, rnd(-0.3, 0.3)], 3, 0.1, 0.1, [1, 1, 0.9, 1], 0, 0, 2));
    if (fid === 'omega' && Math.random() < dt * 14) around(1, 1, p => emit(p, [0, 0.6, 0], 1.6, 0.18, 0.02, Math.random() < 0.5 ? [0.3, 1, 0.9, 1] : [0.9, 0.3, 1, 1], 0, 0, 2));
    if (fid === 'reborn' && Math.random() < dt * 12) around(1, 3, p => emit(p, [rnd(0.2, 0.8), rnd(-0.6, -0.2), rnd(-0.3, 0.3)], 4, 0.1, 0.1, [1, 0.6 + Math.random() * 0.3, 0.85, 1], 0, 0, 2));
    if (fid === 'secret' && Math.random() < dt * 14) around(1, 1, p => emit(p, [0, 0.4, 0], 2, 0.12, 0, hue3(Math.random()).concat([1]), 0, 0, 2));
    for (const fx of A.anim.fx) {
      if (fx.kind === 'fountain' && Math.random() < dt * 40) emit(fx.p, [rnd(-1.5, 1.5), rnd(4, 6), rnd(-1.5, 1.5)], 1.0, 0.15, 0.08, [0.75, 0.9, 1, 0.8], 0, 9, 0);
      if (fx.kind === 'vent' && dist2(fx.p, y) < 50 && Math.random() < dt * 22) emit(fx.p, [rnd(-0.5, 0.5), rnd(3, 6), rnd(-0.5, 0.5)], 0.9, 0.5, 0.1, [1, 0.5, 0.12, 1], 1, -1, 2);
      if (fx.kind === 'smoke' && dist2(fx.p, y) < 40 && Math.random() < dt * 1.5) emit(fx.p, [rnd(-0.2, 0.2), rnd(0.6, 1.2), rnd(-0.2, 0.2)], 3, 0.4, 1.6, [0.2, 0.18, 0.18, 0.4], 0.3, 0, 1);
      if (fx.kind === 'volcano' && Math.random() < dt * 6) emit(fx.p, [rnd(-2, 2), rnd(6, 12), rnd(-2, 2)], 4, 4, 10, [0.25, 0.2, 0.2, 0.35], 0.2, 0, 1);
    }
  }


  // ===================== text chat and voice chat =====================
  // Text chat goes to everyone in the room through the room's game (a friend's page or a server), which filters it.
  // Voice chat is opt-in: players who turned it on connect to each other directly (WebRTC), with the game passing
  // the handshake along. Voices get quieter with distance and are silent from other areas. Push-to-talk by default.
  const CHAT = { el: null, log: null, inp: null, msgs: [], bub: new Map(), open: false };
  const VOICE = { on: false, mic: null, links: new Map(), lvl: new Map(), ctx: null, myLvl: 0, myAn: null, talk: false, err: '', t: 0 };
  const V_ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }, { urls: 'stun:stun.cloudflare.com:3478' }];
  if (!store.muted || typeof store.muted !== 'object') store.muted = {};
  if (store.vmode !== 'open') store.vmode = 'ptt';
  if (store.vvol == null) store.vvol = 1;
  if (store.chat == null) store.chat = true;
  const isMuted = n => !!store.muted[String(n || '').toLowerCase()];
  function muteToggle(n) { const k = String(n || '').toLowerCase(); if (!k) return; if (store.muted[k]) delete store.muted[k]; else store.muted[k] = 1; persist(); voiceSync(); chatRender(); toast({ kind: 'info', text: store.muted[k] ? n + ' is muted: you won’t see their chat or hear their voice.' : n + ' is unmuted.' }); uiRefresh('roster'); }

  function chatBuild() {
    if (CHAT.el) return;
    const c = CHAT.el = el('div', 'rc-chat', ui);
    c.innerHTML = '<div class="rc-chatlog" data-c="log"></div><form class="rc-chatin" data-c="form" hidden><input maxlength="120" placeholder="Say something nice…" autocomplete="off" enterkeyhint="send"><button class="rc-b xs g" type="submit">Send</button></form>' +
      '<div class="rc-chatbar"><button class="rc-cb" data-c="chat" title="Chat (Enter)">💬<small>Chat · Enter</small></button><button class="rc-cb" data-c="voice" title="Voice chat">🎤<small data-c="vtxt">Voice off</small></button></div>';
    CHAT.log = c.querySelector('[data-c="log"]'); CHAT.form = c.querySelector('[data-c="form"]'); CHAT.inp = CHAT.form.querySelector('input'); CHAT.vb = c.querySelector('[data-c="voice"]'); CHAT.vtxt = c.querySelector('[data-c="vtxt"]');
    c.querySelector('[data-c="chat"]').addEventListener('click', () => { SFX.click(); chatOpen(); });
    CHAT.vb.addEventListener('pointerdown', e => { if (VOICE.on && store.vmode === 'ptt' && IN.touch) { e.preventDefault(); VOICE.held = true; } });
    const up = () => { VOICE.held = false; }; CHAT.vb.addEventListener('pointerup', up); CHAT.vb.addEventListener('pointerleave', up); CHAT.vb.addEventListener('pointercancel', up);
    CHAT.vb.addEventListener('click', () => { if (VOICE.on && store.vmode === 'ptt' && IN.touch) return; SFX.click(); voiceToggle(); });
    CHAT.vb.addEventListener('contextmenu', e => e.preventDefault());
    CHAT.form.addEventListener('submit', e => { e.preventDefault(); const x = CHAT.inp.value.trim(); if (x) nsend({ t: 'chat', x }); CHAT.inp.value = ''; chatClose(); });
    CHAT.inp.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); chatClose(); } });
    chatRender(); voiceHud();
  }
  function chatOpen() { if (!S.ready || !store.chat) { if (!store.chat) toast({ kind: 'info', text: 'Chat is turned off in Settings › Chat & voice.' }); return; } chatBuild(); releaseLock(); CHAT.open = true; CHAT.form.hidden = false; CHAT.el.classList.add('open'); IN.down = {}; setTimeout(() => CHAT.inp.focus(), 0); chatRender(); }
  function chatClose() { if (!CHAT.el) return; CHAT.open = false; CHAT.form.hidden = true; CHAT.el.classList.remove('open'); try { CHAT.inp.blur(); } catch (e) {} refocus(); chatRender(); }
  function onChat(m) {
    if (isMuted(m.n) && m.id !== (S.me && S.me.id)) return;
    CHAT.msgs.push({ id: m.id, n: String(m.n || ''), c: m.c || '#ff9f1a', x: String(m.x || ''), t: Date.now(), sys: m.sys });
    if (CHAT.msgs.length > 60) CHAT.msgs.shift();
    if (m.id != null && !m.sys) CHAT.bub.set(m.id, { x: String(m.x || ''), t: Date.now() });
    if (store.chat) { chatBuild(); chatRender(); if (m.id !== (S.me && S.me.id) && !m.sys) SFX.click(); }
  }
  function chatSys(x) { onChat({ sys: 1, n: '', x }); }
  function chatRender() {
    if (!CHAT.el) return;
    CHAT.el.hidden = !store.chat || !S.ready;
    const t = Date.now(), show = CHAT.open ? CHAT.msgs.slice(-14) : CHAT.msgs.filter(m => t - m.t < 14000).slice(-6);
    CHAT.log.innerHTML = show.map(m => m.sys ? '<p class="sys">' + esc(m.x) + '</p>' : '<p><b style="color:' + esc(m.c) + '">' + esc(m.n) + '</b> ' + esc(m.x) + '</p>').join('');
    CHAT.log.scrollTop = 1e6; CHAT.shown = show.length + (CHAT.open ? 'o' : '');
  }
  function chatTick() { // fade old lines
    if (!CHAT.el || CHAT.open) return; const t = Date.now(), n = CHAT.msgs.filter(m => t - m.t < 14000).slice(-6).length + '';
    if (n !== CHAT.shown) chatRender();
  }

  // ---------- voice ----------
  function voiceHud() {
    if (!CHAT.vtxt) return;
    const txt = !VOICE.on ? 'Voice off' : store.vmode === 'open' ? 'Mic on' : IN.touch ? 'Hold to talk' : 'Hold V to talk';
    CHAT.vtxt.textContent = txt; CHAT.vb.classList.toggle('on', VOICE.on); CHAT.vb.classList.toggle('talk', VOICE.on && VOICE.talk);
  }
  function voiceToggle(force) {
    const want = force == null ? !VOICE.on : !!force;
    if (!want) { voiceOff(); toast({ kind: 'info', text: 'Voice chat off.' }); return; }
    if (VOICE.on || VOICE.asking) return;
    const md = win.navigator && win.navigator.mediaDevices;
    if (!md || !md.getUserMedia || typeof win.RTCPeerConnection !== 'function') { toast({ kind: 'err', text: 'Voice chat doesn’t work in this browser or page.' }); return; }
    VOICE.asking = true;
    md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(st => {
      VOICE.asking = false; if (!alive) { st.getTracks().forEach(t => t.stop()); return; }
      VOICE.mic = st; VOICE.on = true; VOICE.err = '';
      try { const ctx = voiceCtx(); if (ctx) { const an = ctx.createAnalyser(); an.fftSize = 256; ctx.createMediaStreamSource(st).connect(an); VOICE.myAn = an; } } catch (e) {}
      micGate(); nsend({ t: 'voice', on: 1 }); voiceHud(); voiceSync();
      toast({ kind: 'ok', text: 'Voice chat on!', sub: store.vmode === 'open' ? 'Your mic is open. Players near you can hear you.' : (IN.touch ? 'Hold the 🎤 button to talk.' : 'Hold V to talk.') + ' You hear other players who turned voice on, louder when they are close.' });
    }).catch(err => {
      VOICE.asking = false; VOICE.err = String(err && err.name || err);
      toast({ kind: 'err', text: /NotAllowed|Security/.test(VOICE.err) ? 'The microphone is blocked.' : 'No microphone found.', sub: /NotAllowed|Security/.test(VOICE.err) ? 'Allow the microphone for this page in your browser (the icon in the address bar), then try again. Some pages that show the game inside another site don’t allow it.' : 'Plug in a microphone or headset and try again.' });
    });
  }
  function voiceCtx() { if (VOICE.ctx) return VOICE.ctx; const AC = win.AudioContext || win.webkitAudioContext; if (!AC) return null; try { VOICE.ctx = new AC(); } catch (e) { return null; } return VOICE.ctx; }
  function voiceOff() {
    if (VOICE.mic) VOICE.mic.getTracks().forEach(t => t.stop());
    VOICE.mic = null; VOICE.myAn = null; const was = VOICE.on; VOICE.on = false; VOICE.talk = false;
    for (const id of [...VOICE.links.keys()]) vClose(id);
    if (was) nsend({ t: 'voice', on: 0 }); voiceHud();
  }
  function micGate() { const on = VOICE.on && (store.vmode === 'open' || VOICE.held || !!IN.down.KeyV); if (VOICE.mic) for (const t of VOICE.mic.getAudioTracks()) t.enabled = on; if (on !== VOICE.talk) { VOICE.talk = on; voiceHud(); } }
  // who to connect to: players in this room with voice on, not muted, the 10 closest
  function voiceSync() {
    if (!VOICE.on || !S.me) { for (const id of [...VOICE.links.keys()]) vClose(id); return; }
    const me = S.me.id, want = S.roster.filter(p => p.vc && p.id !== me && !isMuted(p.n)).map(p => { const o = S.others.get(p.id); return { id: p.id, d: o ? dist(o.p, S.you.p) : 999 }; }).sort((a, b) => a.d - b.d).slice(0, 10).map(x => x.id);
    for (const id of [...VOICE.links.keys()]) if (!want.includes(id)) vClose(id);
    for (const id of want) if (!VOICE.links.has(id) && me < id) vOpen(id, true);
  }
  function vMake(id) {
    const L = { id, pc: null, au: null, an: null, cands: [] }; VOICE.links.set(id, L);
    const pc = L.pc = new win.RTCPeerConnection({ iceServers: V_ICE });
    if (VOICE.mic) for (const t of VOICE.mic.getAudioTracks()) pc.addTrack(t, VOICE.mic);
    pc.onicecandidate = e => { if (e.candidate) nsend({ t: 'vsig', to: id, d: { ice: { candidate: e.candidate.candidate, sdpMid: e.candidate.sdpMid, sdpMLineIndex: e.candidate.sdpMLineIndex } } }); };
    pc.ontrack = e => {
      const st = e.streams && e.streams[0] ? e.streams[0] : new win.MediaStream([e.track]);
      if (!L.au) { L.au = doc.createElement('audio'); L.au.autoplay = true; L.au.playsInline = true; L.au.style.display = 'none'; wrap.appendChild(L.au); }
      L.au.srcObject = st; L.au.volume = 0; const pr = L.au.play(); if (pr && pr.catch) pr.catch(() => {});
      try { const ctx = voiceCtx(); if (ctx) { const an = ctx.createAnalyser(); an.fftSize = 256; ctx.createMediaStreamSource(st).connect(an); L.an = an; } } catch (er) {}
    };
    pc.onconnectionstatechange = () => { if (pc.connectionState === 'failed') { vClose(id); } };
    return L;
  }
  function vOpen(id) { const L = vMake(id); L.pc.createOffer().then(o => L.pc.setLocalDescription(o)).then(() => nsend({ t: 'vsig', to: id, d: { sdp: { type: 'offer', sdp: L.pc.localDescription.sdp } } })).catch(() => vClose(id)); }
  function vClose(id) { const L = VOICE.links.get(id); if (!L) return; VOICE.links.delete(id); VOICE.lvl.delete(id); try { L.pc.close(); } catch (e) {} if (L.au) { try { L.au.srcObject = null; } catch (e) {} L.au.remove(); } }
  function onVsig(m) {
    if (!VOICE.on || !m.d) return; const id = m.from | 0, p = S.roster.find(x => x.id === id); if (!p || isMuted(p.n)) return;
    const d = m.d;
    if (d.sdp && d.sdp.type === 'offer') {
      vClose(id); const L = vMake(id);
      L.pc.setRemoteDescription(d.sdp).then(() => { for (const c of L.cands) L.pc.addIceCandidate(c).catch(() => {}); L.cands = []; return L.pc.createAnswer(); }).then(a => L.pc.setLocalDescription(a))
        .then(() => nsend({ t: 'vsig', to: id, d: { sdp: { type: 'answer', sdp: L.pc.localDescription.sdp } } })).catch(() => vClose(id));
    } else if (d.sdp && d.sdp.type === 'answer') { const L = VOICE.links.get(id); if (L) L.pc.setRemoteDescription(d.sdp).then(() => { for (const c of L.cands) L.pc.addIceCandidate(c).catch(() => {}); L.cands = []; }).catch(() => {}); }
    else if (d.ice) { const L = VOICE.links.get(id); if (!L) return; if (L.pc.remoteDescription) L.pc.addIceCandidate(d.ice).catch(() => {}); else L.cands.push(d.ice); }
  }
  const lvlOf = an => { if (!an) return 0; const a = VOICE.buf || (VOICE.buf = new Uint8Array(256)); an.getByteTimeDomainData(a); let m = 0; for (let i = 0; i < an.fftSize; i++) m = Math.max(m, Math.abs(a[i] - 128)); return m / 128; };
  function voiceFrame(dt) {
    chatTick();
    if (!VOICE.on) return;
    micGate();
    VOICE.myLvl = VOICE.talk ? lvlOf(VOICE.myAn) : 0;
    for (const L of VOICE.links.values()) {
      const o = S.others.get(L.id); // only players in the same area are in S.others
      const v = o ? clamp(1.2 - dist(o.p, S.you.p) / 32, 0, 1) * clamp(+store.vvol, 0, 1) : 0;
      if (L.au) L.au.volume = v; L.v = v;
    }
    VOICE.st = (VOICE.st || 0) + dt; const now = Date.now();
    if (now - (VOICE.stT || 0) > 350) { VOICE.stT = now; // who is talking: the connection's own measure of the incoming sound
      for (const L of VOICE.links.values()) L.pc.getStats().then(st => { let lv = 0; st.forEach(r => { if (r.type === 'inbound-rtp' && r.kind === 'audio' && r.audioLevel != null) lv = r.audioLevel; }); VOICE.lvl.set(L.id, L.v > 0.02 ? lv : 0); }).catch(() => {});
    }
    VOICE.t += dt; if (VOICE.t > 2) { VOICE.t = 0; voiceSync(); if (VOICE.ctx && VOICE.ctx.state === 'suspended') VOICE.ctx.resume().catch(() => {}); }
  }
  // the bubble and speaker icon over a player's head (drawn by the name tags)
  function socialTag(o, x, y, a) {
    let top = y;
    const sp = VOICE.lvl.get(o.id) || 0, rp = S.roster.find(p => p.id === o.id);
    x2.font = '700 14px "Fredoka","Arial Rounded MT Bold",sans-serif'; const tw = x2.measureText(o.n + '  ·  Lv ' + (o.lvl || 1)).width;
    if (rp && rp.vc) pill(x + tw / 2 + 30, y, sp > 0.06 ? '🔊' : '🎤', { fs: 12, a: sp > 0.06 ? 1 : a * 0.6, bg: sp > 0.06 ? '#5fdc6a' : 'rgba(255,255,255,0.85)' });
    const b = CHAT.bub.get(o.id);
    if (b && store.chat && !isMuted(o.n)) { const age = (Date.now() - b.t) / 1000; if (age < 7) { const t = b.x.length > 46 ? b.x.slice(0, 44) + '…' : b.x; top -= (o.ti ? 46 : 26); pill(x, top, t, { fs: 13, w: 600, a: a * clamp((7 - age) / 1.2, 0, 1), bg: '#fff' }); } else CHAT.bub.delete(o.id); }
  }

  // ---------- public lobbies: with no server, fill rooms with other players automatically ----------
  const MATCH = { busy: false, t: 0, last: 0 };
  if (store.auto == null) store.auto = true;
  function matchPublic(quiet) {
    if (!peerOk() || !isLocal() || !store.auto || MATCH.busy || PEERS.busy || !S.ready) return false;
    const i = peerInfo(); if (!i || i.status !== 'online') { MATCH.t = 6; return false; }
    MATCH.busy = true; if (!quiet) toast({ kind: 'room', text: 'Looking for a lobby with other players…' });
    win.RC_PEER.find().then(list => {
      MATCH.busy = false; if (!isLocal() || !store.auto) return;
      const me = peerInfo(), mine = me.guests.length;
      const pick = list.filter(r => r.code !== me.code && r.n < 20).sort((a, b) => b.n - a.n || (a.code < b.code ? -1 : 1))[0];
      // join a room that has more players than ours (or the same, to merge two small rooms)
      const calm = S.aid === 'lobby' && !WIN && !S.catching && !CHAT.open && !S.trade;
      if (pick && mine === 0 && calm && (pick.n > 1 || pick.code < me.code)) { visitRoom(pick.code, true); return; }
      if (!me.pub) win.RC_PEER.publish(true).then(ok => { if (ok && !quiet) toast({ kind: 'room', text: 'Your room is open to other players.', sub: 'Anyone looking for a lobby can join you. Turn this off in the Room Computer.' }); uiRefresh('peer'); });
    }).catch(() => { MATCH.busy = false; });
    return true;
  }
  function matchTick() { // runs on the real clock (frames can be slow or paused)
    if (!S.ready || !peerOk()) return;
    const now = Date.now(); if (MATCH.t > 0) { MATCH.at = now + MATCH.t * 1000; MATCH.t = 0; } if (now < (MATCH.at || 0)) return;
    const i = peerInfo(); MATCH.at = now + (i && i.pub && !i.guests.length ? 15000 : 45000);
    if (isLocal() && store.auto && (!i || !i.guests.length)) { if (matchPublic(MATCH.said)) MATCH.said = true; }
  }



  // ===================== interface: HUD, login, windows and dialogs =====================
  const CSS2 = `
.rc-egg .egg{width:min(260px,52vw);height:min(260px,52vw);object-fit:contain;filter:drop-shadow(0 12px 10px rgba(0,0,0,.35))}
.rc-egg .egg.shake{animation:rcShake .32s infinite}
.rc-egg .egg.crack{animation:rcCrack .3s forwards}
@keyframes rcShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg) translateY(-4px)}75%{transform:rotate(9deg) translateY(-4px)}}
@keyframes rcCrack{to{transform:scale(1.4);opacity:0;filter:brightness(3)}}
.rc-egg .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
.rc-egg .flash.on{animation:rcFlash .6s}
@keyframes rcFlash{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
.rc-egg .rays{position:absolute;left:50%;top:44%;width:900px;height:900px;margin:-450px 0 0 -450px;background:repeating-conic-gradient(var(--c) 0 10deg,transparent 10deg 20deg);opacity:.35;border-radius:50%;mask:radial-gradient(circle,#000 20%,transparent 65%);-webkit-mask:radial-gradient(circle,#000 20%,transparent 65%);animation:rcSpin 12s linear infinite}
@keyframes rcSpin{to{transform:rotate(360deg)}}
.rc-egg .tap{color:#fff;font-weight:700;opacity:.85;margin-top:6px;text-shadow:0 2px 0 var(--ink)}
.rc-egg .new{padding:4px 14px;border:3px solid var(--ink);border-radius:999px;background:#ff5c8a;color:#fff;font-weight:700;transform:rotate(-4deg)}
.rc-evo{display:flex;gap:18px;align-items:center;justify-content:center}
.rc-evo img{width:min(150px,26vw);height:min(150px,26vw);object-fit:contain}
.rc-evo img.m{animation:rcMerge 1.3s forwards}
@keyframes rcMerge{to{transform:translateX(var(--dx)) scale(.4);opacity:0}}
.rc-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.rc-slot{position:relative;display:grid;justify-items:center;align-content:center;gap:4px;min-height:190px;padding:8px;border:3px dashed #c9b9a6;border-radius:18px;background:#fbf6ee;text-align:center;font-weight:700;cursor:pointer}
.rc-slot.full{border-style:solid;border-color:var(--ink);background:linear-gradient(180deg,#fff 40%,color-mix(in srgb,var(--rc,#ccc) 28%,#fff));box-shadow:0 3px 0 var(--ink)}
.rc-slot.lock{cursor:default;background:#efe6da;color:#8a7a6a}
.rc-slot img{width:96px;height:96px;object-fit:contain}
.rc-slot .ps{color:#1d7a2e;font-size:15px}
.rc-slot .n{position:absolute;left:8px;top:6px;font-size:12px;color:#8a7a6a}
.rc-tool{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.rc-tool select,.rc-sel{padding:7px 10px;border:3px solid var(--ink);border-radius:12px;background:#fff;font:inherit;font-weight:700;font-size:14px;color:var(--ink)}
.rc-chk{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:3px solid var(--ink);border-radius:12px;background:#fff;font-weight:700;font-size:14px;cursor:pointer}
.rc-chk.on{background:var(--cheese)}
.rc-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
.rc-day{display:grid;justify-items:center;gap:4px;padding:10px 6px;border:3px solid var(--ink);border-radius:16px;background:#fff;text-align:center;font-size:12px;font-weight:600;min-height:132px;align-content:start}
.rc-day b{font-size:14px}.rc-day i{font-style:normal;font-size:30px}
.rc-day.got{background:#e9fbe8}.rc-day.now{background:#fff3c4;outline:4px solid var(--orange);outline-offset:1px}.rc-day.big{background:linear-gradient(#fff3c4,#ffd98a)}
.rc-tag{display:inline-block;padding:1px 8px;border:2px solid var(--ink);border-radius:999px;font-size:11px;font-weight:700;background:#fff}
.rc-tiny{font-size:12px;color:#7a6a8a;font-weight:600}
.rc-room{display:grid;justify-items:center;gap:6px;padding:14px;border:3px solid var(--ink);border-radius:20px;background:#fff3c4;box-shadow:0 4px 0 var(--ink)}
.rc-room .code{font-size:46px;font-weight:700;letter-spacing:.12em;-webkit-text-stroke:2px var(--ink);color:#fff;paint-order:stroke fill;text-shadow:0 4px 0 var(--ink)}
.rc-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:760px){.rc-cols{grid-template-columns:1fr}.rc-days{grid-template-columns:repeat(4,minmax(0,1fr))}}
.rc-mini{display:flex;gap:6px;flex-wrap:wrap}
.rc-mini img{width:54px;height:54px;object-fit:contain;border:2px solid var(--ink);border-radius:12px;background:#fff}
.rc-help kbd{display:inline-grid;place-items:center;min-width:28px;height:26px;padding:0 6px;border:2px solid var(--ink);border-radius:8px;background:var(--cheese);font:inherit;font-size:13px;font-weight:700;margin-right:4px}
.rc-help li{margin:4px 0;font-weight:600}
.rc-conn{position:absolute;inset:0;display:grid;place-items:center;z-index:9;background:rgba(20,12,36,.55);padding:16px}
.rc-toast .rc-b{pointer-events:auto}
.rc-touch{position:absolute;inset:0;touch-action:none;-webkit-user-select:none;user-select:none}
.rc-stick{position:absolute;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;background:rgba(255,255,255,.18);border:3px solid rgba(255,255,255,.55);pointer-events:none}
.rc-stick i{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(255,255,255,.85);border:3px solid var(--ink)}
.rc-tbs{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));display:grid;grid-template-columns:auto auto;grid-template-areas:"use cast" "jump cast";gap:12px;align-items:end}
.rc-tb{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;border:3px solid var(--ink);background:rgba(255,255,255,.92);font-size:26px;line-height:1;box-shadow:0 4px 0 var(--ink);font-family:inherit;color:var(--ink);padding:0}
.rc-tb small{font-size:10px;font-weight:700}
.rc-tb.use{grid-area:use;background:#ffd23a}.rc-tb.jump{grid-area:jump}
.rc-tb.cast{grid-area:cast;width:88px;height:88px;font-size:36px;background:#9fe8a6}
.rc-tb.cast.ready{background:#5fdc6a;animation:rcPulse .8s infinite}
.rc-tb.on{transform:translateY(3px);box-shadow:none}
@media (max-width:700px),(max-height:500px){
.rc-hud-tl{left:8px;top:8px;gap:5px}.rc-money{font-size:16px;padding:3px 10px 3px 4px;gap:6px}.rc-money i{width:30px;height:30px;font-size:16px}
.rc-lvl b{width:34px;height:34px;font-size:16px}.rc-hud-tr{right:8px;top:8px;gap:5px}.rc-where{font-size:13px;padding:5px 9px}
.rc-ib{width:42px;height:42px;font-size:18px;border-radius:13px}.rc-ib small{display:none}.rc-menu{gap:5px}
.rc-events span{font-size:11px;padding:3px 8px}.rc-ann{width:min(92vw,520px)}.rc-ann div{font-size:15px;padding:8px 12px}
.rc-bottom{display:none}.rc-toasts{bottom:auto;top:120px;width:min(260px,62vw)}.rc-toast{font-size:13px;padding:7px 10px}
.rc-prompt{bottom:30%;font-size:15px}.rc-big b{font-size:44px}}
.rc-card .star{all:unset;cursor:pointer;font-size:17px;line-height:1;filter:drop-shadow(0 1px 0 var(--ink));transition:transform .12s}
.rc-card .star:hover{transform:scale(1.3)}
.rc-card .tr.lv10{background:#ffe0c2}.rc-card .tr.lv25{background:#e4ecf5}.rc-card .tr.lv50{background:#ffe27a}.rc-card .tr.lv75{background:#c9f3ff}
.rc-card .tr.lv100{background:linear-gradient(90deg,#ff8a8a,#ffe27a,#8affb0,#8ad8ff,#d68aff)}
.rc-trade-got{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.rc-trade-got>div{display:grid;justify-items:center;gap:4px;animation:rcSlide .6s var(--d) both cubic-bezier(.2,1.4,.4,1)}
.rc-trade-got img{width:min(150px,28vw);height:min(150px,28vw);object-fit:contain;filter:drop-shadow(0 8px 8px rgba(0,0,0,.35))}
.rc-trade-got span{color:#fff;font-weight:700;text-shadow:0 2px 0 var(--ink)}
@keyframes rcSlide{from{transform:translateX(-60vw) rotate(-20deg);opacity:0}to{transform:none;opacity:1}}

.rc-toast img{width:42px;height:42px;object-fit:contain}
`;
  { const st = doc.getElementById('rc-style'); if (st && st.textContent.indexOf('.rc-evo{') < 0) st.textContent += CSS2; }
  const $ = (sel, root2) => (root2 || ui).querySelector(sel);
  const RCOL = r => RI[SP[r.sp] ? SP[r.sp].r : 'common'].col;
  const ICONS = { catch: '🐀', money: '💰', level: '⭐', ach: '🏆', quest: '📜', potion: '🧪', index: '📖', reward: '🎁', room: '🚪', trade: '🤝', rare: '✨', err: '⚠️', ok: '✅', ratlvl: '⬆️', chest: '💎', info: '💬' };
  function myMods(withPotion) { const e = withPotion === false ? null : eff('money'); return { money: e ? e.mult : 1, rebirths: S.me ? S.me.rebirths : 0 }; }
  const earnOf = (r, wp) => RC.ratEarn(S.cfg, r, myMods(wp)).total;
  function myMps(wp) { let t = 0; for (const r of S.rats.values()) if (r.place === 'slot') t += earnOf(r, wp); return t; }

  // ---------- HUD ----------
  const HUD = {};
  function hudBuild() {
    if (HUD.el) return;
    HUD.el = el('div', 'rc-pass', ui); HUD.el.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    HUD.el.innerHTML = '<div class="rc-hud-tl"><div class="rc-money" title=""><i>$</i><div><span data-h="money">$0</span><small data-h="mps">+$0/s</small></div></div>' +
      '<div class="rc-lvl"><b data-h="lvl">1</b><div><div class="rc-xp"><i data-h="xp" style="width:0%"></i></div><small data-h="lvlt"></small></div></div><div class="rc-effects" data-h="eff"></div></div>' +
      '<div class="rc-events" data-h="events"></div><div class="rc-ann" data-h="ann"></div>' +
      '<div class="rc-toasts" data-h="toasts"></div><div class="rc-prompt" data-h="prompt" hidden></div><div class="rc-bottom" data-h="hints"></div><div class="rc-big" data-h="big"></div>';
    const tr = el('div', 'rc-hud-tr', ui); HUD.tr = tr;
    tr.innerHTML = '<div class="rc-where" data-h="where"></div><div class="rc-menu">' +
      [['inv', '🎒', 'Rats', 'I'], ['bank', '💰', 'Slots', 'B'], ['quests', '📜', 'Quests', 'Q'], ['index', '📖', 'Index', 'X'], ['lb', '🏆', 'Leaders', 'L'], ['settings', '⚙️', 'Settings', 'O']].concat(opts.onQuit ? [['quit', '🚪', 'Leave', 'Esc']] : [])
        .map(b => '<button class="rc-ib" data-menu="' + b[0] + '" title="' + b[2] + ' (' + b[3] + ')">' + b[1] + '<small>' + b[2] + ' · ' + b[3] + '</small><span class="dot" hidden></span></button>').join('') + '</div>';
    tr.addEventListener('click', e => { const b = e.target.closest('[data-menu]'); if (!b) return; SFX.click(); menuOpen(b.dataset.menu); });
    for (const n of HUD.el.querySelectorAll('[data-h]')) HUD[n.dataset.h] = n;
    for (const n of tr.querySelectorAll('[data-h]')) HUD[n.dataset.h] = n;
    HUD.dots = {}; for (const b of tr.querySelectorAll('[data-menu]')) HUD.dots[b.dataset.menu] = b.querySelector('.dot');
  }
  function menuOpen(id) {
    if (WIN && WIN.id === id) { closeWin(); return; }
    if (id === 'quit') { confirmBox('Leave Rat Catchers? Your progress is saved on the server.', 'Leave', () => { try { opts.onQuit(); } catch (e) {} }, { icon: '🚪', title: 'Leave the game' }); return; }
    if (id === 'inv') openInventory('inv'); else if (id === 'bank') openBank(); else if (id === 'quests') openDaily('quests'); else if (id === 'index') openIndex(); else if (id === 'lb') openLeaders(); else if (id === 'settings') openSettings(); else if (id === 'help') helpPopup();
  }
  function hudRefresh() {
    if (!HUD.el || !S.me) return;
    const me = S.me, need = RC.playerXpNeed(me.level);
    HUD.lvl.textContent = me.level; HUD.xp.style.width = clamp(me.xp / need * 100, 0, 100) + '%';
    HUD.lvlt.textContent = 'Level ' + me.level + (me.rebirths ? ' · Rebirth ' + me.rebirths : '') + ' · Luck ×' + (me.luck || 1).toFixed(2);
    // potions
    const t = srvNow(), effs = Object.values(me.d.eff || {}).filter(e => e.ends > t);
    HUD.eff.innerHTML = effs.map(e => { const p = POT[e.id]; return p ? '<span><i style="background:' + p.col + '"></i>' + esc(p.n) + ' ' + fmtDur((e.ends - t) / 1000) + '</span>' : ''; }).join('');
    // events
    const ev = (S.events.active || []).map(a => { const d = EVENTS[a.id]; return d ? '<span style="--c:' + d.col + '">' + esc(d.n) + ' · ' + fmtDur((a.ends - t) / 1000) + '</span>' : ''; });
    if (S.events.inv) ev.unshift('<span style="--c:#ff7a8a">RAT INVASION · ' + fmtDur((S.events.inv.ends - t) / 1000) + '</span>');
    HUD.events.innerHTML = ev.join('');
    // where am I
    const area = S.aid === 'lobby' ? 'The Lobby' : FI[S.aid] ? FI[S.aid].n : '';
    HUD.where.innerHTML = esc(area) + '<small>' + (S.room ? (isPeer() ? esc(NET.peerHost || 'A friend') + '’s room' : noServer() && peerInfo() ? 'Your room ' + showPeer(peerInfo().code) : 'Room ' + esc(S.room.code)) + ' · ' + S.roster.length + '/20 players' : 'Connecting…') + (NET.rtt ? ' · ' + Math.round(NET.rtt) + ' ms' : '') + '</small>';
    // little red dots: rewards waiting
    const qd = (me.d.quests && me.d.quests.list || []).filter(q => q.prog >= q.n && !q.claimed).length + (me.d.daily && me.d.daily.can ? 1 : 0);
    setDot('quests', qd); setDot('inv', 0);
    const free = (me.cap ? me.cap.inv + me.cap.storage : 0) - [...S.rats.values()].filter(r => r.place === 'inv' || r.place === 'sto').length; setDot('inv', free <= 0 ? '!' : 0);
    hintsRefresh();
  }
  function setDot(id, n) { const d = HUD.dots && HUD.dots[id]; if (!d) return; d.hidden = !n; d.textContent = n; }
  function hintsRefresh() {
    if (!HUD.hints) return;
    const f = S.aid !== 'lobby';
    if (IN.touch) { HUD.hints.innerHTML = ''; return; }
    HUD.hints.innerHTML = '<div class="rc-hint">' + (IN.locked ? '<kbd>WASD</kbd> move · <kbd>Shift</kbd> run · <kbd>Space</kbd> jump · ' + (f ? '<kbd>Click</kbd> cast at a rat · <kbd>Right-click</kbd> aim · ' : '<kbd>E</kbd> use · ') + '<kbd>Esc</kbd> free the mouse' : '<kbd>Click</kbd> the game to look around · <kbd>H</kbd> help') + '</div>';
  }
  let moneyAt = 0;
  function hudFrame(dt) {
    if (!HUD.el || !S.me) return;
    // between server ticks the money counts up at the rate the server reported; the server's number always wins
    const target = S.money + S.mps * Math.min(1.2, (Date.now() - moneyAt) / 1000);
    S.moneyShown = Math.abs(target - S.moneyShown) > Math.max(10, S.mps * 3) ? target : lerp(S.moneyShown, target, 1 - Math.exp(-dt * 12));
    HUD.money.textContent = fmtMoney(S.moneyShown); HUD.mps.textContent = '+' + fmtMoney(S.mps) + '/s';
    HUD.money.parentNode.parentNode.title = '$' + fmtN(S.money) + ' (+' + fmtMoney(S.mps, true) + ' every second)';
    // the interaction prompt
    const n = S.near; let txt = '';
    if (n && !uiOpen() && !S.travel) txt = n.kind === 'station' ? n.s.n : n.kind === 'stand' ? (S.me && n.who.id === S.me.id ? 'Edit your showcase' : 'Look at ' + n.who.n + "'s showcase") : n.kind === 'player' ? n.o.n : n.kind === 'chest' ? 'Open the chest' : '';
    if (txt) { HUD.prompt.hidden = false; if (HUD.prompt.dataset.t !== txt) { HUD.prompt.dataset.t = txt; HUD.prompt.innerHTML = '<kbd>E</kbd>' + esc(txt); } } else HUD.prompt.hidden = true;
    HUD.tick = (HUD.tick || 0) + dt; if (HUD.tick > 1) { HUD.tick = 0; hudRefresh(); }
  }

  // ---------- toasts, announcements and big text ----------
  function toast(t) {
    if (!HUD.toasts) return;
    const d = el('div', 'rc-toast', HUD.toasts), ic = ICONS[t.kind] || '💬';
    d.innerHTML = (t.rat ? ratImg(t.rat) : '<span class="ic">' + ic + '</span>') + '<div>' + esc(t.text) + (t.sub ? '<small>' + esc(t.sub) + '</small>' : '') + '</div>';
    if (t.col) d.style.background = 'color-mix(in srgb,' + t.col + ' 30%,#fff)';
    if (t.kind === 'err') d.style.background = '#ffe6e6';
    if (t.btn) { const b = el('button', 'rc-b xs y', d, esc(t.btn)); b.onclick = () => { t.on && t.on(); d.remove(); }; }
    while (HUD.toasts.children.length > 5) HUD.toasts.firstChild.remove();
    if (t.kind !== 'err' && t.kind !== 'catch') (t.kind === 'ach' || t.kind === 'level' ? SFX.ach : t.kind === 'reward' ? SFX.coin : SFX.toast)();
    setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 360); }, t.ms || (t.kind === 'err' ? 3500 : t.btn ? 20000 : 4800));
  }
  const ANN_KIND = { normal: ['ANNOUNCEMENT', 'chime'], event: ['EVENT', 'fanfare'], rare: ['RARE DISCOVERY', 'rare'], update: ['UPDATE', 'chime'], shutdown: ['SERVER NOTICE', 'alarm'], giveaway: ['GIVEAWAY', 'gift'] };
  S.annLog = [];
  function showAnn(a) {
    if (!HUD.ann) hudBuild();
    S.annLog.unshift(a); if (S.annLog.length > 20) S.annLog.pop();
    const k = ANN_KIND[a.kind] || ANN_KIND.normal, d = el('div', '', HUD.ann);
    d.style.setProperty('--c', a.col || '#ffffff'); d.innerHTML = '<small>' + k[0] + (a.by && a.by !== 'auto' ? ' · from the owner' : '') + '</small>' + esc(a.text);
    while (HUD.ann.children.length > 3) HUD.ann.firstChild.remove();
    SFX.ann(a.sound || k[1]);
    setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 420); }, (a.dur || 6) * 1000);
    uiRefresh('ann');
  }
  let bigT = 0;
  function bigText(title, sub, col, dur) {
    if (!HUD.big) return; clearTimeout(bigT);
    HUD.big.innerHTML = '<b>' + esc(title) + '</b>' + (sub ? '<span style="--c:' + (col || '#fff') + '">' + esc(sub) + '</span>' : '');
    bigT = setTimeout(() => { HUD.big.innerHTML = ''; }, (dur || 1.8) * 1000);
  }

  // ---------- connecting and logging in ----------
  const LOGIN = { el: null };
  function serverScreen(msg) {
    hideLogin(); loadEl.hidden = true;
    const d = el('div', 'rc-login', ui); LOGIN.el = d;
    d.innerHTML = '<div style="display:grid;justify-items:center;gap:14px;width:min(520px,100%)"><div class="rc-logo">RAT<br>CATCHERS<small>AN ORION ORIGINAL</small></div>' +
      '<div class="rc-win narrow"><div class="rc-wh" style="--hc:#7a4dff"><span class="ic">🖥️</span><h2>Pick a server<small>Rat Catchers is played online on a game server</small></h2></div><div class="rc-body nt" style="display:grid;gap:10px">' +
      (msg ? '<div class="rc-err">' + esc(msg) + '</div>' : '') +
      '<div class="rc-label">Server address</div><input class="rc-in" data-f="srv" placeholder="for example localhost:8787 or rats.example.com" value="' + esc(store.server || '') + '" spellcheck="false" autocomplete="off">' +
      '<p class="rc-note">Whoever runs the server gives you this address. On the computer running the server, type <b>localhost:8787</b>. This page is ' + (win.location.protocol === 'https:' ? '<b>secure (https)</b>, so the server must be secure too (wss:// or https://).' : 'not secure, so ws:// and http:// servers work.') + '</p>' +
      '<button class="rc-b g wide" data-go>Connect</button><button class="rc-b wide" data-solo>Play here without a server</button></div></div></div>';
    const inp = d.querySelector('[data-f="srv"]'), go = () => { const v = inp.value.trim(); if (!v) { inp.focus(); return; } NET.serverInput = v; store.server = v; persist(); hideLogin(); showConn('Connecting…', v); connect(wsUrl(v)); };
    d.querySelector('[data-go]').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
    d.querySelector('[data-solo]').onclick = () => { store.server = 'local'; persist(); hideLogin(); NET.kicked = false; connect('local:'); };
    setTimeout(() => inp.focus(), 50);
  }
  function showLogin(tab) {
    hideLogin(); hideConn(); loadEl.hidden = true; releaseLock();
    const d = el('div', 'rc-login', ui); LOGIN.el = d; LOGIN.tab = tab || LOGIN.tab || 'new';
    const draw = () => {
      const isNew = LOGIN.tab === 'new';
      d.innerHTML = '<div style="display:grid;justify-items:center;gap:14px;width:min(520px,100%)"><div class="rc-logo">RAT<br>CATCHERS<small>AN ORION ORIGINAL</small></div>' +
        '<div class="rc-win narrow"><div class="rc-tabs" style="padding-top:12px"><button data-tab="new" class="' + (isNew ? 'on' : '') + '">New player</button><button data-tab="old" class="' + (isNew ? '' : 'on') + '">I already play</button></div>' +
        '<div class="rc-body" style="display:grid;gap:10px"><div class="rc-err" data-err hidden></div>' +
        '<div class="rc-label">' + (isNew ? 'Pick a player name' : 'Your player name') + '</div><input class="rc-in" data-f="name" maxlength="16" autocomplete="off" spellcheck="false" placeholder="3 to 16 letters or numbers">' +
        '<div class="rc-label">' + (isNew ? 'Password (optional, lets you play on other devices)' : 'Password') + '</div><input class="rc-in" data-f="pass" type="password" maxlength="64" autocomplete="' + (isNew ? 'new-password' : 'current-password') + '">' +
        '<button class="rc-b g wide" data-go>' + (isNew ? 'Start catching!' : 'Log in') + '</button>' +
        '<p class="rc-note">Your rats, money and progress are saved on the game server, not on this device.' + (isNew ? ' Without a password you can keep playing on this device; add one any time in Settings.' : '') + '</p>' +
        '<div class="rc-row"><span class="rc-tiny">Server: ' + esc(NET.url.replace(/^wss?:\/\//, '').replace(/\/ws$/, '')) + '</span><span class="rc-sp"></span><button class="rc-b xs" data-srv>Change server</button></div></div></div></div>';
      const nm = d.querySelector('[data-f="name"]'), pw = d.querySelector('[data-f="pass"]');
      if (opts.name && !nm.value) nm.value = String(opts.name).replace(/[^A-Za-z0-9_ ]/g, '').slice(0, 16);
      const go = () => { const name = nm.value.trim(), pass = pw.value; if (name.length < 3) { loginErr('Names need at least 3 letters.'); return; } if (!isNew && !pass) { loginErr('Type your password.'); return; } nsend(isNew ? { t: 'register', name, pass: pass || undefined } : { t: 'login', name, pass }); d.querySelector('[data-go]').disabled = true; };
      d.querySelector('[data-go]').onclick = go; nm.onkeydown = pw.onkeydown = e => { if (e.key === 'Enter') go(); };
      for (const b of d.querySelectorAll('[data-tab]')) b.onclick = () => { LOGIN.tab = b.dataset.tab; draw(); };
      d.querySelector('[data-srv]').onclick = () => { try { NET.ws && NET.ws.close(); } catch (e) {} NET.kicked = true; serverScreen(); };
      setTimeout(() => nm.focus(), 50);
    };
    draw();
  }
  function loginErr(text) { const e = LOGIN.el && LOGIN.el.querySelector('[data-err]'); if (!e) return; e.hidden = false; e.textContent = text; const b = LOGIN.el.querySelector('[data-go]'); if (b) b.disabled = false; SFX.err(); }
  function hideLogin() { if (LOGIN.el) { LOGIN.el.remove(); LOGIN.el = null; } }
  const CONN = { el: null };
  function showConn(title, sub, final) {
    hideConn(); loadEl.hidden = true;
    const d = el('div', 'rc-conn', ui); CONN.el = d;
    d.innerHTML = '<div class="rc-win narrow"><div class="rc-wh" style="--hc:#3fa9ff"><span class="ic">' + (final ? '🔌' : '📡') + '</span><h2>' + esc(title) + '<small>' + esc(sub || '') + '</small></h2></div><div class="rc-body nt" style="display:grid;gap:10px">' +
      '<p class="rc-note">' + (final ? 'You can reload the page to join again.' : 'Your progress is safe on the server. The game reconnects by itself.') + '</p><div class="rc-row end"><button class="rc-b sm" data-srv>Change server</button>' + (final ? '<button class="rc-b sm g" data-reload>Reconnect</button>' : '<button class="rc-b sm g" data-now>Try now</button>') + '</div></div></div>';
    d.querySelector('[data-srv]').onclick = () => { NET.kicked = true; clearTimeout(NET.retry); try { NET.ws && NET.ws.close(); } catch (e) {} serverScreen(); };
    const now = d.querySelector('[data-now]'); if (now) now.onclick = () => { clearTimeout(NET.retry); connect(NET.url); };
    const rl = d.querySelector('[data-reload]'); if (rl) rl.onclick = () => { hideConn(); NET.kicked = false; connect(NET.url); };
  }
  function hideConn() { if (CONN.el) { CONN.el.remove(); CONN.el = null; } }
  function onNetDown(text) {
    S.ready = false; S.catching = null; releaseLock();
    if (isHosted()) { HOST.next = Date.now() + 15000; HOST.ready = 0; hideConn(); connect('local:'); toast({ kind: 'room', text: 'Lost the online server.', sub: 'You’re playing on your own for now. The game reconnects by itself.' }); return; }
    if (isLocal()) return;
    if (isPeer()) { const why = win.RC_PEER ? win.RC_PEER.lastEnd() : ''; goHome(END_WHY[why] || END_WHY.lost); return; }
    if (NET.kicked) return;
    if (!S.me && NET.tries >= 2 && !text) { serverScreen("Couldn't reach that server. Check the address, and that the server is running."); NET.tries = 0; return; }
    reconnectSoon(text || 'Connecting…');
  }

  // ---------- windows ----------
  let WIN = null;
  function openWin(id, o) {
    closeWin(true); releaseLock();
    const m = el('div', 'rc-modal', ui), w = el('div', 'rc-win ' + (o.cls || ''), m);
    w.style.setProperty('--hc', o.color || '#ff9f1a');
    const head = el('div', 'rc-wh', w, '<span class="ic">' + (o.icon || '🐀') + '</span><h2>' + esc(o.title) + '<small data-sub>' + esc(o.sub || '') + '</small></h2>');
    const x = el('button', 'rc-x', head, '✕'); x.title = 'Close (Esc)'; x.onclick = () => closeWin();
    const tabs = o.tabs ? el('div', 'rc-tabs', w) : null, body = el('div', 'rc-body' + (tabs ? '' : ' nt'), w);
    const W_ = WIN = { id, m, w, body, tabsEl: tabs, o, tab: o.tab || (o.tabs ? o.tabs[0][0] : null), st: o.st || {} };
    m.addEventListener('mousedown', e => { if (e.target === m) closeWin(); });
    body.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && !t.disabled && W_.o.act) { SFX.click(); W_.o.act(t.dataset.act, t, e); } });
    // never rebuild the window under a pressed mouse button: the click would be lost
    W_.m.addEventListener('mousedown', () => { W_.down = true; }, true);
    win.addEventListener('mouseup', W_.up = () => { if (!W_.down) return; W_.down = false; if (W_.pending && WIN === W_) { W_.pending = false; setTimeout(() => { if (WIN === W_) renderWin(); }, 0); } }, true);
    body.addEventListener('change', e => { const t = e.target.closest('[data-ch]'); if (t && W_.o.ch) W_.o.ch(t.dataset.ch, t, e); });
    if (tabs) tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; SFX.click(); W_.tab = b.dataset.tab; W_.body.scrollTop = 0; if (W_.o.onTab) W_.o.onTab(W_.tab); drawTabs(); renderWin(); });
    drawTabs(); renderWin(); SFX.open(); return W_;
  }
  function drawTabs() { if (!WIN || !WIN.tabsEl) return; WIN.tabsEl.innerHTML = WIN.o.tabs.map(t => '<button data-tab="' + t[0] + '" class="' + (t[0] === WIN.tab ? 'on' : '') + '">' + t[1] + '</button>').join(''); }
  function renderWin() {
    const W_ = WIN; if (!W_) return;
    // keep what the player was typing and where they were scrolled
    const keep = {}, act = doc.activeElement; let focus = null;
    for (const i of W_.body.querySelectorAll('[data-keep]')) { keep[i.dataset.keep] = i.value; if (i === act) focus = i.dataset.keep; }
    const sc = W_.body.scrollTop; W_.body.innerHTML = '';
    try { W_.o.render(W_, W_.body); } catch (e) { if (win.console) console.error('window', W_.id, e); W_.body.innerHTML = '<p class="rc-note">Something went wrong showing this window.</p>'; }
    for (const i of W_.body.querySelectorAll('[data-keep]')) { if (keep[i.dataset.keep] != null) i.value = keep[i.dataset.keep]; if (focus === i.dataset.keep) i.focus(); }
    W_.body.scrollTop = sc;
    if (W_.o.subf) { const s = W_.w.querySelector('[data-sub]'); if (s) s.textContent = W_.o.subf(W_); }
  }
  function closeWin(silent) { if (!WIN) return; const W_ = WIN; WIN = null; W_.m.remove(); win.removeEventListener('mouseup', W_.up, true); if (W_.o.onClose) W_.o.onClose(); if (!silent) SFX.close(); refocus(); }
  function refocus() { try { if (CHAT.open && CHAT.inp) { CHAT.inp.focus({ preventScroll: true }); return; } if (!LOGIN.el) wrap.focus({ preventScroll: true }); } catch (e) {} }
  function uiOpen() { return !!(WIN || LOGIN.el || CONF.el || OVL.el || CONN.el); }
  function uiRefresh(what, data) {
    if (what === 'rats' || what === 'me') HUD.tick = 2;
    if (WIN && WIN.o.on) {
      let r = false; try { r = WIN.o.on(what, data); } catch (e) {} if (!r) return;
      // windows can describe what they show; only redraw when that changed
      if (WIN.o.sig) { let sg = ''; try { sg = WIN.o.sig(WIN); } catch (e) {} if (sg === WIN.lastSig) return; WIN.lastSig = sg; }
      if (WIN.down) { WIN.pending = true; return; } renderWin();
    }
  }

  // ---------- confirmations ----------
  const CONF = { el: null };
  function confirmBox(text, ok, cb, o) {
    o = o || NOO; if (CONF.el) CONF.el.remove(); releaseLock();
    const m = el('div', 'rc-modal', ui); m.style.zIndex = 7; CONF.el = m;
    m.innerHTML = '<div class="rc-win narrow rc-confirm"><div class="rc-wh" style="--hc:' + (o.col || '#ff9f1a') + '"><span class="ic">' + (o.icon || '❓') + '</span><h2>' + esc(o.title || 'Are you sure?') + '</h2></div><div class="rc-body nt">' +
      (o.html || '<p>' + esc(text) + '</p>') + '<div class="rc-row end"><button class="rc-b sm" data-no>' + esc(o.no || 'Cancel') + '</button><button class="rc-b sm ' + (o.danger ? 'r' : 'g') + '" data-yes>' + esc(ok || 'OK') + '</button></div></div></div>';
    const close = () => { m.remove(); if (CONF.el === m) CONF.el = null; refocus(); };
    m.querySelector('[data-no]').onclick = () => { SFX.click(); close(); o.onNo && o.onNo(); };
    m.querySelector('[data-yes]').onclick = () => { SFX.click(); close(); cb(); };
    m.addEventListener('mousedown', e => { if (e.target === m) close(); });
  }
  // the server asks before risky changes
  function askConfirm(m) {
    const map = { unlock: () => nsend({ t: 'lock', id: m.id, v: 0, confirm: 1 }), sellfav: () => nsend({ t: 'sell', ids: m.ids, confirmFav: 1 }), evolve: () => nsend({ t: 'evolve', ids: m.ids, confirm: 1 }), tradefav: () => nsend({ t: 'tAdd', id: m.id, confirm: 1 }) };
    const f = map[m.what]; if (!f) return;
    confirmBox(m.text, m.what === 'unlock' ? 'Unlock' : m.what === 'sellfav' ? 'Sell anyway' : m.what === 'evolve' ? 'Evolve' : 'Offer it', f, { danger: m.what !== 'unlock', icon: m.what === 'unlock' ? '🔓' : '⭐' });
  }

  // ---------- overlays: eggs, evolution, popups ----------
  const OVL = { el: null, t: [] };
  function overlayOpen(html, cls) { overlayClose(); releaseLock(); const d = el('div', cls || 'rc-egg', ui); d.innerHTML = html; OVL.el = d; return d; }
  function overlayClose() { for (const t of OVL.t) clearTimeout(t); OVL.t = []; if (OVL.el) { OVL.el.remove(); OVL.el = null; refocus(); } }
  const later = (ms, f) => OVL.t.push(setTimeout(f, ms));
  function eggOpen(eggId, rat) {
    const s = SP[rat.sp], rr = RI[s.r], ix = S.me && S.me.d.index && S.me.d.index[rat.sp], isNew = !(ix && ix.n > 0);
    const d = overlayOpen('<div class="flash"></div><div class="res" data-stage><img class="egg shake" src="' + (SNAP.cache.get('e:' + eggId) || BLANK) + '" data-pk="e:' + eggId + '" alt=""><div class="tap">Hatching…</div></div>');
    if (!SNAP.cache.get('e:' + eggId)) queueSnap('e:' + eggId, { kind: 'egg', id: eggId });
    let shown = false;
    const reveal = () => {
      if (shown) return; shown = true; for (const t of OVL.t) clearTimeout(t); OVL.t = [];
      d.querySelector('.flash').classList.add('on'); SFX.eggCrack(); setTimeout(() => SFX.reveal(rr.i), 150);
      const mu = [rat.mut, rat.wx, rat.disco ? 'disco' : null].filter(Boolean).map(m => '<span class="rc-pill" style="--c:' + MUTATIONS[m].col + '">' + MUTATIONS[m].n + '</span>').join(' ');
      d.querySelector('[data-stage]').innerHTML = '<div class="rays" style="--c:' + rr.col + '"></div>' + ratImg(rat) + '<b>' + esc(RC.ratName(rat)) + '</b><span class="rc-pill" style="--c:' + rr.col + ';font-size:18px">' + rr.n + '</span>' + (mu ? '<div>' + mu + '</div>' : '') + (isNew ? '<span class="new">NEW IN YOUR INDEX!</span>' : '') +
        '<span class="rc-pill" style="--c:#c8f5c0;font-size:15px">' + fmtMoney(earnOf(rat, false)) + ' every second in a money slot</span><div class="tap">Click to continue</div>';
      d.style.setProperty('--c', rr.col);
    };
    later(250, () => SFX.eggShake()); later(800, () => SFX.eggShake()); later(1350, () => SFX.eggShake());
    later(1700, () => { const e = d.querySelector('.egg'); if (e) { e.classList.remove('shake'); e.classList.add('crack'); } });
    later(1950, reveal);
    d.addEventListener('click', () => { if (!shown) reveal(); else { overlayClose(); if (WIN) renderWin(); } });
  }
  function evolveFx(m) {
    const r = m.rat, prev = Object.assign({}, r, { evo: r.evo - 1 }), rr = RI[SP[r.sp].r];
    const d = overlayOpen('<div class="flash"></div><div class="res"><div class="rc-evo">' + ratImg(prev, ' class="m" style="--dx:170px"') + ratImg(prev, ' class="m" style="--dx:0px"') + ratImg(prev, ' class="m" style="--dx:-170px"') + '</div><div class="tap">Evolving…</div></div>');
    SFX.evolve();
    later(1300, () => { d.querySelector('.flash').classList.add('on'); d.querySelector('.res').innerHTML = '<div class="rays" style="--c:' + rr.col + '"></div>' + ratImg(r) + '<b>' + esc(RC.ratName(r)) + '</b><span class="rc-pill" style="--c:' + rr.col + ';font-size:18px">Evolution stage ' + r.evo + ' · ×' + Math.pow(S.cfg.evoMult, r.evo) + ' earnings</span><div class="tap">Click to continue</div>'; });
    d.addEventListener('click', () => overlayClose());
  }
  function popup(icon, title, html, btn, col, cb) {
    confirmBox('', btn || 'OK', cb || (() => {}), { icon, title, html, col, no: 'Close' });
    const n = CONF.el && CONF.el.querySelector('[data-no]'); if (n && !cb) n.remove();
  }
  function offlinePopup(o) {
    popup('🌙', 'Welcome back!', '<p>You were away for <b>' + fmtDur(o.away) + '</b>.</p><p>While you were gone, your money slots earned <b style="color:#1d7a2e">' + fmtMoney(o.amt) + '</b> — that is ' + Math.round(o.rate * 100) + '% of your online rate, for ' + fmtDur(o.secs) + '.</p>' + (o.capped ? '<p class="rc-note">Offline earnings stop after ' + o.maxH + ' hours. Come back sooner to earn it all!</p>' : '<p class="rc-note">Offline earnings count for up to ' + o.maxH + ' hours.</p>'), 'Collect', '#5fdc6a');
    SFX.cash();
  }
  function helpPopup() {
    popup('❓', 'How to play', '<div class="rc-help"><ul style="margin:0 0 10px;padding-left:18px">' +
      '<li><kbd>Click</kbd>the game to look around with the mouse. <kbd>Esc</kbd>frees the mouse.</li>' +
      '<li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>walk, <kbd>Shift</kbd>run, <kbd>Space</kbd>jump.</li>' +
      '<li><kbd>E</kbd>use the stations in the lobby: shop, eggs, rat bank, rooms and more.</li>' +
      '<li>Walk into a glowing portal to visit a field. Better fields open as you level up.</li>' +
      '<li>In a field, point at a rat and <kbd>Click</kbd>to cast. Keep it in your sights while you reel it in!</li>' +
      '<li>Put rats in <b>money slots</b> at the Rat Bank (<kbd>B</kbd>). They earn money every second, even a little while you are offline.</li>' +
      '<li><kbd>I</kbd>your rats · <kbd>Q</kbd>quests · <kbd>X</kbd>Rat Index · <kbd>L</kbd>leaderboards · <kbd>O</kbd>settings · <kbd>M</kbd>music on/off</li></ul>' +
      '<p class="rc-note">Rarer rats glow and are harder to catch. Events like Gold Moon and Rain give rats special mutations that multiply what they earn.</p></div>', 'Got it!', '#7a4dff');
  }
  function inviteToast(m) { toast({ kind: 'room', text: m.from + ' invited you to their ' + (m.priv ? 'private ' : '') + 'room.', sub: 'Room ' + m.code, btn: 'Join', on: () => nsend({ t: 'join', code: m.code }) }); SFX.ann('chime'); }
  function onBought(m) {
    if (m.rat) eggOpen(m.id, m.rat);
    else if (m.text) { SFX.buy(); toast({ kind: 'ok', text: m.text }); }
    if (WIN) renderWin();
  }


  // ===================== rendering =====================
  const VIEW = m4(), PROJ = m4(), VP = m4(), IVP = m4(), MM = m4(), SVP = m4(), SVPB = m4();
  let W = 2, H = 2, K2 = 1, FRU = [], camRight = [1, 0, 0], camUp = [0, 1, 0], camDir = [0, 0, -1];
  // graphics level: 0 fast, 1 balanced, 2 best. Automatic starts at balanced on phones and tablets and at best elsewhere,
  // lowers the resolution when frames are slow, then steps down a level if that isn't enough.
  const QLT = { s: 1, slow: 0, fast: 0, tier: null, start: 2, ups: 0 };
  const GFX = { tier: 2, post: false, msaa: false, shadow: 0, hs: 26, grassR: 0, grassD: 0.8, outline: true, blob: 1 };
  function gfxApply() {
    if (QLT.tier == null) { QLT.start = IN.touch ? 1 : 2; QLT.tier = QLT.start; }
    const q = store.quality, tier = q === 'low' ? 0 : q === 'medium' ? 1 : q === 'high' ? 2 : QLT.tier;
    GFX.tier = tier;
    GFX.post = tier >= 1 && !!PPC && !RT.bad;
    GFX.msaa = GFX.post && GL2;
    GFX.shadow = tier >= 1 && PD && !RT.sm.bad ? (tier >= 2 ? 2048 : 1024) : 0;
    GFX.hs = tier >= 2 ? 32 : 26;
    GFX.grassR = !PG ? 0 : tier >= 2 ? 36 : tier >= 1 ? 26 : 15;
    GFX.grassD = tier >= 2 ? 1 : tier >= 1 ? 0.8 : 0.5;
    GFX.outline = !!PO;
    GFX.blob = GFX.shadow ? 0.55 : 1;
    if (GFX.force) Object.assign(GFX, GFX.force); // tests can switch single features off
  }
  function resize() {
    gfxApply();
    const r = wrap.getBoundingClientRect(), cw = Math.max(2, r.width), ch = Math.max(2, r.height), dpr = win.devicePixelRatio || 1;
    const base = GFX.tier === 0 ? Math.min(1, dpr) * 0.7 : GFX.tier === 2 ? Math.min(2, dpr) : Math.min(1.5, dpr);
    const s = store.quality === 'auto' ? base * QLT.s : base, w = Math.max(2, Math.round(cw * s)), h = Math.max(2, Math.round(ch * s));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const k2 = Math.min(2, dpr), w2 = Math.round(cw * k2), h2 = Math.round(ch * k2);
    if (c2.width !== w2 || c2.height !== h2) { c2.width = w2; c2.height = h2; }
    W = cw; H = ch; K2 = k2;
  }
  function qualityTick(dt) {
    if (store.quality !== 'auto' || !S.ready) return;
    if (dt > 1 / 38) { QLT.slow += dt; QLT.fast = 0; } else if (dt < 1 / 55) { QLT.fast += dt; QLT.slow = 0; }
    if (QLT.slow > 2.5) { QLT.slow = 0; if (QLT.s > 0.62) QLT.s = Math.max(0.6, QLT.s - 0.15); else if (QLT.tier > 0) { QLT.tier--; QLT.s = 0.85; } }
    if (QLT.fast > 6 && QLT.s < 1) { QLT.s = Math.min(1, QLT.s + 0.1); QLT.fast = 0; }
    if (QLT.fast > 40 && QLT.s >= 1 && QLT.tier < QLT.start && QLT.ups < 2) { QLT.tier++; QLT.ups++; QLT.s = 0.8; QLT.fast = 0; }
  }

  // ---------- environment: the field's look plus whatever events are running ----------
  const ENV = { cur: null };
  const C3 = (a, b, t) => cmix(a, b, t);
  function envTarget() {
    const th = S.A ? S.A.env : THEMES.lobby, sk = th.sky, w = weatherNow(), ev = id => eventOn(id);
    const e = { top: sk.top.slice(), hor: sk.hor.slice(), bot: sk.bot.slice(), sunC: sk.sunC.slice(), sunS: sk.sunS, stars: sk.stars, clouds: sk.clouds, cloudC: sk.cloudC.slice(), neb: sk.neb, aur: sk.aur, nebA: (sk.nebA || [0, 0, 0]).slice(), nebB: (sk.nebB || [0, 0, 0]).slice(),
      moon: 0, moonC: [0.95, 0.95, 1], rainbow: sk.rainbow || 0, sun: th.sun, lightC: th.sunC.slice(), amb: th.amb.slice(), gnd: th.gnd.slice(), fog: th.fog.slice(), fogD: th.fogD, expo: th.expo || 1, wind: 1 };
    const cave = th.cave || th.indoor;
    if (!cave) {
      if (w === 'storm' || w === 'ultra') { e.top = cmul(e.top, 0.45); e.hor = C3(cmul(e.hor, 0.55), [0.3, 0.32, 0.4], 0.4); e.clouds = 1; e.cloudC = [0.32, 0.34, 0.4]; e.sunS = 0; e.lightC = cmul(e.lightC, 0.5); e.amb = cmul(e.amb, 0.75); e.fog = C3(e.fog, [0.33, 0.36, 0.44], 0.65); e.fogD *= 1.5; e.wind = 2.6; }
      else if (w === 'rain') { e.top = cmul(e.top, 0.65); e.hor = C3(e.hor, [0.6, 0.64, 0.7], 0.5); e.clouds = 1; e.cloudC = [0.62, 0.64, 0.7]; e.sunS *= 0.2; e.lightC = cmul(e.lightC, 0.7); e.fog = C3(e.fog, [0.56, 0.6, 0.68], 0.55); e.fogD *= 1.3; e.wind = 1.8; }
      else if (w === 'snow') { e.hor = C3(e.hor, [0.9, 0.92, 0.97], 0.6); e.clouds = Math.max(e.clouds, 0.9); e.cloudC = [0.93, 0.94, 0.97]; e.lightC = cmul(e.lightC, 0.85); e.fog = C3(e.fog, [0.9, 0.92, 0.97], 0.6); e.fogD *= 1.4; e.wind = 1.4; }
    }
    if (ev('goldmoon')) { e.top = C3(e.top, [0.07, 0.04, 0.12], 0.75); e.hor = C3(e.hor, [0.62, 0.36, 0.16], 0.55); e.moon = 1; e.moonC = [1, 0.8, 0.25]; e.stars = Math.max(e.stars, 0.7); e.lightC = C3(e.lightC, [1, 0.78, 0.38], 0.55); e.amb = C3(e.amb, [0.6, 0.48, 0.3], 0.4); e.sunS = 0; e.fog = C3(e.fog, [0.45, 0.3, 0.18], 0.4); }
    if (ev('heaven')) { e.hor = C3(e.hor, [1, 0.95, 0.78], 0.5); e.sunS = Math.max(e.sunS, 1.2) * 1.3; e.amb = C3(cmul(e.amb, 1.12), [0.95, 0.88, 0.7], 0.2); e.rainbow = Math.max(e.rainbow, 0.35); e.lightC = C3(e.lightC, [1, 0.95, 0.75], 0.3); }
    if (ev('diamond')) { e.hor = C3(e.hor, [0.7, 0.95, 1], 0.4); e.stars = Math.max(e.stars, 0.5); e.amb = C3(e.amb, [0.65, 0.85, 1], 0.25); }
    if (ev('rainbow')) e.rainbow = 1;
    if (ev('dj')) { e.top = C3(e.top, [0.14, 0.04, 0.3], 0.65); e.hor = C3(e.hor, [0.62, 0.2, 0.72], 0.45); e.stars = Math.max(e.stars, 0.6); e.lightC = cmul(e.lightC, 0.6); e.amb = C3(e.amb, [0.5, 0.3, 0.7], 0.35); e.sunS *= 0.3; }
    if (w === 'ultra' || ev('ultra')) { e.rainbow = 1; e.moon = 1; e.moonC = [1, 0.6, 1]; e.neb = Math.max(e.neb, 0.5); e.nebA = [0.6, 0.2, 0.7]; e.nebB = [0.2, 0.5, 0.9]; }
    if (S.events.inv) { e.hor = C3(e.hor, [0.95, 0.32, 0.3], 0.35); e.fog = C3(e.fog, [0.6, 0.25, 0.25], 0.3); e.amb = C3(e.amb, [0.7, 0.4, 0.4], 0.15); }
    return e;
  }
  function envTick(dt) {
    const t = envTarget(); if (!ENV.cur || ENV.snap) { ENV.cur = t; ENV.snap = false; return; }
    const k = 1 - Math.exp(-dt * 1.6), c = ENV.cur;
    for (const key in t) { const v = t[key]; if (Array.isArray(v)) c[key] = c[key] ? vlerp(c[key], v, k) : v.slice(); else c[key] = c[key] == null ? v : lerp(c[key], v, k); }
  }

  // ---------- particles: soft glows, smoke, dots, rings and sparkles in two batches ----------
  const PT = [], PMAX = 2600, QMAX = 5200, QF = 10;
  const QB = { a: new Float32Array(QMAX * 4 * QF), d: new Float32Array(QMAX * 4 * QF), na: 0, nd: 0 };
  const qbuf = gl.createBuffer(), qidx = gl.createBuffer();
  { const ix = new Uint16Array(QMAX * 6); for (let i = 0; i < QMAX; i++) { ix.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6); } gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, qidx); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ix, gl.STATIC_DRAW); }
  const KMODE = [0, 4, 2, 3, 4, 5, 6], KADD = [1, 0, 0, 1, 0, 1, 1];
  function emit(p, v, life, s0, s1, col, drag, grav, kind) {
    if (PT.length >= PMAX || PASS !== 0) return;
    PT.push({ x: p[0], y: p[1], z: p[2], vx: v[0], vy: v[1], vz: v[2], life: life, age: 0, s0: s0, s1: s1 == null ? s0 : s1, c: col, drag: drag || 0, grav: grav || 0, k: kind || 0 });
  }
  function burst(p, n, spd, col, life, size, o) {
    o = o || NOO;
    for (let i = 0; i < n; i++) { let d = [rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)]; if (o.up) d[1] = Math.abs(d[1]) + 0.35; d = norm(d); const sp = spd * rnd(0.35, 1);
      emit(p, [d[0] * sp, d[1] * sp, d[2] * sp], life * rnd(0.6, 1.25), size, size * 0.15, col, 1.4, o.grav != null ? o.grav : 4, o.kind != null ? o.kind : 2); }
  }
  function partTick(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i]; p.age += dt; if (p.age >= p.life) { PT[i] = PT[PT.length - 1]; PT.pop(); continue; }
      if (p.drag) { const k = Math.exp(-p.drag * dt); p.vx *= k; p.vy *= k; p.vz *= k; }
      p.vy -= p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    }
  }
  function qput(add, c, ax, ay, col, mode) {
    if (PASS !== 0) return;
    const n = add ? QB.nd : QB.na; if (n >= QMAX) return; const B = add ? QB.d : QB.a; let o = n * 4 * QF;
    const V = (sx, sy) => { B[o] = c[0] + ax[0] * sx + ay[0] * sy; B[o + 1] = c[1] + ax[1] * sx + ay[1] * sy; B[o + 2] = c[2] + ax[2] * sx + ay[2] * sy; B[o + 3] = sx; B[o + 4] = sy; B[o + 5] = col[0]; B[o + 6] = col[1]; B[o + 7] = col[2]; B[o + 8] = col[3] == null ? 1 : col[3]; B[o + 9] = mode; o += QF; };
    V(-1, -1); V(1, -1); V(1, 1); V(-1, 1);
    if (add) QB.nd++; else QB.na++;
  }
  const bill = (c, s, col, mode, add) => qput(add, c, mul(camRight, s), mul(camUp, s), col, mode);
  const decal = (c, s, col, mode, add) => qput(add, [c[0], c[1] + 0.04, c[2]], [s, 0, 0], [0, 0, s], col, mode);
  function ribbon(a, b, w, col, add) { if (PASS !== 0) return; const d = sub(b, a), m = vlerp(a, b, 0.5), side = norm(cross(d, sub(m, CAM.p))); qput(add, m, mul(side, w), mul(d, 0.5), col, 1); }
  function partDraw() {
    for (const p of PT) {
      const k = p.age / p.life, s = p.s0 + (p.s1 - p.s0) * k, a = (p.c[3] == null ? 1 : p.c[3]) * Math.min(1, k * 8) * Math.min(1, (1 - k) * 3.3), col = [p.c[0], p.c[1], p.c[2], a], c = [p.x, p.y, p.z];
      const sp2 = p.vx * p.vx + p.vy * p.vy + p.vz * p.vz;
      if (p.k === 0 && sp2 > 36) { const v = [p.vx, p.vy, p.vz]; ribbon(madd(c, v, -0.025), madd(c, v, 0.025), s, col, true); continue; }
      bill(c, s, col, KMODE[p.k] || 0, KADD[p.k] === 1);
    }
  }
  // glowing (added) effects also add to the glow pass; see-through ones hide a little of what's behind them
  function quadFlush() {
    const P = PQ.a; gl.useProgram(PQ.p); gl.uniformMatrix4fv(PQ.u.uVP, false, VP);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, qidx); gl.depthMask(false); gl.enable(gl.BLEND); gl.disable(gl.CULL_FACE);
    for (const add of [false, true]) {
      const n = add ? QB.nd : QB.na; if (!n) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, qbuf); gl.bufferData(gl.ARRAY_BUFFER, (add ? QB.d : QB.a).subarray(0, n * 4 * QF), gl.DYNAMIC_DRAW);
      attribs([[P.aP, 3, QF * 4, 0], [P.aU, 2, QF * 4, 12], [P.aC, 4, QF * 4, 20], [P.aM, 1, QF * 4, 36]]);
      if (add) { gl.blendColor(0, 0, 0, 0.5); gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.CONSTANT_ALPHA, gl.ONE); }
      else gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, 0);
    }
    QB.na = QB.nd = 0; gl.depthMask(true); gl.disable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  // ---------- drawing meshes ----------
  const U = () => PW.u;
  let curMut = -1;
  function setLook(o) { // per-draw material uniforms (only the colour pass has materials)
    if (PASS !== 0) return;
    const u = PW.u; o = o || NOO;
    gl.uniform3fv(u.uTint, o.tint || [1, 1, 1]); gl.uniform1f(u.uEm, o.em || 0); gl.uniform1f(u.uA, o.a == null ? 1 : o.a);
    const m = o.mut || 0; if (m !== curMut) { gl.uniform1f(u.uMut, m); curMut = m; } gl.uniform3fv(u.uRim, o.rim || [0, 0, 0]);
  }
  function drawM(mesh, M_) {
    if (!mesh || !mesh.b || !mesh.n) return;
    gl.uniformMatrix4fv((PASS === 1 ? PD : PASS === 2 ? PO : PW).u.uM, false, M_ || MM); bindMesh(mesh); gl.drawArrays(gl.TRIANGLES, 0, mesh.n);
  }
  const IDM = (() => { const m = m4(); m[0] = m[5] = m[10] = m[15] = 1; return m; })();
  // a local point of a frame (r: mesh +x, u: up, f: forward) at scale s
  const loc3 = (p, r, u, f, l, s) => [p[0] + (r[0] * l[0] + u[0] * l[1] + f[0] * l[2]) * s, p[1] + (r[1] * l[0] + u[1] * l[1] + f[1] * l[2]) * s, p[2] + (r[2] * l[0] + u[2] * l[1] + f[2] * l[2]) * s];
  const MUTI = { gold: 1, diamond: 2, rainbow: 3 };
  function lookMat(look, t) {
    const sp = SP[look.sp] || SP.brown, rr = RI[sp.r], col = hexc(rr.col), pulse = 0.65 + 0.35 * Math.sin(t * 3 + (rr.i * 1.7));
    const o = { mut: MUTI[look.mut] || 0, tint: [1, 1, 1], em: 0, rim: cmul(col, rr.glow * 0.45 * pulse + (look.evo || 0) * 0.12) };
    if (look.wx === 'rain') o.tint = [0.82, 0.92, 1.1]; else if (look.wx === 'snow') o.tint = [1.12, 1.14, 1.2]; else if (look.wx === 'thunder') { o.em = 0.12 + (Math.sin(t * 23) > 0.6 ? 0.35 : 0); o.tint = [1.08, 1.05, 0.85]; }
    if (rr.i === 9) o.rim = cmul(hue3((t * 0.25) % 1), 0.9 * pulse);
    return o;
  }
  const EVOM = [];
  function evoMesh(stage) { if (EVOM[stage]) return EVOM[stage]; const B = new MB(), n = 1 + stage * 2, col = [[1, 1, 1], [0.7, 0.9, 1], [1, 0.85, 0.3], [1, 0.5, 0.95]][stage]; for (let i = 0; i < n; i++) { const a = i / n * TAU; sph(B, [Math.cos(a) * 0.22, 0.78 + (i % 2) * 0.04, 0.22 + Math.sin(a) * 0.22], 0.04, 0, col, { e: 1.4, flat: true }); } return (EVOM[stage] = upload(B.build())); }
  // a rat with walking, breathing, looking and struggling; o: { ph, mv, held, t, fx }
  function drawRat(look, p, h, s, o) {
    o = o || NOO; const t = o.t == null ? S.rt : o.t, sp = SP[look.sp] || SP.brown, RM = ratMeshes(sp.id), sc = s * (1 + (look.evo || 0) * 0.08);
    const f = fwdOf(h), u = UP, r = cross(u, f), run = clamp((o.mv || 0) / 3, 0, 1), ph = o.ph || 0, held = !!o.held;
    const shake = held ? Math.sin(t * 38) * 0.05 : 0, bob = Math.abs(Math.sin(ph)) * 0.05 * run + Math.sin(t * 2.2 + ph) * 0.006;
    const P = [p[0] + r[0] * shake * sc, p[1] + bob * sc, p[2] + r[2] * shake * sc];
    const mat = lookMat(look, t); setLook(mat);
    model(MM, P, f, u, sc); drawM(RM.body);
    const turn = held ? Math.sin(t * 22) * 0.55 : Math.sin(t * 0.8 + ph * 0.07) * 0.32 * (1 - run), hf = rotA(f, u, turn), hp = loc3(P, r, u, f, HEADP, sc);
    model(MM, hp, hf, u, sc); drawM(RM.head); if (PASS !== 2) drawM(RM.face);
    if (!o.lite) for (let i = 0; i < 4; i++) { const ft = FEET[i], q = ph * 2 + (i === 0 || i === 3 ? 0 : Math.PI), lift = Math.max(0, Math.sin(q)) * 0.07 * run, sw = Math.cos(q) * 0.06 * run; model(MM, loc3(P, r, u, f, [ft[0], ft[1] + lift, ft[2] + sw], sc), f, u, sc); drawM(RM.foot); }
    const sway = Math.sin(t * 3.1 + ph * 0.3) * 0.35 + (held ? Math.sin(t * 27) * 0.6 : 0) + Math.sin(ph * 2) * 0.2 * run;
    model(MM, loc3(P, r, u, f, TAILP, sc), rotA(f, u, sway), u, sc); drawM(RM.tail);
    // cosmetics, the disco ball and evolution stars keep their own colours
    const plain = { tint: [1, 1, 1], em: 0, mut: 0 };
    let set = false;
    if (look.cos) for (const slot in look.cos) { const cm = cosMesh(look.cos[slot]); if (!cm) continue; if (!set) { setLook(plain); set = true; } if (cm.head) { model(MM, hp, hf, u, sc); drawM(cm.head); } if (cm.body) { model(MM, P, f, u, sc); drawM(cm.body); } }
    if (look.disco) { if (!set) { setLook(plain); set = true; } model(MM, hp, hf, u, sc); setLook({ em: 0.2 + 0.2 * Math.sin(t * 9) }); drawM(discoMesh()); }
    if (look.evo && PASS !== 2) { setLook({ em: 0.4 + 0.3 * Math.sin(t * 4) }); model(MM, hp, rotA(hf, u, t * 1.2), u, sc); drawM(evoMesh(look.evo)); }
    if (o.fx && PASS === 0) ratLookFx(look, P, f, sc, o);
    return { head: hp, body: [P[0], P[1] + 0.32 * sc, P[2]] };
  }
  // cosmetic trails, particles and auras
  function ratLookFx(look, P, f, sc, o) {
    const dt = S.dt || 0.016, mv = o.mv || 0, lv = look.lvl || 0;
    // level milestones: sparkles from 25, a golden ring from 50, a rainbow ring at 100
    if (lv >= 25 && Math.random() < dt * (lv >= 75 ? 9 : 4)) emit([P[0] + rnd(-0.4, 0.4) * sc, P[1] + rnd(0.2, 0.8) * sc, P[2] + rnd(-0.4, 0.4) * sc], [0, rnd(0.3, 0.9), 0], 0.9, 0.09, 0, (lv >= 100 ? hue3(Math.random()) : lv >= 75 ? [0.75, 0.95, 1] : [1, 0.88, 0.4]).concat([1]), 0.5, 0, 6);
    if (lv >= 50) decal(P, 0.62 * sc + 0.04 * Math.sin(S.rt * 3), (lv >= 100 ? hue3((S.rt * 0.3) % 1) : lv >= 75 ? [0.7, 0.95, 1] : [1, 0.82, 0.3]).concat([0.45]), 3, true);
    const c = look.cos; if (!c) return;
    const tr = c.trail && COS[c.trail]; if (tr && mv > 0.4 && Math.random() < dt * 30) { const col = tr.id === 'rainbowtrail' ? hue3((S.rt * 0.7) % 1) : hexc(tr.col); emit(madd(P, f, -0.4 * sc), [rnd(-0.3, 0.3), rnd(0.2, 0.8), rnd(-0.3, 0.3)], tr.id === 'bubbletrail' ? 1.4 : 0.8, tr.id === 'firetrail' ? 0.22 : 0.14, 0.03, col.concat([1]), 0.6, tr.id === 'firetrail' ? -1.5 : 0, tr.id === 'bubbletrail' ? 3 : 2); }
    const fx = c.fx && COS[c.fx]; if (fx && Math.random() < dt * 5) { const col = fx.id === 'discolights' ? hue3(Math.random()) : hexc(fx.col); emit([P[0] + rnd(-0.5, 0.5) * sc, P[1] + 0.9 * sc, P[2] + rnd(-0.5, 0.5) * sc], [rnd(-0.2, 0.2), fx.id === 'snowflakes' ? -0.3 : 0.6, rnd(-0.2, 0.2)], 1.6, 0.16, 0.1, col.concat([1]), 0.3, 0, fx.id === 'stars' ? 6 : 2); }
    const au = c.aura && COS[c.aura]; if (au) { const col = hexc(au.col); decal(P, 0.8 * sc, col.concat([0.55 + 0.25 * Math.sin(S.rt * 4)]), 3, true); if (Math.random() < dt * 12) { const a = Math.random() * TAU; emit([P[0] + Math.cos(a) * 0.55 * sc, P[1] + 0.1, P[2] + Math.sin(a) * 0.55 * sc], [0, rnd(0.6, 1.4), 0], 1, au.id === 'shadowaura' ? 0.3 : 0.14, 0.02, col.concat([au.id === 'shadowaura' ? 0.6 : 1]), 0.2, 0, au.id === 'shadowaura' ? 1 : 0); } }
  }
  // casting, from the pose of the rod arm (ang), the rod's angle above forward (th) and a lean of the body:
  // wind the rod back over the shoulder, flick it forward, hold it out, pump while reeling and pull back at the end
  function castPose(pl, a, t) {
    if (pl.fr === S.frame) return; pl.fr = S.frame;
    const on = a === 4 || a === 5;
    if (on && !pl.wasOn) pl.ct0 = t;
    if (pl.wasA === 5 && a !== 5) { pl.yank = t; pl.yFrom = [pl.ang, pl.th, pl.lean, pl.side || 0]; }
    pl.wasOn = on; pl.wasA = a;
    const ct = t - (pl.ct0 == null ? -9 : pl.ct0), yk = t - (pl.yank == null ? -9 : pl.yank);
    let ang = 0.35, th = 1.04, lean = 0, bend = 0, side = 0, k; // side: the rod arm swings out to the right on the wind-up
    if (on && ct < 0.5) {
      if (ct < 0.2) { k = smooth(ct / 0.2); ang = lerp(0.35, 2.9, k); th = lerp(1.04, 2.45, k); lean = -0.13 * k; side = 0.6 * k; }
      else if (ct < 0.33) { k = easeOut((ct - 0.2) / 0.13); ang = lerp(2.9, 1.3, k); th = lerp(2.45, 0.32, k); lean = lerp(-0.13, 0.13, k); side = lerp(0.6, 0.12, k); }
      else { k = smooth((ct - 0.33) / 0.17); ang = lerp(1.3, 1.2, k); th = lerp(0.32, 0.62, k); lean = lerp(0.13, 0.02, k); side = lerp(0.12, 0.06, k); }
    } else if (a === 5) { const w = Math.sin(t * 9); ang = 1.18 + w * 0.07; th = 0.6 + w * 0.05; lean = -0.07; bend = 0.3 + 0.12 * w; side = 0.06; }
    else if (a === 4) { ang = 1.2; th = 0.62; side = 0.06; }
    if (yk < 0.5 && pl.yFrom) { k = smooth(yk / 0.5); const up = Math.sin(Math.min(1, yk / 0.5) * Math.PI); ang = lerp(pl.yFrom[0], ang, k) + 0.9 * up; th = lerp(pl.yFrom[1], th, k) + 0.85 * up; lean = lerp(pl.yFrom[2], lean, k) - 0.14 * up; side = lerp(pl.yFrom[3], side, k) + 0.25 * up; }
    const keep = !on && yk >= 0.5 && pl.ang != null, e = 1 - Math.exp(-(S.dt || 0.016) * 9), L = (q, v) => keep ? lerp(q, v, e) : v;
    pl.ang = L(pl.ang, ang); pl.th = L(pl.th, th); pl.lean = L(pl.lean, lean); pl.side = L(pl.side || 0, side); pl.bend = bend;
  }
  // players: body, head, arms and legs, with the rod in the right hand
  function drawPlayer(pl, isMe) {
    const AV = avatarMeshes(pl.c || '#ff9f1a'), p = pl.p, f0 = fwdOf(pl.h), u0 = UP, r = cross(u0, f0), a = pl.a | 0, t = S.rt;
    castPose(pl, a, t);
    const w = pl.walk * (a === 2 ? 1.1 : 1.6), sw = (a === 1 || a === 2) ? Math.sin(w) * (a === 2 ? 0.9 : 0.6) : a === 3 ? 0.5 : 0;
    setLook({});
    const bodyY = (a === 1 || a === 2) ? Math.abs(Math.cos(w)) * 0.06 : Math.sin(t * 2) * 0.01;
    const P = [p[0], p[1] + bodyY, p[2]];
    // the body leans from the hips while casting
    const u = rotA(u0, r, pl.lean), f = rotA(f0, r, pl.lean), B = madd(madd(P, u0, 0.64), u, -0.64);
    model(MM, B, f, u, 1); drawM(AV.body);
    model(MM, loc3(B, r, u, f, [0, 1.26, 0], 1), rotA(f, u, a >= 4 ? 0 : Math.sin(t * 0.6) * 0.15), u, 1); drawM(AV.head); if (PASS !== 2) drawM(AV.face);
    for (const sd of [1, -1]) { const ang = sw * sd; model(MM, loc3(P, r, u0, f0, [sd * 0.13, 0.64, 0], 1), norm(madd(mul(f0, Math.cos(ang)), u0, Math.sin(ang))), norm(madd(mul(u0, Math.cos(ang)), f0, -Math.sin(ang))), 1); drawM(AV.leg); }
    // arms: the right arm holds the rod (mesh +x is the left side)
    for (const sd of [1, -1]) {
      const ang = sd < 0 ? pl.ang : -sw * 0.8, sx = sd < 0 ? pl.side : 0;
      const sh = loc3(B, r, u, f, [sd * 0.36, 1.16, 0], 1); let af = norm(madd(mul(f, Math.cos(ang)), u, Math.sin(ang))), au = norm(madd(mul(u, Math.cos(ang)), f, -Math.sin(ang)));
      if (sx) { af = rotA(af, f, sx); au = rotA(au, f, sx); }
      model(MM, sh, af, au, 1); drawM(AV.arm);
      if (sd < 0) { pl.hand = madd(sh, au, -0.46); let rd = norm(madd(mul(f, Math.cos(pl.th)), u, Math.sin(pl.th))); if (sx) rd = rotA(rd, f, sx * 1.2); pl.rodDir = rd; }
    }
    if (S.aid !== 'lobby' && (pl.rod || isMe)) drawRod(pl, f, t, a === 5);
    else pl.tip = null;
  }
  // the rod: the bottom half in the hand, the reel's crank turning while reeling, the top half bending towards whatever is on the line
  function drawRod(pl, f, t, reeling) {
    const RM = rodMesh(pl.rod || 'wood'), rd = pl.rodDir, rf = Math.abs(rd[1]) > 0.95 ? f : norm(cross(rd, cross(f, rd))), rx = cross(rd, rf), base = madd(pl.hand, rd, -0.4);
    setLook({}); model(MM, base, rf, rd, 1); drawM(RM.lo);
    const ph = reeling ? t * 16 : 0.6, cy = madd(mul(rd, Math.cos(ph)), rf, Math.sin(ph)), cc = madd(madd(madd(base, rd, 0.44), rf, 0.085), rx, 0.034);
    model(MM, cc, cross(rx, cy), cy, 1); drawM(RM.crank);
    const joint = madd(base, rd, 0.92); let rd2 = rd;
    if (pl.lineTo && pl.bend > 0) { const to = sub(pl.lineTo, joint); if (len(to) > 0.3) rd2 = norm(vlerp(rd, norm(to), pl.bend)); }
    const rf2 = Math.abs(rd2[1]) > 0.95 ? f : norm(cross(rd2, cross(f, rd2)));
    model(MM, joint, rf2, rd2, 1); drawM(RM.hi); pl.tip = madd(joint, rd2, 0.76);
  }
  // a fishing line from the rod tip, sagging a little (sag 0 hangs straight, sparks fizz where it meets a hooked rat)
  function drawLine(a, b, t, sag, sparks) {
    const n = 10; let prev = a; const sg = (sag == null ? 1 : sag) * Math.min(1.2, dist(a, b) * 0.08 + 0.05) * (0.6 + 0.4 * Math.sin(t * 6));
    for (let i = 1; i <= n; i++) { const k = i / n, p = vlerp(a, b, k); p[1] -= Math.sin(k * Math.PI) * sg; ribbon(prev, p, 0.018, [1, 1, 1, 0.95], false); prev = p; }
    if (sparks && Math.random() < 0.5) emit(b, [rnd(-1, 1), rnd(1, 2), rnd(-1, 1)], 0.3, 0.07, 0, [1, 1, 0.8, 1], 2, 5, 6);
  }
  // fishing lines and bobbers: the bobber flies out on the flick, lands on the rat with a pop, the line tightens while reeling
  // and comes back slack after a miss. Other players' lines fly out the same way; a caught rat keeps its line on the way to the bag.
  const BOBS = [];
  function castLines(t) {
    BOBS.length = 0; const tip = S.you.tip; S.myLineTo = null;
    const c = S.castFx;
    if (c && c.fail == null && !c.ok && t - c.t0 > 3) failCast();
    if (c && tip) {
      const r = S.frats.get(c.r); if (r && r.draw) c.end = r.draw.body.slice(); else if (c.landed && c.fail == null && !S.catching) failCast();
      const rel = c.t0 + 0.27;
      if (c.fail != null) {
        const k = clamp((t - c.fail) / 0.45, 0, 1);
        if (k >= 1) S.castFx = null;
        else { const from = c.failFrom || (c.failFrom = (c.bob || c.end || tip).slice()), q = vlerp(from, tip, easeIn(k)); q[1] += Math.sin(k * Math.PI) * 0.5 - (1 - k) * 0.4; drawLine(tip, q, t, 1.4); BOBS.push(q); }
      } else if (t < rel) { const q = madd(tip, UP, -0.32); drawLine(tip, q, t, 0); BOBS.push(q); }
      else if (c.end) {
        const L = dist(tip, c.end), dur = c.dur || (c.dur = 0.18 + L * 0.016), k = clamp((t - rel) / dur, 0, 1);
        if (k < 1) { const q = vlerp(tip, c.end, k); q[1] += Math.sin(k * Math.PI) * (0.4 + L * 0.08); c.bob = q; drawLine(tip, q, t, 0.2); BOBS.push(q); S.myLineTo = q; }
        else { if (!c.landed) { c.landed = t; plop(c.end); if (c.ok) SFX.hook(); } c.bob = c.end; drawLine(tip, c.end, t, S.catching ? 0.25 : 0.6, !!S.catching); S.myLineTo = c.end; }
      }
    }
    for (const r of S.frats.values()) if (r.st === 'h' && r.by && r.draw && (!S.me || r.by !== S.me.id)) {
      const o = S.others.get(r.by); if (!o || !o.tip) continue;
      const k = clamp((t - (r.hk0 || 0)) / 0.35, 0, 1); let q = r.draw.body;
      if (k < 1) { q = vlerp(o.tip, q, k); q[1] += Math.sin(k * Math.PI) * (0.4 + dist(o.tip, r.draw.body) * 0.08); BOBS.push(q); } else if (!r.popped) { r.popped = 1; plop(q); }
      drawLine(o.tip, q, t, k < 1 ? 0.2 : 0.3, k >= 1); o.lineTo = q;
    }
    for (const f of S.fly) if (f.line && f.p && f.t < 0.55) { const ft = f.line === 'me' ? tip : (S.others.get(f.line) || NOO).tip; if (ft) drawLine(ft, f.p, t, 0.15); }
    if (BOBS.length) { setLook({}); const bm = bobberMesh(); for (const q of BOBS) { model(MM, q, [0, 0, 1], UP, 1); drawM(bm); } }
  }
  function plop(p) { // the bobber lands: a ring and a few sparks
    emit(p, [0, 0, 0], 0.35, 0.15, 1.1, [1, 1, 1, 0.9], 0, 0, 3);
    for (let i = 0; i < 10; i++) emit(p, [rnd(-2, 2), rnd(1.5, 3.5), rnd(-2, 2)], 0.5, 0.08, 0, [1, 1, 0.85, 1], 1.2, 7, 6);
  }

  // ---------- pets: equipped rats follow their owner ----------
  const PETS = new Map(); // owner id -> [{p, h, ph, mv}]
  function petsFor(id, owner, looks, dt) {
    let arr = PETS.get(id); if (!arr) PETS.set(id, arr = []);
    if (PASS !== 0) { for (let i = 0; i < arr.length && i < looks.length; i++) { const pt = arr[i]; drawRat(looks[i], pt.p, pt.h, 0.62, { ph: pt.ph, mv: pt.mv }); } return; }
    while (arr.length > looks.length) arr.pop();
    const f = fwdOf(owner.h || 0), r = rightOf(owner.h || 0);
    looks.forEach((look, i) => {
      let pt = arr[i]; const target = madd(madd(owner.p, f, -1.3 - Math.floor(i / 2) * 0.9), r, (i % 2 ? 0.75 : -0.75));
      if (!pt) { pt = arr[i] = { p: target.slice(), h: owner.h || 0, ph: Math.random() * 6, mv: 0 }; }
      const d = sub(target, pt.p), dl = Math.hypot(d[0], d[2]), sp = dl > 6 ? dl * 4 : dl > 0.5 ? Math.min(11, dl * 3) : 0;
      if (dl > 18) pt.p = target.slice(); else if (sp > 0) { pt.p[0] += d[0] / dl * sp * dt; pt.p[2] += d[2] / dl * sp * dt; pt.h = pt.h + wrapA(Math.atan2(d[0], d[2]) - pt.h) * (1 - Math.exp(-dt * 10)); }
      pt.mv = damp(pt.mv, sp, 8, dt); pt.ph += dt * (pt.mv > 0.3 ? 6 + pt.mv * 2 : 1); pt.p[1] = S.A ? S.A.height(pt.p[0], pt.p[2]) : owner.p[1];
      drawRat(look, pt.p, pt.h, 0.62, { ph: pt.ph, mv: pt.mv, fx: true }); decal(pt.p, 0.36, [0, 0, 0, 0.3 * GFX.blob], 0, false);
    });
  }

  // ---------- portraits: rats and eggs drawn once into pictures for the menus ----------
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const SNAP = { R: 360, O: 240, cache: new Map(), q: [], pend: new Set(), fb: null, cv: doc.createElement('canvas'), out: doc.createElement('canvas') };
  SNAP.cv.width = SNAP.cv.height = SNAP.R; SNAP.out.width = SNAP.out.height = SNAP.O;
  function snapInit() {
    SNAP.fb = gl.createFramebuffer(); SNAP.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, SNAP.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SNAP.R, SNAP.R, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    SNAP.rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, SNAP.rb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, SNAP.R, SNAP.R);
    gl.bindFramebuffer(gl.FRAMEBUFFER, SNAP.fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, SNAP.tex, 0); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, SNAP.rb);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  const cosKey = c => c ? Object.keys(c).sort().map(k => c[k]).join(',') : '';
  const lookKey = l => 'r:' + l.sp + '|' + (l.mut || '') + '|' + (l.wx || '') + '|' + (l.disco ? 1 : 0) + '|' + (l.evo || 0) + '|' + cosKey(l.cos);
  function ratImg(look, extra) { const k = lookKey(look); return '<img data-pk="' + esc(k) + '" src="' + (SNAP.cache.get(k) || queueSnap(k, { kind: 'rat', look })) + '" alt=""' + (extra || '') + '>'; }
  function eggImg(id) { const k = 'e:' + id; return '<img data-pk="' + k + '" src="' + (SNAP.cache.get(k) || queueSnap(k, { kind: 'egg', id })) + '" alt="">'; }
  function queueSnap(k, job) { if (!SNAP.pend.has(k)) { SNAP.pend.add(k); job.k = k; SNAP.q.push(job); } return BLANK; }
  function snapRender(job) {
    setPass(0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, SNAP.fb); gl.viewport(0, 0, SNAP.R, SNAP.R); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.colorMask(true, true, true, true); gl.useProgram(PW.p);
    const isEgg = job.kind === 'egg', look = job.look, eye = isEgg ? [1.3, 1.25, 2.6] : [1.3, 0.98, 1.56], at = isEgg ? [0, 0.5, 0] : [0, 0.34, 0];
    const big = !isEgg && ((look.cos && (look.cos.back || look.cos.head)) || (SP[look.sp] && (SP[look.sp].parts || []).some(x => /wings|halo|crown|cape|fluff/.test(x))));
    const fov = (isEgg ? 30 : big ? 34 : 30) * DEG, V = m4(), Pm = m4(), Mx = m4();
    lookAt(V, eye, at, UP); persp(Pm, fov, 1, 0.1, 50); mmul(Mx, Pm, V);
    const u = PW.u; gl.uniformMatrix4fv(u.uVP, false, Mx); gl.uniform3fv(u.uCam, eye); gl.uniform3fv(u.uSun, norm([0.5, 0.9, 0.7])); gl.uniform3fv(u.uSunC, [1, 0.97, 0.9]); gl.uniform3fv(u.uSky, [0.62, 0.62, 0.72]); gl.uniform3fv(u.uGnd, [0.4, 0.36, 0.34]);
    gl.uniform3fv(u.uFog, [0, 0, 0]); gl.uniform1f(u.uFogD, 0); gl.uniform1f(u.uT, 2.5); gl.uniform3fv(u.uFlash, [0, 0, 0]); gl.uniform4fv(u.uLC, new Float32Array(16)); gl.uniform4fv(u.uLP, new Float32Array([0, 9, 0, 1, 0, 9, 0, 1, 0, 9, 0, 1, 0, 9, 0, 1]));
    gl.uniform1f(u.uGlow, 0); gl.uniform1f(u.uExpo, 1); gl.uniform3fv(u.uSMI, [1, 1, 0]); gl.uniform1f(u.uSMO, 0); gl.uniformMatrix4fv(u.uSVP, false, IDM); gl.uniform4fv(u.uHMI, [0, 0, 1, 0]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ATLAS.tex); gl.uniform1i(u.uTex, 0);
    if (isEgg) { setLook({}); model(MM, [0, 0, 0], [0, 0, 1], UP, 1); drawM(eggMesh(job.id)); }
    else drawRat(look, [0, 0, 0], 0.55, 1, { t: 2.5, ph: 0, mv: 0 });
    const px = new Uint8Array(SNAP.R * SNAP.R * 4); gl.readPixels(0, 0, SNAP.R, SNAP.R, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); curMut = -1;
    const cx = SNAP.cv.getContext('2d'), id = cx.createImageData(SNAP.R, SNAP.R), row = SNAP.R * 4;
    for (let y = 0; y < SNAP.R; y++) id.data.set(px.subarray((SNAP.R - 1 - y) * row, (SNAP.R - y) * row), y * row);
    cx.putImageData(id, 0, 0);
    const o = SNAP.out.getContext('2d'); o.clearRect(0, 0, SNAP.O, SNAP.O); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = 'high'; o.drawImage(SNAP.cv, 0, 0, SNAP.O, SNAP.O);
    return SNAP.out.toDataURL('image/png');
  }
  function snapJobs(n) {
    let did = 0;
    while (SNAP.q.length && did < n) {
      const job = SNAP.q.shift(); let url = BLANK; try { url = snapRender(job); } catch (e) { if (win.console) console.warn('portrait', e); }
      SNAP.cache.set(job.k, url); SNAP.pend.delete(job.k); did++;
      for (const im of ui.querySelectorAll('img[data-pk="' + job.k + '"]')) im.src = url;
      if (SNAP.cache.size > 900) { const first = SNAP.cache.keys().next().value; SNAP.cache.delete(first); }
    }
    if (did) gl.viewport(0, 0, cv.width, cv.height);
  }

  // ---------- the lobby's live boards (leaderboard and event board) ----------
  let boardT = 0;
  function drawBoards() {
    const c = BOARD.cv.getContext('2d'); c.clearRect(0, 0, 1024, 512);
    const font = (s, w) => (w || 700) + ' ' + s + 'px "Fredoka","Arial Rounded MT Bold","Arial Black",sans-serif';
    // leaderboard: richest players
    c.fillStyle = '#2b1d3a'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#ffd23a'; c.fillRect(12, 12, 488, 64);
    c.fillStyle = '#2b1d3a'; c.font = font(38); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('RICHEST CATCHERS', 256, 46, 470);
    const lb = S.lbData.money, rows = lb ? lb.l.slice(0, 8) : [];
    if (!rows.length) { c.fillStyle = '#fff'; c.font = font(26, 600); c.fillText(lb ? 'No players yet' : 'Loading…', 256, 250); }
    rows.forEach((r, i) => {
      const y = 96 + i * 50; c.fillStyle = i % 2 ? '#3a2c4f' : '#45365c'; c.fillRect(14, y, 484, 46);
      c.fillStyle = ['#ffd23a', '#dfe6ee', '#e0813a'][i] || '#fff'; c.font = font(26); c.textAlign = 'left'; c.fillText('#' + r.rank, 24, y + 24);
      c.fillStyle = r.c || '#ff9f1a'; c.beginPath(); c.arc(104, y + 23, 17, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.font = font(20); c.textAlign = 'center'; c.fillText((r.n || '?')[0].toUpperCase(), 104, y + 24);
      c.textAlign = 'left'; c.font = font(24, 600); c.fillText(r.n, 132, y + 24, 210); c.textAlign = 'right'; c.fillStyle = '#7dff8a'; c.font = font(24); c.fillText(fmtMoney(r.v), 488, y + 24, 140);
    });
    // event board
    c.fillStyle = '#fff8ec'; c.fillRect(512, 0, 512, 512); c.fillStyle = '#ff9f1a'; c.fillRect(524, 12, 488, 64);
    c.fillStyle = '#fff'; c.font = font(38); c.textAlign = 'center'; c.fillText('EVENT BOARD', 768, 46);
    const act = (S.events.active || []).slice(), y0 = 100; let y = y0;
    if (S.events.inv) { c.fillStyle = '#ff3a5c'; c.fillRect(526, y, 484, 62); c.fillStyle = '#fff'; c.font = font(28); c.textAlign = 'left'; c.fillText('RAT INVASION!', 540, y + 22); c.font = font(20, 600); c.fillText('Ends in ' + fmtDur((S.events.inv.ends - srvNow()) / 1000), 540, y + 47); y += 72; }
    for (const e of act) { const d = EVENTS[e.id]; if (!d) continue; c.fillStyle = d.col; c.fillRect(526, y, 484, 62); c.fillStyle = '#2b1d3a'; c.font = font(28); c.textAlign = 'left'; c.fillText(d.n, 540, y + 22, 300); c.font = font(19, 600); c.fillText(d.d, 540, y + 47, 460); c.textAlign = 'right'; c.font = font(24); c.fillText(fmtDur((e.ends - srvNow()) / 1000), 998, y + 22); y += 70; if (y > 440) break; }
    if (y === y0) { c.fillStyle = '#6a5a7a'; c.textAlign = 'center'; c.font = font(26, 600); c.fillText('No event right now.', 768, 200); c.font = font(20, 500); c.fillText('Events start by themselves every', 768, 250); c.fillText('20 to 40 minutes, or when the owner', 768, 278); c.fillText('starts one. Every room gets them.', 768, 306); }
    BOARD.dirty = true;
  }
  function boardMeshes(A) {
    if (A.boardMesh || !A.anim.boards) return A.boardMesh || [];
    A.boardMesh = A.anim.boards.map(b => { const mb = new MB(); board(mb, b.c, b.r, UP, b.hw, b.hh, [1, 1, 1], b.uv, { e: 0.35 }); return upload(mb.build()); });
    return A.boardMesh;
  }

  // ---------- the frame ----------
  const LPA = new Float32Array(16), LCA = new Float32Array(16);
  function pickLights(t) {
    const A = S.A, L = []; const me = S.you.p;
    for (const l of A.anim.lights) { const d = dist(l.p, me); if (d < l.r + 30) L.push([d, l.p, l.c, l.r, l.k * (A.id === 'lava' ? 0.85 + 0.15 * Math.sin(t * 7 + l.p[0]) : 1)]); }
    if (eventOn('dj')) for (let i = 0; i < 3; i++) { const a = t * 0.9 + i * TAU / 3; L.push([0, [me[0] + Math.cos(a) * 7, me[1] + 5, me[2] + Math.sin(a) * 7], hue3((t * 0.2 + i / 3) % 1), 10, 0.4]); }
    for (const c of S.chests.values()) { const d = Math.hypot(c.x - me[0], c.z - me[2]); if (d < 30) L.push([d, [c.x, c.y + 1.2, c.z], [1, 0.8, 0.3], 7, 0.9]); }
    L.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < 4; i++) { const l = L[i]; if (l) { LPA.set([l[1][0], l[1][1], l[1][2], l[3]], i * 4); LCA.set([l[2][0], l[2][1], l[2][2], l[4]], i * 4); } else { LPA.set([0, -99, 0, 1], i * 4); LCA.set([0, 0, 0, 0], i * 4); } }
  }
  // the sun's square view used for shadows, kept on whole texels so edges don't crawl as you walk
  function shadowMatrix(sun, c, hs, size) {
    const Sd = norm(sun), R = Math.abs(Sd[1]) > 0.995 ? [1, 0, 0] : norm(cross(UP, Sd)), Uv = cross(Sd, R), tx = 2 * hs / size, D = 45;
    const cx = Math.round(dot(c, R) / tx) * tx, cy = Math.round(dot(c, Uv) / tx) * tx, cz = dot(c, Sd);
    SVP.set([R[0] / hs, Uv[0] / hs, -Sd[0] / D, 0, R[1] / hs, Uv[1] / hs, -Sd[1] / D, 0, R[2] / hs, Uv[2] / hs, -Sd[2] / D, 0, -cx / hs, -cy / hs, cz / D, 1]);
    for (let i = 0; i < 16; i++) SVPB[i] = SVP[i] * 0.5; SVPB[12] += 0.5; SVPB[13] += 0.5; SVPB[14] += 0.5; SVPB[15] = 1;
  }
  // moving props: windmill sails, floating crystals, the bank coin, eggs and the trophy
  function drawProps(A, t, lim) {
    for (const pr of A.anim.props) {
      if (lim && (pr.far || Math.hypot(pr.p[0] - lim[0], pr.p[2] - lim[2]) > lim[3] + 6)) continue;
      const p = pr.p.slice(); let f = fwdOf(pr.h || 0), up = UP;
      if (pr.kind === 'spin') { up = rotA(UP, fwdOf(pr.h), t * pr.sp); f = fwdOf(pr.h); }
      else if (pr.kind === 'float') { p[1] += Math.sin(t * pr.sp + pr.ph) * 0.5; f = fwdOf(pr.h + t * 0.3); }
      else if (pr.kind === 'coin') { p[1] += Math.sin(t * 2) * 0.15; f = UP; up = [Math.sin(t * 1.5), 0, Math.cos(t * 1.5)]; }
      else if (pr.kind === 'spinY') f = fwdOf(t * pr.sp);
      else if (pr.kind === 'egg') { p[1] += Math.abs(Math.sin(t * 2 + pr.ph)) * 0.12; f = fwdOf(Math.sin(t * 1.5 + pr.ph) * 0.4); }
      if (!lim && !sphereVisible(FRU, p, (pr.mesh.r || 2) * (pr.s || 1) + 2) && !pr.far) continue;
      model(MM, p, f, up, pr.s || 1); drawM(pr.mesh);
    }
  }
  // everything alive: the statue, showcases, chests, rats, players and pets. Drawn by the colour pass, and again for shadows and outlines (lim = [x, y, z, radius]).
  function drawActors(t, A, lim) {
    const near = (x, z, r) => !lim || Math.hypot(x - lim[0], z - lim[2]) < lim[3] + (r || 0), seen = (p, r) => PASS === 1 || sphereVisible(FRU, p, r);
    if (A.id === 'lobby') {
      if (near(0, 0, 5)) { drawRat({ sp: 'brown', mut: 'gold' }, [0, 2.85, 0], t * 0.25, 2.3, { t: 0, ph: 0, mv: 0 }); setLook({}); }
      drawShowcases(t, lim);
    }
    // chests
    if (S.chests.size) { const CH = chestMeshes(); for (const c of S.chests.values()) { if (!near(c.x, c.z, 2)) continue; const m = CH[c.k] || CH[0], age = S.rt - c.born, pop = Math.min(1, age * 2.5), s = 1.1 * easeOut(pop); const near2 = S.near && S.near.kind === 'chest' && S.near.c === c; setLook({ em: near2 ? 0.25 : 0.05 }); model(MM, [c.x, c.y, c.z], fwdOf(c.x * 0.1), UP, s); drawM(m.body); const lid = loc3([c.x, c.y, c.z], cross(UP, fwdOf(c.x * 0.1)), UP, fwdOf(c.x * 0.1), [0, 0.5 + (near2 ? 0.08 + Math.sin(t * 8) * 0.03 : 0), 0], s); model(MM, lid, fwdOf(c.x * 0.1), UP, s); drawM(m.lid); if (PASS === 0) decal([c.x, c.y, c.z], 1.3, [1, 0.8, 0.3, 0.35 + 0.15 * Math.sin(t * 3)], 0, true); } }
    // field rats
    for (const r of S.frats.values()) {
      if (!near(r.x, r.z, 1) || !seen([r.x, r.y + 0.4, r.z], 1.6)) continue;
      const rr = RI[SP[r.sp].r], sz = rr.size, gone = r.gone ? Math.max(0, 1 - (S.rt - r.gone) * 3) : 1, born = Math.min(1, (S.rt - r.born) * 3), sc = sz * easeOut(born) * gone;
      if (sc <= 0.01) continue;
      const held = r.st === 'h';
      r.draw = drawRat(r, [r.x, r.y, r.z], r.h, sc, { ph: r.ph, mv: r.mv, held, fx: false });
      if (PASS !== 0) continue;
      decal([r.x, r.y, r.z], 0.55 * sc, [0, 0, 0, 0.32 * GFX.blob], 0, false);
      const dme = Math.hypot(r.x - S.you.p[0], r.z - S.you.p[2]);
      if (dme < 40 && !held) { const mc = rr.i ? hexc(rr.col) : [1, 1, 1]; bill([r.x, r.y + 1.15 * sz + 0.12 * Math.sin(t * 3 + r.ph), r.z], 0.16 + 0.05 * Math.sin(t * 5 + r.ph), mc.concat([clamp(1.4 - dme / 40, 0.25, 0.9)]), 5, true); }
      if (rr.i >= 4) decal([r.x, r.y, r.z], 0.9 * sz + 0.1 * Math.sin(t * 4), hexc(rr.col).concat([0.5]), 3, true);
      if (rr.i >= 8) ribbon([r.x, r.y, r.z], [r.x, r.y + 26, r.z], 0.6 + 0.15 * Math.sin(t * 5), (rr.i === 9 ? hue3((t * 0.3) % 1) : hexc(rr.col)).concat([0.35]), true);
      if (S.aimed === r.id || (S.catching && S.catching.r === r.id)) decal([r.x, r.y, r.z], 0.75 * sz + 0.08 * Math.sin(t * 9), [1, 1, 1, 0.9], 3, true);
    }
    // caught rats flying into your bag
    for (const fl2 of S.fly) if (fl2.p && near(fl2.p[0], fl2.p[2], 1)) drawRat(fl2, fl2.p, fl2.h + fl2.spin, RI[SP[fl2.sp].r].size * fl2.s, { ph: 0, mv: 0, held: true });
    // players and their pets
    const meP = S.meP || (S.meP = {}); Object.assign(meP, { p: S.you.p, h: S.you.face, a: S.you.anim, walk: S.you.walk, c: S.me ? S.me.color : '#ff9f1a', rod: S.me ? S.me.d.rod : 'wood', lineTo: S.myLineTo });
    drawPlayer(meP, true); S.you.tip = meP.tip; if (PASS === 0) decal([S.you.p[0], S.A.height(S.you.p[0], S.you.p[2]), S.you.p[2]], 0.6, [0, 0, 0, 0.35 * GFX.blob], 0, false);
    for (const o of S.others.values()) if (near(o.p[0], o.p[2], 2) && seen([o.p[0], o.p[1] + 1, o.p[2]], 2)) { drawPlayer(o, false); if (PASS === 0) decal([o.p[0], S.A.height(o.p[0], o.p[2]), o.p[2]], 0.6, [0, 0, 0, 0.35 * GFX.blob], 0, false); } else if (PASS === 0) o.tip = null;
    const myPets = S.me ? [...S.rats.values()].filter(x => x.place === 'eq').slice(0, 3) : [];
    petsFor('me', { p: S.you.p, h: S.you.face }, myPets, S.dt);
    for (const o of S.others.values()) if (PASS === 0 || near(o.p[0], o.p[2], 4)) petsFor(o.id, o, (o.pets || []).slice(0, 3), S.dt);
  }
  function shadowPass(A, t, e) {
    const sz = GFX.shadow, hs = GFX.hs, f = norm([camDir[0], 0, camDir[2]]), c = madd(S.you.p, f, hs * 0.45);
    shadowMatrix(e.sun, c, hs, sz);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, DUMMY); gl.activeTexture(gl.TEXTURE0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, RT.sm.fb); gl.viewport(0, 0, sz, sz);
    gl.clearColor(1, 1, 1, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    gl.useProgram(PD.p); gl.uniformMatrix4fv(PD.u.uSVP, false, SVP); setPass(1);
    const lim = [c[0], 0, c[2], hs * 1.45];
    for (const ch of A.pchunks) if (Math.hypot(ch.c[0] - c[0], ch.c[2] - c[2]) < lim[3] + ch.r) drawM(ch, IDM);
    drawProps(A, t, lim);
    drawActors(t, A, lim);
    setPass(0);
  }
  // grass: one patch of blades repeated on a grid around the camera, thinner further away
  const GRASS = { vb: null, ib: null, n: 0, tile: 12 };
  function grassInit() {
    if (GRASS.vb) return true; if (!PG) return false;
    const T = GRASS.tile, n = 3600, r = mulberry(4242), V = new Float32Array(n * 5 * 7), I = new Uint16Array(n * 9), sv = [[-1, 0], [1, 0], [-0.8, 0.55], [0.8, 0.55], [0, 1]];
    for (let i = 0; i < n; i++) { const bx = r() * T, bz = r() * T, r1 = r(), r2 = r(), r3 = r(); for (let k = 0; k < 5; k++) V.set([bx, bz, sv[k][0], sv[k][1], r1, r2, r3], (i * 5 + k) * 7); const b = i * 5; I.set([b, b + 1, b + 3, b, b + 3, b + 2, b + 2, b + 3, b + 4], i * 9); }
    GRASS.vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, GRASS.vb); gl.bufferData(gl.ARRAY_BUFFER, V, gl.STATIC_DRAW);
    GRASS.ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GRASS.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, I, gl.STATIC_DRAW);
    GRASS.n = n; return true;
  }
  // the grass bends away from you and the nearest rats (so they're never lost in it)
  const PUSH = new Float32Array(32);
  function grassPushers() {
    const me = S.you.p, L = []; PUSH.fill(0); for (let i = 0; i < 8; i++) { PUSH[i * 4 + 1] = -999; PUSH[i * 4 + 3] = 0.01; }
    PUSH.set([me[0], me[1], me[2], 0.6], 0);
    for (const r of S.frats.values()) { const d = Math.hypot(r.x - me[0], r.z - me[2]); if (d < GFX.grassR) L.push([d, r]); }
    L.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < 7 && i < L.length; i++) { const r = L[i][1], sz = RI[SP[r.sp].r].size; PUSH.set([r.x, r.y, r.z, 0.42 * sz + 0.12], (i + 1) * 4); }
    return PUSH;
  }
  function drawGrass(A, t, e, shadowOn, glow) {
    const gr = A.env.grass; if (!gr || !A.hm || !GFX.grassR || !grassInit()) return 0;
    gl.useProgram(PG.p); const u = PG.u;
    gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniform3fv(u.uCam, CAM.p); gl.uniform3fv(u.uSun, e.sun); gl.uniform3fv(u.uSunC, e.lightC); gl.uniform3fv(u.uSky, e.amb); gl.uniform3fv(u.uGnd, e.gnd);
    gl.uniform3fv(u.uFog, e.fog); gl.uniform1f(u.uFogD, e.fogD); gl.uniform1f(u.uExpo, e.expo); gl.uniform1f(u.uGlow, glow); gl.uniform1f(u.uT, t);
    gl.uniformMatrix4fv(u.uSVP, false, SVPB); gl.uniform1f(u.uSMO, shadowOn ? 3 * GFX.hs / GFX.shadow : 0); gl.uniform3fv(u.uSMI, shadowOn ? [1 / GFX.shadow, GFX.shadow, 1] : [1, 1, 0]);
    gl.uniform4fv(u.uPush, grassPushers()); gl.uniform4f(u.uGP, GFX.grassR, gr.h, e.wind, GFX.grassD); gl.uniform3fv(u.uG1, gr.c1); gl.uniform3fv(u.uG2, gr.c2); gl.uniform4fv(u.uHMI, A.hm.info);
    gl.bindBuffer(gl.ARRAY_BUFFER, GRASS.vb); attribs([[PG.a.aG, 4, 28, 0], [PG.a.aH, 3, 28, 16]]); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GRASS.ib);
    const T = GRASS.tile, R = GFX.grassR, cx = CAM.p[0], cz = CAM.p[2], lim = A.hm.half; let blades = 0;
    for (let tz = Math.floor((cz - R) / T); tz <= Math.floor((cz + R) / T); tz++) for (let tx = Math.floor((cx - R) / T); tx <= Math.floor((cx + R) / T); tx++) {
      const x0 = tx * T, z0 = tz * T; if (x0 > lim || z0 > lim || x0 + T < -lim || z0 + T < -lim) continue;
      const dx = Math.max(x0 - cx, 0, cx - x0 - T), dz = Math.max(z0 - cz, 0, cz - z0 - T), d = Math.hypot(dx, dz); if (d > R) continue;
      const yc = A.height(x0 + T / 2, z0 + T / 2); if (!boxVisible(FRU, [x0, yc - 5, z0], [x0 + T, yc + 5, z0 + T])) continue;
      const n = Math.floor(GRASS.n * (d < R * 0.3 ? 1 : d < R * 0.6 ? 0.5 : 0.25));
      gl.uniform4f(u.uTile, x0, z0, T, (tx * 7 + tz * 13) & 7); gl.drawElements(gl.TRIANGLES, n * 9, gl.UNSIGNED_SHORT, 0); blades += n;
    }
    gl.useProgram(PW.p); setPass(0); return blades;
  }
  // the finishing pass: glow from bright and glowing things, smooth edges (when the picture had none), colour and a soft vignette
  function postPass() {
    if (RT.ms) { gl.bindFramebuffer(gl.READ_FRAMEBUFFER, RT.mfb); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, RT.fb); gl.blitFramebuffer(0, 0, RT.w, RT.h, 0, 0, RT.w, RT.h, gl.COLOR_BUFFER_BIT, gl.NEAREST); gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null); }
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    const B = RT.bl;
    const pass = (P, dst, src, set) => { gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.fb : null); gl.viewport(0, 0, dst ? dst.w : cv.width, dst ? dst.h : cv.height); gl.useProgram(P.p); gl.bindBuffer(gl.ARRAY_BUFFER, skyBuf); attribs([[P.a.aQ, 2, 8, 0]]); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src); set(P.u); gl.drawArrays(gl.TRIANGLES, 0, 6); };
    const down = (dst, src, sw, sh, mask) => pass(PPD, dst, src, u => { gl.uniform1i(u.uS, 0); gl.uniform2f(u.uPx, 1 / sw, 1 / sh); gl.uniform1f(u.uMask, mask); });
    const blur = (dst, src, dx, dy) => pass(PPB, dst, src, u => { gl.uniform1i(u.uS, 0); gl.uniform2f(u.uDir, dx, dy); });
    down(B[0], RT.tex, RT.w, RT.h, 1); down(B[1], B[0].tex, B[0].w, B[0].h, 0);
    blur(B[2], B[1].tex, 1 / B[1].w, 0); blur(B[1], B[2].tex, 0, 1 / B[1].h);
    down(B[3], B[1].tex, B[1].w, B[1].h, 0); blur(B[4], B[3].tex, 1 / B[3].w, 0); blur(B[3], B[4].tex, 0, 1 / B[3].h);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, B[1].tex); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, B[3].tex);
    pass(PPC, null, RT.tex, u => { gl.uniform2f(u.uPx, 1 / RT.w, 1 / RT.h); gl.uniform4f(u.uPP, RT.ms ? 0 : 1, 1.0, 1.1, 0.24); });
    gl.activeTexture(gl.TEXTURE0); gl.enable(gl.DEPTH_TEST); gl.depthMask(true); setPass(0);
  }
  function render(dt) {
    const A = S.A, t = S.rt; resize(); S.frame = (S.frame || 0) + 1;
    const e = ENV.cur, asp = cv.width / cv.height;
    persp(PROJ, CAM.fov * DEG, asp, 0.1, 700); lookAt(VIEW, CAM.p, CAM.look, UP); mmul(VP, PROJ, VIEW); minv(IVP, VP); FRU = frustum(VP);
    camRight = [VIEW[0], VIEW[4], VIEW[8]]; camUp = [VIEW[1], VIEW[5], VIEW[9]]; camDir = norm(sub(CAM.look, CAM.p));
    const post = GFX.post && rtSetup(cv.width, cv.height, GFX.msaa ? 1 : 0), glow = post ? 1 : 0;
    const shadowOn = !!(A && GFX.shadow && smSetup(GFX.shadow));
    if (shadowOn) shadowPass(A, t, e);
    gl.bindFramebuffer(gl.FRAMEBUFFER, post ? (RT.ms ? RT.mfb : RT.fb) : null); gl.viewport(0, 0, cv.width, cv.height);
    gl.colorMask(true, true, true, true); gl.clearColor(e.fog[0], e.fog[1], e.fog[2], 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // sky
    gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.useProgram(PS.p); const s = PS.u;
    gl.uniformMatrix4fv(s.uIVP, false, IVP); gl.uniform3fv(s.uTop, e.top); gl.uniform3fv(s.uHor, e.hor); gl.uniform3fv(s.uBot, e.bot); gl.uniform3fv(s.uSunD, e.sun); gl.uniform3fv(s.uSunC, e.sunC); gl.uniform1f(s.uSunS, e.sunS);
    gl.uniform1f(s.uT, t); gl.uniform1f(s.uStars, e.stars); gl.uniform1f(s.uClouds, e.clouds); gl.uniform3fv(s.uCloudC, e.cloudC); gl.uniform1f(s.uNeb, e.neb); gl.uniform1f(s.uAur, e.aur); gl.uniform3fv(s.uNebA, e.nebA); gl.uniform3fv(s.uNebB, e.nebB);
    gl.uniform1f(s.uMoon, e.moon); gl.uniform3fv(s.uMoonC, e.moonC); gl.uniform1f(s.uRainbow, e.rainbow); gl.uniform1f(s.uExpo, e.expo); gl.uniform1f(s.uGlow, glow);
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuf); attribs([[PS.a.aQ, 2, 8, 0]]); gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.CULL_FACE);
    if (A) {
      // world
      gl.useProgram(PW.p); const u = PW.u; curMut = -1; setPass(0);
      gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniform3fv(u.uCam, CAM.p); gl.uniform3fv(u.uSun, e.sun); gl.uniform3fv(u.uSunC, e.lightC); gl.uniform3fv(u.uSky, e.amb); gl.uniform3fv(u.uGnd, e.gnd);
      gl.uniform3fv(u.uFog, e.fog); gl.uniform1f(u.uFogD, e.fogD); gl.uniform1f(u.uT, t); const fl = S.flash > 0 ? S.flash * S.flash : 0; gl.uniform3fv(u.uFlash, [fl * 0.6, fl * 0.62, fl * 0.7]);
      gl.uniform1f(u.uGlow, glow); gl.uniform1f(u.uExpo, e.expo);
      gl.uniformMatrix4fv(u.uSVP, false, SVPB); gl.uniform1f(u.uSMO, shadowOn ? 3 * GFX.hs / GFX.shadow : 0); gl.uniform3fv(u.uSMI, shadowOn ? [1 / GFX.shadow, GFX.shadow, 1] : [1, 1, 0]);
      gl.uniform4fv(u.uHMI, A.hm ? A.hm.info : [0, 0, 1, 0]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, shadowOn ? RT.sm.tex : DUMMY);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, A.hm ? A.hm.tex : DUMMY);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ATLAS.tex);
      pickLights(t); gl.uniform4fv(u.uLP, LPA); gl.uniform4fv(u.uLC, LCA);
      setLook({});
      for (const c of A.chunks) if (boxVisible(FRU, c.mn, c.mx)) drawM(c, IDM);
      for (const c of A.pchunks) if (boxVisible(FRU, c.mn, c.mx)) drawM(c, IDM);
      for (const m of A.far) drawM(m, IDM);
      drawProps(A, t, null);
      if (A.id === 'lobby') {
        // the live boards
        if (BOARD.dirty) boardUpload();
        gl.bindTexture(gl.TEXTURE_2D, BOARD.tex); for (const bm of boardMeshes(A)) drawM(bm, IDM); gl.bindTexture(gl.TEXTURE_2D, ATLAS.tex);
      }
      drawActors(t, A, null);
      S.grassN = drawGrass(A, t, e, shadowOn, glow);
      // cartoon outlines around rats, players and chests
      if (GFX.outline) {
        gl.useProgram(PO.p); const o = PO.u;
        gl.uniformMatrix4fv(o.uVP, false, VP); gl.uniform3fv(o.uCam, CAM.p); gl.uniform1f(o.uOW, 0.0024); gl.uniform3fv(o.uSun, e.sun); gl.uniform3fv(o.uSunC, e.lightC);
        gl.uniform3fv(o.uFog, e.fog); gl.uniform1f(o.uFogD, e.fogD); gl.uniform1f(o.uExpo, e.expo); gl.uniform3fv(o.uOC, [0.11, 0.07, 0.15]);
        gl.enable(gl.CULL_FACE); gl.cullFace(gl.FRONT); setPass(2);
        drawActors(t, A, [CAM.p[0], 0, CAM.p[2], 34]);
        setPass(0); gl.cullFace(gl.BACK); gl.disable(gl.CULL_FACE); gl.useProgram(PW.p);
      }
      // fishing lines and bobbers
      castLines(t);
      // see-through things (water, glass, portals); their glow goes in with a second, alpha-only draw
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); setLook({});
      if (glow) gl.colorMask(true, true, true, false);
      gl.uniform1f(u.uGlow, 0); drawM(A.trans, IDM);
      if (glow) { gl.colorMask(false, false, false, true); gl.blendFunc(gl.ONE, gl.ONE); gl.uniform1f(u.uGlow, 1); drawM(A.trans, IDM); gl.colorMask(true, true, true, true); }
      gl.depthMask(true); gl.disable(gl.BLEND);
      partDraw(); quadFlush();
    }
    if (post) postPass();
  }
  const THEME_COL = { classic: [1, 0.82, 0.3], royal: [0.65, 0.4, 1], neon: [0.2, 1, 0.9], nature: [0.4, 0.9, 0.35], galaxy: [0.45, 0.35, 1], candy: [1, 0.5, 0.8] };
  function drawShowcases(t, lim) {
    const L = S.roster || [];
    for (let i = 0; i < L.length && i < 20; i++) {
      const pl = L[i], st = RC.showcaseStand(i), rats = (pl.sc && pl.sc.rats) || [];
      if (lim && Math.hypot(st.x - lim[0], st.z - lim[2]) > lim[3] + 2) continue;
      const dd = Math.hypot(st.x - S.you.p[0], st.z - S.you.p[2]); if (dd > 34 || (PASS !== 1 && !sphereVisible(FRU, [st.x, 1, st.z], 2))) continue;
      if (PASS === 0) decal([st.x, 0.75, st.z], 1.0, (THEME_COL[pl.sc && pl.sc.theme] || THEME_COL.classic).concat([0.6]), 3, true);
      rats.slice(0, 6).forEach((look, k) => { const n = Math.max(1, Math.min(6, rats.length)), a = k / n * TAU + t * 0.25, rad = n === 1 ? 0 : 0.5; drawRat(look, [st.x + Math.cos(a) * rad, 0.78, st.z + Math.sin(a) * rad], a + Math.PI / 2 + (n === 1 ? t * 0.5 : 0), n === 1 ? 0.75 : 0.42, { t: t + k, ph: 0, mv: 0, lite: dd > 12, fx: dd < 12 }); });
    }
  }

  // ---------- the 2D layer: name tags, labels, crosshair and the catch ring ----------
  function toScreen(p) { const c = project(VP, p); if (c[3] <= 0.05) return null; const x = (c[0] / c[3] * 0.5 + 0.5) * W, y = (1 - (c[1] / c[3] * 0.5 + 0.5)) * H; return [x, y, c[3]]; }
  function pill(x, y, text, o) {
    o = o || NOO; const c = x2, fs = o.fs || 15; c.font = (o.w || 700) + ' ' + fs + 'px "Fredoka","Arial Rounded MT Bold",sans-serif';
    const tw = c.measureText(text).width, pw = tw + 18, ph = fs + 12;
    c.globalAlpha = o.a == null ? 1 : o.a; c.fillStyle = o.bg || 'rgba(255,255,255,0.95)'; c.strokeStyle = '#2b1d3a'; c.lineWidth = 3;
    c.beginPath(); if (c.roundRect) c.roundRect(x - pw / 2, y - ph / 2, pw, ph, ph / 2); else c.rect(x - pw / 2, y - ph / 2, pw, ph); c.fill(); c.stroke();
    c.fillStyle = o.fg || '#2b1d3a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y + 1); c.globalAlpha = 1;
    return ph;
  }
  function overlay() {
    const c = x2; c.setTransform(K2, 0, 0, K2, 0, 0); c.clearRect(0, 0, W, H);
    if (!S.ready || !S.A) return;
    // other players' names
    for (const o of S.others.values()) {
      const d = dist(o.p, CAM.p); if (d > 45) continue; const sp = toScreen([o.p[0], o.p[1] + 2.25, o.p[2]]); if (!sp) continue;
      const a = clamp(1.4 - d / 45, 0.3, 1); let y = sp[1];
      if (o.ti) { pill(sp[0], y - 22, o.ti, { fs: 11, a, bg: 'rgba(255,210,58,0.95)' }); }
      pill(sp[0], y, o.n + '  ·  Lv ' + (o.lvl || 1), { fs: 14, a, bg: o.c || '#fff', fg: '#fff' });
      socialTag(o, sp[0], y, a);
    }
    if (S.aid === 'lobby') {
      for (let i = 0; i < S.roster.length && i < 20; i++) { const pl = S.roster[i], st = RC.showcaseStand(i), d = Math.hypot(st.x - S.you.p[0], st.z - S.you.p[2]); if (d > 16) continue; const sp = toScreen([st.x, 2.0, st.z]); if (sp) pill(sp[0], sp[1], (pl.n || '?') + "'s showcase", { fs: 12, a: clamp(1.6 - d / 16, 0.35, 1) }); }
    } else {
      // aimed rat
      const ar = S.aimed && S.frats.get(S.aimed);
      if (ar && !S.catching) { const sp = toScreen([ar.x, ar.y + 1.2 * RI[SP[ar.sp].r].size + 0.2, ar.z]); if (sp) { const rr = RI[SP[ar.sp].r]; pill(sp[0], sp[1] - 20, RC.ratName(ar), { fs: 15 }); pill(sp[0], sp[1] + 6, rr.n, { fs: 12, bg: rr.col }); } }
      // chests
      for (const ch of S.chests.values()) { const d = Math.hypot(ch.x - S.you.p[0], ch.z - S.you.p[2]); if (d > 25) continue; const sp = toScreen([ch.x, ch.y + 1.5, ch.z]); if (sp) pill(sp[0], sp[1], d < 3.4 ? 'Press E to open' : 'Treasure chest', { fs: 12, bg: '#ffd23a', a: clamp(1.5 - d / 25, 0.4, 1) }); }
      // crosshair and the catch ring
      const cx = W / 2, cy = H / 2, aimed = !!S.aimed || !!S.catching;
      c.strokeStyle = aimed ? '#ffd23a' : 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 4;
      c.beginPath(); c.arc(cx, cy, aimed ? 13 : 9, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, 2, 0, TAU); c.fillStyle = c.strokeStyle; c.fill(); c.shadowBlur = 0;
      const ca = S.catching;
      if (ca) {
        const k = clamp((wallNow() - ca.t0) / ca.dur, 0, 1), R = 34;
        c.lineWidth = 8; c.strokeStyle = 'rgba(43,29,58,0.8)'; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        c.strokeStyle = ca.lost > 0 ? '#ff5a5a' : '#5fdc6a'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * k); c.stroke();
        pill(cx, cy + R + 26, ca.lost > 0 ? 'Keep it in your sights!' : k >= 1 ? 'Reeling in…' : 'Reeling… ' + Math.round(ca.p * 100) + '% chance', { fs: 14, bg: ca.lost > 0 ? '#ffd0d0' : '#fff' });
      } else if (S.aimed) pill(cx, cy + 40, IN.touch ? 'Tap Cast' : 'Click to cast', { fs: 13, a: 0.9 });
    }
  }


  // ===================== station windows: shop, eggs, the rat bank and your rats =====================
  const SLOT_N = { head: 'Hat', face: 'Glasses', neck: 'Neck', back: 'Back', trail: 'Trail', fx: 'Particles', aura: 'Aura' };
  const CAT_IC = { Hats: '🎩', Sunglasses: '🕶️', Crowns: '👑', Chains: '📿', Wings: '🪽', Back: '🎒', Trails: '🌈', Particles: '✨', Auras: '🔥', Disco: '🪩' };
  const PLACE_N = { inv: 'Backpack', sto: 'Storage', slot: 'Money slot', eq: 'Pet' };
  const mutList = r => [r.mut, r.wx, r.disco ? 'disco' : null].filter(Boolean);
  const mutPills = r => mutList(r).map(m => '<span class="rc-pill" style="--c:' + MUTATIONS[m].col + '">' + MUTATIONS[m].n + ' ×' + (S.cfg.mutMult[m] || MUTATIONS[m].mult) + '</span>').join(' ');
  const rarPill = id => '<span class="rc-pill" style="--c:' + RI[id].col + '">' + RI[id].n + '</span>';
  const money = v => '<span style="color:#1d7a2e;font-weight:700">' + fmtMoney(v) + '</span>';
  function ratCard(r, o) {
    o = o || NOO; const s = SP[r.sp] || SP.brown, rr = RI[s.r];
    return '<div class="rc-card' + (o.on ? ' on' : '') + (o.dim ? ' dim' : '') + '" data-act="' + (o.act || 'rat') + '" data-id="' + esc(r.id) + '" style="--rc:' + rr.col + '">' +
      '<div class="tl">' + (o.star ? '<button class="star" data-act="star" data-id="' + esc(r.id) + '" title="' + (r.fav ? 'Remove from favorites' : 'Add to favorites') + '">' + (r.fav ? '⭐' : '☆') + '</button>' : r.fav ? '<span title="Favorite">⭐</span>' : '') + (r.lock ? '<span title="Locked">🔒</span>' : '') + (r.place === 'slot' ? '<span title="In a money slot">💰</span>' : r.place === 'eq' ? '<span title="Pet">🐾</span>' : '') + '</div>' +
      (r.lvl ? '<div class="tr ' + lvlTier(r.lvl) + '">Lv ' + r.lvl + '</div>' : '') + ratImg(r) + '<b title="' + esc(RC.ratName(r)) + '">' + esc(RC.ratName(r)) + '</b><small>' + rr.n + (r.evo ? ' ' + '★'.repeat(r.evo) : '') + '</small>' +
      '<div class="mu">' + mutList(r).map(m => '<i style="--c:' + MUTATIONS[m].col + '" title="' + MUTATIONS[m].n + '"></i>').join('') + '</div>' +
      (o.cosList && r.cos && Object.keys(r.cos).length ? '<span class="rc-tiny" style="text-align:center">' + Object.values(r.cos).map(c => COS[c] ? (CAT_IC[COS[c].cat] || '✨') + ' ' + esc(COS[c].n) : '').join(' · ') + '</span>' : '') +
      (o.noEarn ? '' : '<div class="earn">' + fmtMoney(o.earn != null ? o.earn : earnOf(r)) + '/s</div>') + '</div>';
  }
  // level badges change colour at the milestones (10, 25, 50, 75, 100)
  const lvlTier = l => l >= 100 ? 'lv100' : l >= 75 ? 'lv75' : l >= 50 ? 'lv50' : l >= 25 ? 'lv25' : l >= 10 ? 'lv10' : '';
  const affordSig = prices => prices.map(p => S.money >= p ? 1 : 0).join('');
  function buyBtn(act, price, label, data, cls) { const ok = S.money >= price; return '<button class="rc-b sm ' + (ok ? (cls || 'g') : '') + '" data-act="' + act + '" ' + (data || '') + ' title="' + (ok ? '' : 'You need ' + fmtMoney(price - S.money) + ' more') + '">' + label + ' · ' + fmtMoney(price) + '</button>'; }
  const potCfg = id => Object.assign({}, POT[id], S.cfg.potions[id] || {});

  // ---------- Item Shop ----------
  function openShop(tab) {
    openWin('shop', { title: 'Item Shop', sub: 'Potions, rods, upgrades and cosmetics', icon: '🛒', color: '#ff9f1a', tab,
      tabs: [['potions', '🧪 Potions'], ['rods', '🎣 Rods'], ['up', '⬆️ Upgrades'], ['cos', '🎩 Cosmetics'], ['event', '🎟️ Event shop'], ['box', '🎁 Mystery Box']],
      prices: [],
      render(W, b) {
        const me = S.me, d = me.d, cfg = S.cfg, P = W.o.prices = [];
        if (W.tab === 'potions') {
          const t = srvNow();
          b.innerHTML = '<p class="rc-note" style="margin-bottom:12px">Potions of one kind don’t stack. Drinking the same potion again adds more time (up to ' + cfg.potionMax + '× its time). A weaker potion can’t replace a stronger one that is still working.</p><div class="rc-shop">' +
            POTIONS.map(p0 => { const p = potCfg(p0.id), n = d.potions[p.id] || 0, e = d.eff[p.cat], on = e && e.ends > t && e.id === p.id; P.push(p.price);
              const what = p.cat === 'luck' ? '×' + p.mult + ' luck' : p.cat === 'money' ? '×' + p.mult + ' earnings' : p.cat === 'speed' ? 'Run ×' + p.mult + ' faster' : p.cat === 'catch' ? 'Reel ×' + p.mult + ' faster, +5% catch chance' : '×' + p.mult + ' natural mutation chances';
              return '<div class="rc-item' + (on ? ' own' : '') + '" style="--c:' + p.col + '"><div class="ic">🧪</div><b>' + esc(p.n) + '</b><small>' + what + ' for ' + fmtDur(p.dur) + '.' + (on ? ' <b>Working: ' + fmtDur((e.ends - t) / 1000) + ' left.</b>' : '') + '</small>' +
                '<div class="rc-row"><span class="pr">' + fmtMoney(p.price) + '</span><span class="rc-sp"></span><span class="rc-tag">You have ' + n + '</span></div>' +
                '<div class="rc-row">' + buyBtn('buyPot', p.price, 'Buy', 'data-id="' + p.id + '" data-n="1"') + (n ? '<button class="rc-b sm p" data-act="drink" data-id="' + p.id + '">Drink</button>' : '') + '</div>' +
                '<div class="rc-row"><button class="rc-b xs" data-act="buyPot" data-id="' + p.id + '" data-n="5">Buy 5 · ' + fmtMoney(p.price * 5) + '</button></div></div>'; }).join('') + '</div>';
        } else if (W.tab === 'rods') {
          b.innerHTML = '<p class="rc-note" style="margin-bottom:12px">Better rods bring rarer rats (luck), reel faster and miss less. Mystery Boxes and treasure chests can also hold rods.</p><div class="rc-shop">' +
            RODS.map(r0 => { const r = Object.assign({}, r0, cfg.rods[r0.id] || {}), own = d.rods.includes(r.id), eq = d.rod === r.id; if (!own) P.push(r.price);
              return '<div class="rc-item' + (own ? ' own' : '') + '" style="--c:' + r.col + '"><div class="ic">🎣</div><b>' + esc(r.n) + '</b><small>Luck ×' + r.luck + ' · Reel speed ×' + r.speed + '<br>Catch chance ' + Math.round(r.success * 100) + '% (less for rarer rats) · Reach ' + r.range + ' m</small>' +
                '<div class="rc-row">' + (eq ? '<span class="rc-pill" style="--c:#c8f5c0">Equipped</span>' : own ? '<button class="rc-b sm bl" data-act="rodEq" data-id="' + r.id + '">Equip</button>' : buyBtn('buyRod', r.price, 'Buy', 'data-id="' + r.id + '"')) + '</div></div>'; }).join('') + '</div>';
        } else if (W.tab === 'up') {
          const c = me.cap, items = [];
          const up = (ic, n, have, max, price, act, note) => { if (price != null && have < max) P.push(price); items.push('<div class="rc-item" style="--c:#ffd23a"><div class="ic">' + ic + '</div><b>' + n + '</b><small>' + note + '</small><div class="rc-row"><span class="rc-tag">' + have + ' / ' + max + '</span></div><div class="rc-row">' + (have >= max ? '<span class="rc-pill" style="--c:#c8f5c0">Maxed out</span>' : buyBtn(act, price, 'Upgrade')) + '</div></div>'); };
          up('🎒', 'Backpack space', c.inv, cfg.maxInventory, RC.inventoryPrice(cfg, c.inv), 'buyInv', '+' + cfg.inventoryStep + ' spaces for rats you carry.');
          up('📦', 'Rat Storage', c.storage, cfg.maxStorage, RC.storagePrice(cfg, c.storage), 'buyStorage', '+' + cfg.storageStep + ' storage spaces. New rats go to storage when your backpack is full.');
          up('💰', 'Money slots', c.slots, cfg.maxSlots, RC.slotPrice(cfg, c.slots), 'buySlot', 'One more slot for a rat that earns money every second.');
          up('🐾', 'Pet spots', c.equip, cfg.maxEquip, cfg.equipPrices[c.equip - cfg.startEquip], 'buyEquip', 'Equip one more rat as a pet. Pets follow you and add luck.');
          const sp = Math.round(Math.max(500, myMps(false) * 20)); P.push(sp);
          items.push('<div class="rc-item" style="--c:#ffb27a"><div class="ic">🍪</div><b>Rat Snack</b><small>Feed one to a rat to give it a big helping of XP. The price grows with your earnings.</small><div class="rc-row"><span class="rc-tag">You have ' + d.snacks + '</span></div><div class="rc-row">' + buyBtn('buySnack', sp, 'Buy', 'data-n="1"') + '<button class="rc-b xs" data-act="buySnack" data-n="10">10 · ' + fmtMoney(sp * 10) + '</button></div></div>');
          b.innerHTML = '<div class="rc-shop">' + items.join('') + '</div>';
        } else if (W.tab === 'cos' || W.tab === 'event') {
          const ev = W.tab === 'event', t = srvNow(), promoOn = cfg.promo && cfg.promo.on && (!cfg.promo.ends || cfg.promo.ends > t);
          const list = COSMETICS.filter(c => ev ? c.tokens : (c.src === 'shop' && cfg.cosPrices[c.id]) || (c.src === 'promo' && promoOn && cfg.promo.items.includes(c.id) && cfg.cosPrices[c.id]));
          const cat = W.st.cat || '';
          b.innerHTML = (ev ? '<div class="rc-row" style="margin-bottom:12px"><span class="rc-pill" style="--c:#ffd23a;font-size:16px">🎟️ ' + d.tokens + ' event tokens</span><span class="rc-note">Treasure chests give event tokens while an event is running.</span></div>' :
            '<div class="rc-tool"><select class="rc-sel" data-ch="cat"><option value="">Every kind</option>' + COS_CATS_LIST.map(k => '<option' + (k === cat ? ' selected' : '') + '>' + k + '</option>').join('') + '</select><span class="rc-note">Cosmetics only change how a rat looks. They never change its rarity or earnings.</span></div>') +
            '<div class="rc-shop">' + list.filter(c => !cat || c.cat === cat).map(c => { const have = d.cos[c.id] || 0, worn = [...S.rats.values()].filter(r => r.cos && r.cos[c.slot] === c.id).length, price = cfg.cosPrices[c.id]; if (!ev) P.push(price);
              const pic = cosMesh(c.id) ? ratImg({ sp: 'white', cos: { [c.slot]: c.id } }, ' style="width:100%;height:110px;object-fit:contain"') : '<div class="ic" style="--c:' + c.col + '">' + (CAT_IC[c.cat] || '✨') + '</div>';
              return '<div class="rc-item" style="--c:' + c.col + '">' + pic + '<b>' + esc(c.n) + '</b><small>' + SLOT_N[c.slot] + ' · ' + c.cat + (c.src === 'promo' ? ' · <b>Limited offer!</b>' : '') + '</small><div class="rc-row"><span class="rc-tag">Spare: ' + have + '</span>' + (worn ? '<span class="rc-tag">Worn: ' + worn + '</span>' : '') + '</div><div class="rc-row">' +
                (ev ? '<button class="rc-b sm ' + (d.tokens >= c.tokens ? 'y' : '') + '" data-act="buyTok" data-id="' + c.id + '">Get · ' + c.tokens + ' tokens</button>' : buyBtn('buyCos', price, 'Buy', 'data-id="' + c.id + '"')) + '</div></div>'; }).join('') + '</div>' +
            (ev ? '<p class="rc-note" style="margin-top:12px">Other cosmetics come from achievements, daily rewards, rebirths, chests and Mystery Boxes.</p>' : '');
        } else if (W.tab === 'box') {
          const tot = RC.MYSTERY.table.reduce((a, x) => a + x[1], 0), nm = { money: 'Money', potion: 'A potion', egg2: '$2 Egg', egg5: '$5 Egg', cosmetic: 'A shop cosmetic', rod: 'A better rod' }; P.push(cfg.mysteryPrice);
          b.innerHTML = '<div class="rc-cols"><div class="rc-item" style="--c:#b876ff"><div class="ic" style="height:120px;font-size:80px">🎁</div><b>Mystery Box</b><small>' + esc(RC.MYSTERY.d) + '</small><div class="rc-row"><span class="pr">' + fmtMoney(cfg.mysteryPrice) + '</span><span class="rc-sp"></span><span class="rc-tag">You have ' + d.boxes + '</span></div>' +
            '<div class="rc-row">' + buyBtn('buyBox', cfg.mysteryPrice, 'Buy', 'data-n="1"') + '<button class="rc-b sm" data-act="buyBox" data-n="5">Buy 5</button>' + (d.boxes ? '<button class="rc-b sm p" data-act="openBox">Open one</button>' : '') + '</div></div>' +
            '<div><div class="rc-h3">What’s inside</div><div class="rc-odds">' + RC.MYSTERY.table.map(x => '<div style="--c:#d6a8ff"><span>' + nm[x[0]] + '</span><b>' + (x[1] / tot * 100).toFixed(1) + '%</b></div>').join('') + '</div><p class="rc-note" style="margin-top:8px">A better rod is the next rod after your best one (sometimes two steps up). If you already own it, you get a lot of money instead.</p></div></div>';
        }
      },
      ch(k, t) { if (k === 'cat') { WIN.st.cat = t.value; renderWin(); } },
      act(a, t) {
        const id = t.dataset.id, n = +t.dataset.n || 1;
        if (a === 'buyPot') nsend({ t: 'buy', kind: 'potion', id, n }); else if (a === 'drink') nsend({ t: 'drink', id });
        else if (a === 'buyRod') nsend({ t: 'buy', kind: 'rod', id }); else if (a === 'rodEq') nsend({ t: 'rodEq', id });
        else if (a === 'buyInv') nsend({ t: 'buy', kind: 'inv' }); else if (a === 'buyStorage') nsend({ t: 'buy', kind: 'storage' }); else if (a === 'buySlot') nsend({ t: 'buy', kind: 'slot' }); else if (a === 'buyEquip') nsend({ t: 'buy', kind: 'equip' });
        else if (a === 'buySnack') nsend({ t: 'buy', kind: 'snack', n }); else if (a === 'buyCos') nsend({ t: 'buy', kind: 'cos', id }); else if (a === 'buyTok') nsend({ t: 'buy', kind: 'tokens', id });
        else if (a === 'buyBox') nsend({ t: 'buy', kind: 'mystery', n }); else if (a === 'openBox') nsend({ t: 'box' });
      },
      on(w) { if (w === 'me' || w === 'cfg' || w === 'rats') return true; if (w === 'money') { const s = affordSig(WIN.o.prices); if (s !== WIN.o.asig) { WIN.o.asig = s; return true; } } return false; } });
  }
  const COS_CATS_LIST = RC.COS_CATS || ['Hats', 'Sunglasses', 'Crowns', 'Chains', 'Wings', 'Back', 'Trails', 'Particles', 'Auras', 'Disco'];

  // ---------- Egg Hatchery ----------
  function eggOdds(id) { const o = S.cfg.eggs[id].odds, tot = Object.values(o).reduce((a, v) => a + (+v || 0), 0) || 1; return RARITIES.filter(r => +o[r.id] > 0).map(r => '<div style="--c:' + r.col + '"><span>' + r.n + '</span><b>' + (+(o[r.id] / tot * 100).toFixed(2)) + '%</b></div>').join(''); }
  function ltdState() { const l = S.cfg.ltdEgg || {}; if (!l.on) return { on: false, text: 'Not available right now. Watch the Event Board!' }; if (l.ends && l.ends <= srvNow()) return { on: false, text: 'This egg has ended.' }; return { on: true, text: l.ends ? 'Ends in ' + fmtDur((l.ends - srvNow()) / 1000) : 'Available for a limited time!' }; }
  function openEggs() {
    openWin('eggs', { title: 'Egg Hatchery', sub: 'Every egg hatches one rat. The odds are always shown.', icon: '🥚', color: '#b876ff', cls: '', prices: [],
      render(W, b) {
        const d = S.me.d, P = W.o.prices = [];
        const mine = EGGS.filter(e => d.eggs[e.id] > 0);
        b.innerHTML = (mine.length ? '<div class="rc-h3">Your eggs</div><div class="rc-row" style="margin-bottom:14px">' + mine.map(e => '<button class="rc-b sm y" data-act="hatch" data-id="' + e.id + '">' + esc(e.n) + ' ×' + d.eggs[e.id] + ' · Hatch</button>').join('') + '</div>' : '') +
          '<div class="rc-shop" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">' + EGGS.map(e => { const c = S.cfg.eggs[e.id], L = e.limited ? ltdState() : null; P.push(c.price);
            return '<div class="rc-item" style="--c:' + e.col + '">' + eggImg(e.id).replace('<img', '<img style="width:100%;height:130px;object-fit:contain"') + '<b>' + esc(e.n) + '</b>' + (L ? '<small style="color:' + (L.on ? '#c03a6a' : '#8a7a6a') + ';font-weight:700">' + L.text + '</small>' : '') +
              '<div class="rc-odds">' + eggOdds(e.id) + '</div><div class="rc-row"><span class="pr">' + fmtMoney(c.price) + '</span></div>' + (L && !L.on ? '<button class="rc-b sm" disabled>Not available</button>' : buyBtn('buyEgg', c.price, 'Buy & hatch', 'data-id="' + e.id + '"', 'y')) + '</div>'; }).join('') + '</div>' +
          '<p class="rc-note" style="margin-top:12px">Eggs cost in-game money only. Hatched rats can also roll mutations, and events make that more likely. A new rat needs a free space in your backpack or storage.</p>';
      },
      act(a, t) { if (a === 'buyEgg') nsend({ t: 'buy', kind: 'egg', id: t.dataset.id }); else if (a === 'hatch') nsend({ t: 'hatch', id: t.dataset.id }); },
      on(w) { if (w === 'me' || w === 'cfg') return true; if (w === 'money') { const s = affordSig(WIN.o.prices); if (s !== WIN.o.asig) { WIN.o.asig = s; return true; } } return false; } });
  }

  // ---------- the Rat Bank: money slots ----------
  function earnRows(r) {
    const e = RC.ratEarn(S.cfg, r, myMods());
    return e.parts.map(p => '<div><span>' + esc(p.n) + '</span><span>' + (p.v != null ? fmtMoney(p.v, true) + '/s' : '×' + (+p.x.toFixed(3))) + '</span></div>').join('') + '<div class="tot"><span>Earns</span><span>' + fmtMoney(e.total, true) + '/s</span></div>';
  }
  function openBank() {
    openWin('bank', { title: 'Rat Bank', sub: 'Rats in money slots earn money every second', icon: '💰', color: '#45c95c', st: { pick: null },
      render(W, b) {
        const me = S.me, c = me.cap, cfg = S.cfg, slots = [];
        if (W.st.pick != null) {
          const list = [...S.rats.values()].filter(r => r.place !== 'slot').sort((a, b2) => earnOf(b2) - earnOf(a));
          b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="back">← Back</button><b>Pick a rat for money slot ' + (W.st.pick + 1) + '</b></div>' +
            (list.length ? '<div class="rc-grid">' + list.map(r => ratCard(r, { act: 'put' })).join('') + '</div>' : '<div class="rc-empty">You have no other rats yet. Go catch some!</div>');
          return;
        }
        const inSlot = [...S.rats.values()].filter(r => r.place === 'slot');
        for (let i = 0; i < cfg.maxSlots; i++) {
          const r = inSlot.find(x => x.slot === i);
          if (i < c.slots) slots.push(r ? '<div class="rc-slot full" style="--rc:' + RCOL(r) + '" data-act="pick" data-i="' + i + '"><span class="n">Slot ' + (i + 1) + '</span>' + ratImg(r) + '<b>' + esc(RC.ratName(r)) + '</b><span class="ps">' + fmtMoney(earnOf(r)) + '/s</span><span class="rc-row"><button class="rc-b xs" data-act="pick" data-i="' + i + '">Swap</button><button class="rc-b xs r" data-act="out" data-id="' + r.id + '">Take out</button></span></div>'
            : '<div class="rc-slot" data-act="pick" data-i="' + i + '"><span class="n">Slot ' + (i + 1) + '</span><span style="font-size:40px">＋</span>Add a rat</div>');
          else if (i === c.slots) slots.push('<div class="rc-slot lock"><span class="n">Slot ' + (i + 1) + '</span><span style="font-size:34px">🔒</span>' + buyBtn('buySlot', RC.slotPrice(cfg, c.slots), 'Unlock') + '</div>');
          else slots.push('<div class="rc-slot lock"><span class="n">Slot ' + (i + 1) + '</span><span style="font-size:34px">🔒</span>Locked</div>');
        }
        const tot = myMps(true), base = myMps(false), pot = eff('money');
        b.innerHTML = '<div class="rc-row" style="margin-bottom:12px;gap:14px"><span class="rc-pill" style="--c:#c8f5c0;font-size:20px;padding:6px 14px">Total: ' + fmtMoney(tot, true) + ' every second</span>' +
          (pot ? '<span class="rc-pill" style="--c:#ffd23a">Money potion ×' + pot.mult + ' for ' + fmtDur((pot.ends - srvNow()) / 1000) + '</span>' : '') +
          '<span class="rc-note">While you are offline, slots earn ' + Math.round(cfg.offlineRate * 100) + '% of this (' + fmtMoney(base * cfg.offlineRate, true) + '/s) for up to ' + cfg.offlineMaxHours + ' hours.</span></div>' +
          '<div class="rc-slots">' + slots.join('') + '</div>' +
          (inSlot.length ? '<div class="rc-h3" style="margin-top:16px">Breakdown</div><div class="rc-cols">' + inSlot.sort((a, b2) => a.slot - b2.slot).map(r => '<div class="rc-break"><div><b>Slot ' + (r.slot + 1) + ': ' + esc(RC.ratName(r)) + '</b><span>Lv ' + r.lvl + '</span></div>' + earnRows(r) + '</div>').join('') + '</div>' : '') +
          '<p class="rc-note" style="margin-top:12px">Earnings = the rarity’s base (or the rat’s own value for God-like and Secret rats) × mutations × level × evolution × rebirths × potions. The server pays every second; this window shows the same numbers it uses.</p>';
      },
      act(a, t) {
        const W = WIN;
        if (a === 'pick') { W.st.pick = +t.dataset.i; renderWin(); }
        else if (a === 'back') { W.st.pick = null; renderWin(); }
        else if (a === 'put') { nsend({ t: 'slot', id: t.dataset.id, slot: W.st.pick }); W.st.pick = null; }
        else if (a === 'out') nsend({ t: 'unslot', id: t.dataset.id });
        else if (a === 'buySlot') nsend({ t: 'buy', kind: 'slot' });
      },
      sig: () => [...S.rats.values()].map(ratSig).join('|') + JSON.stringify(S.me.cap) + (eff('money') ? eff('money').mult : 1) + S.me.rebirths + JSON.stringify(S.cfg.rarityEarn) + (S.money >= RC.slotPrice(S.cfg, S.me.cap.slots) ? 1 : 0),
      on(w) { return w === 'rats' || w === 'me' || w === 'cfg' || w === 'money'; } });
  }

  // ---------- your rats: backpack, storage, pets and everything you can do with a rat ----------
  const SORTS = { rarity: ['Rarest first', (a, b) => RI[SP[b.sp].r].i - RI[SP[a.sp].r].i || earnOf(b) - earnOf(a)], fav: ['Favorites first', (a, b) => (b.fav | 0) - (a.fav | 0) || RI[SP[b.sp].r].i - RI[SP[a.sp].r].i || earnOf(b) - earnOf(a)], earn: ['Highest earnings', (a, b) => earnOf(b) - earnOf(a)], level: ['Highest level', (a, b) => b.lvl - a.lvl || b.xp - a.xp], new: ['Newest', (a, b) => b.born - a.born], name: ['Name', (a, b) => RC.ratName(a).localeCompare(RC.ratName(b))] };
  const ratSig = r => r.id + ':' + r.place + r.slot + ':' + r.lvl + (r.fav ? 'f' : '') + (r.lock ? 'l' : '') + r.evo + (r.mut || '') + (r.wx || '') + r.disco + JSON.stringify(r.cos || {}) + r.cap;
  const invSig = () => [...S.rats.values()].map(ratSig).join('|') + JSON.stringify(S.me.cap) + '|' + S.me.d.snacks + JSON.stringify(S.me.d.cos) + (S.me.d.showcase.rats || []).join() + '|' + (eff('money') ? eff('money').mult : 1) + S.me.rebirths + JSON.stringify(S.cfg.rarityEarn);
  function petLuck(r) { return 0.02 * (RI[SP[r.sp].r].i + 1) * (1 + 0.5 * (r.evo || 0)); }
  function openInventory(tab, ratId) {
    openWin('inv', { title: 'Your Rats', icon: '🎒', color: '#7a4dff', tab: tab || 'inv',
      tabs: [['inv', '🎒 Backpack'], ['sto', '📦 Storage'], ['slot', '💰 Money slots'], ['eq', '🐾 Pets'], ['all', '🐀 All']],
      st: { sort: 'rarity', rar: '', fav: 0, mut: 0, sel: ratId || null, multi: false, picked: new Set(), cosSlot: null, evo: false },
      subf() { const c = S.me.cap, n = p => [...S.rats.values()].filter(r => r.place === p).length; return 'Backpack ' + n('inv') + '/' + c.inv + ' · Storage ' + n('sto') + '/' + c.storage + ' · Pets ' + n('eq') + '/' + c.equip + ' · Slots ' + n('slot') + '/' + c.slots; },
      onTab() { WIN.st.sel = null; WIN.st.picked.clear(); },
      render(W, b) { if (W.st.sel && S.rats.get(W.st.sel)) return ratDetail(W, b, S.rats.get(W.st.sel)); W.st.sel = null; ratGrid(W, b); },
      ch(k, t) { const st = WIN.st; if (k === 'sort') st.sort = t.value; else if (k === 'rar') st.rar = t.value; renderWin(); },
      act: invAct, sig: invSig,
      on(w) { return w === 'rats' || w === 'me' || w === 'cfg'; } });
  }
  function ratGrid(W, b) {
    const st = W.st, all = [...S.rats.values()];
    let list = all.filter(r => W.tab === 'all' || r.place === W.tab);
    if (st.rar) list = list.filter(r => SP[r.sp].r === st.rar); if (st.fav) list = list.filter(r => r.fav); if (st.mut) list = list.filter(r => mutList(r).length);
    list.sort(SORTS[st.sort][1]);
    const picked = [...st.picked].map(id => S.rats.get(id)).filter(Boolean);
    const empty = { inv: 'Your backpack is empty. Visit a field and catch some rats!', sto: 'Nothing in storage. Rats go here when your backpack is full, or you can store them yourself.', slot: 'No rats are earning yet. Put rats in money slots at the Rat Bank.', eq: 'No pets yet. Equip a rat and it follows you around and adds luck.', all: 'You don’t have any rats yet.' }[W.tab];
    b.innerHTML = '<div class="rc-tool"><select class="rc-sel" data-ch="sort">' + Object.keys(SORTS).map(k => '<option value="' + k + '"' + (st.sort === k ? ' selected' : '') + '>' + SORTS[k][0] + '</option>').join('') + '</select>' +
      '<select class="rc-sel" data-ch="rar"><option value="">All rarities</option>' + RARITIES.map(r => '<option value="' + r.id + '"' + (st.rar === r.id ? ' selected' : '') + '>' + r.n + '</option>').join('') + '</select>' +
      '<button class="rc-chk' + (st.fav ? ' on' : '') + '" data-act="fFav">⭐ Favorites</button><button class="rc-chk' + (st.mut ? ' on' : '') + '" data-act="fMut">✨ Mutated</button><span class="rc-sp"></span>' +
      '<button class="rc-chk' + (st.multi ? ' on' : '') + '" data-act="multi">☑️ Pick many</button></div>' +
      (W.tab === 'eq' ? '<p class="rc-note" style="margin-bottom:10px">Pets follow you, earn XP and add luck: +' + Math.round([...S.rats.values()].filter(r => r.place === 'eq').reduce((a, r) => a + petLuck(r), 0) * 100) + '% from your pets right now.</p>' : '') +
      (st.multi ? '<div class="rc-row" style="margin-bottom:10px;padding:8px 10px;border:3px solid var(--ink);border-radius:14px;background:#fff3c4"><b>' + picked.length + ' picked</b>' + (picked.length ? '<span class="rc-note">worth ' + fmtMoney(picked.reduce((a, r) => a + RC.sellPrice(S.cfg, r), 0)) + '</span>' : '') + '<span class="rc-sp"></span>' +
        '<button class="rc-b xs" data-act="pickAll">Pick all shown</button><button class="rc-b xs" data-act="pickNone">Clear</button><button class="rc-b xs bl" data-act="bulkStore">' + (W.tab === 'sto' ? 'To backpack' : 'To storage') + '</button><button class="rc-b xs r" data-act="bulkSell">Sell picked</button></div>' : '') +
      (list.length ? '<div class="rc-grid">' + list.map(r => ratCard(r, { on: st.multi && st.picked.has(r.id), star: true })).join('') + '</div>' : '<div class="rc-empty"><span style="font-size:40px">🐀</span>' + (all.length && (st.rar || st.fav || st.mut) ? 'No rats match these filters.' : empty) + '</div>');
    W.shown = list.map(r => r.id);
  }
  function ratDetail(W, b, r) {
    const st = W.st, s = SP[r.sp], rr = RI[s.r], me = S.me, cfg = S.cfg, need = RC.ratXpNeed(r.lvl), maxed = r.lvl >= r.cap;
    if (st.cosSlot) return cosPicker(W, b, r, st.cosSlot);
    if (st.evo) return evoView(W, b, r);
    const inShow = (me.d.showcase.rats || []).includes(r.id), dupes = [...S.rats.values()].filter(x => x.id !== r.id && x.sp === r.sp && (x.evo || 0) === (r.evo || 0) && !x.lock);
    const mv = [];
    if (r.place !== 'slot') mv.push('<button class="rc-b sm g" data-act="toSlot" data-id="' + r.id + '">💰 Put in a money slot</button>'); else mv.push('<button class="rc-b sm" data-act="unslot" data-id="' + r.id + '">Take out of slot ' + (r.slot + 1) + '</button>');
    if (r.place !== 'eq') mv.push('<button class="rc-b sm bl" data-act="equip" data-id="' + r.id + '">🐾 Equip as pet</button>'); else mv.push('<button class="rc-b sm" data-act="unequip" data-id="' + r.id + '">Unequip pet</button>');
    if (r.place !== 'sto') mv.push('<button class="rc-b sm" data-act="store" data-id="' + r.id + '">📦 To storage</button>'); if (r.place !== 'inv') mv.push('<button class="rc-b sm" data-act="unstore" data-id="' + r.id + '">🎒 To backpack</button>');
    const capP = RC.capPrice(r);
    b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="back">← Back</button><span class="rc-sp"></span><span class="rc-tag">' + PLACE_N[r.place] + '</span></div>' +
      '<div class="rc-det"><div class="pic" style="--rc:' + rr.col + '">' + ratImg(r) + '</div><div style="display:grid;gap:10px;align-content:start;min-width:0">' +
      '<div><h3>' + esc(RC.ratName(r)) + '</h3><div class="rc-row" style="margin-top:4px">' + rarPill(s.r) + mutPills(r) + (r.evo ? '<span class="rc-pill" style="--c:#ffe9a8">Evolution ' + '★'.repeat(r.evo) + '</span>' : '') + '</div></div>' +
      '<p class="rc-note">' + esc(s.d) + '</p>' +
      '<div><div class="rc-row"><b>Level ' + r.lvl + '</b><span class="rc-tiny">cap ' + r.cap + (r.lvl >= 25 ? ' · ' + (r.lvl >= 75 ? '💎' : r.lvl >= 50 ? '🥇' : '🥈') + ' milestone' : '') + '</span><span class="rc-sp"></span><span class="rc-tiny">' + (maxed ? 'At its level cap' : fmtN(r.xp) + ' / ' + fmtN(need) + ' XP') + '</span></div><div class="rc-bar" style="margin-top:4px"><i style="width:' + (maxed ? 100 : clamp(r.xp / need * 100, 0, 100)) + '%"></i></div><span class="rc-tiny">Rats earn 1 XP every second in a money slot or as a pet. Each level adds ' + Math.round(cfg.levelMult * 100) + '% earnings.</span></div>' +
      '<div class="rc-break">' + earnRows(r) + '</div>' +
      '<div class="rc-row"><button class="rc-b sm ' + (r.fav ? 'y' : '') + '" data-act="fav" data-id="' + r.id + '">' + (r.fav ? '⭐ Favorite' : '☆ Make favorite') + '</button><button class="rc-b sm ' + (r.lock ? 'k' : '') + '" data-act="lock" data-id="' + r.id + '">' + (r.lock ? '🔒 Locked' : '🔓 Lock') + '</button>' +
      '<button class="rc-b sm" data-act="show" data-id="' + r.id + '">' + (inShow ? '🏛️ Remove from showcase' : '🏛️ Add to showcase') + '</button></div>' +
      '<div class="rc-row">' + mv.join('') + '</div>' +
      '<div class="rc-row"><button class="rc-b sm" data-act="snack" data-id="' + r.id + '" ' + (maxed || !me.d.snacks ? 'disabled' : '') + '>🍪 Feed a snack (' + me.d.snacks + ')</button>' +
      (r.cap < cfg.ratCapMax ? buyBtn('capUp', capP, '⬆️ Level cap +' + cfg.ratCapStep, 'data-id="' + r.id + '"', 'p') : '<span class="rc-tag">Level cap maxed</span>') +
      ((r.evo || 0) < 3 ? '<button class="rc-b sm ' + (dupes.length >= 2 ? 'y' : '') + '" data-act="evo">✨ Evolve (' + Math.min(3, dupes.length + 1) + '/3)</button>' : '<span class="rc-tag">Fully evolved</span>') + '</div>' +
      '<div class="rc-h3">Cosmetics</div><div class="rc-cos">' + RC.COS_SLOTS.map(sl => { const cid = r.cos && r.cos[sl]; return '<button data-act="cos" data-slot="' + sl + '" class="' + (cid ? 'on' : '') + '"><i>' + (cid ? CAT_IC[COS[cid].cat] || '✨' : '➕') + '</i>' + SLOT_N[sl] + '<span class="rc-tiny">' + (cid ? esc(COS[cid].n) : 'Empty') + '</span></button>'; }).join('') + '</div>' +
      '<div class="rc-row end"><button class="rc-b sm r" data-act="sell" data-id="' + r.id + '" ' + (r.lock ? 'disabled title="Unlock it first"' : '') + '>Sell for ' + fmtMoney(RC.sellPrice(cfg, r)) + '</button></div></div></div>';
  }
  function cosPicker(W, b, r, slot) {
    const d = S.me.d, have = COSMETICS.filter(c => c.slot === slot && d.cos[c.id] > 0), cur = r.cos && r.cos[slot];
    const prev = id => ratImg(Object.assign({}, r, { cos: Object.assign({}, r.cos, { [slot]: id }) }), ' style="width:100%;height:96px;object-fit:contain"');
    b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="cosBack">← Back</button><b>' + SLOT_N[slot] + ' for ' + esc(RC.ratName(r)) + '</b><span class="rc-sp"></span>' + (cur ? '<button class="rc-b sm r" data-act="cosUn" data-slot="' + slot + '">Take off ' + esc(COS[cur].n) + '</button>' : '') + '</div>' +
      (have.length ? '<p class="rc-note" style="margin-bottom:10px">Each picture shows how this rat would look. Cosmetics never change rarity or earnings.</p><div class="rc-shop">' + have.map(c => '<div class="rc-item" style="--c:' + c.col + '">' + (cosMesh(c.id) ? prev(c.id) : '<div class="ic">' + (CAT_IC[c.cat] || '✨') + '</div>') + '<b>' + esc(c.n) + '</b><small>You have ' + d.cos[c.id] + ' spare</small><button class="rc-b sm g" data-act="cosEq" data-cos="' + c.id + '">Wear it</button></div>').join('') + '</div>'
        : '<div class="rc-empty"><span style="font-size:36px">🎩</span>You don’t have a spare ' + SLOT_N[slot].toLowerCase() + ' cosmetic. Get them in the Item Shop, from achievements, daily rewards and events.</div>');
  }
  function evoView(W, b, r) {
    const pool = [...S.rats.values()].filter(x => x.id !== r.id && x.sp === r.sp && (x.evo || 0) === (r.evo || 0) && !x.lock);
    pool.sort((a, b2) => (a.fav - b2.fav) || (a.place === 'slot') - (b2.place === 'slot') || a.lvl - b2.lvl);
    const use = pool.slice(0, 2), ok = use.length === 2 && (r.evo || 0) < 3;
    const rank = { rainbow: 3, diamond: 2, gold: 1 }; const res = Object.assign({}, r, { evo: (r.evo || 0) + 1 });
    for (const x of use) { if (!res.mut || (rank[x.mut] || 0) > (rank[res.mut] || 0)) res.mut = x.mut || res.mut; if (!res.wx && x.wx) res.wx = x.wx; if (x.disco) res.disco = 1; res.lvl = Math.max(res.lvl, x.lvl); }
    W.st.evoIds = ok ? [r.id].concat(use.map(x => x.id)) : null;
    b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="evoBack">← Back</button><b>Evolve ' + esc(SP[r.sp].n) + '</b></div>' +
      '<p class="rc-note">Evolution combines three of the same rat at the same stage into one stronger rat. It keeps the best mutations and the highest level, looks fancier and earns ×' + S.cfg.evoMult + ' more. The other two rats are used up. Locked rats are never used.</p>' +
      (ok ? '<div class="rc-row" style="justify-content:center;gap:12px;margin:16px 0">' + [r].concat(use).map(x => '<div style="width:128px">' + ratCard(x, { act: 'none' }) + '</div>').join('<span style="font-size:26px">+</span>') + '<span style="font-size:40px">➜</span><div style="width:150px">' + ratCard(res, { act: 'none', earn: earnOf(res) }) + '</div></div>' +
        (use.some(x => x.fav) ? '<p class="rc-note" style="color:#b03030">One of the rats that will be used up is a favorite. You will be asked to confirm.</p>' : '') +
        (use.some(x => x.place === 'slot' || x.place === 'eq') ? '<p class="rc-note">One of them is in a money slot or is a pet; it will be taken from there.</p>' : '') +
        '<div class="rc-row end"><button class="rc-b g" data-act="evoGo">✨ Evolve!</button></div>'
        : '<div class="rc-empty">' + ((r.evo || 0) >= 3 ? 'This rat is fully evolved.' : 'You need two more unlocked ' + esc(SP[r.sp].n) + 's at the same stage. You have ' + use.length + '.') + '</div>');
  }
  function invAct(a, t) {
    const W = WIN, st = W.st, id = t.dataset.id;
    switch (a) {
      case 'rat': if (st.multi) { if (st.picked.has(id)) st.picked.delete(id); else st.picked.add(id); } else { st.sel = id; W.body.scrollTop = 0; } renderWin(); break;
      case 'back': st.sel = null; renderWin(); break;
      case 'fFav': st.fav = st.fav ? 0 : 1; renderWin(); break; case 'fMut': st.mut = st.mut ? 0 : 1; renderWin(); break;
      case 'multi': st.multi = !st.multi; st.picked.clear(); renderWin(); break;
      case 'pickAll': for (const x of W.shown || []) st.picked.add(x); renderWin(); break; case 'pickNone': st.picked.clear(); renderWin(); break;
      case 'bulkSell': { const list = [...st.picked].map(x => S.rats.get(x)).filter(Boolean); if (!list.length) return; const locked = list.filter(r => r.lock); if (locked.length) { toast({ kind: 'err', text: locked.length + ' of these rats are locked. Unlock them or unpick them first.' }); return; }
        const tot = list.reduce((s0, r) => s0 + RC.sellPrice(S.cfg, r), 0); confirmBox('Sell ' + list.length + ' rat' + (list.length > 1 ? 's' : '') + ' for ' + fmtMoney(tot) + '?', 'Sell', () => { nsend({ t: 'sell', ids: list.map(r => r.id) }); st.picked.clear(); }, { danger: true, icon: '💰' }); break; }
      case 'bulkStore': { const list = [...st.picked].map(x => S.rats.get(x)).filter(Boolean); for (const r of list) nsend({ t: W.tab === 'sto' ? 'unstore' : 'store', id: r.id }); st.picked.clear(); break; }
      case 'fav': case 'star': { const r = S.rats.get(id); if (r) { nsend({ t: 'fav', id, v: r.fav ? 0 : 1 }); if (!r.fav) SFX.coin(); } break; }
      case 'lock': { const r = S.rats.get(id); if (r) nsend({ t: 'lock', id, v: r.lock ? 0 : 1 }); break; }
      case 'show': { const cur = (S.me.d.showcase.rats || []).slice(), i = cur.indexOf(id); if (i >= 0) cur.splice(i, 1); else { if (cur.length >= 6) { toast({ kind: 'err', text: 'A showcase holds 6 rats. Remove one first.' }); return; } cur.push(id); } nsend({ t: 'showcase', ids: cur, theme: S.me.d.showcase.theme }); break; }
      case 'toSlot': { const c = S.me.cap, used = new Set([...S.rats.values()].filter(r => r.place === 'slot').map(r => r.slot)); let free = -1; for (let i = 0; i < c.slots; i++) if (!used.has(i)) { free = i; break; }
        if (free < 0) { toast({ kind: 'err', text: 'All your money slots are full. Open the Rat Bank to swap a rat or unlock more slots.' }); return; } nsend({ t: 'slot', id, slot: free }); break; }
      case 'unslot': nsend({ t: 'unslot', id }); break; case 'equip': nsend({ t: 'equip', id }); break; case 'unequip': nsend({ t: 'unequip', id }); break;
      case 'store': nsend({ t: 'store', id }); break; case 'unstore': nsend({ t: 'unstore', id }); break;
      case 'snack': nsend({ t: 'snack', id }); break; case 'capUp': nsend({ t: 'capUp', id }); break;
      case 'sell': { const r = S.rats.get(id); if (!r) return; confirmBox('Sell ' + RC.ratName(r) + ' for ' + fmtMoney(RC.sellPrice(S.cfg, r)) + '?', 'Sell', () => { nsend({ t: 'sell', ids: [id] }); st.sel = null; }, { danger: true, icon: '💰' }); break; }
      case 'cos': st.cosSlot = t.dataset.slot; renderWin(); break; case 'cosBack': st.cosSlot = null; renderWin(); break;
      case 'cosEq': nsend({ t: 'cosEq', id: st.sel, cos: t.dataset.cos }); st.cosSlot = null; break;
      case 'cosUn': nsend({ t: 'cosUn', id: st.sel, slot: t.dataset.slot }); st.cosSlot = null; break;
      case 'evo': st.evo = true; renderWin(); break; case 'evoBack': st.evo = false; renderWin(); break;
      case 'evoGo': if (st.evoIds) { nsend({ t: 'evolve', ids: st.evoIds }); st.evo = false; } break;
    }
  }


  // ===================== more windows: rewards, quests, index, leaderboards, rooms, trading, rebirth, settings =====================
  function rwText(rw) {
    if (!rw) return ''; const o = [];
    if (rw.money) o.push(rw.special || rw.money < 20 ? 'Money' : fmtMoney(rw.money)); if (rw.potion) o.push(POT[rw.potion].n); if (rw.egg) o.push((rw.n > 1 ? rw.n + '× ' : '') + EGG[rw.egg].n);
    if (rw.cos) o.push(COS[rw.cos].n); if (rw.rod) o.push(rw.rod === 'next' ? 'A better rod' : ROD[rw.rod].n); if (rw.title) o.push('Title “' + rw.title + '”'); if (rw.mystery) o.push('Mystery Box'); if (rw.tokens) o.push(rw.tokens + ' tokens'); return o.join(' + ');
  }
  function openStation(id) {
    const f = { shop: () => openShop(), eggs: openEggs, bank: openBank, inventory: () => openInventory('inv'), storage: () => openInventory('sto'), daily: () => openDaily('daily'), achievements: openAch, index: openIndex, leaderboard: openLeaders, events: openEvents, computer: openRooms, trading: openTrading, rebirth: openRebirth }[id];
    if (f) f();
  }
  const untilUtcMidnight = () => (Math.floor(srvNow() / 86400000) + 1) * 86400000 - srvNow();

  // ---------- daily rewards and quests ----------
  function openDaily(tab) {
    openWin('quests', { title: 'Daily Rewards', sub: 'Come back every day!', icon: '📅', color: '#ff5a5a', tab: tab || 'daily', tabs: [['daily', '🎁 Daily reward'], ['quests', '📜 Daily quests']],
      render(W, b) {
        const d = S.me.d;
        if (W.tab === 'daily') {
          const ds = d.daily, week = Math.floor(Math.max(0, (ds.can ? ds.streak : ds.streak) - 1) / 7);
          b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><span class="rc-pill" style="--c:#ffd23a;font-size:16px">🔥 Streak: ' + (ds.can ? Math.max(0, ds.streak - 1) : ds.streak) + ' day' + ((ds.can ? ds.streak - 1 : ds.streak) === 1 ? '' : 's') + '</span><span class="rc-note">Miss a day and the streak starts again at day 1. Day 7 is extra special.</span></div>' +
            '<div class="rc-days">' + RC.DAILY.map((rw0, i) => { const rw = Object.assign({}, rw0); if (rw.cos === 'chefhat') rw.cos = RC.DAILY_COS_ROTATION[week % RC.DAILY_COS_ROTATION.length];
              const got = i < ds.day || (i === ds.day && !ds.can), now = i === ds.day && ds.can, ic = rw.special ? '👑' : rw.egg ? '🥚' : rw.rod ? '🎣' : rw.mystery ? '🎁' : rw.cos ? '🎩' : rw.potion ? '🧪' : '💰';
              return '<div class="rc-day' + (got ? ' got' : '') + (now ? ' now' : '') + (rw.special ? ' big' : '') + '"><b>Day ' + (i + 1) + '</b><i>' + (got ? '✅' : ic) + '</i><span>' + esc(rwText(rw)) + '</span></div>'; }).join('') + '</div>' +
            '<div class="rc-row end" style="margin-top:14px">' + (ds.can ? '<button class="rc-b g" data-act="claim">Claim day ' + (ds.day + 1) + '!</button>' : '<span class="rc-note">Come back in ' + fmtDur(untilUtcMidnight() / 1000) + ' for day ' + (ds.day % 7 + 2 > 7 ? 1 : ds.day + 2) + '.</span>') + '</div>' +
            '<p class="rc-note" style="margin-top:8px">Money rewards grow with how much your rats earn. A new day starts at midnight UTC.</p>';
        } else {
          const qs = (d.quests && d.quests.list) || [];
          b.innerHTML = '<p class="rc-note" style="margin-bottom:12px">' + qs.length + ' quests today. New quests in ' + fmtDur(untilUtcMidnight() / 1000) + '.</p><div class="rc-list">' + qs.map((q, i) => {
            const done = q.prog >= q.n; return '<div class="rc-li' + (q.claimed ? ' done' : '') + '"><span class="ic">' + (q.claimed ? '✅' : done ? '🎉' : '📜') + '</span><div class="t"><b>' + esc(q.d) + '</b><small>Reward: ' + esc(rwText(q.rw)) + '</small><div class="rc-bar"><i style="width:' + clamp(q.prog / q.n * 100, 0, 100) + '%"></i></div><small>' + (q.stat === 'earned' ? fmtMoney(q.prog) + ' / ' + fmtMoney(q.n) : fmtN(q.prog) + ' / ' + fmtN(q.n)) + '</small></div>' +
              (q.claimed ? '<span class="rc-tag">Claimed</span>' : '<button class="rc-b sm ' + (done ? 'g' : '') + '" data-act="q" data-i="' + i + '" ' + (done ? '' : 'disabled') + '>Claim</button>') + '</div>'; }).join('') + '</div>';
        }
      },
      act(a, t) { if (a === 'claim') nsend({ t: 'daily' }); else if (a === 'q') nsend({ t: 'qclaim', i: +t.dataset.i }); },
      sig: () => JSON.stringify([S.me.d.daily, S.me.d.quests]),
      on(w) { return w === 'me' || w === 'daily'; } });
  }

  // ---------- achievements and titles ----------
  function openAch() {
    openWin('ach', { title: 'Achievement Hall', icon: '🏆', color: '#ffb22e', tabs: [['list', '🏆 Achievements'], ['titles', '🏷️ Titles']],
      subf() { const a = S.me.achs || []; return a.filter(x => x.done).length + ' of ' + a.length + ' unlocked'; },
      render(W, b) {
        const me = S.me;
        if (W.tab === 'list') {
          const A = (me.achs || []).slice().sort((x, y) => (!!y.done - !!x.done) || (y.v / ACH[y.id].goal) - (x.v / ACH[x.id].goal));
          b.innerHTML = '<div class="rc-list">' + A.map(x => { const a = ACH[x.id]; if (!a) return ''; const big = a.goal >= 1e6 && a.stat === 'peakMoney';
            return '<div class="rc-li' + (x.done ? ' done' : '') + '"><span class="ic">' + (x.done ? '🏆' : '🔒') + '</span><div class="t"><b>' + esc(a.n) + '</b><small>' + esc(a.d) + ' · Reward: ' + esc(rwText(a.rw)) + '</small>' +
              (x.done ? '<small>Unlocked ' + new Date(x.done).toLocaleDateString() + '</small>' : '<div class="rc-bar"><i style="width:' + clamp(x.v / a.goal * 100, 0, 100) + '%"></i></div><small>' + (big ? fmtMoney(x.v) + ' / ' + fmtMoney(a.goal) : fmtN(x.v) + ' / ' + fmtN(a.goal)) + '</small>') + '</div></div>'; }).join('') + '</div>';
        } else {
          const ts = me.d.titles || [];
          b.innerHTML = '<p class="rc-note" style="margin-bottom:12px">Your title shows above your name. Earn titles from achievements and rebirths.</p><div class="rc-row">' +
            '<button class="rc-b sm ' + (!me.d.title ? 'y' : '') + '" data-act="title" data-v="">No title</button>' + ts.map(x => '<button class="rc-b sm ' + (me.d.title === x ? 'y' : '') + '" data-act="title" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>' + (ts.length ? '' : '<div class="rc-empty" style="margin-top:12px">No titles yet. Catch your first rat!</div>');
        }
      },
      act(a, t) { if (a === 'title') nsend({ t: 'title', v: t.dataset.v }); }, sig: () => JSON.stringify([S.me.achs, S.me.d.titles, S.me.d.title]), on(w) { return w === 'me'; } });
  }

  // ---------- Rat Index ----------
  const IDX_RW = { 10: '$5,000 + Luck Potion', 25: '$50,000 + 3× $2 Egg', 50: '$2.5M + Super Luck', 75: '$100M + $5 Egg', 100: '$1B + Ultra Luck' };
  function openIndex() {
    openWin('index', { title: 'Rat Index', icon: '📖', color: '#3fa9ff', st: { rar: '', show: '', sel: null },
      subf() { const n = SPECIES.filter(s => (S.me.d.index[s.id] || {}).n > 0).length; return n + ' of ' + SPECIES.length + ' rats found (' + Math.floor(n / SPECIES.length * 100) + '%)'; },
      render(W, b) {
        const ix = S.me.d.index, st = W.st, found = id => ix[id] && ix[id].n > 0;
        if (st.sel) { const s = SP[st.sel], e = ix[s.id], rr = RI[s.r];
          b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="back">← Back</button></div><div class="rc-det"><div class="pic" style="--rc:' + rr.col + '">' + ratImg({ sp: s.id }) + '</div><div style="display:grid;gap:10px;align-content:start"><h3>' + esc(s.n) + '</h3><div class="rc-row">' + rarPill(s.r) + (s.inv ? '<span class="rc-pill" style="--c:#ffb0b0">Invasion rat</span>' : '') + (s.secret ? '<span class="rc-pill" style="--c:#ff9af0">Secret</span>' : '') + '</div>' +
            '<p class="rc-note">' + esc(s.d) + '</p><div class="rc-break"><div><span>Caught or hatched</span><b>' + fmtN(e.n) + '×</b></div><div><span>Base earnings</span><b>' + fmtMoney(RC.baseEarn(S.cfg, s.id), true) + '/s</b></div><div><span>Lives in</span><b>' + (s.inv ? 'Any field, during invasions' : s.fields.length ? s.fields.map(f => FI[f] ? FI[f].n : f).join(', ') : 'Eggs and special events') + '</b></div></div>' +
            '<div class="rc-h3">Variants found</div><div class="rc-row">' + (Object.keys(e.m || {}).length ? Object.keys(e.m).map(k => k.startsWith('evo') ? '<span class="rc-pill" style="--c:#ffe9a8">Evolution ' + k.slice(3) + '</span>' : '<span class="rc-pill" style="--c:' + MUTATIONS[k].col + '">' + MUTATIONS[k].n + '</span>').join('') : '<span class="rc-note">Only the normal kind so far.</span>') + '</div></div></div>';
          return; }
        const n = SPECIES.filter(s => found(s.id)).length, pct = n / SPECIES.length * 100;
        let list = SPECIES.slice(); if (st.rar) list = list.filter(s => s.r === st.rar); if (st.show === 'found') list = list.filter(s => found(s.id)); if (st.show === 'missing') list = list.filter(s => !found(s.id));
        b.innerHTML = '<div class="rc-bar" style="height:20px"><i style="width:' + pct + '%"></i></div><div class="rc-row" style="margin:8px 0 12px">' + [10, 25, 50, 75, 100].map(ms => '<span class="rc-pill" style="--c:' + ((S.me.d.idxMs || []).includes(ms) ? '#c8f5c0' : '#fff') + '" title="' + IDX_RW[ms] + '">' + ((S.me.d.idxMs || []).includes(ms) ? '✅ ' : '') + ms + '%: ' + IDX_RW[ms] + '</span>').join('') + '</div>' +
          '<div class="rc-tool"><select class="rc-sel" data-ch="rar"><option value="">All rarities</option>' + RARITIES.map(r => '<option value="' + r.id + '"' + (st.rar === r.id ? ' selected' : '') + '>' + r.n + '</option>').join('') + '</select><div class="rc-seg">' + [['', 'All'], ['found', 'Found'], ['missing', 'Missing']].map(x => '<button data-act="show" data-v="' + x[0] + '" class="' + (st.show === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div></div>' +
          '<div class="rc-idx">' + list.map(s => { const k = found(s.id), rr = RI[s.r], hide = s.secret && !k;
            return '<div class="rc-card' + (k ? '' : ' unk') + '" data-act="' + (k ? 'sel' : 'none') + '" data-id="' + s.id + '" style="--rc:' + (hide ? '#888' : rr.col) + '">' + (hide ? '<div style="height:84px;display:grid;place-items:center;font-size:44px">❔</div>' : ratImg({ sp: s.id })) +
              '<b>' + (k ? esc(s.n) : hide ? 'Secret ???' : '???') + '</b><small>' + (hide ? 'Hidden until found' : rr.n) + '</small>' + (k ? '<div class="earn">×' + ix[s.id].n + '</div>' : s.inv ? '<span class="rc-tiny">Invasion rat</span>' : !hide && s.fields.length ? '<span class="rc-tiny">' + esc(FI[s.fields[0]].n) + '</span>' : '') + '</div>'; }).join('') + '</div>';
      },
      ch(k, t) { if (k === 'rar') { WIN.st.rar = t.value; renderWin(); } },
      act(a, t) { const st = WIN.st; if (a === 'sel') { st.sel = t.dataset.id; WIN.body.scrollTop = 0; renderWin(); } else if (a === 'back') { st.sel = null; renderWin(); } else if (a === 'show') { st.show = t.dataset.v; renderWin(); } },
      sig: () => JSON.stringify([S.me.d.index, S.me.d.idxMs]), on(w) { return w === 'me'; } });
  }

  // ---------- leaderboards ----------
  const LB = [['money', '💰 Richest'], ['rarity', '💎 Rarest collection'], ['caught', '🐀 Most rats caught'], ['level', '⭐ Highest level'], ['rebirths', '♻️ Most rebirths'], ['mutation', '🌈 Best mutations'], ['trades', '🤝 Most trades']];
  function lbVal(cat, v, row) { return cat === 'money' ? fmtMoney(v) : cat === 'level' ? 'Lv ' + v + (row && row.reb ? ' · ' + row.reb + ' reb.' : '') : fmtN(v) + (cat === 'rarity' || cat === 'mutation' ? ' pts' : ''); }
  function openLeaders(tab) {
    const ask = cat => { const d = S.lbData[cat]; if (!d || Date.now() - (d.got || 0) > 30000) nsend({ t: 'lb', cat }); };
    openWin('lb', { title: 'Leaderboards', sub: 'Every player on this server', icon: '🏆', color: '#3fa9ff', tab: tab || 'money', tabs: LB,
      onTab(t) { ask(t); },
      render(W, b) {
        const d = S.lbData[W.tab]; if (!d) { b.innerHTML = '<div class="rc-empty">Loading…</div>'; return; }
        const meId = S.me.id, rows = d.l || [];
        b.innerHTML = '<p class="rc-note" style="margin-bottom:10px">Updated ' + fmtDur((srvNow() - d.at) / 1000) + ' ago. The boards refresh every minute.</p>' +
          (d.me ? '<div class="rc-lb" style="margin-bottom:10px"><div class="me"><span class="rk">#' + fmtN(d.me.rank) + '</span><span class="av" style="background:' + esc(S.me.color) + '">' + esc(S.me.name[0].toUpperCase()) + '</span><b>You (' + esc(S.me.name) + ')</b><b>' + lbVal(W.tab, d.me.v) + '</b></div></div>' : '') +
          (rows.length ? '<div class="rc-lb">' + rows.map(r => '<div class="' + (r.id === meId ? 'me' : '') + '"><span class="rk">' + (r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : '#' + r.rank) + '</span><span class="av" style="background:' + esc(r.c) + '">' + esc((r.n || '?')[0].toUpperCase()) + '</span><b>' + esc(r.n) + '</b><b>' + lbVal(W.tab, r.v, r) + '</b></div>').join('') + '</div>' : '<div class="rc-empty">Nobody here yet.</div>');
      },
      on(w) { return w === 'lb'; } });
    ask(WIN.tab);
  }

  // ---------- the event board ----------
  function openEvents() {
    openWin('events', { title: 'Event Board', sub: 'Events reach every room on the server', icon: '📣', color: '#ff7a3a',
      render(W, b) {
        const t = srvNow(), act = S.events.active || [], L = ltdState(), dur = id => (S.cfg.eventDur && S.cfg.eventDur[id]) || EVENTS[id].dur;
        b.innerHTML = '<div class="rc-h3">Happening now</div><div class="rc-list">' +
          (S.events.inv ? '<div class="rc-li" style="background:#ffe3e6"><span class="ic">👾</span><div class="t"><b>Rat Invasion!</b><small>Invader rats you can’t find anywhere else are in every field, and many more rats appear. Ends in ' + fmtDur((S.events.inv.ends - t) / 1000) + '.</small></div></div>' : '') +
          act.map(e => { const d = EVENTS[e.id]; return d ? '<div class="rc-li" style="background:color-mix(in srgb,' + d.col + ' 30%,#fff)"><span class="ic">✨</span><div class="t"><b>' + esc(d.n) + '</b><small>' + esc(d.d) + ' Ends in ' + fmtDur((e.ends - t) / 1000) + '.</small></div></div>' : ''; }).join('') +
          (!act.length && !S.events.inv ? '<div class="rc-empty">No event right now. Events start by themselves every so often, or when the owner starts one.</div>' : '') + '</div>' +
          '<div class="rc-row" style="margin:10px 0"><span class="rc-pill">Weather: ' + ({ clear: '☀️ Clear', rain: '🌧️ Rain', snow: '❄️ Snow', storm: '⛈️ Storm', ultra: '🌈 Ultra' }[S.events.weather] || S.events.weather) + '</span><span class="rc-pill" style="--c:#ffd0e0">Limited-Time Egg: ' + esc(L.text) + '</span></div>' +
          '<div class="rc-h3">Every event</div><div class="rc-shop">' + Object.keys(EVENTS).map(id => { const d = EVENTS[id]; return '<div class="rc-item" style="--c:' + d.col + '"><b>' + esc(d.n) + '</b><small>' + esc(d.d) + '</small><small>Lasts ' + fmtDur(dur(id)) + '</small></div>'; }).join('') + '</div>' +
          (S.annLog.length ? '<div class="rc-h3" style="margin-top:14px">Recent announcements</div><div class="rc-list">' + S.annLog.slice(0, 10).map(a => '<div class="rc-li"><span class="ic">📢</span><div class="t"><b>' + esc(a.text) + '</b><small>' + new Date(a.at || Date.now()).toLocaleTimeString() + '</small></div></div>').join('') + '</div>' : '');
      },
      on(w) { return w === 'events' || w === 'ann' || w === 'cfg'; } });
  }

  // ---------- the room computer ----------
  function openRooms() {
    if (noServer() && peerOk()) return openPeerRooms();
    nsend({ t: 'rooms' });
    openWin('rooms', { title: 'Room Computer', sub: 'Up to 20 players in a room', icon: '🖥️', color: '#3fa9ff',
      render(W, b) {
        const R = S.room || {}, me = S.me;
        b.innerHTML = '<div class="rc-cols"><div class="rc-room"><span class="rc-note">You are in ' + (R.pub ? 'a public' : 'a private') + ' room</span><div class="code">' + esc(R.code || '------') + '</div><span class="rc-tag">' + S.roster.length + ' / 20 players</span><button class="rc-b sm y" data-act="copy">📋 Copy code</button><span class="rc-tiny">Friends can join with this code.</span></div>' +
          '<div style="display:grid;gap:8px;align-content:start"><div class="rc-label">Join a room with a code</div><div class="rc-row"><input class="rc-in" style="flex:1;min-width:0;text-transform:uppercase" maxlength="8" placeholder="ABC123" data-keep="code"><button class="rc-b sm g" data-act="join">Join</button></div>' +
          '<div class="rc-row"><button class="rc-b sm" data-act="pub">🌍 Join a public room</button></div><div class="rc-label">Make a new room</div><div class="rc-row"><button class="rc-b sm bl" data-act="mk" data-pub="1">New public room</button><button class="rc-b sm p" data-act="mk" data-pub="0">New private room</button></div>' +
          '<div class="rc-label">Invite a friend who is online</div><div class="rc-row"><input class="rc-in" style="flex:1;min-width:0" maxlength="16" placeholder="Their player name" data-keep="inv"><button class="rc-b sm y" data-act="invite">Invite</button></div></div></div>' +
          '<div class="rc-h3" style="margin-top:16px">Players in this room</div><div class="rc-list">' + S.roster.map(p => '<div class="rc-li"><span class="av" style="width:38px;height:38px;border-radius:50%;border:3px solid var(--ink);display:grid;place-items:center;color:#fff;font-weight:700;background:' + esc(p.c) + '">' + esc(p.n[0].toUpperCase()) + '</span><div class="t"><b>' + esc(p.n) + (p.id === me.id ? ' (you)' : '') + '</b><small>' + (p.ti ? esc(p.ti) + ' · ' : '') + 'Level ' + p.lvl + (p.reb ? ' · ' + p.reb + ' rebirths' : '') + ' · ' + (p.area === 'lobby' ? 'in the lobby' : FI[p.area] ? 'in ' + FI[p.area].n : '') + '</small></div>' +
            (p.id !== me.id ? '<button class="rc-b xs" data-act="insp" data-id="' + p.id + '">Showcase</button><button class="rc-b xs bl" data-act="trade" data-id="' + p.id + '">Trade</button>' : '') + '</div>').join('') + '</div>' +
          '<div class="rc-row" style="margin-top:16px"><div class="rc-h3" style="margin:0">Public rooms</div><span class="rc-sp"></span><button class="rc-b xs" data-act="refresh">Refresh</button></div><div class="rc-list" style="margin-top:8px">' + ((S.roomList || []).length ? S.roomList.map(r => '<div class="rc-li"><span class="ic">🌍</span><div class="t"><b>' + esc(r.name) + '</b><small>Code ' + esc(r.code) + ' · ' + r.n + '/' + r.max + ' players</small></div>' + (r.code === R.code ? '<span class="rc-tag">You are here</span>' : '<button class="rc-b xs g" data-act="joinc" data-code="' + esc(r.code) + '" ' + (r.n >= r.max ? 'disabled' : '') + '>Join</button>') + '</div>').join('') : '<div class="rc-empty">No public rooms listed yet.</div>') + '</div>';
      },
      act(a, t) {
        const v = k => { const i = WIN.body.querySelector('[data-keep="' + k + '"]'); return i ? i.value.trim() : ''; };
        if (a === 'copy') { const c = S.room && S.room.code; try { win.navigator.clipboard.writeText(c).then(() => toast({ kind: 'ok', text: 'Room code copied: ' + c })).catch(() => toast({ kind: 'room', text: 'Room code: ' + c })); } catch (e) { toast({ kind: 'room', text: 'Room code: ' + c }); } }
        else if (a === 'join') { const c = v('code').toUpperCase(); if (c.length < 4) { toast({ kind: 'err', text: 'Type a room code first.' }); return; } nsend({ t: 'join', code: c }); }
        else if (a === 'joinc') nsend({ t: 'join', code: t.dataset.code }); else if (a === 'pub') nsend({ t: 'joinPub' });
        else if (a === 'mk') nsend({ t: 'mkroom', pub: t.dataset.pub === '1' });
        else if (a === 'invite') { const n = v('inv'); if (n.length < 3) { toast({ kind: 'err', text: 'Type your friend’s player name.' }); return; } nsend({ t: 'invite', name: n }); }
        else if (a === 'refresh') nsend({ t: 'rooms' }); else if (a === 'insp') nsend({ t: 'insp', id: +t.dataset.id }); else if (a === 'trade') nsend({ t: 'tReq', to: +t.dataset.id });
      },
      sig: () => JSON.stringify([S.room, S.roster.map(p => [p.id, p.n, p.lvl, p.area, p.ti, p.reb]), S.roomList]),
      on(w, d) { if (w === 'rooms') { S.roomList = d.l; return true; } return w === 'roster'; } });
  }

  // rooms without a server: your game is the room, friends join it with your code
  function openPeerRooms() {
    peerUp();
    openWin('rooms', { title: 'Room Computer', sub: 'Play with up to 19 friends · no server needed', icon: '🖥️', color: '#3fa9ff',
      render(W, b) {
        const i = peerInfo() || { code: '', status: 'off', guests: [] }, me = S.me, vis = isPeer();
        const st = { online: ['#5fdc6a', 'Online: friends can join with your code'], connecting: ['#ffcf3a', 'Connecting to the internet…'], taken: ['#ff5c8a', 'This code is open in another tab'], offline: ['#ff5c8a', 'Offline: only tabs on this computer can join'], off: ['#ff5c8a', 'Rooms are off'] }[i.status] || ['#ffcf3a', '…'];
        const dot = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + st[0] + ';border:2px solid var(--ink);margin-right:6px"></span>';
        const card = vis
          ? '<div class="rc-room"><span class="rc-note">You are visiting</span><div class="code" style="font-size:26px">' + esc((NET.peerHost || 'A friend') + '’s room') + '</div><span class="rc-tag">' + S.roster.length + ' / 20 players</span><button class="rc-b sm r" data-act="home">🏠 Back to my own game</button><span class="rc-tiny">Your progress is saved on this device as you play.</span></div>'
          : '<div class="rc-room"><span class="rc-note">Your room code</span><div class="code">' + esc(showPeer(i.code) || '------') + '</div><span class="rc-tag">' + S.roster.length + ' / 20 players</span><button class="rc-b sm y" data-act="copy">📋 Copy code</button><span class="rc-tiny">' + dot + esc(st[1]) + '</span></div>';
        b.innerHTML = '<div class="rc-cols">' + card +
          '<div style="display:grid;gap:8px;align-content:start"><div class="rc-label">Join a friend’s room</div><div class="rc-row"><input class="rc-in" style="flex:1;min-width:0;text-transform:uppercase" maxlength="8" placeholder="K7M-2QX" data-keep="code"><button class="rc-b sm g" data-act="join">Join</button></div>' +
          '<p class="rc-note">No server needed: your games connect to each other directly. Send your code to a friend, or type theirs. Your rats and money always stay saved on your own device. The room stays open while its owner is playing.</p>' +
          (vis ? '' : '<label class="rc-chk' + (store.auto ? ' on' : '') + '" style="justify-self:start"><input type="checkbox" data-ch="auto" ' + (store.auto ? 'checked' : '') + '> Open to everyone: fill my room with other players' + (i.pub ? ' (open now)' : '') + '</label>') +
          '<div class="rc-row"><button class="rc-b sm bl" data-act="find">🌍 Find a lobby with players</button>' + (VOICE.on ? '' : '<button class="rc-b sm" data-act="voice">🎤 Voice chat</button>') + '</div>' +
          (!vis && i.guests.length ? '<div class="rc-label">Connection</div>' + i.guests.map(g => '<div class="rc-row"><span class="rc-tiny" style="flex:1">' + esc(g.name) + ' · ' + ({ direct: 'direct link', relay: 'relayed (a bit slower)', opening: 'connecting…' }[g.link] || 'relayed') + '</span><button class="rc-b xs r" data-act="kick" data-c="' + esc(g.code) + '">Remove</button></div>').join('') : '') + '</div></div>' +
          '<div class="rc-h3" style="margin-top:16px">Players in this room</div><div class="rc-list">' + S.roster.map(p => '<div class="rc-li"><span class="av" style="width:38px;height:38px;border-radius:50%;border:3px solid var(--ink);display:grid;place-items:center;color:#fff;font-weight:700;background:' + esc(p.c) + '">' + esc(p.n[0].toUpperCase()) + '</span><div class="t"><b>' + esc(p.n) + (p.id === me.id ? ' (you)' : '') + '</b><small>' + (p.ti ? esc(p.ti) + ' · ' : '') + 'Level ' + p.lvl + (p.reb ? ' · ' + p.reb + ' rebirths' : '') + ' · ' + (p.area === 'lobby' ? 'in the lobby' : FI[p.area] ? 'in ' + FI[p.area].n : '') + '</small></div>' +
            (p.vc ? '<span class="rc-tag">🎤</span>' : '') + (p.id !== me.id ? '<button class="rc-b xs" data-act="mute" data-n="' + esc(p.n) + '">' + (isMuted(p.n) ? '🔇 Unmute' : '🔈 Mute') + '</button><button class="rc-b xs" data-act="insp" data-id="' + p.id + '">Showcase</button><button class="rc-b xs bl" data-act="trade" data-id="' + p.id + '">Trade</button>' : '') + '</div>').join('') +
          (S.roster.length < 2 ? '<div class="rc-empty">Just you so far. Share your code to bring friends in!</div>' : '') + '</div>';
      },
      act(a, t) {
        const v = k => { const i = WIN.body.querySelector('[data-keep="' + k + '"]'); return i ? i.value.trim() : ''; };
        if (a === 'copy') { const c = showPeer((peerInfo() || {}).code); if (!c) return; try { win.navigator.clipboard.writeText(c).then(() => toast({ kind: 'ok', text: 'Room code copied: ' + c })).catch(() => toast({ kind: 'room', text: 'Your room code: ' + c })); } catch (e) { toast({ kind: 'room', text: 'Your room code: ' + c }); } }
        else if (a === 'join') visitRoom(v('code'));
        else if (a === 'home') goHome('You’re back in your own game.');
        else if (a === 'kick') win.RC_PEER.kick(t.dataset.c);
        else if (a === 'mute') muteToggle(t.dataset.n);
        else if (a === 'voice') { voiceToggle(); setTimeout(renderWin, 600); }
        else if (a === 'find') findLobby();
        else if (a === 'insp') nsend({ t: 'insp', id: +t.dataset.id }); else if (a === 'trade') nsend({ t: 'tReq', to: +t.dataset.id });
      },
      ch(k, t) { if (k === 'auto') { store.auto = t.checked; persist(); if (store.auto) matchPublic(); else win.RC_PEER.publish(false).then(() => renderWin()); renderWin(); } },
      sig: () => JSON.stringify([S.room, S.roster.map(p => [p.id, p.n, p.lvl, p.area, p.ti, p.reb, p.vc, isMuted(p.n)]), peerInfo(), NET.url, store.auto, VOICE.on]),
      on(w) { return w === 'roster' || w === 'peer'; } });
  }

  // ---------- trading ----------
  function openTrading() {
    if (S.trade) return tradeWin();
    nsend({ t: 'history' });
    openWin('trading', { title: 'Trading Area', sub: 'Swap rats safely: the game checks every trade', icon: '🤝', color: '#3fa9ff',
      render(W, b) {
        const me = S.me, others = S.roster.filter(p => p.id !== me.id);
        b.innerHTML = (noServer() && S.roster.length < 2 ? '<div class="rc-li" style="margin-bottom:12px;background:#fff3c4"><span class="ic">ℹ️</span><div class="t"><b>Nobody to trade with yet.</b><small>Bring friends into your room with your room code (Room Computer), or join theirs. No server needed.</small></div></div>' : '') + '<p class="rc-note" style="margin-bottom:12px">Ask a player in your room to trade. You both add rats, both press Ready, then both confirm. After a 5 second countdown the game swaps the rats. Locked rats can’t be traded, and if anyone leaves, the trade is cancelled.</p>' +
          '<div class="rc-h3">Players in your room</div><div class="rc-list">' + (others.length ? others.map(p => '<div class="rc-li"><span class="ic">🙂</span><div class="t"><b>' + esc(p.n) + '</b><small>Level ' + p.lvl + (p.ti ? ' · ' + esc(p.ti) : '') + '</small></div><button class="rc-b sm bl" data-act="req" data-id="' + p.id + '">Ask to trade</button></div>').join('') : '<div class="rc-empty">Nobody else is in this room. Invite a friend from the Room Computer!</div>') + '</div>' +
          '<div class="rc-h3" style="margin-top:16px">Your recent trades</div><div class="rc-list">' + ((S.history || []).length ? S.history.slice(0, 15).map(h => { const mine = h.a === me.id ? h.ar : h.br, got = h.a === me.id ? h.br : h.ar;
            return '<div class="rc-li"><span class="ic">🔁</span><div class="t"><b>Gave ' + (mine.map(r => esc(RC.ratName(r))).join(', ') || 'nothing') + '</b><small>Got ' + (got.map(r => esc(RC.ratName(r))).join(', ') || 'nothing') + ' · ' + new Date(h.at).toLocaleString() + '</small></div></div>'; }).join('') : '<div class="rc-empty">No trades yet.</div>') + '</div>';
      },
      act(a, t) { if (a === 'req') nsend({ t: 'tReq', to: +t.dataset.id }); },
      on(w, d) { if (w === 'history') { S.history = d.l; return true; } return w === 'roster'; } });
  }
  function tradeAsk(m) { toast({ kind: 'trade', text: m.n + ' wants to trade with you.', sub: 'Accept to open the trade window.', btn: 'Accept', on: () => nsend({ t: 'tAns', from: m.from, ok: 1 }) }); SFX.ann('chime'); }
  function tradeView(m) { const was = S.trade; S.trade = m; if (!was || !WIN || WIN.id !== 'trade') { tradeWin(); SFX.trade(); } else renderWin(); if (m.ends && (!was || !was.ends)) SFX.tick(); }
  function tradeEnd(m) {
    S.trade = null; if (WIN && WIN.id === 'trade') closeWin(true);
    if (m.ok) {
      SFX.trade(); setTimeout(() => SFX.reveal(Math.max(0, ...m.got.map(r => RI[SP[r.sp].r].i), 0)), 350);
      const d = overlayOpen('<div class="flash on"></div><div class="res"><div class="rays" style="--c:#45b0ff"></div><b>TRADE COMPLETE!</b><div class="rc-trade-got">' + (m.got.length ? m.got.map((r, i) => '<div style="--d:' + (i * 0.12) + 's">' + ratImg(r) + '<span>' + esc(RC.ratName(r)) + '</span></div>').join('') : '<span class="tap">You gave your rats away as a gift.</span>') + '</div><div class="tap">Click to continue</div></div>');
      d.addEventListener('click', () => overlayClose()); later(5000, overlayClose);
      toast({ kind: 'trade', text: 'Trade complete!', sub: 'You got ' + (m.got.length ? m.got.map(r => RC.ratName(r)).join(', ') : 'nothing') + '.' });
    }
    else toast({ kind: 'err', text: m.why || 'The trade was cancelled.' });
  }
  function tradeWin() {
    openWin('trade', { title: 'Trade', icon: '🤝', color: '#3fa9ff', st: { add: false },
      subf() { return S.trade ? 'with ' + S.trade.with.n : ''; },
      render(W, b) {
        const T = S.trade; if (!T) { b.innerHTML = '<div class="rc-empty">The trade has ended.</div>'; return; }
        const sum = l => l.reduce((a, r) => a + (r.earn || 0), 0), offered = new Set(T.mine.map(r => r.id));
        if (W.st.add) {
          const list = [...S.rats.values()].filter(r => !offered.has(r.id) && (r.place === 'inv' || r.place === 'sto' || r.lock)).sort(SORTS.rarity[1]);
          b.innerHTML = '<div class="rc-row" style="margin-bottom:12px"><button class="rc-b sm" data-act="addBack">← Back to the trade</button><span class="rc-note">Rats in money slots or equipped as pets must be taken out first. Locked rats can’t be traded.</span></div>' +
            (list.length ? '<div class="rc-grid">' + list.map(r => ratCard(r, { act: r.lock ? 'none' : 'add', dim: r.lock })).join('') + '</div>' : '<div class="rc-empty">No rats you can offer.</div>');
          return;
        }
        const cnt = T.ends ? Math.max(0, Math.ceil((T.ends - srvNow()) / 1000)) : 0;
        const side = (title, rats, rdy, cf, mine) => '<div class="side' + (rdy ? ' ready' : '') + '"><h4>' + title + '<span>' + (cf ? '✅ Confirmed' : rdy ? '👍 Ready' : '…') + '</span></h4>' +
          (rats.length ? '<div class="rc-grid" style="grid-template-columns:repeat(auto-fill,minmax(112px,1fr))">' + rats.map(r => ratCard(r, { act: mine && !T.ends ? 'rem' : 'none', earn: r.earn, cosList: true })).join('') + '</div>' : '<div class="rc-empty" style="padding:16px">No rats yet</div>') +
          '<span class="rc-tiny">Together they earn ' + fmtMoney(sum(rats)) + '/s' + (rats.some(r => r.cos && Object.keys(r.cos).length) ? ' · wearing cosmetics' : '') + '</span>' + (mine && !T.ends ? '<button class="rc-b sm" data-act="addOpen">＋ Add rats</button>' : '') + '</div>';
        b.innerHTML = '<div class="rc-trade">' + side('You give', T.mine, T.ready.me, T.conf.me, true) + side(esc(T.with.n) + ' gives', T.theirs, T.ready.them, T.conf.them, false) + '</div>' +
          (T.ends ? '<div class="rc-count">Swapping in ' + cnt + '…</div>' : '') +
          '<p class="rc-note" style="margin:10px 0">Check both sides carefully. Changing the offer resets Ready. ' + (T.ready.me && T.ready.them ? 'Both of you are ready: press Confirm to start the countdown.' : 'Press Ready when you like the offer.') + '</p>' +
          '<div class="rc-row end"><button class="rc-b sm r" data-act="cancel">Cancel trade</button>' + (T.ends ? '' : '<button class="rc-b sm ' + (T.ready.me ? '' : 'y') + '" data-act="ready">' + (T.ready.me ? 'Not ready' : '👍 Ready') + '</button><button class="rc-b sm g" data-act="confirm" ' + (T.ready.me && T.ready.them && !T.conf.me ? '' : 'disabled') + '>✅ Confirm trade</button>') + '</div>';
      },
      act(a, t) {
        const T = S.trade; if (!T) return;
        if (a === 'addOpen') { WIN.st.add = true; renderWin(); } else if (a === 'addBack') { WIN.st.add = false; renderWin(); }
        else if (a === 'add') { nsend({ t: 'tAdd', id: t.dataset.id }); WIN.st.add = false; }
        else if (a === 'rem') nsend({ t: 'tRem', id: t.dataset.id }); else if (a === 'ready') nsend({ t: 'tReady', v: T.ready.me ? 0 : 1 });
        else if (a === 'confirm') nsend({ t: 'tConfirm' }); else if (a === 'cancel') nsend({ t: 'tCancel' });
      },
      onClose() { if (S.trade) toast({ kind: 'trade', text: 'The trade is still open.', sub: 'Open the Trading Area to get back to it.' }); },
      on(w) { return w === 'rats'; } });
  }

  // ---------- rebirth ----------
  function openRebirth() {
    openWin('rebirth', { title: 'Rebirth Altar', icon: '♻️', color: '#ff6fb5',
      render(W, b) {
        const me = S.me, cfg = S.cfg, need = RC.rebirthNeed(cfg, me.rebirths), n = me.rebirths, ok = me.level >= need;
        const luckNow = Math.round(cfg.rebirthLuck * n * 100), luckNext = Math.round(cfg.rebirthLuck * (n + 1) * 100), earnNow = Math.round(cfg.rebirthEarn * n * 100), earnNext = Math.round(cfg.rebirthEarn * (n + 1) * 100);
        W.st.resets = ['Your level goes back to 1 and your level XP to 0.', 'Fields lock again until you reach their levels (Starter Meadow is always open).'].concat(cfg.rebirthResetsMoney ? ['Your money goes to $0 (you have ' + fmtMoney(me.money) + ').'] : []);
        b.innerHTML = '<div class="rc-cols"><div style="display:grid;gap:10px;align-content:start"><div class="rc-h3">Rebirth ' + (n + 1) + '</div><div class="rc-row"><b>Level ' + me.level + ' / ' + need + '</b></div><div class="rc-bar"><i style="width:' + clamp(me.level / need * 100, 0, 100) + '%"></i></div>' +
          '<div class="rc-break"><div><span>Permanent luck</span><b>+' + luckNow + '% → +' + luckNext + '%</b></div><div><span>Permanent earnings</span><b>+' + earnNow + '% → +' + earnNext + '%</b></div><div><span>New title</span><b>Reborn' + (n + 1 > 1 ? ' ' + ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][Math.min(10, n + 1)] : '') + '</b></div>' +
          (n === 0 ? '<div><span>Special area</span><b>Reborn Sanctuary opens</b></div><div><span>Cosmetic</span><b>Reborn Crown</b></div>' : n === 4 ? '<div><span>Cosmetic</span><b>Reborn Aura</b></div>' : '') + '</div></div>' +
          '<div style="display:grid;gap:10px;align-content:start"><div class="rc-h3" style="color:#c0303a">What resets</div><ul style="margin:0;padding-left:18px;font-weight:600">' + W.st.resets.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
          '<div class="rc-h3" style="color:#1d7a2e">What you keep</div><ul style="margin:0;padding-left:18px;font-weight:600"><li>Every rat: backpack, storage, money slots and pets</li><li>Money slots, storage and backpack upgrades</li><li>Rods, potions, eggs, Mystery Boxes and cosmetics</li><li>Your Rat Index, achievements and titles</li></ul></div></div>' +
          '<div class="rc-row end" style="margin-top:14px">' + (ok ? '<button class="rc-b p" data-act="go">♻️ Rebirth now</button>' : '<span class="rc-note">Reach level ' + need + ' to rebirth.</span>') + '</div>';
      },
      sig: () => [S.me.level, S.me.rebirths, Math.floor(S.me.money), JSON.stringify(S.cfg.rebirthLevel)].join(),
      act(a) { if (a !== 'go') return; const R = WIN.st.resets; confirmBox('', 'Rebirth', () => nsend({ t: 'rebirth', confirm: 1 }), { danger: true, icon: '♻️', title: 'Rebirth now?', html: '<p>This will happen:</p><ul style="font-weight:600">' + R.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p>You keep every rat and item. This can’t be undone.</p>' }); },
      on(w) { return w === 'me' || w === 'cfg'; } });
  }

  // ---------- showcases ----------
  const THEMES_SC = { classic: ['Classic', '#ffd23a'], royal: ['Royal', '#a87bff'], neon: ['Neon', '#2fe8d0'], nature: ['Nature', '#6fd35a'], galaxy: ['Galaxy', '#6a5cff'], candy: ['Candy', '#ff7ac0'] };
  function openShowcaseEdit() {
    openWin('showcase', { title: 'Your Showcase', sub: 'Show off up to 6 rats in the Showcase Hall', icon: '🏛️', color: '#ffb22e',
      st: { ids: (S.me.d.showcase.rats || []).slice(), theme: S.me.d.showcase.theme || 'classic' },
      render(W, b) {
        const st = W.st, picked = st.ids.map(id => S.rats.get(id)).filter(Boolean), rest = [...S.rats.values()].filter(r => !st.ids.includes(r.id)).sort(SORTS.rarity[1]);
        b.innerHTML = '<div class="rc-tool"><b>Theme:</b><div class="rc-seg">' + Object.keys(THEMES_SC).map(k => '<button data-act="theme" data-v="' + k + '" class="' + (st.theme === k ? 'on' : '') + '">' + THEMES_SC[k][0] + '</button>').join('') + '</div><span class="rc-sp"></span><button class="rc-b sm g" data-act="save">Save showcase</button></div>' +
          '<div class="rc-h3">On display (' + picked.length + '/6) — click to remove</div>' + (picked.length ? '<div class="rc-grid" style="margin-bottom:14px">' + picked.map(r => ratCard(r, { act: 'rem' })).join('') + '</div>' : '<div class="rc-empty" style="margin-bottom:14px">Pick rats below to show them off.</div>') +
          '<div class="rc-h3">Your rats — click to add</div><div class="rc-grid">' + rest.map(r => ratCard(r, { act: 'add', dim: picked.length >= 6 })).join('') + '</div>';
      },
      act(a, t) { const st = WIN.st; if (a === 'theme') st.theme = t.dataset.v; else if (a === 'rem') st.ids = st.ids.filter(x => x !== t.dataset.id); else if (a === 'add') { if (st.ids.length >= 6) { toast({ kind: 'err', text: 'A showcase holds 6 rats.' }); return; } st.ids.push(t.dataset.id); } else if (a === 'save') { nsend({ t: 'showcase', ids: st.ids, theme: st.theme }); toast({ kind: 'ok', text: 'Showcase saved!' }); closeWin(); return; } renderWin(); } });
  }
  function showInspect(m) {
    if (S.me && m.id === S.me.id) return openShowcaseEdit();
    const th = THEMES_SC[m.theme] || THEMES_SC.classic;
    openWin('insp', { title: m.n + '’s showcase', sub: (m.ti ? m.ti + ' · ' : '') + 'Level ' + m.lvl + (m.reb ? ' · ' + m.reb + ' rebirths' : ''), icon: '🏛️', color: th[1], cls: 'mid',
      render(W, b) { b.innerHTML = m.rats.length ? '<div class="rc-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' + m.rats.map(r => ratCard(Object.assign({ id: r.id }, r), { act: 'none', earn: r.earn })).join('') + '</div><p class="rc-note" style="margin-top:10px">Owner: ' + esc(m.n) + '. Earnings shown are what each rat makes for its owner.</p>' : '<div class="rc-empty">' + esc(m.n) + ' hasn’t put any rats on display yet.</div>'; } });
  }
  function refreshShowcases() { if (WIN && WIN.id === 'rooms') renderWin(); }
  function playerMenu(o) {
    openWin('player', { title: o.n, sub: 'Level ' + (o.lvl || 1) + (o.ti ? ' · ' + o.ti : ''), icon: '🙂', color: o.c || '#ff9f1a', cls: 'narrow',
      render(W, b) { b.innerHTML = '<div style="display:grid;gap:10px"><button class="rc-b wide" data-act="insp">🏛️ Look at their showcase</button><button class="rc-b wide bl" data-act="trade">🤝 Ask to trade</button></div>'; },
      act(a) { if (a === 'insp') nsend({ t: 'insp', id: o.id }); else if (a === 'trade') { nsend({ t: 'tReq', to: o.id }); closeWin(); } } });
  }

  // ---------- settings ----------
  const COLORS = ['#ff9f1a', '#45b0ff', '#5fdc6a', '#ff5c8a', '#b876ff', '#ffcf3a', '#2fd8c0', '#ff5a3a', '#8a5a3c', '#3a3a55'];
  function openSettings(tab) {
    openWin('settings', { title: 'Settings', icon: '⚙️', color: '#7a6a8a', tab: tab || 'game', tabs: [['game', '🎮 Game'], ['social', '💬 Chat & voice'], ['account', '👤 Account'], ['help', '❓ Controls']], cls: 'mid',
      render(W, b) {
        const me = S.me;
        if (W.tab === 'game') {
          const sl = (k, label, v, min, max, step) => '<div class="rc-label">' + label + '</div><input type="range" data-ch="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" style="width:100%">';
          b.innerHTML = '<div style="display:grid;gap:12px">' + sl('vol', 'Sound effects', store.vol, 0, 1, 0.05) + sl('music', 'Music', store.music, 0, 1, 0.05) + sl('sens', 'Mouse sensitivity', store.sens, 0.2, 3, 0.1) +
            '<label class="rc-chk' + (store.invertY ? ' on' : '') + '" style="justify-self:start"><input type="checkbox" data-ch="inv" ' + (store.invertY ? 'checked' : '') + '> Invert mouse up and down</label>' +
            '<div class="rc-label">Graphics</div><div class="rc-seg">' + [['auto', 'Automatic'], ['low', 'Fast'], ['medium', 'Balanced'], ['high', 'Best']].map(q => '<button data-act="q" data-v="' + q[0] + '" class="' + (store.quality === q[0] ? 'on' : '') + '">' + q[1] + '</button>').join('') + '</div>' +
            '<div class="rc-tiny">' + ({ auto: 'Starts at Best on computers and Balanced on phones, and turns things down by itself if the game gets slow.', low: 'For older phones: no shadows or glow, a little grass close by and a lower resolution.', medium: 'Sun shadows, glow, smooth edges and grass around you.', high: 'Sharper shadows, thicker grass further out and full resolution.' }[store.quality] || '') + (store.quality === 'auto' ? ' Right now: ' + ['Fast', 'Balanced', 'Best'][GFX.tier] + '.' : '') + '</div></div>';
        } else if (W.tab === 'social') {
          const chk = (k, on, label) => '<label class="rc-chk' + (on ? ' on' : '') + '" style="justify-self:start"><input type="checkbox" data-ch="' + k + '" ' + (on ? 'checked' : '') + '> ' + label + '</label>';
          const muted = Object.keys(store.muted);
          b.innerHTML = '<div style="display:grid;gap:12px"><div class="rc-label">Text chat</div>' + chk('chat', store.chat, 'Show chat (Enter or T to type)') +
            '<p class="rc-tiny">Chat is filtered: swear words, links, e-mail addresses and phone numbers are hidden. Never share your real name, address or passwords.</p>' +
            '<div class="rc-label">Voice chat</div><div class="rc-row"><button class="rc-b sm ' + (VOICE.on ? 'r' : 'g') + '" data-act="voice">' + (VOICE.on ? '🎤 Turn voice chat off' : '🎤 Turn voice chat on') + '</button></div>' +
            '<div class="rc-seg"><button data-act="vmode" data-v="ptt" class="' + (store.vmode === 'ptt' ? 'on' : '') + '">Push to talk (hold V)</button><button data-act="vmode" data-v="open" class="' + (store.vmode === 'open' ? 'on' : '') + '">Open mic</button></div>' +
            '<div class="rc-label">Voice volume</div><input type="range" data-ch="vvol" min="0" max="1" step="0.05" value="' + store.vvol + '" style="width:100%">' +
            '<p class="rc-tiny">You only hear players who turned voice chat on too, louder when they are close and silent from other areas. Your voice goes straight to them, not through any server.' + (VOICE.err ? ' Last microphone problem: ' + esc(VOICE.err) + '.' : '') + '</p>' +
            '<div class="rc-label">Muted players</div>' + (muted.length ? '<div class="rc-row">' + muted.map(n => '<button class="rc-b xs" data-act="unmute" data-n="' + esc(n) + '">🔇 ' + esc(n) + ' · unmute</button>').join('') + '</div>' : '<p class="rc-tiny">Nobody. Mute a player from the Room Computer to hide their chat and voice.</p>') + '</div>';
        } else if (W.tab === 'account') {
          b.innerHTML = '<div style="display:grid;gap:10px"><div class="rc-row"><span class="rc-pill" style="--c:' + esc(me.color) + ';font-size:16px">' + esc(me.name) + '</span><span class="rc-tiny">' + (noServer() ? 'Saved on this device' : 'Player #' + me.id + ' · saved on the server') + '</span></div>' +
            '<div class="rc-label">Your colour</div><div class="rc-row">' + COLORS.map(c => '<button class="rc-b xs" data-act="col" data-v="' + c + '" style="background:' + c + ';width:34px;height:30px' + (me.color === c ? ';outline:3px solid #2b1d3a' : '') + '"></button>').join('') + '</div>' +
            (isPeer() || isHosted() ? '' : '<div class="rc-label">' + (me.hasPass ? 'Change your password' : 'Add a password so you can play on other devices') + '</div>' + (me.hasPass ? '<input class="rc-in" type="password" placeholder="Current password" data-keep="old" autocomplete="current-password">' : '') +
            '<input class="rc-in" type="password" placeholder="New password (4 or more characters)" data-keep="pw" autocomplete="new-password"><div class="rc-row"><button class="rc-b sm g" data-act="pw">Save password</button></div>') +
            (isHosted() ? '<div class="rc-label">Where you play</div><div class="rc-row"><span class="rc-tiny">On the RAT CATCHERS online server. Your save is kept on this device.</span><span class="rc-sp"></span><button class="rc-b sm" data-act="offline">Play offline</button></div>'
            : isPeer() ? '<div class="rc-label">Where you play</div><div class="rc-row"><span class="rc-tiny">In ' + esc(NET.peerHost || 'a friend') + '’s room. Your game is saved in this browser.</span><span class="rc-sp"></span><button class="rc-b sm" data-act="home">Back to my own game</button></div>'
            : isLocal() ? '<div class="rc-label">Where you play</div><div class="rc-row"><span class="rc-tiny">On this device, saved in this browser. Friends join you with your room code (Room Computer), no server needed.' + (HOST.url ? (store.offline ? ' The online server is off.' : ' You join the online server by yourself whenever it is reachable.') : '') + '</span><span class="rc-sp"></span>' + (HOST.url ? '<button class="rc-b sm g" data-act="online">' + (store.offline ? 'Play online' : 'Go online now') + '</button>' : '') + '<button class="rc-b sm" data-act="srv">Use my own server</button></div>'
              : '<div class="rc-label">Server</div><div class="rc-row"><span class="rc-tiny">' + esc(NET.url.replace(/^wss?:\/\//, '').replace(/\/ws$/, '')) + '</span><span class="rc-sp"></span><button class="rc-b sm" data-act="srv">Change server</button><button class="rc-b sm r" data-act="out">Log out</button></div>') +
            (noServer() || isHosted() ? '' : '<p class="rc-note">Logging out forgets this device’s key. ' + (me.hasPass ? 'Log back in with your name and password.' : 'Add a password first, or you won’t be able to log back in as ' + esc(me.name) + '.') + '</p>') + '</div>';
        } else {
          b.innerHTML = '<div class="rc-help"><ul style="padding-left:18px"><li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>walk · <kbd>Shift</kbd>run · <kbd>Space</kbd>jump</li><li><kbd>Mouse</kbd>look (click the game first) · <kbd>Wheel</kbd>zoom</li><li><kbd>Click</kbd>cast at the rat in your sights · <kbd>Right-click</kbd>aim closer</li><li><kbd>E</kbd>use stations, open chests, talk to players</li>' +
            '<li><kbd>I</kbd>rats · <kbd>B</kbd>rat bank · <kbd>Q</kbd>quests · <kbd>X</kbd>Rat Index · <kbd>L</kbd>leaderboards · <kbd>O</kbd>settings · <kbd>H</kbd>help</li><li><kbd>M</kbd>music on or off · <kbd>Esc</kbd>close windows or free the mouse</li><li><kbd>Enter</kbd>chat · <kbd>V</kbd>hold to talk when voice chat is on</li><li>A gamepad works too: left stick walks, right stick looks, RT casts, X uses, A jumps.</li></ul></div>';
        }
      },
      ch(k, t) { if (k === 'vol') store.vol = +t.value; else if (k === 'music') store.music = +t.value; else if (k === 'sens') store.sens = +t.value; else if (k === 'inv') store.invertY = t.checked; else if (k === 'chat') { store.chat = t.checked; chatBuild(); chatRender(); } else if (k === 'vvol') store.vvol = +t.value; persist(); setVolumes(); },
      act(a, t) {
        const v = k => { const i = WIN.body.querySelector('[data-keep="' + k + '"]'); return i ? i.value : ''; };
        if (a === 'q') { store.quality = t.dataset.v; QLT.s = 1; QLT.tier = null; QLT.ups = 0; persist(); gfxApply(); renderWin(); }
        else if (a === 'col') nsend({ t: 'color', c: t.dataset.v });
        else if (a === 'pw') { const p = v('pw'); if (p.length < 4) { toast({ kind: 'err', text: 'Passwords need at least 4 characters.' }); return; } nsend({ t: 'pw', old: v('old'), pass: p }); }
        else if (a === 'home') goHome('You’re back in your own game.');
        else if (a === 'offline') { store.offline = true; persist(); goHome('Playing offline. Your save is on this device.'); }
        else if (a === 'online') { store.offline = false; persist(); HOST.next = 0; HOST.fails = 0; closeWin(true); toast({ kind: 'room', text: 'Connecting to the online server…', sub: 'If it was asleep, this takes about a minute.' }); }
        else if (a === 'voice') { voiceToggle(); setTimeout(renderWin, 600); } else if (a === 'vmode') { store.vmode = t.dataset.v; persist(); micGate(); voiceHud(); renderWin(); } else if (a === 'unmute') { muteToggle(t.dataset.n); renderWin(); }
        else if (a === 'srv') { closeWin(true); NET.kicked = true; clearTimeout(NET.retry); try { NET.ws && NET.ws.close(); } catch (e) {} S.ready = false; serverScreen(); }
        else if (a === 'out') confirmBox('Log out of ' + S.me.name + ' on this device?', 'Log out', () => { delete store.tokens[NET.url]; persist(); closeWin(true); NET.kicked = true; try { NET.ws && NET.ws.close(); } catch (e) {} S.ready = false; S.me = null; setTimeout(() => { NET.kicked = false; connect(NET.url); }, 200); }, { danger: true, icon: '👋' });
      },
      sig: () => [S.me.color, S.me.hasPass, S.me.name].join(), on(w) { return w === 'me' && WIN.tab === 'account'; } });
  }


  // ===================== the main loop, starting up and the outside API =====================
  let last = 0, raf = 0, lbT = 50, boardAcc = 1, fpsAcc = 0, fpsN = 0, errShown = false;
  S.fps = 0; S.rms = 0;
  function keys() {
    const P = IN.press;
    if (P.Escape) { if (OVL.el) overlayClose(); else if (CONF.el) { CONF.el.remove(); CONF.el = null; } else if (WIN) closeWin(); else if (opts.onQuit && !IN.locked && S.ready) menuOpen('quit'); return; }
    if (!S.ready || LOGIN.el || CONN.el || OVL.el || CONF.el) return;
    const map = { KeyI: 'inv', KeyB: 'bank', KeyQ: 'quests', KeyX: 'index', KeyL: 'lb', KeyO: 'settings', KeyH: 'help' };
    for (const k in map) if (P[k]) { SFX.click(); menuOpen(map[k]); return; }
    if (P.KeyM) { store.music = store.music > 0 ? 0 : 0.55; persist(); setVolumes(); toast({ kind: 'info', text: store.music ? 'Music on' : 'Music off' }); }
    if (WIN) return;
    if ((P.Enter || P.KeyT || P.Slash) && !CHAT.open) { chatOpen(); return; }
    if (P.KeyE) interact();
    if (IN.mclick && (IN.locked || IN.noLock || IN.last === 'pad')) tryCast();
  }
  function frame(now) {
    if (!alive) return; raf = win.requestAnimationFrame(frame);
    const raw = Math.max(0.001, (now - (last || now)) / 1000), dt = S.paused ? 0 : Math.min(0.05, raw); last = now; S.dt = dt; S.rt += dt; // (tests can pause the clock to look at one moment)
    fpsAcc += Math.min(raw, 2); fpsN++; if (fpsAcc > 1) { S.fps = Math.round(fpsN / fpsAcc); fpsAcc = 0; fpsN = 0; }
    readPads(); keys();
    if (S.ready && S.A) {
      movePlayer(dt); updateCamera(dt); updateOthers(dt); updateRats(dt); findAim(); updateCatch(dt); updateNear(); updateFly(dt); ambientFx(dt);
      if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 1.6);
      if (S.aid === 'lobby') { boardAcc += dt; if (boardAcc > 1) { boardAcc = 0; drawBoards(); } lbT += dt; if (lbT > 60) { lbT = 0; nsend({ t: 'lb', cat: 'money' }); } }
    }
    envTick(dt); partTick(dt);
    const r0 = win.performance ? win.performance.now() : 0;
    try { render(dt); } catch (e) { if (!errShown && win.console) { errShown = true; console.error('RAT CATCHERS render', e); } }
    if (r0) S.rms = S.rms * 0.9 + (win.performance.now() - r0) * 0.1; // time spent preparing a frame (for tests)
    try { overlay(); hudFrame(dt); touchFrame(); voiceFrame(dt); matchTick(dt); hostedTick(); } catch (e) { if (!errShown && win.console) { errShown = true; console.error('RAT CATCHERS HUD', e); } }
    snapJobs(S.ready ? 2 : 4);
    endInput(); netTick(); audioTick(); qualityTick(Math.min(raw, 0.5));
  }
  function boot() {
    try { atlasBuild(); snapInit(); } catch (e) { if (win.console) console.error(e); fatal("RAT CATCHERS couldn't start its graphics on this device."); return; }
    hudBuild(); resize(); drawBoards();
    try { wrap.focus({ preventScroll: true }); } catch (e) {}
    const srv = defaultServer();
    if (srv) { NET.serverInput = srv; setTimeout(() => { showConn('Connecting…', String(srv).replace(/^wss?:\/\//, '')); connect(wsUrl(srv)); }, 50); } else serverScreen();
    raf = win.requestAnimationFrame(frame);
  }
  const ro = win.ResizeObserver ? new win.ResizeObserver(() => resize()) : null; if (ro) ro.observe(wrap);
  const api = {
    destroy() {
      try { voiceOff(); } catch (e) {} alive = false; win.cancelAnimationFrame(raf); clearTimeout(NET.retry); NET.kicked = true;
      try { if (NET.ws) { nsend({ t: 'bye' }); NET.ws.close(); } } catch (e) {}
      inputOff(); if (ro) ro.disconnect(); try { if (AU.c) AU.c.close(); } catch (e) {}
      try { root.removeChild(wrap); } catch (e) {}
    },
    focus() { try { wrap.focus({ preventScroll: true }); } catch (e) {} },
    setSound(v) { setSound(!!v); }
  };
  if (opts.test) {
    // helpers for automated tests (only when the page asks for them)
    api.T = { S, NET, IN, CAM, store, ui, GFX, send: nsend, HOST, isHosted, visitRoom, goHome, isPeer, peerInfo, openRooms, CHAT, VOICE, MATCH, chatOpen, voiceToggle, findLobby, tryCast, interact, travel, openStation, closeWin, menuOpen, uiOpen, renderWin, snapLeft: () => SNAP.q.length + SNAP.pend.size,
      win: () => WIN && WIN.id,
      aimAt(id) { // point the camera's crosshair at a rat (the camera sits over the right shoulder, so aim from its pivot)
        const r = S.frats.get(id); if (!r) return false; const y = S.you, sz = RI[SP[r.sp].r].size, tg = [r.x, r.y + 0.35 * sz, r.z];
        for (let k = 0; k < 3; k++) { const rt = rightOf(y.yaw), q = [y.p[0] - rt[0] * 0.75, y.p[1] + 1.9, y.p[2] - rt[2] * 0.75], d = sub(tg, q); y.yaw = Math.atan2(d[0], d[2]); y.pitch = clamp(Math.atan2(d[1], Math.hypot(d[0], d[2])), -1.2, 0.9); }
        updateCamera(0.016); findAim(); return true; },
      walkTo(x, z) { S.you.p = [x, S.A.height(x, z), z]; S.you.v = [0, 0, 0]; },
      // look at any area locally (for screenshots of places the test player can't enter yet)
      preview(aid, x, z, yaw, pitch) { S.aid = aid; S.A = getArea(aid, 999, 9); S.frats.clear(); S.others.clear(); S.chests.clear(); ENV.snap = true; const sp = aid === 'lobby' ? LOBBY.spawn : S.A.spawn; const px = x == null ? sp[0] : x, pz = z == null ? sp[1] : z; S.you.p = [px, S.A.height(px, pz), pz]; S.you.yaw = yaw || 0; S.you.pitch = pitch == null ? -0.12 : pitch; camSnap = true; playSong(aid === 'lobby' ? 'lobby' : FI[aid].song); } };
  }
  boot();
  return api;
  };
})();

