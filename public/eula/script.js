// Reusable toggle function with debouncing and accessibility
function createToggle(toggleId, stateClass, contentPairs = []) {
    const toggle = document.getElementById(toggleId);
    const toggleOptions = document.querySelectorAll(`#${toggleId} .toggle-option`);
    
    // Debounce function to prevent rapid clicking
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

    // Toggle functionality
    const toggleFunction = debounce(function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Check if the toggle itself has the state class (for language) or body (for theme)
        const isActive = stateClass === 'dark' 
            ? document.body.classList.contains(stateClass)
            : toggle.classList.contains(stateClass);

        if (isActive) {
            // Switch to first option
            if (stateClass === 'dark') {
                document.body.classList.remove(stateClass);
                document.body.classList.add('light');
            } else {
                toggle.classList.remove(stateClass);
            }
            toggle.classList.remove(stateClass);
            toggleOptions[0].classList.add('active');
            toggleOptions[1].classList.remove('active');
            toggle.setAttribute('aria-checked', 'false');
            
            // Toggle content pairs
            contentPairs.forEach(pair => {
                document.getElementById(pair[0]).style.display = 'block';
                document.getElementById(pair[1]).style.display = 'none';
            });
        } else {
            // Switch to second option
            if (stateClass === 'dark') {
                document.body.classList.add(stateClass);
                document.body.classList.remove('light');
            } else {
                toggle.classList.add(stateClass);
            }
            toggle.classList.add(stateClass);
            toggleOptions[0].classList.remove('active');
            toggleOptions[1].classList.add('active');
            toggle.setAttribute('aria-checked', 'true');
            
            // Toggle content pairs
            contentPairs.forEach(pair => {
                document.getElementById(pair[0]).style.display = 'none';
                document.getElementById(pair[1]).style.display = 'block';
            });
        }
    }, 150);

    // Event listeners
    toggle.addEventListener('click', toggleFunction);
    
    // Keyboard accessibility
    toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFunction(e);
        }
    });
}

// Initialize toggles when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check system preference and set initial theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.querySelectorAll('#theme-toggle .toggle-option');
    
    // Set initial theme based on system preference
    if (prefersDark) {
        document.body.classList.add('dark');
        themeToggle.classList.add('dark');
        themeOptions[0].classList.remove('active');
        themeOptions[1].classList.add('active');
        themeToggle.setAttribute('aria-checked', 'true');
    } else {
        document.body.classList.add('light');
        themeOptions[0].classList.add('active');
        themeOptions[1].classList.remove('active');
        themeToggle.setAttribute('aria-checked', 'false');
    }

    createToggle('lang-toggle', 'hebrew', [
        ['english', 'hebrew'],
        ['closing-en', 'closing-he']
    ]);

    createToggle('theme-toggle', 'dark');
});
