
class quser():

    def __init__(self):
        self.screenSize=(0,0)
        self.boxes={}

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