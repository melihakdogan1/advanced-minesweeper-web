import { calculateAISuggestions } from './ai'
import { Cell } from './types'

describe('calculateAISuggestions()', () => {
  it('should return no suggestions on an empty revealed cell', () => {
    const board: Cell[][] = [
      [
        { row:0, col:0, isMine:false, isRevealed:true, isFlagged:false, nearbyMines:0 }
      ]
    ]
    const suggestions = calculateAISuggestions(board)
    expect(suggestions).toEqual([])
  })
})

