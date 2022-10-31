import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const brandFilterSlice = createSlice({
    name: 'brandFilter',
    initialState,
    reducers: {
        addToBrands: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromBrands: (state, action: PayloadAction<string>) => {
            return state.filter(item => item !== action.payload)
        },
        clearBrandFilter: (state) => {
            return initialState
        }
    },
})

export const { addToBrands, removeFromBrands, clearBrandFilter } = brandFilterSlice.actions
export default brandFilterSlice.reducer