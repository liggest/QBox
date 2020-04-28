from ..quser import quser
from . import util


class core():
    def __init__(self):
        self.qusers={}

    def createUser(self,uid):
        self.qusers[uid]=quser.quser()
        return self.qusers[uid]
        
    def deleteUser(self,request):
        uid=util.getUserKey(request)
        if self.getUserFromID(uid):
            del self.qusers[uid]
            return True
        else:
            return False

    def getUser(self,request):
        uid=util.getUserKey(request)
        qu=self.getUserFromID(uid)
        if qu:
            return qu
        else:
            return self.createUser(uid)
    
    def getUserFromID(self,uid):
        return self.qusers.get(uid,None)
        