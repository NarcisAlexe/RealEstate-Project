import React, { useState } from 'react';
import "./SearchFilter.css";



const SearchFilter = ({ onCategoryChange, onApplyFilter }) => {



    const facilitiesList = [
        "Parcare subterana",
        "Balcon",
        "Gradina",
        "Piscina",
        "Garaj",
        "Teren privat",
        "Sistem de alarma",
        "Aer conditionat",
        "Podea incalzita",
        "Vedere la mare",
        "Acces la transport public",
        "Sistem de irigatii",
        "Acoperis terasa",
        "Mobilat",
        "Semineu",
        "Spa",
        "Sistem audio integrat",
        "Bucatarie deschisa",
        "Centrala termica",
        "Ferestre mari",
        "Depozitare",
        "Curte interioara",
        "Sauna",
        "Sistem Smart Home",
        "Birou acasa",
        "Canalizare publica",
        "Intrare securizata",
        "Loc de joaca pentru copii",
        "Camera de zi spatioasa",
        "Cabina de dus cu hidromasaj",
        "Interfon",
        "Mobilier de lux",
        "Geamuri termopan",
        "Podele din lemn masiv",
        "Gresie si faianta moderna",
        "Cablu TV si internet",
        "Aproape de parcuri",
        "Magazine si restaurante in apropiere",
        "Sistem de umbrire exterioara",
        "Sistem de ventilatie cu recuperare de caldura",
        "Biblioteca",
        "Sistem de iluminare inteligent",
        "Jaccuzi",
        "Sistem de filtrare a apei",
        "Zona de relaxare",
        "Sistem de supraveghere video",
        "Sistem de sonorizare in toata casa",
        "Loc de parcare privat",
        "Aproape de scoala si gradinita",
        "Sistem de irigatii automat",
    ];
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedRooms, setSelectedRooms] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedSurface, setSelectedSurface] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const { min, max } = selectedPrice;

    const handleApplyFilter = () => {
        const filterParams = {
            category: selectedCategory,
            rooms: selectedRooms,
            price: { min, max },
            surface: selectedSurface,
            facility: selectedFacility,
        };

        if (onApplyFilter) {
            onApplyFilter(filterParams);
        }
    };

    return (
        <div className="filtreu-container">
            <div className="filtreu-formular">
                <div className="filtreu-grup">
                    <div className='categ-fil'>
                        <label htmlFor="categorie">Category</label>
                        <select onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}>
                            <option value="">Choose an option</option>
                            <option value="Apartament">Apartament</option>
                            <option value="Casa">Casa</option>
                            <option value="Vila">Vila</option>
                            <option value="Garsoniera">Garsoniera</option>
                            <option value="Birou">Birou</option>
                            <option value="Penthouse">Penthouse</option>
                        </select>
                    </div>
                    <div className='price-fil'>
                        <label>Price</label>
                        <select onChange={(e) => setSelectedPrice(e.target.value)}>
                            <option value="">Choose an option</option>
                            <option value={{ min: 0, max: 10000 }}>Under 10.000 &euro;</option>
                            <option value={{ min: 10000, max: 50000 }}>10.000 &euro; - 50.000 &euro;</option>
                            <option value={{ min: 50000, max: 100000 }}>50.000 &euro; - 100.000 &euro;</option>
                            <option value={{ min: 100000, max: 150000 }}>100.000 &euro; - 150.000 &euro;</option>
                            <option value={{ min: 150000, max: 200000 }}>150.000 &euro; - 200.000 &euro;</option>
                            <option value={{ min: 200000, max: Infinity }}>More than 200.000 &euro;</option>
                        </select>
                    </div>
                </div>
                {/* Adaugă restul elementelor <select> cu modificările corespunzătoare pentru onChange */}
            </div>
            <div className="filtreu-butoane">
                <button type="button" onClick={handleApplyFilter}>Aplică filtru</button>
            </div>
            <div className="filtreu-butoane">
                <button type="button">Resetare</button>
            </div>
        </div>
    );
};

export default SearchFilter;
