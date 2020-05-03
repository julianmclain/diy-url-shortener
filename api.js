'use strict'

const url = require('url');
const { nanoid } = require('nanoid');
const fs = require('fs')
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const config = JSON.parse(fs.readFileSync('config.json'))

async function validate (longUrl) {
  if (!longUrl) {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is required'
    });
  }

  const {protocol, host } = url.parse(longUrl)
  if (!protocol || !host) {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is invalid'
    });
  }

  return longUrl;
}

async function getShortUrl (longUrl) {
  const path = nanoid(7)
  if (isPathFree) {
    return path
  }
  getShortUrl(longUrl)
}

async function isPathFree(path) {
  return true
}

async function saveRedirect(shortUrl, longUrl) {
  const params = {
    Bucket: config.BUCKET,
    Key: shortUrl,
    'WebsiteRedirectLocation': longUrl
  }
  
  return s3.putObject(params)
    .promise()
    .then(() => params.Key)
}

function buildResponse(statusCode, message, shortUrl) {
  const body = { message }
  
  if (shortUrl) {
    body.shortUrl = shortUrl
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode,
    body: JSON.stringify(body)
  }
}

module.exports.handle = async (event, context) => {
  const { longUrl } = JSON.parse(event.body)
  return validate(longUrl)
    .then(getShortUrl)
    .then(shortUrl => saveRedirect(shortUrl, longUrl))
    .then(shortUrl => buildResponse(200, 'URL successfully shortened', shortUrl))
    .catch(err => buildResponse(err.statusCode, err.message));
}
