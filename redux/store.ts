import { configureStore } from '@reduxjs/toolkit'
import brandFilterReducer from './slices/brandFilterSlice'
import compareReducer from './slices/compareSlice'
import activeFiltersReducer from './slices/activeFiltersSlice'
import osFilterReducer from './slices/osFilterSlice'
import batterySizeFilterReducer from './slices/batterySizeFilterSlice'
import displaySizeFilterReducer from './slices/displaySizeFilterSlice'
import ramFilterReducer from './slices/ramFilterSlice'


export const store = configureStore({
  reducer: {
    compare: compareReducer,
    brandFilter: brandFilterReducer,
    activeFilters: activeFiltersReducer,
    osFilter: osFilterReducer,
    batterySizeFilter: batterySizeFilterReducer,
    displaySizeFilter: displaySizeFilterReducer,
    ramFilter: ramFilterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch