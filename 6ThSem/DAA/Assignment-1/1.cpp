#include <iostream>
#include <vector>
#include <algorithm>  
using namespace std;
void generatePermutations(vector<int>& arr, int start, int end) {
    if (start == end) {
        // Print the current permutation
        for (int num : arr) {
            cout << num << " ";
        }
        cout << endl;
        return;
    }
    for (int i = start; i <= end; i++) {
        // Swap to fix the current position
        swap(arr[start], arr[i]);
        // Recurse for the next position
        generatePermutations(arr, start + 1, end);
        // Backtrack: swap back
        swap(arr[start], arr[i]);
    }
}

void generateCombinations(vector<int>& arr, vector<int>& current, int index, int n) {
    if (index == n) {
        // Print the current combination
        for (int num : current) {
            cout << num << " ";
        }
        cout << endl;
        return;
    }
    generateCombinations(arr, current, index + 1, n);
    current.push_back(arr[index]);
    generateCombinations(arr, current, index + 1, n);
    current.pop_back();
}
int main() {
    int n;
    cout << "Enter the number of values (n): ";
    cin >> n;
    vector<int> arr(n);
    cout << "Enter " << n << " integers: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << "\nAll Permutations:" << endl;
    generatePermutations(arr, 0, n - 1);
    cout << "\nAll Combinations (Subsets):" << endl;
    vector<int> current;
    generateCombinations(arr, current, 0, n);
    return 0;
}