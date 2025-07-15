import { Timer } from '@/utils/Timer';
import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import TileComponent from '../components/Tile';
import { generateBoard, Tile } from '../utils/board';

const ROWS = 8
const COLS = 8
const MINES = 10
const ICON_COLOR = '#55AD9B'

const createEmptyBoard = (): Tile[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => ({
      x,
      y,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  )

export default function HomeScreen() {
  const [board, setBoard] = useState<Tile[][]>(createEmptyBoard)
  const [firstClick, setFirstClick] = useState(true)
  const [isBoardRevealed, setIsBoardRevealed] = useState(false)
  const [flaggedTiles, setFlaggedTiles] = useState<number>(MINES)

  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<Timer | null>(null)

  useEffect(() => {
    timerRef.current = new Timer(1000) // tick every second
    return () => timerRef.current?.reset()
  }, [])

  const handleTimerStart = () => {
    timerRef.current?.start(setElapsed)
  }

  const handleTimerPause = () => {
    timerRef.current?.pause()
  }

  const handleTimerReset = () => {
    timerRef.current?.reset()
    setElapsed(0)
  }

const revealTile = (x: number, y: number) => {
  // Use the existing board state unless it's the first click
  let currentBoard = board
  if (firstClick) {
    // On the first click, generate a new board ensuring the first tile isn't a mine
    currentBoard = generateBoard(ROWS, COLS, MINES, { x, y })
    setFirstClick(false)
    handleTimerReset()
    handleTimerStart()
  }

  // Create a deep copy to mutate safely before setting state
  const newBoard = currentBoard.map(row => row.map(tile => ({ ...tile })))

  const tile = newBoard[y][x]

  // Guard against revealing flagged or already revealed tiles
  if (tile.isRevealed || tile.isFlagged) {
    return
  }

  // Check for game over
  if (tile.isMine) {
    handleTimerPause()
    revealAll(newBoard) // Reveal all tiles on loss
    setBoard(newBoard)
    Alert.alert('💥 Game Over', 'You hit a mine!')
    return
  }
  
  // *** THE FIX IS HERE ***
  // If the tile is empty (0 adjacent mines), start the flood fill.
  // Otherwise, just reveal the single clicked tile.
  if (tile.adjacentMines === 0) {
    revealEmpty(newBoard, x, y)
  } else {
    tile.isRevealed = true
  }

  // Update the board in the UI
  setBoard(newBoard)

  // Check for a win condition
  if (checkWin(newBoard)) {
    Alert.alert('🎉 You Win!', 'You found all the mines!')
  }
}

  const flagTile = (x: number, y: number) => {
    const newBoard = board.map(row => row.map(tile => ({ ...tile })))
    const tile = newBoard[y][x]
    if (!tile.isRevealed) {
      tile.isFlagged ? setFlaggedTiles(flaggedTiles + 1) : setFlaggedTiles(flaggedTiles - 1)
      tile.isFlagged = !tile.isFlagged
      Vibration.vibrate(50) // Vibrate for 50 milliseconds
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
    setIsBoardRevealed(true)
  }

  const checkWin = (board: Tile[][]) => {
    for (let row of board) {
      for (let tile of row) {
        if (!tile.isMine && !tile.isRevealed) {
          return false
        }
      }
    }
    handleTimerPause()
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
    handleTimerReset()
    setFlaggedTiles(MINES)
    setBoard(createEmptyBoard())
    setFirstClick(true)
    setIsBoardRevealed(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.secondaryTextView}>
        <Text style={styles.secondaryText}>{flaggedTiles}</Text>
        <FontAwesome5 name="font-awesome-flag" size={20} color={ICON_COLOR} style={styles.iconStyle} />
        <Text style={styles.secondaryText}>{MINES}</Text>
        <FontAwesome6 name="land-mine-on" size={20} color={ICON_COLOR} style={styles.iconStyle} />
        <Text style={styles.secondaryText}>
          {Math.floor(elapsed / 60000)}:{String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')}
        </Text>
        <TouchableOpacity onPress={resetGame}>
          <Ionicons name="reload-circle-sharp" size={24} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>
      {board.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((tile, x) => (
            <TileComponent
              key={`${x}-${y}`}
              tile={tile}
              onReveal={() => revealTile(x, y)}
              onFlag={() => flagTile(x, y)}
              isBoardRevealed={isBoardRevealed}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8EFD3',
  },
  row: {
    flexDirection: 'row',
  },
  secondaryTextView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  secondaryText: {
    color: '#55AD9B',
    fontWeight: '700',
    fontSize: 20,
    marginHorizontal: 5
  },
  iconStyle: {
    marginRight: 20
  },
})