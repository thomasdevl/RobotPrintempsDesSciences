document.addEventListener("DOMContentLoaded", function () {
  const gridContainer = document.getElementById("grid-container");
  const moveForwardBtn = document.getElementById("move-forward");
  const turnLeftBtn = document.getElementById("turn-left");
  const turnRightBtn = document.getElementById("turn-right");
  const pickDiamondBtn = document.getElementById("pick-diamond");
  const levelSelect = document.getElementById("level");

  let grid = []; // Initialize grid array
  let robotPosition = { x: 0, y: 0 };
  let robotDirection = "up";
  let moveCount = 0; // Initialize move count

  function loadLevel(level) {
      fetch(`levels/level${level}.json`)
          .then(response => response.json())
          .then(data => {
              grid = data.grid;
              resetRobotPosition(); // Reset robot position
              renderGrid();
          })
          .catch(error => console.error('Error loading level:', error));
  }

  function resetRobotPosition() {
      robotPosition = { x: 0, y: 0 };
      robotDirection = "up";
      moveCount = 0; // Reset move count whenever a new level is loaded
      document.getElementById("move-count").innerHTML = `Moves: ${moveCount}`; // Update display
  }

  function renderGrid() {
      gridContainer.innerHTML = '';
      grid.forEach(row => {
          row.forEach(cell => {
              const cellElement = document.createElement("div");
              cellElement.classList.add("grid-cell");
              if (cell === 1) {
                  cellElement.classList.add("wall");
              } else if (cell === 2) {
                  cellElement.classList.add("diamond");
              }
              gridContainer.appendChild(cellElement);
          });
      });
      updateRobotPosition(); // Update robot position after rendering grid
  }

  function updateRobotPosition() {
      const robotElement = document.querySelector(".robot");
      if (robotElement) robotElement.classList.remove("robot");

      const cell = gridContainer.children[robotPosition.y * 10 + robotPosition.x];
      cell.classList.add("robot");
      cell.innerHTML = "";
      switch (robotDirection) {
          case "up":
              cell.innerHTML = "&#8593;";
              break;
          case "down":
              cell.innerHTML = "&#8595;";
              break;
          case "left":
              cell.innerHTML = "&#8592;";
              break;
          case "right":
              cell.innerHTML = "&#8594;";
              break;
      }
  }

  function moveForward() {
      const { x, y } = robotPosition;
      let newX = x, newY = y;

      switch (robotDirection) {
          case "up":
              newY = Math.max(0, y - 1);
              break;
          case "down":
              newY = Math.min(9, y + 1);
              break;
          case "left":
              newX = Math.max(0, x - 1);
              break;
          case "right":
              newX = Math.min(9, x + 1);
              break;
      }

      if (grid[newY][newX] !== 1) {
          robotPosition.x = newX;
          robotPosition.y = newY;
          updateRobotPosition();
          
          moveCount++; // Increment move count
          document.getElementById("move-count").innerHTML = `Moves: ${moveCount}`; // Update display
      }
  }

  function turnLeft() {
      switch (robotDirection) {
          case "up":
              robotDirection = "left";
              break;
          case "down":
              robotDirection = "right";
              break;
          case "left":
              robotDirection = "down";
              break;
          case "right":
              robotDirection = "up";
              break;
      }
      moveCount++; // Increment move count
      document.getElementById("move-count").innerHTML = `Moves: ${moveCount}`; // Update display
      updateRobotPosition();
  }

  function turnRight() {
      switch (robotDirection) {
          case "up":
              robotDirection = "right";
              break;
          case "down":
              robotDirection = "left";
              break;
          case "left":
              robotDirection = "up";
              break;
          case "right":
              robotDirection = "down";
              break;
      }
      moveCount++; // Increment move count
      document.getElementById("move-count").innerHTML = `Moves: ${moveCount}`; // Update display
      updateRobotPosition();
  }

  function pickDiamond() {
      const { x, y } = robotPosition;
      if (grid[y][x] === 2) {
          grid[y][x] = 0;
          const cell = gridContainer.children[y * 10 + x];
          cell.classList.remove("diamond");
          moveCount++; // Increment move count
          document.getElementById("move-count").innerHTML = `Moves: ${moveCount}`; // Update display
          updateRobotPosition(); // Ensure robot remains visible and updated
      }
  }

  levelSelect.addEventListener("change", function () {
      const selectedLevel = levelSelect.value;
      loadLevel(selectedLevel); // Load the selected level
  });

  moveForwardBtn.addEventListener("click", moveForward);
  turnLeftBtn.addEventListener("click", turnLeft);
  turnRightBtn.addEventListener("click", turnRight);
  pickDiamondBtn.addEventListener("click", pickDiamond);

  // Load default level on page load
  loadLevel(levelSelect.value);
});

