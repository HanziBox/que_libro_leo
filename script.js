let books = [];
const resultsDiv = document.getElementById("results");

const radios = document.querySelectorAll('input[type="radio"]');
radios.forEach(radio => {
  radio.addEventListener("change", updateResults);
});

function updateResults() {
  const mood = document.querySelector('input[name="mood"]:checked')?.value;
  const genre = document.querySelector('input[name="genre"]:checked')?.value;
  const length = document.querySelector('input[name="length"]:checked')?.value;

  const filtered = books.filter(book => 
    (!mood || book.mood === mood) &&
    (!genre || book.genre === genre) &&
    (!length || book.length === length)
  );

  displayResults(filtered);
}

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
      <button class="view-btn">Ver libro</button>
    `;
    resultsDiv.appendChild(card);

    // Modal
    const modal = document.getElementById("book-modal");
    const closeBtn = modal.querySelector(".close");

    card.querySelector(".view-btn").addEventListener("click", () => {
      modal.style.display = "block";
      document.getElementById("modal-title").textContent = book.title;
      document.getElementById("modal-author").textContent = "Autor: " + book.author;
      document.getElementById("modal-genre").textContent = "Género: " + book.genre;
      document.getElementById("modal-mood").textContent = "Estado de ánimo: " + book.mood;
      document.getElementById("modal-length").textContent = "Longitud: " + book.length;
      document.getElementById("modal-amazon").href = book.amazon;
    });

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = e => { if(e.target == modal) modal.style.display = "none"; }
  });
}

// Cargar libros desde JSON
fetch("books.json")
  .then(response => response.json())
  .then(data => {
    books = data;
    displayResults(books);
  })
  .catch(err => {
    console.error("Error cargando libros:", err);
    resultsDiv.innerHTML = "<p>Error cargando libros. Revisa el archivo books.json.</p>";
  });
