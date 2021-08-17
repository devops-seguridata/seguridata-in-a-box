import Popup from "reactjs-popup";
import {FcUpload, FiDelete} from "react-icons/all";
import Card from "react-bootstrap/Card";
import {Accordion, ButtonGroup, Col, Dropdown, Form, Row} from "react-bootstrap";
import {Document, Page, pdfjs} from 'react-pdf';
import Button from "react-bootstrap/Button";
import React, {useRef, useState} from "react";
import CustomLoader from "../../CustomLoader/CustomLoader";
import UserController from "../../../controller/user_controller";

const UploadPopup = (props) => {
    const signerInput = useRef(null);
    const [loader, setLoader] = useState(false);
    const [selectedFile, setSelectedFile] = useState({selectedFile: null, hasSelected: false})
    const [signers, setSigners] = useState({arr: []});
    const userController = new UserController();
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const addDocument = () => {
        if (signers.arr.length === 0) {
            props.toaster.warningToast('Necesitas agregar por lo menos un firmante');
            return;
        }
        if (!selectedFile.hasSelected) {
            props.toaster.warningToast('Selecciona un archivo');
            return;
        }

        setLoader(true);
        props.seguriSignController.addDocumentForParticipants(signers.arr, selectedFile.selectedFile).then(response => {
            const succeed = response[0];
            if (succeed) {
                const multilateralID = response[1];
                userController.addNewDocToFirebase(signers.arr, multilateralID);
                props.toaster.successToast('Documento subido con éxito');
            }
            else {
                props.toaster.errorToast('Error al subir documento, intenta de nuevo');
            }
            setLoader(false);
        }).catch(error => {
            setLoader(false);
            props.toaster.errorToast(error);
        });
    }

    const addSigner = async () => {
        const signerMail = signerInput.current.value;
        if (signerMail === '') {
            props.toaster.warningToast('Ingrese el correo de un firmante')
            return;
        }
        setLoader(true);
        const isValid = await props.seguriSignController.getSignersList(signerMail);
        setLoader(false);
        if (isValid) {
            if (signers.arr.includes(signerMail))
                props.toaster.warningToast('Firmante ya agregado');
            else {
                setSigners({arr: [...signers.arr, signerMail]}) //simple value
                props.toaster.shortSuccesToast('Agregado');
            }
        } else
            props.toaster.errorToast('Firmante no registrado');
    }

    const onFileChange = event => {
        setSelectedFile({hasSelected: true, selectedFile: event.target.files[0]});
    };

    const deleteSigner = signer => {
        setSigners({arr: signers.arr.filter(sig => sig !== signer)});
    }
    return (
        <div style={{'margin-top': '3rem'}}>
            <Popup modal trigger={
                <button size='lg' className='btn-seguridata-upload'>
                    <h6 style={{'color': '#83bb04'}}>Subir documento</h6>
                    <FcUpload/></button>}>
                {close => (
                    <div className='sigNewDoc'>
                        {loader ? <CustomLoader/> :

                            <Card border='black' style={{}}>
                                <Card.Header>Subir Documento</Card.Header>
                                <Card.Body className='box-shadow'>
                                    <div className='newDocContent'>
                                        <Col>
                                            <Row style={{'marginBottom': '1rem'}}>
                                                <Col><input className='input-email-firmante'
                                                            type='text' ref={signerInput}
                                                            placeholder='Ingresa el correo de los firmantes'/>
                                                </Col>
                                                <Col>
                                                    <Dropdown as={ButtonGroup}>
                                                        <Button bsPrefix='btn-seguridata-lg' onClick={addSigner}
                                                                variant="success">Agregar firmante
                                                        </Button>
                                                        <Dropdown.Toggle style={{
                                                            'background-color': '#88be0f'
                                                        }} split variant="success"
                                                                         id="dropdown-split-basic"/>
                                                        <Dropdown.Menu>
                                                            {
                                                                signers.arr.map(function (signer, index) {
                                                                    return <Dropdown.Item key={index}>{signer}
                                                                        <button className='btn-del-signer'
                                                                                onClick={() => {
                                                                                    deleteSigner(signer)
                                                                                }}><FiDelete/></button>
                                                                    </Dropdown.Item>
                                                                })
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>
                                            <Form.Group as={Row}>
                                                <Col><Form.Control type="file" size="sm"
                                                                   onChange={onFileChange}/></Col>
                                            </Form.Group>
                                            <Row>
                                                <Document onLoadError={console.error}
                                                          file={selectedFile.selectedFile}>
                                                    <Page pageNumber={1}/>
                                                </Document>
                                            </Row>
                                            <Col style={{'margin-top': '1rem'}}>

                                                <Button variant="outline-dark"
                                                        onClick={close}>Cerrar</Button>
                                                <button
                                                    style={{
                                                        'margin-left': '2rem',
                                                        'height': '2.5rem'
                                                    }}
                                                    className='btn-seguridata-lg'
                                                    onClick={addDocument}>Enviar archivo!
                                                </button>
                                            </Col>

                                        </Col>
                                    </div>
                                </Card.Body>
                            </Card>
                        }

                    </div>

                )}
            </Popup>
        </div>
    )
}

export default UploadPopup