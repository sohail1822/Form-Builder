import { Routes, Route, Navigate } from "react-router-dom";
import CreateFormPage from "../features/formBuilder/pages/CreateFormPage";
import PreviewFormPage from "../features/formBuilder/pages/PreviewFormPage";
import MyFormsPage from "../features/formBuilder/pages/MyFormsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create" replace />} />
      <Route path="/create" element={<CreateFormPage />} />
      <Route path="/preview" element={<PreviewFormPage />} />
      <Route path="/myforms" element={<MyFormsPage />} />
    </Routes>
  );
}
