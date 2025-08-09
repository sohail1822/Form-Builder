import { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, IconButton, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { loadForms, deleteForm } from "../../../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { loadForm } from "../formBuilderSlice";

export default function MyFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setForms(loadForms());
  }, []);

  function openForm(f: any) {
    dispatch(loadForm(f));
    navigate("/preview");
  }

  function handleDelete(e: React.MouseEvent, formId: string) {
    e.stopPropagation();
    deleteForm(formId);
    setForms(loadForms());
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            color: '#1976d2',
            fontWeight: 600,
          }}
        >
          My Forms
        </Typography>
        <List sx={{ width: '100%' }}>
          {forms.map((f) => (
            <ListItem
              key={f.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 500, color: '#2c3e50' }}>
                    {f.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {new Date(f.createdAt).toLocaleString()}
                  </Typography>
                }
                sx={{ cursor: 'pointer' }}
                onClick={() => openForm(f)}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => handleDelete(e, f.id)}
                sx={{
                  color: '#e74c3c',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#c0392b',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        {forms.length === 0 && (
          <Typography 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center',
              padding: 3,
              backgroundColor: '#fafafa',
              borderRadius: 1,
              border: '1px dashed #ccc'
            }}
          >
            No saved forms
          </Typography>
        )}
      </Paper>
    </Box>
  );
}