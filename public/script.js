
const getData = async () => {
  const apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/professional'  
    : '/professional';
  
  const data = await apiFetch(apiUrl);
  displayAllData(data);
};