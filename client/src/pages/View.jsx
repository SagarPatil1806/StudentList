import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./View.css";
import axios from "axios";
import { toast } from 'react-toastify';

const View = () => {
    const [student, setStudent] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const getSingleStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/get/${id}`);
                if (response.data && response.data.length > 0) {
                    setStudent({ ...response.data[0] });
                }
            } catch (error) {
                console.error("Error fetching student details:", error);
                toast.error("Could not fetch student details");
            }
        };
        getSingleStudent();
    }, [id]);

    return (
        <div style={{ marginTop: "150px" }}>
            <div className="card">
                <div className="card-header">
                    <p>Student Profile Details</p>
                </div>
                <div className="card-body">
                    <div className="info-item">
                        <strong>ID:</strong>
                        <span>{id}</span>
                    </div>
                    
                    <div className="info-item">
                        <strong>Name:</strong>
                        <span>{student.name || "N/A"}</span>
                    </div>
                    
                    <div className="info-item">
                        <strong>Email:</strong>
                        <span>{student.email || "N/A"}</span>
                    </div>
                    
                    <div className="info-item">
                        <strong>Contact:</strong>
                        <span>{student.contact || "N/A"}</span>
                    </div>

                    <Link to="/">
                        <button className="btn btn-view">Go Back</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default View;