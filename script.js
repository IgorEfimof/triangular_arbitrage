document.getElementById("calculateBtn").addEventListener("click", () => {
  const coefs = [];
  for (let i = 1; i <= 14; i++) {
    const val = parseFloat(document.getElementById("coef" + i).value);
    coefs.push(isNaN(val) ? 0 : val);
  }

  let message = "";
  coefs.forEach((coef, index) => {
    if (coef > 1) {
      const requiredStake = 100 / coef;
      const profit = 100 - requiredStake;
      message += `Коэф. ${coef.toFixed(2)} → Вложить ${requiredStake.toFixed(2)} → Прибыль ${profit.toFixed(2)}\n`;
    }
  });

  if (!message) {
    message = "Введите коэффициенты больше 1.0";
  }

  document.getElementById("result").innerText = message;
  saveToHistory(message);
});

function saveToHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById("historyList").prepend(li);
  saveHistoryToStorage();
}

function saveHistoryToStorage() {
  const items = [...document.getElementById("historyList").children].map(li => li.textContent);
  localStorage.setItem("arbitrageHistory", JSON.stringify(items));
}

function loadHistoryFromStorage() {
  const items = JSON.parse(localStorage.getItem("arbitrageHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

document.getElementById("saveHistoryButton").addEventListener("click", () => {
  const items = [...document.getElementById("historyList").children].map(li => li.textContent).join("\n\n");
  const blob = new Blob([items], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "arbitrage_history.txt";
  link.click();
});

document.getElementById("clearHistoryButton").addEventListener("click", () => {
  document.getElementById("historyList").innerHTML = "";
  localStorage.removeItem("arbitrageHistory");
});

window.addEventListener("load", loadHistoryFromStorage);



