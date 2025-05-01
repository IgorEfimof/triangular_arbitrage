function parseVal(id) {
    const val = parseFloat(document.getElementById(id).value.replace(',', '.'));
    return isNaN(val) ? null : val;
}

function clearHighlights() {
    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = '#222';
    });
}

function clearForm() {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.style.backgroundColor = '#222';
    });
    document.getElementById('results').innerHTML = '';
}

function showResults(fields, k1, k2, k3) {
    const bank = parseVal('bankAmount');
    if (!bank) {
        alert('Введите сумму банка!');
        return;
    }

    const sumInverse = (1 / k1) + (1 / k2) + (1 / k3);
    const stake1 = (bank / k1) / sumInverse;
    const stake2 = (bank / k2) / sumInverse;
    const stake3 = (bank / k3) / sumInverse;
    const profit = (bank / sumInverse - bank).toFixed(2);

    const results = `
        <div><strong>Вилка найдена!</strong></div>
        <div>Ставка на ${fields[0]}: <b>${stake1.toFixed(2)} ₽</b></div>
        <div>Ставка на ${fields[1]}: <b>${stake2.toFixed(2)} ₽</b></div>
        <div>Ставка на ${fields[2]}: <b>${stake3.toFixed(2)} ₽</b></div>
        <div style="color: #22c55e;">Гарантированная прибыль: <b>${profit} ₽</b></div>
    `;
    document.getElementById('results').innerHTML = results;

    fields.forEach(id => {
        document.getElementById(id).style.backgroundColor = '#14532d';
    });
}

const arbitrageGroups = [
    ['field1', 'field2', 'field13'], // Победа и чет
    ['field3', 'field4', 'field13'], // Тотал меньше и чет
    ['field5', 'field6', 'field14']  // Тотал больше и нечет
];

function checkArbs() {
    clearHighlights();
    document.getElementById('results').innerHTML = '';

    for (let group of arbitrageGroups) {
        const [f1, f2, f3] = group;
        const k1 = parseVal(f1);
        const k2 = parseVal(f2);
        const k3 = parseVal(f3);
        if (k1 && k2 && k3) {
            const total = (1 / k1) + (1 / k2) + (1 / k3);
            if (total < 1) {
                showResults(group, k1, k2, k3);
                break;
            }
        }
    }
}

document.getElementById('calculateButton').addEventListener('click', checkArbs);
document.getElementById('clearButton').addEventListener('click', clearForm);
