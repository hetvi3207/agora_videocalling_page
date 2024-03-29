let handlefail = function(err){
    console.log(err)
}

let i = 0;

function addVideoStream(streamId){
    console.log()
    let remoteContainer = document.getElementsByClassName("remoteStream")[i++];
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "250px";
    remoteContainer.appendChild(streamDiv)

    var node = document.createElement("LI");
    var textnode = document.createTextNode(streamId);
    node.appendChild(textnode);
    document.getElementById("participantsList").appendChild(node);
} 

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "5c40986de56142a9affa4286f72ef5c3";

    var node = document.createElement("LI");
    var textnode = document.createTextNode(Username);
    node.appendChild(textnode);
    document.getElementById("participantsList").appendChild(node);

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail
    )

    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })

}