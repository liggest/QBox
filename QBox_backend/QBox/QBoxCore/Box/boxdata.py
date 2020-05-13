
def updateByDefault(boxtype,data):
    if boxtype=="login":
        boxtype="webpagebox"
        data.setdefault("src","/accounts/login/")
        data.setdefault("boxName","登录框")
        data.setdefault("size",(570,330))
    return boxtype,data