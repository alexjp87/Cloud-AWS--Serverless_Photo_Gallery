# Serverless Photo Gallery


## Cloud/AWS project - practice using cloud technologies & AWS services by building a photo gallery web app with scalable, serverless architecture


### Project Goals
The goal of this project is to gain experience designing and implementing serverless architecture using AWS services.


### Project Description
'Serverless Photo Gallery' is a cloud-based photo gallery application that allows users to interact with a web interface hosted on Amazon S3, where they can upload photos, view their gallery, and delete images.

AWS services are leveraged to provide a scalable, serverless architecture requiring minimal infrastructure management.

The backend logic is handled by AWS Lambda, which processes image uploads and deletions, while metadata is stored in Amazon DynamoDB.

The application is designed to dynamically fetch and display images from Amazon S3, offering a fast and cost-efficient solution for hosting a photo gallery without the management of servers.


### User Stories
From the perspective of the cloud professional:

- As a future cloud professional, I want to create a Lambda function that allows users to upload images through the web application, so that the images are stored in Amazon S3 and the metadata is saved in DynamoDB for future retrieval

- As a future cloud professional, I want to build a frontend that dynamically fetches image URLs from DynamoDB and displays them by retrieving the image files from Amazon S3, so that users can view all their uploaded photos in the gallery

- As a future cloud professional, I want to implement an API endpoint through API Gateway and Lambda that allows users to delete images from the gallery, ensuring that both the image file in S3 and the corresponding metadata in DynamoDB are removed

From the perspective of the user:

- As a user, I want to easily upload images through the web interface, so that I can store and view my photos in an online gallery

- As a user, I want to be able to see all of my uploaded images displayed in a gallery, so that I can browse and view them conveniently

- As a user, I want to delete any unwanted images from my gallery, so that I can manage my photo collection and remove photos I no longer need


### Design Choices

#### Architecture Diagrams:

Architectural overview:

!["spg_architecture"](images/architecture_diagrams/spg_architecture.png "SPG architecture")

Upload architecture:

!["spg_upload_architecture"](images/architecture_diagrams/spg_upload_architecture.png "SPG upload architecture")

View architecture:

!["spg_view_architecture"](images/architecture_diagrams/spg_view_architecture.png "SPG view architecture")

Delete architecture:

!["spg_delete_architecture"](images/architecture_diagrams/spg_delete_architecture.png "SPG delete architecture")

#### AWS Infrastructure:

**Amazon S3:** Create and configure S3 bucket to serve as both a storage solution for uploaded images and as a host for the static web app: update bucket policy to allow public read access; configure CORS to allow the web app to directly communicate with the bucket. Steps completed using the AWS management console.

**Step 1** - Create an S3 Bucket

!["create-bucket"](images/aws_screenshots/S3/01_create_bucket.PNG "Create S3 bucket")

**Step 2** - Set the S3 bucket policy (make bucket objects publicly accessible so users can retrieve their photos via the application)

!["s3_policy"](images/aws_screenshots/S3/02_s3_policy.PNG "S3 policy")

Policy explanation:

`"Version": "2012-10-17":` language version

`"Sid": "PublicReadGetObject"` policy identifier

`"Effect": "Allow"` "ALLOW"

`"Principal": "*"` "ALL USERS" ("*" means apply policy to all users)

`"Action": "s3:GetObject"` "TO PERFORM THE GetObject ACTION (i.e. retrieve objects (images) from the bucket)"

`"Resource": "arn:aws:s3:::photo-gallery-images-{your-unique-id}/*"` "APPLY POLICY TO ALL BUCKET OBJECTS" (/* specifies all files)

**Step 3** - Enable Cross-Origin Resource Sharing (because using serverless architecture, i.e. the web app communicates directly with S3 to perform operations. Since the frontend and S3 are on different domains (i.e., the browser’s domain and AWS’s domain), this is a cross-origin request)

!["cross-origin_resource_sharing"](images/aws_screenshots/S3/03_cross-origin_resourse_sharing.PNG "Cross-Origin Resource Sharing")

Configuration explanation:

`"AllowedHeaders":["*"]` "ALLOW THE BROWSER TO SEND ANY HTTP HEADERS IN THE REQUEST TO THE S3 BUCKET"

`"AllowedMethods":["GET", "HEAD"]` (define HTTP methods permitted for cross-origin requests)

`"GET"` "ALLOW CLIENT TO RETRIEVE RESOUCES FROM BUCKET"

`"HEAD"` "ALLOW CLIENT TO REQUEST RESOURCE METADATA"

`"AllowedOrigins":["*"]` "ALLOW ANY ORIGIN (DOMAIN) TO SEND CROSS-ORIGIN REQUESTS TO BUCKET" (restrict to specific origins for increased security)


**Amazon DynamoDB:** Create DynamoDB table to serve as storage solution for uploaded image metadata: configure AWS CLI; create table; verify table creation; test table by creating sample record and querying to verify the record was created; delete record before verifying deletion was successful. Steps completed using AWS CLI in bash terminal.

**Step 1** Configure AWS CLI using access key ID and secret access key contained in 'admin_credentials', specify default region name and ouput format

!["01_aws_configure"](images/aws_screenshots/DynamoDB/01_aws_configure.PNG "AWS configure")

**Step 2** Create Table

!["02_create_table"](images/aws_screenshots/DynamoDB/02_create_table.PNG "Create table")

Create table explanation (`\` is a line continuation symbol, used for command readability):

`aws dynamodb create-table` "CREATE A DynamoDB TABLE"

`--table-name photoGallery` "NAME THE TABLE photoGallery"

`--attribute-definitions AttributeName=photoId,AttributeType=S` "DEFINE 1 ATTRIBUTE FOR THE TABLE, NAME=photoId, TYPE=String (`S`)

`--key-schema AttributeName=photoId,KeyType=HASH`"DEFINE THE TABLE PRIMARY/PARTITION KEY AS photoId"

`--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5` "SET TABLE READ AND WRITE CAPACITY UNITS" (Used to enhance cost and performance optimisation, ReadCapacityUnits=5 specifies that the table will be able to handle 5 reads per second, WriteCapacityUnits=5 specifies that the table will be able to handle 5 writes per second)

The json output currently displays `"TableStatus": "CREATING"`. This status will change to active once the table is ready for use.

**Step 3** Verify table creation

!["03_verify_table"](images/aws_screenshots/DynamoDB/03_verify_table.PNG "Verify table creation")

**Step 4** Add test item to table (include `"photoId"`, `"title"` and `"url"` for `--item`)

!["04_test_add_item"](images/aws_screenshots/DynamoDB/04_test_add_item.PNG "Add test item")

**Step 5** Verify item creation (by default, `scan` returns all attributes for all items in a table)

!["05_test_verify_item"](images/aws_screenshots/DynamoDB/05_test_verify_item.PNG "Verify test item")

**Step 6** Delete test item (primary key `"photoId": {"S": "1"}` necessarily used to specify item for delete)

!["06_test_delete_item"](images/aws_screenshots/DynamoDB/06_test_delete_item.PNG "Delete test item")

**Step 7** Verify item successfully deleted (`scan` output shows empty table)

!["07_test_verify_delete"](images/aws_screenshots/DynamoDB/07_test_verify_delete.PNG "Verify delete successful")

**AWS IAM:** Create an IAM role allowing AWS Lambda to assume access to S3 and DynamoDB: Create trust policy; attach trust policy to IAM role; verify role was created; attach AWS-managed policies to role allowing full access to Amazon S3 and Amazon DynamoDB services; verify policies were attached. Steps completed using AWS CLI in bash terminal.

**Step 1** Create trust policy json file (permits AWS Lambda to assume IAM role)

!["01_trust_policy"](images/aws_screenshots/Lambda/01_trust_policy.PNG "Trust policy")

**Step 2** Create IAM role, attaching trust policy

!["02_create_role"](images/aws_screenshots/Lambda/02_create_role.PNG "Create IAM role")

**Step 3** Verify IAM role was created

!["03_verify_role"](images/aws_screenshots/Lambda/03_verify_role.PNG "Verify IAM role")

**Step 4** Attach AWS-managed policy for full S3 access

!["04_s3_access_policy"](images/aws_screenshots/Lambda/04_s3_access_policy.PNG "S3 access policy")

**Step 5** Attach AWS-managed policy for full DynamoDB access

!["05_dynamodb_access_policy"](images/aws_screenshots/Lambda/05_dynamodb_access_policy.PNG "DynamoDB access policy")

**Step 6** Verify policies were attached to IAM role

!["06_verify_policies"](images/aws_screenshots/Lambda/06_verify_policies.PNG "Verify policies")



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
- Diagrams.net

