import React, { useState } from 'react'
import { Alert, Button, StyleSheet, View } from 'react-native'
import TileComponent from '../components/Tile'
import { generateBoard, Tile } from '../utils/board'

const ROWS = 8
const COLS = 8
const MINES = 10

export default function HomeScreen() {
  const [board, setBoard] = useState(() => generateBoard(ROWS, COLS, MINES))

  const revealTile = (x: number, y: number) => {
    const newBoard = board.map(row => row.map(tile => ({ ...tile })))
    const tile = newBoard[y][x]
    if (tile.isFlagged || tile.isRevealed) return

    tile.isRevealed = true
    if (tile.isMine) {
      Alert.alert('💥 Game Over', 'You hit a mine!')
      revealAll(newBoard)
      setBoard(newBoard)
      return
    }

    if (tile.adjacentMines === 0) {
      revealEmpty(newBoard, x, y)
    }

    setBoard(newBoard)

    if (checkWin(newBoard)) {
      Alert.alert('🎉 You Win!', 'You found all the mines!')
    }
  }

  const flagTile = (x: number, y: number) => {
    const newBoard = board.map(row => row.map(tile => ({ ...tile })))
    const tile = newBoard[y][x]
    if (!tile.isRevealed) {
      tile.isFlagged = !tile.isFlagged
    }
    setBoard(newBoard)
  }

  const revealEmpty = (board: Tile[][], x: number, y: number) => {
    const tile = board[y][x]
    if (tile.isRevealed || tile.isMine || tile.isFlagged) return

    tile.isRevealed = true

    if (tile.adjacentMines === 0) {
      const neighbors = getNeighbors(board, x, y)
      for (const n of neighbors) {
        revealEmpty(board, n.x, n.y)
      }
    }
  }

  const revealAll = (board: Tile[][]) => {
    for (let row of board) {
      for (let tile of row) {
        tile.isRevealed = true
      }
    }
  }

  const checkWin = (board: Tile[][]) => {
    for (let row of board) {
      for (let tile of row) {
        if (!tile.isMine && !tile.isRevealed) {
          return false
        }
      }
    }
    return true
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

  const resetGame = () => {
    setBoard(generateBoard(ROWS, COLS, MINES))
  }

  return (
    <View style={styles.container}>
      <Button title="New Game" onPress={resetGame} />
      {board.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((tile, x) => (
            <TileComponent
              key={`${x}-${y}`}
              tile={tile}
              onReveal={() => revealTile(x, y)}
              onFlag={() => flagTile(x, y)}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

HomeScreen.options = {
  headerShown: false,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
  },
})