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
    12,
    Math.ceil(totalCombinations / numPlayers)
  );
  // Arredonda para o próximo múltiplo de 3
  return Math.ceil(minCellsPerCard / 3) * 3;
}

// Função para gerar todas as combinações possíveis de assuntos e semanas
function generateAllCombinations(initialWeek, finalWeek) {
  const combinations = [];
  for (const subject of subjects) {
    for (let week = initialWeek; week <= finalWeek; week++) {
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
function generateUniqueCard(
  availableCombinations,
  cellsPerCard,
  initialWeek,
  finalWeek
) {
  const card = [];
  const usedInCard = new Set();

  // Create a copy of available combinations to avoid modifying the original
  const remainingCombinations = [...availableCombinations];

  for (let i = 0; i < cellsPerCard; i++) {
    let selectedCombination;

    // Try to find an unused combination from the available list
    if (remainingCombinations.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * remainingCombinations.length
      );
      selectedCombination = remainingCombinations[randomIndex];
      remainingCombinations.splice(randomIndex, 1);
    } else {
      // If no more combinations available, generate a random one
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomWeek =
        Math.floor(Math.random() * (finalWeek - initialWeek + 1)) + initialWeek;
      selectedCombination = `${randomSubject} ${randomWeek}`;
    }

    // Ensure this combination hasn't been used in this specific card
    while (usedInCard.has(selectedCombination)) {
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomWeek =
        Math.floor(Math.random() * (finalWeek - initialWeek + 1)) + initialWeek;
      selectedCombination = `${randomSubject} ${randomWeek}`;
    }

    card.push(selectedCombination);
    usedInCard.add(selectedCombination);
  }

  return card;
}

// Função para gerar o HTML da tabela da cartela
function generateCardTable(card, cellsPerCard, maxColumns = 3) {
  const rows = Math.ceil(cellsPerCard / maxColumns);
  let html = '<table class="w-full border-collapse table-fixed">';
  html += "<tbody>";

  for (let i = 0; i < rows; i++) {
    html += "<tr>";
    for (let j = 0; j < maxColumns; j++) {
      const index = i * maxColumns + j;
      const content = index < card.length ? card[index] : "";
      html += `<td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${content}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  return html;
}

// Função para validar todas as combinações
function validateAllCombinations(initialWeek, finalWeek) {
  const allPossibleCombinations = generateAllCombinations(
    initialWeek,
    finalWeek
  );
  const cards = document.querySelectorAll(".card-content");
  const foundCombinations = new Set();
  let validationResults = [];

  // Verifica cada cartela individualmente para duplicatas
  cards.forEach((card, cardIndex) => {
    const cells = card.querySelectorAll("td");
    const cardCombinations = new Set();
    const duplicatesInCard = [];

    cells.forEach((cell) => {
      const content = cell.textContent.trim();
      if (content) {
        if (cardCombinations.has(content)) {
          duplicatesInCard.push(content);
        } else {
          cardCombinations.add(content);
        }
        foundCombinations.add(content);
      }
    });

    if (duplicatesInCard.length > 0) {
      validationResults.push(
        `Cartela ${
          cardIndex + 1
        }: Encontradas duplicatas: ${duplicatesInCard.join(", ")}`
      );
    }
  });

  // Verifica se todas as combinações possíveis estão presentes
  const missingCombinations = allPossibleCombinations.filter(
    (combination) => !foundCombinations.has(combination)
  );

  // Monta a mensagem final
  let finalMessage = "";

  if (validationResults.length > 0) {
    finalMessage += "PROBLEMAS ENCONTRADOS:\n\n";
    finalMessage += validationResults.join("\n");
    finalMessage += "\n\n";
  }

  if (missingCombinations.length === 0) {
    finalMessage +=
      "✅ Todas as combinações possíveis estão presentes nas cartelas!";
  } else {
    finalMessage += `❌ Faltam ${
      missingCombinations.length
    } combinações:\n${missingCombinations.join("\n")}`;
  }

  if (validationResults.length === 0 && missingCombinations.length === 0) {
    finalMessage =
      "✅ VALIDAÇÃO COMPLETA: Todas as cartelas estão corretas!\n- Nenhuma duplicata encontrada\n- Todas as combinações possíveis estão presentes";
  }

  alert(finalMessage);
}

function renderPlayerCards(
  cards,
  cellsPerCard,
  cardsContainer,
  maxColumns = 3,
  isFullCard = false
) {
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = isFullCard
      ? "bg-white rounded-lg shadow-md p-4 card-content full-card-print"
      : "bg-white rounded-lg shadow-md p-4 card-content print:w-1/2 print:inline-block print:align-top";

    const cardHTML = `
      <h3 class="text-lg font-bold mb-4 text-center">${
        isFullCard ? "Fichas" : `Cartela do Jogador ${index + 1}`
      }</h3>
      <div class="border-2 border-gray-800 rounded-lg overflow-hidden">
        ${generateCardTable(card, cellsPerCard, maxColumns)}
      </div>
    `;

    cardElement.innerHTML = cardHTML;
    cardsContainer.appendChild(cardElement);
  });
}

// Função para gerar todas as cartelas
function generateCards(numPlayers, initialWeek, finalWeek) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = ""; //
  const fullCardContainer = document.getElementById("fullCardContainer");
  fullCardContainer.innerHTML = "";

  // Gera todas as combinações possíveis
  const allCombinations = generateAllCombinations(initialWeek, finalWeek);
  const totalCombinations = allCombinations.length;
  const cellsPerCard = calculateCellsPerCard(totalCombinations, numPlayers);

  // Embaralha as combinações
  let shuffledArray = shuffleArray([...allCombinations]);

  // Se necessário, adiciona mais combinações aleatórias
  const totalNeededCombinations = cellsPerCard * numPlayers; // Total needed for all cards

  while (shuffledArray.length < totalNeededCombinations) {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomWeek =
      Math.floor(Math.random() * (finalWeek - initialWeek + 1)) + initialWeek;
    const newCombination = `${randomSubject} ${randomWeek}`;
    shuffledArray.push(newCombination);
  }

  const cards = [];

  // Gera as cartelas
  for (let i = 0; i < numPlayers; i++) {
    const card = generateUniqueCard(
      shuffledArray,
      cellsPerCard,
      initialWeek,
      finalWeek
    );
    cards.push(card);
  }

  // Cria o HTML para cada cartela
  renderPlayerCards(cards, cellsPerCard, cardsContainer);

  const maxCellsFullCard = 9 * 9;
  const fullCards = [];

  for (let i = 0; i < allCombinations.length; i += maxCellsFullCard) {
    fullCards.push(allCombinations.slice(i, i + maxCellsFullCard));
  }

  renderPlayerCards(fullCards, maxCellsFullCard, fullCardContainer, 9, true);

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
      validateAllCombinations(initialWeek, finalWeek);
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
  const initialWeekInput = document.getElementById("initialWeek");
  const finalWeekInput = document.getElementById("finalWeek");
  const printBtn = document.getElementById("printBtn");

  // Initially disable print button
  if (printBtn) {
    printBtn.disabled = true;
    printBtn.classList.add(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
    printBtn.addEventListener("click", () => {
      plausible("ClassicalBingoPrintCards", {
        props: {
          numPlayers: numPlayersInput.value,
          initialWeek: initialWeekInput.value,
          finalWeek: finalWeekInput.value,
        },
      });
    });
  }

  generateBtn.addEventListener("click", () => {
    const numPlayers = parseInt(numPlayersInput.value);
    const initialWeek = parseInt(initialWeekInput.value);
    const finalWeek = parseInt(finalWeekInput.value);

    if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 100) {
      alert("Por favor, insira um número válido de jogadores (1-100)");
      return;
    }

    if (isNaN(initialWeek) || initialWeek < 1 || initialWeek > 24) {
      alert("Por favor, insira um número válido para a semana inicial (1-24)");
      return;
    }

    if (isNaN(finalWeek) || finalWeek < 1 || finalWeek > 24) {
      alert("Por favor, insira um número válido para a semana final (1-24)");
      return;
    }

    if (finalWeek < initialWeek) {
      alert("A semana final deve ser maior ou igual à semana inicial");
      return;
    }

    generateCards(numPlayers, initialWeek, finalWeek);
    plausible("ClassicalBingoGenerateCards", {
      props: {
        numPlayers: numPlayersInput.value,
        initialWeek: initialWeekInput.value,
        finalWeek: finalWeekInput.value,
      },
    });
  });

  // Add print button event listener
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
