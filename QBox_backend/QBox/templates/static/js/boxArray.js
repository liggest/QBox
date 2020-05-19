
Array.prototype.findBoxByName=function(name){
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxName==name){
            return this[i];
        }
    }
    return undefined;    
}

Array.prototype.findBoxIdxByName=function (name) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxName==name){
            return i;
        }
    }
    return -1;
}

Array.prototype.findBoxByNum=function (num) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxNum==num){
            return this[i];
        }
    }
    return undefined;
}

Array.prototype.findBoxIdxByNum=function (num) {
    var l=this.length;
    for(var i=0;i<l;i++){
        if(this[i].boxNum==num){
            return i;
        }
    }
    return -1;
}

Array.prototype.removeAt=function (idx) {
    return this.splice(idx,1);
}