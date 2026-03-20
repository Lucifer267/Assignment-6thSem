# Electricity Bill Calculator

A responsive, modern web application to calculate electricity bills based on a tiered pricing structure built with PHP and CSS.

## Features

✨ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
🧮 **Accurate Calculations** - Implements tiered pricing structure correctly
📊 **Detailed Breakdown** - Shows bill calculation breakdown for each rate tier
💡 **User-Friendly Interface** - Intuitive form and clear result display
⚡ **Quick Examples** - Pre-calculated examples for common unit values
🎨 **Modern UI** - Gradient backgrounds, smooth transitions, and professional styling
✅ **Input Validation** - Client-side and server-side validation

## Rate Structure

The calculator uses a progressive tiered billing system:

| Unit Range | Rate | Price per Unit |
|-----------|------|----------------|
| 1 - 50 units | Tier 1 | Rs. 3.50 |
| 51 - 150 units | Tier 2 | Rs. 4.00 |
| 151 - 250 units | Tier 3 | Rs. 5.20 |
| 250+ units | Tier 4 | Rs. 6.50 |

### Calculation Example

For 300 units:
- First 50 units: 50 × Rs. 3.50 = Rs. 175.00
- Next 100 units (51-150): 100 × Rs. 4.00 = Rs. 400.00
- Next 100 units (151-250): 100 × Rs. 5.20 = Rs. 520.00
- Remaining 50 units (250+): 50 × Rs. 6.50 = Rs. 325.00
- **Total Bill: Rs. 1,420.00**

## Project Structure

```
Assignment6/
├── index.php          # Main PHP file with calculator logic and HTML
├── style.css          # Responsive CSS styling
└── README.md          # This file
```

## Requirements

- PHP 5.6 or higher
- Web server (Apache recommended)
- Modern web browser

## Installation & Usage

### Local Development

1. **Copy files to your web server directory:**
   ```
   Copy all files to your htdocs or www directory
   ```

2. **Using PHP Built-in Server (for testing):**
   ```bash
   php -S localhost:8000
   ```
   Then open `http://localhost:8000/index.php` in your browser

3. **Using Apache/Nginx:**
   - Place files in your web root
   - Access via `http://localhost/Assignment6/index.php`

### How to Use

1. Enter the total units consumed in the input field
2. Click the "Calculate Bill" button
3. View the detailed bill summary and rate breakdown
4. The bill is calculated instantly with:
   - Total units consumed
   - Total electricity bill amount
   - Detailed breakdown showing calculation for each tier

## Features Explained

### 1. **Form Input**
   - Accepts decimal values for precise measurements
   - Validates that input is numeric and positive
   - Clean, accessible form design

### 2. **Bill Summary**
   - Shows total units consumed
   - Displays total bill amount prominently
   - Color-coded for easy visibility

### 3. **Rate Breakdown**
   - Shows which units fall into which rate tier
   - Displays number of units, rate, and amount for each tier
   - Clear table format for transparency

### 4. **Quick Examples**
   - Pre-calculated values displayed as cards
   - Examples for 50, 150, 250, and 350 units
   - Helps users understand billing patterns

### 5. **Responsive Design**
   - Desktop view: Optimized layout for large screens
   - Tablet view: Adjusted spacing and font sizes
   - Mobile view: Single column layout with touch-friendly buttons
   - Print-friendly styles for bill printing

## File Descriptions

### index.php
- **PHP Functions:**
  - `calculateBill($units)`: Calculates total bill amount based on tiered pricing
  - `getBillBreakdown($units)`: Returns detailed breakdown of charges by tier
  
- **Features:**
  - Form processing (POST request handling)
  - Input validation
  - Bill calculation logic
  - Responsive HTML structure
  - Error handling

### style.css
- **Design:**
  - CSS custom properties (variables) for consistent theming
  - Gradient backgrounds and shadow effects
  - Smooth transitions and animations
  - Mobile-first responsive approach
  
- **Responsive Breakpoints:**
  - Default: Desktop (>768px)
  - Tablet: 768px and down
  - Mobile: 480px and down

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- Proper form labels for accessibility
- Color contrast meets WCAG standards
- Keyboard navigation support
- Focus indicators for form elements

## Customization

### Changing Rates

To modify the rate structure, edit the `calculateBill()` function in `index.php`:

```php
// Example: Change first tier rate from 3.50 to 4.00
$totalBill = $units * 4.00; // Modify this value
```

### Changing Colors

Modify CSS variables in `style.css`:

```css
:root {
    --primary-color: #2563eb;      /* Change primary color */
    --success-color: #10b981;       /* Change success/bill color */
    --error-color: #ef4444;         /* Change error color */
}
```

## Testing

### Test Cases

1. **Boundary Values:**
   - Input: 50 units → Expected: Rs. 175.00
   - Input: 150 units → Expected: Rs. 675.00
   - Input: 250 units → Expected: Rs. 1,020.00
   - Input: 300 units → Expected: Rs. 1,245.00

2. **Invalid Inputs:**
   - Empty input → Shows error message
   - Negative values → Shows error message
   - Non-numeric input → Shows error message

3. **Edge Cases:**
   - 0.01 units → Calculates correctly
   - Very large numbers → Handles correctly

## Performance Considerations

- Lightweight CSS (no external dependencies)
- Minimal JavaScript (pure PHP for calculations)
- Fast page load time
- Optimized for all devices

## Security Notes

- Input validation prevents invalid data
- `htmlspecialchars()` prevents XSS attacks
- No database dependencies
- Safe form handling with POST method

## License

Educational project - Free to use and modify

## Support

For issues or questions:
1. Check that PHP is properly installed and running
2. Verify file permissions are set correctly
3. Clear browser cache if styling doesn't load
4. Check browser console for any JavaScript errors

## Future Enhancements

- Add multiple consumer profiles
- Export bill as PDF
- Monthly history tracking
- Seasonal rate adjustments
- Multi-language support
- Dark mode theme
- API integration with real utilities

---

**Last Updated:** March 2026  
**Version:** 1.0
