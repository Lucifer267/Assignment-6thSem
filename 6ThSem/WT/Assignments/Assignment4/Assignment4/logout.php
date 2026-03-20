<?php
/**
 * Logout Script
 * Destroys session and clears cookies
 */

session_start();

// Log logout activity
if (isset($_SESSION['user_email'])) {
    $log_entry = date('Y-m-d H:i:s') . " - User logged out: " . $_SESSION['user_email'] . " | Session: " . session_id() . "\n";
    file_put_contents('login_activity.log', $log_entry, FILE_APPEND);
}

// Destroy session
$_SESSION = [];
session_destroy();

// Clear cookies
if (isset($_COOKIE['username'])) {
    setcookie('username', '', time() - 3600, '/');
}
if (isset($_COOKIE['user_email'])) {
    setcookie('user_email', '', time() - 3600, '/');
}
if (isset($_COOKIE['remember_token'])) {
    setcookie('remember_token', '', time() - 3600, '/');
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Logout</h1>
        
        <div class="alert alert-success">
            <h3>✓ Logout Successful</h3>
            <p>You have been logged out successfully.</p>
            <p><strong>Changes made:</strong></p>
            <ul>
                <li>✓ Session destroyed</li>
                <li>✓ Session variables cleared</li>
                <li>✓ Cookies cleared</li>
                <li>✓ Session ID invalidated</li>
            </ul>
        </div>

        <div class="button-group">
            <a href="login.php" class="btn btn-success">Go to Login</a>
            <a href="index.html" class="btn btn-secondary">Go to Registration</a>
            <a href="check_session.php" class="btn btn-info">Check Session Status</a>
        </div>

        <div class="info-section">
            <h3>What Happens During Logout:</h3>
            <pre class="code-block">
1. Session data ($_SESSION) is emptied
2. Session file is deleted from server
3. All cookies are deleted (by setting expiration in past)
4. Session ID is invalidated
5. User must login again to access protected pages
            </pre>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
