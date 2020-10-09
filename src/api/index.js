import axios from 'axios';

// we will define a bunch of API calls here.
const apiUrl = process.env.REACT_APP_API_URI;

const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const getExampleData = () => {
  return axios
    .get(`https://jsonplaceholder.typicode.com/photos?albumId=1`)
    .then(response => response.data);
};

const getAuthHeader = authState => {
  if (!authState.isAuthenticated) {
    throw new Error('Not authenticated');
  }
  return { Authorization: `Bearer ${authState.idToken}` };
};

const getDSData = (url, authState) => {
  // here's another way you can compose together your API calls.
  // Note the use of GetAuthHeader here is a little different than in the getProfileData call.
  const headers = getAuthHeader(authState);
  if (!url) {
    throw new Error('No URL provided');
  }
  return axios
    .get(url, { headers })
    .then(res => JSON.parse(res.data))
    .catch(err => err);
};

const apiAuthGet = (endpoint, authHeader) => {
  return axios.get(`${apiUrl}${endpoint}`, { headers: authHeader });
};
const apiAuthPost = (endpoint, body, authHeader) => {
  return axios.post(`${apiUrl}${endpoint}`, body, { headers: authHeader });
};
const apiAuthPut = (endpoint, body, authHeader) => {
  return axios.put(`${apiUrl}${endpoint}`, body, { headers: authHeader });
};

const postNewChild = (authState, child) => {
  try {
    return apiAuthPost('/child', child, getAuthHeader(authState)).then(
      response => response.data
    );
  } catch (error) {
    return new Promise(() => {
      console.log(error);
      return [];
    });
  }
};
const getProfileData = authState => {
  try {
    return apiAuthGet('/profiles', getAuthHeader(authState)).then(
      response => response.data
    );
  } catch (error) {
    return new Promise(() => {
      console.log(error);
      return [];
    });
  }
};

const getStory = (authState, id) => {
  try {
    return apiAuthGet(`/stories/${id}`, getAuthHeader(authState)).then(
      response => response.data
    );
  } catch (error) {
    return new Promise(() => {
      console.log(error);
    });
  }
};
/**
 * Reads in gradelevels and avatars from the database to enforce referential integrity
 * @param {Object} authState necessary for API functionality
 * @returns {Promise} a promise that resolves to an array of [[avatars], [gradeLevels]]
 */
const getChildFormValues = async authState => {
  try {
    return Promise.all([
      apiAuthGet('/avatars', getAuthHeader(authState)),
      apiAuthGet('/gradelevels', getAuthHeader(authState)),
    ]).then(res => {
      return res.map(x => x.data);
    });
  } catch (err) {
    return new Promise(() => {
      console.log(err);
      return [];
    });
  }
};

const postNewAvatar = async (authState, body) => {
  try {
    return apiAuthPost('/avatars', body, getAuthHeader(authState)).then(
      res => res.data
    );
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 *
 * @param {Object} authState
 * @param {Object} body formData
 * @param {number} subId id of the full submission
 * @returns {array} an array of submission objects containing the image url, the checksum, and the page number
 */
const postNewWritingSub = async (authState, body, subId) => {
  try {
    return apiAuthPost(
      `/submit/write/${subId}`,
      body,
      getAuthHeader(authState)
    ).then(res => res.data);
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 *
 * @param {Object} authState
 * @param {Object} body formData
 * @param {number} subId id of the full submission
 * @returns {Object} submission object containing the image url, and the checksum
 */
const postNewDrawingSub = async (authState, body, subId) => {
  try {
    return apiAuthPost(
      `/submit/draw/${subId}`,
      body,
      getAuthHeader(authState)
    ).then(res => res.data);
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 * Returns an object identifying whether or not a child has completed their submission tasks
 * @param {Object} authState
 * @param {number} childid id of whatever child is performing the tasks
 * @param {number} storyid id of the story of the week
 * @returns {Object} Object of tasks and relevant id's
 */
const getChildTasks = async (authState, childid, storyid) => {
  try {
    return apiAuthGet(
      `/submission?childId=${childid}&storyId=${storyid}`,
      getAuthHeader(authState)
    ).then(response => response.data);
  } catch (err) {
    return new Promise(() => {
      console.log(err);
      return [];
    });
  }
};

/**
 *
 * @param {Object} authState
 * @param {number} submissionId id of the full submission
 * @returns {Object} enpty object on success
 */
const markAsRead = async (authState, submissionId) => {
  try {
    return apiAuthPut(
      `/submit/read/${submissionId}`,
      {},
      getAuthHeader(authState)
    ).then(response => response.data);
  } catch (err) {
    return new Promise(() => {
      console.log(err);
      return [];
    });
  }
};

export {
  sleep,
  getExampleData,
  getProfileData,
  getDSData,
  apiAuthGet,
  getStory,
  getAuthHeader,
  apiAuthPost,
  apiAuthPut,
  postNewChild,
  getChildFormValues,
  postNewAvatar,
  getChildTasks,
  postNewWritingSub,
  apiAuthPut,
  markAsRead,
  postNewDrawingSub,
};
