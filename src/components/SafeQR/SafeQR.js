import QrReader from 'react-qr-scanner'
import {useState} from "react";
import QRController from "../../controller/qr_controller";

const SafeQR = () => {
    const [scanned, setScanned] = useState({result: 'Sin Resultado', delay: false});
    const qrController = new QRController();
    const previewStyle = {
        height: 240,
        width: 320,
    }
    const handleScan = (data) =>{
        if(data!= null)
            qrController.fetchQRData(data).then(r => console.log(r));
    }
    const handleError = (data) =>{

        console.log(data)
    }
    return (
        <div>
            <QrReader
                delay={scanned.delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            />
            <p>{scanned.result}</p>
        </div>
    )
}

export default SafeQR