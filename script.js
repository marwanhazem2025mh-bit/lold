let embeddedDatabase = {
    "123456": {
		heartMessagePhotos: [
            "PASTE_YOUR_BASE64_IMAGE_1_HERE",
            "PASTE_YOUR_BASE64_IMAGE_2_HERE"
        ],
        youtubeVideo: "B6-nKgWhSjc",
        backgroundColor: "#FFC0CB",
        photos: [
            "PASTE_YOUR_BASE64_IMAGE_1_HERE",
            "PASTE_YOUR_BASE64_IMAGE_2_HERE", 
            "PASTE_YOUR_BASE64_IMAGE_3_HERE",
            "PASTE_YOUR_BASE64_IMAGE_4_HERE"
        ],
    },
};

let currentContent = null;
let currentPhotoIndex = 0;

function getDatabase() {
    return embeddedDatabase;
}

// Page navigation
function showPage(page) {
    document.querySelectorAll('.content-page, .main-page').forEach(el => {
        el.style.display = 'none';
    });

    switch(page) {
        case 'main':
            document.querySelector('.main-page').style.display = 'block';
            break;
        case 'text':
            document.getElementById('textPage').style.display = 'block';
            break;
        case 'video':
            document.getElementById('videoPage').style.display = 'block';
            break;
        case 'heartMessage':
            document.getElementById('heartMessagePage').style.display = 'block';
            // Load photos for heart message page
            loadHeartMessagePhotos();
            break;
        case 'photos':
            document.getElementById('photosPage').style.display = 'block';
            break;
    }
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const messageDiv = document.getElementById('message');
    const db = getDatabase();
    
    if (db[password]) {
        currentContent = db[password];
        currentPhotoIndex = 0;
        
        // Update video page
        document.getElementById('contentVideo').src = `https://www.youtube.com/embed/${currentContent.youtubeVideo}?autoplay=1&rel=0`;
        
        // Update photo slider
        updatePhotoSlider();
        
        // Change background color
        document.body.style.background = `linear-gradient(90deg, ${currentContent.backgroundColor} 0%, #FF2E51 100%)`;
        
        // Show envelope page directly
        showPage('text');
        messageDiv.innerHTML = '';
    } else {
        messageDiv.innerHTML = '<div class="message error">Invalid password! Please try again.</div>';
        document.getElementById('passwordInput').focus();
    }
}

function loadHeartMessagePhotos() {
    if (!currentContent) return;
    
    // Use heartMessagePhotos if available, otherwise fall back to regular photos
    const photosToUse = currentContent.heartMessagePhotos && currentContent.heartMessagePhotos.length > 0 ? 
    currentContent.heartMessagePhotos : 
    ((currentContent.uploadedPhotos && currentContent.uploadedPhotos.length > 0) ? currentContent.uploadedPhotos : currentContent.photos);
    
    const topPhoto = document.getElementById('topHeartPhoto');
    const bottomPhoto = document.getElementById('bottomHeartPhoto');
    
    // Set top photo (first available)
    if (photosToUse.length > 0 && photosToUse[0]) {
        topPhoto.src = photosToUse[0];
        topPhoto.style.display = 'block';
        topPhoto.onerror = function() {
            this.style.display = 'none';
        };
    } else {
        topPhoto.style.display = 'none';
    }
    
    // Set bottom photo (second available, or first if only one exists)
    if (photosToUse.length > 1 && photosToUse[1]) {
        bottomPhoto.src = photosToUse[1];
        bottomPhoto.style.display = 'block';
        bottomPhoto.onerror = function() {
            this.style.display = 'none';
        };
    } else if (photosToUse.length > 0 && photosToUse[0]) {
        bottomPhoto.src = photosToUse[0];
        bottomPhoto.style.display = 'block';
        bottomPhoto.onerror = function() {
            this.style.display = 'none';
        };
    } else {
        bottomPhoto.style.display = 'none';
    }
}

// Envelope functionality
function initializeEnvelope() {
    const envelopeContainer = document.getElementById('envelopeContainer');
    const envelope = document.getElementById('envelope');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const letterContainer = document.getElementById('letterContainer');
    const rosePetals = document.getElementById('rosePetals');
    
    let isOpen = false;
    
    // Create rose petals
    function createPetals() {
        for (let i = 0; i < 15; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.animationDelay = Math.random() * 10 + 's';
            petal.style.animationDuration = (Math.random() * 5 + 8) + 's';
            petal.style.opacity = Math.random() * 0.5 + 0.3;
            rosePetals.appendChild(petal);
        }
    }
    
    // Open envelope animation
    function openEnvelope() {
        if (isOpen) return;
        
        isOpen = true;
        
        // Add falling animation
        envelopeContainer.classList.add('falling');
        
        // After falling, open the envelope
        setTimeout(() => {
            envelope.classList.add('open-envelope');
            envelopeFlap.classList.add('open-flap');
            
            // Show letter after envelope opens
            setTimeout(() => {
                letterContainer.classList.add('show-letter');
            }, 1000);
        }, 2000);
    }
    
    // Event listener for envelope
    envelopeContainer.addEventListener('click', openEnvelope);
    
    // Create petals on load
    createPetals();
}

// Photo functions
// Photo functions
function updatePhotoSlider() {
    const photoSlider = document.getElementById('photoSlider');
    const photoCounter = document.getElementById('photoCounter');
    
    if (!photoSlider || !currentContent) return;
    
    photoSlider.innerHTML = '';
    
    // FIXED: Use photos instead of uploadedPhotos
    const photosToShow = currentContent.photos;
    
    if (photosToShow.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'photo-slide active';
        placeholder.innerHTML = '<div class="text-photo">No photos available</div>';
        photoSlider.appendChild(placeholder);
        photoCounter.textContent = '0/0';
        return;
    }
    
    photosToShow.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = `photo-slide ${index === 0 ? 'active' : ''}`;
        
        if (typeof photo === 'string') {
            if (photo.startsWith('data:') || photo.startsWith('http') || photo.includes('.jpg') || photo.includes('.png')) {
                // It's an actual image
                slide.innerHTML = `<img src="${photo}" alt="Photo ${index + 1}" 
                    onload="checkImageOrientation(this)" 
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                    style="max-width:100%; max-height:100%; width:auto; height:auto; object-fit:contain;">`;
                
                // Add fallback text
                const fallback = document.createElement('div');
                fallback.className = 'text-photo';
                fallback.textContent = `Photo ${index + 1}`;
                fallback.style.display = 'none';
                slide.appendChild(fallback);
            } else {
                // It's text (fallback)
                slide.innerHTML = `<div class="text-photo">${photo}</div>`;
            }
        }
        
        photoSlider.appendChild(slide);
    });
    
    photoCounter.textContent = `1/${photosToShow.length}`;
    currentPhotoIndex = 0;
}

// Optional: Function to detect image orientation
function checkImageOrientation(img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    if (height > width) {
        // Portrait image
        img.parentElement.classList.add('portrait');
    } else {
        // Landscape image
        img.parentElement.classList.add('landscape');
    }
}

function changePhoto(direction) {
    const slides = document.querySelectorAll('.photo-slide');
    const photoCounter = document.getElementById('photoCounter');
    
    if (slides.length === 0) return;
    
    slides[currentPhotoIndex].classList.remove('active');
    
    currentPhotoIndex += direction;
    
    if (currentPhotoIndex >= slides.length) {
        currentPhotoIndex = 0;
    } else if (currentPhotoIndex < 0) {
        currentPhotoIndex = slides.length - 1;
    }
    
    slides[currentPhotoIndex].classList.add('active');
    photoCounter.textContent = `${currentPhotoIndex + 1}/${slides.length}`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Main page events
    document.getElementById('accessBtn').addEventListener('click', checkPassword);
    
    // Navigation buttons
    document.getElementById('nextToVideoBtn').addEventListener('click', function() {
        showPage('video');
    });
    
    document.getElementById('nextToHeartMessageBtn').addEventListener('click', function() {
        showPage('heartMessage');
    }); // FIXED: Added missing closing
    
    document.getElementById('nextToPhotosBtn2').addEventListener('click', function() {
        showPage('photos');
    }); // FIXED: Added missing closing
    
    document.getElementById('backToMainBtn').addEventListener('click', function() {
        showPage('main');
        // Reset password field
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    });
    
    // Enter key support for password input
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Initialize envelope when text page is shown
    document.getElementById('textPage').addEventListener('DOMNodeInserted', initializeEnvelope);
    
    // Focus on password input
    document.getElementById('passwordInput').focus();
    
    // Initialize envelope
    initializeEnvelope();
});