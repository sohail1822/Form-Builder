import type { FormSchema } from '../features/formBuilder/types'

const KEY = 'form_builder_forms_v1'

export function loadForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as FormSchema[]
  } catch {
    return []
  }
}

export function saveForm(schema: FormSchema) {
  const arr = loadForms()
  arr.push(schema)
  localStorage.setItem(KEY, JSON.stringify(arr))
}



export function deleteForm(formId: string) {
  const forms = loadForms()
  const updatedForms = forms.filter(form => form.id !== formId)
  localStorage.setItem(KEY, JSON.stringify(updatedForms))
}