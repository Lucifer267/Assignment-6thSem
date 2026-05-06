n = int(input("Enter number of elements: "))

arr = []
print("Enter elements:")
elements = input().split()
for i in range(n):
    arr.append(int(elements[i]))

max_val = arr[0]

for i in range(1, n):
    if arr[i] > max_val:
        max_val = arr[i]

print("Maximum element = " + str(max_val))