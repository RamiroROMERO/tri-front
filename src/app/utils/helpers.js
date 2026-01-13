export const formatDate = (date) => {
  const newDate = new Date(`${date}T12:00:00Z`);
  let dd = newDate.getDate();
  let mm = newDate.getMonth() + 1; // January is 0!

  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${dd}/${mm}/${yyyy}`;
};

export function formatDateToShowDay(date) {
  if (!date || date === '') {
    return ''
  }
  const newDate = new Date(`${date}T12:00:00Z`);
  let dd = newDate.getDate();
  let mm = newDate.getMonth() + 1; // January is 0!

  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}-${dd}`;
}

export function formatNumber(number, simbol = '', decimals = 4) {
  if (!number || Number.isNaN(number)) {
    number = 0;
  }
  const separador = ","
  const sepDecimal = '.';
  number += '';
  const splitStr = number.split('.');
  const splitLeft = splitStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, separador);
  let splitRight = "".padStart(decimals, '0');
  if (splitStr[1]) {
    const [a, b] = Number.parseFloat(number).toFixed(decimals).split(".");
    splitRight = b;
  }
  return decimals > 0 ? (simbol + splitLeft + sepDecimal + splitRight) : simbol + splitLeft;
}

export const validInt = (number = 0) => {
  return Number.isNaN(number) ? 0 : Number.parseInt(number);
};

export const validFloat = (float = 0.0000, decimals = 4) => {
  if (Number.isNaN(Number.parseFloat(float))) return Number.parseFloat('0.0000')

  return Number.parseFloat(Number.parseFloat(float).toFixed(decimals));
};

export function roundTwoDecimals(value) {
  return parseFloat(Math.round((value || 0) * 100000) / 100000).toFixed(4)
}

export function formatDateToShow(date) {
  if (!date || date === '') {
    return ''
  }
  const newDate = new Date(`${date}T12:00:00Z`);
  let dd = newDate.getDate();
  let mm = newDate.getMonth() + 1; // January is 0!

  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${yyyy}`;
}

export const currencyFormatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function getDaysDiff(startDate, endDate) {
  let startDateSeconds = new Date(startDate + 'T12:00:00Z').getTime();
  let endDateSeconds = new Date(endDate + 'T12:00:00Z').getTime();
  let diff = endDateSeconds - startDateSeconds;
  return diff / (1000 * 60 * 60 * 24);
};

export function formatDateToRequest(date) {
  if (!date || date === '') {
    return ''
  }

  let dd = date.getDate();
  let mm = date.getMonth() + 1; // January is 0!

  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${yyyy}-${mm}-${dd}`;
}

export function currentDate() {
  const newDate = new Date();
  let dd = newDate.getDate();
  let mm = newDate.getMonth() + 1; // January is 0!

  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${yyyy}`;
}

export const getPrivilegeData = (privilegeId) => {
  const userData = JSON.parse(localStorage.getItem('mw-user-data'));
  let privileges = [];
  if (userData) {
    privileges = userData.privileges;
  }
  let detaPrivilege = privileges.find(elem => validInt(elem.privilegeId) === validInt(privilegeId));
  if (detaPrivilege?.id) {
    detaPrivilege.id = validInt(detaPrivilege.id);
    detaPrivilege.optCreate = validInt(detaPrivilege.optCreate);
    detaPrivilege.optUpdate = validInt(detaPrivilege.optUpdate);
    detaPrivilege.optDelete = validInt(detaPrivilege.optDelete);
  } else {
    detaPrivilege = { optCreate: 0, optUpdate: 0, optDelete: 0, id: 0, name: '', status: 0 };
  }
  detaPrivilege = { optCreate: 1, optUpdate: 1, optDelete: 1, id: 1, name: 'test', status: 1 };
  return detaPrivilege;
}

export const getAdminControl = () => {
  const userData = JSON.parse(localStorage.getItem('mw-user-data'));
  let privileges = [];
  if (userData) {
    privileges = userData.privileges;
  }
  let detaPrivilege = privileges.filter(elem => validInt(elem.type) === 1);
  return detaPrivilege;
}
