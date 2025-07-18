export type Tile = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
  x: number
  y: number
}

export const generateBoard = (
  rows: number,
  cols: number,
  mineCount: number,
  initialClick: { x: number; y: number }
): Tile[][] => {
  const board: Tile[][] = []
  for (let y = 0; y < rows; y++) {
    const row: Tile[] = []
    for (let x = 0; x < cols; x++) {
      row.push({ x, y, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })
    }
    board.push(row)
  }

  // Get the initial tile and its neighbors
  const safeZone = new Set<string>()
  const addToSafeZone = (x: number, y: number) => {
    if (x >= 0 && y >= 0 && x < cols && y < rows) {
      safeZone.add(`${x},${y}`)
    }
  }

  addToSafeZone(initialClick.x, initialClick.y)
  getNeighbors(board, initialClick.x, initialClick.y).forEach(tile =>
    addToSafeZone(tile.x, tile.y)
  )

  // Place mines excluding the safe zone
  let minesPlaced = 0
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)
    const key = `${x},${y}`
    if (!board[y][x].isMine && !safeZone.has(key)) {
      board[y][x].isMine = true
      minesPlaced++
    }
  }

  // Calculate adjacent mines
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x].isMine) continue
      const neighbors = getNeighbors(board, x, y)
      board[y][x].adjacentMines = neighbors.filter(n => n.isMine).length
    }
  }

  return board
}

const getNeighbors = (board: Tile[][], x: number, y: number): Tile[] => {
  const deltas = [-1, 0, 1]
  const neighbors: Tile[] = []
  for (const dy of deltas) {
    for (const dx of deltas) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (ny >= 0 && ny < board.length && nx >= 0 && nx < board[0].length) {
        neighbors.push(board[ny][nx])
      }
    }
  }
  return neighbors
}