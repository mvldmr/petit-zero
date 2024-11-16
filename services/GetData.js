import API from "./API.js";

export async function loadData() {
  return await API.fetchData();
}
