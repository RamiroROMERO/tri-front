import { Buffer } from 'buffer';
import ListUrlPublics from './listUrlPublic';
import { validInt } from './helpers';
import envs from '../config/envs';

const schemaErrors = ['notnull.violation', 'validation.error'];

const formatError = (error) => {
  const { messages } = error;
  const newMessages = [];
  if (messages) {
    messages.map(elem => {
      const { message } = elem;
      if (schemaErrors.includes(message)) {
        const { description } = elem;
        description.map(item => {
          newMessages.push({
            id: elem.id,
            type: elem.type,
            message: item
          });
          return item;
        });
      } else {
        newMessages.push(elem);
      }
      return elem;
    })
  }
  return { status: 'error', data: [], messages: newMessages };
};


function isTokenExpired(token) {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson)
  const { exp } = decoded;
  const expired = (Date.now() >= exp * 1000)
  return expired
}

const fnGetToken = () => {
  const dataUser = JSON.parse(localStorage.getItem('mw-user-data'));
  if (isTokenExpired(dataUser.token)) {
    window.location.href = "/#/login";
  }
  return dataUser.token;
}

const fnSuccessResponse = async (response, fnSuccess, fnError) => {
  response = await response.json();
  if (validInt(response.status) >= 300 || response.status === 'error') {
    if (typeof fnError === 'function') fnError(response);
    return;
  } else {
    if (typeof fnSuccess === 'function') fnSuccess(response);
  }
  return response;
};

const fnErrorResponse = async (error, fnError) => {
  if (error.status === 401) {
    window.location.href = '/#/login';
    return;
  }
  if (typeof fnError === 'function') fnError(error);
  console.error({ error })
  return error;
}

const fnGetRequestHeaders = (coreUrl, method) => {
  const token = ListUrlPublics.some(str => coreUrl.includes(str)) ? '' : fnGetToken();
  return {
    method,
    async: true,
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
}

const request = {
  GET: (url, fnSuccess, fnError) => {
    const coreUrl = url.split('?')[0];
    fetch(`${envs.urlAPI}${url}`, {
      ...fnGetRequestHeaders(coreUrl, 'GET')
    }).then((resp) => fnSuccessResponse(resp, fnSuccess, fnError)).catch((err) => fnErrorResponse(err, fnError));
  },
  GETPdf: (url, data, fileName, fnError, fnFinaly = undefined) => {
    const token = ListUrlPublics.includes(url) ? '' : fnGetToken();
    fetch(`${envs.urlAPI}${url}`, {
      async: true,
      crossDomain: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      contentType: 'JSON',
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status >= 300) throw response;
        return response.blob();
      })
      .then((response) => {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(response);
        a.download = fileName;
        a.click();
        if (typeof fnFinaly === 'function') fnFinaly();
      })
      .catch((err) => {
        if (response.status === 301) {
          window.location.href = '/#/login';
          return;
        }
        if (typeof fnError === 'function') fnError(err);
        return err;
      });
  },
  fnExportToXLSX: (url, data = {}, fileName, fnFinaly = null) => {
    return new Promise(function (resolve, reject) {
      let token = ListUrlPublics.includes(url) ? '' : fnGetToken();
      if (!url) {
        return;
      }
      let dataRequest = JSON.stringify(data);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${envs.urlAPI}${url}`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.responseType = 'blob';
      xhr.onload = function (e) {
        if (this.status === 200) {
          var blob = this.response;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName);
          } else {
            var downloadLink = window.document.createElement('a');
            var contentTypeHeader = xhr.getResponseHeader("Content-Type");
            downloadLink.href = window.URL.createObjectURL(new Blob([blob], {
              type: contentTypeHeader
            }));
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          if (typeof fnFinaly === 'function') fnFinaly();
          resolve(xhr.response);
        }
      };
      xhr.onerror = function () {
        if (typeof fnFinaly === 'function') fnFinaly();
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send(dataRequest);
    });
  },
  fnExportToPDF: async function (url, data = {}, fileName) {
    return new Promise(function (resolve, reject) {
      let token = ListUrlPublics.includes(url) ? '' : fnGetToken();
      if (!url) {
        return;
      }
      let dataRequest = JSON.stringify(data);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${envs.urlAPI}${url}`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.responseType = 'blob';
      // request.data(data)
      xhr.onload = function (e) {
        if (this.status === 200) {
          var blob = this.response;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName);
          } else {
            var downloadLink = window.document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        }
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
      xhr.send(dataRequest);
    })
  },
  POST: (url, data, fnSuccess, fnError) => {
    fetch(`${envs.urlAPI}${url}`, {
      ...fnGetRequestHeaders(url, 'POST'),
      contentType: 'JSON',
      body: JSON.stringify(data),
    }).then((resp) => fnSuccessResponse(resp, fnSuccess, fnError)).catch((err) => fnErrorResponse(err, fnError));
  },

  uploadFiles: (files = [], fnSuccess, fnError) => {
    if (files.length <= 0) {
      return;
    }

    const formData = new FormData();
    files.forEach(item => {
      formData.append('files', item.file);
    });
    fetch(`${envs.urlAPI}fileUploads`, {
      ...fnGetRequestHeaders('', 'POST'),
      body: formData
    }).then(resp => fnSuccessResponse(resp, fnSuccess, fnError)).catch(err => fnErrorResponse(err, fnError));
  },
  PUT: (url, data, fnSuccess, fnError) => {
    fetch(`${envs.urlAPI}${url}`, {
      ...fnGetRequestHeaders(url, 'PUT'),
      contentType: 'JSON',
      body: JSON.stringify(data)
    }).then((resp) => fnSuccessResponse(resp, fnSuccess, fnError)).catch((err) => fnErrorResponse(err, fnError));
  },
  DELETE: (url, fnSuccess, fnError, body = {}) => {
    fetch(`${envs.urlAPI}${url}`, {
      ...fnGetRequestHeaders(url, 'DELETE'),
      body: JSON.stringify(body),
      contentType: 'JSON',
    }).then((resp) => fnSuccessResponse(resp, fnSuccess, fnError)).catch((err) => fnErrorResponse(err, fnError));
  }
};

const fnTest = () => {
  return 'texto';
};

export { request, fnTest };
