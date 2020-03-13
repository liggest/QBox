function getBoxTemplate() {
    var boxtemp=document.createElement("div");
    boxtemp.className="box";
    boxtemp.classList.add("animated");
    var boxTemplateHTML=
    '<div class="frontbox" draggable="false">\
        <div class="close">X</div>\
    </div>\
    <div class="midbox">\
        <div class="innerbox animated">\
            <div class="title" >主体</div>\
            <div class="chatbox" >\
            </div>\
            <div class="textbox" >\
                <input class="textarea" type="text">\
                <div class="sendbutton">\
                    <div class="sendarrow">←</div>\
                </div>\
            </div>\
        </div>\
    </div>\
    <div class="backbox">这里是设置</div>';
    boxtemp.innerHTML=boxTemplateHTML;
    boxtemp.style.position="absolute";
    return boxtemp;
}

function getResizeTemplate() {
    var rtemp=document.createElement("div");
    rtemp.className="resizeBox";
    var resizeTemplateHTML=
    '<div class="resizer leftUp"></div>\
    <div class="resizer rightUp"></div>\
    <div class="resizer leftDown"></div>\
    <div class="resizer rightDown"></div>';
    rtemp.innerHTML=resizeTemplateHTML;
    return rtemp;
}
