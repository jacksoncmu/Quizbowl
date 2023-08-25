  var socketio = io();
  const messages = document.getElementById("messages");
  const buzzButton = document.getElementById("buzz-btn");
  const createGameButton = document.getElementById("createGameButton");
  const resetGameButton = document.getElementById("resetGameButton");
  let hasBuzzedIn = false;

  socketio.on("host_left", () => {
    alert("Host left the game");
    window.location.href = "{{ url_for('home') }}"; 
  });

  socketio.on("room_status_update", (data) => {
    if (data.room === "{{ session.get('room') }}") {
      if (data.status === "restricted") {
        buzzButton.disabled = false;
        if ("{{ session.get('identity') }}" === "host") {
        createGameButton.style.display = "none"; 
        resetGameButton.style.display = "block";} 
      } else {
        buzzButton.disabled = true;
        if ("{{ session.get('identity') }}" === "host") {
        createGameButton.style.display = "block"; 
        resetGameButton.style.display = "none";} // Show create and hide reset
      }
    }
  });


  const createMessage = (name, msg, formattedTime) => {
  const showTimestamp = msg.includes("buzzed in!");

  const content = `
    <div class="text">
      <span class="message-content">
        <strong>${name}</strong>: ${msg}
      </span>
      ${showTimestamp ? `
        <span class="timestamp">${formattedTime}</span>` : ''}
    </div>
  `;

  messages.innerHTML += content;
};

socketio.on("message", (data) => {
    const serverTimestamp = new Date(data.timestamp); 
    const formattedTime = serverTimestamp.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 });

    createMessage(data.name, data.message, formattedTime);
});

  const sendMessage = () => {
    const message = document.getElementById("message");
    if (message.value == "") return;
    socketio.emit("message", { data: message.value });
    message.value = "";
  };

  const buzzIn = () => {

    socketio.emit("message", { data: "{{ session.get('name') }} buzzed in!" });
    hasBuzzedIn = true; 
    buzzButton.disabled = true; 
  };

  if ("{{ session.get('identity') }}" === "host") {
    document.getElementById("createGameButton").style.display = "block";
    document.getElementById("resetGameButton").style.display = "block";
  }
  else {
    document.getElementById("createGameButton").style.display = "none";
    document.getElementById("resetGameButton").style.display = "none"; 
  }

  document.getElementById("resetGameButton").style.display = "none";

  const createGame = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/create_game", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
      
        socketio.emit("message", { data: "Game started!" });
        
      }
    };
    xhr.send(JSON.stringify({ room: "{{ session.get('room') }}" }));
  };

  const resetGame = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/reset_game", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        socketio.emit("message", { data: `Game has been reset by {{ session.get('name') }}.` });
      }
    };
    xhr.send(JSON.stringify({ room: "{{ session.get('room') }}" }));
  };
