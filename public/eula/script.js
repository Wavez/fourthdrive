// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Reusable toggle function with optimized logic
function createToggle(toggleId, stateClass, contentPairs = []) {
    const toggle = document.getElementById(toggleId);
    const toggleOptions = document.querySelectorAll(`#${toggleId} .toggle-option`);
    const target = stateClass === 'dark' ? document.body : toggle;
    
    const toggleFunction = debounce(function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isActive = target.classList.contains(stateClass);
        const [firstOption, secondOption] = toggleOptions;
        
        if (isActive) {
            // Switch to first option
            target.classList.remove(stateClass);
            if (stateClass === 'dark') target.classList.add('light');
            toggle.classList.remove(stateClass);
            firstOption.classList.add('active');
            secondOption.classList.remove('active');
            toggle.setAttribute('aria-checked', 'false');
            
            // Toggle content pairs
            contentPairs.forEach(([show, hide]) => {
                document.getElementById(show).style.display = 'block';
                document.getElementById(hide).style.display = 'none';
            });
            
            // Update body class for print styles
            if (stateClass === 'hebrew') {
                document.body.classList.remove('hebrew-active');
            }
        } else {
            // Switch to second option
            target.classList.add(stateClass);
            if (stateClass === 'dark') target.classList.remove('light');
            toggle.classList.add(stateClass);
            firstOption.classList.remove('active');
            secondOption.classList.add('active');
            toggle.setAttribute('aria-checked', 'true');
            
            // Toggle content pairs
            contentPairs.forEach(([hide, show]) => {
                document.getElementById(hide).style.display = 'none';
                document.getElementById(show).style.display = 'block';
            });
            
            // Update body class for print styles
            if (stateClass === 'hebrew') {
                document.body.classList.add('hebrew-active');
            }
        }
    }, 150);

    // Event listeners
    toggle.addEventListener('click', toggleFunction);
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFunction(e);
        }
    });
    
    // Focus management for accessibility
    toggle.addEventListener('focus', () => {
        toggle.setAttribute('aria-describedby', `${toggleId}-description`);
    });
    
    toggle.addEventListener('blur', () => {
        toggle.removeAttribute('aria-describedby');
    });
}

// Initialize toggles when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Cache elements
    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        themeOptions: document.querySelectorAll('#theme-toggle .toggle-option')
    };
    
    // Set initial theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [lightOption, darkOption] = elements.themeOptions;
    
    if (prefersDark) {
        document.body.classList.add('dark');
        elements.themeToggle.classList.add('dark');
        lightOption.classList.remove('active');
        darkOption.classList.add('active');
        elements.themeToggle.setAttribute('aria-checked', 'true');
    } else {
        document.body.classList.add('light');
        lightOption.classList.add('active');
        darkOption.classList.remove('active');
        elements.themeToggle.setAttribute('aria-checked', 'false');
    }

    // Initialize toggles
    createToggle('lang-toggle', 'hebrew', [
        ['english', 'hebrew'],
        ['closing-en', 'closing-he']
    ]);
    createToggle('theme-toggle', 'dark');
    
    // Focus management for print button
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.print();
            }
        });
    }
    
    // Global focus management - ensure proper tab order
    const focusableElements = document.querySelectorAll(
        '.toggle-switch, .print-button'
    );
    
    // Add tabindex management for better keyboard navigation
    focusableElements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1);
    });
});
