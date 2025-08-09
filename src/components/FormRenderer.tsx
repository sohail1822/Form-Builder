import type { Field } from '../features/formBuilder/types.ts'
import { Box, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material'

type Props = {
  fields: Field[]
  values: Record<string, any>
  onChange: (k:string, v:any) => void
}

export default function FormRenderer({ fields, values, onChange }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {fields.map(f => {
        const val = values[f.key] ?? f.defaultValue ?? ''
        if (f.type === 'text' || f.type === 'number' || f.type === 'date') {
          return <TextField key={f.id} label={f.label} value={val} onChange={e => onChange(f.key, e.target.value)} />
        }
        if (f.type === 'textarea') {
          return <TextField key={f.id} multiline rows={4} label={f.label} value={val} onChange={e => onChange(f.key, e.target.value)} />
        }
        if (f.type === 'select' || f.type === 'radio') {
          return (
            <TextField key={f.id} select label={f.label} value={val} onChange={e => onChange(f.key, e.target.value)}>
              {f.options?.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
          )
        }
        if (f.type === 'checkbox') {
          return <FormControlLabel key={f.id} control={<Checkbox checked={!!val} onChange={e => onChange(f.key, e.target.checked)} />} label={f.label} />
        }
        return null
      })}
    </Box>
  )
}
