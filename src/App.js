import { Routes, Route } from "react-router-dom";
import AppBarCarros from "./components/AppBarCarros";
import AnalisisView from "./views/AnalisisView";
import ParametrosView from "./views/ParametrosView";
import VehiculosView from "./views/VehiculosView";
function App() {
  return (
    <div className="App">
      <AppBarCarros/>
      <Routes>
          <Route path="/" element={<ParametrosView/>} />
          <Route path="/vehiculos" element={<VehiculosView/>} />
          <Route path="/calculadora" element={<AnalisisView/>} />
        </Routes>
    </div>
  );
}

export default App;
