import { Routes, Route } from "react-router-dom";
import AppBarCarros from "./components/AppBarCarros";
import ParametrosView from "./views/ParametrosView";
import VehiculosView from "./views/VehiculosView";
function App() {
  return (
    <div className="App">
      <AppBarCarros/>
      <Routes>
          <Route path="/" element={<ParametrosView/>} />
          <Route path="/vehiculos" element={<VehiculosView/>} />
        </Routes>
    </div>
  );
}

export default App;
