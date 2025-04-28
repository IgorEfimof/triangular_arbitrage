def calculate_arbitrage(odd1, odd2, odd3, total_bankroll=100):
    """
    Расчет распределения ставок при треугольном арбитраже
    """
    probability_sum = (1 / odd1) + (1 / odd2) + (1 / odd3)
    
    stake1 = total_bankroll / (odd1 * probability_sum)
    stake2 = total_bankroll / (odd2 * probability_sum)
    stake3 = total_bankroll / (odd3 * probability_sum)
    
    total_staked = stake1 + stake2 + stake3
    guaranteed_profit = total_bankroll - total_staked
    
    print("\n✅ Арбитраж найден!")
    print(f"Ожидаемая чистая прибыль: {guaranteed_profit:.2f} ₽")
    print(f"\nРаспределение ставок:")
    print(f"- Победитель: {stake1:.2f} ₽")
    print(f"- Тотал: {stake2:.2f} ₽")
    print(f"- Чет/Нечет: {stake3:.2f} ₽")

