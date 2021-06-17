const request = require("request");

const headers = {
  "idpublicuser": "c256a74679d37c66ff3da35bbf8af58ca39541f8a350e853f442f3e42ab0171d",
  "Authorization": "ed_696",
  "Content-Type": "application/json; charset=utf-8",
  "Accept": "application/json",
};

const postRequest = (data) => {
  const options = {
    url: data.url,
    method: "POST",
    headers,
    body: JSON.stringify(data.body),
  };
  console.log("petitions-options:", options);
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error) {
        console.log("petitions-error:", error);
        reject(error);
      } else {
        const dataParsed = JSON.parse(body);
        console.log("petitions-resolve:", body);
        resolve(dataParsed);
      }
    });
  });
};

module.exports = {
  postRequest,
};
