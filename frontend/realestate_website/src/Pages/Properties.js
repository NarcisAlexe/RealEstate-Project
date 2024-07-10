import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Propertie from "../Components/Propertie";
import "./Properties.css";
import SearchFilter from "../Components/SearchFilter";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  useEffect(() => {
    let apiUrl = "http://localhost:5000/api/properties";
    const params = new URLSearchParams(filterParams);

    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setProperties(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [filterParams]);

  const handleApplyFilter = (params) => {
    setFilterParams(params);
  };

  return (
    <>
      <NavBar />
      <h1>PROPERTIES!</h1>
      <SearchFilter onApplyFilter={handleApplyFilter} />
      <div className="properties-container">
        {properties.map((property) => (
          <Propertie
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
  );
};

export default Properties;
