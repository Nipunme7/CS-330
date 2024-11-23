import sqlite3

def init_db():
    connection = sqlite3.connect('geo.db')
    with open('schema.sql') as f:
        connection.executescript(f.read())
    
    # Add some sample data
    cur = connection.cursor()
    
    # Add countries
    cur.execute("INSERT INTO country (name, continental_region, subregion) VALUES (?, ?, ?)",
                ('United States', 'Americas', 'Northern America'))
    
    # Add more data as needed...
    
    connection.commit()
    connection.close()

if __name__ == '__main__':
    init_db() 