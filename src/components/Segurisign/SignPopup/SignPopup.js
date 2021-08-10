import React, {useRef} from "react";
import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import {Col} from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import Button from "react-bootstrap/Button";

const SignPopUP = (props) => {
    const sigCanvas = useRef({});
    const clear = () => sigCanvas.current.clear();

    const sign = async () => {
        const signedSuccessfully = await props.seguriSignController.biometricSignature(sigCanvas.current, props.multilateralId, props.lat, props.long);
        if (signedSuccessfully) {
            alert(signedSuccessfully);
        } else {
            alert('Error al firmar');
        }
        return signedSuccessfully;
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
                                            onClick={clear}>Borrar</Button>
                                    <button className='btn-seguridata-lg' style={{
                                        'height': '3rem',
                                        'width': '9rem',
                                        'margin-left': '3rem',
                                    }} onClick={() => {
                                        sign().then(_ => close)
                                    }}>Firmar
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
export default SignPopUP
