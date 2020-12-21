export function areInputsEmpty(formFields) {
	let numOfEmpty = 0;
	for (let i = 0; i < formFields.length; i++) {
		if (formFields[i].value.length === 0) {
			formFields[i].isInputEmpty = true;
			numOfEmpty++;
		}
	}
	this.setState({ formFields });
	if (numOfEmpty) {
		return true;
	} else {
		return false;
	}
}

export function areInputsInvalid(formFields) {
	let displayWarning = false;
	const email = formFields[0].value;
	const password = formFields[1].value;
	const pin = formFields[2].value;
	if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
		formFields[0].isInputInvalid = true;
		displayWarning = true;
	}
	if (password.length < 8 || password.length > 32) {
		formFields[1].isInputInvalid = true;
		displayWarning = true;
	}
	if (pin.length < 4 || pin.length > 8) {
		formFields[2].isInputInvalid = true;
		displayWarning = true;
	}
	this.setState({ formFields });
	if (displayWarning) {
		return true;
	} else {
		return false;
	}
}

export function clearWarningMessages() {
	const { formFields } = this.state;
	for (let i = 0; i < formFields.length; i++) {
		formFields[i].isInputEmpty = false;
		formFields[i].isInputInvalid = false;
	}
	this.setState({ formFields });
}
