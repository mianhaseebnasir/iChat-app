const socket = io('http://localhost:8901');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('iphone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    // Auto-scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position === 'left') {
        audio.play().catch(e => console.log("Audio play blocked until user interacts"));
    }
}

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if(message.trim() !== ""){
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

socket.on('user-joined', name => {
    append(`<b>${name}</b> joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`<b>${data.name}:</b> ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`<b>${name}</b> left the chat`, 'right');
});