import React, { useState,useEffect } from "react";
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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SettingsIcon from '@mui/icons-material/Settings';

import Autocomplete from '@mui/material/Autocomplete';

import { doc, setDoc ,collection, query, onSnapshot,deleteDoc,updateDoc} from "firebase/firestore"; 
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase/firebase-config";

import DeleteIcon from '@mui/icons-material/Delete';

export default function ActividadesView(){
    const [modalCrear,setModalCrear] = useState(false);
    const [modalEditar,setModalEditar]  = useState(false);
    const [actividadesFirebase,setActividadesFirebase] = useState([{}])
    const [currentData,setCurrenData] = useState({nombre:"",codigo:"",id:"",sistema:""})
    const [newData,setNewData] = useState({nombre:"",codigo:"",id:"",sistema:"MOTOR"})
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const readData=()=>{
        const q = query(collection(db, "actividades"));
        onSnapshot(q, (querySnapshot) => {
        const params = [];
        querySnapshot.forEach((doc) => {
            params.push(doc.data());
        });
        let data_ordenados = params.sort(function(a, b){return  a.codigo - b.codigo});
        setActividadesFirebase(data_ordenados);
        });
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChange = (event) => {
        setCurrenData({
            ...currentData,
            [event.target.name]: event.target.value,
        });

    };
    const handleChange2 = (event) => {
        setNewData({
            ...newData,
            [event.target.name]: event.target.value,
        });

    };
    const abrirModalEditar =(__data)=>{
        setModalEditar(true)
        setCurrenData(__data)
    }

    const createData = async()=>{
        let aux_data = JSON.parse(JSON.stringify(newData))
        aux_data.codigo = parseInt(aux_data.codigo)
        aux_data['id'] = uuidv4();
        let flag = actividadesFirebase.find(item=> item.codigo === parseInt(aux_data.codigo))
        console.log(flag)
        if(flag === undefined){
            if(newData.nombre !== "" && parseInt(newData.codigo)>0){
                await setDoc(doc(db, "actividades", aux_data.id),aux_data);
                Swal.fire(
                    'Exito!',
                    'Actividad Agregada',
                    'success'
                  )
                  setModalCrear(false)
                  setNewData({nombre:"",codigo:"",id:"",sistema:"MOTOR"})
            }else{
                Swal.fire(
                    'Faltan Campos!',
                    'Agregue mas Campos',
                    'warning'
                  )
            }
        }else{
            Swal.fire(
                'Ya Existe ese Codigo!',
                'Pruebe Otro Codigo',
                'warning'
              )
        }
      
        
    }
    const updateData =async()=>{

        const ref = doc(db, "actividades", currentData.id);
        await updateDoc(ref, currentData);
        setModalEditar(false)
    }
    const eliminarParametro =(__data)=>{
        
        Swal.fire({
            title: 'Estas Seguro?',
            text: "Este parametro se eliminara de la base de datos!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
           
                    await deleteDoc(doc(db, "actividades", __data.id));
                } catch (error) {
   
                    Swal.fire(
                        'no se Elimino!',
                        'Comprueba la conexion',
                        'error'
                      )
                }   
    
              Swal.fire(
                'Parametro Eliminado!',
                'Your file has been deleted.',
                'success'
              )
            }
          })
      
        }
    
    useEffect(() => {
        readData();
        // eslint-disable-next-line
    }, [])
    return(
        <>
         <Container maxWidth="lg" style={{ paddingTop: 20 }}>
                <Grid container spacing={2}>
                <Grid item  xs={12} >
                    <h3>
                        Tabla de Administracion de Actividades
                    </h3>
                </Grid>
                <Grid item  xs={12} >
                 
                    <Grid item md={4} xs={12} >
                        <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={()=>{setModalCrear(true)}} >crear actividad</Button>
                    </Grid>
    
                </Grid>
                
                    <Grid item xs={12} >
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 500 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell
                                         
                                         align={"left"}
                                         style={{ minWidth: 200 }}
                                     >
                                         codigo
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
                                                Sistema
                                            </TableCell>
                                           
                                            <TableCell
                                  
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Configuracion
                                            </TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {actividadesFirebase.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                          <TableCell align="left">
                                                          {row.codigo}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.sistema}
                                                        </TableCell>
                                         
                                                        <TableCell align="center">

      
                                                         
                                                        <IconButton color="gris" aria-label="eliminar" onClick={()=>{abrirModalEditar(row)}} >
                                                                <SettingsIcon />
                                                            </IconButton>
                                                            <IconButton color="rojo" aria-label="eliminar"  onClick={()=>{eliminarParametro(row)}}>
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
                                count={actividadesFirebase.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <Modal isOpen={modalEditar} >
                    <ModalHeader>
                        <div>
                            <h6>
                                Editar Actividad
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Nombre" value={currentData.nombre} onChange={handleChange} name="nombre" type="text" variant="outlined"  />
                            </Grid>
                            <Grid item xs={12}>
                            <Autocomplete
                                    onChange={handleChange}
                                    name="sistema"
                                    defaultValue={currentData.sistema}
                                    fullWidth
                                    id="controllable-states-demo"
                                    options={["MOTOR","SISTEMA DE DIRECCIÓN","SISTEMA DE TRANSMISIÓN","SISTEMA DE FRENOS - SUSPENSIÓN","SISTEMA ELÉCTRICO","CARROCERÍA"]}
                      
                                    renderInput={(params) => <TextField {...params} label="Sistema"  />}
                                />
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' onClick={updateData} sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalEditar(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalCrear} >
                    <ModalHeader>
                        <div>
                            <h6>
                                Crear Actividad
                            </h6>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Nombre" value={newData.nombre} onChange={handleChange2} name="nombre" type="text" variant="outlined"  />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Codigo" value={newData.codigo} onChange={handleChange2} name="codigo" type="number" variant="outlined"  />
                            </Grid>
                            <Grid item xs={12}>
                            <Autocomplete
                                    onChange={handleChange2}
                                    name="sistema"
                                    fullWidth
                                    id="controllable-states-demo"
                                    options={["MOTOR","SISTEMA DE DIRECCIÓN","SISTEMA DE TRANSMISIÓN","SISTEMA DE FRENOS - SUSPENSIÓN","SISTEMA ELÉCTRICO","CARROCERÍA"]}
                      
                                    renderInput={(params) => <TextField {...params} label="Sistema"  />}
                                />
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' onClick={createData} sx={{ marginLeft: 1 }}>
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