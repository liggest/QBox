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

    @staticmethod
    def getBoxFromRequestData(rdata):
        try:
            b=Box()
            b.id=rdata["id"]
            b.name=rdata["name"]
            b.boxtype=rdata["boxtype"]
            b.size=rdata.get("size",(1200,675))
            b.position=rdata.get("position",(360,13))
            return b
        except:
            return None

    def update(self,**kw):
        for k in kw.keys():
            setattr(self,k,kw[k])

