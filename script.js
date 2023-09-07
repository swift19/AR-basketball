const webcam = document.getElementById('webcam');
const animationCanvas = document.getElementById('animationCanvas');
const startButton = document.getElementById('startButton');
const ctx = animationCanvas.getContext('2d');

// Load the ball and ring images
let ballImage = new Image();
let ringImage = new Image();

ballImage.src = 'basketball.png'; // Path to the ball image
ringImage.src = 'basketball-ring.png'; // Path to the ring image

ballImage.width = 150; // Set the desired width for the ball image
ballImage.height = 150; // Set the desired height for the ball image

ringImage.width = 300; // Set the desired width for the ring image
ringImage.height = 300; // Set the desired height for the ring image

// Initialize the ball's position
let ballX = (animationCanvas.width - ballImage.width) / 2;
let ballY = animationCanvas.height - ballImage.height;

// Variables for handling ball interactions
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragEndX = 0;
let dragEndY = 0;

// Variables for tracking ball movement
let ballVelocityX = 0;
let ballVelocityY = 0;

// Function to resize the canvas to full size
function resizeCanvas() {
    animationCanvas.width = window.innerWidth;
    animationCanvas.height = window.innerHeight;
}

// Function to draw the ball and ring on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);

    // Draw the ring image
    ctx.drawImage(ringImage, animationCanvas.width / 2 - ringImage.width / 2, 70, ringImage.width, ringImage.height);

    // Draw the ball image
    ctx.drawImage(ballImage, ballX, ballY, ballImage.width, ballImage.height);

    // Update ball position based on velocity
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Check if the ball is outside the canvas boundaries
    if (ballX < 0 || ballX > animationCanvas.width || ballY > animationCanvas.height) {
        // Reset the ball's position and velocity
        ballX = (animationCanvas.width - ballImage.width) / 2;
        ballY = animationCanvas.height - ballImage.height;
        ballVelocityX = 0;
        ballVelocityY = 0;
    }

    // Request animation frame for smooth animation
    requestAnimationFrame(draw);
}

// Function to start the game when the button is clicked
function startGame() {
    // Hide the start button
    startButton.style.display = 'none';

    // Enable interaction with the ball
    enableBallInteraction();
}

// Function to enable interaction with the ball
function enableBallInteraction() {
    // Add mouse event listeners for dragging and releasing the ball
    animationCanvas.addEventListener('mousedown', onMouseDown);
    animationCanvas.addEventListener('mousemove', onMouseMove);
    animationCanvas.addEventListener('mouseup', onMouseUp);

    // Reset the ball's position
    ballX = (animationCanvas.width - ballImage.width) / 2;
    ballY = animationCanvas.height - ballImage.height;

    // Reset the ball's velocity
    ballVelocityX = 0;
    ballVelocityY = 0;

    // Set the flag to allow dragging
    isDragging = false;
}

// Mouse event handlers for dragging and releasing the ball
function onMouseDown(e) {
    const mouseX = e.clientX - animationCanvas.getBoundingClientRect().left;
    const mouseY = e.clientY - animationCanvas.getBoundingClientRect().top;

    if (mouseX >= ballX && mouseX <= ballX + ballImage.width && mouseY >= ballY && mouseY <= ballY + ballImage.height) {
        isDragging = true;
        dragStartX = mouseX;
        dragStartY = mouseY;
        dragEndX = mouseX;
        dragEndY = mouseY;
    }
}

function onMouseMove(e) {
    if (isDragging) {
        dragEndX = e.clientX - animationCanvas.getBoundingClientRect().left;
        dragEndY = e.clientY - animationCanvas.getBoundingClientRect().top;
    }
}

function onMouseUp() {
    if (isDragging) {
        // Calculate the velocity based on the swipe gesture
        ballVelocityX = (dragEndX - dragStartX) / 10; // Adjust the division factor for desired speed
        ballVelocityY = (dragEndY - dragStartY) / 10; // Adjust the division factor for desired speed
        isDragging = false;
    }
}

// Function to enable interaction with the ball
function enableBallInteraction() {
    // Add mouse and touch event listeners for dragging and releasing the ball
    animationCanvas.addEventListener('mousedown', onMouseDown);
    animationCanvas.addEventListener('mousemove', onMouseMove);
    animationCanvas.addEventListener('mouseup', onMouseUp);
    
    animationCanvas.addEventListener('touchstart', onTouchStart);
    animationCanvas.addEventListener('touchmove', onTouchMove);
    animationCanvas.addEventListener('touchend', onTouchEnd);

    // Reset the ball's position
    ballX = (animationCanvas.width - ballImage.width) / 2;
    ballY = animationCanvas.height - ballImage.height;

    // Reset the ball's velocity
    ballVelocityX = 0;
    ballVelocityY = 0;

    // Set the flag to allow dragging
    isDragging = false;
}

// Touch event handlers for dragging and releasing the ball
function onTouchStart(e) {
    e.preventDefault(); // Prevent default touch behavior

    const touch = e.touches[0];
    const touchX = touch.clientX - animationCanvas.getBoundingClientRect().left;
    const touchY = touch.clientY - animationCanvas.getBoundingClientRect().top;

    if (touchX >= ballX && touchX <= ballX + ballImage.width && touchY >= ballY && touchY <= ballY + ballImage.height) {
        isDragging = true;
        dragStartX = touchX;
        dragStartY = touchY;
        dragEndX = touchX;
        dragEndY = touchY;
    }
}

function onTouchMove(e) {
    e.preventDefault(); // Prevent default touch behavior

    if (isDragging) {
        const touch = e.touches[0];
        dragEndX = touch.clientX - animationCanvas.getBoundingClientRect().left;
        dragEndY = touch.clientY - animationCanvas.getBoundingClientRect().top;
    }
}

function onTouchEnd(e) {
    e.preventDefault(); // Prevent default touch behavior

    if (isDragging) {
        // Calculate the velocity based on the swipe gesture
        ballVelocityX = (dragEndX - dragStartX) / 10; // Adjust the division factor for desired speed
        ballVelocityY = (dragEndY - dragStartY) / 10; // Adjust the division factor for desired speed
        isDragging = false;
    }
}

// Add a click event listener to the start button
startButton.addEventListener('click', startGame);

// Initialize the canvas size to full screen
resizeCanvas();

// Add a resize event listener to adjust the canvas size when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initialize the game
draw();

// Function to start webcam streaming
async function startWebcam() {
    try {
        // Request access to the user's webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Display the webcam stream in the video element
        webcam.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

// Call the function to start webcam streaming
startWebcam();