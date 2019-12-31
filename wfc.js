(function (w) {

    var pfm = {
        performance: (w.webkitPerformance ? w.webkitPerformance : w.performance),
        host: 'km323.das.366ec.net', //'das.366ec.net', //
        /**
         * 网页性能跟踪之耗时
         * @param {object} 性能时间跟踪对象
         */
        getTiming: function () {
            if (!pfm.performance) {
                return {};
            }
            var tim = pfm.performance.timing;
            return {
                load: tim.loadEventEnd - tim.fetchStart,
                // DNS查询耗时
                dns: tim.domainLookupEnd - tim.domainLookupStart,
                // TCP链接耗时
                tcp: tim.connectEnd - tim.connectStart,
                redirect: tim.redirectEnd - tim.redirectStart,
                //
                cache: Math.max(tim.domainLookupStart - tim.fetchStart, 0),
                ready: tim.fetchStart - tim.navigationStart,
                // 白屏时间
                ttfb: tim.responseStart - tim.navigationStart,
                // 可交互：
                active: tim.domInteractive - tim.navigationStart,
                // 等待服务器响应耗时（注意是否存在cache）：
                request: tim.responseStart - tim.requestStart,
                // 内容加载耗时（注意是否存在cache）:
                response: tim.responseEnd - tim.responseStart,
                // 总体网络交互耗时，即开始跳转到服务器资源下载完成：
                network: tim.responseEnd - tim.navigationStart,
                domReady: tim.domComplete - tim.domInteractive,
                initDomTree: tim.domInteractive - tim.responseEnd,
                // 解析dom树耗时
                dom: tim.domComplete - tim.domLoading,
                // onload时间
                events: tim.loadEventEnd - tim.loadEventStart,
                unloadEvent: tim.unloadEventEnd - tim.unloadEventStart,
                total: (tim.loadEventEnd || tim.loadEventStart || tim.domComplete || tim.domLoading) - tim.navigationStart
            }
        },

        resourceDetail: false,

        /**
         * 获取页面资源加载信息
         */
        getResources: function () {
            if (!pfm.performance) {
                return [];
            }
            var entries = this.performance.getEntries();
            var resourceArr = [];
            var len = entries.length;
            for (var i = len - 1; i > 0; i--) {
                var temp = {};
                var cur = entries[i];
                if (cur.entryType == "resource") {
                    temp.name = cur.name;
                    temp.response = cur.responseEnd - cur.requestStart;
                    temp.connect = cur.connectEnd - cur.connectStart;
                    temp.duration = cur.duration;
                    temp.type = cur.initiatorType;
                    resourceArr.push(temp);
                }
            }
            return resourceArr;
        },

        /**
         * 获取资源信息统计
         */
        getResourceCount: function () {
            if (!pfm.performance) {
                return {};
            }
            var entries = this.performance.getEntries();
            var len = entries.length;
            var totalTime = 0;
            var count = 0;
            var ret = {};
            for (var i = len - 1; i > 0; i--) {
                var cur = entries[i];
                if (cur.entryType == "resource") {
                    var ctype = ret[cur.initiatorType] || {
                        total: 0,
                        count: 0
                    };
                    ctype["total"] += cur.duration;
                    ctype["count"] += 1;
                    ret[cur.initiatorType] = ctype;
                }
            }
            return ret;
        },

        /**
         * 获取终端的相关信息
         * @returns {{}}
         */
        getNavigator: function () {
            var navigator = window.navigator;
            if (!navigator) {
                return {};
            }
            var ret = {
                userAgent: navigator.userAgent,
                appName: navigator.appName,
                appCodeName: navigator.appCodeName,
                appVersion: navigator.appVersion,
                appMinorVersion: navigator.appMinorVersion,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                language: navigator.language,
                deviceMemory: navigator.deviceMemory
            };
            try {
                var conn = navigator.connection;
                if (conn) {
                    ret["downlink"] = conn.downlink;
                    ret["effectiveType"] = conn.effectiveType;
                    ret["rtt"] = conn.rtt;
                    ret["saveData"] = conn.saveData;
                }
            } catch (ex) {
                console.warn(ex);
            }

            return ret;
        },

        // 获取页面请求时的唯一id
        getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        },

        /**
         * 获取基础信息
         */
        getBaseInfo: function () {
            var pfmScript = document.getElementById("js_performance");
            var uuid = this.getUuid();
            var dt = new Date();
            var ret = {
                uuid: uuid,
                appKey: "wfc",
                referrer: w.document.referrer,
                host: w.location.hostname,
                pageKey: w.location.pathname,
                pageTitle: document.title,
                parameter: w.location.search,
                url: w.location.pathname,
                terminal: "browser",
                version: "3.2.3.0",
                viewTime: dt.getTime(),
                toUrl: "",
                leaveTime: 0,
                delay: 0,
                year: dt.getFullYear(),
                month: dt.getMonth() + 1,
                day: dt.getDate(),
                hour: dt.getHours(),
                minute: dt.getMinutes(),
            }
            if (pfm.performance) {
                var nav = pfm.performance.navigation;
                var tim = pfm.performance.timing;
                tim["startLoadTime"] = tim.navigationStart;
                tim["redirectCount"] = nav.redirectCount;
                tim["loadMethod"] = nav.type;
            }
            return ret;
        },

        /**
         * 获取本地Cookie为json对象
         */
        getCookie: function () {
            var strCookie = document.cookie;
            // strCookie = 'LOGINTICKET5569_Supplier64_Store=4B38F1DF6FF1A96C2B30C18D4EB4B340B9D2DE9D34AB8BA347D6193359CBCB155EC2E5E9E80EEFBBB3369E83CEA4BA015855D96E9CF686B992EE113E651897D9CE5E5D70A8DC89E0A80CC1852256EDFA5D5A94190F428A9ABB2C2AE7CB4C53C8D22040DE7FE01F353135051139E0736373FD9428726EB1D3CD455038D521483A3FFA451B678EA2F4FDAD375B5A6012EC249F639757186EA0FA1AA0B95B4B47E61AAE9B875A807A56E844A2207583064115D26569D521D721765F1A12D5B81B87AD2F5E2AB7F89E2DD4555B35A53982418BD1533066BF7E3565BAAA248DA48DC4597DAFB773027DB9F25CCCF8B0F671BF9DE4A67E23C7FD715F05263E296E97B7D55E944F89C32A456EE6747BA3BC055051A9E4AC9C405CE41C9D970491DEE8A4B6AFF5DCC1C72D33; LOGINTICKET5569_Supplier64_Supplier=4B38F1DF6FF1A96C2B30C18D4EB4B340B9D2DE9D34AB8BA38BD9D144739E76570D00955D2FFF001B4AEFB019A23CED338B1D062BEDA41FCD48CECC5CB9488EDA1567CEB7348F9809E0ECF698B714E01A917F8190F318302318A6AC656984C6BD4F4B4FADA5C8B7A9369E39E68995CF9D11E496EF2BB47F78F9B9ECCE5FE354CA1444A11DCC7984F42A5945F2AECB0C01A115720D1C5382959474C9DF2D306CAD43B9664E6781248DC449965D40EA7F4B38991DF39F9FCF8D5F1F487EC53FC8D2AC7BE9C0752BA2B5FEE1C676357638D8352E49E327CB036E210B99B63D4683697F955B50BA1186CFF909C3CB78DFDEF41F6A1F7B8FDA2EEC521CC376CCAB4D1054890B51F10D7EC11840071DC378956DD23438645D26D7A22ADA88898E040C53; LOGINTICKETpaqc_Supplier4126_Store=4B38F1DF6FF1A96C2B30C18D4EB4B340B9D2DE9D34AB8BA347D6193359CBCB155EC2E5E9E80EEFBBB3369E83CEA4BA015C899AA07F92C5A8F9AAC607E8166C17E91C5BF2A85CEC5219AA4C5C2D697AD2535645C1624EC7C0060409F4DB3E2BEDAA45828F3063AD9D1658131D948CAC8B1CE921A496F21BCF34B8D510137AD6E8A2EB8A745F6180B89324123A3D9E0161CA9AA7B9E6E82A4348EDFF1DC6F1ACBFF557CFED12C7CD081E9431A9AD84D9631E917C5A352BA3D6618D51B3E17515246AA334640F975EA9027FE2B71D51A3D7CC6186D68A92B395331E1CC7AB41A1C84D44B7C161B5CA8F3FDBA24256DFF9AD04A5FEB1F5F4390A1AFEEF879F175E7954EA5357A12BB6953F92861C9D0DB47720ABB78FEC108214CC89D3DF83F1277EF2E14F39AC0834DF'
            strCookie = strCookie.replace(/\./g, "_")
            var arrCookie = strCookie.split("; ");
            var jsonCookie = {};
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                jsonCookie[arr[0]] = arr[1];
            }
            // console.log(jsonCookie);
            return jsonCookie;
        },

        /**
         * 获取服务端输出的页面信息
         */
        getPageInfo: function () {
            var _page = document.getElementById("_page_identify_");
            var val = "";
            if (_page) {
                val = _page.value;
            }
            return val;
        },

        /**
         * 获取分辨率相关的数据
         */
        getResolution: function () {
            /**
             * s = " 网页可见区域宽：" document.body.clientWidth;
            s = " 网页可见区域高：" document.body.clientHeight;
            s = " 网页可见区域宽：" document.body.offsetWidth " (包括边线和滚动条的宽)";
            s = " 网页可见区域高：" document.body.offsetHeight " (包括边线的宽)";
            s = " 网页正文全文宽：" document.body.scrollWidth;
            s = " 网页正文全文高：" document.body.scrollHeight;
            s = " 网页被卷去的高(ff)：" document.body.scrollTop;
            s = " 网页被卷去的高(ie)：" document.documentElement.scrollTop;
            s = " 网页被卷去的左：" document.body.scrollLeft;
            s = " 网页正文部分上：" window.screenTop;
            s = " 网页正文部分左：" window.screenLeft;
            s = " 屏幕分辨率的高：" window.screen.height;
            s = " 屏幕分辨率的宽：" window.screen.width;
            s = " 屏幕可用工作区高度：" window.screen.availHeight;
            s = " 屏幕可用工作区宽度：" window.screen.availWidth;
            s = " 你的屏幕设置是 " window.screen.colorDepth " 位彩色";
            s = " 你的屏幕设置 " window.screen.deviceXDPI " 像素/英寸";
             */
            return {
                clientWidth: document.body.clientWidth,
                clientHeight: document.body.clientHeight,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth,
                deviceXDPI: window.screen.deviceXDPI,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
            }
        },

        /**
         * 向指定地方推送页面性能收集信息
         */
        pushPerformance: function () {

            setTimeout(
                function () {
                    var result = pfm.getBaseInfo();
                    result["timing"] = pfm.getTiming();
                    result["resources"] = pfm.resourceDetail ? pfm.getResources() : pfm.getResourceCount();
                    result["navigator"] = pfm.getNavigator();
                    // result['c'] = pfm.getCookie();
                    result['resolution'] = pfm.getResolution();
                    result["page"] = pfm.getPageInfo();
                    ajax('POST', pfm.getProtocol() + '://' + pfm.host + "/ppc", result, function (res) {
                        //console.log(res);
                        w.wcf_id = res;
                    });

                    return result;
                }, 50);
        },

        /**
         * 返回请求协议
         */
        getProtocol: function () {
            if (window.location.protocol.indexOf("s") > 0) {
                return "https";
            }
            else {
                return "http";
            }
        }
    };

    /**
     * 简易的ajax请求封装
     * @param {string} 请求方式
     * @param {string} 请求的url地址
     * @param {object} 待发送的数据
     * @param {function} 回调函数
     */
    function ajax(method, url, data, callback) {
        try {

            //1、创建请求对象
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            //2、配置请求参数并发送请求
            method = method.toUpperCase();
            // 设置调用不能超过200ms
            xhr.timeout = 500;
            // console.log(url);

            if (method == 'GET') {
                xhr.open('GET', url + '?' + data, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(null);
            } else if (method == 'POST') {
                xhr.open('POST', url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                if (typeof (data) == "object") {
                    data = JSON.stringify(data);
                }
                // console.log(data);
                xhr.send(data);
            } else {
                console.error('请传入合法的请求方式');
            }
            //3、监听状态
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // console.log(xhr);
                    //向外返回服务器的数据
                    //根据responseXML属性是否为空
                    if (!xhr.responseXML) {
                        callback(xhr.responseText);
                    } else {
                        callback(xhr.responseXML);
                    }
                }
            }
        } catch (e) { console.log(e); }
    }


    /**
     * 为页面添加加载事件
     * @param {string} 加载方式类型
     * @param {function} 执行的函数
     */
    function handleAddListener(type, fn) {
        // console.log(w);
        if (w.addEventListener) {
            w.addEventListener(type, fn)
        } else {
            w.attachEvent('on' + type, fn)
        }
    }

    // 页面加载完成时执行
    handleAddListener('load', pfm.pushPerformance);

    /*
    window.addEventListener("beforeunload", function(event) {
        // event.returnValue = "我在这写点东西...";
        alert("")
    });
    window.addEventListener('pushstate',  function (event) {alert(window.wcf_id)})
    window.addEventListener('replacestate',  function (event) {alert(window.wcf_id)})
    */

})(window);


/**
 *
DNS查询耗时 ：domainLookupEnd - domainLookupStart

TCP链接耗时 ：connectEnd - connectStart

request请求耗时 ：responseEnd - responseStart

解析dom树耗时 ： domComplete- domInteractive

白屏时间 ：responseStart - navigationStart

domready时间 ：domContentLoadedEventEnd - navigationStart

onload时间 ：loadEventEnd - navigationStart

重定向次数：
var redirectCount = navigation && navigation.redirectCount;

跳转耗时：
var redirect = timing.redirectEnd - timing.redirectStart;

APP CACHE 耗时：
var appcache = Math.max(timing.domainLookupStart - timing.fetchStart, 0);

DNS 解析耗时：
var dns = timing.domainLookupEnd - timing.domainLookupStart;

TCP 链接耗时：
var conn = timing.connectEnd - timing.connectStart;

等待服务器响应耗时（注意是否存在cache）：
var request = timing.responseStart - timing.requestStart;

内容加载耗时（注意是否存在cache）:
var response = timing.responseEnd - timing.responseStart;

总体网络交互耗时，即开始跳转到服务器资源下载完成：
var network = timing.responseEnd - timing.navigationStart;

渲染处理：
var processing = (timing.domComplete || timing.domLoading) - timing.domLoading;

抛出 load 事件：
var load = timing.loadEventEnd - timing.loadEventStart;

总耗时：
var total = (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart;

可交互：
var active = timing.domInteractive - timing.navigationStart;

请求响应耗时，即 T0，注意cache：
var t0 = timing.responseStart - timing.navigationStart;

首次出现内容，即 T1：
var t1 = timing.domLoading - timing.navigationStart;

内容加载完毕，即 T3：
var t3 = timing.loadEventEnd - timing.navigationStart;

 */