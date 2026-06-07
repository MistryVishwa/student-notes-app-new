/**
 * Global Security Utility
 * Provides cross-site scripting (XSS) input sanitization for student projects.
 */
(function() {
    const Security = {
        /**
         * Escape HTML characters to prevent XSS.
         * @param {string} str - Raw input string.
         * @returns {string} Sanitized safe string.
         */
        escapeHTML: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/[&<>"']/g, function(match) {
                switch (match) {
                    case '&': return '&amp;';
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '"': return '&quot;';
                    case "'": return '&#x27;';
                    default: return match;
                }
            });
        },

        /**
         * Strip HTML tags from a string.
         * @param {string} str - Raw input string.
         * @returns {string} Plain text without HTML tags.
         */
        stripTags: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/<\/?[^>]+(>|$)/g, "");
        },

        /**
         * Sanitize form input fields automatically.
         * @param {HTMLFormElement} formElement - Form element to sanitize.
         */
        sanitizeForm: function(formElement) {
            if (!formElement) return;
            const inputs = formElement.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => {
                input.value = this.escapeHTML(input.value.trim());
            });
        }
    };

    // Export to global window object
    window.Security = Security;
})();
