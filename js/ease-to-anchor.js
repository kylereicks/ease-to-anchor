;(function(window, document, undefined){
  'use strict';

  var EaseToAnchor = function(_element, _easing, _duration, _offsetTop){
    var easeToAnchorNavigationComplete = new CustomEvent('easeToAnchorNavigationComplete'),
    el = _element,
    options = window.easeToOptions || {},
    easeStyle = _easing || 'linear',
    duration = _duration || 1000,
    offsetTop = _offsetTop || 0,
    windowBox = {
      height: window.innerHeight,
      width: window.innerWidth
    },
    htmlElementBox = document.getElementsByTagName('html')[0].getBoundingClientRect(),
    bodyElementBox = document.getElementsByTagName('body')[0].getBoundingClientRect(),
    scrollToElementBox = el.getBoundingClientRect(),
    scrollFromX = document.body.scrollLeft || document.documentElement.scrollLeft,
    scrollFromY = document.body.scrollTop || document.documentElement.scrollTop,
    maxScrollY = scrollFromY - Math.round(htmlElementBox.height - windowBox.height),
    maxScrollX = scrollFromX - Math.round(htmlElementBox.width - windowBox.width),
    distanceX =  windowBox.width >= htmlElementBox.width ? 0 : scrollToElementBox.left,
    distanceY =  bodyElementBox.bottom - windowBox.height < scrollToElementBox.top ? Math.abs(maxScrollY) : scrollToElementBox.top,

    animate = {
      id: 0,
      stop: function(){
        if(animate.id){
          window.cancelAnimationFrame(animate.id);
        }
        return this;
      },
      slide: function(existingFrame){
        var frame = existingFrame || 0,
        totalFrames = distanceY || distanceX ? duration / (1000 / 60) : -1;

        if(totalFrames >= frame){
          frame = frame + 1;
          window.scrollTo(utilities.getXPosition(frame / totalFrames, easeStyle), utilities.getYPosition(frame / totalFrames, easeStyle));
          animate.id = window.requestAnimationFrame(function(){animate.slide(frame);});
        }else{
          window.cancelAnimationFrame(animate.id);
          el.dispatchEvent(easeToAnchorNavigationComplete);
        }
      },
    },
    utilities = {
      getXPosition: function(progress, easeStyle){
        return  scrollFromX + (distanceX * easing[easeStyle](progress));
      },
      getYPosition: function(progress, easeStyle){
        return scrollFromY + (distanceY * easing[easeStyle](progress));
      }
    },
    easing = {
      easeOut: function(n){
        return Math.pow(n, 12 / 25);
      },
      easeIn: function(n){
        return Math.pow(n, 1.7);
      },
      easeInOut: function(n){
        var q = 0.48 - n / 1.04,
        Q = Math.sqrt(0.1734 + q * q),
        x = Q - q,
        X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
        y = -Q - q,
        Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
        t = X + Y + 0.5;
        return (1 - t) * 3 * t * t + t * t * t;
      },
      backIn: function(n){
        var s = 1.70158;
        return n * n * ((s + 1) * n - s);
      },
      backOut: function(n){
        var s = 1.70158;
        n = n - 1;
        return n * n * ((s + 1) * n + s) + 1;
      },

      elastic: function(n){
        if(n == Boolean(n)){
          return n;
        }
        return Math.pow(2, -10 * n) * Math.sin((n - 0.075) * (2 * Math.PI) / 0.3) + 1;
      },
      bounce: function(n){
        var s = 7.5625,
        p = 2.75,
        l;

        if(n < (1 / p)){
          l = s * n * n;
        }else{
          if(n < (2 / p)){
            n -= (1.5 / p);
            l = s * n * n + 0.75;
          }else{
            if(n < (2.5 / p)){
              n -= (2.25 / p);
              l = s * n * n + 0.9375;
            }else{
              n -= (2.625 / p);
              l = s * n * n + 0.984375;
            }
          }
        }
        return l;
      },
      linear: function(n){
        return n;
      }
    };
    options[el.id] = options[el.id] || {};
    easeStyle = _easing || options[el.id].easeStyle || options.easeStyle || 'linear';
    duration = +_duration || +options[el.id].duration || +options.duration || 1000;
    offsetTop = +_offsetTop || +options[el.id].offsetTop || +options.offsetTop || 0;
    distanceY = distanceY + offsetTop; 
    return animate;
  };

  document.addEventListener('click', function(e){
    var element = null,
    easeToAnchor = null;
    if('A' === e.target.nodeName){
      element = document.getElementById(e.target.hash.substring(1));
      if(element){
        e.preventDefault();
        easeToAnchor = new EaseToAnchor(element);
        easeToAnchor.slide();
      }

    }
  }, false);

})(this, document);
