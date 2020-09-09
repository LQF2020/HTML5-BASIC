const ws = require('nodejs-websocket');

const port = 8080;
var count = 0;
const type_enter = 0;
const type_leave = 1;
const type_data = 2;


const server = ws.createServer(connect => {
    // console.log("user join!");
    count++;
    connect.user_name = 'USER_' + count.toString();
    broadcast(type_enter ,connect.user_name + "进入了聊天室");
    //接受客户端websocket发过来的信息
    connect.on('text', data => {
        // console.log('received:'+data);
        broadcast( type_data ,connect.user_name + ': ' + data);
    });

    //控制websocket异常，当用户关闭或刷新浏览器就会触发
    connect.on("error", function (code, reason) {

        // console.log("Connection closed")
    });

    //socket关闭时候触发回调
    connect.on("close", function () {
        count--;
        // console.log("Connection Error happen");
        broadcast(type_leave, connect.user_name + "退出了聊天室");
    })
});

//广播用户信息
function broadcast(datatype, msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(
            { "datatype": datatype, "data": msg, "date": new Date().toLocaleTimeString() }
            ));
    })
}


server.listen(port, function () {
    console.log("Web socket is on now, listening on port " + port);
});