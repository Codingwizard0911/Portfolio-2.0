from flask import Flask, request, jsonify, render_template
import MySQLdb

app = Flask(__name__)

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '90421'
app.config['MYSQL_DB'] = 'portfolio_db'

# Connect to DB
def get_db():
    return MySQLdb.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        passwd=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB']
    )
import os

# Initialize the Flask app and specify the location of templates (Portfolio folder)
app = Flask(__name__, template_folder=os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'Portfolio'))

@app.route('/')
def home():
    return render_template('index.html')  # Render the index.html from the Portfolio folder

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.form
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        ip = request.remote_addr

        if not all([name, email, subject, message]):
            return jsonify(success=False, message="All fields are required"), 400

        db = get_db()
        cursor = db.cursor()

        cursor.execute("""CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            subject VARCHAR(200),
            message TEXT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cursor.execute("INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (%s, %s, %s, %s, %s)",
                       (name, email, subject, message, ip))
        db.commit()
        cursor.close()
        db.close()

        return jsonify(success=True, message="Message received. I'll respond soon!")
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
