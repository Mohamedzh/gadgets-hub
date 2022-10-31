import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const displaySizeFilterSlice = createSlice({
    name: 'displaySizeFilter',
    initialState,
    reducers: {
        addToDisplaySize: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromDisplaySize: (state, action: PayloadAction<string>) => {
            return state.filter(item => item !== action.payload)
        },
        clearDisplaySizeFilter: (state) => {
            return initialState
        }
    },
})

export const { addToDisplaySize, removeFromDisplaySize, clearDisplaySizeFilter } = displaySizeFilterSlice.actions
export default displaySizeFilterSlice.reducer