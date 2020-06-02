import React, { Component } from "react";
import "../css/styles.css";
var imageName = require('../images/index.jpg')
export default class Home extends Component {
    
    render() {
        return (

            <div>
                <h1 id="text"> E-Health </h1> <br></br>
                <img className="img" src={imageName} alt="not available"/>
            </div>
        );
    }
}