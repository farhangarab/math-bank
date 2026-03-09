import os
class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:password@localhost/mathbank"
    SQLALCHEMY_TRACK_MODIFICATIONS = False