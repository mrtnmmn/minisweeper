import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Tile } from '../utils/board'

type Props = {
  tile: Tile
  onReveal: () => void
  onFlag: () => void
}

export default function TileComponent({ tile, onReveal, onFlag }: Props) {
  const getDisplay = () => {
    if (tile.isFlagged) return '🚩'
    if (!tile.isRevealed) return ''
    if (tile.isMine) return '💣'
    return tile.adjacentMines > 0 ? tile.adjacentMines.toString() : ''
  }

  return (
    <Pressable
      onPress={onReveal}
      onLongPress={onFlag}
      style={[styles.tile, tile.isRevealed && styles.revealed]}
    >
      <Text style={styles.text}>{getDisplay()}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealed: {
    backgroundColor: '#eee',
  },
  text: {
    fontWeight: 'bold',
  },
})