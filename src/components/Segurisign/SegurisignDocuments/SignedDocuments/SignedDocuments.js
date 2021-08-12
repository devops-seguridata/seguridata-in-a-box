import {Accordion, Badge} from "react-bootstrap";
import React from "react";

const SignedDocuments = (props) =>{
   return(
       <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
           <Accordion.Header>Firmados<Badge style={{'marginLeft':'3rem'}} pill bg="secondary">{props.signedDocuments.length}</Badge></Accordion.Header>
           <Accordion.Body>
               <Accordion flush>
                   {props.signedDocuments.map(function (item, index) {
                       return <Accordion.Item eventKey={index + 1}>
                           <Accordion.Header>{item.fileName}</Accordion.Header>
                           <Accordion.Body>
                               <div align='center'>
                                   <div style={{'margin-left': '2rem'}} align='left'>
                                       <li>
                                           Tipo de documento: {item.docType}
                                       </li>
                                       <li>
                                           Número de firmas: {item.numberSignatures}
                                       </li>
                                       <li>
                                           Fecha de firmado: {item.signDate}
                                       </li>
                                   </div>
                                   <br/>
                                   <button className='btn-seguridata-lg'
                                           onClick={() => props.seguriSignController.getDocument(item.multilateralId).then(docUrl => {
                                                   window.open('data:application/pdf;base64,' + docUrl);
                                               }
                                           )}>Descargar
                                   </button>
                               </div>
                           </Accordion.Body>
                       </Accordion.Item>
                   })}
               </Accordion>

           </Accordion.Body>
       </Accordion>
   )
}

export default SignedDocuments