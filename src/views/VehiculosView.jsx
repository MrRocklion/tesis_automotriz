import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../css/Analisis.css';
import { db } from "../firebase/firebase-config";
import { collection, setDoc, doc,getDocs,getDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import Container from '@mui/material/Container';
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
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';

export default function VehiculosView(){
    const [modalInsertar, setModalinsertar] = useState(false);
    const [tipoAuto, setTipoAuto] = useState([]);
    const [tipoAños, setTipoAños] = useState([]);
    const [años, setAños] = useState([]);
    const [tipo, setTipo] = useState();
    const [descripcion,setDescripcion] = useState('');
    const [parametros,setParametros] = useState([{}]);
    const [page, setPage] = useState(0);
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
        const ref_inventario = await getDocs(collection(db, "inventario"));
        let aux_inventario = ref_inventario.docs.map((doc) => ({ ...doc.data() }))
        aux_inventario.sort((a, b) => (b.indice - a.indice))
        setRegistro(aux_inventario);


	}

    const IngresarEquipo = async () => {
		var valorNuevo = {
			//valores iniciales por defecto
			marca: tipo,
			año: años,
            kilometros: [],
            nombre:tipo+" "+años,
			id:tipo+" "+años,
		}
		console.log(valorNuevo)
		Swal.fire(
			'Auto Registrado',
			'',
			'success'
		)
		console.log(valorNuevo)
		sendFirestore(valorNuevo)
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

      const navegarView = (ruta) => {
        navigate(`/${ruta}`);
    }

      const cambiarAnalisis= () => {
        navegarView('calculadora');
    };
    useEffect(() => {
        getData();
      }, [])
    
    
    return(<>
    
    <Container style={{paddingTop:10}}>
    <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    <Grid item xs={12} md={12}>

<Button
    variant="contained"

    sx={{ height: "100%" }}
    endIcon={<DirectionsCarIcon sx={{ fontSize: 100 }} />}
    onClick={() => mostrarModalInsertar()}
>Ingresar Vehiculo</Button>

<Button
    variant="contained"

    sx={{ height: "100%" }}
    endIcon={<ManageHistoryIcon sx={{ fontSize: 100 }} />}
    onClick={() => cambiarAnalisis()}
>Calcular</Button>

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
                                                Marca
                                            </TableCell>
                                            <TableCell
                                                key={"Name"}
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                                >
                                                Año
                                            </TableCell>
                                            <TableCell
                                                key={"modelo"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Informacion
                                            </TableCell>
                                           
                                      
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {registro.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row,index) => {
                                        return (
                                            <TableRow key={index}>
                                                 <TableCell align="left">
                                                 {row.marca}
                                                </TableCell>
                                                <TableCell align="left">
                                                {row.año}
                                                </TableCell>
                                                
                                                <TableCell align="center">
                             
                                                        <IconButton color="info" aria-label="informacion">
                                                            <PermDeviceInformationIcon />
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
								options={tipoAuto}
								onChange={(event, newvalue) => setTipo(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Marca" type="text" />}
							/>
                
                      </Grid>

                      <Grid item xs={12}>
                <Autocomplete
								disableClearable
								id="combo-box-demo"
								options={tipoAños}
								onChange={(event, newvalue) => setAños(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Años" type="text" />}
							/>
                
                      </Grid>

                       {/* <Grid item xs={12}>
                        <TextareaAutosize
                          style={{textTransform:"uppercase"}} 
                          aria-label="minimum height"
                          value={descripcion}
                          minRows={1}
                          placeholder="KILOMETRAJE"
                          className="text-area-encargado"
                          onChange={(e) => setDescripcion(e.target.value)} 
                        />
                
                      </Grid> */}
              
                </Grid>
                </ModalBody>
                <ModalFooter>					
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
				</ModalFooter>
</Modal>

    </Grid>
    </Container>
    </>)
}