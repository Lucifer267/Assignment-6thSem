<?php
/**
 * Form Processing Script
 * Handles both GET and POST form submissions
 * Validates email format
 * Creates cookies for username storage
 */

// Set content type
header('Content-Type: text/html; charset=UTF-8');

$error_messages = [];
$success_message = '';
$form_data = [];

// Determine request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'GET') {
    // Get form data based on method
    $data = ($method === 'POST') ? $_POST : $_GET;
    
    // Extract and trim form inputs
    $name = isset($data['name']) ? trim($data['name']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';
    
    $form_data = [
        'name' => $name,
        'email' => $email,
        'password' => $password,
        'message' => $message
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
    
    // 3. Password validation (only for registration form)
    if (!empty($password)) {
        if (strlen($password) < 6) {
            $error_messages[] = "Password must be at least 6 characters long.";
        } elseif (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/", $password)) {
            $error_messages[] = "Password should contain uppercase, lowercase, and numbers.";
        }
    }
    
    // If no errors, process the form
    if (empty($error_messages)) {
        // Create cookie to store username (expires in 7 days)
        $cookie_expiration = time() + (7 * 24 * 60 * 60);
        setcookie("username", $name, $cookie_expiration, "/");
        
        // Create cookie for email
        setcookie("user_email", $email, $cookie_expiration, "/");
        
        $success_message = "Form submitted successfully! Cookie created for username: " . htmlspecialchars($name);
        
        // Log form submission
        $log_entry = date('Y-m-d H:i:s') . " - Method: $method | Name: $name | Email: $email | Message: " . (empty($message) ? "N/A" : $message) . "\n";
        file_put_contents('form_submissions.log', $log_entry, FILE_APPEND);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Processing Result</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Form Processing Result</h1>
        
        <div class="nav-menu">
            <a href="index.html">Registration</a>
            <a href="login.php">Login</a>
            <a href="check_session.php">Check Session</a>
            <a href="method_demo.html">GET/POST Demo</a>
            <a href="process_form.php">Clear</a>
        </div>

        <!-- Display Messages -->
        <?php if (!empty($error_messages)): ?>
            <div class="alert alert-error">
                <h3>❌ Validation Errors:</h3>
                <ul>
                    <?php foreach ($error_messages as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
                <a href="javascript:history.back()" class="btn btn-secondary">Go Back</a>
            </div>
        <?php endif; ?>

        <?php if (!empty($success_message)): ?>
            <div class="alert alert-success">
                <h3>✓ Success!</h3>
                <p><?php echo htmlspecialchars($success_message); ?></p>
            </div>
        <?php endif; ?>

        <!-- Display Form Data -->
        <?php if (!empty($form_data) && empty($error_messages)): ?>
            <div class="result-section">
                <h2>Submitted Form Data (<?php echo $method; ?> Method)</h2>
                
                <div class="form-result">
                    <div class="result-row">
                        <strong>Request Method:</strong>
                        <span class="method-badge <?php echo strtolower($method); ?>"><?php echo $method; ?></span>
                    </div>
                    
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
                    
                    <?php if (!empty($form_data['message'])): ?>
                        <div class="result-row">
                            <strong>Message:</strong>
                            <span><?php echo htmlspecialchars($form_data['message']); ?></span>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($_COOKIE['username'])): ?>
                        <div class="result-row">
                            <strong>Cookie Set:</strong>
                            <span class="cookie-badge">username = <?php echo htmlspecialchars($_COOKIE['username']); ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="info-section">
                <h3>Request Details:</h3>
                <pre class="code-block">
Method: <?php echo $method; ?>
<?php if ($method === 'GET'): ?>
Query String: <?php echo htmlspecialchars($_SERVER['QUERY_STRING']); ?>
<?php endif; ?>
Content-Length: <?php echo htmlspecialchars($_SERVER['CONTENT_LENGTH'] ?? 'N/A'); ?>
Remote Address: <?php echo htmlspecialchars($_SERVER['REMOTE_ADDR']); ?>
User Agent: <?php echo htmlspecialchars(substr($_SERVER['HTTP_USER_AGENT'], 0, 50)); ?>...
                </pre>
            </div>
        <?php else: ?>
            <?php if ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($_GET)): ?>
                <div class="info-section">
                    <h3>Form Processing Ready</h3>
                    <p>Submit a form to see validation and processing results.</p>
                    <ul>
                        <li><a href="index.html">Go to Registration Form</a></li>
                        <li><a href="method_demo.html">Try GET/POST Demo</a></li>
                    </ul>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>

    <footer>
        <p>&copy; 2024 Form Processing & Session Management Assignment</p>
    </footer>
</body>
</html>
