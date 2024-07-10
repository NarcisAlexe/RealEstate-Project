import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [email, setEmail] = useState("");
    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState("");
    const [nrTel, setNrTel] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            // Perform the logic to fetch user data from the server
            try {
                const response = await fetch("http://localhost:5000/api/profile");
                const userData = await response.json();

                // Update state with user data
                setNume(userData.nume);
                setPrenume(userData.prenume);
                setUsername(userData.username);
                setEmail(userData.email);
                setNrTel(userData.nrTel);
                setPassword(userData.password);
                // Password is usually not retrieved from the server for security reasons
                // If you need it, make sure to handle it securely
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };

        // Call the loadUser function when the component mounts
        loadUser();
    }, []); // The empty dependency array ensures that this effect runs once when the component mounts

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // TODO: Implement the login logic here
        const response = await fetch("http://localhost:5000/api/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword }),
        });

        if (response.ok) {
            // Update isLoggedIn state to true upon successful login
            console.log("Password changed successfuly!");
            navigate('/');
        } else {
            // Handle failed login
            console.error("Failed to change the password!");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        // TODO: Implement the login logic here
        const response = await fetch("http://localhost:5000/api/delete-user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            // Update isLoggedIn state to true upon successful login
            console.log("User deleted successfuly!");
            navigate('/');
        } else {
            // Handle failed login
            console.error("Failed to delete the user!");
        }
    };









    // useEffect(() => {
    //     const loadReviews = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:5000/api/user-reviews?user_id=${userData.IdUser}`);
    //             const reviewsData = await response.json();
    //             setReviews(reviewsData.Reviews);
    //         } catch (error) {
    //             console.error("Eroare la încărcarea recenziilor utilizatorului:", error);
    //         }
    //     };
    
    //     // Verifică dacă userData conține un IdUser valid înainte de a apela loadReviews
    //     if (userData && userData.IdUser) {
    //         loadReviews();
    //     }
    // }, [userData]); // Acest efect va rula ori de câte ori userData se schimbă
    







    return (
        <>
            <NavBar />
            <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="6" className="mb-4 mb-lg-0">
                            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                <MDBRow className="g-0">
                                    <MDBCol md="4" className="gradient-custom text-center text-white"
                                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                        <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                            alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                        <MDBTypography tag="h5" style={{ color: "black" }}>{nume} {prenume}</MDBTypography>
                                        <MDBCardText>Web Designer</MDBCardText>
                                        <MDBIcon far icon="edit mb-5" />
                                    </MDBCol>
                                    <MDBCol md="8">
                                        <MDBCardBody className="p-4">
                                            <MDBTypography tag="h6">Information</MDBTypography>
                                            <hr className="mt-0 mb-4" />
                                            <MDBRow className="pt-1">
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Email</MDBTypography>
                                                    <MDBCardText className="text-muted">{email}</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Phone</MDBTypography>
                                                    <MDBCardText className="text-muted">{nrTel}</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Username</MDBTypography>
                                                    <MDBCardText className="text-muted">{username}</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Password</MDBTypography>
                                                    <MDBCardText className="text-muted">{password}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCardBody>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>











                    <form onSubmit={handlePasswordChange}>
                        <label>New password</label>
                        <input
                            type="password"
                            placeholder="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        ></input>
                        <button type="submit">Change password</button>
                    </form>
                    <form onSubmit={handleDelete}>
                        <button type="submit">Delete account</button>
                    </form>












                </MDBContainer>
            </section>















{/* Adăugați o secțiune pentru a afișa recenziile */}
<div>
    <h3>Recenziile Utilizatorului</h3>
    <ul>
        {reviews && reviews.map((review) => (
            <li key={review.IDRecenzie}>
                <strong>Rating:</strong> {review.Rating} | <strong>Comentariu:</strong> {review.Comentariu} | <strong>Proprietate:</strong> {review.AdresaProprietate}
            </li>
        ))}
    </ul>
</div>
        </>
    );
}

export default Profile;

