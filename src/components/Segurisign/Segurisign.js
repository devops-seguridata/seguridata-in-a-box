import React, {useEffect, useRef, useState} from "react";
import SegurisignController from "../../controller/segurisign_controller";
import SignatureCanvas from 'react-signature-canvas'
import Popup from 'reactjs-popup'
import './segurisign.css'

const seguriSignController = new SegurisignController();

const Segurisign = () => {
    const passwordRef = useRef(null);
    const [logged, setLogged] = useState(false);

    const signIn = e => {
        e.preventDefault();
        seguriSignController.loginUser(passwordRef.current.value)
            .then(value => {
                    setLogged(value);
                    console.log('finished', value)
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
    const [loaded, setLoaded] = useState({hasLoaded: false, documents: null});
    const [location, setLocation] = useState({isEnabled: false, lat: 0, long: 0})

    useEffect(() => {
        if (!location.isEnabled) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setLocation({
                    isEnabled: true,
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                })
            });
        }
    }, [location])

    useEffect(() => {
        getDocuments();
    }, []);

    const getDocuments = () => {
        seguriSignController.getStatus().then(documents => {
            setLoaded({hasLoaded: true, documents: documents});
        })
    }

    const addDocument = () =>{

    }

    return (
        location.isEnabled ?
            loaded.hasLoaded ?
                <div>
                    <div>
                        <Popup modal trigger={<button>Cargar archivo</button>}>
                            {close => (
                                <div>
                                    <button onClick={close}>Cerrar</button>
                                </div>
                            )}
                        </Popup>
                    </div>
                    <ul>
                        {loaded.documents.map(function (item) {
                            return <SignPopUP long={location.long} lat={location.lat} key={item.multilateralId}
                                              multilateralId={item.multilateralId}
                                              fileName={item.fileName}/>
                        })}
                    </ul>
                </div>
                : <div>No documents</div>
            : <div> Necesitas activar tu ubicación</div>
    )

}


const SignPopUP = (props) => {
    const sigCanvas = useRef({});
    const clear = () => sigCanvas.current.clear();

    const sign = () => {
        seguriSignController.biometricSignature(sigCanvas.current, props.multilateralId, props.lat, this.props.long).then(r => console.log(r));
    }
    return (
        <div>
            <h2>{props.fileName}</h2>
            <Popup modal trigger={<button>Firmar!</button>}>
                {close => (
                    <div>
                        <SignatureCanvas ref={sigCanvas} penColor='black'
                                         canvasProps={{
                                             width: 500,
                                             height: 200,
                                             className: 'sigCanvas',
                                         }}/>
                        <button onClick={close}>Cerrar</button>
                        <button onClick={clear}>Borrar</button>
                        <button onClick={sign}>Firmar</button>
                    </div>
                )}
            </Popup>
        </div>
    )


}

export default Segurisign
