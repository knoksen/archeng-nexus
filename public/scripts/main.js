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

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        const contactSuccess = document.getElementById('contact-success');
        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const data = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                };
                try {
                    const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (res.ok) {
                        if (contactSuccess) contactSuccess.classList.remove('hidden');
                        contactForm.reset();
                    } else {
                        const errorData = await res.json().catch(() => ({}));
                        console.error('Contact form submission failed:', errorData);
                        alert('Failed to send message. Please check your input and try again.');
                    }
                } catch (err) {
                    console.error('Error submitting contact form', err);
                    alert('Failed to send message. Please check your connection and try again.');
                }
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
                    materialsList.innerHTML = '';
                    data.materials.forEach(m => {
                        const item = document.createElement('div');
                        item.className = 'bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition card-hover';
                        item.innerHTML = `
                            <div class="h-40 bg-gradient-to-r ${m.gradient} flex items-center justify-center">
                                <i class="${m.icon} text-white text-5xl opacity-90"></i>
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 dark:text-white">${m.title}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${m.description}</p>
                                <div class="mt-3 flex items-center">
                                    <span class="text-xs px-2 py-1 ${m.tagColor} rounded-full">${m.tag}</span>
                                    <span class="ml-auto text-sm text-indigo-600 dark:text-indigo-400">Learn more →</span>
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
