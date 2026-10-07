import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    connection = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )
    return connection


if __name__ == "__main__":
    connection = get_connection()

    if connection.is_connected():
        print("Database connection successful!")

    connection.close()
    print("Database connection closed.")