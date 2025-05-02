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

function calculateArbitrage(bank, coefficients, commission = 0.02, minStake = 10) {
    let bestArbitrage = null;

    // Перебираем все комбинации коэффициентов
    for (let i = 0; i < coefficients.length; i++) {
        for (let j = i + 1; j < coefficients.length; j++) {
            for (let k = j + 1; k < coefficients.length; k++) {
                const [field1, k1] = coefficients[i];
                const [field2, k2] = coefficients[j];
                const [field3, k3] = coefficients[k];

                const totalInverse = (1 / k1) + (1 / k2) + (1 / k3);

                if (totalInverse < 1) {
                    // Учитываем комиссию
                    const stake1 = Math.max((bank / k1) / totalInverse / (1 + commission), minStake);
                    const stake2 = Math.max((bank / k2) / totalInverse / (1 + commission), minStake);
                    const stake3 = Math.max((bank / k3) / totalInverse / (1 + commission), minStake);
                    const profit = (bank / totalInverse - bank).toFixed(2);

                    if (!bestArbitrage || profit > bestArbitrage.profit) {
                        bestArbitrage = {
                            fields: [field1, field2, field3],
                            stakes: [stake1, stake2, stake3],
                            profit: profit,
                        };
                    }
                }
            }
        }
    }

    return bestArbitrage;
}

function checkArbitrage() {
    clearHighlights();
    const bank = parseVal('bankAmount');
    if (!bank) {
        alert('Введите сумму банка!');
        return;
    }

    const coefficients = [];
    for (let i = 1; i <= 14; i++) {
        const field = `field${i}`;
        const value = parseVal(field);
        if (value) coefficients.push([field, value]);
    }

    const bestArbitrage = calculateArbitrage(bank, coefficients);

    const results = document.getElementById('results');
    if (bestArbitrage) {
        const { fields, stakes, profit } = bestArbitrage;

        results.innerHTML = `
            <div><strong>Вилка найдена!</strong></div>
            <div>Ставка на ${fields[0]}: <b>${stakes[0].toFixed(2)} ₽</b></div>
            <div>Ставка на ${fields[1]}: <b>${stakes[1].toFixed(2)} ₽</b></div>
            <div>Ставка на ${fields[2]}: <b>${stakes[2].toFixed(2)} ₽</b></div>
            <div style="color: #22c55e;">Гарантированная прибыль: <b>${profit} ₽</b></div>
        `;

        fields.forEach(field => {
            document.getElementById(field).style.backgroundColor = '#14532d';
        });
    } else {
        results.innerHTML = '<div>Вилка не найдена.</div>';
    }
}

document.getElementById('calculateButton').addEventListener('click', checkArbitrage);
document.getElementById('clearButton').addEventListener('click', clearForm);

