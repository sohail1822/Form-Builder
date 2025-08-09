import { configureStore } from '@reduxjs/toolkit'
import formBuilderReducer from '../features/formBuilder/formBuilderSlice.ts'

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
