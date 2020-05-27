from types import FunctionType
from ..core.util import btdict
import json


def updateByDefault(boxtype,data):
    if boxtype=="login":
        boxtype="webpagebox"
        data.setdefault("src","/accounts/login/")
        data.setdefault("boxName","登录框")
        data.setdefault("size",(285,340))
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
'''
可能成功了？目前可以返回一个位置。如果没有合适的位置返回(-1，-1)
这里想的是新生成的框可以超出屏幕
如果固定了新框的大小，极有可能无法在屏幕里出现的状况
这里的位置是框的左上角
'''
def getNewBoxPosition(user,newboxesize):
    #screensize,boxposition,boxsize
    #print(user.screenSize)
    screensize=user.screenSize
    exist = []
    for box in user.boxes.values():
        tempx = box.position[0] + box.size[0]
        tempy = box.position[1] + box.size[1]
        exist.append([box.position[0],tempx,box.position[1],tempy])
    #print(exist[-1])
    #for i in range(len(boxposition)):
    #    tempx = boxposition[i][0] + boxsize[i][0]
    #    tempy = boxposition[i][1] + boxsize[i][1]
    #    exist.append([boxposition[i][0],tempx,boxposition[i][1],tempy])
    sw = screensize[0]
    sh = screensize[1]

    temp = []
    #print("exist:",exist)
    #for i in range(len(boxposition)):
    for i in range(len(exist)):
        countx = 0
        county = 0
        while countx <= sw:
            while county <= sh:
                #print("countx",countx,"county",county)
                if countx + newboxesize[0] < exist[i][0] or county + newboxesize[1] < exist[i][2]:
                    temp.append([countx,county])
                    break
                elif countx > exist[i][1] or county > exist[i][3]:
                    temp.append([countx,county]) 
                    break
                else:
                    county = county + 100
            countx = countx + 100
#            if countx < exist[i][0] and county < exist[i][2]:
#                if (countx + newboxesize[0] < exist[i][0] and county + newboxesize[1] < exist[i][2]) \
#                    or (countx + newboxesize[0] < exist[i][0] and county + newboxesize[1] >= exist[i][2]) \
#                        or (countx + newboxesize[0] >= exist[i][0] and county + newboxesize[1] < exist[i][2]):
#                    temp.append([countx,county])
#                    break
#                else:
#                    countx = exist[i][1] + 10
#                    temp.append([countx,county])
#                    break
#            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county < exist[i][2]):
#                if county + newboxesize[1] < exist[i][2]:
#                    temp.append(countx,county)
#                    break
#                else:
#                    countx = exist[i][1] + 10
#                    temp.append([countx,county])
#                    break
#            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county >= exist[i][2] and county <= exist[i][3]):
#                countx = exist[i][1] + 10
#                temp.append([countx,county])
#                break
#            elif (countx >= exist[i][0] and countx <= exist[i][1]) and (county > exist[i][3]):
#                temp.append([countx,county])
#                break         
#            elif (countx < exist[i][0]) and (county >= exist[i][2] and county < exist[i][3]):
#                if countx + newboxesize[0] < exist[i][0]:
#                    temp.append([county,county])
#                    break
#                else:
#                    county = exist[i][3] + 10
#                    temp.append([countx,county])
#                    break  
#            elif countx > exist[i][1] and county > exist[i][3]:
#                temp.append([countx,county])
#                break
#            else:
#                temp.append([countx,county])
#                break

    x = -1
    y = -1
    #print("temp:",temp)
    for i in range(len(temp)):
        for j in range(len(exist)):
            if  ( (temp[i][0] + newboxesize[0] < exist[j][0] and temp[i][1] + newboxesize[1] < exist[j][2]) \
                or (temp[i][0] > exist[j][1] or temp[i][1] > exist[j][3]) \
                    or (temp[i][0] + newboxesize[0] < exist[j][0] and temp[i][1] + newboxesize[1]>= exist[j][2]) \
                        or (temp[i][0] + newboxesize[0] >= exist[j][0] and temp[i][1] + newboxesize[1] < exist[j][2])):
                pass
            else:
                temp[i][0] = -1
                temp[i][1] = -1
    #print("midtemp",temp)
    for i in range(len(temp)):
        if temp[i][0] >= 0 and temp[i][0] < sw and temp[i][1] < sh:
            x = temp[i][0]
            y = temp[i][1]
            break  
    #print(temp)
    return x,y