import React, { useState,useEffect } from "react";
import { Grid } from "@mui/material";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses}  from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
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
import { doc, setDoc ,collection, query, onSnapshot } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase/firebase-config";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
export default function ParametrosView() {
    const navigate = useNavigate();
    const [marca, setMarca] = useState("CHEVROLET");
    const [parametros,setParametros]  = useState([]);
    const [actividad, setActividad] = useState(data_json.actividades[0])
    const [yearStart,setYearStart]= useState('');
    const [yearEnd,setYearEnd]= useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalParametro, setModalParametro] = useState(false);
    const [kilometros,setKiloemtros] = useState([]);
    const [km,setKm] = useState([]);
    const [modalConfiguracion,setModalConfiguracion] = useState(false);

    

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
      

    const readData=()=>{
        const q = query(collection(db, "parametros"));
        onSnapshot(q, (querySnapshot) => {
        const params = [];
        querySnapshot.forEach((doc) => {
            params.push(doc.data());
        });
        setParametros(params);
        });
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const agregarKm =()=>{
        let kms = JSON.parse(JSON.stringify(kilometros))
        let aux_km = parseFloat(km)
        kms.push(aux_km)
        kms.sort(function(a, b){return a - b})
        let datos_filtrados = eliminarDuplicados(kms)
        setKiloemtros(datos_filtrados)
    }
    // metodo para eliminar duplicados
    const eliminarDuplicados =(numeros)=>{
        let unicos = numeros.filter((valor, indice) => {
            return numeros.indexOf(valor) === indice;
          }
        );
        return unicos
    }
   
    
    const abrirModalCrearParametro = ()=>{
        setKiloemtros([])
        setYearStart("")
        setYearEnd("")
        setKm(0)
        setModalParametro(true)
    }
    const quitarKm =(index)=>{
        let kms = JSON.parse(JSON.stringify(kilometros))
        kms.splice(index,1)
        setKiloemtros(kms)
    }

    // creamos el parametro
    const crearParametro = async()=>{
        
        let new_param = {
            id: uuidv4(),
            kilometros:kilometros,
            marca:marca,
            start:yearStart,
            end:yearEnd,
            nombre: `${marca} ${yearStart}-${yearEnd}`,
            mantenimientos:[]
        }
        console.log(new_param)
        await setDoc(doc(db, "parametros", new_param.id),new_param);
        setModalParametro(false)
    }
    
    useEffect(() => {
        readData();
        // eslint-disable-next-line
    }, [])
    return (

        <>
            <Container maxWidth="lg" style={{ paddingTop: 20 }}>
                <Grid container spacing={2}>
                    <Grid item md={4} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={abrirModalCrearParametro}>Crear Parametro</Button>
                    </Grid>
         
                
                    <Grid item xs={12} >
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 610 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell
                                         
                                         align={"left"}
                                         style={{ minWidth: 200 }}
                                     >
                                         Nro
                                     </TableCell>
                                            <TableCell
                                         
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Nombre
                                            </TableCell>
                                            <TableCell
                               
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Marca
                                            </TableCell>
                                            <TableCell
                                
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Rango
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
                                        {parametros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                          <TableCell align="left">
                                                            {index+1}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.marca}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.start} - {row.end}
                                                        </TableCell>
                                                        <TableCell align="center">

                                                            <IconButton onClick={()=>{navigate(`parametros/${row.id}`)}} color="amarillo" aria-label="eliminar">
                                                                <AssignmentIcon />
                                                            </IconButton>
                                                            <IconButton color="rojo" aria-label="eliminar">
                                                                <EditIcon />
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
                                count={parametros.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <Modal isOpen={modalParametro} >
                    <ModalHeader>
                        <div>
                            <h6>
                                Creacion de Parametros
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label"> Marca</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={marca}
                                            label="Marca"
                                            onChange={(event)=>{setMarca(event.target.value)}}
                                        >
                                            <MenuItem value={"CHEVROLET"}>Chevrolet</MenuItem>
                                            <MenuItem value={"HYUNDAY"}>Hyunday</MenuItem>
                                            <MenuItem value={"KIA"}>Kia</MenuItem>
                                            <MenuItem value={"NISSAN"}>Nissan</MenuItem>
                                            <MenuItem value={"TOYOTA"}>Toyota</MenuItem>
                                        </Select>
                                    </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" fullWidth label="Año Inicio" value={yearStart} type="number" variant="outlined" onChange={(event,newValue)=>{setYearStart(event.target.value)}} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" fullWidth label="Año Final" value={yearEnd} type="number" variant="outlined" onChange={(event,newValue)=>{setYearEnd(event.target.value)}} />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField id="outlined-basic" fullWidth label="Kilometro" value={km} type="number" variant="outlined" onChange={(event,newValue)=>{setKm(event.target.value)}} />
						</Grid>

						<Grid item xs={12} >
							<Button
								variant="contained"
								fullWidth
								onClick={() => agregarKm()}

							>
								AGREGAR KILOMETRO
							</Button>
						</Grid>
						<Grid item xs={12} >
		

							<TableContainer sx={{overflowY:"scroll",height:300}} component={Paper}>
								<Table  aria-label="customized table">
									<TableHead>
									<TableRow>
						
										<StyledTableCell align="left">#</StyledTableCell>
										<StyledTableCell align="left">Kilometro</StyledTableCell>
										<StyledTableCell align="left">Acciones</StyledTableCell>
									</TableRow>
									</TableHead>
									<TableBody>
									{kilometros.map((row,index) => (
										<StyledTableRow key={index}>
			
										<StyledTableCell align="left">{index+1}</StyledTableCell>
										<StyledTableCell align="left">{row}</StyledTableCell>
										<StyledTableCell align="left"
										><Button variant="contained" color='warning' onClick={() => { quitarKm(index) }}>
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
                        <Button variant="contained" color='anaranjado1' onClick={crearParametro} sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalParametro(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalConfiguracion} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Creacion de Parametros
                            </h1>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={2}>
                        <Grid item xs={12} >
                                <h6>Actividad</h6>
                        </Grid>
                            <Grid item xs={12} >
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
                                <h6>Tipo de Mantenimientos</h6>
                             </Grid>
                        </Grid>
                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalConfiguracion(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </>
    )



}

