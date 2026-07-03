const state = {
  xp: Number(localStorage.getItem("rrb_xp") || 0),
  stars: Number(localStorage.getItem("rrb_stars") || 0),
  mastered: new Set(JSON.parse(localStorage.getItem("rrb_mastered") || "[]")),
  wrongBook: JSON.parse(localStorage.getItem("rrb_wrong_book") || "{}"),
  dailySounds: 0,
  dailyWords: 0,
  dailySight: 0,
  activeCategory: "all",
  activeVocabLength: "all",
  vocabIndex: 0,
  vocabPlaying: true,
  vocabTimer: null,
  vocabInterval: 5000,
  storyIndex: 0,
  storyFilter: "all",
  storyAutoPlay: false,
  query: "",
  quiz: null,
  dictation: {
    active: false,
    batch: [],
    index: 0,
    correct: 0,
    answers: []
  }
};

const colors = ["#8df0c6", "#8bd8ff", "#ffb3cf", "#ffd968", "#c5b4ff", "#ffb199"];

const phonics = [
  ...[
    ["a", "alphabet sound", "short /a/ as in apple", "🍎", ["apple", "ant", "am"]],
    ["b", "alphabet sound", "/b/ as in ball", "🏀", ["ball", "bat", "big"]],
    ["c", "alphabet sound", "hard /c/ as in cat", "🐱", ["cat", "cup", "can"]],
    ["d", "alphabet sound", "/d/ as in dog", "🐶", ["dog", "dad", "dig"]],
    ["e", "alphabet sound", "short /e/ as in egg", "🥚", ["egg", "end", "elf"]],
    ["f", "alphabet sound", "/f/ as in fish", "🐟", ["fish", "fan", "fun"]],
    ["g", "alphabet sound", "hard /g/ as in goat", "🐐", ["goat", "gum", "get"]],
    ["h", "alphabet sound", "/h/ as in hat", "🎩", ["hat", "hop", "hug"]],
    ["i", "alphabet sound", "short /i/ as in igloo", "🧊", ["igloo", "in", "it"]],
    ["j", "alphabet sound", "/j/ as in jam", "🍓", ["jam", "jet", "jump"]],
    ["k", "alphabet sound", "/k/ as in kite", "🪁", ["kite", "kid", "kit"]],
    ["l", "alphabet sound", "/l/ as in lion", "🦁", ["lion", "lap", "log"]],
    ["m", "alphabet sound", "/m/ as in moon", "🌙", ["moon", "mom", "map"]],
    ["n", "alphabet sound", "/n/ as in nest", "🪺", ["nest", "net", "nap"]],
    ["o", "alphabet sound", "short /o/ as in octopus", "🐙", ["octopus", "on", "ox"]],
    ["p", "alphabet sound", "/p/ as in pig", "🐷", ["pig", "pen", "pop"]],
    ["q", "alphabet sound", "/kw/ as in queen", "👑", ["queen", "quick", "quack"]],
    ["r", "alphabet sound", "/r/ as in rainbow", "🌈", ["rainbow", "run", "red"]],
    ["s", "alphabet sound", "/s/ as in sun", "☀️", ["sun", "sit", "sad"]],
    ["t", "alphabet sound", "/t/ as in turtle", "🐢", ["turtle", "top", "tap"]],
    ["u", "alphabet sound", "short /u/ as in umbrella", "☂️", ["umbrella", "up", "us"]],
    ["v", "alphabet sound", "/v/ as in van", "🚐", ["van", "vet", "vest"]],
    ["w", "alphabet sound", "/w/ as in web", "🕸️", ["web", "win", "wet"]],
    ["x", "alphabet sound", "/ks/ as in box", "📦", ["box", "fox", "six"]],
    ["y", "alphabet sound", "/y/ as in yo-yo", "🪀", ["yo-yo", "yes", "yellow"]],
    ["z", "alphabet sound", "/z/ as in zipper", "🤐", ["zipper", "zoo", "zoom"]]
  ].map(toCard),
  ...[
    ["bl", "consonant blend", "two sounds slide together", "🧱", ["blue", "black", "block"]],
    ["br", "consonant blend", "two sounds slide together", "🧹", ["brown", "brick", "brush"]],
    ["cl", "consonant blend", "two sounds slide together", "☁️", ["clap", "clock", "cloud"]],
    ["cr", "consonant blend", "two sounds slide together", "🖍️", ["crab", "crayon", "crash"]],
    ["dr", "consonant blend", "two sounds slide together", "🥁", ["drum", "drop", "dress"]],
    ["fl", "consonant blend", "two sounds slide together", "🌸", ["flag", "flip", "flower"]],
    ["fr", "consonant blend", "two sounds slide together", "🐸", ["frog", "free", "from"]],
    ["gl", "consonant blend", "two sounds slide together", "✨", ["glad", "glow", "glass"]],
    ["gr", "consonant blend", "two sounds slide together", "🍇", ["green", "grape", "grass"]],
    ["pl", "consonant blend", "two sounds slide together", "✈️", ["play", "plant", "plum"]],
    ["pr", "consonant blend", "two sounds slide together", "🎁", ["prize", "press", "pretty"]],
    ["sc", "consonant blend", "two sounds slide together", "🛴", ["scarf", "scout", "scan"]],
    ["sk", "consonant blend", "two sounds slide together", "🛼", ["skip", "skate", "sky"]],
    ["sl", "consonant blend", "two sounds slide together", "🛝", ["slide", "sleep", "slip"]],
    ["sm", "consonant blend", "two sounds slide together", "😊", ["smile", "small", "smell"]],
    ["sn", "consonant blend", "two sounds slide together", "❄️", ["snow", "snack", "snail"]],
    ["sp", "consonant blend", "two sounds slide together", "🥄", ["spoon", "spin", "spot"]],
    ["st", "consonant blend", "two sounds slide together", "⭐", ["star", "stop", "stick"]],
    ["sw", "consonant blend", "two sounds slide together", "🏊", ["swim", "sweet", "swing"]],
    ["tr", "consonant blend", "two sounds slide together", "🚂", ["tree", "train", "trip"]],
    ["scr", "three-letter blend", "three sounds slide together", "📜", ["scrub", "scrap", "scream"]],
    ["shr", "three-letter blend", "three sounds slide together", "🍤", ["shrimp", "shred", "shrink"]],
    ["spl", "three-letter blend", "three sounds slide together", "💦", ["splash", "split", "splat"]],
    ["spr", "three-letter blend", "three sounds slide together", "🌱", ["spring", "spray", "sprout"]],
    ["squ", "three-letter blend", "three sounds slide together", "⬛", ["squid", "squash", "squeak"]],
    ["str", "three-letter blend", "three sounds slide together", "🛣️", ["street", "string", "strong"]],
    ["thr", "three-letter blend", "three sounds slide together", "3️⃣", ["three", "throw", "throat"]]
  ].map(toCard),
  ...[
    ["ch", "digraph", "two letters make one sound", "🧀", ["chip", "chair", "cheese"]],
    ["sh", "digraph", "two letters make one sound", "🐚", ["ship", "shop", "shell"]],
    ["th", "digraph", "voiced or quiet tongue sound", "👍", ["the", "this", "thin"]],
    ["wh", "digraph", "breathy /w/ sound", "🐳", ["what", "when", "whale"]],
    ["ph", "digraph", "/f/ sound", "📞", ["phone", "photo", "graph"]],
    ["ck", "digraph", "/k/ after a short vowel", "🦆", ["duck", "sock", "back"]],
    ["ng", "digraph", "ringing ending sound", "🔔", ["song", "ring", "king"]],
    ["nk", "digraph", "nasal ending sound", "🦨", ["pink", "sink", "bank"]],
    ["tch", "trigraph", "/ch/ after a short vowel", "⌚", ["watch", "catch", "match"]],
    ["dge", "trigraph", "/j/ after a short vowel", "🌉", ["bridge", "badge", "fudge"]]
  ].map(toCard),
  ...[
    ["a_e", "long vowel", "magic e makes A say its name", "🎂", ["cake", "game", "make"]],
    ["i_e", "long vowel", "magic e makes I say its name", "🪁", ["kite", "bike", "smile"]],
    ["o_e", "long vowel", "magic e makes O say its name", "🏠", ["home", "rope", "stone"]],
    ["u_e", "long vowel", "magic e makes U say its name", "🧊", ["cube", "cute", "mule"]],
    ["ai", "vowel team", "long A team", "🌧️", ["rain", "tail", "paint"]],
    ["ay", "vowel team", "long A at the end", "🎈", ["day", "play", "say"]],
    ["ee", "vowel team", "long E team", "🐝", ["bee", "tree", "green"]],
    ["ea", "vowel team", "long E team", "🍃", ["read", "leaf", "beach"]],
    ["igh", "vowel team", "long I team", "💡", ["light", "night", "bright"]],
    ["ie", "vowel team", "long I or long E", "🥧", ["pie", "tie", "field"]],
    ["oa", "vowel team", "long O team", "⛵", ["boat", "coat", "road"]],
    ["ow", "vowel team", "long O or /ow/", "🌼", ["snow", "grow", "cow"]],
    ["oe", "vowel team", "long O team", "🦶", ["toe", "doe", "goes"]],
    ["ue", "vowel team", "long U team", "💙", ["blue", "glue", "true"]],
    ["ui", "vowel team", "long U team", "🍓", ["fruit", "juice", "suit"]],
    ["oo", "vowel team", "moon or book sound", "🌙", ["moon", "book", "food"]],
    ["ou", "diphthong", "mouth sound", "🏠", ["out", "house", "cloud"]],
    ["oi", "diphthong", "coin sound", "🪙", ["coin", "oil", "boil"]],
    ["oy", "diphthong", "toy sound", "🧸", ["toy", "boy", "joy"]],
    ["au", "vowel team", "hawk sound", "🦅", ["sauce", "launch", "August"]],
    ["aw", "vowel team", "saw sound", "🪚", ["saw", "draw", "paw"]]
  ].map(toCard),
  ...[
    ["ar", "r-controlled", "bossy R changes the vowel", "🚗", ["car", "star", "farm"]],
    ["er", "r-controlled", "bossy R changes the vowel", "🧑‍🏫", ["her", "fern", "letter"]],
    ["ir", "r-controlled", "bossy R changes the vowel", "🐦", ["bird", "girl", "shirt"]],
    ["or", "r-controlled", "bossy R changes the vowel", "🐴", ["horse", "corn", "fork"]],
    ["ur", "r-controlled", "bossy R changes the vowel", "🐢", ["turn", "fur", "curl"]],
    ["all", "word family", "chunk to read quickly", "⚽", ["ball", "call", "small"]],
    ["ing", "ending", "action ending", "🎤", ["sing", "jumping", "reading"]],
    ["ed", "ending", "past tense ending", "✅", ["jumped", "played", "wanted"]],
    ["s", "ending", "more than one or he/she action", "🧦", ["cats", "dogs", "runs"]],
    ["le", "ending", "final stable syllable", "🍎", ["apple", "table", "little"]],
    ["soft c", "letter pattern", "c says /s/ before e, i, y", "🏙️", ["city", "cent", "cycle"]],
    ["soft g", "letter pattern", "g says /j/ before e, i, y", "🦒", ["giant", "gem", "gym"]]
  ].map(toCard)
];

const sightWords = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
  "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
  "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
  "two", "more", "write", "go", "see", "number", "no", "way", "could", "people",
  "my", "than", "first", "water", "been", "call", "who", "oil", "sit", "now",
  "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"
];

const phonicsStories = window.PHONICS_STORIES || [];

const highFrequencyWords = [...new Set((window.HIGH_FREQUENCY_WORDS || sightWords).map((word) => word.trim()).filter(Boolean))];
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30];

const pictureCues = {
  I: ["🙂", "me"],
  a: ["1️⃣", "one thing"],
  Mr: ["👨", "man title"],
  Mrs: ["👩", "woman title"],
  PM: ["🌙", "evening"],
  TV: ["📺", "television"],
  act: ["🎭", "do something"],
  add: ["➕", "put together"],
  age: ["🎂", "how old"],
  air: ["💨", "around us"],
  all: ["👐", "everything"],
  and: ["➕", "together"],
  animal: ["🐾", "living creature"],
  answer: ["✅", "reply"],
  area: ["🗺️", "place"],
  arm: ["💪", "body part"],
  art: ["🎨", "making pictures"],
  baby: ["👶", "little child"],
  back: ["↩️", "behind"],
  ball: ["⚽", "round toy"],
  bank: ["🏦", "money place"],
  bed: ["🛏️", "sleep place"],
  bird: ["🐦", "flying animal"],
  bit: ["🧩", "small piece"],
  blue: ["🔵", "color"],
  boat: ["⛵", "water travel"],
  body: ["🧍", "person"],
  book: ["📚", "read it"],
  box: ["📦", "container"],
  boy: ["👦", "child"],
  car: ["🚗", "road travel"],
  card: ["💌", "small paper"],
  care: ["🤲", "help kindly"],
  child: ["🧒", "young person"],
  city: ["🏙️", "big town"],
  class: ["🏫", "school group"],
  clear: ["✨", "easy to see"],
  color: ["🌈", "red blue green"],
  cup: ["🥤", "drink holder"],
  day: ["☀️", "sun time"],
  doctor: ["🩺", "health helper"],
  dog: ["🐶", "pet"],
  door: ["🚪", "open and close"],
  dream: ["💭", "sleep picture"],
  earth: ["🌍", "our world"],
  eat: ["🍽️", "take food"],
  eye: ["👁️", "see with it"],
  face: ["😊", "front of head"],
  family: ["👨‍👩‍👧", "home people"],
  father: ["👨", "dad"],
  fire: ["🔥", "hot flame"],
  fish: ["🐟", "water animal"],
  food: ["🍎", "what we eat"],
  foot: ["🦶", "walk with it"],
  friend: ["🤝", "kind person"],
  game: ["🎲", "play activity"],
  girl: ["👧", "child"],
  glass: ["🥛", "drink cup"],
  green: ["🟢", "color"],
  ground: ["🌱", "under feet"],
  group: ["👥", "many together"],
  hand: ["✋", "hold with it"],
  head: ["🙂", "top body part"],
  health: ["💚", "body wellness"],
  home: ["🏠", "where you live"],
  horse: ["🐴", "riding animal"],
  house: ["🏡", "home building"],
  idea: ["💡", "thought"],
  job: ["🧰", "work"],
  kid: ["🧒", "child"],
  land: ["🏞️", "ground"],
  letter: ["✉️", "message or alphabet"],
  life: ["🌱", "being alive"],
  light: ["💡", "not dark"],
  line: ["➖", "long mark"],
  list: ["📋", "many items"],
  man: ["👨", "adult male"],
  map: ["🗺️", "place picture"],
  money: ["💵", "pay with it"],
  month: ["📅", "part of year"],
  morning: ["🌅", "early day"],
  mother: ["👩", "mom"],
  music: ["🎵", "song sounds"],
  name: ["🏷️", "what we call it"],
  night: ["🌙", "dark time"],
  number: ["🔢", "counting"],
  oil: ["🛢️", "slippery liquid"],
  page: ["📄", "paper in book"],
  paper: ["📄", "write on it"],
  parent: ["👪", "mom or dad"],
  part: ["🧩", "piece"],
  people: ["👥", "persons"],
  person: ["🧍", "human"],
  picture: ["🖼️", "image"],
  place: ["📍", "where"],
  plant: ["🌿", "green living thing"],
  point: ["👉", "show"],
  red: ["🔴", "color"],
  river: ["🏞️", "water path"],
  room: ["🚪", "inside space"],
  school: ["🏫", "learn place"],
  sea: ["🌊", "big water"],
  ship: ["🚢", "big boat"],
  sister: ["👧", "girl sibling"],
  song: ["🎵", "music words"],
  star: ["⭐", "sky shape"],
  story: ["📖", "read tale"],
  street: ["🛣️", "road"],
  student: ["🎒", "learner"],
  sun: ["☀️", "bright star"],
  table: ["🪑", "furniture"],
  teacher: ["👩‍🏫", "school helper"],
  team: ["👥", "working group"],
  town: ["🏘️", "small city"],
  tree: ["🌳", "tall plant"],
  wall: ["🧱", "room side"],
  water: ["💧", "drink liquid"],
  week: ["📆", "seven days"],
  wind: ["💨", "moving air"],
  window: ["🪟", "see through"],
  woman: ["👩", "adult female"],
  word: ["🔤", "letters with meaning"],
  world: ["🌍", "earth"],
  year: ["🗓️", "twelve months"]
};

function getWordMeta(word) {
  const lower = word.toLowerCase();
  const cue = pictureCues[word] || pictureCues[lower] || inferPictureCue(lower);
  const article = /^[aeiou]/i.test(word) ? "an" : "a";
  const definition = cue[2] || `${word} is ${article} common English word. Picture clue: ${cue[1]}.`;
  return {
    word,
    lower,
    picture: cue[0],
    clue: cue[1],
    definition,
    sentence: makeSentence(word),
    length: word.length
  };
}

function inferPictureCue(word) {
  if (word.endsWith("tion") || word.endsWith("ment")) return ["📘", "big idea word", "This is an idea word you may see in books."];
  if (word.endsWith("ing")) return ["🏃", "action word", "This word can show something happening."];
  if (word.endsWith("ed")) return ["✅", "finished action", "This word can show something already happened."];
  if (word.endsWith("ly")) return ["✨", "how something happens", "This word often tells how an action happens."];
  if (word.endsWith("er") || word.endsWith("or")) return ["🧑", "person or thing", "This word can name a person, helper, or thing."];
  if (word.includes("time")) return ["⏰", "time clue", "This word is connected to time."];
  if (word.includes("work")) return ["🧰", "work clue", "This word is connected to work."];
  if (word.includes("water")) return ["💧", "water clue", "This word is connected to water."];
  if (word.includes("school")) return ["🏫", "school clue", "This word is connected to school."];
  if (word.length <= 2) return ["🔤", "tiny word", "This is a tiny high-frequency word."];
  if (word.length <= 4) return ["🧩", "short word", "This is a short word used often in reading."];
  if (word.length <= 7) return ["📗", "reading word", "This is a useful word you will see in many books."];
  return ["🌟", "challenge word", "This is a longer high-frequency word for growing readers."];
}

function makeSentence(word) {
  if (/^[A-Z]{2,}$/.test(word)) return `I can see ${word}.`;
  if (word === "I") return "I can read.";
  return `I can read the word ${word}.`;
}

function toCard([sound, category, clue, picture, words]) {
  return { sound, category, clue, picture, words };
}

const els = {
  toast: document.querySelector("#toast"),
  xp: document.querySelector("#xp-count"),
  stars: document.querySelector("#stars-count"),
  mastered: document.querySelector("#mastered-count"),
  category: document.querySelector("#category-select"),
  search: document.querySelector("#search-input"),
  grid: document.querySelector("#phonics-grid"),
  sightGrid: document.querySelector("#sight-grid"),
  learnSummary: document.querySelector("#learn-summary"),
  quizPicture: document.querySelector("#quiz-picture"),
  quizSound: document.querySelector("#quiz-sound"),
  quizOptions: document.querySelector("#quiz-options"),
  quizFeedback: document.querySelector("#quiz-feedback"),
  vocabSummary: document.querySelector("#vocab-summary"),
  vocabLengthFilter: document.querySelector("#vocab-length-filter"),
  vocabSpeed: document.querySelector("#vocab-speed"),
  vocabAlbumPicture: document.querySelector("#vocab-album-picture"),
  vocabAlbumCount: document.querySelector("#vocab-album-count"),
  vocabAlbumWord: document.querySelector("#vocab-album-word"),
  vocabAlbumLength: document.querySelector("#vocab-album-length"),
  vocabAlbumDefinition: document.querySelector("#vocab-album-definition"),
  vocabAlbumSentence: document.querySelector("#vocab-album-sentence"),
  vocabAlbumProgress: document.querySelector("#vocab-album-progress"),
  toggleVocabPlay: document.querySelector("#toggle-vocab-play"),
  dictationSize: document.querySelector("#dictation-size"),
  dictationPicture: document.querySelector("#dictation-picture"),
  dictationProgress: document.querySelector("#dictation-progress"),
  dictationClue: document.querySelector("#dictation-clue"),
  dictationAnswer: document.querySelector("#dictation-answer"),
  dictationFeedback: document.querySelector("#dictation-feedback"),
  dictationResults: document.querySelector("#dictation-results"),
  wrongbookList: document.querySelector("#wrongbook-list"),
  storyScene: document.querySelector("#story-scene"),
  storySoundLabel: document.querySelector("#story-sound-label"),
  storyCount: document.querySelector("#story-count"),
  storyTitle: document.querySelector("#story-title"),
  storySelect: document.querySelector("#story-select"),
  storySoundFilter: document.querySelector("#story-sound-filter"),
  toggleStoryAutoplay: document.querySelector("#toggle-story-autoplay"),
  storyText: document.querySelector("#story-text"),
  dailySounds: document.querySelector("#daily-sounds"),
  dailyWords: document.querySelector("#daily-words"),
  dailySight: document.querySelector("#daily-sight"),
  reviewDue: document.querySelector("#review-due")
};

function speak(text, rate = 0.82) {
  if (!("speechSynthesis" in window)) {
    showToast("Audio is not available in this browser.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.12;
  speechSynthesis.speak(utterance);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function saveProgress() {
  localStorage.setItem("rrb_xp", String(state.xp));
  localStorage.setItem("rrb_stars", String(state.stars));
  localStorage.setItem("rrb_mastered", JSON.stringify([...state.mastered]));
  localStorage.setItem("rrb_wrong_book", JSON.stringify(state.wrongBook));
}

function addXp(amount, message) {
  state.xp += amount;
  if (state.xp > 0 && state.xp % 100 < amount) {
    state.stars += 1;
    message = "Level up! A new star joined your shelf.";
  }
  saveProgress();
  renderStats();
  if (message) showToast(message);
}

function renderStats() {
  els.xp.textContent = state.xp;
  els.stars.textContent = state.stars;
  els.mastered.textContent = state.mastered.size;
  els.dailySounds.textContent = `${Math.min(state.dailySounds, 6)}/6 sounds`;
  els.dailyWords.textContent = `${Math.min(state.dailyWords, 5)}/5 words`;
  els.dailySight.textContent = `${Math.min(state.dailySight, 5)}/5 sight`;
  els.reviewDue.textContent = `${dueReviewWords().length} due`;
}

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(days) {
  const date = todayStart();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function dueReviewWords() {
  const today = todayStart().getTime();
  return Object.values(state.wrongBook)
    .filter((item) => new Date(item.dueAt).getTime() <= today)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
}

function recordDictationResult(word, isCorrect, typed) {
  const lower = word.toLowerCase();
  const current = state.wrongBook[lower] || {
    word,
    mistakes: 0,
    correctStreak: 0,
    intervalIndex: 0,
    dueAt: addDays(1),
    history: []
  };

  if (isCorrect) {
    current.correctStreak += 1;
    current.intervalIndex = Math.min(current.intervalIndex + 1, REVIEW_INTERVALS.length - 1);
  } else {
    current.mistakes += 1;
    current.correctStreak = 0;
    current.intervalIndex = 0;
  }

  current.dueAt = addDays(REVIEW_INTERVALS[current.intervalIndex]);
  current.lastAnswer = typed;
  current.history = [...(current.history || []), { date: new Date().toISOString(), correct: isCorrect, typed }].slice(-12);

  if (!isCorrect || current.mistakes > 0) {
    state.wrongBook[lower] = current;
  }

  if (isCorrect && current.correctStreak >= 4) {
    delete state.wrongBook[lower];
  }

  saveProgress();
}

function setupCategories() {
  const categories = ["all", ...new Set(phonics.map((item) => item.category))];
  els.category.innerHTML = categories.map((category) => {
    const label = category === "all" ? "All sounds" : titleCase(category);
    return `<option value="${category}">${label}</option>`;
  }).join("");
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function filteredPhonics() {
  const query = state.query.trim().toLowerCase();
  return phonics.filter((item) => {
    const matchesCategory = state.activeCategory === "all" || item.category === state.activeCategory;
    const haystack = [item.sound, item.category, item.clue, ...item.words].join(" ").toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function renderCards() {
  const cards = filteredPhonics();
  els.learnSummary.textContent = `${cards.length} sound cards ready. Tap words to hear examples.`;
  els.grid.innerHTML = cards.map((item, index) => `
    <article class="sound-card" style="--card-color:${colors[index % colors.length]}">
      <div class="sound-top">
        <span class="sound-symbol">${item.sound}</span>
        <span class="sound-type">${item.category}</span>
      </div>
      <div class="picture-badge" aria-hidden="true">${item.picture}</div>
      <p>${item.clue}</p>
      <div class="word-chips">
        ${item.words.map((word) => `<button type="button" data-say="${word}">${word}</button>`).join("")}
      </div>
      <div class="card-actions">
        <button class="mini-button" type="button" data-sound="${item.sound}">Hear</button>
        <button class="mini-button" type="button" data-master="${item.sound}">I know it</button>
      </div>
    </article>
  `).join("");
}

function renderSightWords() {
  els.sightGrid.innerHTML = sightWords.map((word) => `
    <article class="sight-card">
      <strong>${word}</strong>
      <button type="button" data-sight="${word}">Hear</button>
    </article>
  `).join("");
}

function setupVocabFilters() {
  const lengths = [...new Set(highFrequencyWords.map((word) => word.length))].sort((a, b) => a - b);
  els.vocabLengthFilter.innerHTML = [
    `<option value="all">All lengths</option>`,
    ...lengths.map((length) => `<option value="${length}">${length} letters</option>`)
  ].join("");
}

function filteredVocabWords() {
  const query = state.query.trim().toLowerCase();
  return highFrequencyWords.filter((word) => {
    const matchesLength = state.activeVocabLength === "all" || word.length === Number(state.activeVocabLength);
    return matchesLength && (!query || word.toLowerCase().includes(query));
  });
}

function renderVocabWords() {
  const words = filteredVocabWords();
  if (!words.length) {
    els.vocabSummary.textContent = "No words match this filter.";
    els.vocabAlbumPicture.innerHTML = `<span>🔎</span><small>no match</small>`;
    els.vocabAlbumCount.textContent = "No word selected";
    els.vocabAlbumWord.textContent = "Try another search";
    els.vocabAlbumLength.textContent = "0 letters";
    els.vocabAlbumDefinition.textContent = "Change the search or word length filter to keep learning.";
    els.vocabAlbumSentence.textContent = "";
    els.vocabAlbumProgress.style.width = "0%";
    stopVocabAlbum();
    return;
  }

  state.vocabIndex = clampIndex(state.vocabIndex, words.length);
  const meta = getWordMeta(words[state.vocabIndex]);
  const progress = ((state.vocabIndex + 1) / words.length) * 100;
  els.vocabSummary.textContent = `${words.length} words in this album. Auto-play shows one word every ${state.vocabInterval / 1000} seconds.`;
  els.vocabAlbumPicture.innerHTML = `<span>${meta.picture}</span><small>${meta.clue}</small>`;
  els.vocabAlbumCount.textContent = `Word ${state.vocabIndex + 1} of ${words.length}`;
  els.vocabAlbumWord.textContent = meta.word;
  els.vocabAlbumLength.textContent = `${meta.length} letters`;
  els.vocabAlbumDefinition.textContent = meta.definition;
  els.vocabAlbumSentence.textContent = meta.sentence;
  els.vocabAlbumProgress.style.width = `${progress}%`;
  els.toggleVocabPlay.textContent = state.vocabPlaying ? "Pause" : "Play";
  scheduleVocabAlbum();
}

function clampIndex(index, length) {
  if (length <= 0) return 0;
  if (index < 0) return length - 1;
  if (index >= length) return 0;
  return index;
}

function currentVocabWord() {
  const words = filteredVocabWords();
  return words[clampIndex(state.vocabIndex, words.length)];
}

function moveVocabAlbum(direction) {
  const words = filteredVocabWords();
  if (!words.length) return;
  state.vocabIndex = clampIndex(state.vocabIndex + direction, words.length);
  renderVocabWords();
}

function stopVocabAlbum() {
  window.clearTimeout(state.vocabTimer);
  state.vocabTimer = null;
}

function scheduleVocabAlbum() {
  stopVocabAlbum();
  const words = filteredVocabWords();
  const isVisible = document.querySelector("#vocab-panel")?.classList.contains("active");
  if (!state.vocabPlaying || !isVisible || words.length <= 1) return;
  state.vocabTimer = window.setTimeout(() => moveVocabAlbum(1), state.vocabInterval);
}

function explainWord(word) {
  const meta = getWordMeta(word);
  speak(`${meta.word}. ${meta.definition} Example: ${meta.sentence}`, 0.78);
  state.dailyWords += 1;
  addXp(4, "Word learned!");
}

function spellWord(word) {
  speak(`${word}. ${word.split("").join(". ")}. ${word}.`, 0.72);
}

function renderWrongBook() {
  const entries = Object.values(state.wrongBook).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  if (!entries.length) {
    els.wrongbookList.innerHTML = `<div class="empty-state">No wrong words yet. Start a dictation quest and missed words will appear here.</div>`;
    renderStats();
    return;
  }

  const today = todayStart().getTime();
  els.wrongbookList.innerHTML = entries.map((entry) => {
    const meta = getWordMeta(entry.word);
    const due = new Date(entry.dueAt);
    const isDue = due.getTime() <= today;
    const dueLabel = isDue ? "Review today" : `Review on ${due.toLocaleDateString()}`;
    return `
      <article class="review-card ${isDue ? "due-now" : ""}">
        <div class="word-picture" aria-hidden="true">
          <span>${meta.picture}</span>
          <small>${meta.clue}</small>
        </div>
        <div>
          <div class="vocab-word">
            <strong>${entry.word}</strong>
            <span>${dueLabel}</span>
          </div>
          <p>Mistakes: ${entry.mistakes}. Correct streak: ${entry.correctStreak}. Next spacing: ${REVIEW_INTERVALS[entry.intervalIndex]} day(s).</p>
        </div>
        <div class="review-actions">
          <button class="mini-button" type="button" data-learn-word="${entry.word}">Review</button>
          <button class="mini-button" type="button" data-remove-wrong="${entry.word.toLowerCase()}">Known</button>
        </div>
      </article>
    `;
  }).join("");
  renderStats();
}

function newQuiz() {
  const answer = phonics[Math.floor(Math.random() * phonics.length)];
  const options = new Set([answer.words[0]]);
  while (options.size < 4) {
    const pick = phonics[Math.floor(Math.random() * phonics.length)];
    options.add(pick.words[Math.floor(Math.random() * pick.words.length)]);
  }
  state.quiz = { answer, options: [...options].sort(() => Math.random() - 0.5) };
  els.quizPicture.textContent = answer.picture;
  els.quizSound.textContent = answer.sound;
  els.quizFeedback.textContent = "";
  els.quizOptions.innerHTML = state.quiz.options.map((word) => `
    <button type="button" data-quiz-word="${word}">${word}</button>
  `).join("");
  speak(`Find a word with ${answer.sound}.`);
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function startDictation() {
  const batchSize = Number(els.dictationSize.value);
  const due = dueReviewWords().map((entry) => entry.word);
  const fresh = shuffleItems(highFrequencyWords.filter((word) => !due.includes(word))).slice(0, batchSize);
  const batch = [...due.slice(0, batchSize), ...fresh].slice(0, batchSize);
  state.dictation = {
    active: true,
    batch: shuffleItems(batch),
    index: 0,
    correct: 0,
    answers: []
  };
  els.dictationResults.innerHTML = "";
  els.dictationFeedback.textContent = "";
  setTab("dictation");
  showDictationWord();
}

function showDictationWord() {
  const current = state.dictation.batch[state.dictation.index];
  if (!current) {
    finishDictation();
    return;
  }

  const meta = getWordMeta(current);
  els.dictationPicture.innerHTML = `<span>${meta.picture}</span><small>${meta.clue}</small>`;
  els.dictationProgress.textContent = `Word ${state.dictation.index + 1} of ${state.dictation.batch.length}`;
  els.dictationClue.textContent = `Picture clue: ${meta.clue}. This word has ${meta.length} letters.`;
  els.dictationAnswer.value = "";
  els.dictationAnswer.focus();
  speak(current, 0.78);
}

function submitDictationAnswer() {
  if (!state.dictation.active) {
    showToast("Start dictation first.");
    return;
  }

  const word = state.dictation.batch[state.dictation.index];
  const typed = els.dictationAnswer.value.trim();
  if (!typed) {
    showToast("Type your answer first.");
    return;
  }

  const isCorrect = typed.toLowerCase() === word.toLowerCase();
  if (isCorrect) {
    state.dictation.correct += 1;
    els.dictationFeedback.textContent = `Correct! ${word}`;
    speak(`Correct. ${word}.`, 0.82);
    addXp(8);
  } else {
    els.dictationFeedback.textContent = `Not yet. The word was ${word}.`;
    speak(`Good try. The word was ${word}.`, 0.82);
  }

  recordDictationResult(word, isCorrect, typed);
  state.dictation.answers.push({ word, typed, isCorrect });
  state.dictation.index += 1;
  renderWrongBook();
  window.setTimeout(showDictationWord, 900);
}

function finishDictation() {
  const total = state.dictation.batch.length || 1;
  const score = Math.round((state.dictation.correct / total) * 100);
  state.dictation.active = false;
  els.dictationProgress.textContent = `Finished: ${state.dictation.correct}/${total}`;
  els.dictationClue.textContent = `Score: ${score}%. Wrong words were added to the review book.`;
  els.dictationPicture.innerHTML = `<span>${score >= 80 ? "🏆" : "🌟"}</span><small>${score}%</small>`;
  els.dictationFeedback.textContent = score >= 80 ? "Great spelling quest!" : "Nice work. Review the missed words and try again.";
  els.dictationResults.innerHTML = state.dictation.answers.map((answer) => `
    <div class="result-row">
      <span>${answer.isCorrect ? "✓" : "•"} ${answer.word}</span>
      <span>${answer.isCorrect ? "correct" : `typed: ${answer.typed}`}</span>
    </div>
  `).join("");
  speak(`Dictation finished. Your score is ${score} percent.`, 0.8);
  addXp(score >= 80 ? 20 : 8);
}

function setupStoryFilters() {
  const sounds = ["all", ...new Set(phonicsStories.map((story) => story.sound))];
  els.storySoundFilter.innerHTML = sounds.map((sound) => {
    const label = sound === "all" ? "All stories" : titleCase(sound);
    return `<option value="${sound}">${label}</option>`;
  }).join("");
  renderStoryOptions();
}

function filteredStories() {
  return phonicsStories.filter((story) => state.storyFilter === "all" || story.sound === state.storyFilter);
}

function renderStoryOptions() {
  const stories = filteredStories();
  state.storyIndex = clampIndex(state.storyIndex, stories.length || 1);
  els.storySelect.innerHTML = stories.map((story, index) => `
    <option value="${index}">${index + 1}. ${story.title}</option>
  `).join("");
  els.storySelect.value = String(state.storyIndex);
  renderStory();
}

function currentStory() {
  const stories = filteredStories();
  return stories[clampIndex(state.storyIndex, stories.length)];
}

function renderStory() {
  const stories = filteredStories();
  if (!stories.length) {
    els.storyTitle.textContent = "No story found";
    els.storyText.textContent = "Choose another phonics sound.";
    els.storyCount.textContent = "0 stories";
    els.storyScene.innerHTML = `<span>🔎</span><small>no story</small>`;
    return;
  }
  state.storyIndex = clampIndex(state.storyIndex, stories.length);
  const story = stories[state.storyIndex];
  els.storySelect.value = String(state.storyIndex);
  els.storyTitle.textContent = story.title;
  els.storyText.textContent = story.text;
  els.storyCount.textContent = `Story ${state.storyIndex + 1} of ${stories.length}`;
  els.storySoundLabel.textContent = story.sound;
  els.storyScene.innerHTML = `<span>${story.emoji}</span><small id="story-sound-label">${story.sound}</small>`;
  els.toggleStoryAutoplay.textContent = state.storyAutoPlay ? "Stop Auto" : "Auto Play";
}

function playCurrentStory() {
  const story = currentStory();
  if (!story) return;
  if (!("speechSynthesis" in window)) {
    showToast("Audio is not available in this browser.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.text}`);
  utterance.lang = "en-US";
  utterance.rate = 0.76;
  utterance.pitch = 1.12;
  utterance.onend = () => {
    state.dailyWords += 1;
    renderStats();
    if (state.storyAutoPlay) {
      moveStory(1);
      window.setTimeout(playCurrentStory, 700);
    }
  };
  speechSynthesis.speak(utterance);
}

function moveStory(direction) {
  const stories = filteredStories();
  if (!stories.length) return;
  state.storyIndex = clampIndex(state.storyIndex + direction, stories.length);
  renderStory();
}

function setTab(tabName) {
  if (tabName !== "vocab") stopVocabAlbum();
  if (tabName !== "story") state.storyAutoPlay = false;
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tabName}-panel`);
  });
  if (tabName === "vocab") renderVocabWords();
  if (tabName === "wrongbook") renderWrongBook();
  if (tabName === "story") renderStory();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.tab) setTab(target.dataset.tab);

  if (target.dataset.say) {
    speak(target.dataset.say);
    state.dailyWords += 1;
    addXp(3);
    renderStats();
  }

  if (target.dataset.sound) {
    const item = phonics.find((card) => card.sound === target.dataset.sound);
    speak(`${item.sound}. ${item.clue}. ${item.words.join(", ")}.`);
    state.dailySounds += 1;
    addXp(5, "Sound sparkle earned!");
  }

  if (target.dataset.master) {
    state.mastered.add(target.dataset.master);
    state.dailySounds += 1;
    addXp(10, "Saved to the known shelf!");
  }

  if (target.dataset.sight) {
    speak(target.dataset.sight);
    state.dailySight += 1;
    addXp(4);
    renderStats();
  }

  if (target.dataset.quizWord) {
    const correct = state.quiz.answer.words.includes(target.dataset.quizWord);
    els.quizFeedback.textContent = correct ? "Yes! That word has the sound." : "Try again. Listen for the sound.";
    speak(correct ? `${target.dataset.quizWord}. Correct!` : `${target.dataset.quizWord}. Try again.`);
    if (correct) {
      state.dailyWords += 1;
      state.mastered.add(state.quiz.answer.sound);
      addXp(12, "Quest cleared!");
      window.setTimeout(newQuiz, 900);
    }
  }

  if (target.dataset.learnWord) {
    explainWord(target.dataset.learnWord);
  }

  if (target.dataset.spellWord) {
    spellWord(target.dataset.spellWord);
  }

  if (target.dataset.removeWrong) {
    delete state.wrongBook[target.dataset.removeWrong];
    saveProgress();
    renderWrongBook();
    showToast("Removed from wrong book.");
  }
});

document.querySelector("#start-quest").addEventListener("click", () => {
  setTab("learn");
  document.querySelector(".app-shell").scrollIntoView({ behavior: "smooth" });
  speak("Let us read, rhyme, and sparkle.");
});

document.querySelector("#hear-welcome").addEventListener("click", () => {
  speak("Welcome to Read and Rhyme Buddy. Tap a sound card, listen, and read the words.");
});

document.querySelector("#shuffle-cards").addEventListener("click", () => {
  phonics.sort(() => Math.random() - 0.5);
  renderCards();
});

document.querySelector("#new-question").addEventListener("click", newQuiz);

document.querySelector("#read-sight-list").addEventListener("click", () => {
  speak(sightWords.slice(0, 30).join(". "));
});

document.querySelector("#prev-vocab-word").addEventListener("click", () => moveVocabAlbum(-1));
document.querySelector("#next-vocab-word").addEventListener("click", () => moveVocabAlbum(1));
document.querySelector("#toggle-vocab-play").addEventListener("click", () => {
  state.vocabPlaying = !state.vocabPlaying;
  renderVocabWords();
});
document.querySelector("#hear-vocab-word").addEventListener("click", () => {
  const word = currentVocabWord();
  if (word) speak(word, 0.78);
});
document.querySelector("#learn-current-word").addEventListener("click", () => {
  const word = currentVocabWord();
  if (word) explainWord(word);
});
els.vocabSpeed.addEventListener("change", (event) => {
  state.vocabInterval = Number(event.target.value);
  renderVocabWords();
});

document.querySelector("#start-dictation").addEventListener("click", startDictation);
document.querySelector("#hear-dictation-word").addEventListener("click", () => {
  const word = state.dictation.batch[state.dictation.index];
  if (word) speak(word, 0.78);
});
document.querySelector("#submit-dictation").addEventListener("click", submitDictationAnswer);
els.dictationAnswer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitDictationAnswer();
});

document.querySelector("#refresh-wrongbook").addEventListener("click", renderWrongBook);

document.querySelector("#previous-story").addEventListener("click", () => moveStory(-1));
document.querySelector("#next-story").addEventListener("click", () => moveStory(1));

document.querySelector("#read-story").addEventListener("click", () => {
  state.storyAutoPlay = false;
  renderStory();
  playCurrentStory();
});

document.querySelector("#toggle-story-autoplay").addEventListener("click", () => {
  state.storyAutoPlay = !state.storyAutoPlay;
  renderStory();
  if (state.storyAutoPlay) playCurrentStory();
  else if ("speechSynthesis" in window) speechSynthesis.cancel();
});

els.storySelect.addEventListener("change", (event) => {
  state.storyIndex = Number(event.target.value);
  state.storyAutoPlay = false;
  renderStory();
});

els.storySoundFilter.addEventListener("change", (event) => {
  state.storyFilter = event.target.value;
  state.storyIndex = 0;
  state.storyAutoPlay = false;
  renderStoryOptions();
});

document.querySelector("#mark-story").addEventListener("click", () => {
  addXp(20, "Story star earned!");
});

document.querySelector("#claim-prize").addEventListener("click", () => {
  if (state.dailySounds >= 6 && state.dailyWords >= 5 && state.dailySight >= 5) {
    state.stars += 1;
    addXp(25, "Daily prize claimed!");
  } else {
    showToast("Finish the three quest goals first.");
  }
});

els.category.addEventListener("change", (event) => {
  state.activeCategory = event.target.value;
  renderCards();
});

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  state.vocabIndex = 0;
  renderCards();
  renderVocabWords();
});

els.vocabLengthFilter.addEventListener("change", (event) => {
  state.activeVocabLength = event.target.value;
  state.vocabIndex = 0;
  renderVocabWords();
});

setupCategories();
setupVocabFilters();
setupStoryFilters();
renderStats();
renderCards();
renderSightWords();
renderVocabWords();
renderWrongBook();
newQuiz();
renderStory();
