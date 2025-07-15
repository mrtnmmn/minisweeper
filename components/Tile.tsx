import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Tile } from '../utils/board';

type Props = {
  tile: Tile
  onReveal: () => void
  onFlag: () => void
  isBoardRevealed: boolean
}

export default function TileComponent({ tile, onReveal, onFlag, isBoardRevealed }: Props) {
  const getDisplay = () => {
    if (tile.isFlagged) return <FontAwesome5 name="font-awesome-flag" size={20} color={isBoardRevealed ? "#5A827E" : "#D8EFD3"} />
    if (!tile.isRevealed) return ''
    if (tile.isMine) return <FontAwesome6 name="land-mine-on" size={20} color="#5A827E" />
    return tile.adjacentMines > 0 ? tile.adjacentMines.toString() : ''
  }

  return (
    <Pressable
      onPress={onReveal}
      onLongPress={onFlag}
      style={[styles.tile, tile.isRevealed && styles.revealed]}
    >
      <Text style={[styles.text, styles.one]}>{getDisplay()}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    margin: 2,
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#55AD9B',
    backgroundColor: '#55AD9B',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  revealed: {
    backgroundColor: '#eee',
  },
  text: {
    fontWeight: 'bold',
  },
  one: {
    color: '#096B68'
  }
})