import React, { lazy } from "react";
import Auth from "./middleware/Auth";
const DashPayroll = lazy(() => import('app/pages/DashPayroll'));
const ForgotPassword = lazy(() => import("app/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("app/pages/ResetPassword"));
const Error404 = lazy(() => import("app/pages/Error404"));
const Error403 = lazy(() => import("app/pages/Error403"));
const AccountsPayable = lazy(() => import("app/pages/Inventory/Process/AccountsPayable"));
const ActiveEmployees = lazy(() => import("app/pages/Reports/ActiveEmployees"));
const Adjustment = lazy(() => import("app/pages/Process/Adjustments/Adjustment"));
const DailyPayroll = lazy(() => import("app/pages/Process/WeeklyProcess/DailyPayroll"));
const DailyHours = lazy(() => import("app/pages/Reports/DailyHours"));
const Checks = lazy(() => import("app/pages/Process/Checks"));
const ChecksHistory = lazy(() => import("app/pages/Reports/ChecksHistory"));
const Classifications = lazy(() => import("app/pages/settings/Classifications"));
const ConversionFactors = lazy(() => import("app/pages/Inventory/Settings/ConversionFactors"));
const Customers = lazy(() => import("app/pages/Customers"));
const CustomersInv = lazy(() => import("app/pages/Inventory/Settings/Customers"));
const CustomersWeeks = lazy(() => import("app/pages/Process/CustomersWeeks"));
const Deductions = lazy(() => import("app/pages/Process/Adjustments/Deductions"));
const DeductionsTypes = lazy(() => import("app/pages/settings/DeductionTypes"));
const EmployeeProfile = lazy(() => import("app/pages/EmployeeProfile"));
const Employees = lazy(() => import("app/pages/Employees"));
const Invoices = lazy(() => import("app/pages/Process/Invoices"));
const JobsFilter = lazy(() => import("app/pages/Reports/JobsFilter"));
const Loans = lazy(() => import("app/pages/Process/Adjustments/Loans"));
const ManageCompanies = lazy(() => import("app/pages/settings/ManageCompanies"));
const ManageWeeks = lazy(() => import("app/pages/settings/ManageWeeks"));
const MissingTimes = lazy(() => import("app/pages/Process/Adjustments/MissingTimes"));
const MeasurementUnits = lazy(() => import("app/pages/Inventory/Settings/MeasurementUnits"));
const Modules = lazy(() => import("app/pages/settings/Modules"));
const OtherPayments = lazy(() => import("app/pages/Process/OtherPayments"));
const PaymentHistory = lazy(() => import("app/pages/Reports/PaymentHistory"));
const Payroll = lazy(() => import("app/pages/Process/Payroll"));
const PayrollLineTypes = lazy(() => import("app/pages/settings/PayrollLineTypes"));
const ProductsCatalog = lazy(() => import("app/pages/Inventory/Settings/ProductsCatalog"));
const ProductTypes = lazy(() => import("app/pages/Inventory/Settings/ProductTypes"));
const Projects = lazy(() => import("app/pages/Process/Projects"));
const Providers = lazy(() => import("app/pages/Inventory/Process/Providers"));
const Purchases = lazy(() => import("app/pages/Inventory/Process/Purchases"));
const PurchaseOrder = lazy(() => import("app/pages/Inventory/Process/PurchaseOrder"));
const PurchasesByProject = lazy(() => import("app/pages/Inventory/Reports/PurchasesByProject"));
const Sectors = lazy(() => import("app/pages/settings/Sectors"));
const Stores = lazy(() => import("app/pages/Inventory/Settings/Stores"));
const StoreProducts = lazy(() => import("app/pages/Inventory/Settings/StoreProducts"));
const Totals = lazy(() => import("app/pages/Reports/Totals"));
const TotalPayments = lazy(() => import("app/pages/Reports/TotalPayments"));
const TradeMarks = lazy(() => import("app/pages/Inventory/Settings/TradeMarks"));
const Users = lazy(() => import("../pages/settings/Users"));
const UserProfile = lazy(() => import("app/pages/settings/Users/UserProfile"));
const WeeklyProcess = lazy(() => import("app/pages/Process/WeeklyProcess"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Banks = lazy(() => import("app/pages/settings/Banks"));
const Perdiems = lazy(() => import('app/pages/Process/Perdiems'))
const InvoicesHistory = lazy(() => import('app/pages/Reports/InvoicesHistory'));
const SubsequentWork = lazy(() => import('app/pages/Reports/SubsequentWork'))

export const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  }, {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/employeeProfile',
    element: <EmployeeProfile />
  },
  {
    middleware: [
      {
        element: Auth,
        fallbackPath: '/login'
      }
    ],
    routes: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard-payroll',
        element: <DashPayroll />
      },
      {
        path: '/customers',
        element: <Customers />
      },
      {
        path: '/employees',
        element: <Employees />
      },
      {
        path: '/process/customersWeeks',
        element: <CustomersWeeks />
      },
      {
        path: '/process/projects',
        element: <Projects />
      },
      {
        path: '/process/weeklyProcess',
        element: <WeeklyProcess />
      },
      {
        path: '/process/weeklyProcess/dailyPayroll',
        element: <DailyPayroll />
      },
      {
        path: '/process/perdiems',
        element: <Perdiems />
      },
      {
        path: '/process/invoices',
        element: <Invoices />
      },
      {
        path: '/process/payroll',
        element: <Payroll />
      },
      {
        path: '/process/checks',
        element: <Checks />
      },
      {
        path: '/process/otherPayments',
        element: <OtherPayments />
      },
      {
        path: '/process/adjustments/deductions',
        element: <Deductions />
      },
      {
        path: '/process/adjustments/adjustment',
        element: <Adjustment />
      },
      {
        path: '/process/adjustments/loans',
        element: <Loans />
      },
      {
        path: '/process/adjustments/missingTimes',
        element: <MissingTimes />
      },
      {
        path: '/reports/jobsFilter',
        element: <JobsFilter />
      },
      {
        path: '/reports/totals',
        element: <Totals />
      },
      {
        path: '/reports/paymentHistory',
        element: <PaymentHistory />
      },
      {
        path: '/reports/invoicesHistory',
        element: <InvoicesHistory />
      },
      {
        path: '/reports/activeEmployees',
        element: <ActiveEmployees />
      },
      {
        path: '/reports/checksHistory',
        element: <ChecksHistory />
      },
      {
        path: '/reports/totalPayments',
        element: <TotalPayments />
      },
      {
        path: '/reports/subsequentWork',
        element: <SubsequentWork />
      },
      {
        path: '/reports/dailyHours',
        element: <DailyHours />
      },
      {
        path: '/settings/payrollLineTypes',
        element: <PayrollLineTypes />
      },
      {
        path: '/settings/classifications',
        element: <Classifications />
      },
      {
        path: '/settings/sectors',
        element: <Sectors />
      },
      {
        path: '/settings/manageCompanies',
        element: <ManageCompanies />
      },
      {
        path: '/settings/manageWeeks',
        element: <ManageWeeks />
      },
      {
        path: '/settings/deductionsTypes',
        element: <DeductionsTypes />
      },
      {
        path: '/settings/banks',
        element: <Banks />
      },
      {
        path: '/settings/users',
        element: <Users />
      },
      {
        path: '/settings/users/userProfile/:userId',
        element: <UserProfile />
      },
      {
        path: '/settings/modules',
        element: <Modules />
      },
      {
        path: '/inventory/settings/stores',
        element: <Stores />
      },
      {
        path: '/inventory/settings/measurementUnits',
        element: <MeasurementUnits />
      },
      {
        path: '/inventory/settings/conversionFactors',
        element: <ConversionFactors />
      },
      {
        path: '/inventory/settings/productTypes',
        element: <ProductTypes />
      },
      {
        path: '/inventory/settings/tradeMarks',
        element: <TradeMarks />
      },
      {
        path: '/inventory/settings/productsCatalog',
        element: <ProductsCatalog />
      },
      {
        path: '/inventory/settings/storeProducts',
        element: <StoreProducts />
      },
      {
        path: '/inventory/settings/providers',
        element: <Providers />
      },
      {
        path: '/inventory/settings/customers',
        element: <CustomersInv />
      },
      {
        path: '/inventory/process/purchaseOrders',
        element: <PurchaseOrder />
      },
      {
        path: '/inventory/process/purchases',
        element: <Purchases />
      },
      {
        path: '/inventory/process/accountsPayable',
        element: <AccountsPayable />
      },
      {
        path: '/inventory/reports/purchasesByProject',
        element: <PurchasesByProject />
      },
      {
        path: '/unauthorized',
        element: <Error403 />
      },
      {
        path: '/*',
        element: <Error404 />
      }
    ]
  }
];