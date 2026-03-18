export const Role = {
  Admin: 0,
  CompanyAssociate: 1,
  Vendor: 2,
  Customer: 3,
};

export const roleToString = (role) => {
  switch (role) {
    case Role.Admin: return "Master Admin";
    case Role.CompanyAssociate: return "Company Admin";
    case Role.Vendor: return "Customer Admin";
    case Role.Customer: return "Operator";
    default:
      // navigate("/login");  // redirect if role not valid
      return null;
  } 
};
