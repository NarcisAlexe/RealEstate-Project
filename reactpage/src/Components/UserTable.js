import React, { useState, useEffect } from 'react';
import './UserTable.css';

const UserTable = () => {
  const [userData, setUserData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [addFormData, setAddFormData] = useState({
    Nume: '',
    Prenume: '',
    Username: '',
    Email: '',
    NrTelefon: '',
    Parola: '',
  });
  const [editFormData, setEditFormData] = useState({
    Nume: '',
    Prenume: '',
    Username: '',
    Email: '',
    NrTelefon: '',
    Parola: '',
  });
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetchUserTable');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUserData(data);
        setShowTable(true);
      } else {
        console.error('Failed to fetch data from the server');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e, formType) => {
    const updatedFormData = {
      ...(formType === 'add' ? addFormData : editFormData),
      [e.target.name]: e.target.value,
    };

    formType === 'add' ? setAddFormData(updatedFormData) : setEditFormData(updatedFormData);
  };

  const handleAddData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/addUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
        credentials: 'include',
      });

      if (response.ok) {
        fetchData();
        setAddFormData({
          Nume: '',
          Prenume: '',
          Username: '',
          Email: '',
          NrTelefon: '',
          Parola: '',
        });
      } else {
        console.error('Failed to add data to the server');
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleDelete = async (userId) => {
    console.log('Attempting to delete user with ID:', userId);

    if (!userId) {
      console.error('User ID is undefined or null');
      return;
    }

    const isConfirmed = window.confirm('Sigur doriți să ștergeți acest utilizator?');

    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/deleteUserData/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          console.log('User deleted successfully');
          fetchData();
        } else {
          const errorData = await response.json();
          console.error('Failed to delete user from the server:', errorData);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = async (userId) => {
    setEditMode(true);
    setUserId(userId);

    try {
      console.log('Attempting to fetch user data for edit:', userId);
      const response = await fetch(`http://localhost:5000/api/fetchUserData/${userId}`);
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data for edit:', data);
        setEditFormData({
          Nume: data[1],
          Prenume: data[2],
          Username: data[3],
          Email: data[4],
          NrTelefon: data[5],
          Parola: data[6],
        });
      } else {
        console.error('Failed to fetch user data for edit');
      }
    } catch (error) {
      console.error('Error fetching user data for edit:', error);
    }
  };

  const handleSave = async () => {
    try {
      const isConfirmed = window.confirm('Sigur doriți să salvați modificările?');
  
      if (!isConfirmed) {
        console.log('User cancelled the update');
        return;
      }
  
      console.log('Attempting to update user data:', userId);
      console.log('Data to be sent:', editFormData);
  
      const response = await fetch(`http://localhost:5000/api/updateUserData/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newData: editFormData }),
        credentials: 'include',
      });
  
      console.log('Update response:', response);
  
      if (response.ok) {
        console.log('User data updated successfully');
        // Restul codului pentru tratarea cazului de succes
        fetchData();
      } else {
        console.error('Failed to update user data');
        const errorData = await response.json();
        console.error('Error data:', errorData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    const isConfirmed = window.confirm('Sigur doriți să anulați aceste modificări?');
    if (isConfirmed) {
      setEditMode(false);
    }
  };

  // useEffect(() => {
  //   // Nu apelăm fetchData() aici pentru a evita afișarea automată a tabelului la încărcarea paginii
  // }, []);

  return (
    <div>
      <h2>Users</h2>

      <button onClick={fetchData}>Fetch User Table</button>

      {showTable && (
        <div>
          <h3>Add Data:</h3>
          <form className='form-container'>
            {Object.keys(addFormData).map((key) => (
              <div key={key}>
                <label htmlFor={key}>{key}: </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={addFormData[key]}
                  onChange={(e) => handleInputChange(e, 'add')}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddData}>
              Add Data
            </button>
          </form>
          {editMode && (
            <div>
              <h3>Edit Data:</h3>
              <form className='form-container'>
                {Object.keys(editFormData).map((key) => (
                  <div key={key}>
                    <label htmlFor={key}>{key}: </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={editFormData[key]}
                      onChange={(e) => handleInputChange(e, 'edit')}
                    />
                  </div>
                ))}
                <button type="button" onClick={handleSave}>
                  Save
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </form>
            </div>
          )}
          <h3>User Table Data:</h3>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nume</th>
                <th>Prenume</th>
                <th>Username</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Parola</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, rowIndex) => (
                <tr key={rowIndex}>
                  {user.map((data, colIndex) => (
                    <td key={colIndex}>{data}</td>
                  ))}
                  <td>
                    <button onClick={() => handleDelete(user[0])}>Delete</button>
                    <button onClick={() => handleEdit(user[0])}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
        </div>
      )}
    </div>
  );
};

export default UserTable;



































































