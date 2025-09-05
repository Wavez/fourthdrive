// Constants
const KEYBOARD_ACTIVATION_KEYS = ['Enter', ' '];

// Helper functions
function updateToggleState(toggle, primaryOption, secondaryOption, shouldActivate, stateClass) {
    toggle.classList.toggle(stateClass, shouldActivate);
    primaryOption.classList.toggle('active', !shouldActivate);
    secondaryOption.classList.toggle('active', shouldActivate);
    toggle.setAttribute('aria-checked', shouldActivate.toString());
}

function updateContentVisibility(contentPairs, shouldActivate) {
    contentPairs.forEach(([primaryContent, secondaryContent]) => {
        const primaryElement = document.getElementById(primaryContent);
        const secondaryElement = document.getElementById(secondaryContent);
        
        if (primaryElement && secondaryElement) {
            primaryElement.style.display = shouldActivate ? 'none' : 'block';
            secondaryElement.style.display = shouldActivate ? 'block' : 'none';
        }
    });
}

// Create a toggle switch with state management and content switching
function createToggleSwitch(toggleId, stateClass, contentPairs = []) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) {
        console.warn(`Toggle element with ID '${toggleId}' not found`);
        return;
    }
    
    const toggleOptions = document.querySelectorAll(`#${toggleId} .toggle-option`);
    const target = stateClass === 'dark' ? document.body : toggle;
    
    const handleToggle = function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyActive = target.classList.contains(stateClass);
        const [primaryOption, secondaryOption] = toggleOptions;
        
        // Determine new state
        const shouldActivate = !isCurrentlyActive;
        
        // Update target classes
        if (shouldActivate) {
            target.classList.add(stateClass);
            if (stateClass === 'dark') target.classList.remove('light');
        } else {
            target.classList.remove(stateClass);
            if (stateClass === 'dark') target.classList.add('light');
        }
        
        // Update toggle state and content visibility
        updateToggleState(toggle, primaryOption, secondaryOption, shouldActivate, stateClass);
        updateContentVisibility(contentPairs, shouldActivate);
        
        // Update body class for print styles
        if (stateClass === 'hebrew') {
            document.body.classList.toggle('hebrew-active', shouldActivate);
        }
    };

    // Event listeners
    toggle.addEventListener('click', handleToggle);
    toggle.addEventListener('keydown', (e) => {
        if (KEYBOARD_ACTIVATION_KEYS.includes(e.key)) {
            e.preventDefault();
            handleToggle(e);
        }
    });
    
    // Focus management for accessibility
    toggle.addEventListener('focus', () => toggle.setAttribute('aria-describedby', `${toggleId}-description`));
    toggle.addEventListener('blur', () => toggle.removeAttribute('aria-describedby'));
}

// Initialize toggles when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Cache theme elements
    const themeElements = {
        toggle: document.getElementById('theme-toggle'),
        options: document.querySelectorAll('#theme-toggle .toggle-option')
    };
    
    // Set initial theme based on system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [lightModeOption, darkModeOption] = themeElements.options;
    
    // Apply initial theme state
    document.body.classList.add(systemPrefersDark ? 'dark' : 'light');
    themeElements.toggle.classList.toggle('dark', systemPrefersDark);
    lightModeOption.classList.toggle('active', !systemPrefersDark);
    darkModeOption.classList.toggle('active', systemPrefersDark);
    themeElements.toggle.setAttribute('aria-checked', systemPrefersDark.toString());

    // Initialize toggle switches
    createToggleSwitch('language-toggle', 'hebrew', [
        ['english-content', 'hebrew-content'],
        ['closing-en', 'closing-he']
    ]);
    createToggleSwitch('theme-toggle', 'dark');
    
    // Print button and focus management
    const printButton = document.querySelector('.print-button');
    const focusableElements = document.querySelectorAll('.toggle-switch, .print-button');
    
    // Print button keyboard support
    printButton?.addEventListener('keydown', (e) => {
        if (KEYBOARD_ACTIVATION_KEYS.includes(e.key)) {
            e.preventDefault();
            window.print();
        }
    });
    
    // Set proper tab order
    focusableElements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1);
    });
});
