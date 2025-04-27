def is_arbitrage(odd1, odd2, odd3):
    probability_sum = (1 / odd1) + (1 / odd2) + (1 / odd3)
    return probability_sum < 1
