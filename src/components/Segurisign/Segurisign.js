import React, {useRef, useState} from "react";
import SegurisignController from "../controller/segurisign_controller";
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup'

const Segurisign = () => {
    const passwordRef = useRef(null);
    const seguriSignController = new SegurisignController();
    const [logged, setLogged] = useState(true);

    const signIn = e => {
        e.preventDefault();
        seguriSignController.authenticate(passwordRef.current.value)
            .then(value => {
                    setLogged(value);
                    console.log(value)
                }
            ).catch(error => {
            console.log(error);
            setLogged(false);
        })
    }

    return (


        <div>
            {logged ? <SignaturePad/> :
                <form>
                    <input ref={passwordRef} type="password"/>
                    <button onClick={signIn}>Entrar</button>
                </form>
            }
        </div>
    )

}

const SignaturePad = () => {
    return (
        <Popup modal trigger={<button>Firmar!</button>}>
            {close => (
                <div>
                    <SignatureCanvas penColor='black'
                                     canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}/>
                    <button onClick={close}>Cerrar</button>
                </div>)}
        </Popup>
    )
}
export default Segurisign
