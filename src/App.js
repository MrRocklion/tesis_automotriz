import { Routes, Route } from "react-router-dom";

import LoginView from "./views/LoginView";
import DashboardUsuario from "./views/DashboardUsuario";
function App() {
  return (
    <div className="App">

      <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/:uid/*" element={<DashboardUsuario/>} />
        </Routes>
    </div>
  );
}

export default App;
