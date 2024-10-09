// Define S3 bucket
const bucketName = 'photo-gallery-images-alexjp87';

// 
// 
// 

// UPLOAD (POST method) FUNCTION - asynchronously uploads photo and associated metadata to storage:
async function uploadPhoto() {
    // Select file input element using Id
    const fileInput = document.getElementById('fileInput');
    // store selected file in variable
    const file = fileInput.files[0];

    // check if a file has been selected
    if (file) {
        // if so, send POST request to API Gateway resource containing relevant method (`/photos` - which forwards request to Lambda, triggering relevant function, i.e. `UploadPhoto`)
        const response = await fetch(`https://7wbwmw8pzj.execute-api.us-west-2.amazonaws.com/prod/photos`, {
            method: 'POST',
            // photo file sent as the body of the request (in binary data form)
            body: file,
        });
        // If API Gateway responds with a successful status code:
        if (response.ok) {
            // alert user to confirm successful upload
            alert('Photo uploaded successfully!');
            // refresh gallery to include uploaded photo
            fetchGallery();
        } else {
            // alert user that upload failed
            alert('Failed to upload photo.');
        }
    }
}

// 
// 
// 

// FETCH (GET method) FUNCTION - asynchronously retrieves all photos and displays in front-end
async function fetchGallery() {
    // Send GET request to relevant API resource containing relevant method (`/photos` - which forwards request to Lambda, triggering relevant function, i.e. `FetchPhotos`)
    const response = await fetch(`https://7wbwmw8pzj.execute-api.us-west-2.amazonaws.com/prod/photos`);
    // API json response stored as variable object
    const photos = await response.json();
    // select gallery element using Id
    const gallery = document.getElementById('gallery');
    // clear contents of gallery container so can be refreshed with up to date photos after fetch
    gallery.innerHTML = '';

    // Loop through `photos` object, and for each photo:
    photos.forEach(photo => {
        // create container element
        const div = document.createElement('div');
        // add class (for styling)
        div.className = 'photo';
        // create image tag inside container element, set source as photo S3 URL (location in S3 storage), add alt text, and add a delete button wich calls deletePhoto() function on click (function on LINE 68) 
        div.innerHTML = `<img src="${photo.url}" alt="${photo.photoId}"><button onclick="deletePhoto('${photo.photoId}')">Delete</button>`;
        // append photo container to gallery 
        gallery.appendChild(div);
    });
}

// 
// 
// 

// DELETE (DELETE method) FUNCTION - asynchronously deletes photo from gallery and storage, and associated metadata from storage
async function deletePhoto(photoId) {
    // Send DELETE request to API resource containing relevant method (/photos - which forwards request to Lambda, triggering relevant function, i.e. `DeletePhoto`) (`photoId` (primary key) dynamically appended to URL to specify photo for deletion)
    await fetch(`https://7wbwmw8pzj.execute-api.us-west-2.amazonaws.com/prod/photos/${photoId}`, {
        method: 'DELETE',
    });
    // refresh gallery to reflect deletion
    fetchGallery();
}

// 
// 
// 

// Refresh gallery (call fetchPhotos()) each time page is loaded (i.e. display up-to-date gallery)
window.onload = fetchGallery;
