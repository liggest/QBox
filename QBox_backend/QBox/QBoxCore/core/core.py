from ..quser import quser
from . import util


class core():
    def __init__(self):
        self.qusers={}

    def __str__(self):
        return "\n".join( map(str,self.qusers.values()) )

    __repr__=__str__

    def createUser(self,uid):
        qu=quser.quser()
        qu.uid=uid
        self.qusers[uid]=qu
        return self.qusers[uid]
        
    def deleteUser(self,request):
        uid=util.getUserKey(request)
        if self.getUserFromID(uid):
            del self.qusers[uid]
            return True
        else:
            return False

    def getUser(self,request,isScope=False):
        uid=util.getUserKey(request,isScope)
        qu=self.getUserFromID(uid)
        if qu:
            return qu
        else:
            return self.createUser(uid)
    
    def getUserFromID(self,uid):
        return self.qusers.get(uid,None)

    def transferUser(self,uid,request):
        user=self.getUserFromID(uid)
        if not user:
            return False
        newid=util.getUserKey(request)
        if self.getUserFromID(newid):
            del self.qusers[newid]
        self.qusers[newid]=user
        user.uid=newid
        del self.qusers[uid]
        return True



        