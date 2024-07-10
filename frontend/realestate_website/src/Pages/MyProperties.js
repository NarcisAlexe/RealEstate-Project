import React from "react";
import NavBar from "../Components/NavBar";
import { useState, useEffect } from "react";
import MyPropertie from "../Components/MyPropertie.js";
import "./MyProperties.css";



const MyProperties = () => {

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/my-properties")
            .then((response) => response.json())
            .then((data) => setProperties(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <>
            <NavBar />
            <h1>MY PROPERTIES!</h1>
            <div className="properties-container">
        {properties.map((property) => (
          <MyPropertie
            key={property.IdProprietate}
            id={property.IdProprietate}
            adress={property.Adresa}
            roomnmb={property.NumarCamere}
            surface={property.Suprafata}
            price={property.Pret}
            // Adaugă clasa pentru stilurile definite anterior
            className="propertie"
          />
        ))}
      </div>
        </>
    )
}

export default MyProperties;

