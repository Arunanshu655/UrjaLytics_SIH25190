from flask import Flask, request, jsonify
from pymongo import MongoClient
app = Flask(__name__)
# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase'] # Replace 'mydatabase' with your DB name
collection = db['mycollection'] # Replace 'mycollection' with your collection name