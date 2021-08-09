import React, {useEffect, useRef, useState} from "react";
import {Document, pdfjs} from 'react-pdf/dist/esm/entry.webpack';
import SegurisignController from "../../controller/segurisign_controller";
import SignatureCanvas from 'react-signature-canvas'
import Card from 'react-bootstrap/Card';
import Popup from 'reactjs-popup'
import './segurisign.css'
import Button from "react-bootstrap/Button";
import {Accordion, Row, Form, Col} from "react-bootstrap";
import {FcUpload} from "react-icons/all";
import Waves from "../Waves/waves";
import CustomToasts from "../Toasts/CustomToasts";
import {ToastContainer} from "react-toastify";
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import {Page} from "react-pdf";


const seguriSignController = new SegurisignController();

const Segurisign = () => {
    const passwordRef = useRef(null);
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(false);

    const signIn = e => {
        setLoading(true);
        e.preventDefault();
        seguriSignController.loginUser(passwordRef.current.value)
            .then(value => {
                    setLogged(value);
                    console.log('finished', value)
                }
            ).catch(error => {
            console.log(error);
            setLogged(false);
            setLoading(false);
        })
    }

    return (

        <div>
            {logged ? <SignaturePad/> :
                loading ?
                    <Waves/>
                    :
                    <div className='centered box-shadow'>
                        <Card style={{width: '18rem'}}>
                            <Card.Header as="h5">Ingresa tu contraseña</Card.Header>
                            <Card.Body className='box-shadow'>
                                <Card.Text>
                                    <div>
                                        <form>
                                            <input className='input-password-sign' ref={passwordRef} type="password"/>
                                        </form>
                                    </div>
                                </Card.Text>
                                <button className='btn-seguridata' onClick={signIn}>Entrar</button>
                            </Card.Body>
                        </Card>
                    </div>
            }
        </div>
    )

}

const SignaturePad = () => {
    const [selectedFile, setSelectedFile] = useState({selectedFile: null, hasSelected: false})
    const [signers, setSigners] = useState({arr: []});
    const [location, setLocation] = useState({loading: true, isEnabled: false, lat: 0, long: 0});
    const [loader, setLoader] = useState(false);
    const toaster = new CustomToasts();
    const signerInput = useRef(null);
    const [loaded, setLoaded] = useState({
        hasLoaded: false,
        signedDocuments: [],
        unsignedDocuments: [],
        cancelledDoc: [],
        expiredDoc: [],
        cancelledByThirds: []
    });
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    useEffect(() => {
        if (!location.isEnabled) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLocation({
                        loading: false,
                        isEnabled: true,
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    })
                },
                function (error) {
                    setLocation({
                        loading: false,
                        isEnabled: true,
                        lat: 0,
                        long: 0
                    })
                }
            );
        }
    }, [location])

    useEffect(() => {
        getDocuments();
    }, []);

    const getDocuments = async () => {
        const [signedDoc, unsignedDoc, cancelledDoc,
            expiredDoc, cancelledByThirdsDoc] = await Promise.all(
            [
                seguriSignController.getStatus('CONCLUIDO'),
                seguriSignController.getStatus('PENDIENTES_POR_FIRMAR_EMPLEADO'),
                seguriSignController.getStatus('CANCELADOS'),
                seguriSignController.getStatus('CANCELADOS_TERCEROS'),
            ]
        );

        setLoaded({
            signedDocuments: signedDoc,
            hasLoaded: true,
            unsignedDocuments: unsignedDoc,
            cancelledDoc: cancelledDoc,
            expiredDoc: expiredDoc,
            cancelledByThirds: cancelledByThirdsDoc
        });
    }

    const addDocument = () => {
        if (signers.arr.length === 0) {
            toaster.warningToast('Necesitas agregar por lo menos un firmante');
            return;
        }
        if (!selectedFile.hasSelected) {
            toaster.warningToast('Selecciona un archivo');
            return;
        }

        setLoader(true);
        seguriSignController.addDocumentForParticipants(signers.arr, selectedFile.selectedFile).then(succeed => {
            toaster.successToast('Documento subido con éxito');
            setLoader(false);
        }).catch(error => {
            setLoader(false);
            console.log(error);
            toaster.errorToast(error);
        });
    }

    const addSigner = async () => {
        const signerMail = signerInput.current.value;
        if (signerMail === '') {
            toaster.warningToast('Ingrese el correo de un firmante')
            return;
        }
        setLoader(true);
        const isValid = await seguriSignController.getSignersList(signerMail);
        setLoader(false);
        if (isValid) {
            if (signers.arr.includes(signerMail))
                toaster.warningToast('Firmante ya agregado');
            else {
                setSigners({arr: [...signers.arr, signerMail]}) //simple value
                toaster.shortSuccesToast('Agregado');
            }
        } else
            toaster.errorToast('Firmante no registrado');
    }

    const onFileChange = event => {
        setSelectedFile({hasSelected: true, selectedFile: event.target.files[0]});
    };

    return (
        location.loading ? <Waves/>
            :
            location.isEnabled ?
                loaded.hasLoaded ?
                    <div className='inner box-shadow'>
                        <ToastContainer/>
                        <Card>
                            <Card.Body>
                                <Card.Title>Mis Documentos</Card.Title>
                                <Accordion bsPrefix='seguridata' style={{'position': 'inherit'}}>
                                    <Accordion.Header>Documentos Por Firmar</Accordion.Header>
                                    <Accordion.Body>
                                        <Accordion flush>
                                            {
                                                loaded.unsignedDocuments.map(function (item, index) {
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
                                                                <button className='btn-seguridata-lg'
                                                                        onClick={() => seguriSignController.getDocument(item.multilateralId).then(docUrl => {
                                                                                window.open('data:application/pdf;base64,' + docUrl);
                                                                            }
                                                                        )}>Ver
                                                                </button>
                                                                <SignPopUP long={location.long} lat={location.lat}
                                                                           key={item.multilateralId}
                                                                           multilateralId={item.multilateralId}
                                                                           fileName={item.fileName}/>
                                                            </div>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                })}
                                        </Accordion>
                                    </Accordion.Body>

                                </Accordion>

                                <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
                                    <Accordion.Header>Documentos Firmados</Accordion.Header>
                                    <Accordion.Body>
                                        <Accordion flush>
                                            {loaded.signedDocuments.map(function (item, index) {
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
                                                                    onClick={() => seguriSignController.getDocument(item.multilateralId).then(docUrl => {
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

                                <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
                                    <Accordion.Header>Documentos Cancelados</Accordion.Header>
                                    <Accordion.Body bsPrefix='seguridata-btn'>
                                        <Accordion flush>
                                            {loaded.cancelledDoc.map(function (item, index) {
                                                return <Accordion.Item eventKey={index + 1}>
                                                    <Accordion.Header>{item.fileName}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <div align='center'>
                                                            <div style={{'margin-left': '2rem'}} align='left'>
                                                                <li>
                                                                    Tipo de documento: {item.docType}
                                                                </li>
                                                                <li>
                                                                    Fecha de cancelación: {item.dateCancel}
                                                                </li>
                                                                <li>
                                                                    Cancelado por: {item.dateCancel}
                                                                </li>
                                                                <li>
                                                                    Motivo de cancelación: {item.dateCancel}
                                                                </li>
                                                            </div>
                                                            <br/>
                                                            <button className='btn-seguridata-lg'
                                                                    onClick={() => seguriSignController.getDocument(item.multilateralId).then(docUrl => {
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

                                <Accordion bsPrefix='seguridata' flush style={{'position': 'inherit'}}>
                                    <Accordion.Header>Cancelados Por Terceros</Accordion.Header>
                                    <Accordion.Body bsPrefix='seguridata-btn'>
                                        <Accordion flush>
                                            {loaded.cancelledDoc.map(function (item, index) {
                                                return <Accordion.Item eventKey={index + 1}>
                                                    <Accordion.Header>{item.fileName}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <div align='center'>
                                                            <div style={{'margin-left': '2rem'}} align='left'>
                                                                <li>
                                                                    Tipo de documento: {item.docType}
                                                                </li>
                                                                <li>
                                                                    Fecha de cancelación: {item.dateCancel}
                                                                </li>
                                                                <li>
                                                                    Cancelado por: {item.canceledBy}
                                                                </li>
                                                                <li>
                                                                    Motivo de cancelación: {item.reasonCancelDocument}
                                                                </li>
                                                            </div>
                                                            <br/>
                                                            <button className='btn-seguridata-lg'
                                                                    onClick={() => seguriSignController.getDocument(item.multilateralId).then(docUrl => {
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

                                <div style={{'margin-top': '3rem'}}>
                                    <Popup modal trigger={
                                        <button size='lg' className='btn-seguridata-upload'>
                                            <h6 style={{'color': '#83bb04'}}>Subir documento</h6>
                                            <FcUpload/></button>}>
                                        {close => (
                                            <LoadingOverlay
                                                active={loader}
                                                spinner={<BounceLoader/>}
                                            >
                                                <div className='sigNewDoc'>
                                                    <Card border='black' style={{}}>
                                                        <Card.Header>Subir Documento</Card.Header>
                                                        <Card.Body className='box-shadow'>
                                                            <div className='newDocContent'>
                                                                <Col>
                                                                    <Row style={{'marginBottom': '1rem'}}>
                                                                        <Col><input className='input-email-firmante' type='text' ref={signerInput}
                                                                                    placeholder='Ingresa el correo de los firmantes'/>
                                                                        </Col>
                                                                        <Col>
                                                                            <button className='btn-seguridata-lg'
                                                                                    onClick={addSigner}>Agregar firmante
                                                                            </button>
                                                                        </Col>
                                                                    </Row>
                                                                    <Form.Group as={Row}>
                                                                        <Col><Form.Control type="file" size="sm"
                                                                                           onChange={onFileChange}/></Col>
                                                                    </Form.Group>
                                                                    <Row>
                                                                        <Document
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
                                                </div>

                                            </LoadingOverlay>
                                        )}
                                    </Popup>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    :
                    <Waves/>
                :
                <div className='centered'><h2>Necesitas activar tu ubicación</h2></div>
    )

}


const SignPopUP = (props) => {
    const sigCanvas = useRef({});
    const clear = () => sigCanvas.current.clear();

    const sign = () => {
        seguriSignController.biometricSignature(sigCanvas.current, props.multilateralId, props.lat, props.long).then(r => {
            if (r)
                alert(r);
            else {
                alert('Error al firmar');
            }
        });
    }
    return (
        <div>
            <Popup modal trigger={<button className='btn-seguridata-lg'>Firmar</button>}>
                {close => (
                    <div align='center'>
                        <Card style={{}}>
                            <Card.Body>
                                <Card.Title>Firmar documento</Card.Title>
                                <Col>
                                    <SignatureCanvas ref={sigCanvas} penColor='black'
                                                     canvasProps={{
                                                         width: 500,
                                                         height: 200,
                                                         className: 'sigCanvas',
                                                     }}/>
                                </Col>

                                <Col>
                                    <Button variant='outline-dark' onClick={close}>Cerrar</Button>
                                    <Button variant='outline-dark' style={{'margin-left': '2rem'}}
                                            Click={clear}>Borrar</Button>
                                    <button className='btn-seguridata-lg' style={{
                                        'height': '3rem',
                                        'width': '9rem',
                                        'margin-left': '3rem',
                                    }} onClick={sign}>Firmar
                                    </button>

                                </Col>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </Popup>
        </div>
    )


}

export default Segurisign
