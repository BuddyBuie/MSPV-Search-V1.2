const table = document.querySelector("#output");
const searchInput = document.querySelector("#search");

const ROWS_PER_PAGE = 5000;
const DATA_URL = 'https://raw.githubusercontent.com/BuddyBuie/Formulary-Json/main/Formulary12-19-23%203.json';

let currentPage = 0;
let allData = [];

function fetchData(url) {
  return fetch(url).then(res => res.json());
}

function renderTable(data, startIndex, endIndex) {
  const rows = data.slice(startIndex, endIndex).map(row => {
    return `
      <tr>
        <td>${row.Medline_PVON}</td>
        <td>${row.Short_Description}</td>
        <td>${row.OEM_Part_Num}</td>
        <td>${row.UOP}</td>
        <td>${row.Quantity_per_UOP}</td>
        <td>${row.Price_per_UOP}</td>
        <td>${row.Dropship_Only}</td>
      </tr>
    `;
  }).join('');

  table.querySelector("tbody").innerHTML += rows;
}

function loadMore() {
  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = (currentPage + 1) * ROWS_PER_PAGE;

  renderTable(allData, startIndex, endIndex);

  currentPage++;
}

function search() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  currentPage = 0;
  table.querySelector("tbody").innerHTML = '';

  const filteredData = allData.filter(row => {
    const medline_pvon = row.Medline_PVON.toString().toLowerCase();
    const short_description = row.Short_Description.toString().toLowerCase();
    const oem_part_num = row.OEM_Part_Num.toString().toLowerCase();
    

    return (
      medline_pvon.includes(searchTerm) ||
      short_description.includes(searchTerm) ||
      oem_part_num.includes(searchTerm) 
    );
  });

  renderTable(filteredData, 0, ROWS_PER_PAGE);
  currentPage++;
}

function init() {
  fetchData(DATA_URL).then(data => {
    allData = data;
    renderTable(allData, 0, ROWS_PER_PAGE);
    currentPage++;
  });

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore();
    }
  });

  searchInput.addEventListener('input', debounce(search, 300)); // Add a debounce function to delay the search execution.
}

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

window.onload = init;
