import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS
from Connect import connect_to_database, execute_query, close_connection, execute_non_query

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"])
app.config['PROPAGATE_EXCEPTIONS'] = True  # Enable exception propagation





@app.route('/api/fetchUserTable', methods=['GET'])
def fetch_user_table():
    try:
        # Connect to the database
        conn = connect_to_database()

        # Execute a SELECT query for the User table
        query = "SELECT * FROM [User]"
        results = execute_query(conn, query)

        # Convert the results to a list of lists
        user_table_data = [list(row) for row in results]

        # Serialize the data to JSON
        json_data = jsonify(user_table_data)

        # Return the JSON data
        return json_data

    except Exception as e:
        # Print the error message and traceback to console
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()

        # Prepare a detailed error response
        error_response = {
            "error": "Internal Server Error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }

        # Return the detailed error response to the client
        return jsonify(error_response), 500

    finally:
        # Close the database connection
        close_connection(conn)





@app.route('/api/addUserData', methods=['POST'])
def handle_add_user_data():
    try:
        # Parse JSON data from the request
        data = request.get_json()
        # Assuming data has the necessary fields (Nume, Prenume, etc.)

        # Connect to the database
        conn = connect_to_database()

        # Execute the INSERT query
        query = "INSERT INTO [User] (Nume, Prenume, Username, Email, NrTelefon, Parola) VALUES (?, ?, ?, ?, ?, ?)"
        values = (data['Nume'], data['Prenume'], data['Username'], data['Email'], data['NrTelefon'], data['Parola'])

        # Use context manager to ensure proper closing of the cursor
        with conn.cursor() as cursor:
            cursor.execute(query, values)
            conn.commit()

        # Return success response
        return jsonify({"success": True}), 200

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Close the database connection
        close_connection(conn)





@app.route('/api/deleteUserData/<int:user_id>', methods=['DELETE'])
def delete_user_data(user_id):
    try:
        print(f"Attempting to delete user with ID: {user_id}")

        # Connect to the database
        conn = connect_to_database()

        # Execute the DELETE query using parameterized query
        query = "DELETE FROM [User] WHERE IdUser = ?"
        values = (user_id,)

        execute_non_query(conn, query, values)

        # Return success response
        return jsonify({"success": True}), 200

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Close the database connection
        close_connection(conn)





@app.route('/api/fetchUserData/<int:user_id>', methods=['GET'])
def fetch_user_data(user_id):
    try:
        conn = connect_to_database()
        query = "SELECT * FROM [User] WHERE IdUser = ?"
        values = (user_id,)
        print("Executing query...")
        result = execute_query(conn, query, values)
        print("Query executed")

        if result:
            user_data = list(result[0])
            print("User data found:", user_data)
            return jsonify(user_data)

        print("User not found")
        return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

    finally:
        close_connection(conn)





# Adăugăm o rută pentru actualizarea datelor utilizatorului
@app.route('/api/updateUserData/<int:user_id>', methods=['PUT'])
def update_user_data(user_id):
    try:
        conn = connect_to_database()
        print(f'Attempting to update user data for user ID: {user_id}')
        # Obținem noile date din corpul cererii JSON
        new_data = request.get_json().get('newData', {})

        # Creăm lista de valori pentru interogare
        values = tuple(new_data.values()) + (user_id,)

        # Construim interogarea
        query = """
            UPDATE [User]
            SET Nume = ?, Prenume = ?, Username = ?, Email = ?, NrTelefon = ?, Parola = ?
            WHERE IdUser = ?
        """

        print('Query:', query)
        print('Values:', values)

        execute_non_query(conn, query, values)
        conn.commit()

        print('User data updated successfully')
        return jsonify({"message": "User data updated successfully"})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            close_connection(conn)





if __name__ == '__main__':
    app.run(debug=True)
