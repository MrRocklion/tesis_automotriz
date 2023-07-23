import AppBar from '@mui/material/AppBar';
import React,{useState,useEffect} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
//iconos
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import CarRentalIcon from '@mui/icons-material/CarRental';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import GroupIcon from '@mui/icons-material/Group';
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase-config';


export default  function AppBarCarros(){
    const [drawerHT,setDrawerHT] = useState({left:false});
    const [adminFlag,setAdminFlag] = useState(false)
    const navigate = useNavigate(); // hook para navegar entre urls o vistas
    let { uid } = useParams();


      // funcion para hacer funcionar el drawer
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerHT({ ...drawerHT, [anchor]: open });
      };
      const readData = () => {
        onSnapshot(doc(db, "usuarios", uid), (doc) => {
          setAdminFlag(doc.data().admin)
        })
    }
 
      useEffect(() => {
        readData();
        // eslint-disable-next-line
    }, [])
    return(
    <>
        <AppBar position="static" sx={{ backgroundColor: "#34495E" }}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer('left', true)}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography sx={{ display: { md: 'flex' },flexGrow: 1 }} variant="h6" component="div">
     
          </Typography>
    
            </Toolbar>
        </AppBar>
        <Drawer
        anchor={'left'}
        open={drawerHT['left']}
        onClose={toggleDrawer('left', false)}
      >
        
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Navegacion
          </ListSubheader>
          }
        >
             <ListItemButton onClick={()=>{navigate('parametros')}} >
                        <ListItemIcon>
                            <ContentPasteIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Parametros"/>
            </ListItemButton>

            <ListItemButton onClick={()=>{navigate('vehiculos')}} >
                        <ListItemIcon>
                            <DriveEtaIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Vehiculos"/>
            </ListItemButton>
            <ListItemButton hidden={!adminFlag}  onClick={()=>{navigate('vehicles_admin')}} >
                        <ListItemIcon>
                            <CarRentalIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Administrar Vehiculos"/>
            </ListItemButton>
              <ListItemButton hidden={!adminFlag} onClick={()=>{navigate('parametros_admin')}} >
                        <ListItemIcon>
                            <SettingsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Administrar Parametros"/>
            </ListItemButton>
            <ListItemButton  hidden={!adminFlag} onClick={()=>{navigate('user_admin')}} >
                        <ListItemIcon>
                            <GroupIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Administrar Usuarios"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('/')}} >
                        <ListItemIcon>
                            <ExitToAppIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Salir"/>
            </ListItemButton>
            </List>
            
      </Drawer>
    </>
    );
}