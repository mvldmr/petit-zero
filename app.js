import { loadData } from "./services/GetData.js";
import { Breakpoints } from "./components/Breakpoints.js";
import Router from "./services/Router.js";
import Store from "./services/Store.js";

window.addEventListener("DOMContentLoaded", () => {
  window.tn = {};
  window.tn.store = new Store();
  window.tn.router = Router;
  loadData().then((data) => {
    window.tn.store.processIncomeData(data);
    window.tn.router.init();
  });

  document.getElementById("send")?.addEventListener("click", () => {
    window.tn.store.sendData();
  });
  document.getElementById("add")?.addEventListener("click", () => {
    window.tn.store.addElement();
  });
});
