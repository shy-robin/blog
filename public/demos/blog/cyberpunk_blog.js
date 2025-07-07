console.log("Initializing Holographic City-Eye Interface...");

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link, .read-more, .widget a');

    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            e.target.classList.add('glitch-hover');
            setTimeout(() => {
                e.target.classList.remove('glitch-hover');
            }, 300);
        });
    });

    console.log("System online. Welcome to the grid.");
});
