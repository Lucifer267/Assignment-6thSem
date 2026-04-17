import heapq
from collections import defaultdict, Counter
from typing import Dict, Tuple, Optional


class Node:
    """Node for Huffman Tree"""
    def __init__(self, char: Optional[str] = None, freq: int = 0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right
    
    def __lt__(self, other):
        return self.freq < other.freq
    
    def __repr__(self):
        return f"Node({self.char}, {self.freq})"


class HuffmanCoding:
    """Simple and elegant Huffman Coding implementation"""
    
    def __init__(self):
        self.root = None
        self.codes = {}
        self.reverse_codes = {}
        self.frequency = {}
        self.tree_nodes = []  # Track nodes for visualization
    
    def build_frequency_table(self, text: str) -> Dict[str, int]:
        """Build frequency table from input text"""
        self.frequency = dict(Counter(text))
        return self.frequency
    
    def build_huffman_tree(self, text: str) -> Node:
        """Build Huffman tree from text"""
        self.build_frequency_table(text)
        
        if not self.frequency:
            return None
        
        # Create leaf nodes
        heap = []
        for char, freq in self.frequency.items():
            node = Node(char=char, freq=freq)
            heapq.heappush(heap, node)
            self.tree_nodes.append({"char": char, "freq": freq, "type": "leaf"})
        
        # Build tree by combining nodes
        while len(heap) > 1:
            left = heapq.heappop(heap)
            right = heapq.heappop(heap)
            
            parent = Node(freq=left.freq + right.freq, left=left, right=right)
            heapq.heappush(heap, parent)
            
            self.tree_nodes.append({
                "freq": parent.freq,
                "type": "internal",
                "left_char": left.char if left.char else f"({left.freq})",
                "right_char": right.char if right.char else f"({right.freq})"
            })
        
        self.root = heap[0] if heap else None
        return self.root
    
    def generate_codes(self, node: Optional[Node] = None, code: str = "") -> Dict[str, str]:
        """Generate Huffman codes for each character"""
        if node is None:
            node = self.root
            self.codes = {}
        
        if node is None:
            return self.codes
        
        # Leaf node
        if node.char is not None:
            self.codes[node.char] = code if code else "0"
            return self.codes
        
        # Internal node
        if node.left:
            self.generate_codes(node.left, code + "0")
        if node.right:
            self.generate_codes(node.right, code + "1")
        
        return self.codes
    
    def encode(self, text: str) -> Tuple[str, Dict]:
        """Encode text using Huffman coding"""
        self.build_huffman_tree(text)
        self.generate_codes()
        
        if not self.codes:
            return "", {}
        
        encoded = "".join(self.codes.get(char, "") for char in text)
        self.reverse_codes = {v: k for k, v in self.codes.items()}
        
        return encoded, self.codes
    
    def decode(self, encoded_text: str, codes: Dict[str, str]) -> str:
        """Decode encoded text using Huffman codes"""
        if not encoded_text or not codes:
            return ""
        
        self.reverse_codes = {v: k for k, v in codes.items()}
        decoded = []
        current_code = ""
        
        for bit in encoded_text:
            current_code += bit
            if current_code in self.reverse_codes:
                decoded.append(self.reverse_codes[current_code])
                current_code = ""
        
        return "".join(decoded)
    
    def get_compression_stats(self, original_text: str, encoded_text: str) -> Dict:
        """Calculate compression statistics"""
        original_size = len(original_text) * 8  # bits
        compressed_size = len(encoded_text)
        
        return {
            "original_size_bits": original_size,
            "original_size_bytes": len(original_text),
            "compressed_size_bits": compressed_size,
            "compressed_size_bytes": (compressed_size + 7) // 8,
            "compression_ratio": round((1 - compressed_size / original_size) * 100, 2) if original_size > 0 else 0,
            "space_saved_bits": original_size - compressed_size
        }
    
    def reset(self):
        """Reset the coder"""
        self.root = None
        self.codes = {}
        self.reverse_codes = {}
        self.frequency = {}
        self.tree_nodes = []
