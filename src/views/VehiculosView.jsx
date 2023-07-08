import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../css/Analisis.css';
import { db } from "../firebase/firebase-config";
import { collection, setDoc, doc, query, onSnapshot } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { v4  } from 'uuid';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';



let marcas = ['CHEVROLET', 'HYUNDAI', 'TOYOTA', 'KIA', 'NISSAN']
let años_options = ['2006-2012', '2013-2018', '2019-2023']

export default function VehiculosView() {
    const [modalInsertar, setModalinsertar] = useState(false);
    const [años, setAños] = useState([]);
    const [kilometraje, setKilometraje] = useState("");
    const [placa, setPlaca] = useState("");
    const [page, setPage] = useState(0);
    const [marca, setMarca] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [registro, setRegistro] = useState([]);
    const navigate = useNavigate();
    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };
    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };
    const getData = async () => {

        const q = query(collection(db, "inventario"));
        onSnapshot(q, (querySnapshot) => {
            const params = [];
            querySnapshot.forEach((doc) => {
                params.push(doc.data());
            });
            setRegistro(params);
        });




    }

    const IngresarEquipo = async () => {
        let new_carro = {
            marca: marca,
            id: v4(),
            year: años,
            kilometraje: kilometraje,
            kilometraje_actual: kilometraje,
            kilometraje_inicial:kilometraje,
            placa: placa,
            mantenimientos: [],
        }

        Swal.fire(
            'Auto Registrado',
            '',
            'success'
        )

        sendFirestore(new_carro)
        setModalinsertar(false);
    }

    const sendFirestore = (_newEquipo) => {

        try {
            setDoc(doc(db, "inventario", `${_newEquipo.id}`), _newEquipo);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



   
    useEffect(() => {
        getData();
    }, [])


    return (<>

        <Container style={{ paddingTop: 10 }}>
            <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} md={12}>

                    <Button
                        variant="contained"

                        sx={{ height: "100%" }}
                        endIcon={<DirectionsCarIcon sx={{ fontSize: 100 }} />}
                        onClick={() => mostrarModalInsertar()}
                    >Ingresar Vehiculo</Button>


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
                                            Marca
                                        </TableCell>
                                        <TableCell

                                            align={"left"}
                                            style={{ minWidth: 200 }}
                                        >
                                            Año
                                        </TableCell>
                                        <TableCell

                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Placa
                                        </TableCell>
                                        <TableCell

                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Kilometraje
                                        </TableCell>
                                        <TableCell

                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Mantenimientos
                                        </TableCell>


                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registro.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell align="left">
                                                        {row.marca}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.year}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.placa}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.kilometraje}
                                                    </TableCell>


                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={1}>

                                                            <IconButton color="info" aria-label="informacion">
                                                                <DescriptionIcon onClick={() => { navigate(`/calculadora/${row.id}`) }} />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>

                                                </TableRow>);
                                        })}
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={registro.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>

                <Modal className="{width:0px}" isOpen={modalInsertar}>
                    <ModalHeader>
                        <div><h3>Ingresar Nuevo Vehiculo</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={marcas}
                                    onChange={(event, newvalue) => { setMarca(newvalue) }}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Marca" type="text" />}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={años_options}
                                    onChange={(event, newValue) => {
                                        setAños(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Años" type="text" />}
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Kilometraje" type="number" variant="outlined" onChange={(event) => setKilometraje(event.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" fullWidth label="Placa" type="text" variant="outlined" onChange={(event) => setPlaca(event.target.value)} />
                            </Grid>

                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"

                                onClick={() => IngresarEquipo()}
                            >
                                Insertar
                            </Button>
                            <Button
                                variant="contained"

                                onClick={() => cerrarModalInsertar()}
                            >
                                Cancelar
                            </Button>
                        </Stack>
                    </ModalFooter>
                </Modal>

            </Grid>
        </Container>
    </>)
}