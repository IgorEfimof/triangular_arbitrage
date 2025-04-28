function calculateArbitrage() {
  const coef1 = parseFloat(document.getElementById('coef1').value) || 0;
  const coef2 = parseFloat(document.getElementById('coef2').value) || 0;
  const coef3 = parseFloat(document.getElementById('coef3').value) || 0;
  const coef4 = parseFloat(document.getElementById('coef4').value) || 0;
  const coef5 = parseFloat(document.getElementById('coef5').value) || 0;
  const coef6 = parseFloat(document.getElementById('coef6').value) || 0;

  const resultDiv = document.getElementById('result');
  let resultText = '';

  if (coef1 > 1 && coef2 > 1 && coef5 > 1) {
    const arbitrageSum = (1/coef1) + (1/coef2) + (1/coef5);
    resultText += `<p>Арбитраж (1,2,чет): ${(arbitrageSum * 100).toFixed(2)}%</p>`;
    if (arbitrageSum < 1) {
      resultText += `<p style="color: #00e676;">Есть возможность арбитража!</p>`;
    } else {
      resultText += `<p style="color: #ff1744;">Арбитраж невозможен.</p>`;
    }
  } else {
    resultText += `<p style="color: #ff1744;">Введите корректные коэффициенты для расчета.</p>`;
  }

  resultDiv.innerHTML = resultText;

  if (resultText.trim() !== '') {
    const historyItem = document.createElement('li');
    historyItem.innerHTML = resultDiv.innerHTML.replace(/<[^>]+>/g, '');
    document.getElementById('historyList').appendChild(historyItem);
  }
}

document.getElementById('calculateBtn').addEventListener('click', calculateArbitrage);

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

document.getElementById('clearHistoryButton').addEventListener('click', function() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
});


