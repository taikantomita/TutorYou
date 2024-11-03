from notifiers import get_notifier

class Notification:
    C_TUTORYOU_EMAIL = 'tutoryou.notification@gmail.com'
    C_TUTORYOU_PASSWORD = 'tutoryoupassword123!'

    @classmethod
    def session_create(cls, tutor_email, user_email, date):
        email = get_notifier('email')
        email.notify(
            to=f"{tutor_email}, {user_email}",
            subject='Session Scheduled',
            message=f'A session has been scheduled on {date}.',
            username=cls.C_TUTORYOU_EMAIL,
            password=cls.C_TUTORYOU_PASSWORD,
            host='smtp.gmail.com',
            port=587
        )

    @classmethod
    def session_modify(cls, tutor_email, user_email, date):
        email = get_notifier('email')
        email.notify(
            to=f"{tutor_email}, {user_email}",
            subject='Session Modification',
            message=f'A session has been changed to {date}.',
            username=cls.C_TUTORYOU_EMAIL,
            password=cls.C_TUTORYOU_PASSWORD,
            host='smtp.gmail.com',
            port=587
        )

    @classmethod
    def session_cancel(cls, tutor_email, user_email, date):
        email = get_notifier('email')
        email.notify(
            to=f"{tutor_email}, {user_email}",
            subject='Session Cancelation',
            message=f'A session has been cancelled.',
            username=cls.C_TUTORYOU_EMAIL,
            password=cls.C_TUTORYOU_PASSWORD,
            host='smtp.gmail.com',
            port=587
        )
