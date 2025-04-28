from utils.calculator import calculate_arbitrage
from utils.checker import is_arbitrage

def get_odds_from_input(prompt):
    print(prompt)
    odds = input("Введите коэффициенты через пробел: ")
    return list(map(float, odds.strip().split()))

def main():
    print("=== Треугольный Арбитраж Бот ===")
    
    winner_odds = get_odds_from_input("Коэффициенты на победителя:")
    total_odds = get_odds_from_input("Коэффициенты на тотал:")
    even_odd_odds = get_odds_from_input("Коэффициенты на чет/нечет:")
    
    bankroll = float(input("Ваш банк (по умолчанию 100 ₽): ") or 100)
    
    found = False
    print("\n🔎 Ищем треугольные арбитражи...\n")
    
    for win in winner_odds:
        for total in total_odds:
            for even_odd in even_odd_odds:
                if is_arbitrage(win, total, even_odd):
                    found = True
                    print(f"\n--- Найден арбитраж! ---")
                    print(f"Победитель: {win}, Тотал: {total}, Чет/Нечет: {even_odd}")
                    calculate_arbitrage(win, total, even_odd, bankroll)
    
    if not found:
        print("\n❌ Арбитражных ситуаций не найдено.")

if __name__ == "__main__":
    main()

