from flask import Flask, request, jsonify
from notification import Notification

app = Flask(__name__)


def process_notification(action):
    data = request.json
    tutor_email = data.get('tutor_email')
    user_email = data.get('user_email')
    date = data.get('date')

    # Call the appropriate method on Notification based on the action
    if action == 'create':
        Notification.session_create(tutor_email, user_email, date)
    elif action == 'modify':
        Notification.session_modify(tutor_email, user_email, date)
    elif action == 'cancel':
        Notification.session_cancel(tutor_email, user_email, date)

    return jsonify({"status": f"Notification {action} sent successfully"})


@app.route('/session/create/send_notification', methods=['POST'])
def send_create_notification():
    return process_notification('create')


@app.route('/session/modify/send_notification', methods=['POST'])
def send_modify_notification():
    return process_notification('modify')


@app.route('/session/cancel/send_notification', methods=['POST'])
def send_cancel_notification():
    return process_notification('cancel')
