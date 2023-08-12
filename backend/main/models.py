from main import db, app
from datetime import datetime

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_title = db.Column(db.String(255), nullable=False, unique=True)
    upload_time = db.Column(db.DateTime, nullable=False, default=datetime.now)
    generated_video_id = db.Column(db.Integer, default=0, unique=True)

    def __repr__(self):
        return f"<Video {self.id}>"
    
class GeneratedVideo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_title = db.Column(db.String(255), nullable=False, unique=True)
    generated_time = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def __repr__(self):
        return f"<GeneratedVideo {self.id}>"

class transcript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, default=0, nullable=False)
    start_time = db.Column(db.Float, nullable=False)
    end_time = db.Column(db.Float)
    text = db.Column(db.String(2000), nullable=False)

with app.app_context():
    db.create_all()
    db.session.commit()