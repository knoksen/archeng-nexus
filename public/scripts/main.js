        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        const html = document.documentElement;
        
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the saved theme
        if (savedTheme === 'dark') {
            html.classList.add('dark');
            updateThemeIcons('dark');
        } else {
            html.classList.remove('dark');
            updateThemeIcons('light');
        }
        
        // Toggle theme function
        function toggleTheme() {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                updateThemeIcons('light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcons('dark');
            }
        }
        
        // Update theme toggle icons
        function updateThemeIcons(theme) {
            if (theme === 'dark') {
                if (themeToggle) themeToggle.innerHTML = '<span aria-hidden="true" class="fas fa-sun text-yellow-400"></span>';
                if (mobileThemeToggle) mobileThemeToggle.innerHTML = '<span aria-hidden="true" class="fas fa-sun text-yellow-400"></span>';
            } else {
                if (themeToggle) themeToggle.innerHTML = '<span aria-hidden="true" class="fas fa-moon text-gray-700"></span>';
                if (mobileThemeToggle) mobileThemeToggle.innerHTML = '<span aria-hidden="true" class="fas fa-moon text-gray-700"></span>';
            }
        }
        
        // Add event listeners
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
        
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('open');
                
                // Update icon
                if (!isExpanded) {
                    mobileMenuButton.innerHTML = '<span aria-hidden="true" class="fas fa-times text-gray-700 dark:text-gray-200"></span>';
                } else {
                    mobileMenuButton.innerHTML = '<span aria-hidden="true" class="fas fa-bars text-gray-700 dark:text-gray-200"></span>';
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenuButton.click();
                }
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced contact form functionality
        const contactForm = document.getElementById('contact-form');
        const contactSuccess = document.getElementById('contact-success');
        const contactError = document.getElementById('contact-error');
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        // Form validation functions
        function validateName(name) {
            if (!name.trim()) return 'Name is required';
            if (name.trim().length < 2) return 'Name must be at least 2 characters';
            if (name.trim().length > 100) return 'Name must be less than 100 characters';
            return '';
        }
        
        function validateEmail(email) {
            if (!email.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return 'Please enter a valid email address';
            return '';
        }
        
        function validateMessage(message) {
            if (!message.trim()) return 'Message is required';
            if (message.trim().length < 10) return 'Message must be at least 10 characters';
            if (message.trim().length > 1000) return 'Message must be less than 1000 characters';
            return '';
        }
        
        function showFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            if (field && errorElement) {
                field.classList.add('border-red-500', 'focus:ring-red-500');
                field.classList.remove('border-gray-300', 'focus:ring-indigo-500');
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
            }
        }
        
        function clearFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            if (field && errorElement) {
                field.classList.remove('border-red-500', 'focus:ring-red-500');
                field.classList.add('border-gray-300', 'focus:ring-indigo-500');
                errorElement.classList.add('hidden');
            }
        }
        
        function setFormLoading(loading) {
            if (submitBtn && submitText && loadingSpinner) {
                submitBtn.disabled = loading;
                if (loading) {
                    submitText.textContent = 'Sending...';
                    loadingSpinner.classList.remove('hidden');
                } else {
                    submitText.textContent = 'Send Message';
                    loadingSpinner.classList.add('hidden');
                }
            }
        }
        
        // Real-time validation
        if (contactForm) {
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            const messageCount = document.getElementById('message-count');
            
            // Name validation
            if (nameField) {
                nameField.addEventListener('blur', function() {
                    const error = validateName(this.value);
                    if (error) {
                        showFieldError('name', error);
                    } else {
                        clearFieldError('name');
                    }
                });
                nameField.addEventListener('input', function() {
                    if (this.value.trim().length >= 2) {
                        clearFieldError('name');
                    }
                });
            }
            
            // Email validation
            if (emailField) {
                emailField.addEventListener('blur', function() {
                    const error = validateEmail(this.value);
                    if (error) {
                        showFieldError('email', error);
                    } else {
                        clearFieldError('email');
                    }
                });
                emailField.addEventListener('input', function() {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.value)) {
                        clearFieldError('email');
                    }
                });
            }
            
            // Message validation and character count
            if (messageField && messageCount) {
                messageField.addEventListener('input', function() {
                    const length = this.value.length;
                    messageCount.textContent = length;
                    
                    // Update color based on length
                    if (length > 900) {
                        messageCount.parentElement.className = 'mt-1 text-sm text-red-500 dark:text-red-400';
                    } else if (length > 800) {
                        messageCount.parentElement.className = 'mt-1 text-sm text-yellow-500 dark:text-yellow-400';
                    } else {
                        messageCount.parentElement.className = 'mt-1 text-sm text-gray-500 dark:text-gray-400';
                    }
                    
                    if (length >= 10) {
                        clearFieldError('message');
                    }
                });
                
                messageField.addEventListener('blur', function() {
                    const error = validateMessage(this.value);
                    if (error) {
                        showFieldError('message', error);
                    } else {
                        clearFieldError('message');
                    }
                });
            }
            
            // Form submission
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                
                // Hide previous messages
                if (contactSuccess) contactSuccess.classList.add('hidden');
                if (contactError) contactError.classList.add('hidden');
                
                // Get form data
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    subject: formData.get('subject') || ''
                };
                
                // Validate all fields
                let hasErrors = false;
                
                const nameError = validateName(data.name);
                if (nameError) {
                    showFieldError('name', nameError);
                    hasErrors = true;
                }
                
                const emailError = validateEmail(data.email);
                if (emailError) {
                    showFieldError('email', emailError);
                    hasErrors = true;
                }
                
                const messageError = validateMessage(data.message);
                if (messageError) {
                    showFieldError('message', messageError);
                    hasErrors = true;
                }
                
                // Check consent
                const consent = document.getElementById('consent');
                if (consent && !consent.checked) {
                    alert('Please agree to the Privacy Policy and Terms of Service to continue.');
                    hasErrors = true;
                }
                
                if (hasErrors) {
                    return;
                }
                
                // Set loading state
                setFormLoading(true);
                
                try {
                    const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    if (res.ok) {
                        // Success
                        if (contactSuccess) {
                            contactSuccess.classList.remove('hidden');
                            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        contactForm.reset();
                        if (messageCount) messageCount.textContent = '0';
                        
                        // Reset form styling
                        ['name', 'email', 'message'].forEach(fieldId => {
                            clearFieldError(fieldId);
                        });
                        
                        // Hide success message after 10 seconds
                        setTimeout(() => {
                            if (contactSuccess) contactSuccess.classList.add('hidden');
                        }, 10000);
                        
                    } else {
                        // Server error
                        const errorData = await res.json().catch(() => ({}));
                        console.error('Contact form submission failed:', errorData);
                        
                        if (contactError) {
                            contactError.classList.remove('hidden');
                            contactError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                } catch (err) {
                    // Network error
                    console.error('Error submitting contact form', err);
                    if (contactError) {
                        contactError.classList.remove('hidden');
                        contactError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } finally {
                    setFormLoading(false);
                }
            });
        }

        // Add feature demo interactivity and animated counters
        
        // Animated counters
        function animateCounter(elementId, targetValue, suffix = '', duration = 2000) {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const startValue = 0;
            const increment = targetValue / (duration / 16); // 60fps
            let currentValue = startValue;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            }, 16);
        }
        
        // Intersection Observer for triggering animations
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate counters when features section comes into view
                    if (entry.target.id === 'features') {
                        animateCounter('projects-count', 12457);
                        animateCounter('users-count', 8932);
                        animateCounter('materials-count', 2847);
                        animateCounter('efficiency-count', 85, '%');
                    }
                }
            });
        }, observerOptions);
        
        // Observe the features section
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            observer.observe(featuresSection);
        }
        
        // Interactive demo tabs
        const demoTabs = document.querySelectorAll('.demo-tab');
        const demoContents = document.querySelectorAll('.demo-content');
        
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                demoTabs.forEach(t => {
                    t.classList.remove('active', 'bg-white/20', 'text-white');
                    t.classList.add('bg-white/10', 'text-white/70');
                });
                
                // Add active class to clicked tab
                tab.classList.add('active', 'bg-white/20', 'text-white');
                tab.classList.remove('bg-white/10', 'text-white/70');
                
                // Hide all demo contents
                demoContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                // Show selected demo content
                const targetDemo = tab.getAttribute('data-demo');
                const targetContent = document.getElementById(`demo-${targetDemo}`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
        
        // Enhanced card hover effects
        function addCardHoverEffects() {
            const cards = document.querySelectorAll('.card-hover');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
        
        // Call after DOM content is loaded
        document.addEventListener('DOMContentLoaded', function() {
            addCardHoverEffects();
        });
        
        // Material filtering functionality
        const materialFilters = document.querySelectorAll('.material-filter');
        let allMaterials = [];
        
        materialFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                materialFilters.forEach(f => {
                    f.classList.remove('active', 'bg-indigo-600', 'text-white');
                    f.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                });
                
                filter.classList.add('active', 'bg-indigo-600', 'text-white');
                filter.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                
                // Filter materials
                const filterType = filter.getAttribute('data-filter');
                filterMaterials(filterType);
            });
        });
        
        function filterMaterials(filterType) {
            const materialsList = document.getElementById('materials-list');
            if (!materialsList || !allMaterials.length) return;
            
            // Clear current materials
            materialsList.innerHTML = '';
            
            // Filter materials based on type
            let filteredMaterials = allMaterials;
            if (filterType !== 'all') {
                filteredMaterials = allMaterials.filter(material => {
                    const tag = material.tag.toLowerCase();
                    switch(filterType) {
                        case 'sustainable':
                            return tag === 'sustainable' || tag === 'eco';
                        case 'energy':
                            return tag === 'energy+';
                        case 'innovative':
                            return tag === 'innovative';
                        default:
                            return true;
                    }
                });
            }
            
            // Render filtered materials with animation
            filteredMaterials.forEach((material, index) => {
                setTimeout(() => {
                    const item = document.createElement('div');
                    item.className = 'bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition card-hover opacity-0 transform translate-y-4';
                    item.innerHTML = `
                        <div class="h-40 bg-gradient-to-r ${material.gradient} flex items-center justify-center relative overflow-hidden">
                            <i class="${material.icon} text-white text-5xl opacity-90 z-10"></i>
                            <div class="absolute inset-0 bg-black/10"></div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 dark:text-white">${material.title}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${material.description}</p>
                            <div class="mt-3 flex items-center justify-between">
                                <span class="text-xs px-2 py-1 ${material.tagColor} rounded-full">${material.tag}</span>
                                <button class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition flex items-center">
                                    Learn more <i class="fas fa-arrow-right ml-1 text-xs"></i>
                                </button>
                            </div>
                        </div>`;
                    
                    materialsList.appendChild(item);
                    
                    // Trigger animation
                    setTimeout(() => {
                        item.classList.remove('opacity-0', 'translate-y-4');
                        item.classList.add('opacity-100', 'translate-y-0');
                    }, 50);
                }, index * 100);
            });
        }
        
        // Load site content from JSON
        fetch('data/site-info.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                // Page title and description
                document.getElementById('page-title').textContent = data.title;
                const metaDesc = document.getElementById('meta-description');
                if (metaDesc) metaDesc.setAttribute('content', data.description);

                // Features
                const featuresList = document.getElementById('features-list');
                if (featuresList && Array.isArray(data.features)) {
                    featuresList.innerHTML = '';
                    data.features.forEach(f => {
                        const item = document.createElement('div');
                        item.className = 'bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover';
                        item.innerHTML = `
                            <div class="w-12 h-12 rounded-full ${f.iconBg} flex items-center justify-center mb-4">
                                <i class="${f.icon} ${f.iconColor} text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${f.title}</h3>
                            <p class="text-gray-600 dark:text-gray-300">${f.description}</p>`;
                        featuresList.appendChild(item);
                    });
                }

                // Materials
                const materialsList = document.getElementById('materials-list');
                if (materialsList && Array.isArray(data.materials)) {
                    allMaterials = data.materials; // Store for filtering
                    materialsList.innerHTML = '';
                    data.materials.forEach(m => {
                        const item = document.createElement('div');
                        item.className = 'bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition card-hover';
                        item.innerHTML = `
                            <div class="h-40 bg-gradient-to-r ${m.gradient} flex items-center justify-center relative overflow-hidden">
                                <i class="${m.icon} text-white text-5xl opacity-90 z-10"></i>
                                <div class="absolute inset-0 bg-black/10"></div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 dark:text-white">${m.title}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${m.description}</p>
                                <div class="mt-3 flex items-center justify-between">
                                    <span class="text-xs px-2 py-1 ${m.tagColor} rounded-full">${m.tag}</span>
                                    <button class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition flex items-center">
                                        Learn more <i class="fas fa-arrow-right ml-1 text-xs"></i>
                                    </button>
                                </div>
                            </div>`;
                        materialsList.appendChild(item);
                    });
                }

                // Tools
                const toolsList = document.getElementById('tools-list');
                if (toolsList && Array.isArray(data.tools)) {
                    toolsList.innerHTML = '';
                    data.tools.forEach(t => {
                        const item = document.createElement('div');
                        item.className = 'flex items-start mb-6';
                        item.innerHTML = `
                            <div class="flex-shrink-0">
                                <div class="flex items-center justify-center h-12 w-12 rounded-md ${t.bgColor} text-white">
                                    <i class="${t.icon} text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white">${t.title}</h3>
                                <p class="mt-1 text-gray-600 dark:text-gray-300">${t.description}</p>
                            </div>`;
                        toolsList.appendChild(item);
                    });
                }

                // Solutions
                const solutionsList = document.getElementById('solutions-list');
                if (solutionsList && Array.isArray(data.solutions)) {
                    solutionsList.innerHTML = '';
                    data.solutions.forEach(s => {
                        const item = document.createElement('div');
                        const bullets = s.bullets.map(b => `
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-5 w-5 text-green-500"><i class="fas fa-check"></i></div>
                                <p class="ml-2 text-sm text-gray-600 dark:text-gray-300">${b}</p>
                            </li>`).join('');
                        item.className = 'bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover';
                        item.innerHTML = `
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full ${s.iconBg} flex items-center justify-center">
                                    <i class="${s.icon} ${s.iconColor}"></i>
                                </div>
                                <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">${s.title}</h3>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">${s.description}</p>
                            <ul class="space-y-2">${bullets}</ul>`;
                        solutionsList.appendChild(item);
                    });
                }
            })
            .catch(err => {
                console.error('Failed to load site-info.json', err);
                const msg = document.createElement('div');
                msg.className = 'text-center bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4 mx-4';
                msg.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Some content could not be loaded. Please refresh the page.';
                const main = document.querySelector('main');
                if (main) main.prepend(msg);
            });
