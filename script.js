// script.js (cargar JSON, mostrar todos los libros al inicio, filtros y modal Bootstrap)
// Asegúrate de tener books.json en la misma carpeta.

let books = [];
const resultsDiv = document.getElementById("results");
const bootstrapModal = new bootstrap.Modal(document.getElementById('book-modal'));
const modalTitle = document.getElementById("bookModalLabel");
const modalCover = document.getElementById("modal-cover");
const modalAuthor = document.getElementById("modal-author");
const modalGenre = document.getElementById("modal-genre");
const modalMood = document.getElementById("modal-mood");
const modalLength = document.getElementById("modal-length");
const modalAmazon = document.getElementById("modal-amazon");

// listeners para radios (filtros)
document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener("change", updateResults));

// filtrar y mostrar
function updateResults() {
  const mood = document.querySelector('input[name="mood"]:checked')?.value;
  const genre = document.querySelector('input[name="genre"]:checked')?.value;
  const length = document.querySelector('input[name="length"]:checked')?.value;

  const filtered = books.filter(b => {
    const m = !mood || b.mood === mood;
    const g = !genre || b.genre === genre;
    const l = !length || b.length === length;
    return m && g && l;
  });

  displayResults(filtered);
}

function displayResults(list) {
  resultsDiv.innerHTML = "";
  if (!list || list.length === 0) {
    resultsDiv.innerHTML = '<div class="col-12"><p>No se encontraron libros con esas preferencias.</p></div>';
    return;
  }

  // crear columnas bootstrap por cada libro
  list.forEach(book => {
    const col = document.createElement('div');
    col.className = 'col-6 col-sm-4 col-md-3 col-lg-2';

    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="${escapeHtml(book.title)}">
      <button class="card-overlay-btn">Ver libro</button>
    `;

    col.appendChild(card);
    resultsDiv.appendChild(col);

    // evento abrir modal
    card.querySelector('.card-overlay-btn').addEventListener('click', () => {
      modalTitle.textContent = book.title;
      modalCover.src = book.cover;
      modalAuthor.textContent = 'Autor: ' + book.author;
      modalGenre.textContent = 'Género: ' + book.genre;
      modalMood.textContent = 'Estado de ánimo: ' + book.mood;
      modalLength.textContent = 'Longitud: ' + book.length;
      modalAmazon.href = book.amazon;
      // botón de Amazon se estiliza como outline claro para que contraste sobre fondo blanco
      modalAmazon.className = 'btn btn-sm btn-outline-primary';
      bootstrapModal.show();
    });
  });
}

// carga JSON
fetch('books.json')
  .then(r => {
    if (!r.ok) throw new Error('No se pudo cargar books.json');
    return r.json();
  })
  .then(data => {
    books = data;
    displayResults(books); // mostrar todos al inicio
  })
  .catch(err => {
    console.error('Error cargando libros:', err);
    resultsDiv.innerHTML = '<div class="col-12"><p>Error cargando libros. Revisa books.json</p></div>';
  });

// helper para escapar texto en inserciones (seguridad XSS básica)
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}


