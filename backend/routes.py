from flask import Flask, request, jsonify
from notification import Notification
app = Flask(__name__)

@app.route('/session/create/send_notification', methods=['POST'])
def send_session_create_notification():
    data = request.json
    tutor_email = data.get('tutor_email')
    user_email = data.get('user_email')
    date = data.get('date')
    
    Notification.session_create(tutor_email, user_email, date)
    return jsonify({"status": "Notification sent successfully"})

@app.route('/session/modify/send_notification', methods=['POST'])
def send_session_modification_notification():
    data = request.json
    tutor_email = data.get('tutor_email')
    user_email = data.get('user_email')
    date = data.get('date')
    
    Notification.session_modify(tutor_email, user_email, date)
    return jsonify({"status": "Notification sent successfully"})

@app.route('/session/cancel/send_notification', methods=['POST'])
def send_session_cancellation_notification():
    data = request.json
    tutor_email = data.get('tutor_email')
    user_email = data.get('user_email')
    date = data.get('date')
    
    Notification.session_cancel(tutor_email, user_email, date)
    return jsonify({"status": "Notification sent successfully"})