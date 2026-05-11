/**
 * ===================================
 * SATIN DREAMS — script.js
 * Katalog ženskih satenskih pidžama
 * ===================================
 */

// --- DOM reference ---
const productsGrid   = document.getElementById('productsGrid');
const loadingState   = document.getElementById('loadingState');
const errorState     = document.getElementById('errorState');
const errorMessage   = document.getElementById('errorMessage');

/**
 * Prikazuje loading indikator i sakriva grid
 */
function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  productsGrid.innerHTML = '';
}

/**
 * Sakriva loading indikator
 */
function hideLoading() {
  loadingState.classList.add('hidden');
}

/**
 * Prikazuje poruku o grešci
 * @param {string} poruka - Tekst greške
 */
function showError(poruka) {
  hideLoading();
  errorState.classList.remove('hidden');
  errorMessage.textContent = poruka;
}

/**
 * Kreira HTML karticu za jedan proizvod
 * @param {Object} proizvod - Objekat sa podacima o pidžami
 * @returns {HTMLElement} - DOM element kartice
 */
function kreirajKarticu(proizvod) {
  // Kreira kontejner kartice
  const kartica = document.createElement('article');
  kartica.className = 'product-card';
  kartica.setAttribute('data-id', proizvod.id);

  // Generiše HTML za listu veličina
  const velicineHTML = proizvod.velicine
    .map(vel => `<li class="velicina-tag" title="Veličina ${vel}">${vel}</li>`)
    .join('');

  // Popunjava HTML kartice
  kartica.innerHTML = `
    <!-- Slika sa badge-om -->
    <div class="card-image-wrap">
      <img
        src="${proizvod.slika}"
        alt="${proizvod.naziv} — satenska pidžama"
        loading="lazy"
        //onerror="this.src='https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80'"
      />
      <span class="card-badge">№ ${String(proizvod.id).padStart(2, '0')}</span>
    </div>

    <!-- Tijelo kartice -->
    <div class="card-body">
      <!-- Naziv modela -->
      <h2 class="card-naziv">${proizvod.naziv}</h2>
      <p class="card-opis">${proizvod.opis}</p>

      <!-- Dostupne veličine -->
      <p class="card-velicine-label">Dostupne veličine</p>
      <ul class="velicine-lista" aria-label="Dostupne veličine: ${proizvod.velicine.join(', ')}">
        ${velicineHTML}
      </ul>

      <div class="card-separator"></div>

      <!-- Footer kartice: ID i akcija -->
      
    </div>
  `;

  return kartica;
}

/**
 * Renderuje sve proizvode u grid
 * @param {Array} proizvodi - Niz objekata proizvoda
 */
function renderujProizvode(proizvodi) {
  // Čisti grid
  productsGrid.innerHTML = '';

  if (!Array.isArray(proizvodi) || proizvodi.length === 0) {
    showError('Nije pronađen nijedan proizvod.');
    return;
  }

  // Dodaje svaku karticu u grid
  proizvodi.forEach(proizvod => {
    const kartica = kreirajKarticu(proizvod);
    productsGrid.appendChild(kartica);
  });
}

/**
 * Učitava proizvode iz products.json pomoću fetch API-ja
 */
async function ucitajProizvode() {
  showLoading();

  try {
    // Minimalni delay da se loading animacija vidi (opciono)
    const [response] = await Promise.all([
      fetch('products.json'),
      new Promise(res => setTimeout(res, 600)) // 600ms UI delay
    ]);

    if (!response.ok) {
      throw new Error(`HTTP greška: ${response.status}`);
    }

    const proizvodi = await response.json();

    hideLoading();
    renderujProizvode(proizvodi);

  } catch (greska) {
    console.error('Greška pri učitavanju proizvoda:', greska);

    // Fallback: prikazuje demo podatke ako fetch ne radi lokalno
    const demoProizvodi = getDemoProizvodi();
    hideLoading();
    renderujProizvode(demoProizvodi);
  }
}

/**
 * Demo podaci kao fallback (za slučaj da fetch ne radi u file:// protokolu)
 * @returns {Array} - Niz demo proizvoda
 */
function getDemoProizvodi() {
  return [
    {
      id: 1,
      naziv: "Noir Élégance",
      opis: "Crna satenska pidžama sa zlatnim detaljima",
      velicine: ["XS", "S", "M", "L", "XL"],
      slika: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"
    },
    {
      id: 2,
      naziv: "Rose Poudré",
      opis: "Puder roze satenska pidžama sa čipkastim rubovima",
      velicine: ["S", "M", "L"],
      slika: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=600&q=80"
    },
    {
      id: 3,
      naziv: "Ivory Reverie",
      opis: "Bjelokosna satenska pidžama sa perlastim sjajem",
      velicine: ["XS", "S", "M", "L", "XL", "XXL"],
      slika: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
    }
  ];
}

// --- Pokretanje aplikacije kad se DOM učita ---
document.addEventListener('DOMContentLoaded', ucitajProizvode);
