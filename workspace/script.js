// Our message list & starting index
const messages = [
    "Are you sure? ",
    "Really sure?",
    "Pookie Please? ",
    "I'm going to cry... :( ",
    "You're breaking my heart! ",
    "REALLY sure?",
    "please?",
    "pretty please? ",
    "PLEASE?",
    "PRETTY PLEASE? ",
    "PLEASE PLEASE PLEASE? ",
    "PLEASE PLEASE PLEASE PLEASE PL ",
    "stop",
    "STOP",
    ":(",
    ":( :(",
    ":( :( :(",
    "I'm sad now",
    "No",
    "No",
    "No",
    "No",
];
let currentMessageIndex = 0;

// Let's set initial scale values
let yesScale = 1;
let noScale = 1;

function teleportButton(button) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const padding = 20;

    // Calculate safe boundaries for the button
    const minX = padding;
    const maxX = screenWidth - button.offsetWidth - padding;
    const minY = padding;
    const maxY = screenHeight - button.offsetHeight - padding;

    let randomX, randomY;
    do {
        randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
        randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
    } while (
        // Avoid the card area
        randomX < cardRect.right &&
        randomX + buttonRect.width > cardRect.left &&
        randomY < cardRect.bottom &&
        randomY + buttonRect.height > cardRect.top
    );

    // Create a wrapper for the button content if it doesn't exist
    let contentWrapper = button.querySelector('.button-content');
    if (!contentWrapper) {
        contentWrapper = document.createElement('div');
        contentWrapper.className = 'button-content';
        contentWrapper.textContent = button.textContent;
        button.textContent = '';
        button.appendChild(contentWrapper);
    }

    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.style.transform = `scale(${noScale})`;
}

document.addEventListener('DOMContentLoaded', function() {
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');
    const card = document.querySelector('.card');

    // Set initial no button text with wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'button-content';
    contentWrapper.textContent = 'no';
    noButton.textContent = '';
    noButton.appendChild(contentWrapper);

    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        if (noButton.style.position !== 'fixed') {
            const buttonRect = noButton.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const safeDistance = 100; // Distance in pixels before button moves

            // Calculate distance between mouse and button center
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;
            const distance = Math.sqrt(
                Math.pow(mouseX - buttonCenterX, 2) + 
                Math.pow(mouseY - buttonCenterY, 2)
            );

            // If mouse gets too close, start teleporting
            if (distance < safeDistance) {
                teleportButton(noButton);
            }
        } else {
            const buttonRect = noButton.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const safeDistance = 100;

            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;
            const distance = Math.sqrt(
                Math.pow(mouseX - buttonCenterX, 2) + 
                Math.pow(mouseY - buttonCenterY, 2)
            );

            if (distance < safeDistance) {
                teleportButton(noButton);
                
                // Update scales and button text
                yesScale += 0.1;
                noScale -= 0.05;
                yesButton.style.transform = `scale(${yesScale})`;
                
                // Update the text of the no button
                const contentWrapper = noButton.querySelector('.button-content');
                contentWrapper.textContent = messages[currentMessageIndex];
                currentMessageIndex = (currentMessageIndex + 1) % messages.length;
            }
        }
    });

    // When 'yes' is clicked, update the card content with a thank you message
    yesButton.addEventListener('click', function() {
        card.innerHTML = '<h1>Thank You!</h1><p>I always knew you would choose love!</p>';
    });
}); 