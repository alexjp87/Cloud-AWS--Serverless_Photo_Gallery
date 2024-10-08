const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
// Load UUID library (for generating unique IDs)
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        // convert encoded image to binary (so can be uploaded to S3)
        const file = Buffer.from(event.body, 'base64');
        // generate a unique ID
        const photoId = uuidv4();

        const s3Params = {
            Bucket: 'photo-gallery-images-alexjp87',
            Key: `${photoId}.jpg`,
            // (file = image content as binary (SEE LINE 10))
            Body: file,
            ContentType: 'image/jpeg',
        };

        // asynchronously upload (store) the image to S3 bucket, and convert S3 SDK callback response to promise() object
        await S3.putObject(s3Params).promise();

        const dynamoParams = {
            TableName: 'photoGallery',
            Item: {
                photoId: photoId,
                // title derived from upload form 'title' input box (else 'Untitled-photo')
                title: event.queryStringParameters.title || 'Untitled-photo',
                // photo S3 URL
                url: `https://photo-gallery-images-alexjp87.s3.amazonaws.com/${photoId}.jpg`,
                // timestamp
                uploadDate: new Date().toISOString(),
                // title derived from upload form 'title' input box (else empty string)
                description: event.queryStringParameters.description || '',
            },
        };

        // asynchronously upload metadata to DynamoDB, and convert DynamoDB callback response to promise() object
        await DynamoDB.put(dynamoParams).promise();

        // If both upload operations are successful:
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Photo uploaded successfully!',
                photoId: photoId,
                s3Url: `https://photo-gallery-images-alexjp87.s3.amazonaws.com/${photoId}.jpg`,
            }),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to upload photo',
                error: error.message,
            }),
        };
    }
};
