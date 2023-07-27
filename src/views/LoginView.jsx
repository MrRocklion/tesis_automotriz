import "../css/LoginView.css"
import {React,useState,forwardRef} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import fondo from '../assets/fondo_app.jpg'
import logo from '../assets/logo.jpeg';
import { useNavigate } from 'react-router-dom'
import { auth } from "../firebase/firebase-config";
import { db } from "../firebase/firebase-config";
import { doc, getDoc,setDoc } from "firebase/firestore";
import {signInWithEmailAndPassword , createUserWithEmailAndPassword} from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Modal, ModalBody } from 'reactstrap';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from 'sweetalert2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginView() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [validacion,setValidacion] =useState(false);
  const [modalRegister,setModalRegister] = useState(false);
  const [flagAuth,setFlagAuth] = useState(false);


  const handleClick = () => {
    setOpen(true);

  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setOpen(false);
  };
  
  const handleRegister = (event) => {
    event.preventDefault();
    setFlagAuth(true)
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      lastName: data.get("lastName"),
      firstName: data.get("firstName"),
    });
    if(data.get("password")=== data.get("confirm_password")){

   
    createUserWithEmailAndPassword(auth, data.get("email"),data.get("password"),)
    .then(async(userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      await setDoc(doc(db, "usuarios",user.uid), {
        nombre: data.get("firstName"),
        apellido: data.get("lastName"),
        password: data.get("password"),
        email:data.get("email"),
        admin:false,
        id:user.uid,

      });
      setFlagAuth(false)
      Swal.fire(
        'Registro Correcto!',
        'Usuario Registrado',
        'success'
      )
      setModalRegister(false)
     
      // ...
    })
    .catch((error) => {
      setFlagAuth(false)
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire(
        errorCode,
        errorMessage,
        'error'
      )

      // ..
    });

  }else{
    setOpen(true)
    setFlagAuth(false)
  }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setFlagAuth(true)
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  
  signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
  .then(async(userCredential) => {
    // Signed in
    const user = userCredential.user;
    const ref = doc(db, "usuarios",user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      let data = docSnap.data();

      navigate(`/${data.id}/parametros`)
    }
   

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    handleClick();
    setValidacion(true);
    setFlagAuth(false)
  });

  };

  
  // const authWithGoogle = () => {
  //   console.log("aun no esta esta funcionalidad");
  //   // signInWithPopup(auth, provider)
  //   // .then((result) => {
  //   //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   //   const token = credential.accessToken;
  //   //   // The signed-in user info.
  //   //   const user = result.user;
  //   //   console.log("usuario autenticado en con exito")
  //   //   console.log(user)
  //   // }).catch((error) => {
  //   //   // Handle Errors here.
  //   //   const errorCode = error.code;
  //   //   const errorMessage = error.message;
  //   //   // The email of the user's account used.
  //   //   const email = error.customData.email;
  //   //   // The AuthCredential type that was used.
  //   //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   //   // ...
  //   // });

  // }

  return (
    <>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      > <img alt="fondo de semaforos" src={fondo} width={"100%"} height={"100%"} ></img>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo} alt="logo de la empresa" width={150} />
          <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
            Iniciar Sesión
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          El correo o contraseña no coinciden.
        </Alert>
      </Snackbar>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electronico"
              name="email"
              autoComplete="email"
              autoFocus
              error = {validacion}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              error = {validacion}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuerdame"
            />
            <Button
              type="submit"
              fullWidth
              color='anaranjado1'
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            <Button fullWidth variant="contained" onClick={()=>{setModalRegister(true)}}>
                  ¿No tienes una Cuenta? Regístrate
                </Button>
     
           
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
    <Modal isOpen={modalRegister} >
                    
                    <ModalBody>
                    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Primer Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electronico"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirmar Password"
                  type="password"
                  id="password"
                  autoComplete="confirm-password"
                />
              </Grid>
   
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              REGISTRAR
            </Button>
            <Button variant="contained" color='rojo' fullWidth onClick={() => { setModalRegister(false) }}>
                            cancelar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      </ModalBody>
    </Modal>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={flagAuth}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
   </>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        P&M Automotive v1.0.1
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});