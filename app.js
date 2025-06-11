// Lista de assuntos disponíveis
const subjects = [
  "Latim",
  "Geografia",
  "História",
  "Linha do tempo",
  "Ciências",
  "Português",
  "Matemática",
];

// Função para gerar um número aleatório entre min e max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para calcular o número de células por cartela
function calculateCellsPerCard(totalCombinations, numPlayers) {
  const minCellsPerCard = Math.max(
    9,
    Math.ceil(totalCombinations / numPlayers)
  );
  // Arredonda para o próximo múltiplo de 3
  return Math.ceil(minCellsPerCard / 3) * 3;
}

// Função para gerar todas as combinações possíveis de assuntos e semanas
function generateAllCombinations(numWeeks) {
  const combinations = [];
  for (const subject of subjects) {
    for (let week = 1; week <= numWeeks; week++) {
      combinations.push(`${subject} ${week}`);
    }
  }
  return combinations;
}

// Função para embaralhar um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para gerar uma cartela única
function generateUniqueCard(shuffledArray, cellsPerCard) {
  const card = [];
  for (let i = 0; i < cellsPerCard; i++) {
    if (shuffledArray.length > 0) {
      card.push(shuffledArray.pop());
    }
  }
  return card;
}

// Função para gerar o HTML da tabela da cartela
function generateCardTable(card, cellsPerCard) {
  const rows = Math.ceil(cellsPerCard / 3);
  let html = '<table class="w-full border-collapse table-fixed">';
  html += "<tbody>";

  for (let i = 0; i < rows; i++) {
    html += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const content = index < card.length ? card[index] : "";
      html += `<td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${content}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  return html;
}

// Função para validar todas as combinações
function validateAllCombinations(numWeeks) {
  const allPossibleCombinations = generateAllCombinations(numWeeks);
  const cards = document.querySelectorAll(".card-content");
  const foundCombinations = new Set();

  // Coleta todas as combinações presentes nas cartelas
  cards.forEach((card) => {
    const cells = card.querySelectorAll("td");
    cells.forEach((cell) => {
      const content = cell.textContent.trim();
      if (content) {
        foundCombinations.add(content);
      }
    });
  });

  // Verifica se todas as combinações possíveis estão presentes
  const missingCombinations = allPossibleCombinations.filter(
    (combination) => !foundCombinations.has(combination)
  );

  if (missingCombinations.length === 0) {
    alert("Todas as combinações possíveis estão presentes nas cartelas!");
  } else {
    alert(
      `Faltam ${
        missingCombinations.length
      } combinações:\n${missingCombinations.join("\n")}`
    );
  }
}

// Função para gerar todas as cartelas
function generateCards(numPlayers, numWeeks) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = ""; // Limpa o container

  // Gera todas as combinações possíveis
  const allCombinations = generateAllCombinations(numWeeks);
  const totalCombinations = allCombinations.length;
  const cellsPerCard = calculateCellsPerCard(totalCombinations, numPlayers);

  // Embaralha as combinações
  let shuffledArray = shuffleArray([...allCombinations]);

  // Se necessário, adiciona mais combinações aleatórias
  const totalNeededCombinations = cellsPerCard * numPlayers; // Total needed for all cards

  while (shuffledArray.length < totalNeededCombinations) {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomWeek = Math.floor(Math.random() * numWeeks) + 1;
    const newCombination = `${randomSubject} ${randomWeek}`;
    shuffledArray.push(newCombination);
  }

  const cards = [];

  // Gera as cartelas
  for (let i = 0; i < numPlayers; i++) {
    const card = generateUniqueCard(shuffledArray, cellsPerCard);
    cards.push(card);
  }

  // Cria o HTML para cada cartela
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className =
      "bg-white rounded-lg shadow-md p-4 card-content print:w-1/2 print:inline-block print:align-top";

    const cardHTML = `
            <h3 class="text-lg font-bold mb-4 text-center">Cartela do Jogador ${
              index + 1
            }</h3>
            <div class="border-2 border-gray-800 rounded-lg overflow-hidden">
                ${generateCardTable(card, cellsPerCard)}
            </div>
        `;

    cardElement.innerHTML = cardHTML;
    cardsContainer.appendChild(cardElement);
  });

  // Adiciona informações sobre as combinações disponíveis
  const infoElement = document.createElement("div");
  infoElement.className =
    "mt-8 p-4 bg-white rounded-lg shadow-md print:!hidden"; // Hide info section when printing
  infoElement.innerHTML = `
        <h4 class="text-lg font-bold mb-2">Informações:</h4>
        <p>Total de combinações possíveis: ${totalCombinations}</p>
        <p>Combinações por cartela: ${cellsPerCard}</p>
        <p>Número de cartelas geradas: ${numPlayers}</p>
        <p>Número de linhas por cartela: ${Math.ceil(cellsPerCard / 3)}</p>
        <div class="flex gap-4 mt-4">
          <button id="validateBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Validar Combinações
          </button>
        </div>
    `;
  // Só adiciona o infoElement se houver o parâmetro 'dev' na URL
  if (new URLSearchParams(window.location.search).has("dev")) {
    cardsContainer.appendChild(infoElement);
  }

  // Adiciona o event listener para o botão de validação
  const validateBtn = document.getElementById("validateBtn");
  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      validateAllCombinations(numWeeks);
    });
  }

  // Enable print button after cards are generated
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.disabled = false;
    printBtn.classList.remove(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const numPlayersInput = document.getElementById("numPlayers");
  const numWeeksInput = document.getElementById("numWeeks");
  const printBtn = document.getElementById("printBtn");

  // Initially disable print button
  if (printBtn) {
    printBtn.disabled = true;
    printBtn.classList.add(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  }

  generateBtn.addEventListener("click", () => {
    const numPlayers = parseInt(numPlayersInput.value);
    const numWeeks = parseInt(numWeeksInput.value);

    if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 100) {
      alert("Por favor, insira um número válido de jogadores (1-100)");
      return;
    }

    if (isNaN(numWeeks) || numWeeks < 1 || numWeeks > 24) {
      alert("Por favor, insira um número válido de semanas (1-24)");
      return;
    }

    generateCards(numPlayers, numWeeks);
  });

  // Add print button event listener
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
