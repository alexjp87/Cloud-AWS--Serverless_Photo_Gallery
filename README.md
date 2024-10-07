# Serverless Photo Gallery


## Cloud/AWS project - practice using cloud technologies & AWS services by building a photo gallery web app with a scalable, serverless architecture


### Project Goals
The goal of this project is to gain experience designing and implementing serverless architecture using AWS services.


### Project Description
'Serverless Photo Gallery' is a cloud-based photo gallery application that allows users to upload, view, and delete images.

AWS services are leveraged to provide a scalable, serverless architecture with minimal infrastructure management.

Users interact with a web interface hosted on Amazon S3, where they can upload photos, view their gallery, and manage images.

The backend logic is handled by AWS Lambda, which processes image uploads and deletions, while metadata is stored in Amazon DynamoDB.

The application is designed to dynamically fetch and display images from Amazon S3, offering a fast and cost-efficient solution for hosting a photo gallery without requiring the management of servers.


### User Stories
From the perspective of the cloud engineer:

- As a future cloud professional, I want to create a Lambda function that allows users to upload images through the web application, so that the images are stored in Amazon S3 and the metadata is saved in DynamoDB for future retrieval

- As a future cloud professional, I want to build a frontend that dynamically fetches image URLs from DynamoDB and displays them by retrieving the image files from Amazon S3, so that users can view all their uploaded photos in the gallery

- As a future cloud professional, I want to implement an API endpoint through API Gateway and Lambda that allows users to delete images from the gallery, ensuring that both the image file in S3 and the corresponding metadata in DynamoDB are removed

From the perspective of the user:

- As a user, I want to easily upload images through the web interface, so that I can store and view my photos in an online gallery

- As a user, I want to be able to see all of my uploaded images displayed in a gallery, so that I can browse and view them conveniently

- As a user, I want to delete any unwanted images from my gallery, so that I can manage my photo collection and remove photos I no longer need


### Design Choices

Architectural overview:

!["spg_architecture"](architecture_diagrams/spg_architecture.drawio.png "spg architecture")

Upload architecture:

!["spg_upload_architecture"](architecture_diagrams/spg_upload_architecture.drawio.png "spg upload architecture")

### Technologies Used

AWS Services:
- Amazon S3 (static hosting/storage)
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB

Front-end:
- HTML
- CSS
- JavaScript

Version control:
- Git
- Github

Diagrams:
- Draw.io

