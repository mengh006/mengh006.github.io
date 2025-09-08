let kk = {};

// 显示菜单
kk.showRightMenu = function(isTrue, x=0, y=0){
    console.info(x, y);
    let rightMenu = document.getElementById("rightMenu");
    rightMenu.style.top = x + "px";
    rightMenu.style.left = y + "px";
    if (isTrue) {
        rightMenu.style.display = "block";
        stopMaskScroll();
    } else {
        rightMenu.style.display = "none";
    }
}

function stopMaskScroll() {
  if (document.getElementById("rightmenu-mask")) {
    let xscroll = document.getElementById("rightmenu-mask");
    xscroll.addEventListener(
      "mousewheel",
      function (e) {
        //阻止浏览器默认方法
        kk.hideRightMenu();
        // e.preventDefault();
      },
      { passive: true }
    );
  }
  if (document.getElementById("rightMenu")) {
    let xscroll = document.getElementById("rightMenu");
    xscroll.addEventListener(
      "mousewheel",
      function (e) {
        //阻止浏览器默认方法
        kk.hideRightMenu();
        // e.preventDefault();
      },
      { passive: true }
    );
  }
}

// 隐藏菜单
kk.hideRightMenu = function () {
  kk.showRightMenu(false);
  let rightMenuMask = document.querySelector("#rightmenu-mask");
  rightMenuMask.style.display = "none";
};

// 尺寸
let rmWidth = $('#rightMenu').width();
let rmHeight = $('#rightMenu').height();

// 重新定义尺寸
kk.reloadrmSize = function () {
  // 使用现有 rightMenu 引用（避免重复查询DOM）
  const menu = rightMenu;
  
  menu.style.visibility = "hidden";
  menu.style.display = "block";
  
  // 直接使用变量获取尺寸
  rmWidth = menu.offsetWidth; 
  rmHeight = menu.offsetHeight;
  menu.style.visibility = "visible";
};

var oncontextmenu = function(event){
    let pageX = event.clientX + 5;	//加5是为了防止显示时鼠标遮在菜单上
    let pageY = event.clientY;

    kk.reloadrmSize();
    // 鼠标默认显示在鼠标右下方，当鼠标靠右或考下时，将菜单显示在鼠标左方\上方
    if (pageX + rmWidth > window.innerWidth) {
      pageX -= rmWidth + 10;
    }
    if (pageY + rmHeight > window.innerHeight) {
      pageY -= pageY + rmHeight - window.innerHeight;
    }
    
    kk.showRightMenu(true, pageY, pageX);
    document.getElementById("rightmenu-mask").style.display = "flex";
    return false;
};

// 监听右键初始化
window.oncontextmenu = oncontextmenuFunction;

function RemoveRightMenu(){
    kk.hideRightMenu();
}
kk.switchDarkMode = function() {
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread')
        .children.length && setTimeout(() => window.disqusReset(), 200)
    kk.hideRightMenu()
};

function addRightMenuClickEvent() {
  // 添加点击事件
    document.getElementById("menu-backward").addEventListener("click", function () {
        window.history.back();
        kk.hideRightMenu();
    });

    document.getElementById("menu-forward").addEventListener("click", function () {
        window.history.forward();
        kk.hideRightMenu();
    });

    document.getElementById("menu-refresh").addEventListener("click", function () {
        window.location.reload();
    });

    document.getElementById("menu-home") &&
        document.getElementById("menu-home").addEventListener("click", function () {
            window.location.href = window.location.origin;
        });
  
    document.getElementById("menu-translate").addEventListener("click", function () {
        window.translateFn.translatePage();
        kk.hideRightMenu();
    });
    document.getElementById("menu-darkmode").addEventListener("click", kk.switchDarkMode);
    document.getElementById("menu-darkmode").addEventListener("click", function () {
        document.querySelector(".menu-commentBarrage-text").textContent = enable ? GLOBAL_CONFIG.right_menu.barrage.open : GLOBAL_CONFIG.right_menu.barrage.close;
        kk.hideRightMenu();
    });

  document.getElementById("menu-home") &&
    document.getElementById("menu-home").addEventListener("click", function () {
      window.location.href = window.location.origin;
    });

  document.getElementById("menu-randomPost").addEventListener("click", function () {
    toRandomPost();
  });

  document.getElementById("rightmenu-mask").addEventListener("click", kk.hideRightMenu);

  document.getElementById("rightmenu-mask").addEventListener("contextmenu", function (event) {
    kk.hideRightMenu();
    event.preventDefault(); // Prevent the default context menu from appearing
  });

  document.getElementById("menu-newwindow").addEventListener("click", function () {
    window.open(domhref, "_blank");
    rm.hideRightMenu();
  });
}

addRightMenuClickEvent();

