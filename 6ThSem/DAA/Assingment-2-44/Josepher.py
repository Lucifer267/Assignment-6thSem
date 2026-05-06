def josephus_problem(n):
    if n <= 0:
        return "Invalid input"
    people = []
    for i in range(1, n + 1):
        people.append(i)
    index = 0
    while len(people) > 1:
        index = (index + 1) % len(people)
        del people[index]
        if index == len(people):
            index = 0
    return people[0]

n = int(input("Enter number of people: "))
result = josephus_problem(n)
print("The Person alive at the end is:", result)