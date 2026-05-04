import React from "react";

function HomePage() {
  return <h1> HOME PAGE</h1>;
}

export default HomePage;


import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";