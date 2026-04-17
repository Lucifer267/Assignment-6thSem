#!/bin/bash

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting Huffman Coding Visualizer..."
echo ""
echo "Opening browser at http://localhost:5000"
echo ""
python app.py
