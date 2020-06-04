from googletrans import Translator

class gTranslator():

    def __init__(self):
        self.translator = Translator(service_urls=['translate.google.cn'])

    lan = {
    'af': "南非荷兰语",#'afrikaans',
    'sq': "阿尔巴尼亚语",#'albanian',
    'am': "阿姆哈拉语",#'amharic',
    'ar': "阿拉伯语",#'arabic',
    'hy': "亚美尼亚语",#'armenian',
    'az': "阿塞拜疆语",#'azerbaijani',
    'eu': "巴斯克语",#'basque',
    'be': "白俄罗斯语",#'belarusian',
    'bn': "孟加拉语",#'bengali',
    'bs': "波斯尼亚语",#'bosnian',
    'bg': "保加利亚语",#'bulgarian',
    'ca': "加泰罗尼亚语",#'catalan',
    'ceb': "宿务语",#'cebuano',
    'ny': "齐切瓦语",#'chichewa',
    'zh-CN': "简体中文",#'chinese (simplified)',
    'zh-TW': "繁体中文",#'chinese (traditional)',
    'zh-cn': "简体中文",#'chinese (simplified)',
    'zh-tw': "繁体中文",#'chinese (traditional)',
    'co': "科西嘉语",#'corsican',
    'hr': "克罗地亚语",#'croatian',
    'cs': "捷克语",#'czech',
    'da': "丹麦语",#'danish',
    'nl': "荷兰语",#'dutch',
    'en': "英语",#'english',
    'eo': "世界语",#'esperanto',
    'et': "爱沙尼亚语",#'estonian',
    'tl': "塔加路语",#'filipino',
    'fi': "芬兰语",#'finnish',
    'fr': "法语",#'french',
    'fy': "弗里斯兰语",#'frisian',
    'gl': "加利西亚语",#'galician',
    'ka': "格鲁吉亚语",#'georgian',
    'de': "德语",#'german',
    'el': "希腊语",#'greek',
    'gu': "古吉拉特语",#'gujarati',
    'ht': "海地克里奥尔语",#'haitian creole',
    'ha': "豪萨语",#'hausa',
    'haw': "夏威夷语",#'hawaiian',
    'iw': "希伯来语",#'hebrew',
    'hi': "印地语",#'hindi',
    'hmn': "苗语",#'hmong',
    'hu': "匈牙利语",#'hungarian',
    'is': "冰岛语",#'icelandic',
    'ig': "伊博语",#'igbo',
    'id': "印度尼西亚语",#'indonesian',
    'ga': "爱尔兰语",#'irish',
    'it': "意大利语",#'italian',
    'ja': "日语",#'japanese',
    'jw': "爪哇语",#'javanese',
    'kn': "卡纳达语",#'kannada',
    'kk': "哈萨克语",#'kazakh',
    'km': "高棉语",#'khmer',
    'ko': "韩语",#'korean',
    'ku': "库尔德语",#'kurdish (kurmanji)',
    'ky': "吉尔吉斯语",#'kyrgyz',
    'lo': "老挝语",#'lao',
    'la': "拉丁语",#'latin',
    'lv': "拉脱维亚语",#'latvian',
    'lt': "立陶宛语",#'lithuanian',
    'lb': "卢森堡语",#'luxembourgish',
    'mk': "马其顿语",#'macedonian',
    'mg': "马尔加什语",#'malagasy',
    'ms': "马来语",#'malay',
    'ml': "马拉雅拉姆语",#'malayalam',
    'mt': "马耳他语",#'maltese',
    'mi': "毛利语",#'maori',
    'mr': "马拉语",#'marathi',
    'mn': "蒙语",#'mongolian',
    'my': "缅甸语",#'myanmar (burmese)',
    'ne': "尼泊尔语",#'nepali',
    'no': "挪威语",#'norwegian',
    'ps': "普什图语",#'pashto',
    'fa': "波斯语",#'persian',
    'pl': "波兰语",#'polish',
    'pt': "葡萄牙语",#'portuguese',
    'pa': "旁遮普语",#'punjabi',
    'ro': "罗马尼亚语",#'romanian',
    'ru': "俄语",#'russian',
    'sm': "萨摩亚语",#'samoan',
    'gd': "苏格兰盖尔语",#'scots gaelic',
    'sr': "塞尔维亚语",#'serbian',
    'st': "塞索托语",#'sesotho',
    'sn': "绍纳语",#'shona',
    'sd': "信德语",#'sindhi',
    'si': "僧伽罗语",#'sinhala',
    'sk': "斯洛伐克语",#'slovak',
    'sl': "斯洛文尼亚语",#'slovenian',
    'so': "索马里语",#'somali',
    'es': "西班牙语",#'spanish',
    'su': "巽他语",#'sundanese',
    'sw': "斯瓦希里语",#'swahili',
    'sv': "瑞典语",#'swedish',
    'tg': "塔吉克语",#'tajik',
    'ta': "泰米尔语",#'tamil',
    'te': "泰卢固语",#'telugu',
    'th': "泰语",#'thai',
    'tr': "土耳其语",#'turkish',
    'uk': "乌克兰语",#'ukrainian',
    'ur': "乌尔都语",#'urdu',
    'uz': "乌兹别克语",#'uzbek',
    'vi': "越南语",#'vietnamese',
    'cy': "威尔士语",#'welsh',
    'xh': "科萨语",#'xhosa',
    'yi': "意第绪语",#'yiddish',
    'yo': "约鲁巴语",#'yoruba',
    'zu': "祖鲁语",#'zulu',
    'fil': "菲律宾语",#'Filipino',
    'he': "希伯来语",#'Hebrew'
    'auto':"未知语言"
    }
    def cnchange(self,code):
        code=code.lower()
        if code=="cn" or code=="zh":
            return "zh-CN"
        elif code=="tw":
            return "zh-TW"
        return code

    def dresult(self,d):
        result="是讲水星文的friends呢~\n我非、非常确定哦！"
        if not d is None:
            ptg=d.confidence*100
            if ptg!=0:
                dr=self.lan[d.lang]
                result="是讲%s的friends呢~\n我有%.1f%%的自信确定哦！"%(dr,ptg)
        return result

    def detectlan(self,text):
        d=None
        try:
            d=self.translator.detect(text)
        except:
            pass
        return d
    def detectonly(self,text):
        d=self.detectlan(text)
        dr=self.dresult(d)
        return [dr]


    def trans(self,text,fromlan="auto",tolan="en",poun=False,detect=False):
        result=[]
        rt=None
        fromlan=self.cnchange(fromlan)
        tolan=self.cnchange(tolan)
        if detect:
            d=self.detectlan(text)
            dr=self.dresult(d)
            result.append(dr)
            if fromlan=="auto" and not d is None:
                fromlan=d.lang
        
        try:
            rt=self.translator.translate(text,dest=tolan,src=fromlan)
        except:
            pass
        if not rt is None:
            fromlan=rt.src
            result.append("尝试从 %s 翻译为 %s..."%(self.lan[fromlan],self.lan[tolan]))
            result.append(rt.text)
            #print(rt.extra_data)
            if poun:
                result.append("发音：%s"%(rt.pronunciation))
        else:
            result.append("尝试从 %s 翻译为 %s..."%(self.lan[fromlan],self.lan[tolan]))
            result.append("结果什么都没翻译出来嘛！")
        return result

if __name__=="__main__":
    a=gTranslator()
    #print(a.detectlan("我很高兴"))
    #print(a.dresult(a.detectlan("Nice to meet you...")))
    #print(a.detectlan("おはようございます!"))
    #print(a.trans("おはようございます!"))
    #print(a.trans("ありがとうございます!",poun=True))
    #print(a.trans("お疲れ様です!",fromlan="cn",poun=True,detect=True))
 
#print(a.FindCardByName(text))
