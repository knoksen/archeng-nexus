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
            const iconClass = theme === 'dark'
                ? 'fas fa-sun text-yellow-400'
                : 'fas fa-moon text-gray-700';
            [themeToggle, mobileThemeToggle].forEach(btn => {
                if (!btn) return;
                btn.textContent = '';
                const span = document.createElement('span');
                span.setAttribute('aria-hidden', 'true');
                span.className = iconClass;
                btn.appendChild(span);
            });
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
                mobileMenuButton.textContent = '';
                const iconSpan = document.createElement('span');
                iconSpan.setAttribute('aria-hidden', 'true');
                iconSpan.className = !isExpanded
                    ? 'fas fa-times text-gray-700 dark:text-gray-200'
                    : 'fas fa-bars text-gray-700 dark:text-gray-200';
                mobileMenuButton.appendChild(iconSpan);
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
                        alert('Failed to send message.');
                    }
                } catch (err) {
                    console.error('Error submitting contact form', err);
                    alert('Failed to send message.');
                }
            });
        }

        // Insert site content into the DOM using safe APIs
        function insertSiteInfo(data) {
            document.getElementById('page-title').textContent = data.title;
            const metaDesc = document.getElementById('meta-description');
            if (metaDesc) metaDesc.setAttribute('content', data.description);

            const featuresList = document.getElementById('features-list');
            if (featuresList && Array.isArray(data.features)) {
                featuresList.textContent = '';
                data.features.forEach(f => {
                    const item = document.createElement('div');
                    item.className = 'bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover';

                    const iconWrap = document.createElement('div');
                    iconWrap.className = `w-12 h-12 rounded-full ${f.iconBg} flex items-center justify-center mb-4`;
                    const icon = document.createElement('i');
                    icon.className = `${f.icon} ${f.iconColor} text-xl`;
                    iconWrap.appendChild(icon);

                    const title = document.createElement('h3');
                    title.className = 'text-xl font-semibold text-gray-900 dark:text-white mb-2';
                    title.textContent = f.title;

                    const desc = document.createElement('p');
                    desc.className = 'text-gray-600 dark:text-gray-300';
                    desc.textContent = f.description;

                    item.append(iconWrap, title, desc);
                    featuresList.appendChild(item);
                });
            }

            const materialsList = document.getElementById('materials-list');
            if (materialsList && Array.isArray(data.materials)) {
                materialsList.textContent = '';
                data.materials.forEach(m => {
                    const item = document.createElement('div');
                    item.className = 'bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition card-hover';

                    const top = document.createElement('div');
                    top.className = `h-40 bg-gradient-to-r ${m.gradient} flex items-center justify-center`;
                    const topIcon = document.createElement('i');
                    topIcon.className = `${m.icon} text-white text-5xl opacity-90`;
                    top.appendChild(topIcon);

                    const body = document.createElement('div');
                    body.className = 'p-4';
                    const title = document.createElement('h3');
                    title.className = 'font-semibold text-gray-900 dark:text-white';
                    title.textContent = m.title;
                    const desc = document.createElement('p');
                    desc.className = 'text-sm text-gray-600 dark:text-gray-300 mt-1';
                    desc.textContent = m.description;
                    const info = document.createElement('div');
                    info.className = 'mt-3 flex items-center';
                    const tag = document.createElement('span');
                    tag.className = `text-xs px-2 py-1 ${m.tagColor} rounded-full`;
                    tag.textContent = m.tag;
                    const more = document.createElement('span');
                    more.className = 'ml-auto text-sm text-indigo-600 dark:text-indigo-400';
                    more.textContent = 'Learn more →';
                    info.append(tag, more);

                    body.append(title, desc, info);
                    item.append(top, body);
                    materialsList.appendChild(item);
                });
            }

            const toolsList = document.getElementById('tools-list');
            if (toolsList && Array.isArray(data.tools)) {
                toolsList.textContent = '';
                data.tools.forEach(t => {
                    const item = document.createElement('div');
                    item.className = 'flex items-start mb-6';

                    const left = document.createElement('div');
                    left.className = 'flex-shrink-0';
                    const wrap = document.createElement('div');
                    wrap.className = `flex items-center justify-center h-12 w-12 rounded-md ${t.bgColor} text-white`;
                    const icon = document.createElement('i');
                    icon.className = `${t.icon} text-xl`;
                    wrap.appendChild(icon);
                    left.appendChild(wrap);

                    const right = document.createElement('div');
                    right.className = 'ml-4';
                    const title = document.createElement('h3');
                    title.className = 'text-lg font-medium text-gray-900 dark:text-white';
                    title.textContent = t.title;
                    const desc = document.createElement('p');
                    desc.className = 'mt-1 text-gray-600 dark:text-gray-300';
                    desc.textContent = t.description;
                    right.append(title, desc);

                    item.append(left, right);
                    toolsList.appendChild(item);
                });
            }

            const solutionsList = document.getElementById('solutions-list');
            if (solutionsList && Array.isArray(data.solutions)) {
                solutionsList.textContent = '';
                data.solutions.forEach(s => {
                    const item = document.createElement('div');
                    item.className = 'bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover';

                    const header = document.createElement('div');
                    header.className = 'flex items-center mb-4';
                    const iconWrap = document.createElement('div');
                    iconWrap.className = `flex-shrink-0 h-10 w-10 rounded-full ${s.iconBg} flex items-center justify-center`;
                    const icon = document.createElement('i');
                    icon.className = `${s.icon} ${s.iconColor}`;
                    iconWrap.appendChild(icon);
                    const title = document.createElement('h3');
                    title.className = 'ml-3 text-lg font-medium text-gray-900 dark:text-white';
                    title.textContent = s.title;
                    header.append(iconWrap, title);

                    const desc = document.createElement('p');
                    desc.className = 'text-gray-600 dark:text-gray-300 mb-4';
                    desc.textContent = s.description;

                    const list = document.createElement('ul');
                    list.className = 'space-y-2';
                    s.bullets.forEach(b => {
                        const li = document.createElement('li');
                        li.className = 'flex items-start';
                        const check = document.createElement('div');
                        check.className = 'flex-shrink-0 h-5 w-5 text-green-500';
                        const i = document.createElement('i');
                        i.className = 'fas fa-check';
                        check.appendChild(i);
                        const text = document.createElement('p');
                        text.className = 'ml-2 text-sm text-gray-600 dark:text-gray-300';
                        text.textContent = b;
                        li.append(check, text);
                        list.appendChild(li);
                    });

                    item.append(header, desc, list);
                    solutionsList.appendChild(item);
                });
            }
        }

        // Load site content from JSON
        if (typeof window !== 'undefined') {
            fetch('data/site-info.json')
                .then(res => res.json())
                .then(insertSiteInfo)
                .catch(err => {
                console.error('Failed to load site-info.json', err);
                const msg = document.createElement('p');
                msg.className = 'text-center text-red-600 mt-4';
                msg.textContent = 'Failed to load dynamic content. Showing default information.';
                const main = document.querySelector('main');
                if (main) main.prepend(msg);
                // Optional alert for a more visible notification
                alert('Unable to load site data. Some information may be missing.');
                });
        }

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = { insertSiteInfo };
        }
