import React, {useEffect,  useState} from "react";
import CustomToasts from "../../Toasts/CustomToasts";
import Waves from "../../Waves/waves";
import {ToastContainer} from "react-toastify";
import Card from "react-bootstrap/Card";
import UploadPopup from "../UploadPopup/UploadPopup";
import SignedDocuments from "./SignedDocuments/SignedDocuments";
import UnsignedDocuments from "./UnsignedDocuments/UnsignedDocuments";
import CancelledDocuments from "./CancelledDocuments/CancelledDocuments";
import CancelledThirdsDocuments from "./CancelledThirdsDocuments/CancelledThirdsDocuments";
import ExpiredDocuments from "./ExpiredDocuments/ExpiredDocuments";
import UserController from "../../../controller/user_controller";
import {auth} from "../../../controller/firebase_controller";

const SegurisignDocuments = (props) => {
    const userController = new UserController();
    const [location, setLocation] = useState({loading: true, isEnabled: false, lat: 0, long: 0});
    const toaster = new CustomToasts();
    const [loaded, setLoaded] = useState({
        hasLoaded: false,
        signedDocuments: [],
        unsignedDocuments: [],
        cancelledDoc: [],
        expiredDoc: [],
        cancelledByThirds: []
    });
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
                function () {
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
            expiredDoc, cancelledByThirdsDoc ] = await Promise.all(
            [
                props.seguriSignController.getStatus('PENDIENTES_POR_FIRMAR_EMPLEADO'),
                userController.getUserDocs(auth.currentUser.uid),
                props.seguriSignController.getStatus('CANCELADOS'),
                props.seguriSignController.getStatus('EXPIRADOS'),
                props.seguriSignController.getStatus('CANCELADOS_TERCEROS'),
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
                                <UnsignedDocuments lat={location.lat} long={location.long}
                                                   toaster={toaster}
                                                   unsignedDocuments={loaded.unsignedDocuments}
                                                   seguriSignController={props.seguriSignController}/>

                                <SignedDocuments seguriSignController={props.seguriSignController}
                                                 signedDocuments={loaded.signedDocuments}/>

                                <CancelledDocuments cancelledDoc={loaded.cancelledDoc}
                                                    seguriSignController={props.seguriSignController}/>

                                <CancelledThirdsDocuments cancelledByThirds={loaded.cancelledByThirds}
                                                          seguriSignController={props.seguriSignController}/>

                                <ExpiredDocuments expiredDoc={loaded.expiredDoc}
                                                          seguriSignController={props.seguriSignController}/>
                                <UploadPopup seguriSignController={props.seguriSignController} toaster={toaster}/>
                            </Card.Body>
                        </Card>
                    </div>
                    :
                    <Waves/>
                :
                <div className='centered'><h2>Necesitas activar tu ubicación</h2></div>
    )
}

export default SegurisignDocuments