
// export const Role = {
//   Admin: 0,
//   CompanyAssociate: 1,
//   Vendor: 2,
//   Customer: 3,
// };

// export const roleToString = (role) => {
//   switch (role) {
//     case Role.Admin: return "Admin";
//     case Role.CompanyAssociate: return "Company Associate";
//     case Role.Vendor: return "Vendor";
//     case Role.Customer: return "Customer";
//     default: return "Unknown";
//   }
// };
// import { useNavigate } from "react-router-dom";

export const Role = {
  Admin: 0,
  CompanyAssociate: 1,
  Vendor: 2,
  Customer: 3,
};

export const roleToString = (role) => {
  switch (role) {
    case Role.Admin: return "Admin";
    case Role.CompanyAssociate: return "Associate";
    case Role.Vendor: return "Local Admin";
    case Role.Customer: return "Operator";
    default:
      // navigate("/login");  // redirect if role not valid
      return null;
  }
};
