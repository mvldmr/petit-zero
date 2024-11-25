export class Breakpoints extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    window.addEventListener("breakpoints:set", () => {
      const { store } = window.tn;
      this.setAttribute("screens", store.stringifyScreenList);
      this.setAttribute("current-resolution", store.currentResolution);
    });

    window.addEventListener("breakpoints:set-current-resolution", (event) => {
      this.setAttribute("current-resolution", event.detail);
    });

    window.addEventListener("load", () => {
      setTimeout(() => {
        if (this.getAttribute("screens")) return;
        this.render();
      }, 2_000);
    });
  }

  /**
   * @description This method is called when the component is connected to the DOM.
   */
  connectedCallback() {
    // this.render();
  }

  /**
   * @description This method is init observer for list of the attributes in our component.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ["screens", "current-resolution"];
  }

  /**
   * @description This method is called when one of the attributes in the observedAttributes list is changed.
   * @param {'screen' | 'current-resolution'} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-resolution") this.update();
    if (!oldValue && !newValue) return;
    if (name === "screens") this.render();
  }

  getScreenList() {
    const screenAttribute = this.getAttribute("screens");
    if (!screenAttribute) return [];
    return screenAttribute.split(", ").map(Number);
  }

  getButtonComponent(screen) {
    const button = document.createElement("button");
    button.textContent = screen;
    button.dataset.screen = screen;
    button.addEventListener("click", () => {
      if (button.classList.contains("active")) return;
      window.tn.store.changeResolution(screen);
    });
    return button;
  }

  getComponentStyles() {
    const screenList = this.getScreenList();
    if (!screenList.length) {
      return `<style>
                p { 
                  height: 100%;
                  display: flex;
                  align-items: center;
                  margin:0;
                  @media (prefers-color-scheme: dark) {
                      color: #e1e1e1;  
                  }
                }
              </style>`;
    }
    return `<style>
              .button-wrapper {
                display: flex;
                justify-content: center;
                column-gap: 8px;
                @media (max-width: 1200px) {
                    column-gap: 4px;
                }
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
                  background-color: #858484;
                  color: white;
                }
                @media (max-width: 1200px) {
                    padding: 4px;
                    font-size: 12px;
                }
                @media (prefers-color-scheme: dark) {
                    background-color: #4b4b4b;
                    color: #e1e1e1;
                    border: 1px solid #333;
                    &:hover {
                      background-color: #171717;
                    }
                    &.active {
                      background-color: #1f1f1f;
                      color: #cecdcd;
                    }
                }
              }
          </style>`;
  }

  render() {
    this.shadowRoot.innerHTML = `
        ${this.getComponentStyles()}
        <div class="button-wrapper" style="height: 100%;"></div>
      `;

    const buttonWrapper = this.shadowRoot.querySelector(".button-wrapper");
    const buttons = this.getScreenList().map(this.getButtonComponent);
    if (buttons.length) {
      buttonWrapper.append(...buttons);
    } else {
      buttonWrapper.innerHTML = "<p>No breakpoints</p>";
    }
  }
  update() {
    const currentResolution = this.getAttribute("current-resolution");
    const buttons = this.shadowRoot.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.dataset.screen === currentResolution) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
}

customElements.define("zero-breakpoints", Breakpoints);
