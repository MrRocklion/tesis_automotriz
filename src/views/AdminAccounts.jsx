
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { collection, setDoc, doc, query, onSnapshot, deleteDoc, where, getDocs,updateDoc } from "firebase/firestore";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import { db } from '../firebase/firebase-config';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CircularProgress from '@mui/material/CircularProgress';
export default function AdminAccounts() {
  const [usuarios, setUsuarios] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState(true);
  const [modalSettings, setModalSettings] = useState(false);
  const [currentUser,setCurrentUser] = useState({})
  const [flag,setFlag] = useState(false)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChange = (event) => {
    setCurrentUser({
      ...currentUser,
      [event.target.name]: event.target.value,
  });

  };
  const updateData = async()=>{
    setFlag(true)
    const ref = doc(db, "usuarios", currentUser.id);
    try {
      await updateDoc(ref, currentUser);
      setFlag(false)
      setModalSettings(false)
    } catch (error) {
      setFlag(false)
    }
   
  
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const readData = () => {
    const q = query(collection(db, "usuarios"));
    onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      setUsuarios(users);
    });


  }
  const abrirModalAjustes = (__data) => {
    setModalSettings(true)
    setCurrentUser(__data)
  }
  useEffect(() => {
    readData();
  }, [])
  return (

    <>
      <Container style={{ paddingTop: 10 }}>


        <Grid container spacing={{ xs: 2 }} >
          <Grid item xs={12} md={12}>
            <h3>Tabla de Administracion de Usuarios</h3>
          </Grid>
          <Grid item xs={12} >

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
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
                      Apellido
                    </TableCell>
                    <TableCell
                      align={"left"}
                      style={{ minWidth: 100 }}
                    >
                      Email
                    </TableCell>
                    <TableCell

                      align={"left"}
                      style={{ minWidth: 100 }}
                    >
                      Contraseña
                    </TableCell>
                    <TableCell
                  align={"center"}
                  style={{ minWidth: 100 }}
                  >
                  Tipo de Usuario
                  </TableCell>
                    <TableCell

                      align={"center"}
                      style={{ minWidth: 100 }}
                    >
                      Acciones
                    </TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {row.nombre}
                          </TableCell>
                          <TableCell align="left">
                            {row.apellido}
                          </TableCell>
                          <TableCell align="left">
                            {row.email}
                          </TableCell>
                          <TableCell align="left">
                            {row.password}
                          </TableCell>
                          <TableCell align="left">
                            {row.admin ? 'Administrador':'Usuario'}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton aria-label="delete" size="small" onClick={() => { abrirModalAjustes(row) }} >
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
              count={usuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>

        </Grid>
      </Container>
      <Modal isOpen={modalSettings} >
        <ModalHeader>
          <div>
            <h6>
              Editar  Usuario
            </h6>
          </div>
        </ModalHeader>
        <ModalBody>
        <Grid container spacing={4}>
        <Grid item  xs={12} >
        <TextField name='nombre' onChange={handleChange} value={currentUser.nombre} id="outlined-basic" label="Nombre" fullWidth variant="outlined" />
        </Grid>
        <Grid item  xs={12} >
        <TextField name='apellido'  onChange={handleChange}  value={currentUser.apellido} id="outlined-basic" label="Apellido" fullWidth variant="outlined" />
        </Grid>
        <Grid item  xs={12} >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Permisos</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentUser.admin}
            label="Permisos"
            onChange={handleChange}
            name='admin'
          >
            <MenuItem  value={true}>Administrador</MenuItem>
            <MenuItem value={false}>Usuario</MenuItem>
          </Select>
        </FormControl>
        </Grid>
        </Grid>
        </ModalBody>
        <ModalFooter >
          <Button variant="contained" color='anaranjado1' onClick={updateData} sx={{ marginLeft: 1 }}>
            Aplicar
          </Button>
          <Button variant="contained" color='rojo' onClick={() => { setModalSettings(false) }} sx={{ marginLeft: 1 }}>
            cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={flag}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )




}