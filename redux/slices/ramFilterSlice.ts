import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const ramFilterSlice = createSlice({
    name: 'ramFilter',
    initialState,
    reducers: {
        addToRam: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromRam: (state, action: PayloadAction<string>) => {
            return state.filter(item => item !== action.payload)
        },
        clearRamFilter: (state) => {
            return initialState
        }
    },
})

export const { addToRam, removeFromRam, clearRamFilter } = ramFilterSlice.actions
export default ramFilterSlice.reducer