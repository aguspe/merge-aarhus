const TRACKS = [
  { name: 'Track A', color: '#c8ff3d', room: 'Room 1', host: 'hosted by Claude Meetup' },
  { name: 'Track B', color: '#e0433a', room: 'Room 2', host: 'hosted by Aarhus Ruby' },
  { name: 'Track C', color: '#4c8dff', room: 'Room 3', host: 'hosted by Aarhus.js' },
  { name: 'Track D', color: '#f2b234', room: 'Room 4', host: 'hosted by Python Aarhus' },
];

// [title, speaker, length, level] per track, in slot order
const TALKS = [
  [
    ['Agents that don’t lie: eval loops in practice', 'Sofie Krogh · Claude Meetup', '30 min', 'all'],
    ['Prompt caching, explained with receipts', 'Anders Vinther', '30 min', 'intermediate'],
    ['Building a local-first MCP server', 'Lea Thomsen', '45 min', 'advanced'],
    ['Shipping with Claude Code in a legacy Rails app', 'Mikkel Bang · Aarhus Ruby', '30 min', 'intermediate'],
    ['Panel: what a community owes its newcomers', 'All hosts', '45 min', 'all'],
  ],
  [
    ['Rails 8 without the JavaScript', 'Mette Lund', '30 min', 'intermediate'],
    ['Ractors in production, honestly', 'Jonas Friis', '30 min', 'advanced'],
    ['Ruby for people who write Python', 'Priya Nair', '30 min', 'beginner'],
    ['Hotwire vs. React: a fair fight', 'Mette Lund & Oliver Gram', '45 min', 'all'],
    ['Lightning talks · 5 × 5 min', 'Open mic', '30 min', 'all'],
  ],
  [
    ['Signals everywhere', 'Oliver Gram', '30 min', 'intermediate'],
    ['The last bundler talk you’ll need', 'Freja Holm', '30 min', 'all'],
    ['TypeScript types as documentation', 'Kasper Dahl', '30 min', 'beginner'],
    ['Streaming UI from the server', 'Lea Thomsen', '45 min', 'advanced'],
    ['Web Components in 2027', 'Freja Holm', '30 min', 'intermediate'],
  ],
  [
    ['uv, and why pip is over', 'Sara Ibsen', '30 min', 'all'],
    ['Pandas → Polars migration notes', 'Nikolaj Ravn', '30 min', 'intermediate'],
    ['Type hints that actually catch bugs', 'Sara Ibsen', '30 min', 'beginner'],
    ['Async Python without tears', 'Emil Skov', '45 min', 'advanced'],
    ['FastAPI at 10k req/s', 'Nikolaj Ravn', '30 min', 'advanced'],
  ],
];

// Shared "merge" moments appear in every track; numbers index into TALKS[track]
const DAY = [
  { time: '09:45', merge: ['Opening · all rooms', 'Main hall. Why we merged, how the day works.'] },
  { time: '10:15', talk: 0 },
  { time: '11:00', talk: 1 },
  { time: '11:45', talk: 2 },
  { time: '12:30', merge: ['Lunch merge', 'Everyone together. Sit with a community you don’t know.'] },
  { time: '13:30', talk: 3 },
  { time: '14:30', talk: 4 },
  { time: '17:00', merge: ['Closing · all rooms', 'Wrap-up, thanks, beers.'] },
];

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

function renderSlot(slot, track) {
  const row = el('div', 'slot');
  row.append(el('time', '', slot.time));

  if (slot.merge) {
    const box = el('div', 'slot-merge');
    box.append(el('strong', '', slot.merge[0]), el('span', '', slot.merge[1]));
    row.append(box);
  } else {
    const [title, sub, len, level] = TALKS[track][slot.talk];
    const box = el('div', 'slot-talk');
    const tags = el('div', 'tags');
    tags.append(el('span', 'tag', len), el('span', 'tag', level));
    box.append(el('div', 'talk-title', title), el('div', 'talk-sub', sub), tags);
    row.append(box);
  }
  return row;
}

const tabs = document.getElementById('tabs');
const buttons = TRACKS.map((t, i) => {
  const b = el('button', 'tab');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-controls', 'panel');
  const dot = el('span', 'dot');
  dot.style.background = t.color;
  b.append(dot, t.name);
  b.addEventListener('click', () => select(i));
  tabs.append(b);
  return b;
});

function select(i) {
  buttons.forEach((b, n) => b.setAttribute('aria-selected', String(n === i)));
  document.getElementById('room').textContent = TRACKS[i].room;
  document.getElementById('host').textContent = TRACKS[i].host;
  document.getElementById('slots').replaceChildren(...DAY.map((s) => renderSlot(s, i)));
  history.replaceState(null, '', `#track-${'abcd'[i]}`);
}

const fromHash = 'abcd'.indexOf(location.hash.replace('#track-', ''));
select(fromHash >= 0 && location.hash ? fromHash : 0);
