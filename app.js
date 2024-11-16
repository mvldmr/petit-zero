import Store from "./services/Store.js";
import { loadData } from "./services/GetData.js";
import Router from "./services/Router.js";
import { Breakpoints } from "./components/Breakpoints.js";

window.addEventListener("DOMContentLoaded", () => {
  window.tn = {};
  window.tn.store = new Store();
  window.tn.router = Router;
  window.tn.router.init();
  loadData().then((data) => {
    window.tn.store.processIncomeData(data);
    window.dispatchEvent(new CustomEvent("breakpoints:data-updated"));
  });

  document.getElementById("send")?.addEventListener("click", () => {
    window.tn.store.sendData();
  });
  document.getElementById("add")?.addEventListener("click", () => {
    window.tn.store.addElement();
  });
});
