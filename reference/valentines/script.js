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


let yesScale = 1;
let noScale = 1;

function teleportButton(button) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const padding = 20;

    const minX = padding;
    const maxX = screenWidth - button.offsetWidth - padding;
    const minY = padding;
    const maxY = screenHeight - button.offsetHeight - padding;

    let randomX, randomY;
    let attempts = 0;
    do {
        randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
        randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
        attempts++;
        if (attempts > 10) {
            break;
        }
    } while (
        randomX < cardRect.right &&
        randomX + buttonRect.width > cardRect.left &&
        randomY < cardRect.bottom &&
        randomY + buttonRect.height > cardRect.top
    );

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

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'button-content';
    contentWrapper.textContent = 'no';
    noButton.textContent = '';
    noButton.appendChild(contentWrapper);


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
                
                
                yesScale += 0.1;
                noScale -= 0.05;
                yesButton.style.transform = `scale(${yesScale})`;
               
                const contentWrapper = noButton.querySelector('.button-content');
                contentWrapper.textContent = messages[currentMessageIndex];
                currentMessageIndex = (currentMessageIndex + 1) % messages.length;
            }
        }
    });


    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        noButton.addEventListener('click', function(e) {
            e.preventDefault();
            teleportButton(noButton);
            yesScale += 0.1;
            noScale -= 0.05;
            yesButton.style.transform = `scale(${yesScale})`;
            const contentWrapper = noButton.querySelector('.button-content');
            contentWrapper.textContent = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        });
    }

    yesButton.addEventListener('click', function() {
        renderThankYouPage();
    });

    function renderThankYouPage() {
        card.innerHTML = `
            <div class="thankyou-container">
                <h1>Thank You!</h1>
                <p>I always knew you would choose love!</p>
                <div id="envelopeContainer">
                    <div id="envelope">
                        <div class="flap"></div>
                        <div class="click-text">Click Me</div>
                    </div>
                    <div id="paper"></div>
                </div>
            </div>`;
        attachEnvelopeListener();
    }

    function attachEnvelopeListener() {
        const envelope = document.getElementById('envelope');
        envelope.addEventListener('click', function() {
            envelope.classList.add('open-envelope');
            setTimeout(function() {
                const paper = document.getElementById('paper');
                paper.style.display = 'block';
                paper.classList.add('animate-paper');
                    envelope.style.display = 'none';
                    const closeBtn = document.createElement('button');
                    closeBtn.id = 'closePaper';
                    closeBtn.innerHTML = '&times;';
                    paper.appendChild(closeBtn);
                    closeBtn.addEventListener('click', function() {
                        paper.classList.remove('animate-paper');
                        paper.style.display = 'none';
                        renderThankYouPage();
                    });
                    let scriptElem = document.createElement('script');
                    scriptElem.src = 'sketch.js';
                    document.body.appendChild(scriptElem);
                }, 1000); 
            }, 500); 
    }
}); 