import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import data_json from "../scripts/params.json";
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { doc, onSnapshot ,updateDoc} from "firebase/firestore";
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase/firebase-config";
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
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
  
export default function ConfigParametroView() {
    let { id } = useParams();
    const [mantenimientos, setMantenimientos] = useState([{}])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalActividad,setModalActividad] = useState(false)
    const [actividad, setActividad] = useState(data_json.actividades[0])
    const [kilometros,setKiloemtros] = useState([])
    const [kmTarget,setKmTarget]= useState("");
    const [tipo,setTipo]= useState("CAMBIO");
    const [currentList,setCurrentList] = useState([]);
    const [modalEditar,setModalEditar] = useState(false);
    const [currentActividad,setCurrentActividad] =useState({}) 
    const [parametro, setParametro] = useState({});
    const readData = () => {
        onSnapshot(doc(db, "parametros", id), (doc) => {
            setMantenimientos(doc.data().mantenimientos)
            setParametro(doc.data())
            setKiloemtros(doc.data().kilometros)
            setKmTarget(doc.data().kilometros[0])
        })
    }



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const agregarActividad=()=>{
        let aux_man = JSON.parse(JSON.stringify(currentList))
        let new_activity = {
            id: uuidv4(),
            codigo:actividad.codigo,
            nombre:actividad.nombre,
            sistema:actividad.sistema,
            tipo:tipo,
            km:kmTarget,
        }
        aux_man.push(new_activity)
        let filter_mans = eliminarDuplicados(aux_man)

       setCurrentList(filter_mans)
        
    }
    const abrirModalActividades = ()=>{
        setCurrentList(mantenimientos)
        setModalActividad(true)
    }
    // metodo para eliminar duplicados
    const eliminarDuplicados =(arreglo)=>{
        var objetosVistos = {};
        var resultado = [];
      
        for (var i = 0; i < arreglo.length; i++) {
          var objeto = arreglo[i];
          var clave = objeto.codigo + '_' + objeto.km;
      
          if (!objetosVistos[clave]) {
            objetosVistos[clave] = true;
            resultado.push(objeto);
          }
        }
      
        return resultado;
    }
    const eliminarActividad=(row)=>{
        let aux_man = JSON.parse(JSON.stringify(currentList))
        let filter_data = aux_man.filter(item=> item.id !== row.id)
        setCurrentList(filter_data)
    }
    const eliminar=async(__data)=>{
        let aux_man = JSON.parse(JSON.stringify(mantenimientos))
        let filter_data = aux_man.filter(item=> item.id !== __data.id)
        setMantenimientos(filter_data)
        const ref = doc(db, "parametros", id);
        await updateDoc(ref, {
            mantenimientos: filter_data
          });
    }
    const aplicarCambios = async()=>{
        const ref = doc(db, "parametros", id);
        await updateDoc(ref, {
            mantenimientos: currentList
          });
          setModalActividad(false)
    }
    const editarActividad=async()=>{
        let aux_man = JSON.parse(JSON.stringify(mantenimientos))
        let aux_act = JSON.parse(JSON.stringify(currentActividad))
        let data_modify  = aux_man.map((item)=>{
            if(item.id === aux_act.id){
                return aux_act
            }else{
                return item
            }
        })
        const ref = doc(db, "parametros", id);
        await updateDoc(ref, {
            mantenimientos: data_modify
          });
          setModalEditar(false)
    }
    const abrirModalEditar=(__data)=>{
        setModalEditar(true)
        setCurrentActividad(__data)
    }
    const handleActividad =(event)=>{
        setCurrentActividad({
            ...currentActividad,
            [event.target.name]: event.target.value,
        });

    }
    useEffect(() => {
        readData();
 // eslint-disable-next-line
    }, [])

    return (
        <>


            <Container maxWidth="lg" style={{ paddingTop: 20 }}>
                <Grid container spacing={2}>
                <Grid item md={12} xs={12} >
                     <Typography variant="h3" gutterBottom>
                       {parametro.nombre}
                    </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={()=>{abrirModalActividades()}} >Agregar MTTO</Button>
                    </Grid>


                    <Grid item xs={12} >
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                     
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Actividad
                                            </TableCell>
                                            <TableCell
                                   
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Sistema
                                            </TableCell>
                                            <TableCell
                                
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Km
                                            </TableCell>
                                            <TableCell
                                        
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Tipo
                                            </TableCell>
                                            <TableCell
                                   
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Configuracion
                                            </TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mantenimientos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell align="left">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.sistema}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.km}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.tipo}
                                                        </TableCell>
                                                        <TableCell align="center">

                                                            <IconButton onClick={()=>{abrirModalEditar(row)}} color="amarillo" aria-label="eliminar">
                                                                <SettingsIcon />
                                                            </IconButton>
                                                            <IconButton color="rojo" aria-label="eliminar" onClick={()=>{eliminar(row)}}>
                                                                <DeleteIcon />
                                                            </IconButton>

                                                        </TableCell>

                                                    </TableRow>);
                                            })}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={mantenimientos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>


            <Modal isOpen={modalActividad} >
                    <ModalHeader>
                        <div>
                            <h6>
                                Creacion de Actividades
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                        <Grid item xs={3}>
                        <Autocomplete
                                 
                                    onChange={(event, newValue) => {
                                        setKmTarget(newValue);
                                    }}
                                    value={kmTarget}
                                    id="controllable-states-demo"
                                    fullWidth
                                    getOptionLabel={(option) => option.toString()}
                                    options={kilometros}
                                    renderInput={(params) => <TextField {...params} label="Kilometro" />}
                                />
                        </Grid>
                        <Grid item xs={9}>
                                <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label"> TIPO</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Tipo"
                                            value={tipo}
                                            onChange={(event)=>{setTipo(event.target.value)}}

                                        >
                                            <MenuItem value={"CAMBIO"}>Cambio</MenuItem>
                                            <MenuItem value={"INSPECCIÓN"}>Inspeccion</MenuItem>
                                            <MenuItem value={"REALIZAR"}>Realizar</MenuItem>
                                            <MenuItem value={"LUBRICAR"}>Lubricar</MenuItem>
                                            <MenuItem value={"INSPECCIÓN Y CAMBIO"}>Inspeccion y Cambio</MenuItem>
                                            <MenuItem value={"INSPECCIÓN Y LUBRICACIÓN"}>Inspeccion y Lubricacion</MenuItem>
                         
                                        </Select>
                                    </FormControl>
                            </Grid>
                           
                        <Grid item xs={12}>
                        <Autocomplete
                                    value={actividad}
                                    onChange={(event, newValue) => {
                                        setActividad(newValue);
                                    }}
                                    getOptionLabel={(option) => option.nombre}
                                    id="controllable-states-demo"
                                    fullWidth
                                    options={data_json.actividades}
                                    renderInput={(params) => <TextField {...params} label="Actividad" />}
                                />
                        </Grid>
              
                     
                        

						<Grid item xs={12} >
							<Button
								variant="contained"
								fullWidth
                                onClick={()=>{agregarActividad()}}

							>
								AGREGAR ACTIVIDAD
							</Button>
						</Grid>
						<Grid item xs={12} >
		

							<TableContainer sx={{overflowY:"scroll",height:300}} component={Paper}>
								<Table  aria-label="customized table">
									<TableHead>
									<TableRow>
						
										<StyledTableCell align="left">#</StyledTableCell>
										<StyledTableCell align="left">Actividades</StyledTableCell>
                                        	<StyledTableCell align="left">Tipo</StyledTableCell>
										<StyledTableCell align="left">Acciones</StyledTableCell>
									</TableRow>
									</TableHead>
									<TableBody>
									{currentList.filter(item=>item.km === kmTarget).map((row,index) => (
										<StyledTableRow key={index}>
			
										<StyledTableCell align="left">{index+1}</StyledTableCell>
										<StyledTableCell align="left">{row.nombre}</StyledTableCell>
                                        <StyledTableCell align="left">{row.tipo}</StyledTableCell>
										<StyledTableCell align="left"
										><Button variant="contained" color='warning' onClick={() => {eliminarActividad(row) }}>
														Quitar
													</Button></StyledTableCell>
										</StyledTableRow>
									))}
									</TableBody>
								</Table>
								</TableContainer>

						</Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' onClick={aplicarCambios} sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalActividad(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={modalEditar} >
                    <ModalHeader>
                        <div>
                            <h6>
                                Editar Actividad - {currentActividad.nombre}
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
            
                        <Grid item xs={12}>
                                <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label"> TIPO</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Tipo"
                                            value={currentActividad.tipo}
                                            onChange={handleActividad}
                                            name="tipo"
                                        >
                                            <MenuItem value={"CAMBIO"}>Cambio</MenuItem>
                                            <MenuItem value={"INSPECCIÓN"}>Inspeccion</MenuItem>
                                            <MenuItem value={"REALIZAR"}>Realizar</MenuItem>
                                            <MenuItem value={"LUBRICAR"}>Lubricar</MenuItem>
                                            <MenuItem value={"INSPECCIÓN Y CAMBIO"}>Inspeccion y Cambio</MenuItem>
                                            <MenuItem value={"INSPECCIÓN Y LUBRICACIÓN"}>Inspeccion y Lubricacion</MenuItem>
                         
                                        </Select>
                                    </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label"> Sistema</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Sistema"
                                            value={currentActividad.sistema}
                                            name="sistema"
                                            onChange={handleActividad}
                                        >
                                            <MenuItem value={"MOTOR"}>Motor</MenuItem>
                                            <MenuItem value={"SISTEMA DE DIRECCIÓN"}>Direccion</MenuItem>
                                            <MenuItem value={"SISTEMA DE TRANSMISIÓN"}>Transmision</MenuItem>
                                            <MenuItem value={"SISTEMA DE FRENOS - SUSPENSIÓN"}>Frenos y Suspension</MenuItem>
                                            <MenuItem value={"SISTEMA ELÉCTRICO"}>Electrico</MenuItem>
                                            <MenuItem value={"CARROCERÍA"}>Carroceria</MenuItem>
                         
                                        </Select>
                                    </FormControl>
                            </Grid>
		
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' onClick={editarActividad} sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalEditar(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
        </>




    )




}