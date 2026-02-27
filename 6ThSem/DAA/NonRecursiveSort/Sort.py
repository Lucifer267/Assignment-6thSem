
from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

#  MERGE SORT — Bottom-up iterative

def merge_sort_iterative(arr, ops):
    """Bottom-up merge sort.  No recursion — doubles the merge width
    each pass (1 → 2 → 4 → 8 …) until the whole array is sorted."""
    n = len(arr)
    buf = [0] * n                              # single shared aux buffer

    width = 1
    while width < n:
        lo = 0
        while lo < n:
            mid = min(lo + width - 1, n - 1)
            hi  = min(lo + 2 * width - 1, n - 1)

            if mid < hi:                       # at least two elements to merge
                ops.append(["d", lo, hi, mid])
                _merge(arr, ops, lo, mid, hi, buf)

            lo += 2 * width
        width *= 2


def _merge(arr, ops, lo, mid, hi, buf):
    for idx in range(lo, hi + 1):
        buf[idx] = arr[idx]

    i, j, k = lo, mid + 1, lo
    while i <= mid and j <= hi:
        ops.append(["c", i, j, lo, hi])
        if buf[i] <= buf[j]:
            arr[k] = buf[i]
            ops.append(["w", k, buf[i], lo, hi])
            i += 1
        else:
            arr[k] = buf[j]
            ops.append(["w", k, buf[j], lo, hi])
            j += 1
        k += 1

    while i <= mid:
        arr[k] = buf[i]
        ops.append(["w", k, buf[i], lo, hi])
        i += 1; k += 1
    while j <= hi:
        arr[k] = buf[j]
        ops.append(["w", k, buf[j], lo, hi])
        j += 1; k += 1

    ops.append(["m", lo, hi])

#  QUICK SORT — Explicit stack (iterative)


def quick_sort_iterative(arr, ops):
    """Iterative quick sort using an explicit stack.
    Always pushes the LARGER partition first so the stack
    never exceeds O(lg n) entries."""
    n = len(arr)
    if n <= 1:
        return

    stack = [(0, n - 1)]                       # explicit stack of (lo, hi)

    while stack:
        lo, hi = stack.pop()
        if lo >= hi:
            continue

        pivot_idx = _partition(arr, ops, lo, hi)
        ops.append(["P", pivot_idx, lo, hi])

        # Push the LARGER partition first (it stays deeper in the stack)
        # so the smaller one is processed next → stack depth ≤ O(lg n).
        left_size  = pivot_idx - 1 - lo
        right_size = hi - (pivot_idx + 1)

        if left_size > right_size:
            stack.append((lo, pivot_idx - 1))          # larger first
            stack.append((pivot_idx + 1, hi))           # smaller on top
        else:
            stack.append((pivot_idx + 1, hi))           # larger first
            stack.append((lo, pivot_idx - 1))           # smaller on top


def _partition(arr, ops, lo, hi):
    pivot_val = arr[hi]
    ops.append(["p", hi, lo, hi])
    i = lo - 1

    for j in range(lo, hi):
        ops.append(["c", j, hi, lo, hi])
        if arr[j] <= pivot_val:
            i += 1
            if i != j:
                arr[i], arr[j] = arr[j], arr[i]
                ops.append(["s", i, j, lo, hi])

    if i + 1 != hi:
        arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
        ops.append(["s", i + 1, hi, lo, hi])
    return i + 1


#  FLASK ROUTES


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sort", methods=["POST"])
def sort_route():
    data = request.get_json()
    arr = list(map(int, data["array"]))
    algo = data.get("algorithm", "merge")
    n = len(arr)

    initial = arr[:]
    ops = []

    t0 = time.perf_counter()
    if algo == "merge":
        merge_sort_iterative(arr, ops)
    else:
        quick_sort_iterative(arr, ops)
    elapsed_ms = round((time.perf_counter() - t0) * 1000, 3)

    ops.append(["D"])

    return jsonify({
        "initial": initial,
        "ops": ops,
        "sorted": arr,
        "time_ms": elapsed_ms,
        "n": n,
        "algorithm": algo
    })


if __name__ == "__main__":
    app.run(debug=True, port=5002)
