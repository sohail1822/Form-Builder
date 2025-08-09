import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Field, FormSchema } from './types'
import { v4 as uuid } from 'uuid'

type State = {
  currentForm: {
    id: string
    name: string
    fields: Field[]
  }
}

const initialState: State = {
  currentForm: {
    id: uuid(),
    name: 'Untitled form',
    fields: []
  }
}

const slice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName(state, action: PayloadAction<string>) {
      state.currentForm.name = action.payload
    },
    addField(state, action: PayloadAction<Partial<Field>>) {
      const id = uuid()
      const key = 'f_' + id.slice(0, 8)
      const field: Field = {
        id,
        key,
        label: action.payload.label ?? 'Untitled',
        type: action.payload.type ?? 'text',
        required: action.payload.required ?? false,
        defaultValue: action.payload.defaultValue ?? '',
        options: action.payload.options ?? [],
        validations: action.payload.validations ?? [],
        derived: action.payload.derived ?? null
      }
      state.currentForm.fields.push(field)
    },
    updateField(state, action: PayloadAction<{ id: string; changes: Partial<Field> }>) {
      const f = state.currentForm.fields.find(x => x.id === action.payload.id)
      if (f) Object.assign(f, action.payload.changes)
    },
    removeField(state, action: PayloadAction<string>) {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload)
    },
    reorderFields(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload
      const arr = state.currentForm.fields
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
    },
    loadForm(state, action: PayloadAction<FormSchema>) {
      state.currentForm = {
        id: action.payload.id,
        name: action.payload.name,
        fields: action.payload.fields
      }
    },
    resetForm(state) {
      state.currentForm = {
        id: uuid(),
        name: 'Untitled form',
        fields: []
      }
    }
  }
})

export const {
  setFormName,
  addField,
  updateField,
  removeField,
  reorderFields,
  loadForm,
  resetForm
} = slice.actions

export default slice.reducer


 