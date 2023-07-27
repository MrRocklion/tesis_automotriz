import React,{useRef} from "react";
import Button from '@mui/material/Button';
import {  doc, getDoc,setDoc } from "firebase/firestore";
import Container from '@mui/material/Container';
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import data_json from "../scripts/params.json";
export default function ManipulacionView() {
    const mans_modificados = useRef([])


    const readData = async() => {

        const docRef = doc(db, "parametros", "a2fe686f-e546-4818-91e0-ff5a1226b880");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
          let mantenimientos = docSnap.data().mantenimientos
          let arreglo_modify = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]
          let arreglo_original = [4.5, 9, 13.5, 18, 22.5, 27, 31.5, 36, 40.5, 45, 49.5, 54, 58.5, 63, 67.5, 72, 76.5, 81, 85.5, 90]
          let man_modify = []
          if(arreglo_modify.length === arreglo_original.length){
            arreglo_original.forEach((item,index) =>{
                let temp = mantenimientos.filter(_dato=> _dato.km === item)
                let aux_datos = temp.map(item2 => {
                    item2.km = arreglo_modify[index]
                    return item2
                })
               man_modify = man_modify.concat(aux_datos)


            })
            mans_modificados.current = man_modify

            console.log(man_modify)
          }
        
    }

    const crearParametro = async()=>{
        
        // let new_param = {
        //     id: uuidv4(),
        //     kilometros:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        //     marca:"TOYOTA",
        //     start:"2006",
        //     end:"2012",
        //     nombre: "TOYOTA 2006-2012",
        //     mantenimientos:mans_modificados.current
        // }
        // console.log(new_param)
        // await setDoc(doc(db, "actividades", new_param.id),new_param);
    //    let aux_datos = [
    //     {
    //         nombre:"TOYOTA",
    //         codigo: 1,
    //         id:uuidv4()
    //     },
    //     {
    //         nombre:"HYUNDAI",
    //         codigo: 2,
    //         id:uuidv4()
    //     },
    //     {
    //         nombre:"CHEVROLET",
    //         codigo: 3,
    //         id:uuidv4()
    //     },
    //     {
    //         nombre:"KIA",
    //         codigo: 4,
    //         id:uuidv4()
    //     },
    //     {
    //         nombre:"NISSAN",
    //         codigo: 5,
    //         id:uuidv4()
    //     }
    //    ]
      
    //    aux_datos.forEach(async(item)=>{
    //     await setDoc(doc(db, "marcas", item.id),item);
    //    })
       
    }



    return (

        <>
            <Container>

                <h1>estructurar datos</h1>
                <Button
                    variant="contained"
                    onClick={readData}
                >
                    leer datos
                </Button>
                <Button
                    variant="contained"
                    onClick={crearParametro}
                >
                    Cargar Datos
                </Button>
            </Container>
        </>
    )

}