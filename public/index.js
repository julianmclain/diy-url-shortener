document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  makeRequest(form.action, form['longUrl'].value)
})

function makeRequest(apiUrl, longUrl) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ longUrl })
  }

  fetch(apiUrl, fetchOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function handleResponse(response) {
  const messageDiv = document.getElementById('message')
  
  if (response.ok) {
    const responseJson = await response.json()
    const shortUrl = 
      window.location.protocol +
      '//' +
      window.location.host +
      '/' +
      responseJson.shortUrl
    // TODO: add a class on the messageDiv to style it as an success

    messageDiv.textContent = `Success: your short URL is ${shortUrl}`
  } else {
    // TODO: add a class on the messageDiv to style it as an error
    // TODO: figure out how you want to present these errors
    // TODO: get lambda function to be able to return 400 error when no longUrl present
    console.error('non 2xx response')
    console.log(response)
  }
}

function handleError(err) {
  const messageDiv = document.getElementById('message')
  // TODO: add a class on the messageDiv to style it as an error
  messageDiv.textContent = 'Connection failure, please try again'
  console.error(err)
}