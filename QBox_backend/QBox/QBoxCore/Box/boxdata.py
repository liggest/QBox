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

#没有测试，写的很麻烦。。。
'''
def GetNewBoxPosition(screensize,boxposition,boxsize,newboxesize):
    exist = []
    for i in range(len(boxposition)):
        tempx = boxposition[i][0] + boxsize[i][0]
        tempy = boxposition[i][1] + boxsize[i][1]
        exist.append([boxposition[i][0],tempx,boxposition[i][1],tempy])
    sw = screensize[0]
    sh = screensize[1]
    countx = 0
    county = 0
    temp = []
    for i in range(len(boxposition)):
        while countx < sw and county < sh:
            if countx < exist[i][0] and county < exist[i][2]:
                if countx + newboxesize[0] < exist[i][0] and county + newboxesize[1] < exist[i][2]:
                    temp.append([countx,county])
                else:
                    countx = exist[i][1] + 50
            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county < exist[i][2]):
                if county + newboxesize[1] < exist[i][2]:
                    temp.append(countx,county)
                else:
                    countx = exist[i][1] + 50
            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county >= exist[i][2] and county <= exist[i][3]):
                countx = exist[i][1] + 50
            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county > exist[i][3]):
                temp.append([countx,county])         
            elif (countx < exist[i][0]) and (county >= exist[i][2] and county < exist[i][3]):
                if countx + newboxesize[0] < exist[i][0]:
                    temp.append([county,county])
                else:
                    county = exist[i][3] + 50
            elif (countx > exist[i][1]) and (county >= exist[i][2] and county < exist[i][3]):
                temp.append([countx,county])
            elif countx > exist[i][1] and county > exist[i][3]:
                temp.append([countx,county])
    for i in range(len(temp)):
        for j in range(len(exist)):
            if (temp[i][0] + newboxesize[0] < exist[j][0] and temp[i][1] + newboxesize[1] < exist[j][2]) or (temp[i][0] > exist[j][1] and temp[i][1] > exist[j][3]):
                continue
            else:
                temp[i] = [None,None]
    for i in range(len(temp)):
        if temp[i][0] != None:
            x = temp[i][0]
            y = temp[i][1]
            break
    return x,y
    '''        