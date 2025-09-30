
const getData = async () => {
  const data = await apiFetch('http://localhost:8080/professional');
  displayAllData(data);
};