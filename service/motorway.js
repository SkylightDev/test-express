const axios = require("axios");

const MOTORWAY_BASE_URL = "https://motorway-challenge-api.herokuapp.com/api";
const MAX_RETRY_COUNT = 5;

exports.retrieveRecursive = async (token, pageNumber = 1, retryCount=0, resultArray = []) => {
  console.log('entering recursive page:', pageNumber)

  if (retryCount >= MAX_RETRY_COUNT)
    throw Error('Max retry count exceded')
  
  let nextCall = false;
  try {
    const response = await axios.get(`${MOTORWAY_BASE_URL}/visits?page=${pageNumber}&token=${token}`);
    if (Object.keys(response.data).length && response.data.data.length > 0) {
      resultArray = resultArray.concat(response.data.data);
      nextCall = true;
    }
  } catch (err) {
    if (err.response && err.response.status === 403) {
      token = await getToken()
      pageNumber -= 1; // retry the same call
      retryCount += 1;
      nextCall = true;
      console.log('error token expired, retry with different token', token, pageNumber, retryCount)
    }
    else {
      throw err;
    }
  }

  if (nextCall) return await this.retrieveRecursive(token, pageNumber + 1, retryCount, resultArray);
  else return resultArray;
};



exports.getVisits = async () => {
  try {
    const token = await getToken();
    console.log('get visits with token: ', token)
    return visitsArray = await this.retrieveRecursive(token);

  } catch (err) {
    throw err;
  }
};

const getToken = async () => {
  try {
    const result = await axios.get(`${MOTORWAY_BASE_URL}/login`);

    return result.data.token;
  } catch (err) {
     console.log("Error calling login to get token", err);
    throw err
  }
}
