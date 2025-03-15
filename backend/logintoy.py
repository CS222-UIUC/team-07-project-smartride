from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Predefined user data (toy example)
users = {
    "user1@example.com": {
        "password": "password1",  # In production, always hash your passwords!
        "name": "User One"
    },
    "user2@example.com": {
        "password": "password2",
        "name": "User Two"
    }
}

@app.route('/login', methods=['POST'])
def login():
    print("debug, whether reached backend")
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    user = users.get(email)
    if user and user['password'] == password:
        return jsonify({
            "message": "Login successful",
            "user": user["name"]
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
