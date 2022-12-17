/**
* 微信统一调用接口
* 通过meta来获取微信分享的内容
*/
(function () {
    // 获取微信设置信息
    var meta, metas = document.getElementsByTagName('meta');
    for (var i = 0, len = metas.length; i < len; i++) {
        if (metas[i].getAttribute('name') == 'sharecontent') {
            meta = metas[i];
        }
    }

    // 判断是否有输出标间，并配置分享
    if (!meta) {
        return;
    }

    // 默认图片
    var imgs = document.getElementsByTagName('img'),
        shareImg,
        isImgUrl = /(^data:.*?;base64)|(\.(jpg|png|gif)$)/;
    for (var i = 0, len = imgs.length; i < len; i++) {
        if (isImgUrl.test(imgs[i].getAttribute('src'))) {
            shareImg = imgs[i].getAttribute('src');
            break;
        } else {
            continue;
        }
    }

    // shareImg = document.getElementById('app-logo').getAttribute('value');

    // 分享给朋友设置
    var link = window.location.href;
    //var pylink = window.location.href;
    if (meta.getAttribute('data-line-url') != "") {
        link = meta.getAttribute('data-line-url');
    }
    var opt_msg = {
        "img_url": meta.dataset.msgImg,
        "link": link,
        "desc": meta.dataset.msgContent || document.title,
        "title": meta.dataset.msgTitle || document.title
    };

    var handler_msg = {
        "urlCall": meta.dataset.msgCallback || '',
        callback: function (res) {
            if (res[0].err_msg.indexOf('cancel') == -1) {

                if (handler_line.urlCall) {
                    window.location.href = handler_msg.urlCall;
                }

            }
        }
    };

    // 朋友圈分享设置
    var opt_line = {
        "img_url": meta.dataset.lineImg,
        "link": link,
        "desc": meta.dataset.lineTitle || document.title,
        "title": meta.dataset.lineTitle || document.title
    };

    var handler_line = {
        "urlCall": meta.dataset.lineCallback || '',
        callback: function (res) {
            if (res[0].err_msg.indexOf('cancel') == -1) {

                if (handler_line.urlCall) {
                    window.location.href = handler_msg.urlCall;
                }

            }
        }
    }

    var tid = meta.getAttribute('data-msg-tid');
    var openid = meta.getAttribute('data-msg-openid');
    function loadXMLDoc() {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = eval('(' + xmlhttp.responseText + ')');

                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'onVoicePlayEnd',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'hideMenuItems',
        'showMenuItems',
        'downloadVoice'
                    ]
                });


                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage'
                        ],
                        success: function (res) {
                            //  alert(JSON.stringify(res));
                        }
                    });
                    wx.hideMenuItems({
                        menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareTimeline({
                        title: meta.dataset.lineTitle || document.title, // 分享标题
                        link: link, // 分享链接
                        imgUrl: meta.dataset.lineImg, // 分享图标
                        success: function (data) {
                            xmlhttp.open("GET", "/api/share/voteindex.aspx?wxtype=onMenuShareTimeline&id=" + tid + "&openid=" + openid, true);
                            xmlhttp.send();
                            if (meta.dataset.lineCallback) {
                                window.location.href = meta.dataset.lineCallback;
                            }
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: meta.dataset.msgTitle || document.title, // 分享标题
                        desc: meta.dataset.msgContent || document.title, // 分享描述
                        link: link, // 分享链接
                        imgUrl: meta.dataset.msgImg, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function (data) {

                            xmlhttp.open("GET", "/api/share/voteindex.aspx?wxtype=onMenuShareAppMessage&id=" + tid + "&openid=" + openid, true);
                            xmlhttp.send();

                            if (meta.dataset.lineCallback) {
                                window.location.href = meta.dataset.lineCallback;
                            }
                        }
                    });


                    wx.onMenuShareQQ({
                        title: meta.dataset.msgTitle || document.title, // 分享标题
                        desc: meta.dataset.msgContent || document.title, // 分享描述
                        link: link, // 分享链接
                        imgUrl: meta.dataset.msgImg, // 分享图标
                        success: function (data) {
                            xmlhttp.open("GET", "/api/share/voteindex.aspx?wxtype=onMenuShareQQ&id=" + tid + "&openid=" + openid, true);
                            xmlhttp.send();
                        }
                    });

                    wx.onMenuShareWeibo({
                        title: meta.dataset.msgTitle || document.title, // 分享标题
                        desc: meta.dataset.msgContent || document.title, // 分享描述
                        link: link, // 分享链接
                        imgUrl: meta.dataset.msgImg,
                        success: function (res) {
                            xmlhttp.open("GET", "/api/share/voteindex.aspx?wxtype=onMenuShareWeiboid=" + tid + "&openid=" + openid, true);
                            xmlhttp.send();
                        }
                    });

                    // 3 智能接口
                    var voice = {
                        localId: '',
                        serverId: ''
                    };

                    // 4 音频接口
                    // 4.2 开始录音
                    document.querySelector('#startRecord').onclick = function () {
                        $('#Stop_Voice').show();
                        $('#luyin').show();
                        $('#SitVoice').hide();
                        wx.startRecord({
                            cancel: function () {
                                alert('用户拒绝授权录音');
                            }
                        });
                    };



                    // 4.3 停止录音
                    document.querySelector('#stopRecord').onclick = function () {
                        $('#Stop_Voice').hide();
                        $('#SitVoice').show();
                        wx.stopRecord({
                            success: function (res) {
                                voice.localId = res.localId;
                                if (voice.localId == '') {
                                    alert('请先录制一段声音');
                                    return;
                                }
                                wx.uploadVoice({
                                    localId: voice.localId,
                                    success: function (res) {
                                        voice.serverId = res.serverId;
                                        $.ajax({
                                            type: "POST",
                                            url: "/tools/json_ajax.ashx",
                                            cache: false,
                                            dataType: 'json',
                                            data: {
                                                serverId: res.serverId,
                                                wx_id: 1554,
                                                wx_url:location.href.split('#')[0],
                                                action: 'GetVoiceUrl'
                                            },
                                            success: function (d) {
                                                if (d.success == 1) {
                                                    $('#luyin_url').val(d.url);
                                                } else {
                                                }
                                            }
                                        });
                                    }
                                });
                            },
                            fail: function (res) {
                                alert(JSON.stringify(res));
                            }
                        });
                    };

                    // 4.4 监听录音自动停止
                    wx.onVoiceRecordEnd({
                        complete: function (res) {
                            voice.localId = res.localId;
                            alert('录音时间已超过一分钟');
                            if (voice.localId == '') {
                                alert('请先录制一段声音');
                                return;
                            }
                            wx.uploadVoice({
                                localId: voice.localId,
                                success: function (res) {
                                    voice.serverId = res.serverId;
                                    $.ajax({
                                        type: "POST",
                                        url: "/tools/json_ajax.ashx",
                                        cache: false,
                                        dataType: 'json',
                                        data: {
                                            serverId: res.serverId,
                                            wx_id: 1554,
                                            wx_url:location.href.split('#')[0],
                                            action: 'GetVoiceUrl'
                                        },
                                        success: function (d) {
                                            if (d.success == 1) {
                                                $('#luyin_url').val(d.url);
                                            } else {
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });

                    // 4.5 播放音频
                    document.querySelector('#playVoice').onclick = function () {
                        if (voice.localId == '') {
                            alert('请先录制一段声音');
                            return;
                        }
                        wx.playVoice({
                            localId: voice.localId
                        });
                    };

                    // 4.6 暂停播放音频
                    document.querySelector('#pauseVoice').onclick = function () {
                        wx.pauseVoice({
                            localId: voice.localId
                        });
                    };

                    // 4.7 停止播放音频
                    document.querySelector('#stopVoice').onclick = function () {
                        wx.stopVoice({
                            localId: voice.localId
                        });
                    };

                    // 4.8 监听录音播放停止
                    wx.onVoicePlayEnd({
                        complete: function (res) {
                            alert('录音播放结束');
                        }
                    });

                    // 4.9 下载语音
                    document.querySelector('#downloadVoice').onclick = function () {
                        if (voice.serverId == '') {
                            alert('请先上传声音');
                            return;
                        }
                        wx.downloadVoice({
                            serverId: voice.serverId,
                            success: function (res) {
                                alert('下载语音成功');
                                voice.localId = res.localId;
                            }
                        });
                    };


                });
                wx.error(function (res) {
                    //alert(res);
                });
            }
        }
        var u = location.href.split('#')[0];
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        var u = u.replace("&", "|");
        xmlhttp.open("GET", "/api/open/get_new_jsconfig.aspx?url=" + u, true);
        xmlhttp.send();
    }

    loadXMLDoc();
})();