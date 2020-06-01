import copy

def getWsMessage(wsMsg,wsMsgType="msg"):
    '''
        默认，WsMessage是msg类型的
    '''
    return {"wsMsgType":wsMsgType,"wsMsg":wsMsg} 

def getMsgContent(value,contentType="t"):
    '''
        默认，content是文本类型的
    '''
    return {"type":contentType,"value":value}

def getMsg(contents=(),sender=0):
    '''
        默认，sender是0，代表框向用户发的消息
    '''
    return {"type":sender,"content":contents}

def getTextContent(text):
    '''
        得到文本类型的content
    '''
    return (getMsgContent(text), )

def getTextFromMobj(mobj):
    '''
        得到mobj里的所有文本
    '''
    result=""
    for con in mobj["content"]:
        if con["type"]=="t":
            result+=con["value"]+" "
    return result.strip()