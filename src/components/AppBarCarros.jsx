import AppBar from '@mui/material/AppBar';
import React,{useState} from 'react';
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
import SettingsIcon from '@mui/icons-material/Settings';
//iconos
import DriveEtaIcon from '@mui/icons-material/DriveEta';


export default  function AppBarCarros(){
    const [drawerHT,setDrawerHT] = useState({left:false});
    const navigate = useNavigate(); // hook para navegar entre urls o vistas



      // funcion para hacer funcionar el drawer
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerHT({ ...drawerHT, [anchor]: open });
      };
 

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
             <ListItemButton onClick={()=>{navigate('/')}} >
                        <ListItemIcon>
                            <SettingsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Parametros"/>
            </ListItemButton>

            <ListItemButton onClick={()=>{navigate('/vehiculos')}} >
                        <ListItemIcon>
                            <DriveEtaIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Vehiculos"/>
            </ListItemButton>

            <ListItemButton onClick={()=>{navigate('/calculadora')}} >
                        <ListItemIcon>
                            <DriveEtaIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Analisis"/>
            </ListItemButton>
            </List>
            
      </Drawer>
    </>
    );
}