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

// Escuchar cambios en los filtros
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener("change", updateResults);
});

// Función para filtrar y mostrar libros según filtros
function updateResults() {
  const mood = document.querySelector('input[name="mood"]:checked')?.value;
  const genre = document.querySelector('input[name="genre"]:checked')?.value;
  const length = document.querySelector('input[name="length"]:checked')?.value;

  const filtered = books.filter(book => {
    const moodMatch = !mood || book.mood === mood;
    const genreMatch = !genre || book.genre === genre;
    const lengthMatch = !length || book.length === length;
    return moodMatch && genreMatch && lengthMatch;
  });

  displayResults(filtered);
}

// Función para renderizar libros
function displayResults(filteredBooks) {
  resultsDiv.innerHTML = "";
  if (filteredBooks.length === 0) {
    resultsDiv.innerHTML = "<p>No se encontraron libros con esas preferencias.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <button class="view-btn btn btn-sm">Ver libro</button>
    `;
    resultsDiv.appendChild(card);

    // Evento para mostrar modal
    card.querySelector(".view-btn").addEventListener("click", () => {
      modalTitle.textContent = book.title;
      modalCover.src = book.cover;
      modalAuthor.textContent = "Autor: " + book.author;
      modalGenre.textContent = "Género: " + book.genre;
      modalMood.textContent = "Estado de ánimo: " + book.mood;
      modalLength.textContent = "Longitud: " + book.length;
      modalAmazon.href = book.amazon;
      bootstrapModal.show();
    });
  });
}

// Cargar JSON de libros
fetch("books.json")
  .then(res => res.json())
  .then(data => {
    books = data;
    displayResults(books);  // <-- mostrar todos al inicio
  })
  .catch(err => console.error("Error cargando libros:", err));
