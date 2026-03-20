<?php
/**
 * User Registration Processing
 * Handles user registration with persistent storage
 * Saves registered credentials to JSON file
 */

// Set content type
header('Content-Type: text/html; charset=UTF-8');

$error_messages = [];
$success_message = '';
$form_data = [];

// File path for storing registered users
$users_file = __DIR__ . '/registered_users.json';

// Ensure the file exists and initialize if empty
if (!file_exists($users_file)) {
    file_put_contents($users_file, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract and trim form inputs
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    
    $form_data = [
        'name' => $name,
        'email' => $email,
        'password' => $password
    ];
    
    // Validation
    // 1. Name validation
    if (empty($name)) {
        $error_messages[] = "Name field is required.";
    } elseif (!preg_match("/^[a-zA-Z\s]+$/", $name)) {
        $error_messages[] = "Name can only contain letters and spaces.";
    } elseif (strlen($name) < 3) {
        $error_messages[] = "Name must be at least 3 characters long.";
    }
    
    // 2. Email validation
    if (empty($email)) {
        $error_messages[] = "Email field is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_messages[] = "Invalid email format. Please enter a valid email address.";
    }
    
    // 3. Password validation
    if (empty($password)) {
        $error_messages[] = "Password field is required.";
    } elseif (strlen($password) < 6) {
        $error_messages[] = "Password must be at least 6 characters long.";
    } elseif (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/", $password)) {
        $error_messages[] = "Password should contain uppercase, lowercase, and numbers.";
    }
    
    // If no errors, check if email already exists and save user
    if (empty($error_messages)) {
        // Read existing users
        $users_json = file_get_contents($users_file);
        $users = json_decode($users_json, true);
        
        // Check if email is already registered
        $email_exists = false;
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                $email_exists = true;
                break;
            }
        }
        
        if ($email_exists) {
            $error_messages[] = "Email already registered. Please login or use a different email.";
        } else {
            // Add new user
            $new_user = [
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'registration_date' => date('Y-m-d H:i:s')
            ];
            
            $users[] = $new_user;
            
            // Save updated users list
            file_put_contents($users_file, json_encode($users, JSON_PRETTY_PRINT));
            
            // Create cookie to store username
            $cookie_expiration = time() + (7 * 24 * 60 * 60);
            setcookie("username", $name, $cookie_expiration, "/");
            setcookie("user_email", $email, $cookie_expiration, "/");
            
            $success_message = "Registration successful! You can now login with your credentials.";
            
            // Log registration
            $log_entry = date('Y-m-d H:i:s') . " - User registered: " . $email . " | Name: " . $name . "\n";
            file_put_contents('registration.log', $log_entry, FILE_APPEND);
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration Result</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Registration Result</h1>
        
        <div class="nav-menu">
            <a href="index.html">Registration</a>
            <a href="login.php">Login</a>
            <a href="check_session.php">Check Session</a>
            <a href="method_demo.html">GET/POST Demo</a>
        </div>

        <!-- Display Messages -->
        <?php if (!empty($error_messages)): ?>
            <div class="alert alert-error">
                <h3>❌ Registration Failed:</h3>
                <ul>
                    <?php foreach ($error_messages as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
                <a href="javascript:history.back()" class="btn btn-secondary">Go Back</a>
            </div>
        <?php endif; ?>

        <?php if (!empty($success_message) && empty($error_messages)): ?>
            <div class="alert alert-success">
                <h3>✓ Success!</h3>
                <p><?php echo htmlspecialchars($success_message); ?></p>
            </div>

            <!-- Display Form Data -->
            <div class="result-section">
                <h2>Your Account Details</h2>
                
                <div class="form-result">
                    <?php if (!empty($form_data['name'])): ?>
                        <div class="result-row">
                            <strong>Name:</strong>
                            <span><?php echo htmlspecialchars($form_data['name']); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($form_data['email'])): ?>
                        <div class="result-row">
                            <strong>Email:</strong>
                            <span><?php echo htmlspecialchars($form_data['email']); ?></span>
                        </div>
                    <?php endif; ?>

                    <div class="result-row">
                        <strong>Registration Date:</strong>
                        <span><?php echo date('Y-m-d H:i:s'); ?></span>
                    </div>
                </div>
            </div>

            <div class="button-group">
                <a href="login.php" class="btn btn-primary">Go to Login</a>
                <a href="index.html" class="btn btn-secondary">Register Another Account</a>
            </div>
        <?php endif; ?>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
