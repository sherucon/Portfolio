console.log("%cHey!", "color: #F00; font-size:50px; -webkit-text-stroke: 1px black; font-weight:bold"),
        console.log("What are you snooping in my console for? This is for me only! Unless you are me, in which case... carry on, genius. Might I also say you're looking mighty handsome today? I - uh - anyways, if you're not me, get lost! My code is for me only because it is super neat and very well written and makes perfect sense and has zero mistakes. So there! Harrumph!"),
            console.log("%c(Just kidding, of course. Snoop around as much as you like. You are welcome here. We learn by watching, after all. If you're a coder or you want to be one, try figuring out my code. It helped me a ton when I was learning (and I still am learning from doing it!))", "font-size: 10px");

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
});

function disableActiveNavLinks() {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll("nav a"); 

    navLinks.forEach(link => {
        if (link.querySelector("img")) {
            link.classList.remove("active");
            return;
        }

        if (link.href === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

disableActiveNavLinks();