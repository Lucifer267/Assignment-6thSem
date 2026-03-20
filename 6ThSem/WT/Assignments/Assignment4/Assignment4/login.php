<?php
/**
 * Login Form
 * Displays login form for session-based authentication
 */
session_start();

// Redirect if already logged in
if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
    header('Location: check_session.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>User Login</h1>
        
        <div class="nav-menu">
            <a href="index.html">Registration</a>
            <a href="login.php" class="active">Login</a>
            <a href="check_session.php">Check Session</a>
            <a href="method_demo.html">GET/POST Demo</a>
        </div>

        <div class="form-section">
            <h2>Session-Based Login</h2>
            
            <form action="login_process.php" method="POST" class="login-form">
                <div class="form-group">
                    <label for="login_email">Email Address:</label>
                    <input 
                        type="email" 
                        id="login_email" 
                        name="email" 
                        required
                        placeholder="Enter your email"
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label for="login_password">Password:</label>
                    <input 
                        type="password" 
                        id="login_password" 
                        name="password" 
                        required
                        placeholder="Enter your password"
                    >
                </div>

                <div class="form-group checkbox">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        name="remember_me"
                    >
                    <label for="remember">Remember me for 30 days</label>
                </div>

                <div class="button-group">
                    <button type="submit" class="btn btn-success">Login (Start Session)</button>
                    <button type="reset" class="btn btn-secondary">Clear</button>
                </div>
            </form>

            <!-- Demo Credentials -->
            <div class="demo-section">
                <h3>How to Login:</h3>
                <ol>
                    <li>First, <a href="index.html"><strong>register an account</strong></a> using the Registration Form</li>
                    <li>Return here and use the credentials you registered with</li>
                    <li>Your account will be saved automatically after registration</li>
                </ol>
                <p><em>Demo credentials are no longer available. Please register a new account.</em></p>
            </div>
        </div>

        <div class="info-section">
            <h3>Session Features:</h3>
            <ul>
                <li>✓ Server-side session storage</li>
                <li>✓ Session variables for user authentication</li>
                <li>✓ Remember me functionality (cookie)</li>
                <li>✓ Session timeout protection</li>
                <li>✓ Secure logout with session destruction</li>
                <li>✓ Auto-redirect for logged-in users</li>
            </ul>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
