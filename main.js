let products = [];
let currentPage = 1;
let pageSize = 5;
let sortPriceAsc = true;
let sortTitleAsc = true;

document.addEventListener("DOMContentLoaded", () => {
  getAll();

  document.getElementById("searchTxt").addEventListener("input", renderTable);
  document.getElementById("pageSize").addEventListener("change", (e) => {
    pageSize = Number(e.target.value);
    currentPage = 1;
    renderTable();
  });
});

async function getAll() {
  let res = await fetch("https://api.escuelajs.co/api/v1/products");
  products = await res.json();
  renderTable();
}

function renderTable() {
  let keyword = document.getElementById("searchTxt").value.toLowerCase();

  let filtered = products.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  let start = (currentPage - 1) * pageSize;
  let end = start + pageSize;
  let pageData = filtered.slice(start, end);

  let body = document.getElementById("table-body");
  body.innerHTML = "";

  for (let p of pageData) {
    body.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.price}</td>
        <td>
          <img src="${p.images[0]}" />
        </td>
      </tr>
    `;
  }

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} / ${Math.ceil(filtered.length / pageSize)}`;
}

function nextPage() {
  currentPage++;
  renderTable();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function sortByPrice() {
  products.sort((a, b) =>
    sortPriceAsc ? a.price - b.price : b.price - a.price
  );
  sortPriceAsc = !sortPriceAsc;
  renderTable();
}

function sortByTitle() {
  products.sort((a, b) =>
    sortTitleAsc
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
  sortTitleAsc = !sortTitleAsc;
  renderTable();
}
