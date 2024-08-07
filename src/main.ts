const canva: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
canva.width = 800;
canva.height = 700; 

const ctx: CanvasRenderingContext2D = canva.getContext('2d') as CanvasRenderingContext2D;
const btn: HTMLButtonElement = document.getElementById('next') as HTMLButtonElement;
let startGame = false;
let isDrawing = false;

function createMatrix(size = 10) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = new Array(size).fill(0);
    matrix.push(row);
  }
  return matrix;
}

let matrix = createMatrix(32);

const canvaWidth = canva.width;
const canvaHeight = canva.height;

const numRows = matrix.length;
const numCols = matrix[0].length;

const cellWidth = canvaWidth / numCols;
const cellHeight = canvaHeight / numRows;

function drawCanva() {
  ctx.clearRect(0, 0, canvaWidth, canvaHeight);
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const currentCell = matrix[row][col];
        const x = row*cellWidth;
        const y = col*cellHeight;
        if (currentCell === 1) {
            ctx.fillStyle = "#a2d2ff";
            ctx.fillRect(x, y, cellWidth, cellHeight);
        } else {
          ctx.strokeStyle = "#c9ada7";
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
  }
}

function aliveNeighbors (row: number, col: number) {
  let currentAlive = 0;
  for(let r = row - 1; r <= row + 1; r++) {
    for(let c = col - 1; c <= col + 1; c++) {
      if((r !== row || c !== col) && r >= 0 && r < numRows && c >= 0 && c < numCols){
        if(matrix[r][c] == 1) {
          currentAlive++;
        }
      }
    }
  }  

  return currentAlive
}

function goF () {
  let nextState = createMatrix(32);

  for(let rows = 0; rows < numRows; rows++) {
    for(let cols = 0; cols < numCols; cols++) {
      const currentCellState = matrix[rows][cols];
      let aliveNei = aliveNeighbors(rows, cols);
    
      switch (currentCellState) {
        case 0: {
          if(aliveNei == 3) nextState[rows][cols] = 1;
          break;
        }
        case 1: {
         if(aliveNei < 2 || aliveNei > 3) nextState[rows][cols] = 0
         else nextState[rows][cols] = 1
         break;
        }
      }
    }
  }
  matrix = nextState;
  drawCanva();
}

function startDrawing(event: MouseEvent) {
  isDrawing = true;
  drawOnCanvas(event);
}

function stopDrawing() {
  isDrawing = false;
}

function drawOnCanvas(event: MouseEvent) {
  if (!isDrawing) return;

  const rect = canva.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Log mouse position and canvas coordinates
  console.log(`Mouse Position: (${event.clientX}, ${event.clientY})`);
  console.log(`Canvas Coordinates: (${x}, ${y})`);
  
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);

  // Log matrix coordinates
  console.log(`Matrix Position: (${row}, ${col})`);
  
  if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
    matrix[col][row] = 1;
    drawCanva();
  }
}

// Add event listeners to the canvas for drawing
canva.addEventListener('mousedown', startDrawing);
canva.addEventListener('mouseup', stopDrawing);
canva.addEventListener('mousemove', drawOnCanvas);

btn.addEventListener('click', goF);
drawCanva();

// TODO: Do the infinite loop
