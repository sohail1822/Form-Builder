import  { useMemo, useState } from 'react'
import { Box, Button, TextField, Typography, MenuItem, Checkbox, FormControlLabel, Alert } from '@mui/material'
import { useAppSelector } from '../../../app/hooks'
import { evaluateDerived } from '../utils'
import type { Field } from '../types'
import { isEmail, isPasswordValid } from '../../../utils/validationRules'

export default function PreviewFormPage() {
  const form = useAppSelector(s => s.formBuilder.currentForm)
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function setVal(key: string, v: any) {
    setValues(prev => ({...prev, [key]: v}))
  }


  const computed = useMemo(() => {
    const map: Record<string, any> = {}
    form.fields.forEach(f => {
      if (f.derived) {
        const parents: Record<string, any> = {}
        f.derived.parents.forEach(k => parents[k] = values[k])
        map[f.key] = evaluateDerived(f.derived.formula, parents)
      }
    })
    return map
  }, [values, form.fields])

  function renderField(f: Field) {
    const val = f.derived ? computed[f.key] ?? '' : (values[f.key] ?? f.defaultValue ?? '')
    if (f.type === 'text' || f.type === 'number' || f.type === 'date') {
      return <TextField fullWidth label={f.label} value={val} onChange={e => setVal(f.key, e.target.value)} />
    }
    if (f.type === 'textarea') {
      return <TextField fullWidth multiline rows={4} label={f.label} value={val} onChange={e => setVal(f.key, e.target.value)} />
    }
    if (f.type === 'select' || f.type === 'radio') {
      return (
        <TextField select fullWidth label={f.label} value={val} onChange={e => setVal(f.key, e.target.value)}>
          {f.options?.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      )
    }
    if (f.type === 'checkbox') {
      return <FormControlLabel control={<Checkbox checked={!!val} onChange={e => setVal(f.key, e.target.checked)} />} label={f.label} />
    }
    return null
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    form.fields.forEach(f => {
      const value = f.derived ? computed[f.key] : (values[f.key] ?? '')
      if (f.required) {
        if (value === '' || value === null || value === undefined) {
          errs[f.key] = 'This field is required'
          return
        }
      }
      if (f.validations) {
        for (const v of f.validations) {
          if (v.type === 'minLength') {
            if ((value ?? '').toString().length < v.value) errs[f.key] = `Minimum length ${v.value}`
          }
          if (v.type === 'maxLength') {
            if ((value ?? '').toString().length > v.value) errs[f.key] = `Maximum length ${v.value}`
          }
          if (v.type === 'email') {
            if (!isEmail((value ?? '').toString())) errs[f.key] = `Invalid email`
          }
          if (v.type === 'password') {
            if (!isPasswordValid((value ?? '').toString())) errs[f.key] = `Password must be at least 8 chars and include a number`
          }
        }
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function onSubmit() {
    setSubmitted(true)
    if (validate()) {
      alert('Form valid — (note: we do not persist user input per requirements)')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Box>
      <Typography variant="h5">Preview: {form.name}</Typography>
      {submitted && Object.keys(errors).length > 0 && <Alert severity="error" sx={{mt:2}}>There are validation errors</Alert>}
      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {form.fields.map(f => (
          <Box key={f.id}>
            {renderField(f)}
            {errors[f.key] && <Typography color="error" variant="caption">{errors[f.key]}</Typography>}
          </Box>
        ))}
        <Box mt={2}>
          <Button variant="contained" onClick={onSubmit}>Submit</Button>
        </Box>
      </Box>
    </Box>
  )
}
