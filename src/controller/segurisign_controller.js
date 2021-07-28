import SegurisignDocument from "../model/segurisign_document";
import {auth} from "./firebase_controller";
import SegurisignUser from "../model/segurisign_user";
import axios from "axios";

class SegurisignController {
    iDDomain = "1";
    apiUrl = "https://200.66.66.212:8088/ws-rest-hrv-4.7.0"

    header = {
        'Content-Type': 'application/json; charset=UTF-8',
        "Accept": "application/json",
    };

    segurisignUser;

    constructor() {
        this.segurisignUser = new SegurisignUser();
    }

    getCurrentDate() {
        return new Date(Date.now()).toLocaleString().split(',')[0].split(' ')[0].replaceAll('/', '-');
    }

    async biometricSignature(signData, multilateralId, lat, long) {
        const biometricX = [];
        const biometricY = [];
        const biometricP = [];
        const biometricT = [];
        console.log(signData)
        signData.toData()[0].forEach(point => {
            console.log(point);
            biometricX.push(point.x);
            biometricY.push(point.y);
            biometricT.push(point.time);
            biometricP.push(1);
        });
        const body = {
            "biometricData": "Probando Segurisign",
            "biometricDate": this.getCurrentDate(),
            "biometricTime": biometricT.join(','),
            "biometricX": biometricX.join(','),
            "biometricY": biometricY.join(','),
            "biometricP": biometricP.join(','),
            "blSendEmail": true,
            "canvasHeight": 200,
            "canvasWidth": 500,
            "emailToSend": auth.currentUser.email,
            "geolocationData": {
                "geoLatitud": lat,
                "geoLongitud": long
            },
            "idDomain": this.iDDomain,
            "idRhEmp": this.segurisignUser.idRh,
            "lineWidth": 3,
            "location": "",
            "multilateralId": multilateralId,
            "nameSign": "",
            "passwordDomain": "",
            "radius": 3,
            "signatureImage": signData.toDataURL(),
            "signatureReason": "Razón de firma",
            "userDomain": ""
        };

        const requestOptions = {
            method: 'POST',
            headers: this.getSecureHeader(),
            body: JSON.stringify(body)
        };
        let response = await fetch(this.apiUrl + '/biometricsignature', requestOptions);
        console.log(body)
        if (response.status === 200) {
            let data = await response.json();
            console.log(data);
            return data.result === 1;
        }
        return false;
    }


    async getStatus() {
        const documents = [];
        const body = {
            "endDate": this.getCurrentDate(),
            "idDomain": this.iDDomain,
            "idRhEmp": this.segurisignUser.idRh,
            "iniDate": "01-01-2021",
            "passwordDomain": "",
            "statusReceipt": "PENDIENTES_POR_FIRMAR_EMPLEADO",
            "userDomain": ""
        };

        const requestOptions = {
            method: 'POST',
            headers: this.getSecureHeader(),
            body: JSON.stringify(body)
        };
        let response = await fetch(this.apiUrl + '/getStatus', requestOptions);

        if (response.status === 200) {
            let data = await response.json();
            for (const doc in data.lstReceipts) {
                documents.push(new SegurisignDocument(data.lstReceipts[doc]));
            }
            return documents;
        }
    }

    async addDocumentForParticipants(signers, file) {
        const body = {
            "automaticSignatureDomain": false,
            "docNameWithExtension": '',
            "docType": "CONTRATOS",
            "document": '',
            "idDomain": this.iDDomain,
            "lstParticipant": signers,
            "passwordDomain": "",
            "userDomain": "",
            "xmlCallback": ""
        };

        const requestOptions = {
            method: 'POST',
            headers: this.getSecureHeader(),
            body: JSON.stringify(body)
        };
        let response = await fetch(this.apiUrl + '/participants', requestOptions);

        if (response.status === 200) {
            let data = await response.json();
            return data.result === 1;
            // handle data
        }
        return false;
    }

    async getSignersList(email) {
        const body = {
            "email": "",
            "idDomain": this.iDDomain,
            "idRhEmp": this.segurisignUser.idRh,
            "login": email,
            "name": "",
            "passwordDomain": "",
            "rfc": "",
            "userDomain": ""

        };

        const requestOptions = {
            method: 'POST',
            headers: this.getSecureHeader(),
            body: JSON.stringify(body)
        };
        let response = await fetch(this.apiUrl + '/getlist', requestOptions);

        if (response.status === 200) {
            let data = await response.json();
            return data.result === 1;
            // handle data
        }
        return false;
    }

    async loginUser(password) {
        let formData = new FormData();
        formData.append('strlogin', auth.currentUser.email);

        return axios.post(
            this.apiUrl + '/login',
            formData,
        )
            .then(res => {
                this.segurisignUser.idPerson = res.data.idPerson;
                this.segurisignUser.token = res.data.token;
                this.segurisignUser.idEmployeeProfile = res.data.idEmployeeProfile;
                return this.authUser(password).then(value => {
                        return value;
                    }
                );
            })
            .catch(err => {
                console.log(err);
                return false;
            })
    }

    async authUser(password) {
        const body = {
            'strlogin': auth.currentUser.email,
            "autType": "USUARIO_PASSWORD",
            "idDomain": this.iDDomain,
            "idPerson": this.segurisignUser.idPerson,
            "password": password,
            "token": this.segurisignUser.token
        };
        console.log(body)
        const requestOptions = {
            method: 'POST',
            headers: this.header,
            body: JSON.stringify(body)
        };

        return fetch(this.apiUrl + '/user', requestOptions).then(res => {
            if (res.status === 200) {
                return res.json().then(data => {
                    console.log(data)
                    this.segurisignUser.idRh = data.idRh
                    return data.resultado === 1;
                })
            }
            return false;
        });

    }

    async updatePassword(oldPassword, newPassword) {
        const body = {
            "autType": "USUARIO_PASSWORD",
            "certificate": "",
            "idEmployeeProfile": this.segurisignUser.idEmployeeProfile,
            "idRhEmp": this.segurisignUser.idRh,
            "login": auth.currentUser.email,
            "message": "",
            "newPasswordAut": newPassword,
            "idDomain": this.iDDomain,
            "newPasswordPrivateKey": "",
            "password": oldPassword,
            "passwordDomain": "",
            "resultado": 0,
            "userDomain": ""

        };
        const requestOptions = {
            method: 'POST',
            headers: this.header,
            body: JSON.stringify(body)
        };

        let response = await fetch(this.apiUrl + '/updateUserPasswords', requestOptions);

        if (response.status === 200) {

            let data = await response.json();
            return data.resultado === 1;
        }
        return false;

    }

    getSecureHeader() {
        return {
            'Content-Type': 'application/json; charset=UTF-8',
            "Accept": "application/json",
            'authorization': this.segurisignUser.token
        };
    }
}

export default SegurisignController
