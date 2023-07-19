import React from "react";
import { Routes, Route } from "react-router-dom";
import AppBarCarros from "../components/AppBarCarros";
import AnalisisView from "./AnalisisView";
import ParametrosView from "./ParametrosView";
import VehiculosView from "./VehiculosView";
import ConfigParametroView from "./configParametroView";
import ManipulacionView from "./manipulacionView";

export default function DashboardUsuario(){
    return (
        <>
 

        <AppBarCarros/>
        <Routes>
        <Route path="/parametros" element={<ParametrosView/>} />
          <Route path="/parametros/:id" element={<ConfigParametroView/>} />
          <Route path="/vehiculos" element={<VehiculosView/>} />
          <Route path="/vehiculos/:id" element={<AnalisisView/>} />
          <Route path="/manipulacion" element={<ManipulacionView/>} /> 
        </Routes>  
           
        </>
      );
}