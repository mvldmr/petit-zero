class Component {
  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
  setNode() {
    this.node = document.getElementById(this.elem_id);
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

class Store {
  #artBoard;
  #currentResolution;
  #artBoardData;
  #elementsComponent;

  constructor() {
    this.#artBoard = document.getElementById("artboard");
    this.#currentResolution;
    this.#artBoardData = {};
    this.#elementsComponent = [];
  }

  getArtboard() {
    return this.#artBoard;
  }
  getElementsComponents() {
    return this.#elementsComponent;
  }
  appendComponentToStore(component) {
    this.getElementsComponents().push(component);
  }
  getComponentById(id) {
    return this.getElementsComponents().find(
      (component) => component.elem_id === id
    );
  }
  setArtboardField(field, value) {
    this.#artBoardData[field.replace("ab_", "")] = value;
  }
  getArboardField(field) {
    return this.#artBoardData[field];
  }
  getScreenList() {
    return this.getArboardField("screens");
  }
  pushScreenToList(screen) {
    if (this.getScreenList().includes(screen) || !parseInt(screen, 10)) return;
    const currentList = this.getScreenList();
    currentList.push(screen);
    currentList.sort((a, b) => a - b);
    this.setArtboardField("screens", currentList);
    window.dispatchEvent(new CustomEvent("breakpoints:data-updated"));
  }
  processIncomeData(data) {
    Object.keys(data).forEach((key) => {
      if (key.startsWith("ab_")) {
        this.setArtboardField(key, data[key]);
      } else if (key !== "timestamp") {
        this.appendComponentToStore(this.createComponent(data[key]));
      }
    });
    const screenList = this.getScreenList();
    this.changeResolution(screenList[screenList.length - 1]);
    this.renderState();
  }
  createComponent(data) {
    if (data.elem_type === "text") {
      return new TextComponent(data);
    } else if (data.elem_type === "image") {
      return new ImageComponent(data);
    }
    return new Component(data);
  }

  /**
   * Нам некуда отправлять, поэтому пока выводим в консоль
   */
  sendData() {
    const data = {
      ...this.#artBoardData,
      ...this.getElementsComponents().reduce((acc, component) => {
        const clonedComponent = { ...component };
        delete clonedComponent.node;
        acc[component.elem_id] = clonedComponent;
        return acc;
      }, {}),
    };
    console.log(JSON.stringify(data));
  }
  getCurrentResolution() {
    return this.#currentResolution;
  }
  setCurrentResolution(value) {
    this.#currentResolution = value;
  }
  changeResolution(resolution) {
    const resolutionNumber = Number(resolution);
    if (!resolutionNumber || !this.getScreenList().includes(resolutionNumber)) {
      return false;
    }
    this.setCurrentResolution(resolution);
    this.renderArtboardWidth();
    return true;
  }
  renderState() {
    this.getArtboard().style.backgroundColor = this.getArboardField("bgcolor");
    this.getArtboard().style.height = this.getArboardField("height") + "px";
    this.getElementsComponents().forEach((elementComponent) => {
      this.appendElement(elementComponent);
    });
    this.renderArtboardWidth();
  }
  renderArtboardWidth() {
    this.getArtboard().style.width = this.getCurrentResolution() + "px";
  }
  appendElement(elementComponent) {
    const isImage = elementComponent.elem_type === "image";
    const element = document.createElement(isImage ? "img" : "div");
    element.classList.add("artboard__element");
    element.id = elementComponent.elem_id;
    this.getArtboard().appendChild(element);
    elementComponent.setNode();
    elementComponent.renderAllFields();
  }
}

export default Store;
