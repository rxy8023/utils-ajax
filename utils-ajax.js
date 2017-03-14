/**
 * @author Alex ren <rxy0238023@gmail.com>
 */


(function (global) {

  var tools = {
      createXhrObject:

        /**
         * 创建XHR对象函数
         * @return {Object} XHR对象实例 
         */

        function createXhrObject() {
          var xhr;
          try {
            window.XMLHttpRequest ? (xhr = new XMLHttpRequest()) : (xhr = new ActiveXObject('Microsoft.XMLHTTP'));
          } catch (e) {
            throw new TypeError('你的浏览器不支持XHR对象');
          }
          return xhr;
        },

      mergeOption:

        /**
         * 合并对象处理函数
         * @param {Object} target - 被合并的对象
         * @param {Object} source - 合并对象的源
         * @return {Object} 合并完成的对象
         */

        function mergeOption(target, source) {
          if (Object.assign) {
            return Object.assign(target, source);
          } else {

            for (var key in source) {
              if (source.hasOwnProperty(key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        },
      openRequest:

        /**
         * 处理数据
         * @param {string} type - ajax的请求方法
         * @param {Object} data - ajax发送的数据
         */

        function (xhr, options) {
          switch (options.type) {
            case 'GET':
              var param = '?',
                dataKeys = this.keys(options.data);
              if (dataKeys.length !== 0) {
                for (var i = 0; i < datakeys.length; i++) {
                  param += dataKeys[i] + '&' + data[dataKeys[i]];
                }
              }
              xhr.open('GET', options.url + param.substring(0, param.length - 1) + (options.cache ? '' : '&date=' + Date.now()), options.async);
              break;

            default:
              xhr.open(options.type, options.url, options.async);
              break;
          }
        },
      keys:

        /**
         * 取对象键名函数
         * @param {Object} obj - 目标对象
         * @return {Array} 由对象键名组成的数组
         */

        function (obj) {
          if (Object.keys) {
            return Object.keys(obj);
          } else {
            var keys = [];
            for (var key in obj) {
              if (obj.hasOwnProperty[key]) {
                keys.push(key);
              }
            }
            return keys;
          }
        },

      setHeader:

        /**
         * 处理header函数
         * @param {XMLRequest} xhr - xhr对象实例对象
         * @param {Object} headers - 请求头对象
         */

        function (xhr, headers) {
          var keys = this.keys(headers);
          if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
              if (headers.hasOwnProperty(keys[i])) {
                xhr.setRequestHeader(keys[i], headers[keys[i]]);
              }
            }
          }
        },

    },

    /**
     * ajax请求函数
     * @param {string} url - 请求地址
     * @param {Object} options - 请求参数
     * @return {void}
     */

    ajax = function (url, options) {

      var defaultOpt = {
        timeout: 0,
        dataType: '',
        isFormdata: false,
        requestHeader: {},
        async: true,
        url: '',
        type: 'GET',
        data: '',
        cache: true,
        success: function (data) {},
        error: function (error) {},
        timeoutFunc: function (timeout, timeoutReason) {
          console.log(timeoutReason);
        },
        contentType: 'application/x-www-form-urlencoded',
        overrideMimeType: false
      };

      if (typeof url === 'object') {
        options = url;
        url = options.url;
      }
      options.url = url;
      tools.mergeOption(defaultOpt, options);

      defaultOpt.type = defaultOpt.type.toUpperCase();

      var xhr = tools.createXhrObject();

      tools.openRequest(xhr, defaultOpt);

      xhr.onload === undefined ? (xhr.ie8 = true) : (xhr.ie8 = false);

      if (xhr.ie8) {
        xhr.onload = function (e) {
          if ((this.status >= 200 && this.status < 300) || this.status === 304) {
            defaultOpt.dataType === 'json' ? (defaultOpt.success(JSON.parse(xhr.responseText))) : (defaultOpt.success(xhr.responseText));
          } else {
            defaultOpt.error(xhr, xhr.statusText);
          }
        };
      }

      xhr.onerror = function (e) {
        defaultOpt.error(xhr, xhr.statusText);
      };

      defaultOpt.async ? (xhr.timeoutEvent = defaultOpt.timeout) : null;

      xhr.overrideMimeType ? (xhr.overrideMimeType('text/javascript')) : null;

      xhr.onreadystatechange = function () {
        switch (xhr.readyState) {
          case 1:
            defaultOpt.beforeSending && defaultOpt.beforeSending();
            break;
          case 2:
            defaultOpt.onHeaderRecieve && defaultOpt.onHeaderRecieve();
            break;
          case 3:
            break;
          case 4:
            if (!xhr.ie8) {
              if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                defaultOpt.dataType === 'json' ? (defaultOpt.success(JSON.parse(xhr.responseText))) : (defaultOpt.success(xhr.responseText));
              } else {
                defaultOpt.error(xhr, xhr.statusText);
              }
            } else {
              xhr.onload();
            }
        };
      }

      xhr.ontimeout = function (e) {
        defaultOpt.timeoutFunc(defaultOpt.timeout, e ? (e.type) : ('timeoutEvent'));
        xhr.abort();
      }
      xhr.responseType && (xhr.responseType = defaultOpt.dataType);
      tools.setHeader(xhr, defaultOpt.requestHeader);
      xhr.send(defaultOpt.data || null);
    }

  ajax.post = function (url, options) {
    options = options || {};
    options.type = 'POST';
    this(url, options);
  };

  global.ajax = ajax;

})(this);