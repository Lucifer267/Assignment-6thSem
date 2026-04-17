// Global state
let currentCodes = {};
let currentFrequency = {};
let currentTree = null;

// Encode function
async function encode() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        showError('Please enter text to encode');
        return;
    }
    
    try {
        // Clear previous results
        clearResults();
        
        // Call API
        const response = await fetch('/api/encode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: inputText })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            showError(data.error);
            return;
        }
        
        // Store for later use
        currentCodes = data.codes;
        currentFrequency = data.frequency;
        
        // Display results
        displayFrequencyTable(data.frequency);
        displayCodesTable(data.codes);
        displayEncodedText(data.encoded_text);
        displayStats(data.stats);
        
        // Get and display tree visualization
        await visualizeTree(inputText);
        
        showSuccess('Text encoded successfully!');
        
    } catch (error) {
        showError('Error during encoding: ' + error.message);
    }
}

// Decode function
async function decode() {
    const binaryText = document.getElementById('binaryToDecode').value.trim();
    
    if (!binaryText) {
        showError('Please enter binary text to decode');
        return;
    }
    
    if (!currentCodes || Object.keys(currentCodes).length === 0) {
        showError('Please encode text first to generate codes');
        return;
    }
    
    try {
        const response = await fetch('/api/decode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encoded_text: binaryText,
                codes: currentCodes
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            showError(data.error);
            return;
        }
        
        document.getElementById('decodedText').value = data.decoded_text;
        showSuccess('Text decoded successfully!');
        
    } catch (error) {
        showError('Error during decoding: ' + error.message);
    }
}

// Visualize tree
async function visualizeTree(text) {
    try {
        const response = await fetch('/api/visualize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentTree = data.tree;
            drawHuffmanTree(data.tree);
        }
        
    } catch (error) {
        console.error('Error visualizing tree:', error);
    }
}

// Draw Huffman Tree on Canvas
function drawHuffmanTree(tree) {
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');
    
    if (!tree) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    // Set canvas size
    canvas.width = 1000;
    canvas.height = 500;
    
    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw tree
    const padding = 50;
    const startX = canvas.width / 2;
    const startY = 30;
    
    drawNode(ctx, tree, startX, startY, 150);
}

function drawNode(ctx, node, x, y, offset) {
    if (!node) return;
    
    // Draw connections to children
    if (node.left) {
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - offset, y + 80);
        ctx.stroke();
        drawNode(ctx, node.left, x - offset, y + 80, offset / 2);
    }
    
    if (node.right) {
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offset, y + 80);
        ctx.stroke();
        drawNode(ctx, node.right, x + offset, y + 80, offset / 2);
    }
    
    // Draw node
    const radius = 25;
    
    // Background
    if (node.isLeaf) {
        ctx.fillStyle = '#28a745';
    } else {
        ctx.fillStyle = '#ffc107';
    }
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Text
    ctx.fillStyle = node.isLeaf ? '#fff' : '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let text = node.char || node.freq.toString();
    if (node.char === ' ') text = '␣';
    if (node.char === '\n') text = '↵';
    
    ctx.fillText(text, x, y - 5);
    
    // Frequency
    ctx.font = '10px Arial';
    ctx.fillText(node.freq.toString(), x, y + 8);
}

// Display frequency table
function displayFrequencyTable(frequency) {
    const container = document.getElementById('frequencyTable');
    
    if (!frequency || Object.keys(frequency).length === 0) {
        container.innerHTML = '<p class="empty-state">No data</p>';
        return;
    }
    
    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    
    let html = '<table>';
    html += '<thead><tr><th>Character</th><th>Frequency</th><th>Percentage</th></tr></thead>';
    html += '<tbody>';
    
    const total = Object.values(frequency).reduce((a, b) => a + b, 0);
    
    for (const [char, freq] of sorted) {
        const displayChar = char === ' ' ? '␣ (space)' : 
                          char === '\n' ? '↵ (newline)' : 
                          char === '\t' ? '⇥ (tab)' : char;
        const percentage = ((freq / total) * 100).toFixed(2);
        
        html += `<tr>
                    <td><strong>${displayChar}</strong></td>
                    <td>${freq}</td>
                    <td>${percentage}%</td>
                </tr>`;
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Display codes table
function displayCodesTable(codes) {
    const container = document.getElementById('codesTable');
    
    if (!codes || Object.keys(codes).length === 0) {
        container.innerHTML = '<p class="empty-state">No data</p>';
        return;
    }
    
    const sorted = Object.entries(codes).sort((a, b) => 
        a[1].length - b[1].length || a[1].localeCompare(b[1])
    );
    
    let html = '<table>';
    html += '<thead><tr><th>Character</th><th>Code</th><th>Bits</th></tr></thead>';
    html += '<tbody>';
    
    for (const [char, code] of sorted) {
        const displayChar = char === ' ' ? '␣ (space)' : 
                          char === '\n' ? '↵ (newline)' : 
                          char === '\t' ? '⇥ (tab)' : char;
        
        html += `<tr>
                    <td><strong>${displayChar}</strong></td>
                    <td><span class="code">${code}</span></td>
                    <td>${code.length}</td>
                </tr>`;
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Display encoded text
function displayEncodedText(encoded) {
    const textarea = document.getElementById('encodedText');
    textarea.value = encoded;
    
    // Format for readability
    const formatted = encoded.replace(/(.{1,50})/g, '$1\n');
    textarea.value = encoded;
}

// Display statistics
function displayStats(stats) {
    const container = document.getElementById('statsContainer');
    
    const html = `
        <div class="stat-card">
            <h3>Original Size</h3>
            <div class="value">${stats.original_size_bits}</div>
            <div class="unit">bits (${stats.original_size_bytes} bytes)</div>
        </div>
        <div class="stat-card">
            <h3>Compressed Size</h3>
            <div class="value">${stats.compressed_size_bits}</div>
            <div class="unit">bits (${stats.compressed_size_bytes} bytes)</div>
        </div>
        <div class="stat-card highlight">
            <h3>Compression Ratio</h3>
            <div class="value">${stats.compression_ratio}%</div>
            <div class="unit">Saved</div>
        </div>
        <div class="stat-card">
            <h3>Space Saved</h3>
            <div class="value">${stats.space_saved_bits}</div>
            <div class="unit">bits</div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    document.execCommand('copy');
    showSuccess('Copied to clipboard!');
}

// Use example
function useExample(text) {
    document.getElementById('inputText').value = text;
    encode();
}

// Clear all
function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('binaryToDecode').value = '';
    document.getElementById('encodedText').value = '';
    document.getElementById('decodedText').value = '';
    clearResults();
    currentCodes = {};
    currentFrequency = {};
    currentTree = null;
}

// Clear results
function clearResults() {
    document.getElementById('frequencyTable').innerHTML = '<p class="empty-state">Enter text and click Encode to see analysis</p>';
    document.getElementById('codesTable').innerHTML = '<p class="empty-state">Codes will appear after encoding</p>';
    document.getElementById('statsContainer').innerHTML = '<p class="empty-state">Statistics will appear after encoding</p>';
    
    const canvas = document.getElementById('treeCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Show error message
function showError(message) {
    alert(`❌ Error: ${message}`);
}

// Show success message
function showSuccess(message) {
    console.log(`✅ ${message}`);
    // Optional: Add a toast notification here
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up canvas
    const canvas = document.getElementById('treeCanvas');
    canvas.width = 1000;
    canvas.height = 500;
});

// Allow Enter key in input fields
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inputText').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            encode();
        }
    });
    
    document.getElementById('binaryToDecode').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            decode();
        }
    });
});
