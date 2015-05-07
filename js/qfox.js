//QFox


(function () {

    var qf = function (selectors) {
            return new nodeList(selectors);
        },

        nodeList = function (selectors) {
            if (selectors.nodeType) {
                selectors = [selectors];
            } else if (typeof selectors == 'string') {
                selectors = document.querySelectorAll(selectors);
            } else if (!(selectors instanceof Array)) {
                return null;
            }

            this.length = selectors.length;
            for (var i = 0; i < this.length; i++) {
                this[i] = selectors[i];
            }

            return this;
        },

        functionArray = [],

        DOMReady = function () {
            for (var i = 0, l = functionArray.length; i < l; i++) {
                functionArray[i]();
            }
            functionArray = null;
            document.removeEventListener('DOMContentLoaded', DOMReady, false);
        };

    qf.extend = function (obj, target) {
        target = target || nodeList.prototype;
        for (var prop in obj) {
            target[prop] = obj[prop];
        }
    };

    qf.extend({


        test1:function (txt) {
            alert(txt);
        },

        prohibitDefault:function (e) {
            if (window.attachEvent) {
                e.returnValue = false;
            } else {
                e.preventDefault();
            }
        },

        prohibitPropagation:function (e) {
            if (window.attachEvent) {
                e.cancelBubble = true
            } else {
                e.stopPropagation();
            }
        },

        ajaxConnect:function (action, source) { //action:get/post, source: url
            var ajaxConnect, async = true;
            if (window.XMLHttpRequest) {// Post ie6 and modern browsers
                ajaxConnect = new XMLHttpRequest();
            }
            else {// IE6
                ajaxConnect = new ActiveXObject("Microsoft.XMLHTTP");
            }
            ajaxConnect.onreadystatechange = function () {
                if (ajaxConnect.readyState == 4 && ajaxConnect.status == 200) {
                    console.log(ajaxConnect.responseText);
                }
            }
            ajaxConnect.open(action, source, async);
            ajaxConnect.send();
            return ajaxConnect;
        },

        id:function (id) {
            return document.getElementById(id);
        },

        className:function (cn, root) {
            var el = this;
            if (!root) {
                root = document;
            }
            for (var r = [], el = root.getElementsByTagName('*'), i = el.length; i--;) {
                if ((' ' + el[i].className + ' ').indexOf(' ' + cn + ' ') > -1) {
                    r.push(el[i]);
                }
            }
            return r;
        },

        tagName:function (name, root) {
            if (!root) {
                root = document;
            }
            return root.getElementsByTagName(name);
        },

//Local object
        setObj:function (key, value) {
            if (typeof localStorage == "object") {
                localStorage.setItem(key, JSON.stringify(value));
            }
        },

        getObj:function (key) {
            if (typeof localStorage == "object") {
                if (JSON.parse(localStorage.getItem(key))) {
                    return JSON.parse(localStorage.getItem(key));
                } else {
                    console.log('object not found')
                }
            }
        },

        deleteObj:function (key, value) {
            if (typeof localStorage == "object") {
                localStorage.removeItem(key)
            }
        },

// progress meter
        progressBar:function (newValue) {
            progressMeter.value = newValue;
            progressMeter.getElementsByTagName('span')[0].textContent = newValue;
        },

// Execute functions on DOM ready
        ready:function (fn) {
            if (functionArray.length == 0) {
                document.addEventListener('DOMContentLoaded', DOMReady, false);
            }

            functionArray.push(fn);
        },

        hasClass:function (el, className) {
            return new RegExp('(^|\\s)' + className + '(\\s|qf)').test(el.className);
        },

        hasAttr:function (el, attr) {
            return new RegExp('(^|\\s)' + attr + '(\\s|qf)').test(el.attr);
        }
    }, qf);

    nodeList.prototype = {
        each:function (callback) {
            for (var i = 0; i < this.length; i++) {
                callback.call(this[i]);
            }

            return this;
        },

        css:function (attrib, value) {
            if (typeof attrib == 'string' && value === undefined) {
                return window.getComputedStyle(this[0], null).getPropertyValue(attrib);
            }

            if (typeof attrib != 'object') {
                attrib[attrib] = value;
            }

            return this.each(function () {
                for (var i in attrib) {
                    this.style[i] = attrib[i];
                }
            });
        },

        item:function (num) {
            return qf(this[num]);
        },

        bind:function (type, fn, capture) {
            return this.each(function () {
                if (window.addEventListener) {
                    this.addEventListener(type, fn, capture ? true : false);
                } else {
                    this.attachEvent("on" + type, fn, true);
                }

            });
        },

        unbind:function (type, fn, capture) {
            return this.each(function () {
                this.removeEventListener(type, fn, capture ? true : false);
            });
        },

        hide:function () {
            return this.each(function () {
                this.style.display = 'none';
            });
        },

        show:function () {
            return this.each(function () {
                this.style.display = 'block';
            });
        },

        animate:function (dir,distance,speed) {
            var el = this[0];
            var dist = distance;
            el.style.position ='absolute';
            var int=self.setInterval(function(){move(el,dir,distance)},speed);
            function move(el,dir,distance) {
                if (el.offsetLeft) {
                    var posx = el.offsetLeft;
                } else {
                    var posx = el.clientLeft;
                }
                if (dir == 'left') {
                    posx--;
                } else {
                    posx++;
                }
                el.style.left = posx+'px';
                dist--;
                if (dist == 0) {
                    int=window.clearInterval(int)
                }
            }
        },


        //gets current position 'left'.
        //invoke interval with...
        //for loop adds/reduces distance count.

        remove:function () {
            return this.each(function () {
                this.removeChild;
            });
        },

        even:function () {
            var result = [], even, i = 0, l;
            this.each(function () {
                even = this;
                if (i % 2 == 1) {
                    result[result.length] = even;
                    even.record = true;
                }
                i++;
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        odd:function () {
            var result = [], odd, i = 0, l;
            this.each(function () {
                odd = this;
                if (i % 2 == 0) {
                    result[result.length] = odd;
                    odd.record = true;
                }
                i++;
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        only:function (num) {
            var result = [], only, i = 0;
            this.each(function () {
                only = this;
                if (i == num) {
                    result[result.length] = only;
                    only.record = true;
                }
                i++;
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        allBut:function (num) {
            var result = [], allBut, i = 0;
            this.each(function () {
                allBut = this;
                if (i != num) {
                    result[result.length] = allBut;
                    allBut.record = true;
                }
                i++;
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        whatTagName:function () {
            var result = [], tagName, i, l;
            this.each(function () {
                tagName = this.tagName;
                if (!tagName.record) {
                    result[result.length] = tagName;
                    tagName.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        prev:function () {
            var result = [], prev, i, l;
            this.each(function () {
                prev = this.previousElementSibling;
                if (!prev.record) {
                    result[result.length] = prev;
                    prev.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        next:function () {
            var result = [], next, i, l;
            this.each(function () {
                next = this.nextElementSibling;
                if (!next.record) {
                    result[result.length] = next;
                    next.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        last:function () {
            var result = [], last, i, l;
            this.each(function () {
                last = this.lastElementChild;
                if (!last.record) {
                    result[result.length] = last;
                    last.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        first:function () {
            var result = [], first, i, l;
            this.each(function () {
                first = this.firstElementChild;
                if (!first.record) {
                    result[result.length] = first;
                    first.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

        parent:function () {
            var result = [], parent, i, l;
            this.each(function () {
                parent = this.parentNode;
                if (!parent.record) {
                    result[result.length] = parent;
                    parent.record = true;
                }
            });

            return qf(result).each(function () {
                delete this.record;
            });
        },

// Returns the first element className
        hasClass:function (className) {
            return qf.hasClass(this[0], className);
        },

// Returns the first element attr
        hasAttr:function (attr) {
            return qf.hasAttr(this[0], attr);
        },

// Add one or more classes to all elements
        addAttr:function (name, value) {
            var attr = arguments;

            for (var i = 0, l = attr.length; i < l; i++) {
                this.each(function () {
                    if (!qf.hasAttr(this, attr[i])) {
                        this.setAttribute(name, value);
                    }
                });
            }

            return this;
        },

// Remove one or more classes from all elements
        removeAttr:function (name) {
            var attr = arguments;

            for (var i = 0, l = attr.length; i < l; i++) {
                this.each(function () {
                    this.removeAttribute(name);
                });
            }

            return this;
        },

// Add one or more attribute to all elements
        addClass:function () {
            var className = arguments;

            for (var i = 0, l = className.length; i < l; i++) {
                this.each(function () {
                    if (!qf.hasAttr(this, attr[i])) {
                        this.className = this.className ? this.className + ' ' + className[i] : className[i];
                    }
                });
            }

            return this;
        },

        removeClass:function () {
            var className = arguments;

            for (var i = 0, l = className.length; i < l; i++) {
                this.each(function () {
                    this.className = this.className.replace(new RegExp('(^|\\s+)' + className[i] + '(\\s+|qf)'), ' ');
                });
            }

            return this;
        },

        html:function (value) {
            if (value === undefined) {
                return this[0].innerHTML;
            }

            return this.each(function () {
                this.innerHTML = value;
            });
        },

        text:function () {
            var text;
            this.each(function () {
                this.innerHTML;
            });
            return this;
        },

        text1:function () {

            this.each(function () {
                //if (document.body.innerText) {
                // return this.innerText;
                //} else {
                var txt = this;
                alert(txt)
                return txt
                //this.innerHTML.replace(/\&lt;br\&gt;/gi,"\n").replace(/(&lt;([^&gt;]+)&gt;)/gi, "");
                //}

            });
        },

        width:function (value) {
            if (value === undefined) {
                return this[0].clientWidth;
            }

            return this.each(function () {
                this.style.width = value + 'px';
            });
        },

        height:function (value) {
            if (value === undefined) {
                return this[0].clientHeight;
            }

            return this.each(function () {
                this.style.height = value === '' ? '' : value + 'px';
            });
        }
    }

    window.qf = qf;

})();





