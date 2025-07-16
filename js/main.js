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

// Use environment variable for API base URL or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cravecrew.netlify.app/';

async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menu`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
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
    } catch (error) {
        console.error('Error loading menu:', error);
    }
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

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        query: document.getElementById('query').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            alert('Thank you for your query! We will get back to you soon.');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your query. Please try again later.');
    }
}
