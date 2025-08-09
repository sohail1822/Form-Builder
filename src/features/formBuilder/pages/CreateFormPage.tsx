import { useState } from 'react'
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { addField, setFormName, resetForm } from '../formBuilderSlice'
import FieldEditor from '../components/FieldEditor'
import type { FieldType } from '../types'
import { saveForm } from '../../../utils/localStorage'
import { useNavigate } from 'react-router-dom'

export default function CreateFormPage() {
  const dispatch = useAppDispatch()
  const form = useAppSelector(s => s.formBuilder.currentForm)
  const [newType, setNewType] = useState<FieldType>('text')
  const navigate = useNavigate()

  function addNew() {
    dispatch(addField({
      type: newType,
      label: 'New field'
    }))
  }

  function save() {
    const schema = {
      id: form.id,
      name: form.name || 'Untitled',
      createdAt: new Date().toISOString(),
      fields: form.fields
    }
    saveForm(schema)
    dispatch(resetForm())
    navigate('/myforms')
  }

  return (
    <Box>
      <Typography variant="h5">Create Form</Typography>
      <Box mt={2} display="flex" gap={2} alignItems="center">
        <TextField label="Form name" value={form.name} onChange={e => dispatch(setFormName(e.target.value))} />
        <Select value={newType} onChange={e => setNewType(e.target.value as FieldType)}>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="textarea">Textarea</MenuItem>
          <MenuItem value="select">Select</MenuItem>
          <MenuItem value="radio">Radio</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
        <Button variant="contained" onClick={addNew}>Add Field</Button>
        <Button color="success" variant="contained" onClick={save}>Save Form</Button>
      </Box>

      <Box mt={3}>
        {form.fields.length === 0 && <Typography color="text.secondary">No fields added yet</Typography>}
        {form.fields.map(f => <FieldEditor key={f.id} field={f} allFields={form.fields} />)}
      </Box>
    </Box>
  )
}
