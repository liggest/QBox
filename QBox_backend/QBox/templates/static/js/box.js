var offsets={"absolute":{"moveOffsetX":0,"moveOffsetY":0},"":{"moveOffsetX":0,"moveOffsetY":0}};
const moveOffsetX=8;//尝试解决切换resize模式时意外偏移问题
const moveOffsetY=8;
const longPressInterval=700;

var messager=new Messager();

function getBoxNum(){
    var x=-1;
    return (function(){
        x+=1;
        return x;
    })();
}

function Box(name,content,boxobj) {
    //#region init
    this.boxNum=getBoxNum();
    this.boxName=name;
    this.content=content;
    this.boxObj=boxobj;
    this.frontcontent=this.content.firstElementChild.firstElementChild;
    this.midcontent=this.content.getElementsByClassName("midbox")[0];
    this.backcontent=this.content.firstElementChild.lastElementChild;
    this.title=this.midcontent.firstElementChild;
    this.title.innerText=this.boxName;
    this.dragger=undefined;
    this.boxList=[];
    var box=this;
    this.init=function (container,boxLists,dragger) {
        boxLists.push(this);
        this.content.style.position="absolute";
        if(this.boxObj["position"]){
            var p=this.boxObj["position"];
            this.setLeftTop(p[0],p[1]);
        }
        if(this.boxObj["size"]){
            var size=this.boxObj["size"];
            this.resize(size[0],size[1]);
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
    this.initByBoxData=function(boxobj){
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
            this.sendMsg(mobj);
            var firstM=mobj["content"][0];
            if(firstM["type"]=="t"){
                var raw=firstM["value"];
                var result=messager.addPS(raw,this.prefix,this.suffix);
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
        this.nextBoxes.findBoxByName=function (name) {
            var l=this.length;
            for(var i=0;i<l;i++){
                if(this[i].boxName==name){
                    return this[i];
                }
            }
            return undefined;
        }
        this.nextBoxes.findBoxIdxByName=function (name) {
            var l=this.length;
            for(var i=0;i<l;i++){
                if(this[i].boxName==name){
                    return i;
                }
            }
            return -1;
        }
        this.nextBoxes.removeAt=function (idx) {
            return this.slice(0,idx).concat(this.slice(idx+1));
        }
        this.prefix="";
        this.suffix="";
        this.analyze=function (text) {
            var mobj;
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
                    new Box(nbName,boxTemplate.cloneNode(true)).init(container,boxLists,dragger);
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
                    box.nextBoxes=box.nextBoxes.removeAt(nbi);
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
            /*
            else if(text=="云端留言板"){
                $.get("/box/templates",{boxtype:"cloudmsg"}).done(
                    function(data) {
                        var boxobj=data
                        new Box("云端留言板",boxTemplate.cloneNode(true),boxobj).init(container,boxLists,dragger);
                    }
                );
            }*/
            else{
                /*
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
                xhr.send(messager.mobj2JSON(mobj));*/
            }
        }
        this.refresh=function () {
            this.chat.innerHTML="";
            this.prefix="";
            this.suffix="";
            this.nextBoxes.splice(0,this.nextBoxes.length);
        }
        //#endregion
        //#region webconnection
        this.websocket=undefined;
        this.backendinit=function (params) {
            
        }
        //#endregion
    }

    this.getInnerBox=function(boxobj){
        this.midcontent.innerHTML+=boxobj["boxhtml"];
        this.initByBoxData(boxobj);
    }
    this.getInnerBox(boxobj);

    //#endregion
    //#region resize
    this.move=function (x,y) {
        var l=this.content.style.left;
        var t=this.content.style.top;
        l=l==""?0:Number(l.slice(0,-2));
        t=t==""?0:Number(t.slice(0,-2));
        this.content.style.left=l+x+"px";
        this.content.style.top=t+y+"px";
    }
    this.setLeftTop =function(x,y){
        this.content.style.left=x+"px";
        this.content.style.top=y+"px";
    }
    this.resize=function (w,h) {
        this.content.style.width=w+"px";
        this.content.style.height=h+"px";
    }
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
            var w=box.content.style.width;
            var h=box.content.style.height;
            w=w.endsWith("px")?Number(w.slice(0,-2)):box.content.offsetWidth;
            h=h.endsWith("px")?Number(h.slice(0,-2)):box.content.offsetHeight;
            box.content.style.width=w+dragger.deltaX+"px";
            box.content.style.height=h+dragger.deltaY+"px";
        }
    }
    this.resizeLeftDown=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var w=box.content.style.width;
            var h=box.content.style.height;
            var l=box.content.style.left;
            w=w.endsWith("px")?Number(w.slice(0,-2)):box.content.offsetWidth;
            h=h.endsWith("px")?Number(h.slice(0,-2)):box.content.offsetHeight;
            l=l==""?0:Number(l.slice(0,-2));
            box.content.style.width=w-dragger.deltaX+"px";
            box.content.style.height=h+dragger.deltaY+"px";
            box.content.style.left=l+dragger.deltaX+"px";
        }
    }
    this.resizeLeftUp=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var w=box.content.style.width;
            var h=box.content.style.height;
            var l=box.content.style.left;
            var t=box.content.style.top;
            w=w.endsWith("px")?Number(w.slice(0,-2)):box.content.offsetWidth;
            h=h.endsWith("px")?Number(h.slice(0,-2)):box.content.offsetHeight;
            l=l==""?0:Number(l.slice(0,-2));
            t=t==""?0:Number(t.slice(0,-2));
            box.content.style.width=w-dragger.deltaX+"px";
            box.content.style.height=h-dragger.deltaY+"px";
            box.content.style.left=l+dragger.deltaX+"px";
            box.content.style.top=t+dragger.deltaY+"px";
        }
    }
    this.resizeRightUp=function (event) {
        var dragger=box.dragger;
        if(dragger.isOnDrag){
            var w=box.content.style.width;
            var h=box.content.style.height;
            var t=box.content.style.top;
            w=w.endsWith("px")?Number(w.slice(0,-2)):box.content.offsetWidth;
            h=h.endsWith("px")?Number(h.slice(0,-2)):box.content.offsetHeight;
            t=t==""?0:Number(t.slice(0,-2));
            box.content.style.width=w+dragger.deltaX+"px";
            box.content.style.height=h-dragger.deltaY+"px";
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
    this.midcontent.addEventListener("dblclick",this.dbClick);
    this.backcontent.addEventListener("dblclick",this.dbClick);
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
    this.longPress=function () {
        if(!this.resizeMode){
            this.resizeBegin();
        }
    }
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


    //#region others
    this.selfDestroy=function () {
        var idx=this.boxList.findBoxIdxByName(this.boxName);
        this.boxList=this.boxList.removeAt(idx);
        if(this.resizeMode){
            this.resizeEnd();
        }
        this.content.classList.add("transparent");
        setTimeout(function () {
            box.content.parentElement.removeChild(box.content)
        },1200);
    }
    //#endregion
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


function Messager() {
    this.mobj2JSON=function (mobj) {
        return JSON.stringify(mobj);
    }
    this.JSON2mobj=function (mjson) {
        return JSON.parse(mjson);
    }
    this.mobj2HTML=function (mobj,maxWidth) {
        var box=document.createElement("div");
        box.className="messagebox";
        var msg=document.createElement("div");
        msg.className="message";
        mobj["type"]==0?msg.classList.add("leftside"):msg.classList.add("rightside");
        box.appendChild(msg);
        for(t in mobj["content"]){
            var temp=mobj["content"][t];
            switch (temp["type"]) {
                case "t": //文字
                    msg.innerHTML+=temp["value"]+"<br>";
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
    this.Node2mobj=function (node,type) {
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
    this.file2msg=function (file) {
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

    this.textobj=function (text,type) {
        var mobj={"type":type,"content":[]};
        mobj.content.push({"type":"t","value":text});
        return mobj;
    }
    this.linkobj=function(link,type){
        var mobj={"type":type,"content":[]};
        mobj.content.push({"type":"link","value":link});
        return mobj;
    }
    this.addPS=function (text,p,s) {
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
}