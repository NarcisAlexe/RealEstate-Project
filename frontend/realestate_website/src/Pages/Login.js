import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import "./Login.css";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("d@e.com");
    const [password, setPassword] = useState("1");
    const [idUser, setIdUser] = useState("");
    const { login } = useAuth() || {};
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email && !password) {
            console.log("The e-mail and password fields are empty. Fill in first!");
            return;
        }
        else {
            if (!password) {
                console.log("The password field is empty. Fill in first!");
                return;
            }
            else {
                if (!email) {
                    console.log("The e-mail field is empty. Fill in first!");
                    return;
                }
            }
        }


        // TODO: Implement the login logic here
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, idUser }),
        });

        if (response.ok) {
            // Update isLoggedIn state to true upon successful login
            login();
            console.log("Login successful!");
            navigate('/');
        } else {
            // Handle failed login
            console.error("Login failed!");
        }
    };

 
    return (
        <>
            <NavBar/>
            <form onSubmit={handleLogin}>
                <label>E-mail</label>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <label>Password</label>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button type="submit">Login</button>
                <div className="redirect-link">
                    <a href="/register">Don't have an account? Register here!</a>
                </div>
            </form>
        </>
    );
}

export default Login;
