class VisibleField {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.inputType = "text";
    this.value = "";
  }
}

class HiddenField {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.inputType = "password";
    this.value = "";
    this.hide = true;
  }
}

export default class FormFieldFactory {
  constructor() {
    this.id = -1;
  }
  create = (label, inputType) => {
    this.id++;
    switch (inputType) {
      case 1:
        return new VisibleField(this.id, label);
      case 2:
        return new HiddenField(this.id, label);
      default:
        return null;
    }
  };
}
