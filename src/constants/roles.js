// export const Role = {
//   Admin: 0,
//   CompanyAssociate: 1,
//   Vendor: 2,
//   Customer: 3,
// };

// export const roleToString = (role) => {
//   switch (role) {
//     case Role.Admin: return "Master Admin";
//     case Role.CompanyAssociate: return "Company Admin";
//     case Role.Vendor: return "Customer Admin";
//     case Role.Customer: return "Operator";
//     default:
//       // navigate("/login");  // redirect if role not valid
//       return null;
//   } 
// };


// ============================================================
// ROLE CONSTANTS — 4-Layer Admin Control Hierarchy
// ============================================================
export const Role = {
  MasterAdmin: 0,      // Layer 1 — Complete platform authority
  CompanyAdmin: 1,     // Layer 2 — Company-scoped authority
  CustomerAdmin: 2,    // Layer 3 — End-client with operational control
  Operator: 3,         // Layer 3 — Execution-focused user
};

// Keep legacy aliases so existing imports don't break
export const Admin = Role.MasterAdmin;
export const CompanyAssociate = Role.CompanyAdmin;
export const Vendor = Role.CustomerAdmin;
export const Customer = Role.Operator;

// ============================================================
// ROLE TO DISPLAY STRING
// ============================================================
export const roleToString = (role) => {
  switch (Number(role)) {
    case Role.MasterAdmin:   return 'Master Admin';
    case Role.CompanyAdmin:  return 'Company Admin';
    case Role.CustomerAdmin: return 'Customer Admin';
    case Role.Operator:      return 'Operator';
    default:                 return null;
  }
};

// ============================================================
// PERMISSION HELPERS
// All functions take the numeric role value.
// ============================================================

/** Can edit device owner info, phone, email, location */
export const canEditDeviceInfo = (role) => Number(role) <= Role.CompanyAdmin;

/** Can rename labels (water pressure, flow rate, etc.) and reset them */
export const canEditLabels = (role) => Number(role) <= Role.CompanyAdmin;

/** Can edit gauge max values */
export const canEditGaugeMax = (role) => Number(role) <= Role.CompanyAdmin;

/** Can toggle system power ON/OFF — all roles */
export const canTogglePower = (role) => Number(role) <= Role.Operator;

/** Can toggle auto mode ON/OFF — Master Admin, Company Admin, Customer Admin */
export const canToggleAutoMode = (role) => Number(role) <= Role.CustomerAdmin;

/** Can write auto-sequence registers (counter, on-time, off-time) */
export const canWriteRegisters = (role) => Number(role) <= Role.CustomerAdmin;

/** Can register new IoT devices — Master Admin only */
export const canRegisterDevices = (role) => Number(role) === Role.MasterAdmin;

/** Can view pre-registered (undeployed) devices — Master Admin only */
export const canViewRegisteredDevices = (role) => Number(role) === Role.MasterAdmin;

/** Can manage Company Admins (create/view/delete) — Master Admin only */
export const canManageCompanyAdmins = (role) => Number(role) === Role.MasterAdmin;

/** Can manage Customer Admins — Master Admin + Company Admin */
export const canManageCustomerAdmins = (role) => Number(role) <= Role.CompanyAdmin;

/** Can manage Operators — Master Admin + Company Admin + Customer Admin */
export const canManageOperators = (role) => Number(role) <= Role.CustomerAdmin;

/** Can view service requests — Master Admin + Company Admin */
export const canViewServiceRequests = (role) => Number(role) <= Role.CompanyAdmin;

/** Can assign devices to users — Master Admin + Company Admin + Customer Admin */
export const canAssignDevices = (role) => Number(role) <= Role.CustomerAdmin;

/** Can edit device details page (edit button visible) */
export const canEditDevice = (role) => Number(role) <= Role.CompanyAdmin;

/** Can access User Access management section */
export const canAccessUserManagement = (role) => Number(role) <= Role.CustomerAdmin;