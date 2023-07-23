
import React,{useState,useEffect} from 'react';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
export default function AdminAccounts(){


    return(

        <>
              <Container style={{ paddingTop: 10 }}>


              <Grid container spacing={{ xs: 2 }} >
              <Grid item xs={12} md={12}>
                <h3>Tabla de Administracion de Usuarios</h3>
              </Grid>
              </Grid>
              </Container>
        
        </>
    )




}