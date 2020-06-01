var offsets={"absolute":{"moveOffsetX":0,"moveOffsetY":0},"":{"moveOffsetX":0,"moveOffsetY":0}};
const moveOffsetX=8;//尝试解决切换resize模式时意外偏移问题
const moveOffsetY=8;
const longPressInterval=700;

var messager=new Messager();

var getBoxNum =function(){
    var x=-1;
    return (function(){
        x+=1;
        return x;
    });
}();

function Box(name,content,boxobj) {
    //#region init
    this.boxNum=getBoxNum();
    this.content=content;
    this.boxObj=boxobj;
    this.frontcontent=this.content.firstElementChild.firstElementChild;
    //this.midcontent=this.content.getElementsByClassName("midbox")[0];
    this.midcontent=this.frontcontent.nextElementSibling;
    this.backcontent=this.content.firstElementChild.lastElementChild;
    this.title=this.midcontent.firstElementChild;
    this.backtitle=this.backcontent.firstElementChild;
    this.dragger=undefined;
    this.boxList=undefined;
    var box=this;
    this.setName(name||boxobj["boxName"]||"未命名框");
    this.init=function (container,boxLists,dragger) {
        boxLists.push(this);
        this.content.style.position="absolute";
        if(this.boxObj["position"]){
            var p=this.boxObj["position"];
            this.setPosition(p[0],p[1]);
        }
        if(this.boxObj["size"]){
            var size=this.boxObj["size"];
            this.setSize(size[0],size[1]);
        }
        container.prepend(this.content);
        this.dragger=dragger;
        this.boxList=boxLists;

        this.resizers=[getResizersTemplate(0),getResizersTemplate(1),getResizersTemplate(2),getResizersTemplate(3)];
        //var l=boxLists.length;

        /*if(l!=1){
            var dx=boxLists[0].content.offsetLeft-this.content.offsetLeft;
            var dy=boxLists[0].content.offsetTop-this.content.offsetTop;
            var x=(l-1)%12 *40;
            //var y=Math.floor(l/12) *40;
            this.move(dx+x,x);
        }*/
        setTimeout(function () {
            var anis=box.content.getElementsByClassName("animated");
            var anisl=anis.length;
            for(var i =0;i<anisl;i++){
                anis[0].classList.remove("animated");
            }
            //var mobj=messager.textobj("你好呀，有什么可以帮忙的吗？",0);
            //box.sendMsg(mobj);
        },2500)

    }
    //#endregion
    //#region initByBoxData
    Box.prototype.initByBoxData=function(boxobj){
        var boxtype=boxobj["boxtype"];
        switch(boxtype){
            case "chatbox":
                this.chatBoxInit();
                break;
        }
    }
    this.chatBoxInit=function () {
        //#region init
        //this.title=this.midcontent.firstElementChild;
        //this.title.innerText=this.boxName;
        this.innercontent=this.midcontent.lastElementChild;        
        this.chat=this.innercontent.firstElementChild;
        this.text=this.chat.nextElementSibling;
        //#endregion
        //#region changeResize
        /*var oldresizeBegin=this.resizeBegin;
        this.resizeBegin=function () {
            var scrolltemp=box.chat.scrollTop;
            oldresizeBegin();
            box.chat.scrollTop=scrolltemp;
        }
        var oldresizeEnd=this.resizeEnd;
        this.resizeEnd=function () {
            //var scrolltemp=box.chat.scrollTop;
            oldresizeEnd();            
            //box.chat.scrollTop=scrolltemp;
        }*/
        //#endregion
        //#region scroll
        this.scrollAim=0;
        this.scrollSpeed=0;
        this.isScrolling=false;
        this.rollscroll=function (scroll,position,speed) {
            box.scrollAim=position;
            box.scrollSpeed=speed;
            if(scroll.scrollTop-box.scrollAim>0){
                box.scrollSpeed*=-1;
            }
            if(!box.isScrolling){
                var times=0;
                box.isScrolling=true;
                var num=setInterval(function () {
                    if(Math.abs(scroll.scrollTop-box.scrollAim)<box.scrollSpeed){
                        scroll.scrollTo(0,box.scrollAim);
                        box.isScrolling=false;
                        clearInterval(num);
                    }else{
                        times+=1;
                        if(times<10){
                            scroll.scrollBy(0,box.scrollSpeed*times/10);
                        }else{
                            scroll.scrollBy(0,box.scrollSpeed);
                        } 
                    }
                },20);
            }
        }
        //#endregion

        //#region msg
        this.sendMsg=function (mobj) {
            if(mobj["type"]==-1){
                box.text.firstElementChild.value=mobj["content"][0]["value"];
                return;
            }
            var html=messager.mobj2HTML(mobj);
            html.addEventListener("dragstart",this.onMsgDragStart);
            this.chat.appendChild(html);

            var wsmsg=messager.getWsMsg("msg",mobj);
            this.websocket.send(JSON.stringify(wsmsg));

            setTimeout(function () {
                box.rollscroll(box.chat,box.chat.scrollHeight-box.chat.clientHeight,10);
            },20);

            var l=box.nextBoxes.length;
            if(l!=0 && mobj["type"]==0){
                for(var i=0;i<l;i++){
                    box.nextBoxes[i].importSubmit(mobj);
                }
            }
        }
        this.clickSubmit=function () {
            if(box.resizeMode){
                return;
            }
            var input=messager.addPS(box.text.firstElementChild.value,box.prefix,box.suffix);
            if(input==""){
                return;
            }
            box.text.firstElementChild.value="";
            var mobj=messager.textobj(input,1);
            box.sendMsg(mobj);
            box.analyze(input);
        }
        this.text.lastElementChild.firstElementChild.addEventListener("click",this.clickSubmit);
        this.importSubmit=function (mobj) {
            if(this.settingMode || this.resizeMode){
                return;
            }
            mobj["type"]=1;
            if(mobj["content"][0]["type"]=="t"){
                mobj["content"][0]["value"]=messager.addPS(mobj["content"][0]["value"],this.prefix,this.suffix);
            }
            this.sendMsg(mobj);
            if(mobj["content"][0]["type"]=="t"){
                var result=mobj["content"][0]["value"];
                this.analyze(result);
            }
        }
        this.onMsgDragStart=function (event) {
            box.onDePress();
            var et=event.target;
            var mobj;
            if(et.nodeName=="#text"){
                mobj=messager.Node2mobj(et,-1);
            }else{
                mobj=messager.Node2mobj(et,1);
            }
            event.dataTransfer.setData("text",messager.mobj2JSON(mobj));
        }
        this.onfileDrag=function (event) {
            event.preventDefault();
        }
        this.onfileDrop=function (event) {
            event.preventDefault();
            var ed=event.dataTransfer;
            var ejson=ed.getData("text");
            if(ejson!=""){
                var mobj=messager.JSON2mobj(ejson);
                box.sendMsg(mobj);
            }
            var efs=ed.files;
            if(efs!=undefined && efs.length!=0){
                var fd = new FormData();
                var mobj={"type":1,"content":[]};
                for(var i=0;i<efs.length;i++){
                    fd.append(efs[i].name,efs[i]);
                    mobj.content.push(messager.file2msg(efs[i]));
                }
                box.sendMsg(mobj);
            }
        }
        this.innercontent.addEventListener("dragover",this.onfileDrag);
        this.innercontent.addEventListener("drop",this.onfileDrop);
        this.nextBoxes=[];
        this.prefix="";
        this.suffix="";
        this.analyze=function (text) {
            var mobj;
            if(Commander.prototype.isCommand(text)){
                nodeals=this.processCommands(text);
                if(nodeals.length>0){
                    //交给后端处理
                    
                }
            }
        /*
            var ts=text.split(" ");
            if(text.startsWith("我要")){
                var stext=text.substring(2).trim();
                var result="https://magi.com/search?q="+encodeURIComponent(stext);
                mobj=messager.linkobj(result,0);
                box.sendMsg(mobj);
            }else if(text.startsWith("计算")){
                try{
                    var exp=text.substring(2).trim();
                    var result=eval(exp).toString();
                    mobj=messager.textobj(result,0);
                    box.sendMsg(mobj);
                }
                catch{
                    mobj=messager.textobj("解析失败啦…",0);
                    box.sendMsg(mobj);
                }
            }else if(text.startsWith("新建")){
                var nbName=text.substring(2).trim();
                if(nbName!=""){
                    $.get("/box/templates",{boxtype:"chatbox",data:JSON.stringify({}) }).done(
                        function(data) {
                            var boxobj=data
                            new Box(nbName,boxTemplate.cloneNode(true),boxobj).init(container,boxLists,dragger);
                        }
                    );
                }else{
                    mobj=messager.textobj("请给我弟弟一个名字",0);
                    box.sendMsg(mobj);
                }
            }else if(text.startsWith("连接")){
                var nbName=text.substring(2).trim();
                var nb=box.boxList.findBoxByName(nbName);
                if(nb!=undefined){
                    mobj=messager.textobj("成功！",0);
                    box.sendMsg(mobj);
                    box.nextBoxes.push(nb);
                }else{
                    mobj=messager.textobj("失败了…哪里出错了呢…",0);
                    box.sendMsg(mobj);
                }
            }else if(text.startsWith("断开")){
                var nbName=text.substring(2).trim();
                var nbi=box.nextBoxes.findBoxIdxByName(nbName);
                if(nbi>=0){
                    mobj=messager.textobj("成功！",0);
                    box.nextBoxes.removeAt(nbi);
                    box.sendMsg(mobj);
                }else{
                    mobj=messager.textobj("失败了…哪里出错了呢…",0);
                    box.sendMsg(mobj);
                }
            }else if(text.startsWith("重复")){
                var msg=text.substring(2).trim();
                mobj=messager.textobj(msg,0);
                box.sendMsg(mobj);
            }else if(text.startsWith("前缀")){
                var s=text.substring(2).trim();
                mobj=messager.textobj("已设置前缀为 "+s,0);
                box.sendMsg(mobj);
                box.prefix=s;
            }else if(text.startsWith("后缀")){
                var s=text.substring(2).trim();
                mobj=messager.textobj("已设置后缀为 "+s,0);
                box.sendMsg(mobj);
                box.suffix=s;
            }else if(text.startsWith("延迟")){
                var num=/\d+/.exec(text)[0];
                if(num!=null){
                    var texta=text.split(num,2);
                    setTimeout(function () {
                        box.analyze(texta.slice(1).join(num));
                    },Number(num));
                }
            }else if(text.startsWith("寄生")){
                var result="javascript: var s = document.createElement('script'); s.type='text/javascript'; s.src='http://127.0.0.1:8080/static/IB.js'; document.body.appendChild(s); void(0);"
                mobj=messager.linkobj(result,0);
                box.sendMsg(mobj);
                if(addFavorite){
                    addFavorite(result,"QBox");
                }
            }else if(text=="你叫什么"){
                mobj=messager.textobj("求框-QBox-<br>alpha 1.0",0);
                box.sendMsg(mobj);
            }else if(text=="刷新"){
                box.refresh();
            }else if(text=="自毁"){
                box.selfDestroy();
            }
            
            else if(text=="云端留言板"){
                $.get("/box/templates",{boxtype:"cloudmsg",data:{}}).done(
                    function(data) {
                        var boxobj=data
                        new Box("云端留言板",boxTemplate.cloneNode(true),boxobj).init(container,boxLists,dragger);
                    }
                );
            }
            else{
                
                mobj=messager.textobj(text,1);
                xhr.open('post', "http://127.0.0.1:8080/api/",true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var robj = JSON.parse(this.responseText);
                        if(robj["content"].length!=0){
                            box.sendMsg(robj);
                        }
                    }
                };
                xhr.send(messager.mobj2JSON(mobj));
            }
        */
        }
        this.refresh=function () {
            this.chat.innerHTML="";
            this.prefix="";
            this.suffix="";
            this.nextBoxes.splice(0,this.nextBoxes.length);
        }
        //#endregion
        //#region websocket
        this.websocket=undefined;
        this.wsConnect=function () {
            var wsurl = location.host+"/box/ws/"+ this.boxNum +"/";
            try{
                this.wsReconnectLock=false;
                this.websocket = new WebSocket("ws://"+wsurl);
                this.wsEvents();
            }catch(e){
                console.log("连接失败！");
                this.wsReconnect();
            }
        }
        this.wsEvents=function () {
            this.websocket.onopen = function () {
                console.log(box.boxName+" 连接成功");
                //box.websocket.send(JSON.stringify({msg:"发送数据"}));
                box.wsHeartBeat();
            }
            this.websocket.onmessage = function (evt) {
                var received = JSON.parse(evt.data);
                if (received["wsMsgType"]=="heartbeat"){
                    //console.log(box.boxName+" 收到了心跳");
                    
                }else if(received["wsMsgType"]=="msg"){
                    box.sendMsg(received["wsMsg"]);
                    console.log(box.boxName+" 有消息了：");
                    console.log(received["wsMsg"]);
                }else if(received["wsMsgType"]=="cmd"){
                    //收到指令，备用
                    console.log(box.boxName+" 收到指令："+received["wsMsg"]);
                    box.processCommands(received["wsMsg"]);
                }
                box.wsHeartBeatReset();
            }
            this.websocket.onclose = function () {
                console.log("连接关闭");
                clearInterval(box.websocket.heartbeat);
                box.wsReconnect();
            }
            this.websocket.onerror = function () {
                console.log("连接异常");
                clearInterval(box.websocket.heartbeat);
                box.wsReconnect();
            }
        }
        this.wsReconnectLock=false;
        this.wsReconnect=function() {
            if(this.wsReconnectLock){ //加锁，避免重复重连
                return;
            }
            console.log("尝试重连..");
            this.wsReconnectLock=true;
            this.wsReconnectTime && clearTimeout(this.wsReconnectTime);
            this.wsReconnectTime=setTimeout(function () {
                box.wsConnect();
                box.wsReconnectLock=false;
            },4000) //4秒后尝试重连，避免连接太频繁
        }
        this.wsHeartBeat=function () {
            this.websocket.last=new Date().getTime();
            this.websocket.lostnum=3;
            this.websocket.heartbeat=setInterval(function () {
                var current=new Date().getTime();
                if(current-box.websocket.last>35000){
                    box.websocket.lostnum--;
                    console.log("没收到心跳...剩余尝试机会："+box.websocket.lostnum);
                    if(box.websocket.lostnum<=0){
                        clearInterval(box.websocket.heartbeat);
                        box.websocket.close();
                        console.log("心跳丢失！");
                    }
                }else{
                    if (box.websocket.bufferedAmount == 0 && box.websocket.readyState == 1) {
                        var wsmsg=messager.getWsMsg("heartbeat","上");
                        box.websocket.send(JSON.stringify(wsmsg));
                        //console.log(box.boxName+" 发送了心跳");
                    }
                }
            },30000);
        }
        this.wsHeartBeatReset=function () {
            this.websocket.last=new Date().getTime();
        }
        this.wsDisconnect=function () {
            this.wsReconnectLock=true;
            this.websocket.close();
        }
        var oldBackendinit=this.backendinit;
        this.backendinit=function () {
            var xhr=oldBackendinit();
            xhr.done(function(data) {
                //console.log("hack了框！");
                box.wsConnect();
            });
        }
        //#endregion
        //#region others
        var oldSelfDestroy=this.selfDestroy;
        this.selfDestroy=function () {
            //console.log("chatbox自毁");
            this.wsDisconnect();
            oldSelfDestroy.apply(this);
        }
        //#endregion
    }

    this.backendinit=function(){
        jdata={
            id:box.boxNum,
            name:box.boxName,
            boxtype:box.boxObj["boxtype"],
            size:box.boxObj["size"],
            position:box.boxObj["position"]
        }
        var xhr=$.post("/box/register/",{
            data:JSON.stringify(jdata)
        }).done(function(data) {
            console.log(data);
        });
        return xhr;
    }
    Box.prototype.getInnerBox=function(boxobj){
        this.midcontent.innerHTML+=boxobj["boxhtml"];
        this.initByBoxData(boxobj);
        this.backendinit();
    }
    //#endregion

    //#region interaction events
    //#region resize
    this.resizeBegin=function () {
        //var offsetX=offsets[this.content.style.position]["moveOffsetX"];
        //var offsetY=offsets[this.content.style.position]["moveOffsetY"];

        //this.resizeBox.style.position=this.content.style.position;

        //this.resizeBox.style.top=this.content.offsetTop-offsetX+"px";
        //this.resizeBox.style.left=this.content.offsetLeft-offsetY+"px";
        //this.resizeBox.style.width=this.content.offsetWidth+"px";
        //this.resizeBox.style.height=this.content.offsetHeight+"px";
        //this.content.style.top="0px";
        //this.content.style.left="0px";
        //this.content.style.margin="auto auto auto auto";
        //this.content.style.width="100%";
        //this.content.style.height="100%";
        //this.content.parentNode.replaceChild(this.resizeBox,this.content);
        //this.resizeBox.appendChild(this.content);
        this.content.prepend(this.resizers[3]);
        this.content.prepend(this.resizers[2]);
        this.content.prepend(this.resizers[1]);
        this.content.prepend(this.resizers[0]);
        this.dragger.add(this.resizers[3],this.resizeRightDown);
        this.dragger.add(this.resizers[2],this.resizeLeftDown);
        this.dragger.add(this.resizers[1],this.resizeRightUp);
        this.dragger.add(this.resizers[0],this.resizeLeftUp);
        this.dragger.add(this.content,this.dragger.onPressMove);

        //this.dragger.add(this.resizeBox,this.dragger.onPressMove);

        setTimeout(function () {
            box.frontcontent.classList.add("down");
            box.midcontent.classList.add("moreshadow");
        },0)
        this.resizeMode=true;
    }
    this.resizeEnd=function () {
        this.resizeMode=false;
        //var offsetX=offsets[this.content.style.position]["moveOffsetX"];
        //var offsetY=offsets[this.content.style.position]["moveOffsetY"];

        //this.content.style.top=this.resizeBox.offsetTop-offsetX+"px";
        //this.content.style.left=this.resizeBox.offsetLeft-offsetY+"px";
        //this.content.style.margin="0px 0px 0px 0px";
        //this.content.style.width=this.resizeBox.offsetWidth+"px";
        //this.content.style.height=this.resizeBox.offsetHeight+"px";

        this.dragger.remove(this.resizers[3],this.resizeRightDown);
        this.dragger.remove(this.resizers[2],this.resizeLeftDown);
        this.dragger.remove(this.resizers[1],this.resizeRightUp);
        this.dragger.remove(this.resizers[0],this.resizeLeftUp);
        this.dragger.remove(this.content,this.dragger.onPressMove);
        
        this.content.removeChild(this.resizers[0]);
        this.content.removeChild(this.resizers[1]);
        this.content.removeChild(this.resizers[2]);
        this.content.removeChild(this.resizers[3]);
        //this.dragger.remove(this.resizeBox,this.dragger.onPressMove);

        //this.resizeBox.parentNode.replaceChild(this.content,this.resizeBox);

        //这里需要告诉后端已经缩放完了
        this.backendUpdate({size:this.getSize(),position:this.getPosition()})
        

        setTimeout(function () {
            box.frontcontent.classList.remove("down");
            box.midcontent.classList.remove("moreshadow");
        },0)
    }
    //this.resizeBox=rboxTemplate.cloneNode(true);
    this.resizeMode=false;
    this.resizers=undefined;
    //this.resizers=this.resizeBox.getElementsByClassName("resizer");
    this.resizeRightDown=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var [w,h]=box.getSize();
            box.setSize(w+dragger.deltaX,h+dragger.deltaY);
        }
    }
    this.resizeLeftDown=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var [w,h]=box.getSize();
            var l=box.content.style.left;
            l=l==""?0:Number(l.slice(0,-2));
            box.setSize(w-dragger.deltaX,h+dragger.deltaY);
            box.content.style.left=l+dragger.deltaX+"px";
        }
    }
    this.resizeLeftUp=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var [w,h]=box.getSize();
            var l=box.content.style.left;
            var t=box.content.style.top;
            l=l==""?0:Number(l.slice(0,-2));
            t=t==""?0:Number(t.slice(0,-2));
            box.setSize(w-dragger.deltaX,h-dragger.deltaY);
            box.content.style.left=l+dragger.deltaX+"px";
            box.content.style.top=t+dragger.deltaY+"px";
        }
    }
    this.resizeRightUp=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var [w,h]=box.getSize();
            var t=box.content.style.top;
            t=t==""?0:Number(t.slice(0,-2));
            box.setSize(w+dragger.deltaX,h-dragger.deltaY);
            box.content.style.top=t+dragger.deltaY+"px";
        }
    }
    //#endregion
    //#region dbclick-setting
    this.settingMode=false;
    this.dbClick=function (event) {
        if(box.resizeMode){
            return;
        }
        if(box.settingMode){
            box.midcontent.classList.remove("upsidedown");
            box.backcontent.classList.remove("upsidedown");
            box.settingMode=false;
        }else{
            box.midcontent.classList.add("upsidedown");
            box.backcontent.classList.add("upsidedown");
            box.settingMode=true;
        }
    }
    this.backtitle.addEventListener("dblclick",this.dbClick);
    this.midcontent.addEventListener("dblclick",this.dbClick);
    //#endregion
    //#region longpress-resizeMode
    this.pressed=false;
    this.longPressFunc=NaN;
    this.onPressBegin=function () {
        box.pressed=true;
        box.longPressFunc=setTimeout(function () {
            if(box.pressed){
                box.longPress();
            }
        },longPressInterval);
        if(currentFocus!=undefined){
            currentFocus=box;
        }
    }
    this.onDePress=function () {
        if(box.pressed){
            box.pressed=false;
            clearTimeout(box.longPressFunc);
        }
    }
    Box.prototype.longPress=function () {
        if(!this.resizeMode){
            this.resizeBegin();
        }
    }
    this.backtitle.addEventListener("mousedown",this.onPressBegin);
    this.backtitle.addEventListener("mouseup",this.onDePress);
    this.backtitle.addEventListener("mouseout",this.onDePress);
    this.content.addEventListener("mousedown",this.onPressBegin);
    this.content.addEventListener("mouseup",this.onDePress);
    this.content.addEventListener("mouseout",this.onDePress);

    this.frontClose=function () {
        if(box.resizeMode){
            box.resizeEnd();
        }
    }
    this.frontcontent.firstElementChild.addEventListener("click",this.frontClose);
    //#endregion
    //#endregion

    //#region others
    this.selfDestroy=function () {
        var idx=this.boxList.findBoxIdxByNum(this.boxNum);
        this.boxList.removeAt(idx);
        if(this.resizeMode){
            this.resizeEnd();
        }
        this.content.firstElementChild.classList.add("transparent");
        $.post("/box/remove/"+ this.boxNum +"/",{}).done(function (data) {
            console.log(data);
        })
        setTimeout(function () {
            box.content.parentElement.removeChild(box.content)
        },1200);
    }
    //#endregion
    this.getInnerBox(boxobj); //类创建的最后，按boxobj开始加载
}

//#region Box command
Box.prototype.processCommands=function (cmds,extra) {
    if(typeof cmds=="string"){
        cmds=cmds.split("\n");
    }else if( !(cmds instanceof Array) ){
        cmds=[];
    }
    var cl=cmds.length;
    var nodeals=[];
    for(var i=0;i<cl;i++){
        var cmder=new Commander();
        if(cmder.getCommand( cmds[i] )){
            var handled=false;
            if(systemCommand.call(this,cmder)){
                handled=true;
                continue;
            }
            if(extra){
                if(typeof extra=="function"){
                    extra=[extra];
                }else if( !(extra instanceof Array) ){
                    extra=[];
                }
                var exl=extra.length;
                for(var j=0;j<exl;j++){
                    if(extra[j].call(this,cmder)){
                        handled=true;
                        break;
                    }
                }
                if(handled){
                    continue;
                }
            }
            if(this.basicCommand(cmder)){
                handled=true;
                continue;
            }
            if(!handled){
                nodeals.push(cmds[i]);
            }
        }else{
            nodeals.push(cmds[i]);
        }
    }
    return nodeals;
}
Box.prototype.basicCommand=function (cmder) {
    var handled=true;
    switch(cmder.command["command"]){
        case "aaa":
            break;
        case "bbb":
            break;
        default:
            handled=false;
            break;
    }
    return handled;
}
//#endregion
//#region Box attributes
Box.prototype.setName=function (name) {
    name=String(name);
    this.boxName=name;
    this.title.innerText=name;
    this.backtitle.innerText=name+"-设置";
}
Box.prototype.movePosition=function (x,y) {
    var [l,t]=this.getPosition();
    this.content.style.left=l+x+"px";
    this.content.style.top=t+y+"px";
}
Box.prototype.getPosition=function () {
    var l=this.content.style.left;
    var t=this.content.style.top;
    l=l==""?0:Number(l.slice(0,-2));
    t=t==""?0:Number(t.slice(0,-2));
    return [l,t];
}
Box.prototype.setPosition=function(x,y){
    this.content.style.left=x+"px";
    this.content.style.top=y+"px";
}
Box.prototype.getSize=function () {
    var w=this.content.style.width;
    var h=this.content.style.height;
    w=w.endsWith("px")?Number(w.slice(0,-2)):box.content.offsetWidth;
    h=h.endsWith("px")?Number(h.slice(0,-2)):box.content.offsetHeight;
    return [w,h];
}
Box.prototype.setSize=function (w,h) {
    this.content.style.width=w+"px";
    this.content.style.height=h+"px";
}
Box.prototype.moveTo=function(x,y,time,ease,callfunc){
    $(this.content).animate({
        left:x,
        top:y
    },time||600,ease||"easeOutCubic",callfunc||undefined);
}
Box.prototype.resizeTo=function(w,h,time,ease,callfunc){
    $(this.content).animate({
        width:w,
        height:h
    },time||600,ease||"easeOutCubic",callfunc||undefined);
}
//#endregion
//#region Box update
Box.prototype.backendUpdate=function (data) {
    $.post("/box/update/"+ this.boxNum +"/",{data:JSON.stringify(data)} ).done(function (data) {
        console.log(data);
    });
}
Box.prototype.boxObjUpdate=function(data){
    this.boxObj["position"]=this.getPosition();
    this.boxObj["size"]=this.getSize();
    this.boxObj["boxName"]=this.boxName;
    //this.boxObj["bid"]=this.boxNum
    var bhtml="";
    childrens=this.midcontent.children;
    cl=childrens.length;
    for(var i=1;i<cl;i++){
        bhtml+=childrens[i].innerHTML;
    }
    this.boxObj["boxhtml"]=bhtml;
    if(data){
        this.boxObj["data"]=data;
    }
}
//#endregion
//#region Box input output
Box.prototype.input=function(data){
    if(this.check(data)){

    }
}
Box.prototype.output=function(data){

}
Box.prototype.check=function(data){

}
//#endregion

//#region Box static
Box.prototype.newBox=function(boxtype,data){
    $.get("/box/templates",{boxtype:boxtype, data:JSON.stringify(data||{}),width:document.body.clientWidth,height:document.body.clientHeight}).done(
        function(bdata) {
            var boxobj=bdata;
            var nbName=boxobj["boxName"];
            new Box(nbName,boxTemplate.cloneNode(true),boxobj).init(container,boxLists,dragger);
        }
    );
}
//#endregion

//#region Messager
function Messager() {

}
Messager.prototype.mobj2JSON=function (mobj) {
    return JSON.stringify(mobj);
}
Messager.prototype.JSON2mobj=function (mjson) {
    return JSON.parse(mjson);
}
Messager.prototype.mobj2HTML=function (mobj,maxWidth) {
    var box=document.createElement("div");
    box.className="messagebox";
    var msg=document.createElement("div");
    msg.className="message";
    mobj["type"]==0?msg.classList.add("leftside"):msg.classList.add("rightside");
    box.appendChild(msg);
    var l=mobj["content"].length;
    for(t=0;t<l;t++){
        var temp=mobj["content"][t];
        switch (temp["type"]) {
            case "t": //文字
                msg.innerHTML+=temp["value"].replace("\n","<br>") +"<br>";
                break;
            case "tf"://文本文件
                var ttemp=document.createElement("div");
                ttemp.className="textfile";
                var reader = new FileReader();
                var file=temp["file"];
                reader.readAsText(file,"gb2312");
                reader.onload=function () {
                    ttemp.innerText=reader.result;
                }
                msg.appendChild(ttemp);
                break;
            case "img": //图片
                var itemp=document.createElement("img");
                /*
                itemp.onload=function () {
                    var w=itemp.width;
                    var h=itemp.height;
                    if(w>maxWidth){
                        itemp.width=maxWidth;
                        itemp.height=h*maxWidth/w;
                    }else{
                        itemp.width=w;
                        itemp.height=h;
                    }
                }*/
                itemp.src=temp["value"];
                msg.appendChild(itemp);
                break;
            case "video":
                var vtemp=document.createElement("video");
                var stemp=document.createElement("source");
                var atemp=document.createElement("a");
                vtemp.controls="controls";
                stemp.src=temp["value"];
                stemp.type=temp["vtype"];
                vtemp.appendChild(stemp);
                atemp.href=temp["value"];
                atemp.target="_blank";
                atemp.innerHTML="啊呀，视频格式不支持>_<";
                vtemp.appendChild(atemp);
                msg.appendChild(vtemp);
                break;
            case "audio":
                var atemp;
                if(temp["atype"]=="audio/mid"){
                    atemp=document.createElement("embed");
                    atemp.src=temp["value"];
                    atemp.width=20;
                    atemp.height=20;
                    msg.appendChild(atemp);
                }else{
                    atemp=document.createElement("audio");
                    atemp.controls="controls";
                    var stemp=document.createElement("source");
                    var ltemp=document.createElement("a");
                    stemp.src=temp["value"];
                    stemp.type=temp["atype"];
                    atemp.appendChild(stemp);
                    ltemp.href=temp["value"];
                    ltemp.target="_blank";
                    ltemp.innerHTML="啊呀，音频格式不支持>_<";
                    atemp.appendChild(ltemp);
                    msg.appendChild(atemp);
                }
                break;
            case "link":
                var ltemp=document.createElement("div");
                ltemp.className="linker";
                var atemp=document.createElement("a");
                atemp.href=temp["value"];
                atemp.target="_blank";
                atemp.innerHTML="·";
                ltemp.appendChild(atemp);
                msg.appendChild(ltemp);
                break;
            default:
                break;
        }
    }
    return box;
}
Messager.prototype.Node2mobj=function (node,type) {
    //console.log(node.nodeName);
    var mobj={"type":type,"content":[]};
    switch (node.nodeName) {
        case "#text":
            mobj.content.push({"type":"t","value":node.textContent});
            break;
        case "IMG": //图片
            mobj.content.push({"type":"img","value":node.src});
            break;
        case "A":
            mobj.content.push({"type":"link","value":node.href});
        default:
            break;
    }
    return mobj;
}
Messager.prototype.file2msg=function (file) {
    //console.log(file);
    var ft=file["type"];
    if(ft.startsWith("image")){
        return {"type":"img","value":URL.createObjectURL(file)};
    }else if(ft.startsWith("text")){
        return {"type":"tf","value":"","file":file};
    }else if(ft.startsWith("video")){
        return {"type":"video","value":URL.createObjectURL(file),"vtype":ft};
    }else if(ft.startsWith("audio")){
        return {"type":"audio","value":URL.createObjectURL(file),"atype":ft};
    }
}
Messager.prototype.textobj=function (text,type) {
    var mobj={"type":type,"content":[]};
    mobj.content.push({"type":"t","value":text});
    return mobj;
}
Messager.prototype.linkobj=function(link,type){
    var mobj={"type":type,"content":[]};
    mobj.content.push({"type":"link","value":link});
    return mobj;
}
Messager.prototype.addPS=function (text,p,s) {
    var result="";
    if(text.startsWith("|")){
        result+=text.substring(1);
    }else{
        result+=p+text;
    }
    if(!text.endsWith("|")){
        result+=s;
    }else{
        result=result.substring(0,result.length-1);
    }
    return result;
}
Messager.prototype.getWsMsg=function (type,msg) {
    var wsmsg={wsMsgType:type,wsMsg:msg};
    return wsmsg
}
//#endregion

//#region Commander
function CommandOption(names,hasValue) {
    if(typeof names=="string"){
        names=[names];
    }
    this.names=names;
    this.hasValue=hasValue||0;
}
CommandOption.prototype.isLongOrShort=function () {
    var hasShort=false;
    var hasLong=false;
    var nl=this.names.length;
    for(var i=0;i<nl;i++){
        var per=this.names[i].slice(0,2);
        if(per=="--"){
            hasLong=true;
        }else if(per.startsWith("-")){
            hasShort=true;
        }
        if(hasLong && hasShort){
            return 2;
        }
    }
    if(hasShort){
        return 0;
    }else if(hasLong){
        return 1;
    }else{
        throw new Error(this.names.join("/") + "是无效的opt");
    }
}
CommandOption.prototype.isMatch=function (t) {
    var nl=this.names.length;
    for(var i=0;i<nl;i++){
        if(t.startsWith(this.names[i])){
            return true;
        }
    }
    return false;
}


function Commander(){
    this.command={};
    this.shortspecial=[];
    this.longspecial=[];
    this.cons=[];
}
Commander.prototype.commandPrefix=[".","。","-","!","！","/"];
Commander.prototype.isCommand=function(t){
    return Commander.prototype.commandPrefix.includes(t.trim()[0]);
}
Commander.prototype.addSpecial=function (option) {
    var sl=option.isLongOrShort();
    if(sl==0){
        this.shortspecial.push(option);
    }else if(sl==1){
        this.longspecial.push(option);
    }else if(sl==2){
        this.shortspecial.push(option);
        this.longspecial.push(option);
    }
}
Commander.prototype.setSpecial=function (s) {
    s=s||[];
    var sl=s.length;
    for(var i=0;i<sl;i++){
        this.addSpecial(s[i]);
    }
}
Commander.prototype.hasSpecial=function () {
    return this.shortspecial.length!=0 || this.longspecial.length!=0
}
Commander.prototype.opt=function (names,hasValue) {
    var option=new CommandOption(names,hasValue);
    this.addSpecial(option);
    return this;
} 
Commander.prototype.getCommand=function (t) {
    if(t==""){
        return false;
    }
    var r=this.isCommand(t);
    if(r){
        this.cons=t.trim().split(" ");
        this.command["type"]=this.cons[0][0];
        this.command["command"]=this.cons[0].slice(1);
        if(this.command["command"]==""){
            return false;
        }
    }
    return r;
}
Commander.prototype.parse=function (s) {
    this.setSpecial(s||[]);
    this.command["params"]=[];
    var con=this.cons.slice(1);
    if(!this.hasSpecial()){
        this.command["params"]=con;
        return;
    }
    while( con.length!=0 ){
        if(!con[0].startsWith("-")){
            this.command["params"].push(con[0]);
            con=con.slice(1);
        }else{
            var matched=false;
            if(con[0].startsWith("--")){
                lsl=this.longspecial.length;
                for(var i=0;i<lsl;i++){
                    var ls=this.longspecial[i];
                    if(ls.isMatch(con[0])){
                        matched=true;
                        var opt=con[0].slice(2);
                        con=con.slice(1);
                        if(ls.hasValue>0){
                            this.command[opt]=[];
                            while(con.length!=0 && !con[0].startsWith("-")){
                                this.command[opt].push(con[0]);
                                con=con.slice(1);
                            }
                            if(ls.hasValue==2 && this.command[opt].length==0){
                                this.command[opt]=true;
                            }
                        }
                        else{
                            this.command[opt]=true;
                        }
                    }
                }
            }else{
                ssl=this.shortspecial.length;
                for(var i=0;i<ssl;i++){
                    var ss=this.shortspecial[i];
                    if(ss.isMatch(con[0])){
                        matched=true;
                        var opt=con[0].slice(1);
                        con=con.slice(1);
                        if(ss.hasValue==0 || con.length==0 || (ss.hasValue==2 && con[0].startsWith("-"))){
                            this.command[opt]=true;
                        }else{
                            this.command[opt]=con[0];
                            con=con.slice(1);
                        }
                    }
                }
            }
            if(!matched){
                this.command["params"].push(con[0]);
                con=con.slice(1);
            }
        }
    }
}
//#endregion

function systemCommand (cmder) {
    var handled=true;
    switch(cmder.command["command"]){
        case "login":
            Box.prototype.newBox("login",{});
            break;
        case "refresh":
            location.href=location.href;
            break;
        case "alert":
            cmder.parse()
            alert(cmder.command["params"].join(" "));
            break;
        case "save":
            var name=cmder.command["params"].join(" ");
            if(name===""){
                name="latest";
            }
            var allBoxObj=JSON.stringify( boxLists.getAllBoxObj() );
            break;
        case "wait":

        default:
            handled=false;
            break;
    }
    return handled;
}

/*
function Rect(left,top,width,height) {
    this.l=left;
    this.t=top;
    this.w=width;
    this.h=height;
    Object.defineProperty(Rect,"size",{
       get:function(){
           return this.w*this.h;
       } 
    });
    this.resize=function(l,t,w,h){
        this.l=l;
        this.t=t;
        this.w=w;
        this.h=h;
    };
}
*/