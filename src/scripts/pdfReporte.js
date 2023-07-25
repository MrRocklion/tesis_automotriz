import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import logoHospi from '../assets/logo_ups.png'
const generarPdf = (props_pdf) => {
   
    var doc = new jsPDF({
        orientation: "portrait",
    })
    let encabezado = [
        [{ content: '', colSpan: 1, rowSpan: 2, styles: { halign: 'center', minCellWidth: 20 } },
        { content: 'PLANIFICACION DE MANTENIMIENTO VEHICULAR', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'MT-RE-01', styles: { halign: 'center', fontStyle: 'bold' } }
        ], [{ content: 'MANTENIMIENTO', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: `Fecha:${props_pdf.fecha}`, styles: { halign: 'center', fontStyle: 'bold' } }]
    ]
    let aux = 5
    autoTable(doc, {
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                doc.addImage(logoHospi, 'png', data.cell.x + 2, data.cell.y + 2, 25, 10)
            }
        },
        theme: "grid",
        startY: aux + 10,
        body: encabezado,
        // columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } },
        styles: {
            color: 20
        },

    })
    aux = 40
    doc.setFont(undefined, 'bold').setFontSize(10).text("TABLA DE MANTENIMIENTOS", 15, aux);
    props_pdf.data.forEach(element => {
        autoTable(doc, {
            body: element.data,
              columns: [
                { header: 'Actividad', dataKey: 'nombre' },
                { header: 'Sistema', dataKey: 'sistema' },
                { header: 'Tipo', dataKey: 'tipo' },
                { header: 'km * 1000', dataKey: 'km' },
                { header: 'Realizado', dataKey: 'realizado', },
              ],
        }) 
        console.log(props_pdf.comentarios)
        let aux_comment = props_pdf.comentarios.find(item=> item.km === element.name)
        console.log(aux_comment)
        encabezado = [
            [{ content: 'COMENTARIOS', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } }],
            [{ content: aux_comment.text, colSpan: 1, styles: { halign: 'left', minCellWidth: 30} }],
        ]
        autoTable(doc, {
            theme: "grid",
            body: encabezado,
            styles: {
                color: 20
            },
    
        }) 
    });
  
      

    


    
     doc.save(`REPORTE-MANTENIMIENTO.pdf`);
}


export  {generarPdf}