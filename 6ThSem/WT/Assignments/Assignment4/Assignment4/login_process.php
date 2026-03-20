<?php
/**
 * Login Processing Script
 * Handles user authentication against registered users
 * Creates session for authenticated users
 */

session_start();

// Set content type
header('Content-Type: text/html; charset=UTF-8');

$error_message = '';
$success_message = '';

// File path for registered users
$users_file = __DIR__ . '/registered_users.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    $remember_me = isset($_POST['remember_me']) ? true : false;
    
    // Validation
    $is_valid = true;
    
    if (empty($email)) {
        $error_message = "Email is required.";
        $is_valid = false;
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_message = "Invalid email format.";
        $is_valid = false;
    }
    
    if (empty($password)) {
        $error_message = "Password is required.";
        $is_valid = false;
    }
    
    // Check credentials against registered users
    $user_found = null;
    
    if ($is_valid && file_exists($users_file)) {
        $users_json = file_get_contents($users_file);
        $users = json_decode($users_json, true);
        
        // Search for matching user
        if (is_array($users)) {
            foreach ($users as $user) {
                if ($user['email'] === $email && $user['password'] === $password) {
                    $user_found = $user;
                    break;
                }
            }
        }
        
        if ($user_found) {
            // Authentication successful - create session
            $_SESSION['user_logged_in'] = true;
            $_SESSION['user_email'] = $user_found['email'];
            $_SESSION['user_name'] = $user_found['name'];
            $_SESSION['login_time'] = time();
            $_SESSION['session_id'] = session_id();
            
            // Handle "Remember Me" - create persistent cookie
            if ($remember_me) {
                $remember_token = bin2hex(random_bytes(32));
                setcookie('remember_token', $remember_token, time() + (30 * 24 * 60 * 60), '/');
                $_SESSION['remember_token'] = $remember_token;
                $remember_message = " Remember me cookie set for 30 days.";
            } else {
                $remember_message = "";
            }
            
            // Log login activity
            $log_entry = date('Y-m-d H:i:s') . " - User logged in: " . $user_found['email'] . " | Session: " . session_id() . "\n";
            file_put_contents('login_activity.log', $log_entry, FILE_APPEND);
            
            // Redirect to session page
            header('Location: check_session.php');
            exit();
        } else {
            $error_message = "Invalid email or password. Please check your credentials.";
        }
    } else {
        if (!file_exists($users_file)) {
            $error_message = "No registered users found. Please register first.";
        } else {
            $error_message = "Invalid credentials.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Processing</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Login Processing</h1>
        
        <div class="nav-menu">
            <a href="index.html">Registration</a>
            <a href="login.php">Login</a>
            <a href="check_session.php">Check Session</a>
            <a href="method_demo.html">GET/POST Demo</a>
        </div>

        <!-- Error Message -->
        <?php if (!empty($error_message)): ?>
            <div class="alert alert-error">
                <h3>❌ Login Failed</h3>
                <p><?php echo htmlspecialchars($error_message); ?></p>
                <a href="login.php" class="btn btn-secondary">Back to Login</a>
            </div>
        <?php endif; ?>

        <!-- Success Message -->
        <?php if (!empty($success_message)): ?>
            <div class="alert alert-success">
                <h3>✓ Login Successful</h3>
                <p><?php echo htmlspecialchars($success_message); ?></p>
            </div>
        <?php endif; ?>

        <!-- Login Info -->
        <?php if (empty($error_message)): ?>
            <div class="info-section">
                <h3>Login Process</h3>
                <p>Process the form above to authenticate and create a session.</p>
            </div>
        <?php endif; ?>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
