import React, { Component } from "react";
import { warning } from "../utils/warningMessages";

class FormField extends Component {
  constructor() {
    super();
    this.input = React.createRef();
  }

  // returns className for password inputs
  inputVisibility = () => {
    const { inputType } = this.props;
    let icon = "fa toggle-password ";
    icon += inputType === "password" ? "fa-eye-slash" : "fa-eye";
    return icon;
  };

  render() {
    const { input, inputVisibility } = this;
    const {
      id,
      label,
      value,
      inputType,
      onInputChange,
      onVisibilityChange,
      hideText,
      isInputEmpty,
      isInputInvalid,
    } = this.props;
    return (
      <div>
        <label>{label}</label>
        <input
          ref={input}
          id={id}
          value={value}
          type={inputType}
          onChange={() => onInputChange(id, input.current.value)}
        />
        {hideText && (
          <span
            className={inputVisibility()}
            onClick={() => onVisibilityChange(id)}
          ></span>
        )}
        {isInputEmpty ? (
          <span className="warning">{warning.empty}</span>
        ) : (
          isInputInvalid && (
            <span className="warning">{warning[label.toLowerCase()]}</span>
          )
        )}
      </div>
    );
  }
}

export default FormField;
