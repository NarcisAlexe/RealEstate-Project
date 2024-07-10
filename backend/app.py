import traceback
import json
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from Connect import connect_to_database, execute_query, close_connection, execute_non_query
import base64

app = Flask(__name__)
app.secret_key = 'kabfkbskdbvj,sbjksbhvkhbcjvsjbv'
storeEmail = "abc"
storeIdUser = 0
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"])
app.config['PROPAGATE_EXCEPTIONS'] = True  # Enable exception propagation

@app.route("/api/properties")
def get_properties():
    try:
        conn = connect_to_database()
        category = request.args.get("category", None)
        price = request.args.get("price", None)
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") 
        print(category)
        print(price)
        
        # Construiește interogarea cu JOIN dacă este specificată o categorie
        query = """
            SELECT P.[IdProprietate], P.[Adresa], P.[Suprafata], P.[NumarCamere], P.[Pret]
            FROM [dbo].[Proprietate] P
            """
        
        if category:
            query += """
                JOIN [dbo].[Categorie] C ON P.IdCategorie = C.IdCategorie
                WHERE C.Nume_Categorie = ?
            """
            rows = execute_query(conn, query, category)
        else:
            rows = execute_query(conn, query)




        # Convertește rezultatele într-o listă de dicționare
        properties = []
        for row in rows:
            row_dict = {}
            for i in range(len(row.cursor_description)):
                key = row.cursor_description[i][0]
                value = row[i]
                row_dict[key] = value
            properties.append(row_dict)

        return jsonify(properties)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        close_connection(conn)


@app.route("/api/properties_fac_nmb/<int:id>/details", methods=["GET"])
def get_number_of_facilities(id):
    try:
        conn = connect_to_database()

        query = """
SELECT
    P.[IdProprietate],
    (
        SELECT COUNT([IdCaracteristica])
        FROM [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Proprietate_Caracteristica] CP
        WHERE CP.[IdProprietate] = P.[IdProprietate]
    ) AS NumarFacilitati
FROM
    [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Proprietate] P
WHERE
    P.[IdProprietate] = ?;
        """

        rows = execute_query(conn, query, id)
        print(rows[0])

        # Convertește rezultatele într-o listă de dicționare
        properties_with_facilities = []

        for row in rows:
            row_dict = {}
            for i in range(len(row.cursor_description)):
                key = row.cursor_description[i][0]
                value = row[i]
                row_dict[key] = value
            properties_with_facilities.append(row_dict)

        return jsonify(properties_with_facilities)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        close_connection(conn)


@app.route("/api/properties/<int:id>/details", methods=["GET"])
def get_properties_with_facilities(id):
    try:
        conn = connect_to_database()

        query = """
SELECT
    P.[IdProprietate],
    (
        SELECT COUNT([IdCaracteristica])
        FROM [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Proprietate_Caracteristica] CP
        WHERE CP.[IdProprietate] = P.[IdProprietate]
    ) AS NumarFacilitati,
    (
        SELECT STUFF((
            SELECT ', ' + C.[NumeCaracteristica]
            FROM [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Proprietate_Caracteristica] CP
            JOIN [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Caracteristica_Proprietate] C
            ON CP.[IdCaracteristica] = C.[IdCaracteristica]
            WHERE CP.[IdProprietate] = P.[IdProprietate]
            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '')
    ) AS NumeFacilitati
FROM
    [Sistem_Informatic_Agentie_Imobiliara].[dbo].[Proprietate] P
WHERE
    P.[IdProprietate] = ?;
        """

        rows = execute_query(conn, query, id)
        print(rows[0])

        # Convertește rezultatele într-o listă de dicționare
        properties_with_facilities = []

        for row in rows:
            row_dict = {}
            for i in range(len(row.cursor_description)):
                key = row.cursor_description[i][0]
                value = row[i]
                row_dict[key] = value
            properties_with_facilities.append(row_dict)

        return jsonify(properties_with_facilities)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        close_connection(conn)


@app.route("/api/my-properties")
def get_my_properties():
    try:
        conn = connect_to_database()

        idUser = storeIdUser

        query = """
        SELECT P.[IdProprietate], P.[Adresa], P.[Suprafata], P.[NumarCamere], P.[Pret]
        FROM [dbo].[Proprietate] AS P
        JOIN [dbo].[User] AS U ON P.IdUser = U.IdUser
        WHERE U.IdUser = ?
        """        
        rows = execute_query(conn, query, idUser)
        
        # Convertește rezultatele într-o listă de dicționare
        properties = []
        for row in rows:
            row_dict = {}
            for i in range(len(row.cursor_description)):
                key = row.cursor_description[i][0]
                value = row[i]
                row_dict[key] = value
            properties.append(row_dict)
        
        return jsonify(properties)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        close_connection(conn)


@app.route("/api/add_properties", methods=["POST"])
def add_propertie():
    global storeIdUser

    try:
        idUser = storeIdUser
        print("/////////////////")
        print(idUser)
        print("Functia a fost apelata cu succes!")
        conn = connect_to_database()
        data = request.get_json()
        print(data)

        category = data.get("category")
        print("Asta e categoria oroprietatii:")
        print(category)
        price = data.get("price")
        adress = data.get("adress")
        surfaceArea = data.get("surfaceArea")
        roomNmb = data.get("roomNmb")
        image = data.get("image")

        firstQuery = ("SELECT IdCategorie FROM [dbo].[Categorie] WHERE Nume_Categorie = ?")
        row = execute_query(conn, firstQuery, category)

        print("********************")
        print(row)

        idCategorie = row[0][0]
        print("$$$$$$$$$$$$$$$")
        print(idCategorie)

        secondQuery = ("INSERT INTO [dbo].[Proprietate] (IdCategorie, Pret, Adresa, Suprafata, NumarCamere, Imagine, IdUser) VALUES (?, ?, ?, ?, ?, ?, ?)")
        values = (idCategorie, price, adress, surfaceArea, roomNmb, image, idUser)
        print("11111111111111111")
        print(values)
        secondRow = execute_query(conn, secondQuery, values, commit=True)

        return jsonify(secondRow), 200
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print(f"Functia nu a fost apelata cu succes!")
    finally:
        close_connection(conn)


@app.route("/api/delete-propertie", methods=["GET", "POST", "DELETE"])
def delete_propertie():
    try:
        print("AICI INCEPE FUNCTIA DE DELETE PROPERTIE!")
        conn = connect_to_database()
        propertie_data = request.get_json()
        adress = propertie_data.get("adress")
        print(adress)

        query = "DELETE FROM [Proprietate] WHERE Adresa = ?"

        row = execute_query(conn, query, adress, commit=True)
        print(row)
        
        return jsonify(row), 200
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/edit-room-nmb", methods=["GET", "POST"])
def edit_room_nmb():
    try:
        print("AICI INCEPE FUNCTIA DE MODIFICARE A NR DE CAMERE!")
        conn = connect_to_database()
        propertie_data = request.get_json()
        adress = propertie_data.get("adress")
        newRoomNmb = propertie_data.get("newRoomNmb")
        print(adress)

        query = """
            UPDATE [Proprietate]
            SET NumarCamere = ?
            WHERE Adresa = ?
        """
        row = execute_query(conn, query, (newRoomNmb, adress), commit=True)
        print(row)
        
        return jsonify(row), 200
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/login", methods=["POST"])
def do_login():
    global storeEmail
    global storeIdUser
    try:
        #Conectare la baza de date
        conn = connect_to_database()
        #Obtinerea datelor preluate din pagina
        data = request.get_json()
        email = data.get("email")
        print( email )
        password = data.get("password")
        print( password )

        #crearea query-ului ce v-a verifica existenta utilizatorului
        query = "SELECT * FROM [dbo].[User] WHERE Email = ? AND Parola = ?"
        row = execute_query(conn, query, (email, password))
        print( row )
        idUser = row[0][0]
        storeIdUser = idUser
        print("Asta e id ul userului care s a logat!")
        print(idUser)

        if row:
            storeEmail = email

            print("Utilizatorul există. Logare reușită!")
            # TODO: Returnează un răspuns de succes către frontend
            return jsonify({"message": "Login successful"}), 200
        else:
            print("Utilizatorul nu există. Logare eșuată!")
            # TODO: Returnează un mesaj de eroare către frontend
            return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print(f"Functia nu a fost apelata cu succes!")
        return jsonify({"error": "Login failed"}), 500
    finally:
        close_connection(conn)


@app.route("/api/profile", methods=["GET", "POST"])
def show_user():
    try:
        conn = connect_to_database()

        # Retrieve email from the session
        email = storeEmail

        if email:
            # Use the email in your query
            query = "SELECT [Nume], [Prenume], [Username], [NrTelefon], [Parola] FROM [dbo].[User] WHERE Email = ?"
            row = execute_query(conn, query, email)

            if row:
                # Process the result and return a JSON response
                user_data = {
                    'nume': row[0][0],
                    'prenume': row[0][1],
                    'username': row[0][2],
                    'email': email,
                    'nrTel': row[0][3],
                    'password': row[0][4],
                }
                return jsonify(user_data), 200
            else:
                return jsonify({"message": "User not found"}), 404
        else:
            return jsonify({"message": "Email not found in session"}), 401

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/change-password", methods=["GET", "POST"])
def change_password():
    try:
        print("AICI INCEPE FUNCTIA DE CHANGE PASSWORD!")
        conn = connect_to_database()
        user_data = request.get_json()
        email = user_data.get("email")
        newPassword = user_data.get("newPassword")
        print(email)
        print(newPassword)

        query = """
            UPDATE [User]
            SET Parola = ?
            WHERE Email = ?
        """
        row = execute_query(conn, query, (newPassword, email), commit=True)
        print(row)
        
        return jsonify(row), 200
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/delete-user", methods=["GET", "POST", "DELETE"])
def delete_user():
    try:
        print("AICI INCEPE FUNCTIA DE CHANGE PASSWORD!")
        conn = connect_to_database()
        user_data = request.get_json()
        email = user_data.get("email")
        print(email)

        query = "DELETE FROM [User] WHERE Email = ?"

        row = execute_query(conn, query, email, commit=True)
        print(row)
        
        return jsonify(row), 200
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/register", methods=["GET", "POST"])
def add_user():
    try:
        conn = connect_to_database()
        user_data = request.get_json()


        nume = user_data.get("nume")
        prenume = user_data.get("prenume")
        username = user_data.get("username")
        email = user_data.get("email")
        password = user_data.get("password")
        nrTel = user_data.get("nrTel")

        queryToCheck = "SELECT * FROM [dbo].[User] WHERE Email = ?"
        valuesToCheck = email

        userToCheck = execute_query(conn, queryToCheck, valuesToCheck)

        if userToCheck:
            return jsonify({"message": "User already exist!"}), 401
        else:
            query = "INSERT INTO [dbo].[User] (Nume, Prenume, Username, Email, NrTelefon, Parola) VALUES (?, ?, ?, ?, ?, ?)"
            values = (nume, prenume, username, email, nrTel, password)

            row = execute_query(conn, query, values, commit=True)
            
            return jsonify(row), 200
    except Exception as e:
        print(f"An error occured: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500
    finally:
        close_connection(conn)


@app.route("/api/users-and-reviews", methods=["GET"])
def get_users_and_reviews():
    try:
        conn = connect_to_database()

        query = """
            SELECT
                U.IdUser,
                U.Nume,
                U.Prenume,
                R.IDRecenzie,
                R.Rating,
                R.Comentariu,
                P.Adresa AS AdresaProprietate
            FROM
                [dbo].[User] U
            LEFT JOIN
                [dbo].[Recenzie] R ON U.IdUser = R.IDUser
            LEFT JOIN
                [dbo].[Proprietate] P ON R.IDProprietate = P.IdProprietate
            """

        rows = execute_query(conn, query)

        users_and_reviews = []

        for row in rows:
            user_dict = {
                'IdUser': row[0],
                'Nume': row[1],
                'Prenume': row[2],
                'Reviews': []
            }

            # Check if the user has a review
            if row[3] is not None:
                review_dict = {
                    'IDRecenzie': row[3],
                    'Rating': row[4],
                    'Comentariu': row[5],
                    'AdresaProprietate': row[6]
                }

                user_dict['Reviews'].append(review_dict)

            users_and_reviews.append(user_dict)

        return jsonify(users_and_reviews)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        close_connection(conn)


@app.route("/api/properties-and-categories", methods=["GET"])
def get_properties_and_categories():
    try:
        conn = connect_to_database()

        query = """
            SELECT
                P.IdProprietate,
                P.Adresa,
                P.Suprafata,
                P.NumarCamere,
                P.Pret,
                C.Nume_Categorie
            FROM
                [dbo].[Proprietate] P
            LEFT JOIN
                [dbo].[Categorie] C ON P.IdCategorie = C.IdCategorie
        """

        rows = execute_query(conn, query)

        properties_and_categories = []

        for row in rows:
            property_dict = {
                'IdProprietate': row[0],
                'Adresa': row[1],
                'Suprafata': row[2],
                'NumarCamere': row[3],
                'Pret': row[4],
                'NumeCategorie': row[5]
            }

            properties_and_categories.append(property_dict)

        return jsonify(properties_and_categories)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        close_connection(conn)


@app.route("/api/user-reviews", methods=["GET"])
def get_user_reviews():
    try:
        conn = connect_to_database()

        # Se ia ID-ul utilizatorului din parametrul de cerere
        user_id = request.args.get("user_id")

        query = """
            SELECT
                U.Nume,
                U.Prenume,
                R.IDRecenzie,
                R.Rating,
                R.Comentariu,
                P.Adresa AS AdresaProprietate
            FROM
                [dbo].[User] U
            LEFT JOIN
                [dbo].[Recenzie] R ON U.IdUser = R.IDUser
            LEFT JOIN
                [dbo].[Proprietate] P ON R.IDProprietate = P.IdProprietate
            WHERE
                U.IdUser = ?
        """

        rows = execute_query(conn, query, user_id)

        user_reviews = {
            'Nume': rows[0][0],
            'Prenume': rows[0][1],
            'Reviews': []
        }

        for row in rows:
            if row[2] is not None:
                review_dict = {
                    'IDRecenzie': row[2],
                    'Rating': row[3],
                    'Comentariu': row[4],
                    'AdresaProprietate': row[5]
                }

                user_reviews['Reviews'].append(review_dict)

        return jsonify(user_reviews)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        close_connection(conn)


if __name__ == '__main__':
    app.run(debug=True)
