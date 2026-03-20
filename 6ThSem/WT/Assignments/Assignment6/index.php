<?php
$bill = null;
$breakdown = null;
$error = null;
$units = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $units = isset($_POST['units']) ? trim($_POST['units']) : '';
    
    // Validate input
    if (empty($units)) {
        $error = "Please enter the number of units.";
    } elseif (!is_numeric($units) || $units < 0) {
        $error = "Please enter a valid positive number.";
    } else {
        $units = (float)$units;
        $bill = calculateBill($units);
        $breakdown = getBillBreakdown($units);
    }
}

function calculateBill($units) {
    $totalBill = 0;
    
    // First 50 units @ Rs. 3.50/unit
    if ($units <= 50) {
        $totalBill = $units * 3.50;
    }
    // First 50 + Next 100 (51-150)
    elseif ($units <= 150) {
        $totalBill = (50 * 3.50) + (($units - 50) * 4.00);
    }
    // First 50 + Next 100 + Next 100 (151-250)
    elseif ($units <= 250) {
        $totalBill = (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
    }
    // Units above 250
    else {
        $totalBill = (50 * 3.50) + (100 * 4.00) + (100 * 5.20) + (($units - 250) * 6.50);
    }
    
    return $totalBill;
}

function getBillBreakdown($units) {
    $breakdown = [];
    
    // First 50 units @ Rs. 3.50/unit
    if ($units > 0) {
        $unitsInBracket = min($units, 50);
        $breakdown[] = [
            'range' => '1-50 units',
            'units' => $unitsInBracket,
            'rate' => 3.50,
            'amount' => $unitsInBracket * 3.50
        ];
    }
    
    // Next 100 units (51-150) @ Rs. 4.00/unit
    if ($units > 50) {
        $unitsInBracket = min($units - 50, 100);
        $breakdown[] = [
            'range' => '51-150 units',
            'units' => $unitsInBracket,
            'rate' => 4.00,
            'amount' => $unitsInBracket * 4.00
        ];
    }
    
    // Next 100 units (151-250) @ Rs. 5.20/unit
    if ($units > 150) {
        $unitsInBracket = min($units - 150, 100);
        $breakdown[] = [
            'range' => '151-250 units',
            'units' => $unitsInBracket,
            'rate' => 5.20,
            'amount' => $unitsInBracket * 5.20
        ];
    }
    
    // Units above 250 @ Rs. 6.50/unit
    if ($units > 250) {
        $unitsInBracket = $units - 250;
        $breakdown[] = [
            'range' => '250+ units',
            'units' => $unitsInBracket,
            'rate' => 6.50,
            'amount' => $unitsInBracket * 6.50
        ];
    }
    
    return $breakdown;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>⚡ Electricity Bill Calculator</h1>
            <p class="subtitle">Calculate your electricity bill instantly</p>
        </header>

        <main>
            <div class="calculator-card">
                <form method="POST" action="" class="calculator-form">
                    <div class="form-group">
                        <label for="units">Enter Units Consumed:</label>
                        <input 
                            type="number" 
                            id="units" 
                            name="units" 
                            placeholder="Enter number of units" 
                            step="0.01"
                            min="0"
                            value="<?php echo htmlspecialchars($units !== null ? $units : ''); ?>"
                            required
                        >
                        <span class="unit-label">units (kWh)</span>
                    </div>

                    <?php if ($error): ?>
                        <div class="alert alert-error">
                            ❌ <?php echo htmlspecialchars($error); ?>
                        </div>
                    <?php endif; ?>

                    <button type="submit" class="btn-calculate">Calculate Bill</button>
                </form>

                <?php if ($bill !== null && !$error): ?>
                    <div class="results">
                        <div class="bill-summary">
                            <h2>Bill Summary</h2>
                            <div class="summary-item">
                                <span class="label">Total Units Consumed:</span>
                                <span class="value"><?php echo number_format($units, 2); ?> kWh</span>
                            </div>
                            <div class="summary-item total-bill">
                                <span class="label">Total Electricity Bill:</span>
                                <span class="value">Rs. <?php echo number_format($bill, 2); ?></span>
                            </div>
                        </div>

                        <div class="bill-breakdown">
                            <h3>Rate Breakdown</h3>
                            <table class="breakdown-table">
                                <thead>
                                    <tr>
                                        <th>Unit Range</th>
                                        <th>Units</th>
                                        <th>Rate (Rs./unit)</th>
                                        <th>Amount (Rs.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($breakdown as $row): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($row['range']); ?></td>
                                            <td><?php echo number_format($row['units'], 2); ?></td>
                                            <td><?php echo number_format($row['rate'], 2); ?></td>
                                            <td>Rs. <?php echo number_format($row['amount'], 2); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>

                        <div class="rate-info">
                            <h3>Rate Structure</h3>
                            <ul class="rate-list">
                                <li><strong>First 50 units:</strong> Rs. 3.50 per unit</li>
                                <li><strong>Next 100 units (51-150):</strong> Rs. 4.00 per unit</li>
                                <li><strong>Next 100 units (151-250):</strong> Rs. 5.20 per unit</li>
                                <li><strong>Units above 250:</strong> Rs. 6.50 per unit</li>
                            </ul>
                        </div>
                    </div>
                <?php elseif (!$error && $bill === null): ?>
                    <div class="info-section">
                        <h3>How it works?</h3>
                        <p>Enter the total units consumed by you to calculate your monthly electricity bill based on the tiered pricing structure.</p>
                        <div class="rate-info">
                            <h4>Current Rate Structure:</h4>
                            <ul class="rate-list">
                                <li><strong>First 50 units:</strong> Rs. 3.50 per unit</li>
                                <li><strong>Next 100 units (51-150):</strong> Rs. 4.00 per unit</li>
                                <li><strong>Next 100 units (151-250):</strong> Rs. 5.20 per unit</li>
                                <li><strong>Units above 250:</strong> Rs. 6.50 per unit</li>
                            </ul>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <div class="examples">
                <h3>Quick Examples:</h3>
                <div class="example-grid">
                    <div class="example-card">
                        <p class="example-units">50 Units</p>
                        <p class="example-bill">Rs. <?php echo number_format(calculateBill(50), 2); ?></p>
                    </div>
                    <div class="example-card">
                        <p class="example-units">150 Units</p>
                        <p class="example-bill">Rs. <?php echo number_format(calculateBill(150), 2); ?></p>
                    </div>
                    <div class="example-card">
                        <p class="example-units">250 Units</p>
                        <p class="example-bill">Rs. <?php echo number_format(calculateBill(250), 2); ?></p>
                    </div>
                    <div class="example-card">
                        <p class="example-units">350 Units</p>
                        <p class="example-bill">Rs. <?php echo number_format(calculateBill(350), 2); ?></p>
                    </div>
                </div>
            </div>
        </main>

        <footer>
            <p>&copy; 2026 Electricity Bill Calculator | All rights reserved</p>
        </footer>
    </div>
</body>
</html>
