'use strict';

/* =========================================================
   DATA
   ========================================================= */
const BASES = [
  { id: 'coldcoffee', name: 'Cold Coffee',          note: 'Strong & creamy',     a: '#b88a68', b: '#6b4328', tint: '#eadbcf', price: 100,
    brew: 'Blend strong coffee with cold milk and ice until frothy.' },
  { id: 'lemontea',   name: 'Lemon Tea',            note: 'Sharp & refreshing',  a: '#fff0a0', b: '#f4c430', tint: '#fff6c9', price: 80,
    brew: 'Brew black tea, cool it, then squeeze in fresh lemon juice.' },
  { id: 'chai',       name: 'Masala Chai',          note: 'Spiced & milky',      a: '#dba66b', b: '#a8642a', tint: '#f6e3cf', price: 70,
    brew: 'Simmer tea with cardamom, ginger and milk, then chill it.' },
  { id: 'milktea',    name: 'Milk Tea',             note: 'Smooth black tea',    a: '#d2a577', b: '#a9763f', tint: '#f4e4d1', price: 90,
    brew: 'Brew strong black tea, cool it, and stir in milk.' },
  { id: 'greentea',   name: 'Green Tea',            note: 'Light & grassy',      a: '#d6e99f', b: '#9ec04f', tint: '#eaf4cf', price: 85,
    brew: 'Steep green tea for 3 minutes, strain, and chill.' },
  { id: 'rosemilk',   name: 'Rose Milk',            note: 'Floral & sweet',      a: '#ffbdd0', b: '#ff7fa6', tint: '#ffe3ec', price: 75,
    brew: 'Stir rose syrup into cold milk.' },
  { id: 'badam',      name: 'Badam Milk',           note: 'Nutty & saffron',     a: '#f8e4b8', b: '#e8c27a', tint: '#fbf0d8', price: 95,
    brew: 'Blend soaked almonds with milk, saffron and a little cardamom.' },
  { id: 'lassi',      name: 'Mango Lassi',          note: 'Thick & tangy',       a: '#ffd673', b: '#ffa927', tint: '#fff0c4', price: 95,
    brew: 'Blend ripe mango with yogurt and a pinch of cardamom.' },
  { id: 'choco',      name: 'Chocolate Shake',      note: 'Rich & thick',        a: '#9c6c54', b: '#4a2c20', tint: '#e8d6cc', price: 110,
    brew: 'Blend chocolate syrup with cold milk and vanilla ice cream.' },
  { id: 'strawberry', name: 'Strawberry Milkshake', note: 'Fruity & creamy',     a: '#ffb3c0', b: '#ff7b95', tint: '#ffe1e7', price: 105,
    brew: 'Blend fresh strawberries with cold milk and ice cream.' }
];

const DEFAULT_BASE = 'coldcoffee';

const TOPS = [
  { id: 'pearl',  name: 'Tapioca pearls',   short: 'pearls',        cat: 'chewy',  price: 20, swatch: '#2b1a1c', desc: 'Classic brown-sugar chew',
    prep: 'Cook tapioca pearls for 25 minutes, rest 10, then spoon them into the bottom of the cup.' },
  { id: 'jelly',  name: 'Grass jelly',      short: 'grass jelly',   cat: 'chewy',  price: 15, swatch: '#4a4152', desc: 'Herbal, silky cubes',
    prep: 'Cut grass jelly into small cubes and drop them in.' },
  { id: 'pudding',name: 'Egg pudding',      short: 'egg pudding',   cat: 'creamy', price: 25, swatch: '#ffd45e', desc: 'Caramel-topped custard',
    prep: 'Set two spoonfuls of egg pudding in the cup.' },
  { id: 'pop',    name: 'Popping mango',    short: 'popping mango', cat: 'fruity', price: 25, swatch: '#ffa51f', desc: 'Juice bursts when bitten',
    prep: 'Scoop popping mango pearls into the cup.' },
  { id: 'lychee', name: 'Lychee jelly',     short: 'lychee jelly',  cat: 'fruity', price: 20, swatch: '#f4b6c8', desc: 'Sweet, floral, translucent',
    prep: 'Add lychee jelly cubes.' },
  { id: 'sugar',  name: 'Brown sugar swirl',short: 'brown sugar',   cat: 'creamy', price: 15, swatch: '#7b3f16', desc: 'Tiger-stripe syrup',
    prep: 'Drizzle brown sugar syrup down the inside wall of the cup.' },
  { id: 'foam',   name: 'Cheese foam',      short: 'cheese foam',   cat: 'creamy', price: 30, swatch: '#e6c978', desc: 'Salty-sweet cream cap',
    prep: 'Whisk cream cheese, milk and a pinch of salt until pourable, then float it on top.' }
];

const SIZES = {
  S: { label: 'Small',  ml: 350, price: 0,  scale: 0.88 },
  M: { label: 'Medium', ml: 500, price: 20, scale: 1 },
  L: { label: 'Large',  ml: 700, price: 40, scale: 1.1 }
};
const ICE = {
  none:   { label: 'No ice',      n: 0 },
  less:   { label: 'Less ice',    n: 3 },
  normal: { label: 'Regular ice', n: 6 }
};
const SUGAR_LABEL = { 0: 'Unsweetened', 25: 'Light', 50: 'Half sweet', 75: 'Sweet', 100: 'Extra sweet' };

const FB_TAGS = ['Perfect sweetness', 'Too sweet', 'Not sweet enough', 'Great toppings', 'Too icy', 'Great value'];
const RATING_TEXT = ['Tap a star', 'Not good', 'Could be better', 'It was okay', 'Really good', 'Loved it!'];

/* =========================================================
   STATE + HELPERS
   ========================================================= */
const state = {
  base: DEFAULT_BASE,
  size: 'M',
  sugar: 50,
  ice: 'normal',
  tops: new Set(['pearl']),
  filter: 'all',
  query: '',
  last: null,        // id of the topping just added (to animate it)
  orderNo: null,
  lastOrder: null    // snapshot of the last placed order (used by the feedback form)
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '₹' + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const getBase = () => BASES.find(b => b.id === state.base);
const baseById = id => BASES.find(b => b.id === id);
const pickedTops = () => TOPS.filter(t => state.tops.has(t.id));   // keeps menu order
const joinList = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr.at(-1);
const sugarText = () => `${state.sugar}% · ${SUGAR_LABEL[state.sugar]}`;

/* =========================================================
   REVIEWS: storage (saved in the browser with localStorage)
   ========================================================= */
const STORE_KEY = 'sipStyleReviewsV1';
// scope: 'drink' = only the selected drink, 'all' = every drink
// pin: shows a specific drink right after you rate it (even if you picked another one meanwhile)
const revUI = { star: 0, sort: 'newest', scope: 'drink', pin: null, fresh: null };

function sampleReviews() {
  const day = 864e5, now = Date.now();
  // [name, drinkId, size, toppings, rating, tags, comment, daysAgo]
  const data = [
    ['Priya',    'coldcoffee', 'Medium', ['pearls'],                5, ['Perfect sweetness', 'Great toppings'], 'Strong coffee, soft pearls. Ordering this again.', 1],
    ['Karthik',  'coldcoffee', 'Large',  [],                        4, ['Too icy'],                             'Great taste. I will ask for less ice next time.', 6],
    ['Meera',    'lemontea',   'Small',  ['lychee jelly'],          5, ['Perfect sweetness'],                   'Sharp, fresh and cold. Perfect for a hot afternoon.', 3],
    ['Sneha',    'lemontea',   'Medium', [],                        4, ['Great value'],                         'Simple and refreshing.', 8],
    ['Arjun',    'chai',       'Large',  ['egg pudding'],           4, ['Great value'],                         'Great spice flavour and the pudding was a nice surprise.', 2],
    ['Ravi',     'chai',       'Medium', [],                        5, ['Perfect sweetness'],                   'Tastes like the chai from my street corner.', 10],
    ['Divya',    'milktea',    'Medium', ['pearls', 'brown sugar'], 3, ['Too sweet'],                           'Tasty, but I should have picked 25% sugar.', 7],
    ['Nisha',    'milktea',    'Small',  ['pearls'],                4, ['Great toppings'],                      'Smooth tea and chewy pearls.', 11],
    ['Anand',    'greentea',   'Medium', ['grass jelly'],           4, ['Not sweet enough'],                    'Light and clean. Needs a bit more sugar for me.', 5],
    ['Lakshmi',  'rosemilk',   'Medium', ['popping mango'],         5, ['Perfect sweetness', 'Great toppings'], 'Pretty pink and not too sweet. Loved it.', 4],
    ['Suresh',   'badam',      'Large',  [],                        5, ['Great value'],                         'Rich and nutty with a lovely saffron smell.', 9],
    ['Kavin',    'lassi',      'Medium', ['popping mango'],         5, ['Great toppings', 'Great value'],       'Thick and tangy, and the popping mango makes it fun.', 2],
    ['Janani',   'lassi',      'Large',  [],                        4, ['Perfect sweetness'],                   'Creamy and cool. Very filling.', 12],
    ['Rahul',    'choco',      'Large',  ['cheese foam'],           4, ['Too icy'],                             'Rich and thick. Next time I will ask for less ice.', 9],
    ['Mythili',  'choco',      'Medium', [],                        3, ['Too sweet'],                           'Good, but way too sweet at 100%.', 13],
    ['Harini',   'strawberry', 'Medium', ['lychee jelly'],          5, ['Perfect sweetness'],                   'Real strawberry taste. My favourite on the menu.', 1]
  ];
  return data.map((d, i) => ({
    id: i + 1, date: new Date(now - d[7] * day).toISOString(),
    name: d[0], baseId: d[1], drink: baseById(d[1]).name, size: d[2],
    tops: d[3], rating: d[4], tags: d[5], comment: d[6], mine: false
  }));
}

function loadReviews() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* storage blocked: fall back to samples */ }
  return sampleReviews();
}
function saveReviews() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(reviews)); } catch (e) { /* ignore */ }
}

let reviews = loadReviews();

// average rating of one drink (everyone's ratings, yours included)
function avgFor(baseId) {
  const list = reviews.filter(r => r.baseId === baseId);
  if (!list.length) return null;
  return { avg: list.reduce((s, r) => s + r.rating, 0) / list.length, n: list.length };
}
// your latest rating for a drink
const mineFor = baseId => reviews.find(r => r.mine && r.baseId === baseId);

/* =========================================================
   CORE LOGIC 1: filter the topping list
   ========================================================= */
function renderToppings() {
  const q = state.query.trim().toLowerCase();

  const visible = TOPS.filter(t => {
    const matchCat  = state.filter === 'all' || t.cat === state.filter;
    const matchText = !q || (t.name + ' ' + t.desc + ' ' + t.cat).toLowerCase().includes(q);
    return matchCat && matchText;
  });

  $('#toppingList').innerHTML = visible.map(t => `
    <li>
      <label class="topping">
        <input type="checkbox" value="${t.id}" ${state.tops.has(t.id) ? 'checked' : ''}>
        <span class="swatch" style="--sw:${t.swatch}"></span>
        <span class="t-text"><b>${t.name}</b><small>${t.desc}</small></span>
        <span class="t-price">+₹${t.price}</span>
      </label>
    </li>`).join('');

  $('#emptyMsg').hidden = visible.length > 0;
}

function renderBases() {
  $('#baseGrid').innerHTML = BASES.map(b => {
    const r = avgFor(b.id);
    const rating = r ? ` · ★ ${r.avg.toFixed(1)} (${r.n})` : ' · New';
    return `
    <label class="base">
      <input type="radio" name="base" value="${b.id}" ${b.id === state.base ? 'checked' : ''}>
      <span class="card">
        <span class="dot" style="--c1:${b.a};--c2:${b.b}"></span>
        <span><b>${b.name}</b><small>${b.note}</small><small>₹${b.price}${rating}</small></span>
      </span>
    </label>`;
  }).join('');
}

/* =========================================================
   CORE LOGIC 2: stack visual layers on the cup (SVG)
   ========================================================= */
// cup edges at height y (matches the clip path in index.html)
const xl = y => 40 + (y - 70) * 18 / 238;
const xr = y => 160 - (y - 70) * 18 / 238;

// tiny seeded random so layers don't jump around on every re-render
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function pearlsSVG() {
  const r = rng(7);
  let s = '';
  [304, 290].forEach((y, row) => {
    for (let x = xl(y) + 9 + (row ? 7 : 0); x < xr(y) - 8; x += 14.5) {
      const cx = x + r() * 2, cy = y - r() * 2;
      s += `<circle cx="${cx}" cy="${cy}" r="6.8" fill="#2b1a1c"/>
            <circle cx="${cx - 2}" cy="${cy - 2.3}" r="1.8" fill="#fff" opacity=".45"/>`;
    }
  });
  return s;
}

function puddingSVG() {
  const baseY = state.tops.has('pearl') ? 280 : 308;
  let s = '';
  [0, 1].forEach(i => {
    const x = xl(baseY - 15) + 7 + i * 38;
    s += `<rect x="${x}" y="${baseY - 30}" width="34" height="30" rx="7" fill="#ffd45e" stroke="#e0a82e"/>
          <path d="M${x} ${baseY - 30} h34 v8 q-17 7 -34 0 z" fill="#b8692a"/>`;
  });
  return s;
}

function cubesSVG(n, seed, y0, y1, size, fill, stroke, opacity) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const y = y0 + r() * (y1 - y0);
    const x = xl(y) + size / 2 + 5 + r() * (xr(y) - xl(y) - size - 10);
    const rot = Math.round(r() * 70 - 35);
    s += `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="3"
           fill="${fill}" stroke="${stroke}" opacity="${opacity}" transform="rotate(${rot} ${x} ${y})"/>`;
  }
  return s;
}

function popSVG() {
  const r = rng(21);
  let s = '';
  for (let i = 0; i < 16; i++) {
    const y = 170 + r() * 100;
    const x = xl(y) + 9 + r() * (xr(y) - xl(y) - 18);
    s += `<circle cx="${x}" cy="${y}" r="5.6" fill="#ffa51f" stroke="#e07d00" stroke-width=".8"/>
          <circle cx="${x - 1.8}" cy="${y - 2}" r="1.6" fill="#fff" opacity=".7"/>`;
  }
  return s;
}

function iceSVG() {
  const spots = [[72, 106, 12], [102, 118, -14], [130, 104, 22], [86, 146, 8], [120, 150, -20], [102, 182, 16]];
  return spots.slice(0, ICE[state.ice].n).map(([x, y, rot]) =>
    `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="6" fill="#fff" fill-opacity=".3"
       stroke="#fff" stroke-opacity=".8" stroke-width="1.5" transform="rotate(${rot} ${x} ${y})"/>
     <path d="M${x - 8} ${y - 6} l6 -3" stroke="#fff" stroke-opacity=".9" stroke-width="2" stroke-linecap="round" transform="rotate(${rot} ${x} ${y})"/>`
  ).join('');
}

function foamSVG() {
  return `<path d="M16 62 H184 V100 q-13 15 -26 0 t-26 0 t-26 0 t-26 0 t-26 0 t-26 0 t-26 0 Z" fill="url(#foamGrad)"/>
          <circle cx="70" cy="80" r="2" fill="#e6c978" opacity=".6"/><circle cx="110" cy="88" r="2.4" fill="#e6c978" opacity=".6"/>
          <circle cx="136" cy="76" r="1.8" fill="#e6c978" opacity=".6"/>`;
}

function syrupSVG() {
  let s = '';
  [0.1, 0.38, 0.66, 0.9].forEach((f, i) => {
    const pts = [100, 160, 220, 280, 320].map((y, k) => {
      const wob = (k % 2 ? 1 : -1) * (5 + i * 1.5);
      return [xl(y) + (xr(y) - xl(y)) * f + wob, y];
    });
    const [p0, p1, p2, p3, p4] = pts;
    s += `<path d="M${p0[0]} ${p0[1]} Q${p0[0] + 8} ${p0[1] + 30} ${p1[0]} ${p1[1]} T${p2[0]} ${p2[1]} T${p3[0]} ${p3[1]} T${p4[0]} ${p4[1]}"
           fill="none" stroke="#6b3410" stroke-width="${i % 2 ? 5 : 7}" stroke-linecap="round" opacity=".82"/>`;
  });
  return s;
}

// put markup in a layer; if it's the topping just added, replay the drop animation
function setLayer(id, html, key) {
  const g = $('#' + id);
  g.innerHTML = html;
  g.classList.remove('drop');
  if (html && state.last === key) {
    g.getBoundingClientRect();           // force reflow so the animation restarts
    g.classList.add('drop');
  }
}

function renderCup() {
  const b = getBase();
  const root = document.documentElement.style;
  root.setProperty('--a', b.a);
  root.setProperty('--b', b.b);
  root.setProperty('--tint', b.tint);
  $('#stopA').setAttribute('stop-color', b.a);
  $('#stopB').setAttribute('stop-color', b.b);

  const top = state.tops.has('foam') ? 100 : 86;     // liquid drops a bit under foam
  $('#liquid').setAttribute('y', top);
  $('#liquid').setAttribute('height', 330 - top);

  setLayer('gSyrup',   state.tops.has('sugar')   ? syrupSVG()   : '', 'sugar');
  setLayer('gPudding', state.tops.has('pudding') ? puddingSVG() : '', 'pudding');
  setLayer('gPearl',   state.tops.has('pearl')   ? pearlsSVG()  : '', 'pearl');
  setLayer('gJelly',   state.tops.has('jelly')   ? cubesSVG(8, 11, 190, 262, 15, '#3b3342', '#1f1a24', 0.92) : '', 'jelly');
  setLayer('gLychee',  state.tops.has('lychee')  ? cubesSVG(7, 33, 140, 235, 15, '#ffffff', '#f2a8c0', 0.8)  : '', 'lychee');
  setLayer('gPop',     state.tops.has('pop')     ? popSVG()     : '', 'pop');
  setLayer('gIce',     iceSVG(), 'ice');
  setLayer('gFoam',    state.tops.has('foam')    ? foamSVG()    : '', 'foam');

  $('#cupWrap').style.setProperty('--scale', SIZES[state.size].scale);
}

/* =========================================================
   NAME, RATING LINE, TICKET, RECIPE
   ========================================================= */
const drinkName = () => getBase().name;
const toppingsText = () => {
  const t = pickedTops().map(x => x.short);
  return t.length ? 'with ' + joinList(t) : 'No toppings';
};

function totals() {
  const b = getBase(), s = SIZES[state.size];
  const lines = [{ n: `${b.name} (${s.label})`, p: b.price + s.price }]
    .concat(pickedTops().map(t => ({ n: t.name, p: t.price })));
  const sub = lines.reduce((sum, l) => sum + l.p, 0);
  const gst = sub * 0.05;
  return { lines, sub, gst, total: sub + gst };
}

function renderInfo() {
  $('#drinkName').textContent = drinkName();
  $('#drinkTops').textContent = toppingsText();
  $('#drinkMeta').textContent = `${SIZES[state.size].ml} ml · ${ICE[state.ice].label} · ${sugarText()}`;
}

// rating of the selected drink, shown right under its name
function renderRateLine() {
  const r = avgFor(state.base), mine = mineFor(state.base);
  $('#rlStars').style.setProperty('--p', r ? r.avg : 0);
  $('#rlStars').setAttribute('aria-label', r ? `${r.avg.toFixed(1)} out of 5 stars` : 'No ratings yet');
  $('#rlText').textContent = r ? `${r.avg.toFixed(1)} · ${r.n} review${r.n === 1 ? '' : 's'}` : 'No ratings yet';
  $('#rlMine').textContent = mine ? `Your rating: ${mine.rating}★` : '';
}

function renderTicket() {
  const t = totals();
  $('#tkLines').innerHTML = t.lines.map(l => `<li><span>${l.n}</span><span>${money(l.p)}</span></li>`).join('');
  $('#tkNotes').textContent = `${ICE[state.ice].label}, ${state.sugar}% sugar`;
  $('#tkSub').textContent = money(t.sub);
  $('#tkGst').textContent = money(t.gst);
  $('#tkTotal').textContent = money(t.total);
  $('#tkNo').textContent = state.orderNo || 'Not placed';
  $('#tkFor').textContent = $('#custName').value.trim() || 'Guest';
  $('#tkDate').textContent = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  $('#ticket').classList.toggle('placed', Boolean(state.orderNo));

  // "Rate your drink" unlocks after an order and pulses until it is rated
  const o = state.lastOrder, rate = $('#rateBtn');
  rate.disabled = !o || o.rated;
  rate.classList.toggle('nudge', Boolean(o && !o.rated));
  rate.title = !o ? 'Place an order first' : o.rated ? 'Thanks, you already rated this order' : '';
}

function openRecipe() {
  const b = getBase(), s = SIZES[state.size], tops = pickedTops();

  $('#rcName').textContent = drinkName();
  $('#rcMeta').textContent = `${s.label} · ${s.ml} ml · ${toppingsText()}`;

  $('#rcIngredients').innerHTML = [
    `${s.ml} ml cup (${s.label.toLowerCase()})`,
    b.name,
    ICE[state.ice].label.toLowerCase(),
    `Sugar syrup to ${state.sugar}% (${SUGAR_LABEL[state.sugar].toLowerCase()})`,
    ...tops.map(t => t.name)
  ].map(i => `<li>${i}</li>`).join('');

  const steps = [
    ...tops.filter(t => t.id !== 'foam').map(t => t.prep),
    ICE[state.ice].n ? `Add ${ICE[state.ice].label.toLowerCase()}.` : 'Skip the ice.',
    b.brew,
    state.sugar ? `Sweeten to ${state.sugar}% with sugar syrup.` : 'Leave it unsweetened.',
    ...tops.filter(t => t.id === 'foam').map(t => t.prep),
    'Seal, shake gently, and serve with a wide straw.'
  ];
  $('#rcSteps').innerHTML = steps.map(x => `<li>${x}</li>`).join('');

  $('#recipeArt').replaceChildren($('#cup').cloneNode(true));
  $('#recipeDialog').showModal();
}

/* =========================================================
   REVIEWS PANEL: ratings of the selected drink (or all drinks)
   ========================================================= */
const starsHTML = n => `<span class="stars" style="--p:${n}" role="img" aria-label="${n} out of 5 stars"></span>`;

// which drink the reviews panel is showing (null = all drinks)
const revBaseId = () => revUI.scope === 'all' ? null : (revUI.pin || state.base);

function syncScopeUI() {
  $$('#scopeChips .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.scope === revUI.scope)));
}

function renderReviews() {
  const id = revBaseId();
  const name = id ? baseById(id).name : null;
  const pool = id ? reviews.filter(r => r.baseId === id) : reviews;
  const n = pool.length;
  const avg = n ? pool.reduce((s, r) => s + r.rating, 0) / n : 0;

  $('#reviewsTitle').textContent = name ? `Ratings for ${name}` : 'Ratings for all drinks';

  // summary card
  $('#avgNum').textContent = n ? avg.toFixed(1) : '–';
  $('#avgStars').style.setProperty('--p', avg);
  $('#avgStars').setAttribute('aria-label', `${avg.toFixed(1)} out of 5 stars`);
  $('#avgCount').textContent = `${n} review${n === 1 ? '' : 's'}${name ? ' for ' + name : ''}`;

  // your own rating for this drink
  const mine = id ? pool.find(r => r.mine) : null;
  $('#myRating').hidden = !mine;
  if (mine) $('#myRating').innerHTML = `<span>Your rating</span> ${starsHTML(mine.rating)}`;

  // star distribution (click a row to filter)
  $('#distBars').innerHTML = [5, 4, 3, 2, 1].map(s => {
    const c = pool.filter(r => r.rating === s).length;
    const pct = n ? (c / n) * 100 : 0;
    return `<button type="button" class="dist-row" data-star="${s}" aria-pressed="${revUI.star === s}">
              <span>${s} ★</span><span class="bar"><i style="width:${pct}%"></i></span><span>${c}</span>
            </button>`;
  }).join('');

  // filter + sort
  const sorters = {
    newest: (a, b) => new Date(b.date) - new Date(a.date),
    high:   (a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date),
    low:    (a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date)
  };
  const list = pool.filter(r => !revUI.star || r.rating === revUI.star).sort(sorters[revUI.sort]);

  $('#reviewList').innerHTML = list.map(r => `
    <article class="review ${r.mine ? 'mine' : ''} ${r.id === revUI.fresh ? 'fresh' : ''}">
      <div class="rv-top">
        ${starsHTML(r.rating)}
        <span class="rv-date">${new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      </div>
      <p class="rv-drink">${esc(r.drink)} · ${esc(r.size)}</p>
      ${r.tops.length ? `<p class="rv-tops">with ${esc(joinList(r.tops))}</p>` : ''}
      ${r.tags.length ? `<ul class="rv-tags">${r.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${r.comment ? `<p class="rv-text">${esc(r.comment)}</p>` : ''}
      <p class="rv-name">${esc(r.name)} ${r.mine ? '<span class="mine-chip">You</span>' : ''}</p>
    </article>`).join('');

  // empty states
  const empty = $('#noReviews');
  empty.hidden = list.length > 0;
  if (!list.length) {
    empty.innerHTML = n === 0
      ? `No reviews for ${esc(name || 'this drink')} yet. Order it and be the first to rate!`
      : `No ${revUI.star}-star reviews here yet. <button type="button" class="link clear-star">Show all reviews</button>`;
  }
}

// call when the selected drink changes
function showDrinkReviews() {
  revUI.pin = null; revUI.star = 0; revUI.fresh = null;
  renderRateLine();
  renderReviews();
}

/* =========================================================
   FEEDBACK + RATINGS
   ========================================================= */
// what the feedback form is about: a placed order, or the drink selected right now
let fbTarget = null;

function targetFromOrder(o) {
  return { baseId: o.baseId, drink: o.drink, size: o.size, tops: o.tops, name: o.name, order: o };
}
function targetFromSelection() {
  const b = getBase();
  return {
    baseId: b.id, drink: b.name,
    size: SIZES[state.size].label,
    tops: pickedTops().map(t => t.short),
    name: $('#custName').value.trim() || 'Guest',
    order: null
  };
}

function openFeedback(target) {
  fbTarget = target;
  $('#fbTitle').textContent = target.order ? `How was your ${target.drink}?` : `Rate ${target.drink}`;
  $('#fbSub').textContent = (target.order ? `Order ${target.order.no} · ` : '')
    + target.size + (target.tops.length ? ' · ' + joinList(target.tops) : '');
  $('#fbForm').reset();
  $('#fbError').hidden = true;
  $('#ratingText').textContent = RATING_TEXT[0];
  $('#fbCount').textContent = '0/200';
  $('#feedbackDialog').showModal();
}

function submitFeedback(e) {
  e.preventDefault();
  const picked = $('input[name="rating"]:checked');
  if (!picked) { $('#fbError').hidden = false; return; }   // rating is required

  const t = fbTarget;
  const review = {
    id: Date.now(),
    baseId: t.baseId, drink: t.drink, size: t.size, tops: t.tops,
    rating: Number(picked.value),
    tags: $$('#fbTags input:checked').map(i => i.value),
    comment: $('#fbComment').value.trim(),
    name: t.name,
    date: new Date().toISOString(),
    mine: true
  };
  reviews.unshift(review);
  saveReviews();
  if (t.order) t.order.rated = true;          // order-based feedback: mark that order as rated

  // show the reviews of the drink you just rated, with your new review highlighted
  revUI.scope = 'drink';
  revUI.pin = t.baseId;
  revUI.star = 0;
  revUI.fresh = review.id;
  syncScopeUI();

  $('#feedbackDialog').close();
  renderBases();
  renderRateLine();
  renderReviews();
  renderTicket();
  toast('Thanks! Your review is saved.');
  $('#reviews').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================================================
   ACTIONS
   ========================================================= */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3400);
}

// any change to the drink: clear old order, refresh visuals + ticket
function changed() {
  state.orderNo = null;
  renderInfo();
  renderRateLine();
  renderCup();
  renderTicket();
}

function syncControls() {
  $$('input[name="base"]').forEach(i => i.checked = i.value === state.base);
  $$('input[name="size"]').forEach(i => i.checked = i.value === state.size);
  $$('input[name="ice"]').forEach(i => i.checked = i.value === state.ice);
  $('#sugar').value = state.sugar;
  $('#sugarOut').textContent = sugarText();
  renderToppings();
}

function resetFilterUI() {
  state.filter = 'all'; state.query = ''; $('#search').value = '';
  $$('.chip[data-filter]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === 'all')));
}

function surprise() {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  state.base = pick(BASES).id;
  state.size = pick(Object.keys(SIZES));
  state.ice = pick(Object.keys(ICE));
  state.sugar = pick([0, 25, 50, 75, 100]);
  const shuffled = [...TOPS].sort(() => Math.random() - 0.5);
  state.tops = new Set(shuffled.slice(0, 1 + Math.floor(Math.random() * 3)).map(t => t.id));
  state.last = [...state.tops][0];
  resetFilterUI();
  syncControls();
  changed();
  showDrinkReviews();
}

function reset() {
  Object.assign(state, { base: DEFAULT_BASE, size: 'M', sugar: 50, ice: 'normal', tops: new Set(), last: null });
  resetFilterUI();
  syncControls();
  changed();
  showDrinkReviews();
}

function placeOrder() {
  const b = getBase();
  state.orderNo = 'S-' + (1000 + Math.floor(Math.random() * 9000));
  state.lastOrder = {
    no: state.orderNo,
    baseId: b.id,
    drink: b.name,
    size: SIZES[state.size].label,
    tops: pickedTops().map(t => t.short),
    name: $('#custName').value.trim() || 'Guest',
    rated: false
  };
  renderTicket();
  const who = $('#custName').value.trim();
  const wait = 5 + state.tops.size * 2;
  toast(`${who ? who + ', your' : 'Your'} order ${state.orderNo} is in. Ready in about ${wait} min.`);
}

/* =========================================================
   EVENTS
   ========================================================= */
document.addEventListener('change', e => {
  const el = e.target;

  if (el.name === 'base') { state.base = el.value; state.last = null; changed(); showDrinkReviews(); }
  else if (el.name === 'size') { state.size = el.value; state.last = null; changed(); }
  else if (el.name === 'ice') { state.ice = el.value; state.last = 'ice'; changed(); }
  else if (el.name === 'rating') {
    $('#ratingText').textContent = RATING_TEXT[Number(el.value)];
    $('#fbError').hidden = true;
  }
  else if (el.closest('#toppingList')) {
    el.checked ? state.tops.add(el.value) : state.tops.delete(el.value);
    state.last = el.checked ? el.value : null;
    changed();
  }
});

$('#sugar').addEventListener('input', e => {
  state.sugar = Number(e.target.value);
  $('#sugarOut').textContent = sugarText();
  state.last = null;
  changed();
});

$$('.chip[data-filter]').forEach(chip => chip.addEventListener('click', () => {
  state.filter = chip.dataset.filter;
  $$('.chip[data-filter]').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  renderToppings();
}));

$('#search').addEventListener('input', e => { state.query = e.target.value; renderToppings(); });
$('#clearFilter').addEventListener('click', () => { resetFilterUI(); renderToppings(); });

$('#custName').addEventListener('input', renderTicket);
$('#surpriseBtn').addEventListener('click', surprise);
$('#resetBtn').addEventListener('click', reset);
$('#recipeBtn').addEventListener('click', openRecipe);
$('#orderBtn').addEventListener('click', placeOrder);
// "Rate your drink" on the ticket (after placing an order)
$('#rateBtn').addEventListener('click', () => {
  const o = state.lastOrder;
  if (!o) return;
  if (o.rated) { toast(`Order ${o.no} is already rated. Thank you!`); return; }
  openFeedback(targetFromOrder(o));
});

// "Give feedback" / "Write a review": works any time, no order needed
$$('.feedback-open').forEach(btn =>
  btn.addEventListener('click', () => openFeedback(targetFromSelection())));
$('#printBtn').addEventListener('click', () => window.print());

// "See reviews" under the drink name
$('#seeReviews').addEventListener('click', () => {
  revUI.scope = 'drink'; revUI.pin = null; revUI.star = 0; revUI.fresh = null;
  syncScopeUI();
  renderReviews();
  $('#reviews').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// recipe dialog
const dlg = $('#recipeDialog');
$('#closeRecipe').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // click backdrop to close

// feedback dialog
const fbDlg = $('#feedbackDialog');
$('#closeFeedback').addEventListener('click', () => fbDlg.close());
fbDlg.addEventListener('click', e => { if (e.target === fbDlg) fbDlg.close(); });
$('#fbForm').addEventListener('submit', submitFeedback);
$('#fbComment').addEventListener('input', e => { $('#fbCount').textContent = `${e.target.value.length}/200`; });

// reviews: scope (this drink / all), star filter, sort, reset
$('#scopeChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  revUI.scope = chip.dataset.scope;
  revUI.star = 0; revUI.fresh = null;
  if (revUI.scope === 'drink') revUI.pin = null;
  syncScopeUI();
  renderReviews();
});
$('#distBars').addEventListener('click', e => {
  const row = e.target.closest('.dist-row');
  if (!row) return;
  const s = Number(row.dataset.star);
  revUI.star = revUI.star === s ? 0 : s;          // click again to clear
  revUI.fresh = null;
  renderReviews();
});
$('#noReviews').addEventListener('click', e => {
  if (e.target.closest('.clear-star')) { revUI.star = 0; renderReviews(); }
});
$('#sortSelect').addEventListener('change', e => { revUI.sort = e.target.value; renderReviews(); });
$('#resetReviews').addEventListener('click', () => {
  reviews = sampleReviews();
  saveReviews();
  revUI.star = 0; revUI.fresh = null; revUI.pin = null;
  renderBases();
  renderRateLine();
  renderReviews();
  toast('Reviews reset to the samples.');
});

/* =========================================================
   INIT
   ========================================================= */
$('#fbTags').innerHTML = FB_TAGS.map(t =>
  `<label class="tag"><input type="checkbox" value="${t}"><span>${t}</span></label>`).join('');

renderBases();
renderToppings();
renderReviews();
changed();