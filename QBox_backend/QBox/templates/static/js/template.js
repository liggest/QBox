function getBoxTemplate() {
    var rboxtemp=document.createElement("div");
    rboxtemp.className="resizeBox";
    //var boxtemp=document.createElement("div");
    //boxtemp.className="box";
    //boxtemp.classList.add("animated");
    var boxTemplateHTML=
    '<div class="box animated">\
        <div class="frontbox" draggable="false">\
            <div class="close">X</div>\
        </div>\
        <div class="midbox">\
            <div class="title" >新的框</div>\
        </div>\
        <div class="backbox">\
            <div class="title" >新的框-设置</div>\
            这里是设置\
        </div>\
    </div>';
    rboxtemp.innerHTML=boxTemplateHTML;
    rboxtemp.style.position="absolute";
    return rboxtemp;
}

/*
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

*/
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

function getResizersTemplate(type) {
    var typelist=["leftUp","rightUp","leftDown","rightDown"];
    var rtemp=document.createElement("div");
    rtemp.className="resizer";
    rtemp.classList.add(typelist[type]);
    return rtemp
}
