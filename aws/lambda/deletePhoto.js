const AWS = require('aws-sdk');
// Create an instance of the S3 client [The S3 client is used to perform operations on Amazon S3, like uploading, downloading, and deleting objects]
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
// [The try statement in JavaScript is used to define a block of code where you want to attempt a set of operations that might fail. If any error occurs within the try block, the control is passed to the corresponding catch block, where the error can be handled gracefully]
    try {
        // store object id (primary key) in variable
        const photoId = event.pathParameters.photoId;
        // define parameters for S3 `deleteObject` operation
        const s3Params = {
            Bucket: 'photo-gallery-images-alexjp87',
            Key: `${photoId}.jpg`,
        };

        // asynchronously delete object from bucket, and convert S3 SDK callback to a promise() object
        await S3.deleteObject(s3Params).promise();

        // define parameters for DynamoDB `delete` operation
        const dynamoParams = {
            TableName: 'photoGallery',
            Key: {
                photoId: photoId,
            },
        };

        // asynchronously delete metadata associated with `photoId` from DynamoDB photoGallery table, and convert DynamoDB SDK callback to a promise() object
        await DynamoDB.delete(dynamoParams).promise();

        // If both delete operations are succesful:
        return {
            // return appropriate HTTP status code
            statusCode: 200,
            // return json response to confirm successful deletion
            body: JSON.stringify({
                message: 'Photo and metadata deleted successfully',
            }),
        };

    // If either or both delete operations fail:
    } catch (error) {
        // log error to console
        console.error(error);
        return {
            // return appropriate HTTP status code
            statusCode: 500,
            // return json response informing that delete operation failed
            body: JSON.stringify({
                message: 'Failed to delete photo or metadata',
                error: error.message,
            }),
        };
    }
};
