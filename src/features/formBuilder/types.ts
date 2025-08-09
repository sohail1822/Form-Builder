export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date'

export type ValidationRule =
  | { type: "required" }
  | { type: "minLength"; value: number }
  | { type: "maxLength"; value: number }
  | { type: "email" }
  | { type: "password" };

export type Option = { label: string; value: string }

export type Field = {
  id: string
  key: string
  label: string
  type: FieldType
  required?: boolean
  defaultValue?: string
  options?: Option[]
  validations?: ValidationRule[]
  derived?: {
    parents: string[]
    formula: string
  } | null
}

export type FormSchema = {
  id: string
  name: string
  createdAt: string
  fields: Field[]
}
