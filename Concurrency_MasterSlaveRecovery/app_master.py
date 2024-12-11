from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from app.config_master import Config
from sqlalchemy import Column, String, Float, Date
from sqlalchemy.sql import text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# Configure session to use repeatable read isolation level
from sqlalchemy import create_engine
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)

class Game(db.Model):
    __tablename__ = 'games'
    appid = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    price = Column(Float)
    releasedate_cleaned = Column(Date) 
    
@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/create', methods=['POST'])
def create_game():
    # Extract delay from request if exists
    delay_seconds = request.json.get('delay', 0)
    
    session = Session()
    try:
        # Set transaction isolation level to REPEATABLE READ
        session.execute(text("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ"))
        

        
        # Get the data from the request
        data = request.json
        appid = data.get('appid')
        name = data.get('name', '')
        price = data.get('price', '')
        releasedate_cleaned = data.get('releasedate_cleaned', datetime.now().strftime('%Y-%m-%d'))

        if not appid:
            session.close()
            return jsonify({"error": "appid is required"}), 400

        if price is None or price == '':
            price = 0.0

        if isinstance(releasedate_cleaned, str):
            try:
                releasedate_cleaned = datetime.strptime(releasedate_cleaned, '%Y-%m-%d').date()
            except ValueError:
                session.close()
                return jsonify({"error": "Invalid date format. Please use 'YYYY-MM-DD'"}), 400

        sql = "INSERT INTO steamGames (appid, name, price, releasedate_cleaned) VALUES (:appid, :name, :price, :releasedate_cleaned)"
        session.execute(text(sql), {
            'appid': appid,
            'name': name,
            'price': price,
            'releasedate_cleaned': releasedate_cleaned
        })

        # Simulate processing delay using SQL SLEEP
        session.execute(text(f"SELECT SLEEP({delay_seconds})"))
        session.commit()

        return jsonify({"message": "Game created successfully!"})
    
    except Exception as e:
        print(f"Unexpected error in /create: {e}")
        session.rollback()  # Rollback the transaction on error
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/read', methods=['GET'])
def read_games():
    # Extract delay from query parameters
    delay_seconds = int(request.args.get('delay', 0))
    
    session = Session()
    try:
        # Set transaction isolation level to REPEATABLE READ
        session.execute(text("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ"))
        
        # Simulate processing delay using SQL SLEEP
        session.execute(text(f"SELECT SLEEP({delay_seconds})"))
        
        # Change to use request.args for GET request
        appid = request.args.get('appid')
        name = request.args.get('name')
        price = request.args.get('price')
        
        base_query = "SELECT * FROM steamGames WHERE 1=1"
        params = {}

        if appid:
            base_query += " AND appid = :appid"
            params['appid'] = appid
        
        if name:
            base_query += " AND name LIKE :name"
            params['name'] = f"%{name}%"  
        
        if price:
            if price.startswith('<='):
                base_query += " AND price <= :price"
                params['price'] = float(price[2:])
            elif price.startswith('>='):
                base_query += " AND price >= :price"
                params['price'] = float(price[2:])
            elif price.startswith('<'):
                base_query += " AND price < :price"
                params['price'] = float(price[1:])
            elif price.startswith('>'):
                base_query += " AND price > :price"
                params['price'] = float(price[1:])
            else:
                # Exact price or partial match
                try:
                    exact_price = float(price)
                    base_query += " AND price = :price"
                    params['price'] = exact_price
                except ValueError:
                    base_query += " AND CAST(price AS CHAR) LIKE :price"
                    params['price'] = f"%{price}%"

        result = session.execute(text(base_query), params)
        
        columns = result.keys()
        games = [dict(zip(columns, row)) for row in result]
        
        if not games:
            session.close()
            return jsonify({"message": "No games found"}), 404
        
        return jsonify(games)

    except Exception as e:
        print(f"Error in /read: {e}")  
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/update', methods=['PUT'])
def update_game():
    # Extract delay from request
    delay_seconds = request.json.get('delay', 0)
    
    session = Session()
    try:
        # Set transaction isolation level to REPEATABLE READ
        session.execute(text("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ"))
        
        data = request.json
        appid = data.get('appid')
        name = data.get('name')  
        price = data.get('price')  

        if not appid:
            session.close()
            return jsonify({"error": "appid is required"}), 400

        if price == '':
            price = 0.0 

        try:
            price = float(price)
        except ValueError:
            session.close()
            return jsonify({"error": "Invalid price value"}), 400

        query = "UPDATE steamGames SET "
        params = {}

        if name:
            query += "name = :name, "
            params["name"] = name

        if price is not None:
            query += "price = :price, "
            params["price"] = price

        query = query.rstrip(', ')
        query += " WHERE appid = :appid"
        params["appid"] = appid

        session.execute(text(query), params)
        # Simulate processing delay using SQL SLEEP
        session.execute(text(f"SELECT SLEEP({delay_seconds})"))
        session.commit()
        return jsonify({"message": "Game updated successfully!"})

    except Exception as e:
        print(f"Error in /update: {e}")
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/delete', methods=['DELETE'])
def delete_game():
    # Extract delay from request
    delay_seconds = request.json.get('delay', 0)
    
    session = Session()
    try:
        # Set transaction isolation level to REPEATABLE READ
        session.execute(text("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ"))
        

        
        data = request.json
        appid = data.get('appid')

        if not appid:
            session.close()
            return jsonify({"error": "appid is required"}), 400

        sql = "DELETE FROM steamGames WHERE appid = :appid"
        session.execute(text(sql), {'appid': appid})
                # Simulate processing delay using SQL SLEEP
        session.execute(text(f"SELECT SLEEP({delay_seconds})"))
        session.commit()

        return jsonify({"message": "Game deleted successfully!"})

    except Exception as e:
        session.rollback() 
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/server-status', methods=['GET'])
def database_status():
    session = Session()
    try:
        # Querying from the central database (master)
        result = session.execute(text("SELECT DATABASE();"))
        master_db = [row[0] for row in result]
        return jsonify({"status": "connected", "database": master_db})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True,port=5000)