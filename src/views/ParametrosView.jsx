import React, { useState } from "react";
import { Grid } from "@mui/material";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
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
export default function ParametrosView() {

    const [marca, setMarca] = useState(data_json.marca[0]);
    const [marcas, setMarcas] = useState([data_json.marca]);
    const [planes, setPlanes] = useState([]);
    const [actividad, setActividad] = useState(data_json.actividades[0])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalCrear, setModalCrear] = useState(false);
    const [modalParametro, setModalParametro] = useState(false);
    const [tipo, setTipo] = useState("NINGUNO");

    const handleChange = (event) => {
        setTipo(event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (

        <>
            <Container maxWidth="lg" style={{ paddingTop: 20 }}>
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={() => { setModalParametro(true) }}>Crear Parametro</Button>
                    </Grid>
                    <Grid item md={3} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={() => { setModalParametro(true) }}>Crear Actividad</Button>
                    </Grid>
                    <Grid item md={3} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={() => { setModalCrear(true) }}>Agregar Mantenimiento</Button>
                    </Grid>
                    <Grid item md={3} xs={12} >
                        <Autocomplete
                            value={marca}
                            onChange={(event, newValue) => {
                                setMarca(newValue);
                            }}
                            getOptionLabel={(option) => option.nombre}
                            id="controllable-states-demo"
                            options={data_json.marca}
                            fullWidth
                            size="small"
                            renderInput={(params) => <TextField {...params} label="Controllable" />}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                key={"last"}
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Nombre
                                            </TableCell>
                                            <TableCell
                                                key={"Name"}
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Marca
                                            </TableCell>
                                            <TableCell
                                                key={"ip"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Rango
                                            </TableCell>
                                            <TableCell
                                                key={"modelo"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Configuracion
                                            </TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {planes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell align="left">
                                                            {row.ultima_conexion}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.ip}
                                                        </TableCell>
                                                        <TableCell align="center">

                                                            <IconButton color="rojo" aria-label="eliminar">
                                                                <SettingsIcon />
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
                                count={planes.length}
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
                                Crear Parametro de Vehiculo
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Marca Del Vehiculo" variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" label="Año Inicio" type="number" variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" label="Año Final" type="number" variant="outlined" />
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalParametro(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalCrear} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Crear Plan
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
                                {
                                    marca.kilometros.map((item)=>{
                                    
                                    return(
                                            <Grid item xs={4} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{item} KM</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tipo}
                                        label="Tipo"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"NINGUNO"}>N</MenuItem>
                                        <MenuItem value={"CAMBIO"}>C</MenuItem>
                                        <MenuItem value={"INSPECCION"}>I</MenuItem>
                                        <MenuItem value={"REALIZAR"}>R</MenuItem>
                                        <MenuItem value={"LUBRICAR"}>L</MenuItem>
                                        <MenuItem value={"INSPECCIÓN Y CAMBIO"}>I/C</MenuItem>
                                        <MenuItem value={"INSPECCIÓN Y LUBRICACIÓN"}>I/L</MenuItem> 
                                    </Select>
                                </FormControl>
                            </Grid>
                                    );
                                     })
                                }
                        
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalCrear(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </>
    )



}