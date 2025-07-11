export type Tile = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
  x: number
  y: number
}

export const generateBoard = (rows: number, cols: number, mineCount: number): Tile[][] => {
  const board: Tile[][] = []
  for (let y = 0; y < rows; y++) {
    const row: Tile[] = []
    for (let x = 0; x < cols; x++) {
      row.push({ x, y, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })
    }
    board.push(row)
  }

  // Place mines
  let minesPlaced = 0
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)
    if (!board[y][x].isMine) {
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