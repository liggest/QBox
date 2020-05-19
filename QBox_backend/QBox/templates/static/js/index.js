/*
var giveMouse=false;
var grabObject=undefined;
var grabOffsetX=0;
var grabOffsetY=0;

var boxContent=undefined;

var boxPressed=false;
var longPressFunc=undefined;
var longPressTarget=undefined;

var resizeMode=false;
var currentBoxState="normal";
*/
//#region Dragger

/*
window.onmousemove=getMousePos;
window.onmouseup=pressEnd;
window.onmouseout=pressEnd;
*/
var xhr = new XMLHttpRequest();


function Dragger() {
    this.mouseX=-1;
    this.mouseY=-1;
    this.mouseOldX=-1;
    this.mouseOldY=-1;
    this.deltaX=0;
    this.deltaY=0;
    this.isOnDrag=false;
    var dragger=this;
    this.getMouse=function(event) {
        if (dragger.isOnDrag){
            dragger.mouseOldX=dragger.mouseX;
            dragger.mouseOldY=dragger.mouseY;
            dragger.mouseX=event.clientX+window.pageXOffset
            dragger.mouseY=event.clientY+window.pageYOffset
            if(dragger.mouseOldX>0 && dragger.mouseOldY>0){
                dragger.deltaX=dragger.mouseX-dragger.mouseOldX;
                dragger.deltaY=dragger.mouseY-dragger.mouseOldY;
            }
        }
    }
    window.addEventListener("mousemove",this.getMouse);
    this.onPressBegin=function (event) {
        if(!dragger.isOnDrag){
            dragger.isOnDrag=true;
            dragger.mouseOldX=dragger.mouseX;
            dragger.mouseOldY=dragger.mouseY;
            dragger.mouseX=event.clientX+window.pageXOffset
            dragger.mouseY=event.clientY+window.pageYOffset
        }
    }
    this.onPressEnd=function (event) {
        if(dragger.isOnDrag){
            dragger.isOnDrag=false;
            dragger.mouseX=-1;
            dragger.mouseY=-1;
            dragger.mouseOldX=-1;
            dragger.mouseOldY=-1;
            dragger.deltaX=0;
            dragger.deltaY=0;
        }
    }
    this.onPressMove=function (event) {
        if(dragger.isOnDrag && !event.target.classList.contains("resizer")){
            var l=event.currentTarget.style.left;
            var t=event.currentTarget.style.top;
            l=l==""?0:Number(l.slice(0,-2));
            t=t==""?0:Number(t.slice(0,-2));
            event.currentTarget.style.left=l+dragger.deltaX+"px";
            event.currentTarget.style.top=t+dragger.deltaY+"px";
        }
    }
    this.add=function (html,func) {
        html.addEventListener("mousedown",this.onPressBegin);
        html.addEventListener("mouseout",this.onPressEnd);
        html.addEventListener("mouseup",this.onPressEnd);
        html.addEventListener("mousemove",func);
    }
    this.remove=function (html,func) {
        html.removeEventListener("mousedown",this.onPressBegin);
        html.removeEventListener("mouseout",this.onPressEnd);
        html.removeEventListener("mouseup",this.onPressEnd);
        html.removeEventListener("mousemove",func);
        this.onPressEnd();
    }
}
var dragger=new Dragger();
//#endregion

//var mainbox=document.getElementsByClassName("box")[0];
//var container=mainbox.parentNode;
//container.removeChild(mainbox);
//var resizebox=document.getElementsByClassName("resizeBox")[0];
//resizebox.parentNode.removeChild(resizebox);
//mainBox.init(container,boxLists,dragger);

//#region boxlist
var boxLists=[];
/*
boxLists.findBoxByName=function (name) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxName==name){
            return this[i];
        }
    }
    return undefined;
}
boxLists.findBoxIdxByName=function (name) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxName==name){
            return i;
        }
    }
    return -1;
}

boxLists.findBoxByNum=function (num) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxNum==num){
            return this[i];
        }
    }
    return undefined;
}
boxLists.findBoxIdxByNum=function (num) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxNum==num){
            return i;
        }
    }
    return -1;
}

boxLists.removeAt=function (idx) {
    return this.slice(0,idx).concat(this.slice(idx+1));
}*/
//#endregion

//csrf问题
var csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var csrfmethods = ["POST","DELETE","PUT"];
//console.log(csrftoken);

$.ajaxSetup({  //为csrfmethods添加csrf头
    beforeSend: function(xhr, settings) {
        if (csrfmethods.includes(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


var container=document.body;
var mainbox=getBoxTemplate(); //待换成与后端通信的版本？
var boxTemplate=mainbox.cloneNode(true);
var resizebox=getResizeTemplate(); //待换成与后端通信的版本？
var rboxTemplate=resizebox.cloneNode(true);
var currentFocus=undefined;

//这里是网页初始化 请求成功了才能生成框
$.get("/box/init",{width:document.body.clientWidth,height:document.body.clientHeight}).done(
    function(data) {
        var boxobj=data
        var mainBox=new Box("主体",mainbox,boxobj);
        mainBox.init(container,boxLists,dragger);
        currentFocus=mainBox;
    }
).fail(
    function (xhr, status) {
        alert("网页初始化失败！请检查网络连接…");
    }
);

window.onbeforeunload=function () {
    var url = location.href+"box/exit/";
    //console.log(url);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(url);
        //这个↑是新技术，caniuse网上说，约94%的用户的浏览器支持这个
    }
    //return "12345";
};

//这个基本没用
function addFavorite(url,title) {
    if (document) {
        try{
            window.external.addFavorite(url, title);
            window.external.AddToFavoritesBar(url, title);
        }catch(e){
            
        }
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
}
/*
setTimeout(function () {
    for(var i=0;i<3;i++){ 
        new Box("子机"+i,boxTemplate.cloneNode(true)).init(container,boxLists,dragger);
    } 
},3000);
*/
//#region 按键监听
function KeyListener() {
    var kl=this;
    this.onPress=function (enevt) {
        if(enevt.keyCode==13){
            console.log("我要发送了！");
            currentFocus.clickSubmit();
        }
    }
    window.addEventListener("keypress",this.onPress);
}
var kl=new KeyListener();

//#endregion
//#region 去除初始动画
/*
setTimeout(function () {
    var anis=document.getElementsByClassName("animated");
    var anisl=anis.length;
    for(var i =0;i<anisl;i++){
        anis[0].classList.remove("animated");
    }
},2500)*/
/*
function setRBox() {
    var rbox=document.getElementsByClassName("resizeBox");
    //rbox[i].classList.contains
    var rblen=rbox.length
    for(var i=0;i<rblen;i++){
        refreshRBox(rbox[i]);
    }
}
*/

//#endregion
/*
function refreshRBox(rbox,target) {
    var rect=target.getBoundingClientRect();
    rbox.style.top=target.offsetTop-moveOffsetY+"px";
    rbox.style.left=target.offsetLeft-moveOffsetX+"px";
    //rbox.style.top=rect.top-2+"px";
    //rbox.style.left=rect.left-2+"px";
    rbox.style.width=target.offsetWidth+4+"px";
    rbox.style.height=target.offsetHeight+4+"px";
    target.style.top="0px";
    target.style.left="0px";
    target.style.margin="auto auto auto auto";
    target.parentNode.replaceChild(rbox,target);
    rbox.appendChild(target);
}*/


/*
function pressBegin(event) {
    if(!giveMouse){
        grabObject=event.currentTarget;
        rect=grabObject.getBoundingClientRect();
        grabOffsetX=rect.left-event.clientX;
        grabOffsetY=rect.top-event.clientY;
        giveMouse=true;
        boxDePress();
    }
}


function pressEnd() {
    giveMouse=false;
}

function getMousePos(event) {
    if (giveMouse){
        var mx=event.clientX+window.pageXOffset+grabOffsetX;
        var my=event.clientY+window.pageYOffset+grabOffsetY;
        if(grabObject!=undefined){
            grabObject.style.top=my+"px";
            grabObject.style.left=mx+"px";
        }
        //console.log(event.clientX);
    }
}
*/
/*
function upSideDownT(box,newn) {
    var bfc=box.firstElementChild;
    bfc.classList.add("transparent");
    box.classList.add("upsidedown");
    setTimeout(function () {
        box.innerHTML=newn;
        box.classList.remove("upsidedown");
        box.firstElementChild.classList.remove("transparent");
    },500);
}



function boxDBClick(event) {
    if(resizeMode){
        return;
    }
    var box=event.currentTarget;
    
    if(boxContent==undefined){
        boxContent=box.innerHTML;
        var ntemp='<div class="setting transparent">这里是设定</div>';
        upSideDownT(box,ntemp);
    }else{
        upSideDownT(box,boxContent);
        boxContent=undefined;
    }
}*/
/*
function boxPressBegin(event) {
    if(!boxPressed && !giveMouse){
        boxPressed=true;
        longPressTarget=event.currentTarget;
        longPressFunc=setTimeout(function () {
            if(boxPressed){
                boxLongPress(longPressTarget);
            }
        },longPressInterval);
    }
}

function boxDePress() {
    if(boxPressed){
        boxPressed=false;
        clearTimeout(longPressFunc);
        longPressTarget=undefined;
    }
}

function boxLongPress(target) {
    resizeMode=true;
    if(boxContent!=undefined){
        upSideDownT(target,boxContent);
        boxContent=undefined;
    }
    var rtemp=rboxTemplate.cloneNode(true);
    refreshRBox(rtemp,target);
    boxContent=target.innerHTML;
    var ntemp='<div class="setting transparent" onclick="boxlongPressEnd(event)">X</div>';
    upSideDownT(target,ntemp);
}

function boxlongPressEnd(event) {
    var box=event.target.parentNode;
    var rbox=box.parentNode;
    var rect=rbox.getBoundingClientRect();
    box.style.top=rbox.offsetTop-moveOffsetY+"px";
    box.style.left=rbox.offsetLeft-moveOffsetX+"px";
    //box.style.top=rect.top+2+"px";
    //box.style.left=rect.left+2+"px";
    box.style.margin="0px 0px 0px 0px";
    //console.log(box.getBoundingClientRect());
    rbox.parentNode.replaceChild(box,rbox);
    upSideDownT(box,boxContent);
    boxContent=undefined;
    resizeMode=false;
}
*/