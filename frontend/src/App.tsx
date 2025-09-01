import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotesEditor from "./pages/notesEditor";
import ProtectedRoute from "./pages/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notesEditor" element={<NotesEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
