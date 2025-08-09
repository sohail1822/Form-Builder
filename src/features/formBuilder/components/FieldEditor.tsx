import { useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { Field, Option } from "../types";
import { useAppDispatch } from "../../../app/hooks";
import { updateField, removeField } from "../formBuilderSlice";

type Props = {
  field: Field;
  allFields: Field[];
};

export default function FieldEditor({ field, allFields }: Props) {
  const dispatch = useAppDispatch();
  const [local, setLocal] = useState<Field>(field);

  function save() {
    dispatch(updateField({ id: field.id, changes: local }));
  }

  return (
    <Box sx={{ border: "1px solid #eee", p: 2, mb: 2, borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">
          {field.label} • {field.type}
        </Typography>
        <Box>
          <IconButton onClick={() => dispatch(removeField(field.id))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Label"
        value={local.label}
        onChange={(e) => setLocal({ ...local, label: e.target.value })}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="Key"
        value={local.key}
        onChange={(e) => setLocal({ ...local, key: e.target.value })}
        sx={{ mt: 2 }}
      />
      <Box display="flex" gap={2} mt={2}>
        <FormControlLabel
          control={
            <Switch
              checked={!!local.required}
              onChange={(e) =>
                setLocal({ ...local, required: e.target.checked })
              }
            />
          }
          label="Required"
        />
        <TextField
          label="Default value"
          value={local.defaultValue ?? ""}
          onChange={(e) => setLocal({ ...local, defaultValue: e.target.value })}
        />
      </Box>

      {(local.type === "select" || local.type === "radio") && (
        <OptionsEditor
          options={local.options ?? []}
          onChange={(opts) => setLocal({ ...local, options: opts })}
        />
      )}

      <DerivedEditor
        field={local}
        allFields={allFields}
        onChange={(f) => setLocal(f)}
      />

      <Box mt={2} display="flex" gap={1}>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: Option[];
  onChange: (o: Option[]) => void;
}) {
  const [list, setList] = useState<Option[]>(options);
  function add() {
    const next = [
      ...list,
      { label: "Option", value: "option_" + (list.length + 1) },
    ];
    setList(next);
    onChange(next);
  }
  function update(i: number, k: string, v: string) {
    const c = [...list];
    c[i] = { ...c[i], [k]: v };
    setList(c);
    onChange(c);
  }
  function remove(i: number) {
    const c = [...list];
    c.splice(i, 1);
    setList(c);
    onChange(c);
  }
  return (
    <Box mt={2}>
      <Typography variant="subtitle2">Options</Typography>
      {list.map((opt, i) => (
        <Box key={i} display="flex" gap={1} alignItems="center" mt={1}>
          <TextField
            size="small"
            value={opt.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <TextField
            size="small"
            value={opt.value}
            onChange={(e) => update(i, "value", e.target.value)}
          />
          <IconButton onClick={() => remove(i)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={add} sx={{ mt: 1 }}>
        Add option
      </Button>
    </Box>
  );
}

function DerivedEditor({
  field,
//   allFields,
  onChange,
}: {
  field: Field;
  allFields: Field[];
  onChange: (f: Field) => void;
}) {
//   const parents = field.derived?.parents ?? [];

  function toggleDerived() {
    if (field.derived) onChange({ ...field, derived: null });
    else onChange({ ...field, derived: { parents: [], formula: "" } });
  }

  function setParents(keys: string[]) {
    onChange({ ...field, derived: { ...field.derived!, parents: keys } });
  }

  function setFormula(formula: string) {
    onChange({ ...field, derived: { ...field.derived!, formula } });
  }

  return (
    <Box mt={2}>
      <FormControlLabel
        control={<Switch checked={!!field.derived} onChange={toggleDerived} />}
        label="Derived field"
      />
      {field.derived && (
        <Box mt={1}>
          <TextField
            label="Parent fields (comma separated keys)"
            fullWidth
            size="small"
            value={field.derived.parents.join(",")}
            onChange={(e) =>
              setParents(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            sx={{ mb: 1 }}
          />
          <TextField
            label="Formula (JS expression, use keys of parents)"
            fullWidth
            size="small"
            value={field.derived.formula}
            onChange={(e) => setFormula(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Example: parseInt(dobYear) ? new Date().getFullYear() -
            parseInt(dobYear) : ''
          </Typography>
        </Box>
      )}
    </Box>
  );
}
