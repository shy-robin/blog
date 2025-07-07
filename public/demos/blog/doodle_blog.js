console.log("Welcome to the Scribble Corner!");

document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('a, .post-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // A simple wiggle animation could be added via CSS class
        });
    });
});
