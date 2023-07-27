import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../css/Analisis.css';
import Container from '@mui/material/Container';
import { db } from "../firebase/firebase-config";
import Grid from "@mui/material/Grid";
import { collection, query, doc, updateDoc, getDocs, where, onSnapshot } from "firebase/firestore";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { generarPdf } from "../scripts/pdfReporte";
import { useParams } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
function obtenerDatosNoRepetidos(arreglo1, arreglo2) {
    const datosNoRepetidos = [];

    // Comprobar elementos del arreglo1 que no están en el arreglo2
    for (let i = 0; i < arreglo1.length; i++) {
        if (!arreglo2.includes(arreglo1[i]) && !datosNoRepetidos.includes(arreglo1[i])) {
            datosNoRepetidos.push(arreglo1[i]);
        }
    }

    // Comprobar elementos del arreglo2 que no están en el arreglo1
    for (let i = 0; i < arreglo2.length; i++) {
        if (!arreglo1.includes(arreglo2[i]) && !datosNoRepetidos.includes(arreglo2[i])) {
            datosNoRepetidos.push(arreglo2[i]);
        }
    }

    return datosNoRepetidos;
}

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
    let { id } = useParams();
    const [flagTipoMan, setFlagTipoMan] = useState(true)
    const [vehiculo, setVehiculo] = useState({ marca: '' });
    const [kms, setKms] = useState(0);
    const [modalMantenimientos, setModalMantenimientos] = useState(false)
    const [mantenimientos, setMantenimientos] = useState([{ data: [], name: 0 }])
    const [titulo, setTitulos] = useState("Mantenimiento Automotriz")
    const [manProgramados, setManProgramados] = useState([])
    const [modalComentario, setModalComentario] = useState(false)
    const [kmComentario, setKmComentario] = useState(0);
    const [comentario, setComentario] = useState("")
    const [comentariosVehiculo, setComentariosVehiculo] = useState([{ text: "Ninguno", km: 0 }])
    const [flagActualizar, setflagActualizar] = useState(true);
    const [currentComment, setCurrentComment] = useState("");

    const readData = () => {
        onSnapshot(doc(db, "inventario", id), (doc) => {
            setVehiculo(doc.data())
            setComentariosVehiculo(doc.data().comentario)
        })
    }
    const abrirModalMantenimiento = () => {

        setModalMantenimientos(true)
    }

    const handleChange = (code,name) => {
        let temp_man = JSON.parse(JSON.stringify(mantenimientos)) 
        let aux_table = temp_man.map((item)=> {
            if(item.name === name){
                item.data.forEach(element => {
                    if(element.codigo === code){
                        element.realizado = !element.realizado
                    }
                });
            }
            return item

        })
        setMantenimientos(temp_man)
      };
    const encontrarIndiceUltimoMenor = (arr, numero) => {
        let valor = null; // Valor inicial del último número menor

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < numero) {
                valor = arr[i]; // Actualizar el valor cuando se encuentra un número menor
            }
        }

        return valor;
    }
    const actualizarVerificacion =async()=>{
        const ref = doc(db, "inventario", id);
        await updateDoc(ref, {
            data_man: mantenimientos,
        });
        Swal.fire(
            'Actualizado!',
            'Mantenimientos Actualizados',
            'success'
        )
    }
    const Calcular = async () => {
        let constante1 = parseInt(vehiculo.kilometraje_actual)
        let constante2 = parseInt(kms)
        setflagActualizar(true)
        if (constante1 < constante2) {

            let name_target = `${vehiculo.marca} ${vehiculo.year}`
            const q = query(collection(db, "parametros"), where("nombre", "==", name_target));
            let data = []
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                data = doc.data()
            });

            try {
                if (vehiculo.mantenimientos.length < 1) {
                    let data_mans_faltantes = []
                    let aux_km = data.kilometros.map(item => (item * 1000))
                    let temp_kms = parseInt(kms) - parseInt(vehiculo.kilometraje_inicial)
                    let valor = encontrarIndiceUltimoMenor(aux_km, parseInt(temp_kms)) / 1000
                    let kilometrajes_man = data.kilometros.filter(item => item <= valor)
                    setManProgramados(kilometrajes_man)
                    for (let i = 0; i < kilometrajes_man.length; i++) {
                        let datos_man = data.mantenimientos.filter(item => item.km === kilometrajes_man[i])
                        let datos_man_aux = datos_man.map(item =>{
                            item.realizado = false 
                            return item
                        })
                        let object_man = {
                            data: datos_man_aux,
                            name: kilometrajes_man[i]
                        }
                        data_mans_faltantes.push(object_man)
                    }
                    console.log(data_mans_faltantes)
                    setMantenimientos(data_mans_faltantes)
                    setModalMantenimientos(false)
                    setFlagTipoMan(false)
                    setTitulos("Mantenimiento Automotriz")

                } else {
                    let data_mans_faltantes = []
                    let aux_km = data.kilometros.map(item => (item * 1000))
                    let temp_kms = parseInt(kms) - parseInt(vehiculo.kilometraje_inicial)
                    let valor = encontrarIndiceUltimoMenor(aux_km, parseInt(temp_kms)) / 1000
                    let kilometrajes_man = data.kilometros.filter(item => item <= valor)
                    let aux_man_unicos = obtenerDatosNoRepetidos(vehiculo.mantenimientos, kilometrajes_man)
                    if (aux_man_unicos.length === 0) {
                        Swal.fire({
                            title: 'Llego al limite de Planificacion de mantenimientos',
                            text: "Quiere Riniciar?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si!'
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const ref = doc(db, "inventario", id);
                                await updateDoc(ref, {
                                    mantenimientos: [],
                                    kilometraje_actual: kms,
                                    kilometraje_inicial: kms,
                                });
                                Swal.fire(
                                    'Reiniciado!',
                                    'Mantenimientos Reiniciados',
                                    'success'
                                )
                                setModalMantenimientos(false)
                                setFlagTipoMan(true)
                            }
                        })
                    } else {
                        setManProgramados(kilometrajes_man)
                        for (let i = 0; i < aux_man_unicos.length; i++) {
                            let datos_man = data.mantenimientos.filter(item => item.km === aux_man_unicos[i])
                            let datos_man_aux = datos_man.map(item =>{
                                item.realizado = false 
                                return item
                            })
                            let object_man = {
                                data: datos_man_aux,
                                name: aux_man_unicos[i]
                            }

                            data_mans_faltantes.push(object_man)
                        }
                        console.log(data_mans_faltantes)
                        setMantenimientos(data_mans_faltantes)
                        setModalMantenimientos(false)
                        setFlagTipoMan(false)
                        setTitulos("Mantenimiento Automotriz")
                    }

                }


            } catch (error) {
                setFlagTipoMan(true)
            }
        } else {
            Swal.fire(
                'Kilometraje Inferior',
                '',
                'warning'
            )
        }
    }
    const guardarMantenimientosRealizados = () => {

        Swal.fire({
            title: 'Estas Seguro?',
            text: "Este Plan se registrará en la base de datos!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si,guardar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let vehiculo_updated = JSON.parse(JSON.stringify(vehiculo))
                vehiculo_updated.kilometraje_actual = kms
                vehiculo_updated.mantenimientos = manProgramados
                setVehiculo(vehiculo_updated)
                const ref = doc(db, "inventario", id);
                await updateDoc(ref, {
                    data_man: mantenimientos,
                    mantenimientos: manProgramados,
                    kilometraje_actual: kms,
                    comentario: comentariosVehiculo,
                });
                Swal.fire(
                    'Mantenimiento Agregado!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })


    }
    const graficarManRealizados = async () => {
        setFlagTipoMan(true)
     

        try {
            if (vehiculo.mantenimientos.length > 0) {
                setManProgramados(vehiculo.mantenimientos)
                setMantenimientos(vehiculo.data_man)
                setFlagTipoMan(true)
                setflagActualizar(false)
                setTitulos("Mantenimientos Realizados")

            } else {
                Swal.fire(
                    'No hay Mantenimientos!',
                    '',
                    'error'
                )
            }


        } catch (error) {
            setFlagTipoMan(true)
        }


    }
    const crearPdf = () => {
        const hoy = new Date()
        let aux_dato = JSON.parse(JSON.stringify(mantenimientos))
        aux_dato.forEach(item=>{

            item.data.forEach(element=>{
                element.km = element.km * 1000 + parseInt(vehiculo.kilometraje_inicial)
            })
        })
 

        let parametros = {
            data: aux_dato,
            comentarios:comentariosVehiculo,
            fecha: hoy.toLocaleDateString()
        }
        generarPdf(parametros)

    }
    const abrirModalComentario = (__data) => {
        setModalComentario(true)
        let aux_coment = comentariosVehiculo.find(element => element.km === __data.name).text
        setCurrentComment(aux_coment)
    
        setKmComentario(__data.name)

    }

    const agregarComentario = async () => {
        let comentarios = JSON.parse(JSON.stringify(comentariosVehiculo))
        let newComentario = {
            km: kmComentario,
            text: comentario
        }
        let comen_filter = comentarios.filter(item => item.km !== kmComentario)
        comen_filter.push(newComentario)
        setModalComentario(false)
        setComentariosVehiculo(comen_filter)
    }

    useEffect(() => {
        readData();
        // eslint-disable-next-line
    }, [])


    return (<>
        <Container maxWidth="xl" sx={{ paddingTop: 2 }}>


            <div className="container">
                <div className="column">

                    <div className="col-sm-12" >
                        <Grid container spacing={4}>

                            <Grid item md={4} xs={12} >
                                <div className="panelp2">
                                    <Grid container spacing={2}  >

                                        <Grid item xs={12} >
                                            <h4 style={{ textAlign: "center" }}>
                                                Datos del vehículo
                                            </h4>


                                        </Grid>
                                        <Grid item xs={12}  >
                                            <TextField id="outlined-basic" fullWidth label="Marca" value={vehiculo.marca} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}  >
                                            <TextField id="outlined-basic" fullWidth label="Modelo" value={vehiculo.modelo} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField id="outlined-basic" fullWidth label="Año" value={vehiculo.year} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField id="outlined-basic" fullWidth label="Placa" value={vehiculo.placa} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField id="outlined-basic" fullWidth label="Kilometraje Inicial" value={vehiculo.kilometraje_inicial} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField id="outlined-basic" fullWidth label="Kilometraje Actual" value={vehiculo.kilometraje_actual} defaultValue="Hello World" type="text" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => abrirModalMantenimiento()}
                                            >
                                                PROGRAMAR MANTENIMIENTO
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => graficarManRealizados()}
                                            >
                                                VISUALIZAR MANTENIMIENTOS
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="panelp2">
                                    <Grid container spacing={1} >
                                        <Grid item xs={12} >
                                            <h4 style={{ textAlign: "center" }}>
                                                Generar reporte PDF
                                            </h4>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={crearPdf}
                                            >
                                                GENERAR PDF
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>

                            </Grid>

                            <Grid item xs={12} md={8} >
                                <div className="panelp2" style={{ height: 650, overflow: "scroll" }}>
                                    <Grid item xs={12} >
                                        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                                            {titulo}
                                        </h2>

                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={7}  >
                                            <Typography component="div" variant="h8" className="datos" >
                                                <div> <b>Kilometraje Inicial: </b> {vehiculo.kilometraje_inicial}</div>
                                                <div><b>Kilometraje Actual: </b>{kms}</div>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={5} >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={guardarMantenimientosRealizados}
                                                disabled={flagTipoMan}
                                            >
                                                GUARDAR MANTENIMIENTO
                                            </Button>

                                        </Grid>
                                        {
                                            mantenimientos.map((item) => (
                                                <Grid item xs={12} >

                                                    <Chip label={`Mantenimiento a los  ${item.name * 1000 + parseInt(vehiculo.kilometraje_inicial)}`} sx={{ marginBottom: 1 }} className="rosita" />
                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginLeft: 4, marginBottom: 1 }}
                                                        onClick={() => { abrirModalComentario(item) }}
                                                        disabled={flagTipoMan}
                                                    >
                                                        CREAR COMENTARIO
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginLeft: 4, marginBottom: 1 }}
                                                        onClick={() => { actualizarVerificacion() }}
                                                        hidden={flagActualizar}
                                                    >
                                                        ACTUALIZAR VERIFICACION
                                                    </Button>
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        label="Comentario"
                                                        multiline
                                                        fullWidth
                                                        sx={{ marginTop: 2, marginBottom: 2 }}
                                                        rows={2}
                                                        value={comentariosVehiculo.find(element => element.km === item.name).text}
                                                    />
                                                    <TableContainer sx={{ height: 450 }} component={Paper}>
                                                        <Table aria-label="customized table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <StyledTableCell align="left">#</StyledTableCell>
                                                                    <StyledTableCell align="left">Actividades</StyledTableCell>
                                                                    <StyledTableCell align="left">Sistema</StyledTableCell>
                                                                    <StyledTableCell align="left">Tipo</StyledTableCell>
                                                                    <StyledTableCell align="center">Verificacion</StyledTableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {item.data.map((row, index) => (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell align="left">{index + 1}</StyledTableCell>
                                                                        <StyledTableCell align="left">{row.nombre}</StyledTableCell>
                                                                        <StyledTableCell align="left">{row.sistema}</StyledTableCell>
                                                                        <StyledTableCell align="left">{row.tipo}</StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            <Checkbox
                                                                                checked={row.realizado}
                                                                                onChange={()=>{handleChange(row.codigo,item.name)}}
                                                                              
                                                                            />
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>

                                                </Grid>



                                            ))}

                                    </Grid>
                                </div>
                            </Grid>


                        </Grid>
                    </div>

                </div>



            </div>
        </Container>

        <Modal className="{width:0px}" isOpen={modalMantenimientos}>
            <ModalHeader>
                <div><h3>Ingresar Nuevo Kilometraje</h3></div>
            </ModalHeader>
            <ModalBody>
                <Grid container spacing={2}>



                    <Grid item xs={12}>
                        <TextField id="outlined-basic" fullWidth label="Kilometraje" value={kms} type="number" variant="outlined" onChange={(event) => setKms(event.target.value)} />
                    </Grid>



                </Grid>
            </ModalBody>
            <ModalFooter>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        onClick={() => Calcular()}
                    >
                        Calcular
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setModalMantenimientos(false)}
                    >
                        cancelar
                    </Button>
                </Stack>
            </ModalFooter>
        </Modal>

        <Modal className="{width:0px}" isOpen={modalComentario}>
            <ModalHeader>
                <div><h3>Ingresar Comentario</h3></div>
            </ModalHeader>
            <ModalBody>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Comentario"
                            multiline
                            fullWidth
                            rows={4}
                            defaultValue={currentComment}
                            onChange={(event) => setComentario(event.target.value)}
                        />
                    </Grid>
                </Grid>
            </ModalBody>
            <ModalFooter>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        onClick={() => agregarComentario()}
                    >
                        agregar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setModalComentario(false)}
                    >
                        cancelar
                    </Button>
                </Stack>
            </ModalFooter>
        </Modal>
    </>
    )
}