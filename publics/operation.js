function setUsername(){
    socket.emit('setUsername', document.getElementById('name').value);
};
var user;
socket.on('userExists', function(data){
    document.getElementById('error-container').innerHTML = data;
});
socket.on('userSet', function(data){
    user = data.username;
    document.body.innerHTML = '<div id="user">\
    <input type="text" id="message">\
    <button type="button" id="sendUser" name="button" onclick="sendMessage()">Send</button>\
    <div class="message" id="message-container"></div></div>';
});
function sendMessage(){
    var msg = document.getElementById('message').value;
    if(msg){
        socket.emit('msg', {message: msg, user: user});
    }
}
socket.on('newmsg', function(data){
    if(user){
        document.getElementById('message-container').innerHTML += '<div><b>' + data.user + '</b>: ' + data.message + '</div>'
    }
})
