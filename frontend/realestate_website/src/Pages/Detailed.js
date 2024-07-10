import React from "react";
import NavBar from "../Components/NavBar";
import "./Detailed.css";
import poza1 from '../Components/EstatesImages/poza1.jpg';

const Detailed = () => {
    return (
        <>
            <NavBar />
            <div className="wrapper">
                <h1>Details!</h1>
                <div className="image-part">
                    <h1>The Propertie Photo</h1>
                    <img id="detail-photo" src={poza1} alt="EstatePhoto"/>
                </div>
                <div className="tease-part">
                    <h3>Property Name</h3>
                    <ul>
                        <li><h4>Surface</h4></li>
                        <li><h4>Number of rooms</h4></li>
                        <li><h4>Another Characteristic</h4></li>
                    </ul>
                    <div>
                        <h3>Price</h3>
                    </div>
                </div>
                <div className="description-part">
                    <h3>Propertie Description</h3>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type
                        specimen book. It has survived not only five centuries, but also the leap into electronic
                        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                        release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                        publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
                <div className="characteristics-part">
                    <h3>Propertie characteristics</h3>
                </div>
            </div>
        </>
    );
};

export default Detailed;











