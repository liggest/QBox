#coding:utf-8

class Option():
    """
        定义指令中的命令参数
    """
    def __init__(self,names,hasValue=0):
        """
            names 字符串/列表/元组 形如["-a","-A","--aAa"]\n
            hasValue 整数 0为不需要值 1为需要值 2为尽可能有值
        """
        if isinstance(names,str):
            names=[names]
        self.names=names
        self.hasValue=hasValue

    def __str__(self):
        return "/".join(self.names)

    __repr__=__str__

    def isLongOrShort(self):
        """
            返回整数 0为短 1为长 2为短或长
        """
        hasShort=False
        hasLong=False
        for n in self.names:
            per=n[:2]
            if per=="--":
                hasLong=True
            elif per.startswith("-"):
                hasShort=True
            if hasLong and hasShort:
                return 2
        if hasShort:
            return 0
        elif hasLong:
            return 1
        else:
            raise Exception("%s是无效的opt"%str(self))
    
    def isMatch(self,t):
        for n in self.names:
            if t.startswith(n):
                return True
        return False

class CommandParser():
    '''
        用来处理一行指令\n
        例: .command param1 param2 -shortopt1 -shortopt2 short2 --longopt long1 long2 long3
    '''
    #text=""
    #command={}
    commandPrefix=[".","。","-","!","！","/"]
    #special=[]
    #cons=[]
    def __init__(self):
        self.command={}
        self.shortspecial=[]
        self.longspecial=[]
        #self.special=[]
        self.cons=[]

    def __getitem__(self,key):
        return self.command.get(key,None)

    def isCommand(self,t):
        temp=t.lstrip()
        return temp[0] in CommandParser.commandPrefix

    def addSpecial(self,option):
        sl=option.isLongOrShort()
        if sl==0:
            self.shortspecial.append(option)
        elif sl==1:
            self.longspecial.append(option)
        elif sl==2:
            self.shortspecial.append(option)
            self.longspecial.append(option)

    def setSpecial(self,s):
        for option in s:
            self.addSpecial(option)
        #self.special=s

    def hasSpecial(self):
        return len(self.shortspecial)!=0 or len(self.longspecial)!=0

    def opt(self,names,hasValue=0):
        option=Option(names,hasValue)
        self.addSpecial(option)
        return self

    def getCommand(self,t):
        if t=="":
            return False
        r=self.isCommand(t)
        if r:
            self.cons=t.strip().split()
            self.command["type"]=self.cons[0][0]
            self.command["command"]=self.cons[0][1:]
            if self.command["command"]=="":
                return False
        return r
    
    def separateCommand(self,cmd):
        if self.command["command"].startswith(cmd):
            return self.command["command"][len(cmd):]
        return None
        
    def parse(self,s=()):
        self.setSpecial(s)
        self.command["params"]=[]
        con=self.cons[1:]
        if not self.hasSpecial():
            self.command["params"]=con
            return
        while len(con)!=0:
            if not con[0].startswith("-"):
                self.command["params"].append(con[0])
                con=con[1:]
            else:
                matched=False
                if con[0].startswith("--"):
                    for ls in self.longspecial:
                        if ls.isMatch(con[0]):
                            matched=True
                            opt=con[0].lstrip("-")
                            con=con[1:]
                            if ls.hasValue>0:
                                self.command[opt]=[]
                                while len(con)!=0 and not con[0].startswith("-"):
                                    self.command[opt].append(con[0])
                                    con=con[1:]
                                if ls.hasValue==2 and len(self.command[opt])==0:
                                    self.command[opt]=True
                            else:
                                self.command[opt]=True
                else:
                    for ss in self.shortspecial:
                        if ss.isMatch(con[0]):
                            matched=True
                            opt=con[0].lstrip("-")
                            con=con[1:]
                            if ss.hasValue==0 or len(con)==0 or (ss.hasValue==2 and con[0].startswith("-") ):
                                self.command[opt]=True
                            else:
                                self.command[opt]=con[0]
                                con=con[1:]
                if not matched:
                    self.command["params"].append(con[0])
                    con=con[1:]
        '''
        flag=self.hasSpecial()
        isSpecial=False
        isLongSp=None
        for x in range(len(con)):
            if con[x][0]=="-" and flag and con[x].lstrip("-") in self.special:
                isLongSp=None
                if con[x].startswith("--"):
                    isLongSp=con[x].lstrip("-")
                    self.command[isLongSp]=[]
                elif x+1<len(con):
                    if con[x+1][0]=="-" and con[x+1].lstrip("-") in self.special:
                        self.command[con[x].lstrip("-")]=True
                    else:
                        self.command[con[x].lstrip("-")]=con[x+1]
                        isSpecial=True
                else:
                    self.command[con[x].lstrip("-")]=True
            elif isLongSp!=None:
                self.command[isLongSp].append(con[x])
            elif not isSpecial:
                self.command["params"].append(con[x])
            else:
                isSpecial=False
        '''


    def tryParse(self,t,s=()):
        r=self.getCommand(t)
        if r:
            self.parse(s)
        return r

    def getByType(self,attr,default=None,t=str):
        r=self.command.get(attr,default)
        if isinstance(r,t):
            return r
        return default
    
    def refresh(self):
        self.__init__()

if __name__=="__main__":
    cp=CommandParser()
    cmd="！login 1313123 -a -z -s 888 --c 12 13 -x"
    if cp.getCommand(cmd):
        print(cp.separateCommand("lo"))
        print(cp.separateCommand("logi"))
        cp.opt(["-z","-a"],2).opt("--c",1).parse()
        print(cp.command)
    else:
        print("不是命令")
            
            
        
        
