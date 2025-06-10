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

// Função para gerar uma combinação única de assuntos e semanas
function generateUniqueCombination(numWeeks) {
  const combination = new Set();
  const maxAttempts = 100; // Evita loop infinito
  let attempts = 0;

  while (combination.size < 9 && attempts < maxAttempts) {
    const subject = subjects[getRandomInt(0, subjects.length - 1)];
    const week = getRandomInt(1, numWeeks);
    const item = `${subject} ${week}`;
    combination.add(item);
    attempts++;
  }

  return Array.from(combination);
}

// Função para verificar se uma combinação é única
function isUniqueCombination(combination, existingCombinations) {
  const sortedCombination = combination.sort().join(",");
  return !existingCombinations.has(sortedCombination);
}

// Função para gerar todas as cartelas
function generateCards(numPlayers, numWeeks) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = ""; // Limpa o container

  const existingCombinations = new Set();
  const cards = [];

  // Gera as cartelas
  for (let i = 0; i < numPlayers; i++) {
    let combination;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      combination = generateUniqueCombination(numWeeks);
      attempts++;
    } while (
      !isUniqueCombination(combination, existingCombinations) &&
      attempts < maxAttempts
    );

    if (attempts >= maxAttempts) {
      alert(
        "Não foi possível gerar cartelas únicas para todos os jogadores. Tente reduzir o número de jogadores."
      );
      return;
    }

    existingCombinations.add(combination.sort().join(","));
    cards.push(combination);
  }

  // Cria o HTML para cada cartela
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "bg-white rounded-lg shadow-md p-4";

    const cardHTML = `
            <h3 class="text-lg font-bold mb-4 text-center">Cartela do Jogador ${
              index + 1
            }</h3>
            <div class="border-2 border-gray-800 rounded-lg overflow-hidden">
                <table class="w-full border-collapse table-fixed">
                    <tbody>
                        <tr>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[0]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[1]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[2]
                            }</td>
                        </tr>
                        <tr>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[3]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[4]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[5]
                            }</td>
                        </tr>
                        <tr>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[6]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[7]
                            }</td>
                            <td class="border-2 border-gray-800 p-3 text-center bg-blue-50 h-24 align-middle">${
                              card[8]
                            }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

    cardElement.innerHTML = cardHTML;
    cardsContainer.appendChild(cardElement);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const numPlayersInput = document.getElementById("numPlayers");
  const numWeeksInput = document.getElementById("numWeeks");

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
});
