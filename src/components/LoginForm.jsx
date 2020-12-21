import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../styles/loginForm.css";
import FormField from "./FormField";
import FormFieldFactory from "../utils/formFieldFactory";
import {
  areInputsEmpty,
  areInputsInvalid,
  clearWarningMessages,
} from "../utils/formInputValidation";
import makeHttpRequest from "../utils/httpRequest";

class LoginForm extends Component {
  constructor() {
    super();
    const formFieldFactory = new FormFieldFactory();
    this.state.formFields = [
      formFieldFactory.create("Email", 1),
      formFieldFactory.create("Password", 2),
      formFieldFactory.create("Pin", 2),
    ];
  }
  state = {
    redirect: false,
  };

  handleInputChange = (id, value) => {
    const { formFields } = this.state;
    formFields[id].value = value;
    this.setState({ formFields });
  };

  handleVisibilityChange = (id) => {
    const { formFields } = this.state;
    formFields[id].inputType =
      formFields[id].inputType === "password" ? "text" : "password";
    this.setState({ formFields });
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const { formFields } = this.state;
    const { validateInput } = this;
    const { onLogin } = this.props;
    if (validateInput(formFields)) {
      const email = formFields[0].value;
      const login = await makeHttpRequest(
        "https://reqres.in/api/login",
        "POST"
      );
      const loginData = {
        email,
        token: login.token,
      };
      localStorage.setItem("loginData", JSON.stringify(loginData));
      onLogin();
      this.setState({ redirect: true });
    }
  };

  validateInput = (formFields) => {
    const inputsEmpty = areInputsEmpty.call(this, formFields);
    const inputsInvalid = areInputsInvalid.call(this, formFields);
    if (inputsEmpty || inputsInvalid) {
      setTimeout(() => {
        clearWarningMessages.call(this);
      }, 3000);
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { formFields, redirect } = this.state;
    const { handleInputChange, handleVisibilityChange, handleLogin } = this;
    if (redirect) {
      return <Redirect push to="/" />;
    }
    return (
      <form>
        {formFields.map((element) => (
          <FormField
            key={element.id}
            id={element.id}
            label={element.label}
            value={element.value}
            inputType={element.inputType}
            onInputChange={handleInputChange}
            onVisibilityChange={handleVisibilityChange}
            hideText={element.hide}
            isInputEmpty={element.isInputEmpty}
            isInputInvalid={element.isInputInvalid}
          />
        ))}
        <button onClick={handleLogin}>Log in</button>
      </form>
    );
  }
}

export default LoginForm;
