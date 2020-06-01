import pickle

pklpath=r"QBox_backend/QBox/QBoxCore/message/cmdmap.pkl"
placeholder="{}"

if __name__ == "__main__":
    cmdmaps={
        "登录":".user login",
        "注册":".user register",
        "登出":".user logout"
    }

    with open(pklpath,"wb") as f:
        pickle.dump(cmdmaps,f)