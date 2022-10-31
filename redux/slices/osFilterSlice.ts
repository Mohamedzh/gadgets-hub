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
            return state.filter(item => item !== action.payload)
        },
        clearOSFilter: (state) => {
            return initialState
        }
    },
})

export const { addToOS, removeFromOS, clearOSFilter } = osFilterSlice.actions
export default osFilterSlice.reducer