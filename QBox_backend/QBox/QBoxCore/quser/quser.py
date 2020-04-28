
class quser():

    def __init__(self):

        self.boxes={}

    def addBox(self,box):
        if box:
            self.boxes[box.id]=box

    def deleteBox(self,bid):
        if self.boxes.get(bid,None):
            del self.boxes[bid]
            return True
        else:
            return False
    
    def getBox(self,bid):
        return self.boxes.get(bid,None)