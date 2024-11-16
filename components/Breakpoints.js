export class Breakpoints extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    window.addEventListener("breakpoints:data-loaded", () => {
      this.render();
    });
  }

  render() {
    if (window.tn.store.getScreenList()) {
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

<!--        <link rel="stylesheet" href="components/Breakpoints.css">-->
        
        <div class="button-wrapper">
        ${window.tn.store
          .getScreenList()
          .map((screen) => {
            const isActivated =
              screen === window.tn.store.getCurrentResolution();
            const classValue = isActivated ? 'class="active"' : "";
            return `<button ${classValue} data-screen="${screen}">${screen}</button>`;
          })
          .join("")}
        </div>
      `;
      this.shadowRoot.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          if (button.classList.contains("active")) return;
          this.shadowRoot
            .querySelectorAll("button")
            .forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          window.tn.store.changeResolution(button.dataset.screen);
        });
      });
    }
  }
}

customElements.define("zero-breakpoints", Breakpoints);
