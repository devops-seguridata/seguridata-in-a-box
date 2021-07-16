class QRController {
	apiUrl = 'https://qval2.qryptal.net/v2';
	token = 'Token [QVAL:201132060640178225999004]eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoIjoicTIucXJ5cHRhbC5uZXQiLCJvIjoxMDAxMTAwLCJleHAiOjE5NTExNDI0MDAsImp0aSI6IjIwMTEzMjA2MDY0MDE3ODIyNTk5OTAwNCJ9.SagJ8yFAIfRsykimIxFnGiKPRGq9wjfp6kJ2d6TJ-2w';
	headers = {
		'Authorization': token,
		'Content-Type': 'application/x-www-form-urlencoded',
	};

	async fetchQRData(content) {
		const formData = new FormData();
		//Si hay error, checar stringification del content
		const payload = {
			'code_content': content,
		}
		formData.append('payload', JSON.stringify(payload));

		const requestOptions = {
			method: 'POST',
			headers: this.header,
			body: payload
		};
		let response = await fetch(apiUrl + '/validate', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			this.idProfileCompany = data.idProfileCompany;
			return data.result == 1;
			// handle data
		}
		return false;
	}

	async fetchQRFile(fileToken) {
		const formData = new FormData();
		formData.append('file_token', fileToken);

		const requestOptions = {
			method: 'POST',
			headers: this.header,
			body: payload
		};
		let response = await fetch(apiUrl + '/validate', requestOptions);

		if (response.status === 200) {
			let data = await response.json();
			return data.file_b64;
			// handle data
		}
		return false;
	}

}