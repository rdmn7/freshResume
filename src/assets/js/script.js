// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or use the system preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Toggle the theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply the new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save the preference
    localStorage.setItem('theme', newTheme);
}

// Generate and download PDF
async function generatePDF() {
    // Display loading state on the button
    const downloadBtn = document.getElementById('resume-download-btn');
    if (downloadBtn) {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading PDF...';
        downloadBtn.disabled = true;
    }
    
    try {
        // Determine which CV to download based on the hash
        const isEnglish = window.location.hash === '#getresume';
        const pdfFileName = isEnglish ? 'RESUME_EN.pdf' : 'RESUME_NL.pdf';
        
        // Fetch the PDF file
        const response = await fetch(`/${pdfFileName}`);
        
        if (!response.ok) {
            throw new Error('Failed to download the resume file');
        }
        
        // Get the file as a blob with proper MIME type
        const pdfBlob = await response.blob();
        const blobUrl = URL.createObjectURL(
            new Blob([pdfBlob], { type: 'application/pdf' })
        );
        
        // Create a link to download the file
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = pdfFileName;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        }, 100);
        
        // Reset button
        if (downloadBtn) {
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
                downloadBtn.disabled = false;
            }, 1000);
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        
        // Reset button on error
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Try Again';
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
                downloadBtn.disabled = false;
            }, 3000);
        }
    }
}

// Secret resume download functionality
function checkForSecretDownload() {
    // Check if the URL contains either of the secret parameters
    const hash = window.location.hash;
    if (hash === '#getresume' || hash === '#getresumenl') {
        // Check if button already exists
        if (document.getElementById('resume-download-btn')) {
            return;
        }
        
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'resume-download-btn';
        downloadBtn.className = 'resume-download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
        
        // Add click event to generate and download PDF
        downloadBtn.addEventListener('click', generatePDF);
        
        // Add to the page
        document.body.appendChild(downloadBtn);
        
        // Add animation to make it appear
        setTimeout(() => {
            downloadBtn.classList.add('show');
        }, 500);
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add click event to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Animate skill bars when they come into view
    animateSkillBars();
    
    // Check for secret download parameter
    checkForSecretDownload();
    
    // Also check when hash changes
    window.addEventListener('hashchange', checkForSecretDownload);
});

// Function to animate skill bars when they come into view
function animateSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Create observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each skill level
    skillLevels.forEach(skill => {
        observer.observe(skill);
    });
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add CSS for animations
document.head.insertAdjacentHTML('beforeend', `
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .cert-item {
        animation: fade-in-up 0.6s ease forwards;
        opacity: 0;
    }
    
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
`);

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contact-btn');
    const contactOverlay = document.getElementById('contact-overlay');
    const closeFormBtn = document.getElementById('close-form');
    const contactForm = document.getElementById('contact-form');
    const formContainer = document.querySelector('.contact-form-container');
    const successNotification = document.getElementById('success-notification');
    
    // File attachment functionality
    const fileInput = document.getElementById('attachment');
    const fileButton = document.getElementById('file-button');
    const fileName = document.getElementById('file-name');
    
    if (fileButton && fileInput && fileName) {
        // When the button is clicked, trigger the hidden file input
        fileButton.addEventListener('click', function() {
            fileInput.click();
        });
        
        // When a file is selected, show its name
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                // Show the file name
                const file = this.files[0];
                fileName.textContent = file.name;
                
                // Validate file type
                const validTypes = ['.pdf', '.xlsx', '.docx'];
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                if (!validTypes.includes(fileExtension)) {
                    // Show error for invalid file type
                    alert('Please select a valid file type (.pdf, .xlsx, or .docx)');
                    fileInput.value = ''; // Clear the input
                    fileName.textContent = 'No file chosen';
                }
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }

    // Function to optimize form display based on screen height
    function optimizeFormDisplay() {
        const viewportHeight = window.innerHeight;
        const formHeight = formContainer.offsetHeight;
        
        // If form is too tall for the viewport, adjust the max-height
        if (formHeight > viewportHeight * 0.85) {
            formContainer.style.maxHeight = `${viewportHeight * 0.85}px`;
            
            // On very small screens, reduce padding further
            if (viewportHeight < 600) {
                formContainer.style.padding = '1rem';
                
                // Hide the description on very small screens
                const formDescription = formContainer.querySelector('p');
                if (formDescription) {
                    formDescription.style.display = 'none';
                }
            }
        }
    }

    // Open contact form
    contactBtn.addEventListener('click', function() {
        contactOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Small delay to allow the form to render before optimizing
        setTimeout(optimizeFormDisplay, 10);
    });

    // Close contact form
    closeFormBtn.addEventListener('click', function() {
        contactOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    });

    // Close form when clicking outside
    contactOverlay.addEventListener('click', function(e) {
        if (e.target === contactOverlay) {
            contactOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Adjust form on window resize
    window.addEventListener('resize', function() {
        if (contactOverlay.classList.contains('active')) {
            optimizeFormDisplay();
        }
    });

    // Function to show success notification
    function showSuccessNotification() {
        if (successNotification) {
            successNotification.classList.add('show');
            
            // Hide the notification after 4 seconds
            setTimeout(function() {
                successNotification.classList.remove('show');
            }, 4000);
        }
    }

    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const existingError = group.querySelector('.error-message');
            if (existingError) existingError.remove();
        });
        
        // Validate form
        let isValid = true;
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'organization'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email format
        const emailInput = document.getElementById('email');
        if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get the phone number value
            const phoneInput = document.getElementById('phone');
            const phoneNumber = phoneInput.value.trim();
            
            // Create form data object with all inputs (without attachment data for now)
            const formData = {
                firstName: document.getElementById('name').value,
                lastName: document.getElementById('lastname').value,
                email: document.getElementById('email').value,
                phone: phoneNumber,
                organization: document.getElementById('organization').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Handle file attachments (if present)
            const fileInput = document.getElementById('attachment');
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                // Add file metadata
                formData.attachment = {
                    name: file.name,
                    type: file.type,
                    size: file.size
                };
                
                // Read the file as base64
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Get the base64 data (remove the data URL prefix)
                    const base64Data = event.target.result.split(',')[1];
                    formData.attachmentData = base64Data;
                    
                    // Send the form data with attachment
                    sendFormData(formData, submitBtn, originalBtnText);
                };
                reader.onerror = function() {
                    console.error("Error reading file");
                    showError(fileInput, "Error reading file");
                    
                    // Send the form data without attachment
                    sendFormData(formData, submitBtn, originalBtnText);
                };
                
                // Read the file as Data URL (base64)
                reader.readAsDataURL(file);
            } else {
                // No attachment, send the form data directly
                sendFormData(formData, submitBtn, originalBtnText);
            }
        }
    });
    
    // Function to send form data to the server
    function sendFormData(formData, submitBtn, originalBtnText) {
        console.log('Sending form data to Cloudflare Function', formData);
        
        fetch('/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response:', text);
                    try {
                        // Try to parse as JSON
                        const data = JSON.parse(text);
                        throw new Error(`Server error: ${data.error || response.status}`);
                    } catch (e) {
                        throw new Error(`Server error (${response.status}): ${text.substring(0, 100) || 'Unknown error'}`);
                    }
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submission response:', data);
            if (data.success) {
                // Show success notification
                showSuccessNotification();
                
                // Reset form
                contactForm.reset();
                
                // Reset file name display
                const fileName = document.getElementById('file-name');
                if (fileName) {
                    fileName.textContent = 'No file chosen';
                }
                
                // Close the form after a short delay
                setTimeout(function() {
                    contactOverlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }, 4000);
            } else {
                // Show error message 
                showError(document.getElementById('message'), data.error || 'Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            showError(document.getElementById('message'), error.message || 'Failed to send message. Please try again later or contact directly via email.');
        })
        .finally(() => {
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    }
    
    // Helper function to show error messages
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        formGroup.appendChild(errorElement);
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 