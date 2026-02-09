def josephus_problem(n):
    if n <= 0:
        return "Invalid input"

    highest_power_of_2 = 1 << (n.bit_length() - 1)
    l = n - highest_power_of_2
    return (l << 1) | 1


n = int(input("Enter number of people: "))
result = josephus_problem(n)
print("The Person alive at the end is:", result)
