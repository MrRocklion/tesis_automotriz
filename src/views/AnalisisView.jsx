import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../css/Analisis.css';
import Container from '@mui/material/Container';
import logo from '../components/imagenes/carros.PNG';
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import { collection, setDoc, query, doc, deleteDoc, updateDoc, getDocs, getDoc, where } from "firebase/firestore";
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { generarPdf } from "../scripts/pdfReporte";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function AnalisisView() {
  const [tipoAuto, setTipoAuto] = useState([]);
  const [tipoAños, setTipoAños] = useState([]);
  const [años, setAños] = useState([]);
  const [tipo, setTipo] = useState();
  const [descripcion, setDescripcion] = useState('');
  const [planificacion,setPlanificacion]  = useState([{}]);
  const [kilometros,setKilometros] = useState([]);
  const [kmTarget,setKmTarget]= useState(0);

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
  const encontrarIndiceUltimoMenor =(arr, numero) =>{
    let valor = null; // Valor inicial del último número menor

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < numero) {
      valor = arr[i]; // Actualizar el valor cuando se encuentra un número menor
    }
  }

  return valor;
  }
  const Calcular = async () => {
  
    let name_target = `${tipo} ${años}`
    console.log(name_target)
    const q = query(collection(db, "parametros"), where("nombre", "==", name_target));
    let data = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = doc.data()
    });
    console.log(data)
    try {
      let aux_km = data.kilometros.map(item =>(item * 1000))
   
      let valor = encontrarIndiceUltimoMenor(aux_km,parseInt(kilometros))/1000
      let datos_man = data.mantenimientos.filter(item=> item.km === valor)
      setPlanificacion(datos_man)
      console.log(datos_man);
      setKmTarget(valor)

    } catch (error) {
      
    }
  }

  const crearPdf =()=>{

      let parametros = {
        data: planificacion,
        fecha: "19-07-1999"
      }
      //generarPdf(parametros)
    
  }

  useEffect(() => {
    getData();
  }, [])


  return (<>
    <Container maxWidth="lg">
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
            <Grid container  spacing={4}>

              <Grid item md={4} xs={12} >
                <div className="panelp2">
                <Grid container spacing={1}  >
                  
                <Grid item xs={12} >
                    <Typography component="div" variant="h8" className="titulou" >
                      <b>Datos Vehículo</b>
                    </Typography>

                </Grid>
                <Grid item xs={12}  >
                <Autocomplete
                    disableClearable
                    id="combo-box-demo"
                    options={tipoAuto}
                    onChange={(event, newvalue) => setTipo(newvalue)}
                    renderInput={(params) => <TextField {...params} fullWidth label="MARCA" type="text" />}
                  />
                </Grid>
                <Grid item xs={12} >
                <Autocomplete
                    disableClearable
                    id="combo-box-demo"
                    options={tipoAños}
                    onChange={(event, newvalue) => setAños(newvalue)}
                    renderInput={(params) => <TextField {...params} fullWidth label="RANGO" type="text" />}
                  />
                </Grid>
                <Grid item xs={12} >
                <TextField id="outlined-basic" fullWidth label="kilometros" value={kilometros} type="number" variant="outlined" onChange={(event,newValue)=>{setKilometros(event.target.value)}} />
                          </Grid>
                <Grid item xs={12} >
                <Button
                    variant="outlined"
                    className="boton-modal2"
                    onClick={() => Calcular()}
                  >
                    PROGRAMAR MANTENIMIENTO
                  </Button>
                </Grid>
              </Grid>
                </div>
                <div className="panelp2">
                <Grid container spacing={1} > 
                    <Grid item xs={12} >
                         <Typography component="div" variant="h8" className="titulou" >
                           <b>Generar Reporte</b>
                         </Typography>
                     </Grid>
                  <Grid item xs={12} >
                  <Button
                    variant="outlined"
                    className="boton-modal2"
                    onClick={crearPdf}
                  >
                    GENERAR PDF
                  </Button>
                  </Grid>
                  </Grid>
                </div>

              </Grid>

              <Grid item xs={12} md={8} >
                <div className="panelp2" style={{ backgroundImage: `url(${logo})` }}>

                  <Grid container spacing={3}>
                    <Grid item xs={12} >
                      <Typography component="div" variant="h8" className="titulou" >
                        <b>Mantenimiento Programado</b>
                      </Typography>
                      <Typography component="div" variant="h8" className="titulou" >
                        <b>Kilometraje:</b> {kmTarget*1000}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} >

                      
							<TableContainer sx={{overflowY:"scroll",height:450}} component={Paper}>
								<Table  aria-label="customized table">
            
									<TableHead>

									<TableRow>
						
										<StyledTableCell align="left">#</StyledTableCell>
										<StyledTableCell align="left">Actividades</StyledTableCell>
                    <StyledTableCell align="left">Sistema</StyledTableCell>
                    <StyledTableCell align="left">Tipo</StyledTableCell>
										
									</TableRow>
									</TableHead>
									<TableBody>
									{planificacion.map((row,index) => (
										<StyledTableRow key={index}>
										<StyledTableCell align="left">{index+1}</StyledTableCell>
										<StyledTableCell align="left">{row.nombre}</StyledTableCell>
                    <StyledTableCell align="left">{row.sistema}</StyledTableCell>
                    <StyledTableCell align="left">{row.tipo}</StyledTableCell>
										</StyledTableRow>
									))}
									</TableBody>
								</Table>
								</TableContainer>
                    </Grid>
                  </Grid>
                </div>
              </Grid>

          
            </Grid>
          </div>

        </div>



      </div>
    </Container>
  </>
  )
}