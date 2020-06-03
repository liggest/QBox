import pickle

pklpath=r"QBox_backend/QBox/QBoxCore/message/cmdmap.pkl"
placeholder="{}"

if __name__ == "__main__":
    cmdmaps={
        "登录":".user login",
        "注册":".user register",
        "登出":".user logout",
        "刷新":".refresh -b",
        "保存":".save {}",
        "加载":".load {}",
        "读取":".load {}",
        "警告":".alert {}",
        "新建":".newbox {} {} --data {}",
        "连接":".connect {}",
        "断开":".disconnect {}",
        "发送":".send {}",
        "发"  :".send {}"
    }

    with open(pklpath,"wb") as f:
        pickle.dump(cmdmaps,f)