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
            state.splice(state.indexOf(action.payload, 1))
        },
        clearRamFilter: (state) => {
            return initialState
        }
    },
})

export const { addToRam, removeFromRam, clearRamFilter } = ramFilterSlice.actions
export default ramFilterSlice.reducer