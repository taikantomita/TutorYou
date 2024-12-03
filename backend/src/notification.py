import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Class handles the email comunication for the session updates
class Notification:
    # Email configuration constants
    C_TUTORYOU_EMAIL = 'tutoryou.notification@gmail.com'
    C_TUTORYOU_PASSWORD = 'jmdd gaib wrgk qtqw'
    C_SMTP = 'smtp.gmail.com'
    C_PORT = 587

    session_date = None
    
    # Messages template for various different sessions
    message_data = {
        'create': {
            'subject': 'New Session Scheduled',
            'body': f'Session scheduled for {session_date}',
        },
        'modify': {
            'subject': 'Update To Session',
            'body': f'Session has been moved to {session_date}'
        },
        'cancel': {
            'subject': 'Session Canceled',
            'body': f'Session for {session_date} has been cancelled'
        }
    }

    # Sends an email notificiation
    @classmethod
    def send_message(cls, session_emails, session_date, modification_type):
        msg = MIMEMultipart()
        msg['From'] = cls.C_TUTORYOU_EMAIL
        msg['To'] = session_emails
        msg['Subject'] = cls.message_data[modification_type]['subject']
        body = cls.message_data[modification_type]['body']

        msg.attach(MIMEText(body, 'plain'))

        try:
            # Will establish SMTP connection
            with smtplib.SMTP(cls.C_SMTP, cls.C_PORT) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(cls.C_TUTORYOU_EMAIL, cls.C_TUTORYOU_PASSWORD)
                server.send_message(msg)
        except Exception as e:
            print(f"Error: {e}")
