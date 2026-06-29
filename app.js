const state = {
  xp: Number(localStorage.getItem("rrb_xp") || 0),
  stars: Number(localStorage.getItem("rrb_stars") || 0),
  mastered: new Set(JSON.parse(localStorage.getItem("rrb_mastered") || "[]")),
  dailySounds: 0,
  dailyWords: 0,
  dailySight: 0,
  activeCategory: "all",
  query: "",
  quiz: null
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

const storyBank = [
  "I see a small cat. The cat can sit in the sun.",
  "We can play by the big tree. I see a bee and a green leaf.",
  "The ship is on the blue sea. The fish can swim and splash.",
  "A frog jumps from the grass. It is fun to hop and clap.",
  "The child has a red kite. The kite can fly up, up, up.",
  "Mom said, \"Look at the bright star.\" We smile at the night sky."
];

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
  storyText: document.querySelector("#story-text"),
  dailySounds: document.querySelector("#daily-sounds"),
  dailyWords: document.querySelector("#daily-words"),
  dailySight: document.querySelector("#daily-sight")
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

function makeStory() {
  const story = storyBank[Math.floor(Math.random() * storyBank.length)];
  els.storyText.textContent = story;
}

function setTab(tabName) {
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tabName}-panel`);
  });
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

document.querySelector("#make-story").addEventListener("click", makeStory);

document.querySelector("#read-story").addEventListener("click", () => {
  speak(els.storyText.textContent, 0.78);
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
  renderCards();
});

setupCategories();
renderStats();
renderCards();
renderSightWords();
newQuiz();
makeStory();
