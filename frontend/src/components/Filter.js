import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowDropDown, ArrowDropUp, GpsFixed, LocationOn } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const LocationFetcher = () => {
    const [location, setLocation] = useState(() => {
        const storedLocation = localStorage.getItem("currentLocation");
        return storedLocation ? JSON.parse(storedLocation) : null;
    });
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);
    const dropdownRef = useRef(null);

    const toggle = () => setShow((prev) => !prev);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await axios.post(
                        "http://localhost:5000/api/user/location",
                        { latitude, longitude },
                        { headers: { "Content-Type": "application/json" }, withCredentials: true }
                    );

                    const address = response.data.location;
                    const locationData = { latitude, longitude, address };

                    localStorage.setItem("currentLocation", JSON.stringify(locationData));
                    window.dispatchEvent(new CustomEvent("locationUpdated", { detail: locationData })); // Emit custom event
                    setLocation(locationData);
                    setError(null);
                    setShow(false)
                } catch {
                    setError("Failed to fetch location name.");
                }
            },
            (err) => {
                setError("Unable to retrieve location. " + err.message);
            }
        );
    };

    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions([]);
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/user/sugg?q=${query}`
                );
                setSuggestions(response.data || []);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout.current);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-52 relative cursor-pointer">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="w-full flex items-center p-1" onClick={toggle}>
                <LocationOn fontSize="small" />
                <input
                    placeholder={location?.address || "Enter your village, district"}
                    className="whitespace-nowrap overflow-hidden w-full focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div>{!show ? <ArrowDropDown /> : <ArrowDropUp />}</div>
            </div>

            {show && (
                <div
                    ref={dropdownRef}
                    className="w-[250px] mt-2 flex flex-col border-gray-400 border absolute rounded-xl bg-white z-50"
                >
                    <div
                        onClick={fetchLocation}
                        className="text-red-400 text-[14px] p-2 flex gap-1 cursor-pointer rounded-xl hover:bg-gray-100"
                    >
                        <GpsFixed fontSize="small" />
                        Detect Current Location
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-2">
                            <CircularProgress size={24} />
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="text-black text-[14px] p-2 flex gap-1 cursor-pointer rounded-xl border-t-2 hover:bg-gray-100"
                                onClick={() => {
                                    localStorage.setItem("currentLocation", JSON.stringify(suggestion));
                                    window.dispatchEvent(new CustomEvent("locationUpdated", { detail: suggestion })); // Emit custom event
                                    setLocation(suggestion);
                                    setQuery("");
                                    setShow(false);
                                }}
                            >
                                {suggestion.address}
                            </div>
                        ))
                    ) : (
                        query && (
                            <div className="text-gray-500 text-[14px] p-2">
                                No suggestions found.
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationFetcher;


