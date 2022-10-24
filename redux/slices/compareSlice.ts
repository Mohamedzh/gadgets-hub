import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Phone } from '@prisma/client'



const initialState: Phone[] = []

export const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        addToComparison: (state, action: PayloadAction<Phone>) => {
            state.push(action.payload)
        },
        removeFromComparison: (state, action: PayloadAction<Phone>) => {
            return state.filter(item => item !== action.payload)
        },
    },
})

export const { addToComparison, removeFromComparison } = compareSlice.actions
export default compareSlice.reducer