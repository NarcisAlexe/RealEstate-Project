import React from "react";
import "./MyPropertie.css";
import { useNavigate } from "react-router-dom";
import poza1 from '../Components/EstatesImages/poza1.jpg';

const Propertie = ({ id, adress, roomnmb, surface, price, image }) => {
    const navigate = useNavigate();

    const handleDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/properties/${id}/details`);
            const data = await response.json();

            if (response.ok) {
                console.log("Server response:", data); // For debugging
                console.log("Total facilities:", data[0].NumarFacilitati);
                console.log("Facility names:", data[0].NumeFacilitati);

                // You can use the data as needed, for example, navigate to the detailed page
                navigate(`/detailed?id=${id}`);
            } else {
                console.error("Failed to fetch facilities! Server response:", data);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const formattedPrice = price.toLocaleString(); // Formatare implicită

    return (
        <div className="propertie-container">
            <div className="info-photo">
                <div className="info">
                    <h3 className="adress">{adress}</h3>
                    <br></br>
                    <ul>
                        <li><h4>Surface: {surface} m<sup>2</sup></h4></li>
                        <li><h4>Number of rooms: {roomnmb}</h4></li>
                        <li><h4>Price: {formattedPrice} &euro;</h4></li>
                    </ul>
                </div>
                <img id="prop-photo" src={poza1} alt="Estate"/>
            </div>
            <div className="buttons">
                <button className="prop-but" onClick={handleDetails}>Details</button>
            </div>
        </div>
    );
};

export default Propertie;

