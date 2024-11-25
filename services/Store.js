import { Component, TextComponent, ImageComponent } from "./Component.js";
import getComponentData from "./ComponentData.js";

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

  get artboard() {
    return this.#artBoard;
  }
  setMainListeners() {
    document.getElementById("save")?.addEventListener("click", () => {
      this.sendData();
    });
    document.getElementById("add")?.addEventListener("click", () => {
      this.addElement();
    });
  }
  get elementsComponents() {
    return this.#elementsComponent;
  }
  appendComponentToStore(component) {
    this.elementsComponents.push(component);
  }
  getComponentById(id) {
    return this.elementsComponents.find(
      (component) => component.elem_id === id
    );
  }
  setArtboardField(field, value) {
    if (field.includes("screens") && typeof value === "string") {
      value = value.split(",").map((item) => parseInt(item, 10));
    }
    this.#artBoardData[field.replace("ab_", "")] = value;
    this.renderArtboard();
  }
  getArboardField(field) {
    return this.#artBoardData[field];
  }
  get screenList() {
    return this.getArboardField("screens");
  }
  get stringifyScreenList() {
    return this.screenList.join(", ");
  }
  pushScreenToList(screen) {
    if (this.screenList.includes(screen) || !parseInt(screen, 10)) return;
    const currentList = this.screenList;
    currentList.push(screen);
    currentList.sort((a, b) => a - b);
    this.setArtboardField("screens", currentList);
    window.dispatchEvent(new CustomEvent("breakpoints:set"));
  }
  processIncomeData(data) {
    Object.keys(data).forEach((key) => {
      if (key.startsWith("ab_")) {
        this.setArtboardField(key, data[key]);
      } else if (key !== "timestamp") {
        this.appendElement(this.createComponent(data[key]));
      }
    });
    const screenList = this.screenList;
    this.changeResolution(screenList[screenList.length - 1]); // set default resolution while open page
    window.dispatchEvent(new CustomEvent("breakpoints:set"));
    this.renderArtboard();
  }
  createComponent(data) {
    if (data.elem_type === "text") {
      return new TextComponent(data);
    } else if (data.elem_type === "image") {
      return new ImageComponent(data);
    }
    return new Component(data);
  }

  deleteLastComponent() {
    const lastComponent = this.elementsComponents.pop();
    lastComponent.node.remove();
  }

  /**
   * Нам некуда отправлять, поэтому пока выводим в консоль
   */
  sendData() {
    const artBoardData = {};
    Object.keys(this.#artBoardData).forEach((key) => {
      if (key === "screens") {
        artBoardData["ab_" + key] = this.stringifyScreenList;
      } else {
        artBoardData["ab_" + key] = this.#artBoardData[key];
      }
    });
    const data = {
      ...artBoardData,
      ...this.elementsComponents.reduce((acc, component) => {
        const clonedComponent = { ...component };
        delete clonedComponent.node;
        acc[component.elem_id] = clonedComponent;
        return acc;
      }, {}),
    };
    console.log(JSON.stringify(data));
  }
  get currentResolution() {
    return this.#currentResolution;
  }
  changeResolution(resolution) {
    const resolutionNumber = Number(resolution);
    if (!resolutionNumber || !this.screenList.includes(resolutionNumber)) {
      return;
    }
    this.#currentResolution = resolutionNumber;
    window.dispatchEvent(
      new CustomEvent("breakpoints:set-current-resolution", {
        detail: resolutionNumber,
      })
    );
    this.renderArtboardWidth();
  }
  renderArtboard() {
    this.artboard.style.backgroundColor = this.getArboardField("bgcolor");
    this.artboard.style.height = this.getArboardField("height") + "px";
    this.renderArtboardWidth();
  }
  renderArtboardWidth() {
    this.artboard.style.width = this.currentResolution + "px";
  }
  addElement() {
    const typeList = ["text", "shape", "image"];
    const newElementData = getComponentData(
      typeList[Math.floor(Math.random() * typeList.length)]
    );
    const newElement = this.createComponent(newElementData);
    this.appendElement(newElement);
  }
  appendElement(elementComponent) {
    const isImage = elementComponent.elem_type === "image";
    const element = document.createElement(isImage ? "img" : "div");
    element.classList.add("artboard__element");
    element.id = elementComponent.elem_id;
    elementComponent.setNode(element);
    elementComponent.renderAllFields();
    this.artboard.appendChild(element);
    this.appendComponentToStore(elementComponent);
  }
}

export default Store;
