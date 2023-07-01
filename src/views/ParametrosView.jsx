import React,{useState} from "react";
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
export default function ParametrosView(){

    const [parametros,setParametros] = useState([{}]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalCrear,setModalCrear]  = useState(false);
    const [modalParametro,setModalParametro] = useState(false);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    return(

        <>
            <Container maxWidth="md" style={{paddingTop:20}}>
                <Grid container spacing={2}>
                <Grid item xs={3} >
                <Button variant="contained" onClick={()=>{setModalParametro(true)}}>Agregar Parametro</Button>
                </Grid>
                <Grid item xs={3} >
                <Button variant="contained" onClick={()=>{setModalCrear(true)}}>Agregar Plan Mtto</Button>
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
                                    {parametros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row,index) => {
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
                            <TextField id="outlined-basic" label="Año Inicio"  type="number" variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                            <TextField id="outlined-basic" label="Año Final" type="number" variant="outlined" />
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1'  sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={()=>{setModalParametro(false)}} sx={{ marginLeft: 1 }}>
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
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>Nombre</h5></strong>
                                   
                                </div>
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1'  sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={()=>{setModalCrear(false)}} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </>
    )



}