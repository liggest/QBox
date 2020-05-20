from types import FunctionType
from ..core.util import btdict


def updateByDefault(boxtype,data):
    if boxtype=="login":
        boxtype="webpagebox"
        data.setdefault("src","/accounts/login/")
        data.setdefault("boxName","登录框")
        data.setdefault("size",(570/2,330))
    return boxtype,data

def isInt(ckdata):
    return isinstance(ckdata,int)

def isStr(ckdata):
    return isinstance(ckdata,str)

def isNotNegativeInt(ckdata):
    return isInt(ckdata) and ckdata>=0

def isNotEmptyStr(ckdata):
    return isStr(ckdata) and ckdata!=""

def isBoxType(ckdata):
    return ckdata in btdict.keys()

def isListOrTuple(ckdata):
    return isinstance(ckdata,list) or isinstance(ckdata,tuple)

def isDict(ckdata):
    return isinstance(ckdata,dict)

def isAll(ckfunc):
    def checkall(ckdata):
        if isListOrTuple(ckdata):
            for x in ckdata:
                if not ckfunc(x):
                    return False
        elif isDict(ckdata):
            for x in ckdata.keys():
                if not ckfunc(ckdata[x]):
                    return False
        else:
            if not ckfunc(ckdata):
                return False
        return True
    return checkall

checkFunc={
    "id":isNotNegativeInt,
    "name":isNotEmptyStr,
    "boxtype":isBoxType,
    "size":isAll(isNotNegativeInt),
    "position":isAll(isNotNegativeInt)
}

def checkData(data,checklist=None):
    if not checklist:
        checklist=checkFunc.keys()
    for ck in checklist:
        ckdata=data.get(ck,None)
        if not ckdata:
            return False
        cf=checkFunc.get(ck,None)
        if not checkDataByFunc(ckdata,cf):
            return False
    return True
        
def checkDataByFunc(ckdata,cf):
    if isinstance(cf,FunctionType):
        return cf(ckdata)
    elif isinstance(cf,list):
        for f in cf:
            if not f(ckdata):
                return False
        return True
    else:
        return False

     