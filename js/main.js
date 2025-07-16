document.addEventListener('DOMContentLoaded', function() {
    // Load menu items from server
    loadMenuItems();
    
    // Initialize map
    initMap();
    
    // Handle contact form submission
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
});

function loadMenuItems() {
    fetch('http://localhost:3000/api/menu')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.querySelector('#menu .row');
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
                position: {lat: userLocation.lat + 0.005, lng: userLocation.lng + 0.005},
                map: map,
                title: 'CraveCrew Kitchen',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });
        }, () => {
            // Default to Mumbai if geolocation fails
            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 19.0760, lng: 72.8777},
                zoom: 12
            });
        });
    } else {
        // Browser doesn't support Geolocation
        const map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.0760, lng: 72.8777},
            zoom: 12
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        query: document.getElementById('query').value
    };
    
    fetch('http://https://cravecrew.netlify.app//api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Thank you for your query! We will get back to you soon.');
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your query. Please try again.');
    });
}


document.getElementById('emailForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = form.querySelector('.submit-btn');

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Disable submit button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Using EmailJS to send the email
    // You'll need to sign up at https://www.emailjs.com/ and configure it
    // Here's a basic implementation:

    // First, load EmailJS library (add this to your head section in production)
    // <script src="https://cdn.jsdelivr.net/npm/emailjs-com@2.6.4/dist/email.min.js"></script>

    // Initialize EmailJS with your user ID (replace with your actual user ID)
    emailjs.init('service_o47dpb5');

    // Send the email
    emailjs.send('sumitofficial6002@gmail.com', 'service_o47dpb5', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'emekart2006@gmail.com'
    })
        .then(function (response) {
            statusMessage.textContent = 'Message sent successfully!';
            statusMessage.className = 'status-message success';
            form.reset();
        }, function (error) {
            statusMessage.textContent = 'Failed to send message. Please try again later.';
            statusMessage.className = 'status-message error';
            console.error('Email sending failed:', error);
        })
        .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });

    // Note: For a production site, you would need to:
    // 1. Sign up at EmailJS (free tier available)
    // 2. Create a service (connect your email service)
    // 3. Create a template
    // 4. Replace the placeholders above with your actual IDs

    // Alternative: You could also use a server-side script (PHP, Node.js, etc.)
    // to handle the email sending if you have backend access.
});



