(function() {
    const themeKey = 'global_nsoc_theme';
    const currentTheme = localStorage.getItem(themeKey) || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    window.toggleGlobalTheme = function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(themeKey, newTheme);
    };
})();