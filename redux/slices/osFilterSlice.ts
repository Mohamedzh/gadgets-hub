import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const osFilterSlice = createSlice({
    name: 'OSfilter',
    initialState,
    reducers: {
        addToOS: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromOS: (state, action: PayloadAction<string>) => {
            state.splice(state.indexOf(action.payload, 1))
        },
        clearOSFilter: (state) => {
            return initialState
        }
    },
})

export const { addToOS, removeFromOS, clearOSFilter } = osFilterSlice.actions
export default osFilterSlice.reducer