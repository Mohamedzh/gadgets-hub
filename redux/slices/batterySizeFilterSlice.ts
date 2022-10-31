import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const batterySizeFilterSlice = createSlice({
    name: 'batterySizeFilter',
    initialState,
    reducers: {
        addToBatterySize: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromBatterySize: (state, action: PayloadAction<string>) => {
            return state.filter(item => item !== action.payload)
        },
        clearBatterySizeFilter: (state) => {
            return initialState
        }
    },
})

export const { addToBatterySize, removeFromBatterySize, clearBatterySizeFilter } = batterySizeFilterSlice.actions
export default batterySizeFilterSlice.reducer