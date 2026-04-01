import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";
import { toast } from 'react-toastify';
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/students");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load student data.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/students");
        if (isMounted) {  
          setData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load student data.");
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/remove/${id}`);
        if (response.status === 200) {
          toast.success("Student Deleted Successfully");
         
          loadData(); 
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Error deleting student. Please try again.");
      }
    }
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="container">
        <Link to="/addStudent">
          <button className="btn btn-contact"><span>+</span>Add Student</button>
        </Link>

        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Contact</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.contact}</td>
                  <td>
                    <Link to={`/update/${item.id}`}>
                      <button className="btn btn-edit ">Edit</button>
                    </Link>
                    <button 
                      className="btn btn-delete" 
                      onClick={() => deleteStudent(item.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/view/${item.id}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;