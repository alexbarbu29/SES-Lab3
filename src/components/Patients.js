import React, { Component } from 'react';
import axios from 'axios';
import "../css/Patients.css";
import { Link } from 'react-router-dom';

class Patients extends Component {
   constructor(props) {
      super(props);
      this.state = {
         patients: [],
         currentPage: 1,
         currentPatients: [],
         patientsPerPage: 20,
         filterStr: "",
         pageCount: 0,
         keys: ['Id', 'Name', 'Gender', 'Birthday', "Phone", "Deceased date", 'Encounters', 'Care plan', 'Appointment', 'Allergy intolerance'],
         show: false
      };
      this.handleClick = this.handleClick.bind(this);
   }

   handleClick(event) {
      this.setState({
         currentPage: Number(event.target.id)
      });
   }

   componentDidMount() {
      axios.get('http://hapi.fhir.org/baseR4/Patient?_format=json&_pretty=true')
         .then(data => {
            let response = data.data;
            let totalItemsCount = response.length;
            let pageCount = Math.ceil(totalItemsCount / 5)
            this.setState({
               patients: response.entry,
               pageCount
            });
         });
   }

   renderTableHeader() {
      let header = this.state.keys;
      return header.map((key, index) => {
         return <th key={index}>{key}</th>;
      });
   }

   renderTableData(tableData) {
      return tableData.map(patient => {
         const resource = patient.resource;
         const firstName = resource.name && resource.name[0] && resource.name[0].given && resource.name[0].given.join(" ");
         const lastName = resource.name && resource.name[0] && resource.name[0].family;
         const telecom = resource.telecom && resource.telecom[0] && resource.telecom[0].value;
         return (
            <tr key={resource.id}>
               <td> {resource.id}</td>
               <td>{firstName + " " + lastName}</td>
               <td>{resource.gender || "N/A"}</td>
               <td>{resource.birthDate || "N/A"}</td>
               <td>{telecom || "N/A"}</td>
               <td>{resource.deceasedDateTime || "N/A"}</td>
               <td>
                  <Link to={`/patients/${resource.id}/encounters`}>
                     <button className='btn'> Details </button>
                  </Link>
               </td>
               <td>
                  <Link to={`/patients/${resource.id}/carePlan`}>
                     <button className='btn'> Details </button>
                  </Link>
               </td>
               <td>
                  <Link to={`/patients/${resource.id}/appointments`}>
                     <button className='btn'> Details </button>
                  </Link>
               </td>
               <td>
                  <Link to={`/patients/${resource.id}/allergies`}>
                     <button className='btn'> Details </button>
                  </Link>
               </td>

            </tr>
         );
      });
   }

   render() {
      const filteredPatients = this.state.patients
         .filter(e => e.resource && e.resource.name && e.resource.name[0]
            && e.resource.name[0].family && (e.resource.name[0].family.toLowerCase().includes(this.state.filterStr) || e.resource.name[0].given.join(" ").toLowerCase().includes(this.state.filterStr)))
      const { currentPage, patientsPerPage } = this.state;
      const indexOfLastPatient = currentPage * patientsPerPage;
      const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
      const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(filteredPatients.length / patientsPerPage); i++) {
         pageNumbers.push(i);
      }

      const renderPageNumbers = pageNumbers.map(number => {
         return (
            <div
               key={number}
               id={number}
               className="page"
               onClick={this.handleClick}
            >
               {number}
            </div>
         );
      });

      return (
         <div>
            <input
               placeholder = "Enter patient name..."
               type="text"
               value={this.state.filterStr}
               onChange={e => this.setState({ filterStr: e.target.value })} />
            <h1 id="title">Patients</h1>
            <table id="tables">
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData(currentPatients)}
               </tbody>
            </table>
            <div id="page-numbers">
               {renderPageNumbers}
            </div>
         </div>
      );
   }
}
export default Patients;
