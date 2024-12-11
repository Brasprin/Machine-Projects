class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root2:VDxdc5yWSYNtjv8hXaJ27bP4@ccscloud.dlsu.edu.ph:20122/steamGames"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_BINDS = {
        'master': 'mysql+pymysql://root2:VDxdc5yWSYNtjv8hXaJ27bP4@ccscloud.dlsu.edu.ph:20122/steamGames'  
    }
