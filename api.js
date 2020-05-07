'use strict'

const url = require('url');
const { nanoid } = require('nanoid');
const fs = require('fs')
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const config = JSON.parse(fs.readFileSync('config.json'));

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

async function getPath (longUrl) {
  const path = nanoid(7)
  if (isAvailable(path)) {
    return path
  }
  getPath(longUrl)
}

async function isAvailable(path) {
  const params = {
    Bucket: config.BUCKET,
    Key: path
  }
  // A bit unintuitive, but an error means path is available (no object found)
  return s3.headObject(params)
    .promise()
    .then(result => false)
    .catch(err => true)
}

async function saveRedirect(path, longUrl) {
  const params = {
    Bucket: config.BUCKET,
    Key: path,
    'WebsiteRedirectLocation': longUrl
  }
  
  return s3.putObject(params)
    .promise()
    .then(() => params.Key)
}

function buildResponse(statusCode, message, path, event, context) {
  const body = { message }
  
  if (path) {
    body.path = path
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
    .then(getPath)
    .then(path => saveRedirect(path, longUrl))
    .then(path => buildResponse(200, 'URL successfully shortened', path))
    .catch(err => buildResponse(err.statusCode, err.message));
}
