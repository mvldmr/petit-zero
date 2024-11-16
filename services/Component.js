class Component {
  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
  setNode(element) {
    this.node = element;
  }
  renderAllFields() {
    Object.keys(this).forEach((field) => {
      if (field === "node") return;
      this.renderField(field);
    });
  }
  setFieldValue(field, value) {
    this[field] = value;
    this.renderField(field);
  }
  renderField(field) {
    if (!this.node) return;
    if (["left", "top", "width", "height"].includes(field)) {
      this.node.style[field] = this[field] + "px";
    } else if (field === "fontsize") {
      this.node.style.fontSize = this[field] + "px";
    } else if (field === "bgcolor") {
      this.node.style.backgroundColor = this[field];
    } else if (field === "fontfamily") {
      this.node.style.fontFamily = this[field];
    } else if (field === "fontweight") {
      this.node.style.fontWeight = this[field];
    } else if (field === "lineheight") {
      this.node.style.lineHeight = this[field];
    } else if (field === "zindex") {
      this.node.style.zIndex = this[field];
    } else {
      this.node.style[field] = this[field];
    }
  }
}

class TextComponent extends Component {
  constructor(data) {
    super(data);
  }
  renderField(field) {
    if (field === "text") {
      this.node.textContent = this[field];
    } else {
      super.renderField(field);
    }
  }
}

class ImageComponent extends Component {
  constructor(data) {
    super(data);
  }
  renderField(field) {
    if (field === "img") {
      this.node.src = this[field];
    } else {
      super.renderField(field);
    }
  }
}

export { Component, TextComponent, ImageComponent };
