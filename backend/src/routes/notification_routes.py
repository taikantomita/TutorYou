from flask import Flask, jsonify
from notification import Notification
from session import Session

app = Flask(__name__)


# Function processes and sends the notification
def process_notification(session, action):
    session = Session.get_session(session)
    Notification.send_message(session_emails=list(
        session.user_email,
        session.tutor_email),
        session_date=session.date,
        modification_type=action)
    return jsonify({"status": f"Notification {action} sent successfully"})


@app.route('/<session>/<action>/send_notification', methods=['POST'])
def send_notification(session, action):
    return process_notification(session, action)
