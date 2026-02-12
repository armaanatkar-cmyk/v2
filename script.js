// Select key DOM nodes used for interaction
const yesButton = document.getElementById("yesButton");
const showPuzzleButton = document.getElementById("showPuzzleButton");
const cardContent = document.getElementById("cardContent");
const heartsLayer = document.getElementById("heartsLayer");
const puzzleSection = document.getElementById("puzzleSection");
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzleStatus = document.getElementById("puzzleStatus");

// The real uploaded photo is only used by the puzzle tiles
const puzzlePhotoSrc = typeof PUZZLE_PHOTO_DATA_URI === "string" ? PUZZLE_PHOTO_DATA_URI : "";

// Puzzle state for a simple 3x3 tile-swap game
const boardSize = 3;
let tiles = [];
let selectedIndex = null;

/** Create one floating heart particle. */
function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = "❤";
  heart.style.left = `${Math.random() * 95}%`;
  const size = (Math.random() * 1.1 + 0.9).toFixed(2);
  const duration = (Math.random() * 1.2 + 1.8).toFixed(2);
  heart.style.fontSize = `${size}rem`;
  heart.style.animationDuration = `${duration}s`;
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), Number(duration) * 1000 + 100);
}

/** Shuffle an array and return a copy. */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Check if puzzle pieces are in solved order. */
function isSolved() {
  return tiles.every((tile, index) => tile === index);
}

/** Render the 3x3 puzzle board using the uploaded photo only. */
function renderPuzzle() {
  puzzleBoard.innerHTML = "";

  tiles.forEach((piece, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "puzzle-tile";
    if (selectedIndex === index) tile.classList.add("selected");

    // Translate piece index into background coordinates (0%, 50%, 100%)
    const x = (piece % boardSize) * 50;
    const y = Math.floor(piece / boardSize) * 50;
    tile.style.setProperty("--bg-pos", `${x}% ${y}%`);

    // Puzzle image source is fixed to the real uploaded photo
    tile.style.setProperty("--photo-url", `url('${puzzlePhotoSrc}')`);

    tile.addEventListener("click", () => handleTileClick(index));
    puzzleBoard.appendChild(tile);
  });
}

/** Handle swapping of two selected puzzle tiles. */
function handleTileClick(index) {
  if (selectedIndex === null) {
    selectedIndex = index;
    renderPuzzle();
    return;
  }

  [tiles[selectedIndex], tiles[index]] = [tiles[index], tiles[selectedIndex]];
  selectedIndex = null;
  renderPuzzle();

  if (isSolved()) {
    puzzleStatus.textContent = "You solved it! That’s our beautiful photo 💖";
    for (let i = 0; i < 24; i += 1) setTimeout(spawnHeart, i * 70);
  }
}

/** Start (or restart) the puzzle game. */
function startPuzzle() {
  const solved = Array.from({ length: boardSize * boardSize }, (_, i) => i);
  tiles = shuffle(solved);

  // Make sure the starting board is not already solved
  if (isSolved()) [tiles[0], tiles[1]] = [tiles[1], tiles[0]];

  selectedIndex = null;
  puzzleStatus.textContent = "Tap two tiles to swap them.";
  puzzleSection.classList.add("show");
  renderPuzzle();
}

/** Trigger celebratory hearts and then replace card content after Yes click. */
function celebrateYes() {
  yesButton.disabled = true;
  showPuzzleButton.disabled = true;
  const burstInterval = setInterval(spawnHeart, 120);

  setTimeout(() => {
    clearInterval(burstInterval);
    cardContent.innerHTML = `
      <div class="celebration">
        <div>
          <h2>I knew you’d say YES ❤️</h2>
          <p>Happy Valentine’s Day, my love!</p>
        </div>
      </div>
    `;

    for (let i = 0; i < 20; i += 1) {
      setTimeout(spawnHeart, i * 80);
    }
  }, 1400);
}

// Wire up interactions
yesButton.addEventListener("click", celebrateYes);
showPuzzleButton.addEventListener("click", startPuzzle);
