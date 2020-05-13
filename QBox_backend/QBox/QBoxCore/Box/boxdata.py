
def updateByDefault(boxtype,data):
    if boxtype=="login":
        boxtype="webpagebox"
        data.setdefault("src","/accounts/login/")
        data.setdefault("boxName","登录框")
    return boxtype,data