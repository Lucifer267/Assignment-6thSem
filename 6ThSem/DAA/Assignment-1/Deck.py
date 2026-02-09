from collections import deque


suits = ["♠", "♥", "♦", "♣"]
ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
deck = [f"{r}{s}" for s in suits for r in ranks]


print("Deck created.")
print(deck)

initial_card = input("\nEnter the card to remove (e.g., A♠): ").strip()

if initial_card not in deck:
    raise ValueError("Card not found in deck!")

initial_index = deck.index(initial_card)
deck.remove(initial_card)

print(f"\nRemoved card: {initial_card}")
print(f"Original position was index {initial_index}")

deck = deque(deck)


shift = int(input("\nEnter shift value (e.g., 1 = right, -1 = left): "))

history = []
step = 0

while True:
    step += 1
    deck.rotate(shift)
    
    
    temp_deck = list(deck)
    temp_deck.insert(initial_index, initial_card)
    
    history.append({
        "step": step,
        "shift": shift,
        "deck_top": temp_deck[:5],  # preview
        "card_position": temp_deck.index(initial_card)
    })
    
    print(f"\nStep {step}")
    print(f"Top 5 cards: {temp_deck[:5]}")
    print(f"{initial_card} is at position {temp_deck.index(initial_card)}")
    
    
    if temp_deck.index(initial_card) == initial_index:
        print("\n🎯 Initial card returned to its original position!")
        break


print("\n=== SHIFT DATABASE ===")
for record in history:
    print(record)
