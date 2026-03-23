// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import LoginScreen from "./Components/LoginScreen";
// import Header from "./Components/Header";
// import SideNavBar from "./Components/SideNavBar";
// import HomeDashboard from "./Components/HomeDashboard";
// import DeviceDashboard from "./Components/DeviceDashboard";
// import PreRegDevices from "./Components/PreRegDevices";
// import DeviceDetails from "./Components/DeviceDetails";
// import AddNewDevice from "./Components/AddNewDevice";
// import ChangeProfile from "./Components/ChangeProfile";
// import AccessManagement from "./Components/AccessManagement";
// import RegisteredCompany from "./Components/RegisteredCompany";
// import VendorsCompany from "./Components/VendorsCompany";
// import Userinfo from "./Components/Userinfo";
// import Userinfovendor from "./Components/UserInfovendor";
// import UserinfoOperator from "./Components/operatorinfo";
// import Customers from "./Components/Customers";
// import ServiceRequestsAlerts from "./Components/ServiceRequestsAlerts";
// import MaintenancePage from "./Components/NFM";
// import AddVendors from "./Components/AddVendors";
// import AddUsers from "./Components/AddUsers";
// import AddOperator from "./Components/AddOperator";
// import EditUser from "./Components/EditUser";
// import "./App.css";
// import blueband from "./Images/Dashboard/blueband.svg";
// import LogDetails from "./Components/LogDetails";
// import EditDevice from "./Components/EditDevice";
// import { LabelProvider } from './context/LabelContext';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return !!user;
//   });

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false); // Update state to logged out
//   };

//   return (
//         <LabelProvider>

//     <Router>
//       <div className="app-container">
//         <Routes>
//           {/* Login route always accessible */}
//           <Route path="/login" element={<LoginScreen handleLogin={handleLogin} />} />
          
//           {/* Maintenance route */}
//           <Route path="/maintenance" element={<MaintenancePage />} />

//           {/* Protected routes for logged-in users */}
//           {isLoggedIn ? (
//             <Route
//               path="/*"
//               element={
//                 <>
//                   <Header />
//                   <div className="main-content">
//                     <div className="blue-band-bg" style={{ backgroundImage: `url(${blueband})` }}>
//                       <SideNavBar />
//                       <div className="content-area">
//                         <Routes>
//                           <Route path="/edit/:email" element={<EditUser />} />
//                           <Route path="/dashboard" element={<HomeDashboard />} />
//                           <Route path="/devices" element={<DeviceDashboard />} />
//                           <Route path="/editdevice/:id" element={<EditDevice />} />
//                           <Route path="/PreRegDevices" element={<PreRegDevices />} />
//                           <Route path="/device/:id" element={<DeviceDetails />} />
//                           {/* <Route path="/device/:azure_device_id/logdetails" element={<LogDetails />} /> */}
//                           <Route path="/device/:azure_device_id/logdetails" element={<LogDetails />} />
//                           <Route path="/add-device" element={<AddNewDevice />} />
//                           <Route path="/access-management" element={<AccessManagement />} />
//                           <Route path="/caccess" element={<RegisteredCompany />} />
//                           <Route path="/addusersinfo" element={<AddUsers />} />
//                           <Route path="/addoperatorinfo" element={<AddOperator />} />
//                           <Route path="/vaccess" element={<VendorsCompany />} />
//                           <Route path="/addvendorsinfo" element={<AddVendors />} />
//                           <Route path="/profile" element={<ChangeProfile onLogout={handleLogout} />} />
//                           <Route path="/userinfo/:email" element={<Userinfo />} />
//                           <Route path="/userinfovendor/:email" element={<Userinfovendor />} />
//                           <Route path="/userinfooperator/:email" element={<UserinfoOperator />} />
//                           <Route path="/customers" element={<Customers />} />
//                           <Route path="/service-requests" element={<ServiceRequestsAlerts />} />
//                           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//                           <Route path="*" element={<Navigate to="/maintenance" replace />} />
//                         </Routes>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               }
//             />
//           ) : (
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           )}
//         </Routes>
//       </div>
//     </Router>
//         </LabelProvider>

//   );
// }

// export default App;

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard";
import DeviceDashboard from "./Components/DeviceDashboard";
import PreRegDevices from "./Components/PreRegDevices";
import DeviceDetails from "./Components/DeviceDetails";
import AddNewDevice from "./Components/AddNewDevice";
import ChangeProfile from "./Components/ChangeProfile";
import AccessManagement from "./Components/AccessManagement";
import RegisteredCompany from "./Components/RegisteredCompany";
import VendorsCompany from "./Components/VendorsCompany";
import Userinfo from "./Components/Userinfo";
import Userinfovendor from "./Components/UserInfovendor";
import UserinfoOperator from "./Components/operatorinfo";
import Customers from "./Components/Customers";
import ServiceRequestsAlerts from "./Components/ServiceRequestsAlerts";
import MaintenancePage from "./Components/NFM";
import AddVendors from "./Components/AddVendors";
import AddUsers from "./Components/AddUsers";
import AddOperator from "./Components/AddOperator";
import EditUser from "./Components/EditUser";
import EditDevice from "./Components/EditDevice";
import LogDetails from "./Components/LogDetails";
import ProtectedRoute from "./Components/ProtectedRoute";
import { LabelProvider } from './context/LabelContext';
import { Role } from './constants/roles';

import "./App.css";
import blueband from "./Images/Dashboard/blueband.svg";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user;
  });

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  // Shorthand role arrays
  const ALL   = [Role.MasterAdmin, Role.CompanyAdmin, Role.CustomerAdmin, Role.Operator];
  const L012  = [Role.MasterAdmin, Role.CompanyAdmin, Role.CustomerAdmin];
  const L01   = [Role.MasterAdmin, Role.CompanyAdmin];
  const L0    = [Role.MasterAdmin];

  return (
    <LabelProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Always accessible */}
            <Route
              path="/login"
              element={<LoginScreen handleLogin={handleLogin} />}
            />
            <Route path="/maintenance" element={<MaintenancePage />} />

            {/* Protected layout — requires login */}
            {isLoggedIn ? (
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <div className="main-content">
                      <div
                        className="blue-band-bg"
                        style={{ backgroundImage: `url(${blueband})` }}
                      >
                        <SideNavBar />
                        <div className="content-area">
                          <Routes>
                            {/* ── All roles ── */}
                            <Route
                              path="/dashboard"
                              element={
                                <ProtectedRoute allowedRoles={ALL}>
                                  <HomeDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/devices"
                              element={
                                <ProtectedRoute allowedRoles={ALL}>
                                  <DeviceDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/device/:id"
                              element={
                                <ProtectedRoute allowedRoles={ALL}>
                                  <DeviceDetails />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/device/:azure_device_id/logdetails"
                              element={
                                <ProtectedRoute allowedRoles={ALL}>
                                  <LogDetails />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute allowedRoles={ALL}>
                                  <ChangeProfile onLogout={handleLogout} />
                                </ProtectedRoute>
                              }
                            />

                            {/* ── Master Admin + Company Admin + Customer Admin ── */}
                            <Route
                              path="/customers"
                              element={
                                <ProtectedRoute allowedRoles={L012}>
                                  <Customers />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/addoperatorinfo"
                              element={
                                <ProtectedRoute allowedRoles={L012}>
                                  <AddOperator />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/userinfooperator/:email"
                              element={
                                <ProtectedRoute allowedRoles={L012}>
                                  <UserinfoOperator />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/edit/:email"
                              element={
                                <ProtectedRoute allowedRoles={L012}>
                                  <EditUser />
                                </ProtectedRoute>
                              }
                            />

                            {/* ── Master Admin + Company Admin ── */}
                            <Route
                              path="/access-management"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <AccessManagement />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/vaccess"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <VendorsCompany />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/addvendorsinfo"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <AddVendors />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/userinfovendor/:email"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <Userinfovendor />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/service-requests"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <ServiceRequestsAlerts />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/editdevice/:id"
                              element={
                                <ProtectedRoute allowedRoles={L01}>
                                  <EditDevice />
                                </ProtectedRoute>
                              }
                            />

                            {/* ── Master Admin only ── */}
                            <Route
                              path="/PreRegDevices"
                              element={
                                <ProtectedRoute allowedRoles={L0}>
                                  <PreRegDevices />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/add-device"
                              element={
                                <ProtectedRoute allowedRoles={L0}>
                                  <AddNewDevice />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/caccess"
                              element={
                                <ProtectedRoute allowedRoles={L0}>
                                  <RegisteredCompany />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/addusersinfo"
                              element={
                                <ProtectedRoute allowedRoles={L0}>
                                  <AddUsers />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/userinfo/:email"
                              element={
                                <ProtectedRoute allowedRoles={L0}>
                                  <Userinfo />
                                </ProtectedRoute>
                              }
                            />

                            {/* Default redirects */}
                            <Route
                              path="/"
                              element={<Navigate to="/dashboard" replace />}
                            />
                            <Route
                              path="*"
                              element={<Navigate to="/maintenance" replace />}
                            />
                          </Routes>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </div>
      </Router>
    </LabelProvider>
  );
}

export default App;