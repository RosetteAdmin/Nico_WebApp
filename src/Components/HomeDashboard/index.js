import React from "react";
import { useEffect, useState } from "react";
import "./HomeDashboard.css";
import Package from "./../../Images/Dashboard/Package.svg";
import MobileUser from "./../../Images/Dashboard/MobileUser.svg";
import Users from "./../../Images/Dashboard/Users.svg";
import Loading from "./../../Images/Dashboard/loading.svg";
import blueband from "./../../Images/Dashboard/blueband.svg";
import Ellipse from "./../../Images/Dashboard/Ellipse.svg";
import svg1 from "./../../Images/Dashboard/svg1.svg";
import svg2 from "./../../Images/Dashboard/svg2.svg";
import svg3 from "./../../Images/Dashboard/svg3.svg";
import svg4 from "./../../Images/Dashboard/svg4.svg";
import svg5 from "./../../Images/Dashboard/svg5.svg";


// const HomeDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     registered_devices: 4,
//     pre_registered_devices: 2,
//     company_associates: 3,
//     vendor_service_agents: 3,
//     users: 6,
//     yetToAdd: 6, // This key is missing in the API response, so keep a default value
//   });
  
  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_EP}/data/dashboard`)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.status === "success" && result.data) {
  //         setData((prevData) => ({
  //           ...prevData,
  //           ...result.data, // Update with API response while keeping yetToAdd
  //         }));
  //         setLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching dashboard data:", error);
  //     });
  // }, []);  
    



  // const cardsData = [
  //   {
  //     title: "Registered Devices",
  //     value: data.registered_devices,
  //     icon: <img src={Package} alt="Registered Devices Icon" />,
  //   },
  //   {
  //     title: "Pre-registered Devices",
  //     value: data.pre_registered_devices,
  //     icon: <img src={Package} alt="Pre-registered Devices Icon" />,
  //   },
  //   {
  //     title: "Company Associates",
  //     value: data.company_associates,
  //     icon: <img src={Users} alt="Company Associates Icon" />,
  //   },
  //   {
  //     title: "Vendors / Service Agents",
  //     value: data.vendor_service_agents,
  //     icon: <img src={Users} alt="Vendors/Service Agents Icon" />,
  //   },
  //   {
  //     title: "Mobile App Users",
  //     value: data.users,
  //     icon: <img src={MobileUser} alt="Mobile App Users Icon" />,
  //   },
  //   {
  //     title: "Yet to Add",
  //     value: data.yetToAdd,
  //     icon: <img src={Users} alt="Yet to Add Icon" />,
  //   },
  // ];

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">Dashboard</h1>
//       <div className="dashboard-cards">
//          <div className="blue-band-bg" style={{ backgroundImage: `url(${blueband})` }}><h2 className="head"></h2></div>
//         {cardsData.map((card, index) => (
//           <div key={index} className="dashboard-card">
//             <div className="card-icon">{card.icon}</div>
//             <div className="card-content">
//               <h3 className="card-title">{card.title}</h3>
//               { !loading ?
//               <p className="card-value">{card.value}</p>
//               : <img src={Loading} alt="Loading" className="dashboard-loading" />
//               }
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
    const HomeDashboard = ({ title, value, maxValue }) => {
    const [selectedRange, setSelectedRange] = useState("5 days");
    const percentage = Math.min((value / maxValue) * 100, 100);
    const strokeDasharray = 2 * Math.PI * 28;
    const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;
    const [role, setRole] = useState("");
    const userrole = JSON.parse(localStorage.getItem("user")).role;


   return (
        <div className="mobile-app-container">
            <div className="quick-statistics-section" >
                <div className="blue-band-bg" style={{ backgroundImage: `url(${blueband})` }}>
                  <h2 className="head"><h1>Hello {userrole},</h1><br></br>
Our commitment to excellence has driven us to develop state-of-the-art NICO Nanobubble Generators, Mixers, and Ozone & Oxygen Generators.
 We are dedicated to creating ground-<br></br>
 breaking technologies that address 
 the evolving needs of such critical industries while ensuring energy efficiency for end users.</h2></div>
                <div className="quick-statistics">
                 
                <div className="statss-cards">
 <div className="stat-card">
  <div className="progress-circle">
      <img src={svg1} className="ellipse" />
  <div className="arrow-icons">
    <i className="fa fa-angle-double-up" aria-hidden="true"></i>
  </div>
</div>


  <div className="stat-details">
    <p>Installed Devices</p>
    <h3>6</h3>
  </div>
</div>

                    <div className="stat-card">
                       <div className="progress-circle">
                              <img src={svg2} className="ellipse" />

                        </div>
                        <div className="stat-details">
                            <p>Registered Devices</p>
                            <h3>02</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                       <div className="progress-circle">
                          <img src={svg3} className="ellipse" />

                        </div>
                        <div className="stat-details">
                            <p>Customers</p>
                            <h3>02</h3>
                        </div>
                    </div>

                         <div className="stat-card">
                       <div className="progress-circle">
                          <img src={svg4} className="ellipse" />

                        </div>
                        <div className="stat-details">
                            <p>Associates</p>
                            <h3>230</h3>
                        </div>
                    </div>

                         <div className="stat-card">
                       <div className="progress-circle">
                              <img src={svg5} className="ellipse" />

                        </div>
                        <div className="stat-details">
                            <p>Vendors</p>
                            <h3>230</h3>
                        </div>
                    </div>


                </div>
            </div>

         </div>

            {/* Quick Actions */}
             
        </div>
        
    );
};


export default HomeDashboard;
