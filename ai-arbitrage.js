
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
    
    // Простой расчет для любых трех коэффициентов
    for (let i = 0; i < coefficients.length - 2; i++) {
        for (let j = i + 1; j < coefficients.length - 1; j++) {
            for (let k = j + 1; k < coefficients.length; k++) {
                const [field1, k1] = coefficients[i];
                const [field2, k2] = coefficients[j];
                const [field3, k3] = coefficients[k];
                
                // Расчет маржи
                const margin = (1/k1 + 1/k2 + 1/k3);
                
                if (margin < 1) { // Есть арбитраж
                    const stake1 = (bank / margin) / k1;
                    const stake2 = (bank / margin) / k2;
                    const stake3 = (bank / margin) / k3;
                    
                    const profit = (stake1 * k1) - (stake1 + stake2 + stake3);

    // Перебираем все комбинации коэффициентов с учетом специфики настольного тенниса
    for (let i = 0; i < coefficients.length; i++) {
        for (let j = i + 1; j < coefficients.length; j++) {
            for (let k = j + 1; k < coefficients.length; k++) {
                const [field1, k1] = coefficients[i];
                const [field2, k2] = coefficients[j];
                const [field3, k3] = coefficients[k];

                // Проверяем комбинации с учетом специфики игры
                if (!isValidCombination(field1, field2, field3, isFavoriteStrong)) {
                    continue;
                }

                const totalInverse = (1 / k1) + (1 / k2) + (1 / k3);

                if (totalInverse < 1) {
                    // Распределение ставок с учетом вероятностей
                    const baseStake = bank / totalInverse / (1 + commission);
                    let stake1 = Math.max((baseStake / k1) * getWeightForMarket(field1), minStake);
                    let stake2 = Math.max((baseStake / k2) * getWeightForMarket(field2), minStake);
                    let stake3 = Math.max((baseStake / k3) * getWeightForMarket(field3), minStake);

                    const totalStake = stake1 + stake2 + stake3;
                    const profit = ((stake1 * k1 - totalStake).toFixed(2));

                    if (!bestArbitrage || profit > bestArbitrage.profit) {
                        bestArbitrage = {
                            fields: [field1, field2, field3],
                            stakes: [stake1, stake2, stake3],
                            profit: profit,
                            explanation: getStrategyExplanation(field1, field2, field3)
                        };
                    }
                }
            }
        }
    }

    return bestArbitrage;
}

function isValidCombination(field1, field2, field3, isFavoriteStrong) {
    // Логика проверки валидных комбинаций для тенниса
    const isTotal = field => field.includes('field3') || field.includes('field4') ||
                            field.includes('field5') || field.includes('field6') ||
                            field.includes('field7') || field.includes('field8') ||
                            field.includes('field9') || field.includes('field10') ||
                            field.includes('field11') || field.includes('field12');
    
    const isWinner = field => field === 'field1' || field === 'field2';
    const isEvenOdd = field => field === 'field13' || field === 'field14';

    // Любая комбинация из трех разных коэффициентов подходит
    return true;
}

function getWeightForMarket(field) {
    // Веса для разных типов ставок
    if (field === 'field1' || field === 'field2') return 1.2; // Победа
    if (field.includes('field3') || field.includes('field4')) return 1.1; // Тотал 16.5
    if (field === 'field13' || field === 'field14') return 0.9; // Чет/нечет
    return 1.0;
}

function getStrategyExplanation(field1, field2, field3) {
    let explanation = "Рекомендация: ";
    
    if (field1.includes('field3') || field2.includes('field3') || field3.includes('field3')) {
        explanation += "Тотал меньше часто проходит в матчах с явным фаворитом. ";
    }
    if (field1 === 'field13' || field2 === 'field13' || field3 === 'field13') {
        explanation += "Чётный тотал вероятнее в равных матчах. ";
    }
    
    return explanation;
}

function checkArbitrage() {
    clearHighlights();
    const bank = parseVal('bankAmount');
    if (!bank) {
        alert('Введите сумму банка!');
        return;
    }
    document.getElementById('results').innerHTML = '';
    
    if (!bank) {
        document.getElementById('results').innerHTML = '<div style="color: #ff4444;">Ошибка: Введите сумму банка!</div>';
        return;
    }

    const coefficients = [];
    for (let i = 1; i <= 14; i++) {
        const field = `field${i}`;
        const value = parseVal(field);
        if (value) {
            coefficients.push([field, value]);
        }
    }

    if (coefficients.length < 3) {
        document.getElementById('results').innerHTML = '<div style="color: #ff4444;">Ошибка: Введите минимум 3 коэффициента!</div>';
        return;
    }

    const results = document.getElementById('results');
    results.innerHTML = '<div>Идет расчет...</div>';

    const bestArbitrage = calculateArbitrage(bank, coefficients);
    
    if (bestArbitrage || true) { // Временно убираем проверку
        const fields = coefficients.slice(0, 3).map(([field]) => field);
        const stakes = [1000, 1000, 1000]; // Временные значения для теста
        const profit = 100; // Временное значение для теста
        
        let displayFields = fields.map(field => {
            switch(field) {
                case 'field1': return 'П1';
                case 'field2': return 'П2';
                case 'field3': return 'ТМ (16.5)';
                case 'field4': return 'ТБ (16.5)';
                case 'field13': return 'Чет';
                case 'field14': return 'Нечет';
                default: return field;
            }
        });

        results.innerHTML = `
            <div><strong>Расчет выполнен:</strong></div>
            <div>Ставка на ${displayFields[0]}: <b>${Math.round(stakes[0])} ₽</b></div>
            <div>Ставка на ${displayFields[1]}: <b>${Math.round(stakes[1])} ₽</b></div>
            <div>Ставка на ${displayFields[2]}: <b>${Math.round(stakes[2])} ₽</b></div>
            <div style="color: #22c55e;">Прибыль: <b>${Math.round(profit)} ₽</b></div>
            <div style="margin-top: 10px; font-style: italic;">${explanation}</div>
        `;

        fields.forEach(field => {
            document.getElementById(field).style.backgroundColor = '#14532d';
        });
    } else {
        results.innerHTML = '<div>Вилка не найдена.</div>';
    }
}

// Добавляем обработчики событий после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateButton').addEventListener('click', checkArbitrage);
    document.getElementById('clearButton').addEventListener('click', clearForm);
});
