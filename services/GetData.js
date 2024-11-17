async function fetchData(url) {
  const result = await fetch(url);
  if (!result.ok) throw new Error("Failed to fetch data");
  return await result.json();
}

export async function loadData() {
  return await fetchData("/data/zero.json");
}
