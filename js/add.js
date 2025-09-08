document.addEventListener('pjax:complete', tonav);
document.addEventListener('DOMContentLoaded', tonav);
//响应pjax
function tonav() {
    var nameContainer = document.querySelector("#nav #name-container");
	var menusItems = document.querySelector("#nav .menus_items");
    var position = $(window).scrollTop();

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll > position + 5) {
            nameContainer.classList.add("visible");
            menusItems.classList.remove("visible");
        } else if  (scroll < position - 5){
            nameContainer.classList.remove("visible");
            menusItems.classList.add("visible");
        }

        position = scroll;
    });

    // 初始化 page-name
    document.getElementById("page-name").innerText = document.title.split(" | Hyingmei's Blog")[0];
}

var marcus = {
  saveData: (e, t) => {
		localStorage.setItem(e, JSON.stringify({
			time: Date.now(),
			data: t
		}))
	},
	loadData: (e, t) => {
		let n = JSON.parse(localStorage.getItem(e));
		if (n) {
			let e = Date.now() - n.time;
			if (-1 < e && e < 6e4 * t) return n.data
		}
		return 0
	},
  runtime: () => {
    var e = function (e) {
      return e > 9 ? e : "0" + e
    };
    let t = new Date("2025/08/19 00:00:00")
      .getTime(),
      n = (new Date)
        .getTime(),
      o = Math.round((n - t) / 1e3),
      l = "本站已运行：";
    o >= 86400 && (l += e(parseInt(o / 86400)) + " 天 ", o %= 86400), o >= 3600 && (l += e(parseInt(o / 3600)) + " 时 ", o %= 3600), o >= 60 && (l += e(parseInt(o / 60)) + " 分 ", o %= 60), o >= 0 && (l += e(o) + " 秒");
    let a = document.getElementById("runtime");
    a && (a.innerHTML = l), setTimeout(marcus.runtime, 1e3)
  },
  randomLink: () => {
    let e = marcus.loadData("links", 30);
    if (e) {
      let t = document.querySelectorAll("#friend-links-in-footer .footer-item");
      if (!t.length) return;
      for (let n = 0; n < 5; n++) {
        let o = parseInt(Math.random() * e.length);
        t[n].innerText = e[o].name, t[n].href = e[o].link, e.splice(o, 1)
      }
    } else fetch("/link.json")
      .then((e => e.json()))
      .then((e => {
        marcus.saveData("links", e.link_list), marcus.randomLink()
      }))
  }
}
//如果开启pjax
function whenDOMReady() {
  marcus.randomLink();
}
marcus.runtime();
//没有开启pjax
// marcus.randomLink();
// marcus.runtime();

if (document.querySelector('#bber-talk')) {
      var swiper = new Swiper('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        loop: true,
        autoplay: {
        delay: 3000,
        pauseOnMouseEnter: true
      },
      });
}

// ======================================

window.IP_CONFIG = {
    API_KEY: 'YU1tlqcPF6qktEFoIjgXkRvQYA', // API密钥 申请地址：https://api.76.al/
    BLOG_LOCATION: {
        lng: 110.611, // 经度
        lat: 21.649 // 纬度
    },
    CACHE_DURATION: 1000 * 60 * 60, // 可配置缓存时间(默认1小时)
    HOME_PAGE_ONLY: true, // 是否只在首页显示 开启后其它页面将不会显示这个容器
};

const insertAnnouncementComponent = () => {
    // 获取所有公告卡片
    const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
    if (!announcementCards.length) return;

    if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
        announcementCards.forEach(card => card.remove());
        return;
    }
    
    if (!document.querySelector('#welcome-info')) return;
    fetchIpInfo();
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

const fetchIpData = async () => {
    const response = await fetch(`https://api.nsmao.net/api/ip/query?key=${encodeURIComponent(IP_CONFIG.API_KEY)}`);
    if (!response.ok) throw new Error('网络响应不正常');
    return await response.json();
};

const showWelcome = ({
    data,
    ip
}) => {
    if (!data) return showErrorMessage();

    const {
        lng,
        lat,
        country,
        prov,
        city,
        district
    } = data;
    const welcomeInfo = getWelcomeInfoElement();
    if (!welcomeInfo) return;

    const dist = calculateDistance(lng, lat);
    const ipDisplay = formatIpDisplay(ip);
    const pos = formatLocation(country, prov, city, district);

    welcomeInfo.style.display = 'block';
    welcomeInfo.style.height = 'auto';
    welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, prov, city, district);
};

const calculateDistance = (lng, lat) => {
    const R = 6371; // 地球半径(km)
    const rad = Math.PI / 180;
    const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
    const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const formatIpDisplay = (ip) => ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : ip;
const formatLocation = (country, prov, city, district) => {
    return country ? (country === "中国" ? `${prov} ${city} ${district}` : country) : '神秘地区';
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, prov, city) => `
    😀欢迎来自<br>
    <b class="res">${pos}</b><br>
    的小友,你好呀！<br>
    你目前距离博主约有 <b class="res">${dist}</b> 公里呢！<br>
    你的网络IP为：<br>
    <b class="ip-address">${ipDisplay}</b><br>
    ${getTimeGreeting()}<br>
    <b>${getGreeting(country, prov, city)}🍂</b>
`;

const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 212px;
            // padding: 10px;
            // margin-top: 5px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .res {
            color: #49b1f5;
        }
        .ip-address {
            color: #49b1f5;
            filter: blur(5px);
            transition: filter 0.3s ease;
        }
        .ip-address:hover {
            filter: blur(0);
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .error-message p,
        .permission-dialog p {
            margin: 0;
        }
        .error-icon {
            font-size: 3rem;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: transform 0.3s ease;
        }
        #retry-button:hover {
            transform: rotate(180deg);
        }
        .permission-dialog {
            text-align: center;
        }
        .permission-dialog button {
            margin: 10px 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--anzhiyu-main);
            color: white;
            transition: opacity 0.3s ease;
        }
        .permission-dialog button:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
};

// 位置权限相关函数
const checkLocationPermission = () => localStorage.getItem('locationPermission') === 'granted';
const saveLocationPermission = (permission) => {
    localStorage.setItem('locationPermission', permission);
};
const showLocationPermissionDialog = () => {
    // const welcomeInfoElement = document.getElementById("welcome-info");
    // welcomeInfoElement.innerHTML = `
    //     <div class="permission-dialog">
    //         <div class="error-icon">❓</div>
    //         <p>是否允许访问您的位置信息？</p>
    //         <button data-action="allow">允许</button>
    //         <button data-action="deny">拒绝</button>
    //     </div>
    // `;

    // welcomeInfoElement.addEventListener('click', (e) => {
    //     if (e.target.tagName === 'BUTTON') {
    //         const action = e.target.dataset.action;
    //         const permission = action === 'allow' ? 'granted' : 'denied';
    //         handleLocationPermission(permission);
    //     }
    // });
    handleLocationPermission('granted');
};
const handleLocationPermission = (permission) => {
    saveLocationPermission(permission);
    if (permission === 'granted') {
        showLoadingSpinner();
        fetchIpInfo();
    } else {
        showErrorMessage('您已拒绝访问位置信息');
    }
};

const showLoadingSpinner = () => {
    const welcomeInfoElement = document.querySelector("#welcome-info");
    if (!welcomeInfoElement) return;
    welcomeInfoElement.innerHTML = '<div class="loading-spinner"></div>';
};

const IP_CACHE_KEY = 'ip_info_cache';
const getIpInfoFromCache = () => {
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
        localStorage.removeItem(IP_CACHE_KEY);
        return null;
    }
    return data;
};
const setIpInfoCache = (data) => {
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

const fetchIpInfo = async () => {
    if (!checkLocationPermission()) {
        showLocationPermissionDialog();
        return;
    }

    showLoadingSpinner();

    const cachedData = getIpInfoFromCache();
    if (cachedData) {
        showWelcome(cachedData);
        return;
    }

    try {
        const data = await fetchIpData();
        setIpInfoCache(data);
        showWelcome(data);
    } catch (error) {
        console.error('获取IP信息失败:', error);
        showErrorMessage();
    }
};

const greetings = {
    "中国": {
        "北京市": "北——京——欢迎你~~~",
        "天津市": "讲段相声吧",
        "河北省": "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山",
        "山西省": "展开坐具长三尺，已占山河五百余",
        "内蒙古自治区": "天苍苍，野茫茫，风吹草低见牛羊",
        "辽宁省": "我想吃烤鸡架！",
        "吉林省": "状元阁就是东北烧烤之王",
        "黑龙江省": "很喜欢哈尔滨大剧院",
        "上海市": "众所周知，中国只有两个城市",
        "江苏省": {
            "南京市": "这是我挺想去的城市啦",
            "苏州市": "上有天堂，下有苏杭",
            "其他": "散装是必须要散装的"
        },
        "浙江省": {
            "杭州市": "东风渐绿西湖柳，雁已还人未南归",
            "其他": "望海楼明照曙霞,护江堤白蹋晴沙"
        },
        "河南省": {
            "郑州市": "豫州之域，天地之中",
            "信阳市": "品信阳毛尖，悟人间芳华",
            "南阳市": "臣本布衣，躬耕于南阳此南阳非彼南阳！",
            "驻马店市": "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！",
            "开封市": "刚正不阿包青天",
            "洛阳市": "洛阳牡丹甲天下",
            "其他": "可否带我品尝河南烩面啦？"
        },
        "安徽省": "蚌埠住了，芜湖起飞",
        "福建省": "井邑白云间，岩城远带山",
        "江西省": "落霞与孤鹜齐飞，秋水共长天一色",
        "山东省": "遥望齐州九点烟，一泓海水杯中泻",
        "湖北省": {
            "黄冈市": "红安将军县！辈出将才！",
            "其他": "来碗热干面~"
        },
        "湖南省": "74751，长沙斯塔克",
        "广东省": {
            "广州市": "看小蛮腰，喝早茶了嘛~",
            "深圳市": "今天你逛商场了嘛~",
            "阳江市": "阳春合水！",
            "其他": "老板来两斤福建人~"
        },
        "广西壮族自治区": "桂林山水甲天下",
        "海南省": "朝观日出逐白浪，夕看云起收霞光",
        "四川省": "康康川妹子",
        "贵州省": "茅台，学生，再塞200",
        "云南省": "玉龙飞舞云缠绕，万仞冰川直耸天",
        "西藏自治区": "躺在茫茫草原上，仰望蓝天",
        "陕西省": "来份臊子面加馍",
        "甘肃省": "羌笛何须怨杨柳，春风不度玉门关",
        "青海省": "牛肉干和老酸奶都好好吃",
        "宁夏回族自治区": "大漠孤烟直，长河落日圆",
        "新疆维吾尔自治区": "驼铃古道丝绸路，胡马犹闻唐汉风",
        "台湾省": "我在这头，大陆在那头",
        "香港特别行政区": "永定贼有残留地鬼嚎，迎击光非岁玉",
        "澳门特别行政区": "性感荷官，在线发牌",
        "其他": "带我去你的城市逛逛吧！"
    },
    "美国": "Let us live in peace!",
    "日本": "よろしく、一緒に桜を見ませんか",
    "俄罗斯": "干了这瓶伏特加！",
    "法国": "C'est La Vie",
    "德国": "Die Zeit verging im Fluge.",
    "澳大利亚": "一起去大堡礁吧！",
    "加拿大": "拾起一片枫叶赠予你",
    "英国": "Keep calm and carry on",
    "意大利": "Ciao! 来份披萨和意面~",
    "巴西": "O Carnaval do Rio é incrível!",
    "印度": "Namaste！探索瑜伽与灵性",
    "韩国": "안녕하세요! 一起看欧巴吗？",
    "泰国": "萨瓦迪卡！欢迎来到微笑之国",
    "墨西哥": "¡Viva México! 尝尝塔可和龙舌兰",
    "西班牙": "¡Olé! 来看弗拉明戈舞吧",
    "荷兰": "风车、郁金香和自行车之旅",
    "瑞士": "阿尔卑斯山的雪与巧克力之旅",
    "新西兰": "中土世界欢迎你！",
    "其他": "带我去你的国家逛逛吧"
};

const getGreeting = (country, province, city) => {
    const countryGreeting = greetings[country] || greetings["其他"];
    if (typeof countryGreeting === 'string') {
        return countryGreeting;
    }
    const provinceGreeting = countryGreeting[province] || countryGreeting["其他"];
    if (typeof provinceGreeting === 'string') {
        return provinceGreeting;
    }
    return provinceGreeting[city] || provinceGreeting["其他"] || countryGreeting["其他"];
};
const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "🌤️早上好 ，一日之计在于晨";
    if (hour >= 11 && hour < 13) return "<span>中午好</span>，该摸鱼吃午饭了";
    if (hour >= 13 && hour < 15) return "<span>下午好</span>，懒懒地睡个午觉吧！";
    if (hour >= 15 && hour < 16) return "<span>三点几啦</span>，饮茶先啦！";
    if (hour >= 16 && hour < 19) return "下班啦！夕阳无限好！";
    if (hour >= 19 && hour < 24) return "🌙晚上好 ，夜生活嗨起来！";
    return "夜深了，早点休息，少熬夜";
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
    const welcomeInfoElement = document.getElementById("welcome-info");
    welcomeInfoElement.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${message}</p>
            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate"></i>重试或检查网络连接</p>
        </div>
    `;

    document.getElementById('retry-button').addEventListener('click', fetchIpInfo);
};

const isHomePage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    insertAnnouncementComponent();
    document.addEventListener('pjax:complete', insertAnnouncementComponent);
});

// ===========================================================

// noinspection JSIgnoredPromiseFromCall

// 这个语句的作用就是取代了BF原生的悬浮窗，不想要的话可以删掉（不确保没BUG）
document.addEventListener(
    'DOMContentLoaded',
    () => btf.snackbarShow = (text, time = 3500) => kms.pushInfo({text, time}, null)
)

const kms = {

    /** 是否为移动端 */
    isMobile: 'ontouchstart' in document.documentElement,
    
    /** 缓存 */
    _cache: {
        winCode: 0
    },
    /**
     * 在右上角弹出悬浮窗<i class="fa-solid fa-xmark"></i>
     * @param {{text: string, time:number?, left:boolean?, bottom:boolean?}|string} optional
     *      配置项（text: 要显示的内容，time: 持续时间，left: 是否靠左显示，bottom: 是否靠下显示
     * @param button {?{icon:string?, text:string, desc:string?, onclick:function?}}
     *      传入null表示没有按钮（icon: 图标，text: 按钮文本，desc: 描述文本， onclick: 点击按钮时触发的回调）
     * @return {{close:function, onclose:function}} 一个对象，其中有两个函数对象，调用`close`可手动关闭悬浮窗，添加`onclose`可监听悬浮窗的关闭
     */
    pushInfo: (optional, button = null) => {
        let {text, time, left, bottom} = optional
        if (typeof optional === 'string') text = optional
        if (!time) time = 3500
        const externalApi = {}  // 对外部暴露的接口
        const id = kms._cache.winCode++
        const cardID = `float-win-${id}`
        const actionID = `float-action-${id}`
        const exitID = `float-exit-${id}`
        /**
         * 关闭指定悬浮窗
         * @param id {string} 悬浮窗ID
         */
        const closeWin = id => {
            const div = document.getElementById(id)
            if (div) {
                const {classList, style} = div
                if (classList.contains('close')) return
                if (externalApi.onclose) externalApi.onclose()
                style.maxHeight = `${div.clientHeight + 10}px`
                classList.add('close')
                setTimeout(() => div.remove(), 1000)
                setTimeout(() => {
                    style.maxHeight = style.marginBottom = '0'
                    classList.remove('show')
                }, 25)
            }
        }
        /** 关闭多余的悬浮窗 */
        const closeRedundantWin = className => {
            // noinspection SpellCheckingInspection
            const list = document.querySelector(`.float-box${className}`).children
            const count = list.length - 3
            for (let k = 0, i = 0; k < count && i !== list.length; ++i) {
                closeWin(list[i].id)
                ++k
            }
        }
        /** 构建html代码 */
        const buildHTML = id => {
            const buttonDesc = (button && button.desc) ? `<div class="descr"><p ${kms.isMobile ? 'class="open"' : ''}>${button.desc}</p></div>` : ''
            // noinspection HtmlUnknownAttribute
            return `<div class="float-win ${left ? 'left' : 'right'} ${bottom ? 'bottom' : 'top'} ${button ? 'click' : ''
            }" id="${cardID}" move="0" style="z-index:${id};"><button class="exit" id="${exitID}"><i class="iconfont fa-solid fa-xmark"></i></button><div class="text">${text}</div>${button ?
                '<div class="select"><button class="action" id="' + actionID + '">' + (button.icon ? '<i class="' + button.icon + '"></i>' : '') +
                '</i><p class="text">' + button.text + `</p></button>${buttonDesc}` : ''}</div></div>`
        }
        const className = `${left ? '.left' : '.right'}${bottom ? '.bottom' : '.top'}`
        // noinspection SpellCheckingInspection
        document.querySelector(`.float-box${className}`).insertAdjacentHTML('beforeend', buildHTML(id))
        const cardDiv = document.getElementById(cardID)
        const actionButton = document.getElementById(actionID)
        const exitButton = document.getElementById(exitID)
        if (actionButton) {
            actionButton.onclick = () => {
                if (button.onclick) button.onclick()
                closeWin(cardID)
            }
        }
        exitButton.onclick = () => closeWin(cardID)
        cardDiv.onmouseover = () => cardDiv.setAttribute('over', '1')
        cardDiv.onmouseleave = () => cardDiv.removeAttribute('over')
        closeRedundantWin(className)
        setTimeout(() => cardDiv.classList.add('show'), 25)
        let age = 0
        const task = setInterval(() => {
            const win = document.getElementById(cardID)
            if (win) {
                if (win.hasAttribute('over')) return age = 0
                age += 100
                if (age < time) return
            }
            clearInterval(task)
            closeWin(cardID)
        }, 100)
        externalApi.close = () => closeWin(cardID)
        return externalApi
    }
}

// 倒计时的小组件
const CountdownTimer = (() => {
    const config = {
        targetDate: "2025-09-07",
        targetName: "开学",
        units: {
            day: { text: "今日", unit: "小时" },
            week: { text: "本周", unit: "天" },
            month: { text: "本月", unit: "天" },
            year: { text: "本年", unit: "天" }
        }
    };

    const calculators = {
        day: () => {
            const hours = new Date().getHours();
            return {
                remaining: 24 - hours,
                percentage: (hours / 24) * 100
            };
        },
        week: () => {
            const day = new Date().getDay();
            const passed = day === 0 ? 6 : day - 1;
            return {
                remaining: 6 - passed,
                percentage: ((passed + 1) / 7) * 100
            };
        },
        month: () => {
            const now = new Date();
            const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const passed = now.getDate() - 1;
            return {
                remaining: total - passed,
                percentage: (passed / total) * 100
            };
        },
        year: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const total = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0);
            const passed = Math.floor((now - start) / 86400000);
            return {
                remaining: total - passed,
                percentage: (passed / total) * 100
            };
        }
    };

    function updateCountdown() {
        const elements = ['eventName', 'eventDate', 'daysUntil', 'countRight']
            .map(id => document.getElementById(id));

        if (elements.some(el => !el)) return;

        const [eventName, eventDate, daysUntil, countRight] = elements;
        const now = new Date();
        const target = new Date(config.targetDate);

        eventName.textContent = config.targetName;
        eventDate.textContent = config.targetDate;
        daysUntil.textContent = Math.round((target - now.setHours(0,0,0,0)) / 86400000);

        countRight.innerHTML = Object.entries(config.units)
            .map(([key, {text, unit}]) => {
                const {remaining, percentage} = calculators[key]();
                return `
                    <div class="cd-count-item">
                        <div class="cd-item-name">${text}</div>
                        <div class="cd-item-progress">
                            <div class="cd-progress-bar" style="width: ${percentage}%; opacity: ${percentage/100}"></div>
                            <span class="cd-percentage ${percentage >= 46 ? 'cd-many' : ''}">${percentage.toFixed(2)}%</span>
                            <span class="cd-remaining ${percentage >= 60 ? 'cd-many' : ''}">
                                <span class="cd-tip">还剩</span>${remaining}<span class="cd-tip">${unit}</span>
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
    }

    function injectStyles() {
        const styles = `
            .card-countdown .item-content {
                display: flex;
            }
            .cd-count-left {
                position: relative;
                display: flex;
                flex-direction: column;
                margin-right: 0.8rem;
                line-height: 1.5;
                align-items: center;
                justify-content: center;
            }
            .cd-count-left .cd-text {
                font-size: 14px;
            }
            .cd-count-left .cd-name {
                font-weight: bold;
                font-size: 18px;
            }
            .cd-count-left .cd-time {
                font-size: 30px;
                font-weight: bold;
                color: var(--heo-lighttext);
            }
            .cd-count-left .cd-date {
                font-size: 12px;
                opacity: 0.6;
            }
            .cd-count-left::after {
                content: "";
                position: absolute;
                right: -0.8rem;
                width: 2px;
                height: 80%;
                background-color: var(--heo-lighttext);
                opacity: 0.5;
            }
            .cd-count-right {
                flex: 1;
                margin-left: .8rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .cd-count-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 24px;
            }
            .cd-item-name {
                font-size: 14px;
                margin-right: 0.8rem;
                white-space: nowrap;
            }
            .cd-item-progress {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                width: 100%;
                border-radius: 8px;
                background-color: var(--card-bg);
                overflow: hidden;
            }
            .cd-progress-bar {
                height: 100%;
                border-radius: 8px;
                background-color: var(--heo-lighttext);
            }
            .cd-percentage,
            .cd-remaining {
                position: absolute;
                font-size: 12px;
                margin: 0 6px;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            .cd-many {
                color: #fff;
            }
            .cd-remaining {
                opacity: 0;
                transform: translateX(10px);
            }
            .card-countdown .item-content:hover .cd-remaining {
                transform: translateX(0);
                opacity: 1;
            }
            .card-countdown .item-content:hover .cd-percentage {
                transform: translateX(-10px);
                opacity: 0;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    let timer;
    const start = () => {
        injectStyles();
        updateCountdown();
        timer = setInterval(updateCountdown, 600000);
    };

    ['pjax:complete', 'DOMContentLoaded'].forEach(event => document.addEventListener(event, start));
    document.addEventListener('pjax:send', () => timer && clearInterval(timer));

    return { start, stop: () => timer && clearInterval(timer) };
})();
