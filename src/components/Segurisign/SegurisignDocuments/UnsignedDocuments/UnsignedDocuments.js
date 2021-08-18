import {Accordion, Badge, Col, ProgressBar, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import UserController from "../../../../controller/user_controller";
import {AiOutlineCheck, TiDeleteOutline} from "react-icons/all";

const UnsignedDocuments = (props) => {
    const [docsWithInfo, setDocsWithInfo] = useState({arr: []})
    const userController = new UserController()
    const getDocInfo = async () => {
        const tmp = [];
        for (const index in props.unsignedDocuments) {
            const newDoc = await userController.getSignDocData(props.unsignedDocuments[index].multilateralId)
            if (newDoc) {
                tmp.push(newDoc)
                console.log(tmp)
            }
        }
        return tmp;
    }
    useEffect(() => {
        const getInfo = async () => {
            const temp = await Promise.all([getDocInfo()]).then(res => setDocsWithInfo({arr: res}));
        }
        getInfo();

    }, []);


    const renderTableCell = (user, index) => {
        return (
            <tr key={index}>
                <td>{index}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.firmo ? <AiOutlineCheck/> : <TiDeleteOutline/>}</td>
            </tr>
        )
    }

    return (
        <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
            <Accordion.Header>Firmados<Badge style={{'marginLeft': '3rem'}} pill
                                             bg="secondary">{props.unsignedDocuments.length}</Badge></Accordion.Header>
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
                                            Tipo de documento: {item.docType}
                                        </li>
                                        <li>
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
                                        </li>
                                    </div>
                                    <br/>
                                    <button className='btn-seguridata-lg'
                                    >Descargar
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

export default UnsignedDocuments