from commandParser import CommandParser

def processCommands(cmds):
    cmds=cmds.split("\n")
    for cmd in cmds:
        cp=CommandParser()
        if cp.getCommand(cmds):
            basicCommand(cp)

def basicCommand(cp:CommandParser):
    cmd=cp.command["command"]
    if cmd=="":
        pass
    elif cmd in ["a","b","c"]:
        pass

def processMessages():
    pass

