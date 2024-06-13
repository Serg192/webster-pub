import {
  Login,
  Editor,
  Signup,
  VerifyEmail,
  ForgotPassword,
  VerifyPasswordReset,
  Canvases,
} from "./pages";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import useHotkeySetup from './hooks/useHotkeysSetup';

const App = () => {
  useHotkeySetup();

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/edit" />} />
          <Route path="/edit" element={<Editor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/canvases" element={<Canvases />} />
          <Route path="/verify-password-reset" element={<VerifyPasswordReset />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
