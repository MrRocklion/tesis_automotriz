import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import '../css/Analisis.css';
import logo from '../components/imagenes/carros.PNG';
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import { collection, setDoc, query, doc, deleteDoc, updateDoc,getDocs,getDoc } from "firebase/firestore";
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export default function AnalisisView(){
    const [tipoAuto, setTipoAuto] = useState([]);
    const [tipoAños, setTipoAños] = useState([]);
    const [años, setAños] = useState([]);
    const [tipo, setTipo] = useState();
    const [descripcion,setDescripcion] = useState('');

    const getData = async () => {
		const reference = doc(db, "informacion", "documentacion");
		const docSnap = await getDoc(reference);
		let parametros = {}
		if (docSnap.exists()) {
			parametros = docSnap.data();
			setTipoAuto(parametros.marca)
            setTipoAños(parametros.año)
		} else {
			console.log("No such document!");
		}
	}

    const Calcular = async () => {
		var valorNuevo = {
			auto: tipo,
			año: años,
            kilometraje:descripcion,
			id: uuidv4(),
		}
		console.log(valorNuevo)

        let timerInterval
Swal.fire({
  title: 'Calculando Mantenimiento!',
  html: 'Esperar <b></b> milliseconds.',
  timer: 700,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    Swal.fire(
        'MANTENIMIENTO PROGRAMADO',
        '',
        'success'
    )
  }
})

		console.log(valorNuevo)
	}

    useEffect(() => {
        getData();
      }, [])


    return(<>
       <Grid container spacing={4} >
        <Grid item xs={12}>
          <Typography component="div" variant="h4" className="princi3" >
            INGRESO VEHICULOS
          </Typography>
        </Grid>
      </Grid>

      <div className="container">
                <div className="column">

                    <div className="col-sm-12" >
                        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 12, sm: 8, md: 12 }}>

                            <Grid item xs={4} >
                                <div className="panelp2" spacing={4}>
                                    <Typography component="div" variant="h8" className="titulou" >
                                        <b>Datos Vehículo</b>
                                    </Typography>
                                  
                <Autocomplete
								disableClearable
								id="combo-box-demo"
								options={tipoAuto}
								onChange={(event, newvalue) => setTipo(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="MARCA" type="text" />}
							/>
                
                    
                <Autocomplete
								disableClearable
								id="combo-box-demo"
								options={tipoAños}
								onChange={(event, newvalue) => setAños(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="AÑOS" type="text" />}
							/>
                
                      
                        <TextareaAutosize
                          style={{textTransform:"uppercase"}} 
                          aria-label="minimum height"
                          value={descripcion}
                          minRows={1}
                          placeholder="Kilometraje"
                          className="text-area-encargado"
                          onChange={(e) => setDescripcion(e.target.value)} 
                        />
                
                    
                      <Button
						variant="outlined"
						className="boton-modal2"
						onClick={() => Calcular()}
					>
						PROGRAMAR MANTENIMIENTO
					</Button>

                    {/* <img src={logo}/> */}
                    
                                </div>
                              
                            </Grid>

                            <Grid item xs={8}>
                                <div className="panelp2" style={{ backgroundImage: `url(${logo})` }}>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} >
                                            <Typography component="div" variant="h8" className="titulou" >
                                                <b>Mantenimiento Programado</b>
                                            </Typography>

                                            {/* <img
                                                className="imagen-usuarios w-40"
                                                src={urlObject}
                                                defaultValue={imagen1}
                                                alt="user profile"
                                            />
                                            <input className="form-control " onChange={buscarImagen} type="file" id="formFile" /> */}

                                        </Grid>
                                       
                                      
                                      
                                      
                                        <Grid item xs={12}>
                   
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                </div>



            </div>
    </>)
}