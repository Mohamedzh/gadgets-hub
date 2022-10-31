import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: { value: string, label: string }[] = []

export const activeFiltersSlice = createSlice({
    name: 'activeFilters',
    initialState,
    reducers: {
        addToFilters: (state, action: PayloadAction<{ value: string, label: string }>) => {
            state.push(action.payload)
        },
        removeFromFilters: (state, action: PayloadAction<{ value: string, label: string }>) => {
            return state.filter(item => item.value !== action.payload.value)
        },
        clearActiveFilters: (state) => {
            return initialState
        }
    },
})

export const { addToFilters, removeFromFilters, clearActiveFilters } = activeFiltersSlice.actions
export default activeFiltersSlice.reducer