"""
    包含了框在后端的类
"""

class Box():
    """
        框在后端的类
    """
    def __init__(self):
        self.id=0
        self.name=""
        self.type=""
        self.size=[0,0]
        self.position=[0,0]

    def initFromRequestData(self,rdata):
        try:
            self.id=rdata["id"]
            self.name=rdata["name"]
            self.boxtype=rdata["boxtype"]
            self.size=rdata.get("size",(1200,675))
            self.position=rdata.get("position",(360,13))
            return self
        except:
            return None
