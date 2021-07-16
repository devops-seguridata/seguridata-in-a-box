class SegurisignController {
	iDDomain = "1";
	apiUrl = "http://200.66.66.212:8087/ws-rest-hrv-4.7.0"

	header = {
		'Content-Type': 'application/json; charset=UTF-8',
		"Accept": "application/json",
	};

	segurisignUser;

	constructor() {
		this.user = firebase.auth().currentUser;
	}

	async biometricSignature() {
		const body = {
			"biometricData": "Probando Segurisign",
			"biometricDate": getCurrentDate(),
			"biometricTime": "dd-mm-yyyy",
			"biometricX": "[]",
			"biometricY": "[]",
			"biometricP": "[]",
			"blSendEmail": true,
			"canvasHeight": 0,
			"canvasWidth": 0,
			"emailToSend": user.email,
			"geolocationData": {
				"geoLatitud": 0,
				"geoLongitud": 0
			},
			"idDomain": this.iDDomain,
			"idRhEmp": this.segurisingUser.idRhEmp,
			"lineWidth": 0,
			"location": "",
			"multilateralId": 0,
			"nameSign": "",
			"passwordDomain": "",
			"radius": 0,
			"signatureImage": "",
			"signatureReason": "",
			"userDomain": ""
		};

		const requestOptions = {
			method: 'POST',
			headers: this.secureHeader,
			body: JSON.stringify(body)
		};
		let response = await fetch(apiUrl + '/biometricsignature', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			return data.result == 1;
			// handle data
		}
		return false;
	}



	async getStatus() {
		const documents = [];
		const body = {
			"endDate": getCurrentDate(),
			"idDomain": this.iDDomain,
			"idRhEmp": this.segurisignUser.idRh,
			"iniDate": "01-01-2021",
			"passwordDomain": "",
			"statusReceipt": "PENDIENTES_POR_FIRMAR_EMPLEADO",
			"userDomain": ""
		};

		const requestOptions = {
			method: 'POST',
			headers: this.secureHeader,
			body: JSON.stringify(body)
		};
		let response = await fetch(apiUrl + '/getStatus', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			for (document in data.lstReceipts) {
				documents.push(SegurisignDocument(data));
			}
			//regresar lista 
			return documents;
			// handle data
		}
	}

	async addDocumentForParticipants(signers, file) {
		const body = {
			"automaticSignatureDomain": false,
			"docNameWithExtension": loginUser.fileToUpload.path.split('/').last,
			"docType": "CONTRATOS",
			"document": base64Encode(loginUser.fileToUpload.readAsBytesSync()),
			"idDomain": iDDomain,
			"lstParticipant": signersMapList,
			"passwordDomain": "",
			"userDomain": "",
			"xmlCallback": ""
		};

		const requestOptions = {
			method: 'POST',
			headers: this.secureHeader,
			body: JSON.stringify(body)
		};
		let response = await fetch(apiUrl + '/participants', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			return data.result == 1;
			// handle data
		}
		return false;
	}


	async getSignersList(email) {
		const body = {
			"email": "",
			"idDomain": this.iDDomain,
			"idRhEmp": loginUser.idRh,
			"login": email,
			"name": "",
			"passwordDomain": "",
			"rfc": "",
			"userDomain": ""

		};

		const requestOptions = {
			method: 'POST',
			headers: this.secureHeader,
			body: JSON.stringify(body)
		};
		let response = await fetch(apiUrl + '/getlist', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			return data.result == 1;
			// handle data
		}
		return false;
	}

	async authenticate(password) {
		await this.loginUser();
		return await authUser(password);
	}


	async loginUser() {
		//Si causa error, cambiar a multipart request
		const simpleHeader = {
			'Content-Type': 'application/x-www-form-urlencoded',
		};

		const requestOptions = {
			method: 'POST',
			headers: simpleHeader,
			body: JSON.stringify({ 'strlogin': user.email })
		};
		let response = await fetch(apiUrl + '/login', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			this.segurisignUser = this.segurisignUser(data);
			// handle data
		}
		return false;
	}

	async authUser(password) {
		const body = {
			'strlogin': user.email,
			"autType": "USUARIO_PASSWORD",
			"idDomain": this.iDDomain,
			"idPerson": this.segurisignUser.idPerson,
			"password": password,
			"token": this.segurisignUser.token
		};
		const requestOptions = {
			method: 'POST',
			headers: this.header,
			body: JSON.stringify(body)
		};

		let response = await fetch(apiUrl + '/user', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			this.segurisingUser.idRh = data.idRh
			return data.resultado == 1;
		}
		return false;

	}

	async updatePassword(oldPassword, newPassword) {
		const body = {
			"autType": "USUARIO_PASSWORD",
			"certificate": "",
			"idEmployeeProfile": this.segurisignUser.idEmployeeProfile,
			"idRhEmp": this.segurisignUser.idRh,
			"login": user.email,
			"message": "",
			"newPasswordAut": newPassword,
			"idDomain": iDDomain,
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

		let response = await fetch(apiUrl + '/updateUserPasswords', requestOptions);

		if (response.status === 200) {
			return data.resultado == 1;
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
