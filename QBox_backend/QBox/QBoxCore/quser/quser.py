
class quser():

    def __init__(self):
        self.uid=""
        self.screenSize=(0,0)
        self.boxes={}

    def __str__(self):
        return "用户："+self.uid+"\n  "+"\n  ".join(map(str,self.boxes.values()) )
    
    __repr__=__str__

    def addBox(self,box):
        if box:
            self.boxes[str(box.id)]=box
            return True
        return False

    def deleteBox(self,bid):
        bid=str(bid)
        if self.boxes.get(bid,None):
            del self.boxes[bid]
            return True
        else:
            return False
    
    def getBox(self,bid):
        return self.boxes.get(str(bid),None)

    def getChatBox(self,checkws=False):
        for box in self.boxes.values():
            if box.boxtype=="chatbox":
                if checkws:
                    if hasattr(box,"websocket"):
                        return box
                else:
                    return box
        return None