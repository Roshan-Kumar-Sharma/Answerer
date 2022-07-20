
const API_BASE_URL = window.location.origin;

async function callAPI(path, options) {
  const result = await fetch(`${path}`, options)
    .then(response => response.json())
  return result;
}

const apiTestForm = document.querySelector("#test-api-call");

const subject = document.querySelector("#api-subject");
const topic = document.querySelector("#api-topic");
const limit = document.querySelector("#api-limit");
const offset = document.querySelector("#api-offset");
const isAnswered = document.querySelector("#api-is-answered")

const jsRequestCode = document.querySelector("#api-call-js-code");
const jsonResponse = document.querySelector("#api-call-output");

[topic, subject, limit, isAnswered].forEach(element => {
  element.addEventListener("change", (e) => {
    reloadCodePanel();
  });
})
offset.addEventListener('input', e => {
  reloadCodePanel();
})

apiTestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const { url } = generateCode();
  runCode(url);
})

window.addEventListener('load', async (e) => {
  const { url } = reloadCodePanel();
  runCode(url);
});

function generateCode() {
  const subjectValue = subject.value;
  const topicValue = topic.value;
  const limitValue = limit.value;
  const offsetValue = offset.value;
  const isAnsweredValue = isAnswered.value;

  const queryParams = Object.entries({
    topic: topicValue,
    subject: subjectValue,
    limit: limitValue,
    'is_answered': isAnsweredValue,
  })
    .reduce((a, [key, value]) => {
      if(value !== "-1") {
        a[key] = value;
      }
      return a;
    }, {});

  const queryString = [
    ...Object.entries(queryParams)
        .map(([key, value]) => encodeURI(`${key}=${value}`))
    , ...[...(offsetValue === '' ? [] : [encodeURI(`offset=${offsetValue}`)])]
  ].join('&');
  
  let resultURL = `${API_BASE_URL}/api/v1/posts${queryString !== '' ? `?${queryString}` : ''}`;

  const code = `fetch('${resultURL}')
  .then(response => response.json())
  .then(json => console.log(json))
`;

  return {
    url: resultURL,
    code
  };
}

function reloadCodePanel() {
  const codegenResult = generateCode();
  const { code, url } = codegenResult;

  jsRequestCode.innerHTML = code;

  hljs.highlightAll();

  return codegenResult;
}

async function runCode(url) {
  try {
    const data = await callAPI(url);
    jsonResponse.innerHTML = JSON.stringify(data, null, 2);
  } catch (e) {
    jsonResponse.innerHTML = 'Error occured while calling the API.';
  }

  hljs.highlightAll();
}

