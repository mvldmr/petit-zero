async function fetchData(url) {
  const result = await fetch(url);
  return await result.json();
}

export async function loadData() {
  return await fetchData("/data/zero.json");
}
