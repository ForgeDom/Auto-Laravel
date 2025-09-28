import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CarsList from "./pages/CarList.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import AdminCarsList from "./pages/admin/AdminCarsList.jsx";
import AdminCarForm from "./pages/admin/AdminCarForm.jsx";

function App() {
  return (    
    <Router>
      <Routes>
        <Route path="/" element={<CarsList />} />
        <Route path="/cars/:id" element={<CarDetail />} />

        <Route path="/admin/cars" element={<AdminCarsList />} />
        <Route path="/admin/cars/new" element={<AdminCarForm />} />
        <Route path="/admin/cars/:id" element={<AdminCarForm />} />
      </Routes>
    </Router>
  );
}

export default App;
