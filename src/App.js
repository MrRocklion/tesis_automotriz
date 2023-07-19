import { Routes, Route } from "react-router-dom";
import AppBarCarros from "./components/AppBarCarros";
import AnalisisView from "./views/AnalisisView";
import ParametrosView from "./views/ParametrosView";
import VehiculosView from "./views/VehiculosView";
import ConfigParametroView from "./views/configParametroView";
import ManipulacionView from "./views/manipulacionView";
function App() {
  return (
    <div className="App">
      <AppBarCarros/>
      <Routes>
          <Route path="/" element={<ParametrosView/>} />
          <Route path="/parametros/:id" element={<ConfigParametroView/>} />
          <Route path="/vehiculos" element={<VehiculosView/>} />
          <Route path="/calculadora/:id" element={<AnalisisView/>} />
          <Route path="/manipulacion" element={<ManipulacionView/>} />
        </Routes>
    </div>
  );
}

export default App;
