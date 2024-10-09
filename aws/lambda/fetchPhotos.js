// Import and load AWS SDK [the require() function loads JavaScript modules into the script, allowing interaction with the code]
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

// Create an instance of the DynamoDB DocumentClient [DocumentClient abstracts underlying data types and makes it easier to work with JSON-style objects when interacting with DynamoDB. Typically used for common DynamoDB operations like put, get, scan, query, and delete]
const DynamoDB = new AWS.DynamoDB.DocumentClient();

// Define asynchronous function to fetch photos and associated metadata [asynchronous functions use `await` to handle asynchronous operations (e.g. calling AWS services)] [`exports.handler` is the entry point for AWS Lambda when the function is invoked (by an event (parameter))]:
exports.handler = async (event) => {
    // Target 'photoGallery' table
    const params = {
        TableName: 'photoGallery',
    };
    // asynchronously retrieve all items from photoGallery and convert to promise() objects (so compatible with `await`)
    const data = await DynamoDB.scan(params).promise();
    return {
        // return appropriate HTTP response to API (API Gateway)
        statusCode: 200, 
        // return `data` object as json
        body: JSON.stringify(data.Items) 
    };
};
