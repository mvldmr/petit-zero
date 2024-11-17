export class Breakpoints extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    window.addEventListener("breakpoints:data-updated", () => {
      this.setAttribute("screens", window.tn.store.getScreenList().join(", "));
    });
  }

  /**
   * @description This method is called when the component is connected to the DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * @description This method is init observer for list of the attributes in our component.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ["screens"];
  }

  /**
   * @description This method is called when one of the attributes in the observedAttributes list is changed.
   * @param {'screen'} name
   */
  attributeChangedCallback(name) {
    if (name === "screens") this.render();
  }

  getScreenList() {
    const screenAttribute = this.getAttribute("screens");
    if (!screenAttribute) return [];
    return screenAttribute.split(", ");
  }

  getButtonComponent(screen) {
    const button = document.createElement("button");
    button.textContent = screen;
    button.dataset.screen = screen;
    const isActive =
      Number(screen) === Number(window.tn.store.getCurrentResolution());
    if (isActive) button.classList.add("active");
    button.addEventListener("click", () => {
      if (button.classList.contains("active")) return;
      button.parentElement.childNodes.forEach((btn) =>
        btn.classList.remove("active")
      );
      button.classList.add("active");
      window.tn.store.changeResolution(button.dataset.screen);
    });
    return button;
  }

  getButtonStyles() {
    const screenList = this.getScreenList();
    if (!screenList.length) {
      return `<style>p{height: 100%; display: flex; align-items: center;}</style>`;
    }
    return `<style>
              .button-wrapper {
                display: flex;
                justify-content: center;
                column-gap: 8px;
              }
              button {
                font-size: 16px;
                color: #333;
                padding: 8px;
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin: 0;
                cursor: pointer;
                transition: 0.2s ease all;
                &:hover {
                  background-color: #e5e5e5;
                }
                &.active {
                background: #858484;
                color: white;
                }
              }
          </style>`;
  }

  render() {
    this.shadowRoot.innerHTML = `
        ${this.getButtonStyles()}
        <div class="button-wrapper"></div>
      `;

    const buttonWrapper = this.shadowRoot.querySelector(".button-wrapper");
    const buttons = this.getScreenList().map(this.getButtonComponent);
    if (buttons.length) {
      buttonWrapper.append(...buttons);
    } else {
      buttonWrapper.innerHTML = "<p>No breakpoints</p>";
    }
  }
}

customElements.define("zero-breakpoints", Breakpoints);
