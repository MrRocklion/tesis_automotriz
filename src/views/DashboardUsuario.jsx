import React from "react";
import { Routes, Route } from "react-router-dom";
import AppBarCarros from "../components/AppBarCarros";
import AnalisisView from "./AnalisisView";
import ParametrosView from "./ParametrosView";
import VehiculosView from "./VehiculosView";
import ConfigParametroView from "./configParametroView";
import ManipulacionView from "./manipulacionView";
import ParametrosAdmin from "./ParametrosAdmin";
import VehiclesAdmin from "./VehiclesAdmin";
import AdminAccounts from "./AdminAccounts";
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
          <Route path="/parametros_admin" element={<ParametrosAdmin/>} /> 
          <Route path="/parametros_admin/:id" element={<ConfigParametroView/>} />
          <Route path="/vehicles_admin" element={<VehiclesAdmin/>} /> 
          <Route path="/vehicles_admin/:id" element={<AnalisisView/>} />
          <Route path="/user_admin" element={<AdminAccounts/>} /> 
        </Routes>  
           
        </>
      );
}