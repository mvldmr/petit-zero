export class Breakpoints extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    window.addEventListener("breakpoints:data-updated", () => {
      this.render();
    });
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (!window.tn.store.getScreenList()) {
          this.renderError();
        }
      }, 5_000);
    });
  }

  render() {
    const screenList = window.tn.store.getScreenList();
    if (!screenList) return;
    this.shadowRoot.innerHTML = `
        <style>
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
        </style>
        
        <div class="button-wrapper">
        ${screenList
          .map((screen) => {
            const isActivated =
              screen === window.tn.store.getCurrentResolution();
            const classValue = isActivated ? 'class="active"' : "";
            return `<button ${classValue} data-screen="${screen}">${screen}</button>`;
          })
          .join("")}
        </div>
      `;
    const buttons = this.shadowRoot.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("active")) return;
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        window.tn.store.changeResolution(button.dataset.screen);
      });
    });
  }
  renderError() {
    this.shadowRoot.innerHTML = `
        <div style="display:flex;align-items:center;height:100%;">Данные не были получены</div>
      `;
  }
}

customElements.define("zero-breakpoints", Breakpoints);
