import React, {useRef, useState} from "react";
import SegurisignController from "../../controller/segurisign_controller";
import Card from 'react-bootstrap/Card';
import './segurisign.css'
import Waves from "../Waves/waves";
import SegurisignDocuments from "./SegurisignDocuments/SegurisignDocuments";
import {ToastContainer} from "react-toastify";
import CustomToasts from "../Toasts/CustomToasts";


const seguriSignController = new SegurisignController();

const Segurisign = () => {
    const passwordRef = useRef(null);
    const toaster = new CustomToasts();
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(false);

    const signIn = e => {
        setLoading(true);
        e.preventDefault();
        seguriSignController.loginUser(passwordRef.current.value)
            .then(value => {
                    setLogged(value);
                }
            ).catch(error => {
            toaster.errorToast(error);
            setLogged(false);
            setLoading(false);
        })
    }

    return (
        <div>
            <ToastContainer/>
            {logged ? <SegurisignDocuments seguriSignController={seguriSignController}/> :
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


export default Segurisign
