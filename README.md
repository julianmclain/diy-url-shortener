# DIY URL Shortener

A simple tool to shorten URLs. Built as cheaply as possible using mostly AWS s3, Lambda, and Cloudfront

## Notes

### Setting up s3 to store redirects
With s3, you can 301 redirect requests to another URL. Source: [AWS documentation - how to page
redirect](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html).

### Writing the Lambda code
It was good to see callbacks ditched from the Node Lambda handlers. I'm not sure
if this is supported by Lambda directly or due to `serverless` magic, but you
can define handlers as async functions.  
**Source:** [Serverless blog - common mistakes in
lambda](https://www.serverless.com/blog/common-node8-mistakes-in-lambda/)
```javascript
  module.exports.handle = async (event, context) => {}
```


Also, the Node `aws-sdk` has an API lets you treat requests as promises
instead of using callbacks. **Source:** [AWS docs - using
promises](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html)
```javascript
  s3.putObject(params)
    .promise()
    .then(handleSuccess)
```

### Enforcing access to s3 via CLoudFront
If you want to use an SSL cert from ACL with CloudFront, make sure you [generate
the cert in the US East
region](https://aws.amazon.com/premiumsupport/knowledge-center/migrate-ssl-cert-us-east/).
So annoying >.< 

It was tricky to enforce accessing s3 via CloudFront. You can't use the "Origin
Access Identity" feature that makes it simple to do this when your s3
bucket isn't serving a static website. Instead you setup Cloudfront to include a custom `Referer` header on each
request. Then, modify the s3 Bucket policy so it only accepts requests containing
the header. **Source:** The 3rd option in this doc explains the process - [AWS docs](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/).

## TODO
- Extra credit TODO: add test
- Extra credit TODO: lock fields and show a spinner while making request
  https://pqina.nl/blog/async-form-posts-with-a-couple-lines-of-vanilla-javascript/
