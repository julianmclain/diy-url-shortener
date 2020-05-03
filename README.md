## TODO
- Figure out how to handle errors
  - https://www.serverless.com/framework/docs/providers/aws/events/apigateway#status-codes
  - Look at the API Gateway stuff in serverless-stack-api
- Get a shorter domain https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html
- support https
- Beautify with css
- Polish README
- Take notes for the blog post
- Extra polish: add test
- Extra polish: lock fields and show busy signal while making request https://pqina.nl/blog/async-form-posts-with-a-couple-lines-of-vanilla-javascript/

## Resources
- Configure requests to an object in s3 to respond with a 301 redirect https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html
- The `putObject` method on the s3 client https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
- The `aws-sdk` has an api to use promises instead of callbacks https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html
- Not sure if this is because of AWS Lambda support or `serverless` magic, but you can define handlers as async functions (no need to use the callback param) https://www.serverless.com/blog/common-node8-mistakes-in-lambda/
