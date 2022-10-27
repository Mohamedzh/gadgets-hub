import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Phone } from '@prisma/client'
import { DetailedPhone } from '../../types'



const initialState: DetailedPhone[] = []

export const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        addToComparison: (state, action: PayloadAction<DetailedPhone>) => {
            state.push(action.payload)
        },
        removeFromComparison: (state, action: PayloadAction<DetailedPhone>) => {
            state.filter(item => item !== action.payload)
        },
    },
})

export const { addToComparison, removeFromComparison } = compareSlice.actions
export default compareSlice.reducer