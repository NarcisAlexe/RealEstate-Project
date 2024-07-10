import { Routes, Route, Router } from "react-router-dom";
import Home from "./Pages/Home.js";
import Contact from "./Pages/Contact.js";
import Login from './Pages/Login.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import Register from "./Pages/Register.js";
import Properties from "./Pages/Properties.js";
import AddProperties from "./Pages/AddProperties.js";
import Tranzactions from "./Pages/Tranzactions.js";
import Profile from "./Pages/Profile.js";
import MyProperties from "./Pages/MyProperties.js";
import Detailed from "./Pages/Detailed.js";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/add_properties" element={<AddProperties />} />
      <Route path="/tranzactions" element={<Tranzactions />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-properties" element={<MyProperties />} />
      <Route path="/detailed" element={<Detailed />} />
    </Routes>
  );
}

export default App;
