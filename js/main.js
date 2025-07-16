document.addEventListener('DOMContentLoaded', function () {
    // Load menu items from server
    loadMenuItems();

    // Initialize map
    initMap();

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

function loadMenuItems() {
    fetch('/api/menu')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const menuContainer = document.querySelector('#menu .row');
            if (menuContainer) {
                menuContainer.innerHTML = '';
                data.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'col-md-4';
                    menuItem.innerHTML = `
                        <div class="card menu-card">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">${item.description}</p>
                                <p class="text-primary fw-bold">₹${item.price}</p>
                                <button class="btn btn-sm btn-primary">Add to Cart</button>
                            </div>
                        </div>
                    `;
                    menuContainer.appendChild(menuItem);
                });
            }
        })
        .catch(error => console.error('Error loading menu:', error));
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 15
            });

            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location'
            });

            // Add CraveCrew location marker
            new google.maps.Marker({
                position: { lat: userLocation.lat + 0.005, lng: userLocation.lng + 0.005 },
                map: map,
                title: 'CraveCrew Kitchen',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });
        }, () => {
            // Default to Mumbai if geolocation fails
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 19.0760, lng: 72.8777 },
                zoom: 12
            });
        });
    } else {
        // Browser doesn't support Geolocation
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 19.0760, lng: 72.8777 },
            zoom: 12
        });
    }
}
// Replace all localhost:3000 references with your actual backend URL
const API_BASE_URL = 'https://cravecrew.netlify.app/'; // Replace with your actual backend URL

function loadMenuItems() {
    fetch(`${API_BASE_URL}/api/menu`)
    // ... rest of the function remains the same
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        query: document.getElementById('query').value
    };

    fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    // ... rest of the function remains the same
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        query: document.getElementById('query').value
    };

    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Thank you for your query! We will get back to you soon.');
                document.getElementById('contactForm').reset();
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your query. Please try again later.');
        });
}
