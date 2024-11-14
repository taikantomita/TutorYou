class Sesssion:
    '''
    need to return json object
    '''

    @classmethod
    def get_sessions(user_id):
        '''
        SELECT ALL SESSIONS FOR USER
        '''

    @classmethod
    def create_session(user_id, tutor_id, date_time_stamp):
        '''
        INSERT INTO session(user_id, tutor_id, date_time_stamp)
        VALUES (user_id, tutor_id, date_time_stamp)
        '''

    @classmethod
    def modify_session(session_id, date_time_stamp):
        '''
        UPDATE session
        SET session_time = date_time_stamp
        WHERE session_id = session_id;
        '''

    @classmethod
    def cancel_session(session_id):
        '''
        UPDATE session
        SET is_canceled = TRUE
        WHERE session_id = session_id
        '''
