let books = []; // Aquí se cargarán los libros desde books.json
const resultsDiv = document.getElementById("results");

// Seleccionamos todos los radio buttons
const radios = document.querySelectorAll('input[type="radio"]');

// Agregamos un listener a cada radio button para actualizar resultados automáticamente
radios.forEach(radio => {
  radio.addEventListener("change", updateResults);
});

// Función para actualizar los resultados según los filtros seleccionados
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

// Función para mostrar los resultados en pantalla
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
      <p><strong>${book.title}</strong></p>
      <p><em>${book.author}</em></p>
      <a href="${book.amazon}" target="_blank">Comprar en Amazon</a>
    `;
    resultsDiv.appendChild(card);
  });
}

// Cargar libros desde books.json
fetch("books.json")
  .then(response => response.json())
  .then(data => {
    books = data;
    displayResults(books); // Mostrar todos los libros al inicio
  })
  .catch(err => {
    console.error("Error cargando libros:", err);
    resultsDiv.innerHTML = "<p>Error cargando libros. Revisa el archivo books.json.</p>";
  });
