// Загрузка истории из localStorage при старте
document.addEventListener('DOMContentLoaded', function () {
  loadHistory();
});

document.getElementById('arbitrageForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const winnerOdds = document.getElementById('winnerOdds').value.trim().split(' ').map(Number);
  const totalOdds = document.getElementById('totalOdds').value.trim().split(' ').map(Number);
  const evenOddOdds = document.getElementById('evenOddOdds').value.trim().split(' ').map(Number);
  const bankroll = parseFloat(document.getElementById('bankroll').value);

  let found = false;
  let output = '';

  for (let win of winnerOdds) {
    for (let total of totalOdds) {
      for (let evenOdd of evenOddOdds) {
        const probSum = (1 / win) + (1 / total) + (1 / evenOdd);
        if (probSum < 1) {
          found = true;
          const stake1 = bankroll / (win * probSum);
          const stake2 = bankroll / (total * probSum);
          const stake3 = bankroll / (evenOdd * probSum);
          const totalStaked = stake1 + stake2 + stake3;
          const profit = bankroll - totalStaked;

          const resultHTML = `
            <h2>✅ Найден Арбитраж!</h2>
            <p><strong>Победитель:</strong> ${win}</p>
            <p><strong>Тотал:</strong> ${total}</p>
            <p><strong>Чет/Нечет:</strong> ${evenOdd}</p>
            <p><strong>Чистая прибыль:</strong> ${profit.toFixed(2)} ₽</p>
            <p>Ставки распределить так:</p>
            <ul>
              <li>Победитель: ${stake1.toFixed(2)} ₽</li>
              <li>Тотал: ${stake2.toFixed(2)} ₽</li>
              <li>Чет/Нечет: ${stake3.toFixed(2)} ₽</li>
            </ul>
            <hr>
          `;

          output += resultHTML;

          // Сохраняем в историю
          addHistoryItem(`🏆 Поб: ${win}, Тотал: ${total}, Чет/Нечет: ${evenOdd}, Профит: ${profit.toFixed(2)} ₽`);
        }
      }
    }
  }

  if (!found) {
    output = '<h2>❌ Арбитражных ситуаций не найдено.</h2>';
  }

  document.getElementById('result').innerHTML = output;
});

// Добавление записи в историю
function addHistoryItem(text) {
  const historyList = document.getElementById('historyList');
  const historyItem = document.createElement('li');
  historyItem.textContent = text;
  historyList.appendChild(historyItem);

  saveHistory();
  
  // Автопрокрутка вниз
  historyList.scrollTop = historyList.scrollHeight;
}

// Сохранение истории в localStorage
function saveHistory() {
  const items = [];
  document.querySelectorAll('#historyList li').forEach(li => items.push(li.textContent));
  localStorage.setItem('arbitrageHistory', JSON.stringify(items));
}

// Загрузка истории из localStorage
function loadHistory() {
  const historyList = document.getElementById('historyList');
  const data = localStorage.getItem('arbitrageHistory');
  if (data) {
    const items = JSON.parse(data);
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      historyList.appendChild(li);
    });
  }
}

// Очистка истории
document.getElementById('clearHistoryButton').addEventListener('click', function() {
  if (confirm('Точно очистить всю историю?')) {
    document.getElementById('historyList').innerHTML = '';
    localStorage.removeItem('arbitrageHistory');
  }
});

// Экспорт истории в файл
document.getElementById('saveHistoryButton').addEventListener('click', function() {
  const items = [];
  document.querySelectorAll('#historyList li').forEach(li => items.push(li.textContent));

  if (items.length === 0) {
    alert('История пуста, нечего сохранять!');
    return;
  }

  const textContent = items.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });

  const date = new Date();
  const filename = `arbitrage-history-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}.txt`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
