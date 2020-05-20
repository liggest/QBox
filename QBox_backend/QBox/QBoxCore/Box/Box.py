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
        self.boxtype=""
        self.size=[0,0]
        self.position=[0,0]

    def __str__(self):
        return "No.%d %s->%s"%(self.id,self.boxtype,self.name)

    __repr__=__str__

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

