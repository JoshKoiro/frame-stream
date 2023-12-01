var IMAGE_CHANGE_DELAY = 1000

function updateCSSProps(data){
    document.documentElement.style.setProperty('--frame-color', 'rgba(' + data['frame-color']['red'] + ',' + data['frame-color']['green'] + ',' + data['frame-color']['blue'] + ',' + data['frame-color']['alpha'] + ')');
    document.documentElement.style.setProperty('--frame-border', data['frame-thickness'] + 'px');
}

function changeImage(url) {
    var imageFrame = document.getElementById("image-frame");
    imageFrame.classList.add("fadeIn"); // Apply the animation class
    imageFrame.style.backgroundImage = "url(" + url + ")";
    imageFrame.classList.remove("fadeOut");
    
    // Remove the animation class after a delay to allow the animation to complete
    setTimeout(function() {
      imageFrame.classList.add("fadeOut");
      imageFrame.classList.remove("fadeIn");
    }, IMAGE_CHANGE_DELAY - 2000); // Adjust the delay to match the animation duration
  }

function getNextImage() {
    // Declare and initialize currentImg variable inside the function
    var currentImg = 0;
    
    return function() {
        if (currentImg >= images.length -1) {
            currentImg = 0;
        } else {
            currentImg = currentImg + 1;
        }
        let imageurl = images[currentImg];
        changeImage(imageurl);
    };
}

function loopImages() {
    var getNextImageFunc = getNextImage(); // Get the inner function from the closure
    setInterval(getNextImageFunc, IMAGE_CHANGE_DELAY);
}

function fetchImages() {
    fetch("http://localhost:3000/config")
        .then(response => response.json())
        .then(data => {
            updateCSSProps(data)
            IMAGE_CHANGE_DELAY = data.delay * 1000;
            images = data.images;
            changeImage(data.images[0]);
            loopImages();
        })
        .catch(error => console.error(error));
}

fetchImages();