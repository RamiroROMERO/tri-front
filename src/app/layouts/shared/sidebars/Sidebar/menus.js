import React from "react";
import GroupIcon from '@mui/icons-material/Group';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import TuneIcon from '@mui/icons-material/Tune';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { AccountBox, AddTask, Description, SpaceDashboard } from "@mui/icons-material";

const menus = [
  {
    label: 'sidebar.menu.employee',
    type: "section",
    module: 'payroll-control',
    children: [
      {
        uri: "/employeeProfile",
        label: "sidebar.menuItem.employeeProfile",
        type: "nav-item",
        icon: <AccountBox sx={{ fontSize: 20 }} />
      },
    ]
  },
  {
    label: 'sidebar.section.payroll',
    type: "section",
    module: 'payroll-control',
    children: [
      {
        privilegeId: 2,
        uri: "/dashboard-payroll",
        label: "sidebar.menu.dashboardPayroll",
        type: "nav-item",
        icon: <SpaceDashboard sx={{ fontSize: 20 }} />
      },
      {
        privilegeId: 1,
        uri: "/customers",
        label: "sidebar.menu.customers",
        type: "nav-item",
        icon: <GroupIcon sx={{ fontSize: 20 }} />
      },
      {
        privilegeId: 2,
        uri: "/employees",
        label: "sidebar.menu.employees",
        type: "nav-item",
        icon: <RecentActorsIcon sx={{ fontSize: 20 }} />
      }, {
        label: 'sidebar.submenu.process',
        icon: <DeveloperBoardIcon sx={{ fontSize: 20 }} />,
        type: "collapsible",
        children: [
          {
            privilegeId: 3,
            uri: "/process/customersWeeks",
            label: "sidebar.menu.customersWeeks",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 4,
            uri: "/process/projects",
            label: "sidebar.menu.projects",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 5,
            uri: "/process/weeklyProcess",
            label: "sidebar.menu.weeklyProcess",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 5,
            uri: "/process/perdiems",
            label: "sidebar.menu.perdiems",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            // companyId: 1,
            privilegeId: 6,
            uri: "/process/invoices",
            label: "sidebar.menu.invoices",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 7,
            uri: "/process/payroll",
            label: "sidebar.menu.payroll",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 8,
            uri: "/process/checks",
            label: "sidebar.menu.checks",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 33,
            uri: "/process/OtherPayments",
            label: "sidebar.menu.otherPayments",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            label: "sidebar.menu.adjustments",
            type: "collapsible",
            icon: <AddTask sx={{ fontSize: 20 }} />,
            children: [{
              privilegeId: 10,
              uri: "/process/adjustments/deductions",
              label: "sidebar.menu.deductions",
              type: "nav-item",
              icon: <GroupIcon sx={{ fontSize: 20 }} />,
              class: 'sub-submenu-item'
            }, {
              privilegeId: 9,
              uri: "/process/adjustments/adjustment",
              label: "sidebar.menu.adjustments",
              type: "nav-item",
              icon: <GroupIcon sx={{ fontSize: 20 }} />,
              class: 'sub-submenu-item'
            },
            {
              privilegeId: 12,
              uri: "/process/adjustments/loans",
              label: "sidebar.menu.loans",
              type: "nav-item",
              icon: <GroupIcon sx={{ fontSize: 20 }} />,
              class: 'sub-submenu-item'
            },
            {
              privilegeId: 11,
              uri: "/process/adjustments/missingTimes",
              label: "sidebar.menu.missingTimes",
              type: "nav-item",
              icon: <GroupIcon sx={{ fontSize: 20 }} />,
              class: 'sub-submenu-item'
            }
            ]
          }
        ]
      }, {
        label: 'sidebar.submenu.reports',
        icon: <Description sx={{ fontSize: 20 }} />,
        type: "collapsible",
        children: [
          {
            companyId: 1,
            privilegeId: 13,
            uri: "/reports/jobsFilter",
            label: "sidebar.menu.jobs",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 14,
            uri: "/reports/paymentHistory",
            label: "sidebar.menu.paymentHistory",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 15,
            uri: "/reports/totals",
            label: "sidebar.menu.totals",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 16,
            uri: "/reports/activeEmployees",
            label: "sidebar.menu.activeEmployees",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }, {
            companyId: 1,
            privilegeId: 17,
            uri: "/reports/checksHistory",
            label: "sidebar.menu.checksHistory",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            companyId: 1,
            privilegeId: 17,
            uri: "/reports/invoicesHistory",
            label: "sidebar.menu.invoicesHistory",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 17,
            uri: "/reports/totalPayments",
            label: "sidebar.menu.totalPayments",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            companyId: 1,
            privilegeId: 17,
            uri: "/reports/subsequentWork",
            label: "sidebar.menu.subsequentWork",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 42,
            uri: "/reports/dailyHours",
            label: "sidebar.menu.dailyHours",
            type: "nav-item",
            icon: <GroupIcon sx={{ fontSize: 20 }} />
          }
        ]
      },
      {
        label: 'sidebar.submenu.settings',
        icon: <TuneIcon sx={{ fontSize: 20 }} />,
        type: "collapsible",
        children: [
          {
            privilegeId: 18,
            uri: "/settings/manageCompanies",
            label: "sidebar.menu.manageCompanies",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            privilegeId: 19,
            uri: "/settings/payrollLineTypes",
            label: "sidebar.menu.payrollLineTypes",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 20,
            uri: "/settings/classifications",
            label: "sidebar.menu.classifications",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 21,
            uri: "/settings/sectors",
            label: "sidebar.menu.sectors",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 22,
            uri: "/settings/manageWeeks",
            label: "sidebar.menu.manageWeeks",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 23,
            uri: "/settings/deductionsTypes",
            label: "sidebar.menu.deductionsTypes",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 24,
            uri: "/settings/banks",
            label: "sidebar.menu.banks",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 25,
            uri: "/settings/users",
            label: "sidebar.menu.users",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }, {
            privilegeId: 26,
            uri: "/settings/modules",
            label: "sidebar.menu.modules",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },

        ]
      }
    ]
  }, {
    label: 'sidebar.menu.inventory',
    type: "section",
    module: 'inventory-control',
    children: [
      {
        label: "sidebar.submenu.settings",
        type: "collapsible",
        icon: <TuneIcon sx={{ fontSize: 20 }} />,
        children: [
          {
            uri: "/inventory/settings/stores",
            label: "sidebar.menu.stores",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/measurementUnits",
            label: "sidebar.menu.measurementUnits",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          // {
          //   uri: "/inventory/settings/conversionFactors",
          //   label: "sidebar.menu.conversionFactors",
          //   type: "nav-item",
          //   icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          // },
          {
            uri: "/inventory/settings/tradeMarks",
            label: "sidebar.menu.tradeMarks",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/productTypes",
            label: "sidebar.menu.productTypes",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/productsCatalog",
            label: "sidebar.menu.productsCatalog",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/storeProducts",
            label: "sidebar.menu.storeProducts",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/providers",
            label: "sidebar.menu.providers",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/settings/customers",
            label: "sidebar.menu.customers",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }
        ]
      },
      {
        label: "sidebar.submenu.process",
        type: "collapsible",
        icon: <DeveloperBoardIcon sx={{ fontSize: 20 }} />,
        children: [
          {
            uri: "/inventory/process/purchaseOrders",
            label: "sidebar.menu.purchaseOrders",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/process/purchases",
            label: "sidebar.menu.purchases",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          },
          {
            uri: "/inventory/process/accountsPayable",
            label: "sidebar.menu.accountsPayable",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }
        ]
      },
      {
        label: "sidebar.submenu.reports",
        type: "collapsible",
        icon: <Description sx={{ fontSize: 20 }} />,
        children: [
          {
            uri: "/inventory/reports/purchasesByProject",
            label: "sidebar.menu.purchasesByProject",
            type: "nav-item",
            icon: <FormatListNumberedIcon sx={{ fontSize: 20 }} />
          }
        ]
      }
    ]
  },
];
export default menus;
