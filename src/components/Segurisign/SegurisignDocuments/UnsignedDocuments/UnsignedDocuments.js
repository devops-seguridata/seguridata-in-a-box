import {Accordion, Badge, Col, Row} from "react-bootstrap";
import SignPopUP from "../../SignPopup/SignPopup";
import React from "react";
import CancelPopup from "../../CancelPopup/CancelPopup";

const UnsignedDocuments = (props) => {
    return (
        <Accordion bsPrefix='seguridata' style={{'position': 'inherit'}}>
            <Accordion.Header>Por Firmar <Badge style={{'marginLeft': '2rem'}}
                                                bg="dark">{props.unsignedDocuments.length}</Badge></Accordion.Header>
            <Accordion.Body>
                <Accordion flush>
                    {
                        props.unsignedDocuments.map(function (item, index) {
                            return <Accordion.Item eventKey={index + 1}
                                                   key={item.multilateralId}>
                                <Accordion.Header>{item.fileName}</Accordion.Header>
                                <Accordion.Body>

                                    <div align='center'>
                                        <div style={{'margin-left': '2rem'}} align='left'>
                                            <li>
                                                Tipo de documento: {item.docType}
                                            </li>
                                            <li>
                                                Fecha: {item.iniDate}
                                            </li>
                                            <li>
                                                Número de firmas: {item.numberSignatures}
                                            </li>
                                        </div>
                                        <br/>
                                        <Row>
                                            <Col>
                                                <CancelPopup
                                                    toaster={props.toaster}
                                                    key={item.multilateralId}
                                                    multilateralId={item.multilateralId}
                                                    seguriSignController={props.seguriSignController}
                                                />
                                            </Col>
                                            <Col>
                                                <button className='btn-seguridata-lg'
                                                    style={{'width':'80%'}}
                                                        onClick={() => props.seguriSignController.getDocument(item.multilateralId).then(docUrl => {
                                                                window.open('data:application/pdf;base64,' + docUrl);
                                                            }
                                                        )}>Ver
                                                </button>
                                            </Col>
                                            <Col>
                                            <SignPopUP
                                                seguriSignController={props.seguriSignController}
                                                long={props.long} lat={props.lat}
                                                key={item.multilateralId}
                                                multilateralId={item.multilateralId}
                                                fileName={item.fileName}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        })}
                </Accordion>
            </Accordion.Body>

        </Accordion>
    )
}

export default UnsignedDocuments