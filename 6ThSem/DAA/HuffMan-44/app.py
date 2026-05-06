from flask import Flask, render_template, request, jsonify
from huffman import HuffmanCoding
import json

app = Flask(__name__)
huffman = HuffmanCoding()


@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')


@app.route('/api/encode', methods=['POST'])
def encode():
    """Encode text using Huffman coding"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "Input text cannot be empty"}), 400
        
        huffman.reset()
        encoded, codes = huffman.encode(text)
        frequency = huffman.frequency
        stats = huffman.get_compression_stats(text, encoded)
        
        return jsonify({
            "success": True,
            "original_text": text,
            "encoded_text": encoded,
            "codes": codes,
            "frequency": frequency,
            "stats": stats,
            "unique_chars": len(frequency)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/decode', methods=['POST'])
def decode():
    """Decode text using Huffman codes"""
    try:
        data = request.json
        encoded_text = data.get('encoded_text', '').strip()
        codes = data.get('codes', {})
        
        if not encoded_text or not codes:
            return jsonify({"error": "Encoded text and codes are required"}), 400
        
        decoded = huffman.decode(encoded_text, codes)
        
        return jsonify({
            "success": True,
            "decoded_text": decoded,
            "encoded_text": encoded_text
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/visualize', methods=['POST'])
def visualize():
    """Get visualization data for the tree"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "Input text cannot be empty"}), 400
        
        huffman.reset()
        huffman.build_huffman_tree(text)
        huffman.generate_codes()
        
        frequency = huffman.frequency
        codes = huffman.codes
        
        # Build tree structure for visualization
        def build_tree_structure(node, depth=0):
            if node is None:
                return None
            
            return {
                "value": f"{node.char}" if node.char else f"({node.freq})",
                "freq": node.freq,
                "isLeaf": node.char is not None,
                "char": node.char,
                "depth": depth,
                "left": build_tree_structure(node.left, depth + 1) if node.left else None,
                "right": build_tree_structure(node.right, depth + 1) if node.right else None
            }
        
        tree_structure = build_tree_structure(huffman.root)
        
        return jsonify({
            "success": True,
            "tree": tree_structure,
            "frequency": frequency,
            "codes": codes,
            "unique_chars": len(frequency)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/stats', methods=['POST'])
def stats():
    """Get compression statistics"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "Input text cannot be empty"}), 400
        
        huffman.reset()
        encoded, _ = huffman.encode(text)
        stats = huffman.get_compression_stats(text, encoded)
        
        return jsonify({
            "success": True,
            "stats": stats
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
