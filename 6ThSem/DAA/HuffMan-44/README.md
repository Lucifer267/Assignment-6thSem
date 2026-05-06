# 🎯 Huffman Coding Visualizer

A beautiful and interactive Huffman Coding implementation with advanced visualization capabilities.

## 📋 Features

- ✅ **Simple Yet Powerful**: Clean, well-structured Huffman Coding implementation
- 📊 **Frequency Analysis**: View character frequency table with percentages
- 🔐 **Code Generation**: See the Huffman codes generated for each character
- 🌳 **Tree Visualization**: Beautiful interactive visualization of the Huffman tree
- 📈 **Compression Statistics**: Detailed compression metrics and savings
- 🔄 **Encode/Decode**: Encode text to binary and decode back
- 💾 **Copy Functionality**: Easily copy results to clipboard
- 📝 **Example Texts**: Pre-loaded examples for quick testing
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask server**:
   ```bash
   python app.py
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:5000`
   - The visualizer will open automatically

## 📁 Project Structure

```
HuffMan/
├── app.py                 # Flask backend server
├── huffman.py            # Huffman coding algorithm implementation
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── templates/
│   └── index.html       # Main HTML interface
└── static/
    ├── style.css        # Styling
    └── script.js        # Frontend interactions and visualization
```

## 🔧 How It Works

### Algorithm Overview

**Huffman Coding** is a greedy algorithm that:
1. Counts character frequencies in the input text
2. Creates leaf nodes for each character
3. Builds a binary tree by repeatedly combining the two nodes with lowest frequencies
4. Generates binary codes by traversing the tree (left = 0, right = 1)
5. Encodes text by replacing each character with its binary code

### Time Complexity
- **Encoding**: O(n + k log k) where n is text length, k is unique characters
- **Decoding**: O(m) where m is the encoded text length

### Space Complexity
- O(k) for storing the frequency table and codes

## 🎮 Usage Guide

### Encoding Text

1. Enter or paste text in the "Input Text" field
2. Click the **"Encode"** button
3. View:
   - Character frequency table
   - Generated Huffman codes
   - Huffman tree visualization
   - Compression statistics
   - Encoded binary string

### Decoding Text

1. After encoding, paste the binary string in "Binary to Decode" field
2. Click **"Decode"** button
3. The original text will appear in the "Decoded Output" section

### Understanding the Visualization

- **Green Circles**: Leaf nodes (individual characters)
- **Yellow Circles**: Internal nodes (combine two subtrees)
- **Left Edge (0)**: Moving to the left child
- **Right Edge (1)**: Moving to the right child
- **Number Inside**: Character frequency
- **Character/Letter**: The actual character (or symbol name for spaces/newlines)

### Examples

Use pre-loaded examples:
- **Hello World**: Simple English text
- **Pattern Text**: Text with repeating characters (good compression)
- **Pangram**: Contains all English letters
- **Mississippi**: Text with many repeated characters

## 📊 Understanding Statistics

- **Original Size**: Text size in bits (characters × 8)
- **Compressed Size**: Encoded binary string length in bits
- **Compression Ratio**: Percentage of size reduction
- **Space Saved**: Difference in bits between original and compressed

### Example
```
Input: "aaabbbccccdddd" (13 characters)
Original: 13 × 8 = 104 bits
Compressed: ~24 bits (depending on tree structure)
Compression: ~77% saved
```

## 💡 Key Concepts

### Optimal Prefix-Free Codes
Huffman codes are **prefix-free** (no code is a prefix of another), allowing unambiguous decoding.

### Greedy Approach
Always combining the two smallest frequency nodes guarantees an optimal solution.

### Variable-Length Encoding
Frequently used characters get shorter codes, rarely used characters get longer codes.

## 🎨 Technical Details

### Backend (Python/Flask)
- `HuffmanCoding` class: Core algorithm
- `Node` class: Tree node representation
- RESTful API endpoints for encode/decode/visualize

### Frontend (HTML/CSS/JavaScript)
- Canvas-based tree visualization
- Real-time statistics calculation
- Responsive grid layout
- Copy-to-clipboard functionality

## 📝 API Endpoints

### POST `/api/encode`
Encode text using Huffman coding
```json
Request: {"text": "hello"}
Response: {"encoded_text": "...", "codes": {...}, "frequency": {...}, "stats": {...}}
```

### POST `/api/decode`
Decode binary string back to text
```json
Request: {"encoded_text": "...", "codes": {...}}
Response: {"decoded_text": "hello"}
```

### POST `/api/visualize`
Get tree structure for visualization
```json
Request: {"text": "hello"}
Response: {"tree": {...}, "codes": {...}, "frequency": {...}}
```

## 🐛 Troubleshooting

### Port 5000 Already in Use
Change the port in `app.py`:
```python
app.run(debug=True, port=5001)
```

### Module Not Found Error
Reinstall dependencies:
```bash
pip install -r requirements.txt --force-reinstall
```

### Empty Frequency Table
Make sure you're entering non-empty text with at least one character.

## 📚 Learning Resources

- [Huffman Coding Wikipedia](https://en.wikipedia.org/wiki/Huffman_coding)
- [Algorithm Explanation](https://www.geeksforgeeks.org/huffman-coding/)
- [Interactive Tutorial](https://www.khanacademy.org/computing)

## 🎓 Educational Notes

This implementation is designed for:
- Understanding Huffman Coding algorithm
- Visualizing tree construction process
- Analyzing compression efficiency
- Learning greedy algorithms
- Studying binary tree structures

## 📄 License

Free to use for educational and commercial purposes.

## 👨‍💻 Author

Created as an educational tool for understanding Huffman Coding and data compression algorithms.

---

**Happy Encoding! 🎉**

Feel free to experiment with different texts and observe how the Huffman tree and compression ratio change!
