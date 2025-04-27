from utils.calculator import calculate_arbitrage
from utils.checker import is_arbitrage

def main():
    print("Введите коэффициенты для треугольного арбитража:")
    odd1 = float(input("Коэффициент на победителя: "))
    odd2 = float(input("Коэффициент на тотал: "))
    odd3 = float(input("Коэффициент на чет/нечет: "))
    
    bankroll = float(input("Ваш банк (по умолчанию 100): ") or 100)
    
    if is_arbitrage(odd1, odd2, odd3):
        calculate_arbitrage(odd1, odd2, odd3, bankroll)
    else:
        print("\n❌ Арбитражной ситуации нет.")

if __name__ == "__main__":
    main()
