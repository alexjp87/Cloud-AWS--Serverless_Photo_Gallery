# Serverless Photo Gallery


## Cloud/AWS project - practice using cloud technologies & AWS services by building a photo gallery web app with scalable, serverless architecture


### Project Goals
The goal of this project is to gain experience designing and implementing serverless architecture using AWS services.


### Project Description
'Serverless Photo Gallery' is a cloud-based photo gallery application that allows users to interact with a web interface hosted on Amazon S3, where they can upload photos, view their gallery, and delete images.

AWS services are leveraged to provide a scalable, serverless architecture requiring minimal infrastructure management.

The backend logic is handled by AWS Lambda, which processes image uploads and deletions, while metadata is stored in Amazon DynamoDB.

The application is designed to dynamically fetch and display images from Amazon S3, offering a fast and cost-efficient solution for hosting a photo gallery without the management of servers.

## User Stories
From the perspective of the cloud professional:

- As a future cloud professional, I want to create a Lambda function that allows users to upload images through the web application, so that the images are stored in Amazon S3 and the metadata is saved in DynamoDB for future retrieval

- As a future cloud professional, I want to build a frontend that dynamically fetches image URLs from DynamoDB and displays them by retrieving the image files from Amazon S3, so that users can view all their uploaded photos in the gallery

- As a future cloud professional, I want to implement an API endpoint through API Gateway and Lambda that allows users to delete images from the gallery, ensuring that both the image file in S3 and the corresponding metadata in DynamoDB are removed

From the perspective of the user:

- As a user, I want to easily upload images through the web interface, so that I can store and view my photos in an online gallery

- As a user, I want to be able to see all of my uploaded images displayed in a gallery, so that I can browse and view them conveniently

- As a user, I want to delete any unwanted images from my gallery, so that I can manage my photo collection and remove photos I no longer need


## Design Choices

### Architecture Diagrams

**Architectural overview:**

!["spg_architecture"](images/architecture_diagrams/spg_architecture.png "SPG architecture")

**Upload architecture:**

!["spg_upload_architecture"](images/architecture_diagrams/spg_upload_architecture.png "SPG upload architecture")

**View architecture:**

!["spg_view_architecture"](images/architecture_diagrams/spg_view_architecture.png "SPG view architecture")

**Delete architecture:**

!["spg_delete_architecture"](images/architecture_diagrams/spg_delete_architecture.png "SPG delete architecture")
***
### AWS Infrastructure


### - Amazon S3
- Create and configure S3 bucket to serve as both a storage solution for uploaded images and as a host for the static web app: update bucket policy to allow public read access; configure CORS to allow the web app to directly communicate with the bucket. Steps 1-3 completed using the AWS management console, steps 4-5 completed using AWS CLI in bash terminal.

***Step 1*** - **Create an S3 Bucket**

!["create-bucket"](images/aws_screenshots/S3/01_create_bucket.PNG "Create S3 bucket")

***Step 2*** - **Set the S3 bucket policy** (make bucket objects publicly accessible so users can retrieve their photos via the application)

!["s3_policy"](images/aws_screenshots/S3/02_s3_policy.PNG "S3 policy")

*Policy explanation:*

`"Version": "2012-10-17":` *language version*

`"Sid": "PublicReadGetObject"` *policy identifier*

`"Effect": "Allow"` *"ALLOW"*

`"Principal": "*"` *"ALL USERS"* ("*" means apply policy to all users)

`"Action": "s3:GetObject"` *"TO PERFORM THE GetObject ACTION"* (i.e. retrieve objects (images) from the bucket)

`"Resource": "arn:aws:s3:::photo-gallery-images-{your-unique-id}/*"` *"APPLY POLICY TO ALL BUCKET OBJECTS"*

***Step 3*** - **Enable Cross-Origin Resource Sharing** (because using serverless architecture, i.e. the web app communicates directly with S3 to perform operations. Since the frontend and S3 are on different domains (i.e., the browser’s domain and AWS’s domain), this is a cross-origin request)

!["cross-origin_resource_sharing"](images/aws_screenshots/S3/03_cross-origin_resourse_sharing.PNG "Cross-Origin Resource Sharing")

*Configuration explanation:*

`"AllowedHeaders":["*"]` *"ALLOW THE BROWSER TO SEND ANY HTTP HEADERS IN THE REQUEST TO THE S3 BUCKET"*

`"AllowedMethods":["GET", "HEAD"]` (define HTTP methods permitted for cross-origin requests)

`"GET"` *"ALLOW CLIENT TO RETRIEVE RESOUCES FROM BUCKET"*

`"HEAD"` *"ALLOW CLIENT TO REQUEST RESOURCE METADATA"*

`"AllowedOrigins":["*"]` *"ALLOW ANY ORIGIN (DOMAIN) TO SEND CROSS-ORIGIN REQUESTS TO BUCKET"* (restrict to specific origins for increased security)

***Step 4*** - **Enable static hosting on S3 bucket** (enable S3 bucket to serve web app (expose `app` files via a web URL))

!["04_enable_static_hosting"](images/aws_screenshots/S3/04_enable_static_hosting.PNG "Enable S3 static hosting")

***Step 5*** - **Verify static hosting enabled**

!["05_verify_static_hosting"](images/aws_screenshots/S3/05_verify_static_hosting.PNG "Verify static hosting enabled")

***Step 6*** - **Upload static website (/app) files**

!["06_upload_app_files"](images/aws_screenshots/S3/06_upload_app_files.PNG "Upload static website files")

***Step 7*** - **Verify static website files uploaded**

!["07_verify_app_upload"](images/aws_screenshots/S3/07_verify_app_upload.PNG "Verify files uploaded")

***

### - Amazon DynamoDB
- Create DynamoDB table to serve as storage solution for uploaded image metadata: configure AWS CLI; create table; verify table creation; test table by creating sample record and querying to verify the record was created; delete record before verifying deletion was successful. Steps completed using AWS CLI in bash terminal.

***Step 1*** - *Configure AWS CLI* (using access key ID and secret access key contained in 'admin_credentials', specify default region name and ouput format)

!["01_aws_configure"](images/aws_screenshots/DynamoDB/01_aws_configure.PNG "AWS configure")

***Step 2*** - *Create Table*

!["02_create_table"](images/aws_screenshots/DynamoDB/02_create_table.PNG "Create table")

*Create table explanation:* (`\` is a line continuation symbol, used for command readability):

`aws dynamodb create-table` *"CREATE A DynamoDB TABLE"*

`--table-name photoGallery` *"NAME THE TABLE photoGallery"*

`--attribute-definitions AttributeName=photoId,AttributeType=S` *"DEFINE 1 ATTRIBUTE FOR THE TABLE, NAME=photoId, TYPE=String (`S`)"*

`--key-schema AttributeName=photoId,KeyType=HASH` *"DEFINE THE TABLE PRIMARY/PARTITION KEY AS photoId"*

`--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5` *"SET TABLE READ AND WRITE CAPACITY UNITS"* (Used to enhance cost and performance optimisation, ReadCapacityUnits=5 specifies that the table will be able to handle 5 reads per second, WriteCapacityUnits=5 specifies that the table will be able to handle 5 writes per second)

The json output currently displays `"TableStatus": "CREATING"`. This status will change to active once the table is ready for use.

***Step 3*** - *Verify table creation*

!["03_verify_table"](images/aws_screenshots/DynamoDB/03_verify_table.PNG "Verify table creation")

***Step 4*** - *Add test item to table* (include `"photoId"`, `"title"` and `"url"` for `--item`)

!["04_test_add_item"](images/aws_screenshots/DynamoDB/04_test_add_item.PNG "Add test item")

***Step 5*** - *Verify item creation* (by default, `scan` returns all attributes for all items in a table)

!["05_test_verify_item"](images/aws_screenshots/DynamoDB/05_test_verify_item.PNG "Verify test item")

***Step 6*** - *Delete test item* (primary key `"photoId": {"S": "1"}` necessarily used to specify item for delete)

!["06_test_delete_item"](images/aws_screenshots/DynamoDB/06_test_delete_item.PNG "Delete test item")

***Step 7*** - *Verify item successfully deleted* (`scan` output shows empty table)

!["07_test_verify_delete"](images/aws_screenshots/DynamoDB/07_test_verify_delete.PNG "Verify delete successful")

***

### - AWS IAM:
- Create an IAM role allowing AWS Lambda to assume access to S3 and DynamoDB: Create trust policy; attach trust policy to IAM role; verify role was created; attach AWS-managed policies to role allowing full access to Amazon S3 and Amazon DynamoDB services; verify policies were attached. Steps completed using AWS CLI in bash terminal.

***Step 1*** - *Create trust policy json file* (permits AWS Lambda to assume IAM role)

!["01_trust_policy"](images/aws_screenshots/IAM/01_trust_policy.PNG "Trust policy")

***Step 2*** - *Create IAM role, attaching trust policy*

!["02_create_role"](images/aws_screenshots/IAM/02_create_role.PNG "Create IAM role")

***Step 3*** - *Verify IAM role was created*

!["03_verify_role"](images/aws_screenshots/IAM/03_verify_role.PNG "Verify IAM role")

***Step 4*** - *Attach AWS-managed policy (for full S3 access)*

!["04_s3_access_policy"](images/aws_screenshots/IAM/04_s3_access_policy.PNG "S3 access policy")

***Step 5*** -  *Attach AWS-managed policy for full DynamoDB access*

!["05_dynamodb_access_policy"](images/aws_screenshots/IAM/05_dynamodb_access_policy.PNG "DynamoDB access policy")

***Step 6*** - *Verify policies were attached to IAM role*

!["06_verify_policies"](images/aws_screenshots/IAM/06_verify_policies.PNG "Verify policies")

***

### - Amazon API Gateway
- Create an Amazon API Gateway REST API to route requests: create API; create and verify resource (/photos); create and verify GET, POST and DELETE resource methods; deploy API. Steps completed using AWS CLI in bash terminal.

***Step 1*** - *Create REST API* (routes operation requests to Lambda)

!["01_create_rest_api"](images/aws_screenshots/API_Gateway/01_create_rest_api.PNG "Create REST API")

***Step 2*** - *Create API resource*

!["02_create_resource"](images/aws_screenshots/API_Gateway/02_create_resource.PNG "Create /phtots resource")

***Step 3*** - *Verify resource was created*

!["03_verify_resource"](images/aws_screenshots/API_Gateway/03_verify_resources.PNG "Verify /photos resource")

***Step 4*** - *Create GET, POST and DELETE resource methods* (`"authorizationType": "NONE"` allows method access without credentials)

!["04_get_method"](images/aws_screenshots/API_Gateway/04_get_method.PNG "Create GET method")

!["04_post_method"](images/aws_screenshots/API_Gateway/04_post_method.PNG "Create POST method")

!["04_delete_method"](images/aws_screenshots/API_Gateway/04_delete_method.PNG "Create DELETE method")

***Step 5*** - *Verify all resource methods were created*

!["05_verify_methods"](images/aws_screenshots/API_Gateway/05_verify_methods.PNG "Verify resource methods")

***Step 6*** - *Deploy API Gateway API* (Make available to clients) (`--stage-name prod` deploys API to Production stage)

!["06_deploy_api"](images/aws_screenshots/API_Gateway/06_deploy_api.PNG "Deploy REST API")

***

### - AWS Lambda
- Create and deploy Lambda functions (written in Node.js) for fetch, upload and delete operations (SEE </aws/lambda/> .js files for code breakdown) Create and deploy Lambda functions; integrate Lambda functions with API Gateway. Steps completed using AWS CLI in bash terminal.

***Step 1*** - *Create and deploy `FetchPhotos` function* (specify the function's runtime, execution role, and handler, plus other attributes, and provide the Lambda function code as a ZIP file)

!["01_fetch_function"](images/aws_screenshots/Lambda/01_createDeploy_fetch_function.PNG "Create/deploy function")

*Create and deploy Lambda function explanation:*

`aws lambda create-function` *Initiate creation of FetchPhotos Lambda function*

`--runtime nodejs.18.x` *Configure function to run Node.js 18.x*

`--zip-file fileb://fetchPhotos.zip` *Function code packaged in a ZIP file*

`--role arn:aws:iam:: ...` *Define AWS Lambda function permissions through IAM role 'lambda-s3-dynamodb-role'*

`--handler fetchPhotos.handler` *Define Lambda entry point as handler function in the fetchPhotos.js file* (handler function executed when Lambda function is invoked (e.g. user makes request to view gallery))

***Steps 2 and 3*** - *Repeat Step 1 for `UploadPhoto` and `DeletePhoto` functions*

***Step 4*** - *Integrate `DeletePhoto` Lambda function with API Gateway resource DELETE method*

!["04_integrate_delete_function"](images/aws_screenshots/Lambda/04_integrate_delete_function.PNG "Integrate function with API")

*Integrate function with API explanation:*

`aws apigateway put-integration` *AWS CLI command for integrating an API Gateway resource* (i.e. /photos, with a backend service (e.g. a Lambda function))

`--resource-id` *API Gateway resource (i.e. /photos) ID where Lambda function will be triggered*

`--type AWS_PROXY` *API Gateway to use Lambda proxy integration* (where the entire HTTP request (including headers, path parameters, and query parameters) is passed directly to the Lambda function, and the function's output is returned to the client as an HTTP response)

`--integration-http-method POST` *Specify that API Gateway will send the request to Lambda as a POST request* (POST requests are how API Gateway invokes Lambda functions)

***Steps 5 and 6*** - *Repeat Step 4 for `UploadPhoto` (integrate with resouce POST method) and `FetchPhotos` (integrate with resource GET method) functions*

***

### Technologies Used

AWS Services:
- Amazon S3 (static hosting/storage)
- Amazon DynamoDB
- AWS IAM
- Amazon API Gateway
- AWS Lambda

Languages:
- HTML
- CSS
- JavaScript

Version control:
- Git
- Github

Diagrams:
- Diagrams.net

