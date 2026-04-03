import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; 
import "./AddEdit.css";
import { toast } from 'react-toastify';
import axios from "axios";

const initialState = { name: "", email: "", contact: "" };

const AddEdit = () => {
    const [state, setState] = useState(initialState);
    const { name, email, contact } = state;
    
    const navigate = useNavigate(); 
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5001/api/get/${id}`)
                .then((resp) => {
                    // CouchDB returns doc; we take index 0 based on backend response
                    if(resp.data[0]) {
                        setState({ ...resp.data[0] });
                    }
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !contact) {
            toast.error("Please provide value into each input field");
        } else {
            if (!id) {
                // ADD NEW STUDENT
                axios.post("http://localhost:5001/api/students", { name, email, contact })
                    .then(() => {
                        setState(initialState);
                        toast.success("Student Added Successfully");
                        setTimeout(() => navigate("/"), 500);
                    }).catch((err) => {
                        console.error("Error saving data:", err);
                        toast.error("Error saving data");
                    });
            } else {
                // UPDATE EXISTING STUDENT
                axios.put(`http://localhost:5001/api/update/${id}`, { name, email, contact })
                    .then(() => {
                        setState(initialState);
                        toast.success("Student Updated Successfully");
                        setTimeout(() => navigate("/"), 500);
                    }).catch((err) => {
                        console.error("Error updating data:", err);
                        toast.error("Error updating data");
                    });
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    return (
        <div style={{ marginTop: "100px" }}>
            <form style={{ margin: "auto", padding: "15px", maxWidth: "400px" }} onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Name" value={name || ""} onChange={handleInputChange} />
                
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" value={email || ""} onChange={handleInputChange} />
                
                <label htmlFor="contact">Contact</label>
                <input type="number" id="contact" name="contact" placeholder="Contact No" value={contact || ""} onChange={handleInputChange} />
                
                <input type="submit" value={id ? "Update" : "Add Student"} />
                <Link to="/">
                    <input type="button" value="Go Back" />
                </Link>
            </form>
        </div>
    );
}

export default AddEdit;