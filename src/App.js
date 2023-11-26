import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Profile from "./pages/Profile";
import CourseDetails from "./pages/CourseDetails";
import Quiz from "./pages/Quiz";
import CategoryPage from "./pages/CategoryPage";
import CertificateGenerator from "./components/sections/CertificateGenerator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/certificate/:id" element={<CertificateGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;