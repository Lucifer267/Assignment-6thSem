

from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

#  MERGE SORT  (single shared aux buffer)


def merge_sort(arr, ops, lo=0, hi=None, buf=None):
    """Top-down recursive merge sort.
    *buf* is a pre-allocated list of the same length as arr — allocated
    only ONCE at the top call, then reused in every _merge."""
    if hi is None:
        hi = len(arr) - 1
        buf = [0] * len(arr)          # one-time allocation
    if lo >= hi:
        return

    mid = (lo + hi) // 2
    ops.append(["d", lo, hi, mid])     # divide

    merge_sort(arr, ops, lo, mid, buf)
    merge_sort(arr, ops, mid + 1, hi, buf)
    _merge(arr, ops, lo, mid, hi, buf)


def _merge(arr, ops, lo, mid, hi, buf):
    # copy active range into the shared buffer (no new allocation)
    for idx in range(lo, hi + 1):
        buf[idx] = arr[idx]

    i, j, k = lo, mid + 1, lo
    while i <= mid and j <= hi:
        ops.append(["c", i, j, lo, hi])       # compare
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

    ops.append(["m", lo, hi])                  # merged

#  QUICK SORT  (Lomuto + tail-call elimination)


def quick_sort(arr, ops, lo=0, hi=None):
    """Recursive quick sort.  Always recurses on the SMALLER partition
    so maximum stack depth is O(lg n) even in the worst case."""
    if hi is None:
        hi = len(arr) - 1

    while lo < hi:
        pivot_idx = _partition(arr, ops, lo, hi)
        ops.append(["P", pivot_idx, lo, hi])   # pivot placed

        # recurse on the smaller side, loop on the larger → O(lg n) stack
        if pivot_idx - lo < hi - pivot_idx:
            quick_sort(arr, ops, lo, pivot_idx - 1)
            lo = pivot_idx + 1                 # tail-call → loop
        else:
            quick_sort(arr, ops, pivot_idx + 1, hi)
            hi = pivot_idx - 1                 # tail-call → loop


def _partition(arr, ops, lo, hi):
    pivot_val = arr[hi]
    ops.append(["p", hi, lo, hi])              # pivot selected
    i = lo - 1

    for j in range(lo, hi):
        ops.append(["c", j, hi, lo, hi])       # compare
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
        merge_sort(arr, ops)
    else:
        quick_sort(arr, ops)
    elapsed_ms = round((time.perf_counter() - t0) * 1000, 3)

    ops.append(["D"])                          # done sentinel

    return jsonify({
        "initial": initial,
        "ops": ops,
        "sorted": arr,
        "time_ms": elapsed_ms,
        "n": n,
        "algorithm": algo
    })


# ──────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5001)

