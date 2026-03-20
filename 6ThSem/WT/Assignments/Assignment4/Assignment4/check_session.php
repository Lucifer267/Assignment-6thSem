<?php
/**
 * Session Check Page
 * Protected page showing session data
 * Requires active session/login
 */

session_start();

// Check if user is logged in
$is_logged_in = isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true;

// Calculate session duration
$session_duration = 0;
if (isset($_SESSION['login_time'])) {
    $session_duration = time() - $_SESSION['login_time'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Information</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Session Information</h1>
        
        <div class="nav-menu">
            <a href="index.html">Registration</a>
            <a href="login.php">Login</a>
            <a href="check_session.php" class="active">Check Session</a>
            <a href="method_demo.html">GET/POST Demo</a>
            <?php if ($is_logged_in): ?>
                <a href="logout.php" class="logout-link">Logout</a>
            <?php endif; ?>
        </div>

        <!-- Session Status -->
        <?php if ($is_logged_in): ?>
            <div class="alert alert-success">
                <h3>✓ Active Session</h3>
                <p>You are currently logged in.</p>
            </div>

            <!-- User Information -->
            <div class="result-section">
                <h2>User Information</h2>
                <div class="form-result">
                    <div class="result-row">
                        <strong>Status:</strong>
                        <span class="badge-success">Logged In</span>
                    </div>
                    
                    <?php if (isset($_SESSION['user_name'])): ?>
                        <div class="result-row">
                            <strong>Name:</strong>
                            <span><?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (isset($_SESSION['user_email'])): ?>
                        <div class="result-row">
                            <strong>Email:</strong>
                            <span><?php echo htmlspecialchars($_SESSION['user_email']); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (isset($_SESSION['login_time'])): ?>
                        <div class="result-row">
                            <strong>Login Time:</strong>
                            <span><?php echo date('Y-m-d H:i:s', $_SESSION['login_time']); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <div class="result-row">
                        <strong>Session Duration:</strong>
                        <span><?php echo $session_duration; ?> seconds (<?php echo gmdate('H:i:s', $session_duration); ?>)</span>
                    </div>
                    
                    <?php if (isset($_SESSION['session_id'])): ?>
                        <div class="result-row">
                            <strong>Session ID:</strong>
                            <span class="code"><?php echo htmlspecialchars(substr($_SESSION['session_id'], 0, 20)); ?>...</span>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_COOKIE['username'])): ?>
                        <div class="result-row">
                            <strong>Cookie (Username):</strong>
                            <span class="cookie-badge"><?php echo htmlspecialchars($_COOKIE['username']); ?></span>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_COOKIE['remember_token'])): ?>
                        <div class="result-row">
                            <strong>Cookie (Remember Me):</strong>
                            <span class="code"><?php echo htmlspecialchars(substr($_COOKIE['remember_token'], 0, 20)); ?>...</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Session Variables -->
            <div class="info-section">
                <h3>All Session Variables:</h3>
                <pre class="code-block">
<?php 
    foreach ($_SESSION as $key => $value) {
        if (!is_array($value) && !is_object($value)) {
            echo htmlspecialchars($key) . " => " . htmlspecialchars($value) . "\n";
        }
    }
?>
                </pre>
            </div>

            <!-- All Cookies -->
            <div class="info-section">
                <h3>Available Cookies:</h3>
                <?php if (!empty($_COOKIE)): ?>
                    <pre class="code-block">
<?php 
    foreach ($_COOKIE as $key => $value) {
        echo htmlspecialchars($key) . " => " . htmlspecialchars(substr($value, 0, 50)) . (strlen($value) > 50 ? "..." : "") . "\n";
    }
?>
                    </pre>
                <?php else: ?>
                    <p>No cookies set.</p>
                <?php endif; ?>
            </div>

            <!-- Server Info -->
            <div class="info-section">
                <h3>Server Information:</h3>
                <pre class="code-block">
Session Save Path: <?php echo htmlspecialchars(session_save_path()); ?>
Session ID: <?php echo htmlspecialchars(session_id()); ?>
Session Status: <?php echo session_status() === PHP_SESSION_ACTIVE ? 'Active' : 'Inactive'; ?>
Remote IP: <?php echo htmlspecialchars($_SERVER['REMOTE_ADDR']); ?>
Server: <?php echo htmlspecialchars($_SERVER['SERVER_SOFTWARE']); ?>
                </pre>
            </div>

            <!-- Logout Button -->
            <div class="button-group">
                <a href="logout.php" class="btn btn-danger">Logout (Destroy Session)</a>
                <a href="index.html" class="btn btn-secondary">Back to Registration</a>
            </div>

        <?php else: ?>
            <!-- Not Logged In -->
            <div class="alert alert-error">
                <h3>❌ No Active Session</h3>
                <p>You are not logged in. Please login to view session information.</p>
            </div>

            <div class="info-section">
                <h3>Session Status:</h3>
                <p><strong>Current Status:</strong> <span style="color: red;">Not Logged In</span></p>
                
                <h3>Available Cookies:</h3>
                <?php if (!empty($_COOKIE)): ?>
                    <pre class="code-block">
<?php 
    foreach ($_COOKIE as $key => $value) {
        echo htmlspecialchars($key) . " => " . htmlspecialchars(substr($value, 0, 50)) . (strlen($value) > 50 ? "..." : "") . "\n";
    }
?>
                    </pre>
                <?php else: ?>
                    <p>No cookies set.</p>
                <?php endif; ?>
            </div>

            <!-- Login Button -->
            <div class="button-group">
                <a href="login.php" class="btn btn-success">Go to Login</a>
                <a href="index.html" class="btn btn-secondary">Go to Registration</a>
            </div>
        <?php endif; ?>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
