import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import "./Register.css"
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [nrTel, setNrTel] = useState("");
    const navigate = useNavigate();


    const handleRegistration = async (e) => {
        e.preventDefault();

        if (!nume && !prenume && !username && !email && !password && !confirmPass) {
            console.log("You need to fill in the fields first!");
            return;
        }
        if (!nume || !prenume || !username || !email || !password || !confirmPass) {
            console.log("One or more of the field/s is/are empty. Please fill in!");
            return;
        }

        if (password === confirmPass) {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nume, prenume, username, email, nrTel, password }),
            });

            if (response.ok) {
                console.log("Register successful!");
                navigate('/login');
            } else {
                // Handle failed login
                console.error("Registration failed! The is already a user with this email!");
            }
        }
        else {
            console.log("Please insert the same password in the 'Confirm password' field!");
            return;
        }

    };

    return (
        <>
            <NavBar />
            <form onSubmit={handleRegistration}>
                <label>First name:</label>
                <input
                    type="text"
                    placeholder="first name"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                ></input>
                <label>Last name:</label>
                <input
                    type="text"
                    placeholder="last name"
                    value={prenume}
                    onChange={(e) => setPrenume(e.target.value)}
                ></input>
                <label>Username:</label>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                ></input>
                <label>E-mail:</label>
                <input
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <label>Telefon:</label>
                <input
                    type="text"
                    placeholder="07** *** ***"
                    value={nrTel}
                    onChange={(e) => setNrTel(e.target.value)}
                ></input>
                <label >Password:</label>
                <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <label >Confirm Password:</label>
                <input
                    type="password"
                    placeholder="********"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                ></input>
                <button type="submit">Register</button>
                <div className="redirect-link">
                    <a href="/login">Already have an account? Log-in here! </a>
                </div>
            </form>
        </>
    )
}

export default Register;