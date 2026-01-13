import React, { useState } from 'react';
import JumboNavSection from "@jumbo/components/JumboVerticalNavbar/JumboNavSection";
import JumboNavCollapsible from "@jumbo/components/JumboVerticalNavbar/JumboNavCollapsible";
import JumboNavItem from "@jumbo/components/JumboVerticalNavbar/JumboNavItem";

const NAV_VARIANTS = {
    'section': JumboNavSection,
    'collapsible': JumboNavCollapsible,
    'nav-item': JumboNavItem
};

const JumboNavIdentifier = ({ item, isNested, translate, classNames }) => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('mw-user-data')));
    const companyData = JSON.parse(localStorage.getItem('mw-company-data'));
    const [companyId, setCompanyId] = useState(companyData.id);
    let privileges = [];
    if (userData) {
        privileges = userData.privileges;
    }

    if (!item) return null;
    if (item && item.privilegeId) {
        const foundPrivileges = privileges.find(elem => elem.privilegeId === item.privilegeId);
        if (!foundPrivileges?.id) return null;
    }

    if(item && item.companyId) {
        if(item.companyId !== companyId) return null;
    }

    if (item.type && ['section', 'collapsible', 'nav-item'].includes(item.type)) {
        const NavComponent = NAV_VARIANTS[item.type];
        return <NavComponent translate item={item} isNested={isNested} classNames={classNames} />
    }
};

JumboNavIdentifier.defaultProps = {
    isNested: false
};

export default JumboNavIdentifier;