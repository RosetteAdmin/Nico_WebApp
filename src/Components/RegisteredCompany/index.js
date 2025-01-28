// index.js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./RegisteredCompanyS.css";

const associatesData = [
  { id: "00001", name: "Christine Brooks", sector: "Karnataka, India", access: true },
  { id: "00002", name: "Rosie Pearson", sector: "Karnataka, India", access: true },
  { id: "00003", name: "Darrell Caldwell", sector: "Pune, India", access: false },
  { id: "00004", name: "Gilbert Johnston", sector: "New Delhi, India", access: true },
  { id: "00005", name: "Alan Cain", sector: "Kerala, India", access: true },
  { id: "00006", name: "Alfred Murray", sector: "Haryana, India", access: false },
  { id: "00007", name: "Maggie Sullivan", sector: "Patna, India", access: true },
  { id: "00008", name: "Rosie Todd", sector: "Manipal, India", access: false },
];

const RegisteredCompany = () => {
  const [associates, setAssociates] = useState(associatesData);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccess = (id) => {
    setAssociates((prev) =>
      prev.map((associate) =>
        associate.id === id ? { ...associate, access: !associate.access } : associate
      )
    );
  };

  const filteredAssociates = associates.filter((associate) =>
    associate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="div-reg-com-container">
      <h1 className="h1-reg-com-header">Registered Company Associate Details</h1>
      <div className="div-reg-com-search-bar">
        <input
          type="text"
          className="input-reg-com-search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="button-reg-com-filter">Filter</button>
      </div>
      <table className="table-reg-com-list">
        <thead className="thead-reg-com">
          <tr className="tr-reg-com-header">
            <th className="th-reg-com">Associate ID</th>
            <th className="th-reg-com">Associate Name</th>
            <th className="th-reg-com">Sector</th>
            <th className="th-reg-com">Access</th>
            <th className="th-reg-com">More</th>
          </tr>
        </thead>
        <tbody className="tbody-reg-com">
          {filteredAssociates.map((associate) => (
            <tr key={associate.id} className="tr-reg-com-item">
              <td className="td-reg-com">{associate.id}</td>
              <td className="td-reg-com">{associate.name}</td>
              <td className="td-reg-com">{associate.sector}</td>
              <td className="td-reg-com">
                <label className="label-reg-com-switch">
                  <input
                    type="checkbox"
                    className="input-reg-com-toggle"
                    checked={associate.access}
                    onChange={() => toggleAccess(associate.id)}
                  />
                  <span className="span-reg-com-slider"></span>
                </label>
              </td>
              <td className="td-reg-com">
                <button className="button-reg-com-more">🔗</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div-reg-com-pagination">
        <button className="button-reg-com-pagination">&lt;</button>
        <span className="span-reg-com-pagination">Showing 1-9 of 78</span>
        <button className="button-reg-com-pagination">&gt;</button>
      </div>
    </div>
  );
}

export default RegisteredCompany;
// ReactDOM.render(<RegisteredCompany />, document.getElementById("root"));