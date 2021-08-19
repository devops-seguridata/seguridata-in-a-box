import {Accordion, Badge, Col, ProgressBar, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import UserController from "../../../../controller/user_controller";
import {AiOutlineCheck, AiOutlineMail, TiDeleteOutline} from "react-icons/all";
import SignPopUP from "../../SignPopup/SignPopup";
import CancelPopup from "../../CancelPopup/CancelPopup";
import CustomLoader from "../../../CustomLoader/CustomLoader";

const UnsignedDocuments = (props) => {
    const [loading, setLoading] = useState(false)
    const userController = new UserController()


    const renderTableCell = (user, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.firmo ? <AiOutlineCheck/> : <TiDeleteOutline/>}</td>
                <td>
                    <button><AiOutlineMail/></button>
                </td>
            </tr>
        )
    }

    return (
        <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
            <Accordion.Header>Por Firmar<Badge style={{'marginLeft': '3rem'}} pill
                                               bg="dark">{props.unsignedDocuments.length}</Badge></Accordion.Header>
            <Accordion.Body>
                <Accordion flush>
                    {props.unsignedDocuments.map(function (item, index) {
                        const now = item.firmados.length / item.numeroFirmas;
                        console.log(item)
                        return <Accordion.Item eventKey={index + 1}>
                            <Accordion.Header>{item.fileName}<ProgressBar bsPrefix='progress-bar' striped variant="info"
                                                                          now={now}
                                                                          label={`${now}%`}/></Accordion.Header>
                            <Accordion.Body>
                                <div align='center'>
                                    <div style={{'margin-left': '2rem'}} align='left'>
                                        <li>
                                            Tipo de documento: {item.docType}
                                        </li>

                                        <li>
                                            Número de firmas: {item.numeroFirmas}
                                        </li>

                                        <li>
                                            Firmados: {item.firmados.length}
                                        </li>
                                        <div>
                                            <Table striped bordered hover>
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nombre</th>
                                                    <th>Correo</th>
                                                    <th>Status</th>
                                                    <th>Recordar</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {item.usuarios.map(renderTableCell)}
                                                </tbody>
                                            </Table>
                                        </div>
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
                                            {
                                                loading ? <CustomLoader/> :
                                                    <button className='btn-seguridata-lg'
                                                            style={{'width': '80%'}}
                                                            onClick={() => {
                                                                setLoading(true);
                                                                props.seguriSignController.getDocument(item.multilateralId).then(docUrl => {
                                                                        window.open('data:application/pdf;base64,' + docUrl);
                                                                        setLoading(false);
                                                                    }
                                                                ).catch(e => {
                                                                    setLoading(false);
                                                                    props.toaster.errorToast(e)
                                                                })
                                                            }}>Ver
                                                    </button>
                                            }
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