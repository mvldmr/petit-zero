import { loadData } from "./services/GetData.js";
import { Breakpoints } from "./components/Breakpoints.js";
import Router from "./services/Router.js";
import Store from "./services/Store.js";

window.addEventListener("DOMContentLoaded", () => {
  window.tn = {};
  window.tn.store = new Store();
  window.tn.store.setMainListeners();
  window.tn.router = Router;
  loadData().then((data) => {
    window.tn.store.processIncomeData(data);
    window.tn.router.init();
  });
});
