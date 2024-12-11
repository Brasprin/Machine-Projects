class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root2:VDxdc5yWSYNtjv8hXaJ27bP4@ccscloud.dlsu.edu.ph:20142/steamGames"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_BINDS = {
        'node2': 'mysql+pymysql://root2:VDxdc5yWSYNtjv8hXaJ27bP4@ccscloud.dlsu.edu.ph:20142/steamGames'  
    }
