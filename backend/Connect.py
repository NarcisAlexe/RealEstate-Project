import pyodbc as odbccon
import traceback

def connect_to_database():
    constring = r"DRIVER={ODBC Driver 11 for SQL Server}; Server=DESKTOP-TBSK0F4\SQLEXPRESS; Database=Sistem_Informatic_Agentie_Imobiliara; Trusted_Connection=yes; UID=narcis123; PWD=narcis123;charset=utf8"
    try:
        conn = odbccon.connect(constring)
        return conn
    except odbccon.Error as ex:
        print(ex)
        return None

def execute_query(connection, query, values=None, commit=False):
    try:
        cursor = connection.cursor()
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)

        if commit:
            connection.commit()

        # Verificați dacă cursorul are rezultate (doar pentru interogările SELECT)
        if cursor.description is not None:
            result = cursor.fetchall()
            return result

        return None

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        return None

    finally:
        cursor.close()

def execute_non_query(conn, query, values, commit=False):
    try:
        cursor = conn.cursor()
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)
        conn.commit()
        cursor.close()
    except odbccon.Error as ex:
        print(ex)
        conn.rollback()
    finally:
        close_connection(conn)


def close_connection(conn):
    try:
        conn.close()
    except odbccon.Error as ex:
        print(ex)


