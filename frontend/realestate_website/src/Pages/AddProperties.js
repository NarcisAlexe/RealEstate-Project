import { React, useState } from "react";
import NavBar from "../Components/NavBar";


const AddProperties = () => {

    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [adress, setAdress] = useState("");
    const [surfaceArea, setSurfaceArea] = useState();
    const [roomNmb, setRoomNmb] = useState("")
    const [image, setImage] = useState("");

    const handleAddPropertie = async (e) => {
        e.preventDefault();

        if (!category && !price && !adress && !surfaceArea && !roomNmb && !image) {
            console.log("You need to fill in the fields first!");
            return;
        }
        if (!category || !price || !adress || !surfaceArea || !roomNmb || !image) {
            console.log("One or more of the field/s is/are empty. Please fill in!");
            return;
        }

        const response = await fetch("http://localhost:5000/api/add_properties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category, price, adress, surfaceArea, roomNmb, image }),
        });

        if (response.ok) {
            console.log("Added succesful!");
        } else {
            // Handle failed login
            console.error("Registration failed! The is already a user with this email!");
        }


    }


    return (
        <>
            <NavBar />
            <h1>ADD PROPERTIES!</h1>
            <form onSubmit={handleAddPropertie}>
                <label>Categorie:</label>
                {/* <input
                    type="text"
                    placeholder="category..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                ></input> */}
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <optgroup label="Select one">
                        <option value="">Select one</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartament">Apartament</option>
                        <option value="Vila">Vila</option>
                        <option value="Garsoniera">Garsoniera</option>
                        <option value="Birou">Birou</option>
                        <option value="Penthouse">Penthouses</option>
                    </optgroup>
                </select>
                <label>Pret:</label>
                <input
                    type="number"
                    placeholder="price..."
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                ></input>
                <label>Adresa:</label>
                <input
                    type="text"
                    placeholder="adress..."
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                ></input>
                <label>Suprafata:</label>
                <input
                    type="number"
                    placeholder="surface_area..."
                    value={surfaceArea}
                    onChange={(e) => setSurfaceArea(e.target.value)}
                ></input>
                <label>Number of rooms:</label>
                <input
                    type="number"
                    placeholder="?"
                    value={roomNmb}
                    onChange={(e) => setRoomNmb(e.target.value)}
                ></input>
                <label>Imagine:</label>
                <input
                    type="text"
                    placeholder="image..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                ></input>
                <button type="submit">ADD +</button>
            </form>
        </>
    )
}

export default AddProperties;
