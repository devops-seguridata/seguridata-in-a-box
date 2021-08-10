import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import {Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useRef, useState} from "react";
import CustomLoader from "../../CustomLoader/CustomLoader";

const CancelPopup = (props) => {
    const reasonText = useRef(null)
    const [loading, setLoading] = useState(false);
    const cancel = () => {
        setLoading(true)
        props.seguriSignController.cancelDocument(props.multilateralId, reasonText.current.value).then(result => {
            setLoading(false)
            if (result)
                props.toaster.successToast('Documento cancelado con éxito');
            else
                props.toaster.errorToast('Error al cancelar documento, intente de nuevo');
        }).catch(err => {
            props.toaster.errorToast(err);
            setLoading(false)
        });
    }
    return (
        <div>
            <Popup modal trigger={<Button variant="outline-dark">Cancelar</Button>}>
                {close => (
                    <div align='center'>
                        {loading ? <CustomLoader/>
                            :

                            <Card style={{}}>
                                <Card.Body>
                                    <Card.Title>Cancelar documento</Card.Title>
                                    <Col>
                                    <textarea ref={reasonText}>
                                        Escribe el motivo de la cancelación
                                    </textarea>

                                    </Col>
                                    <Col>
                                        <Button variant='outline-dark' onClick={close}>Cerrar</Button>
                                        <button className='btn-seguridata-lg' style={{'margin-left': '2rem'}}
                                                onClick={cancel}>Cancelar
                                        </button>

                                    </Col>
                                </Card.Body>
                            </Card>
                        }
                    </div>
                )}
            </Popup>
        </div>
    )
}

export default CancelPopup