!function(){"use strict";function o(){var o=window,t=document;if(!("scrollBehavior"in t.documentElement.style&&!0!==o.__forceSmoothScrollPolyfill__)){var l,e=o.HTMLElement||o.Element,r=468,i={scroll:o.scroll||o.scrollTo,scrollBy:o.scrollBy,elementScroll:e.prototype.scroll||n,scrollIntoView:e.prototype.scrollIntoView},s=o.performance&&o.performance.now?o.performance.now.bind(o.performance):Date.now,c=(l=o.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(l)?1:0);o.scroll=o.scrollTo=function(){void 0!==arguments[0]&&(!0!==f(arguments[0])?h.call(o,t.body,void 0!==arguments[0].left?~~arguments[0].left:o.scrollX||o.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:o.scrollY||o.pageYOffset):i.scroll.call(o,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:o.scrollX||o.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:o.scrollY||o.pageYOffset))},o.scrollBy=function(){void 0!==arguments[0]&&(f(arguments[0])?i.scrollBy.call(o,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):h.call(o,t.body,~~arguments[0].left+(o.scrollX||o.pageXOffset),~~arguments[0].top+(o.scrollY||o.pageYOffset)))},e.prototype.scroll=e.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==f(arguments[0])){var o=arguments[0].left,t=arguments[0].top;h.call(this,this,void 0===o?this.scrollLeft:~~o,void 0===t?this.scrollTop:~~t)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");i.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},e.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==f(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):i.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},e.prototype.scrollIntoView=function(){if(!0!==f(arguments[0])){var l=function(o){for(;o!==t.body&&!1===(e=p(l=o,"Y")&&a(l,"Y"),r=p(l,"X")&&a(l,"X"),e||r);)o=o.parentNode||o.host;var l,e,r;return o}(this),e=l.getBoundingClientRect(),r=this.getBoundingClientRect();l!==t.body?(h.call(this,l,l.scrollLeft+r.left-e.left,l.scrollTop+r.top-e.top),"fixed"!==o.getComputedStyle(l).position&&o.scrollBy({left:e.left,top:e.top,behavior:"smooth"})):o.scrollBy({left:r.left,top:r.top,behavior:"smooth"})}else i.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function n(o,t){this.scrollLeft=o,this.scrollTop=t}function f(o){if(null===o||"object"!=typeof o||void 0===o.behavior||"auto"===o.behavior||"instant"===o.behavior)return!0;if("object"==typeof o&&"smooth"===o.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+o.behavior+" is not a valid value for enumeration ScrollBehavior.")}function p(o,t){return"Y"===t?o.clientHeight+c<o.scrollHeight:"X"===t?o.clientWidth+c<o.scrollWidth:void 0}function a(t,l){var e=o.getComputedStyle(t,null)["overflow"+l];return"auto"===e||"scroll"===e}function d(t){var l,e,i,c,n=(s()-t.startTime)/r;c=n=n>1?1:n,l=.5*(1-Math.cos(Math.PI*c)),e=t.startX+(t.x-t.startX)*l,i=t.startY+(t.y-t.startY)*l,t.method.call(t.scrollable,e,i),e===t.x&&i===t.y||o.requestAnimationFrame(d.bind(o,t))}function h(l,e,r){var c,f,p,a,h=s();l===t.body?(c=o,f=o.scrollX||o.pageXOffset,p=o.scrollY||o.pageYOffset,a=i.scroll):(c=l,f=l.scrollLeft,p=l.scrollTop,a=n),d({scrollable:c,method:a,startTime:h,startX:f,startY:p,x:e,y:r})}}"object"==typeof exports&&"undefined"!=typeof module?module.exports={polyfill:o}:o()}();
/*
    @name Brousel
    @author Guilherme Iazzetta
*/
let _brouselList = [];
let _brouselDebounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
window.addEventListener('resize', _brouselDebounce(function(e) {
    if (_brouselList.length > 0) {
        for (let i in _brouselList) {
            _brouselList[i].build();
        }
    }
}, 200, false), false);

class Brousel {
    constructor(element, settings) {
        this.id = Math.random();
        this.element = element;
        this.index = 0;
        this.width = settings.width || '100%';
        this.margin_horizontal = settings.margin_horizontal || 0;
        this.margin_vertical = settings.margin_vertical || 0;
        this.arrows = settings.arrows;
        this.dots = settings.dots;
        this.autoplay = settings.autoplay;
        this.speed = settings.speed || 3000;
        this.slidesCounter = null;
        this.slidesToShow = settings.slidesToShow || 3;
        this.responsiveToShow = settings.responsiveToShow || 1;
        this.responsiveSizeToChange = settings.responsiveSizeToChange || 400;
        this.prev_content = settings.prev_content || '<';
        this.next_content = settings.next_content || '>';
        this.dot_content = settings.dot_content || '-';
        this.totalWidthContent = null;
        this.contents = null;
        this.contentsCount = null;
        this.autoplayInterval = null;
        this.swipeControl = null;
        this.canSlide = true;
        this.eventsCreated = false;
        
        this.build();
        _brouselList.push(this);
    }
    
    build() {
        let _this = this;
        this.responsiveCheck( window );
        this.index = 0;
        this.parent = this.element.parentElement;
        this.element.setAttribute('id', this.id);
        this.element.style.cssText = `
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            padding: 0em;
            margin: 0em;
            margin: 0em;
        `
        
        // calc sizes of parent and build items size
        this.calculateSizes();
        
        // get number of indexes
        let nidx = (this.contentsCount / this.slidesCounter);
        this.nIndexes = nidx > 0 ? nidx-1:0;
        
        // dots and arrows if more than 1 index
        try { document.querySelector(`.brousel-control[id="${this.id}"]`).remove(); } catch(e) { /* don't exist */ }
        if (this.nIndexes > 1 && (this.arrows || this.dots)) {
            // build dots
            let dots = "";
            if ( this.dots ) {
                for(let i = 0; i <= this.nIndexes; i++)
                dots += `<button data-index="${i*this.slidesCounter}" class="brousel-dot${i == 0 ? ' selected':''}" id="${this.id}">${this.dot_content}</button>`;
            }
            // build controls
            let insertHtml = `
                <div class="brousel-control" id="${this.id}">
                    ${this.arrows ? `<div class="brousel-prev" id="${this.id}">${this.prev_content}</div>`:''}
                    ${this.dots ? dots:''}
                    ${this.arrows ? `<div class="brousel-next" id="${this.id}">${this.next_content}</div>`:''}
                </div>
            `
            this.element.insertAdjacentHTML('afterend', insertHtml);
            
            // start controll events
            this.startControlEvents();
        }
        
        this.slideIndex(this.index);
        this.autoPlay();
    }
    
    responsiveCheck( target ) {
        if (target.outerWidth <= this.responsiveSizeToChange)
            this.slidesCounter = this.responsiveToShow;
        else
            this.slidesCounter = this.slidesToShow;
    }
    /* If autoplays true, number of Dots > 0, start slide! */
    autoPlay() {
        if (this.autoplay && this.nIndexes > 1) {
            let _this = this;
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(function(){
                _this.slideRight();
            }, this.speed);
        }
    }
    
    waitInteractionAndPlay() {
        let _this = this;
        clearInterval(this.autoplayInterval);
        setTimeout(function(){
            _this.autoPlay();
        }, 3000);
    }
    
    calculateSizes() {
        let parentElementWidth = this.parent.offsetWidth;
        this.contents = this.element.querySelectorAll('li');
        this.contentsCount = this.contents.length;
        this.contents.forEach((el) => {
            el.style.width = ((parentElementWidth / this.slidesCounter) - (this.margin_horizontal * 2)) + 'px';
            el.style.margin = `${this.margin_vertical}px ${this.margin_horizontal}px`;
        });
        this.element.style.height = this.contents[0].offsetHeight;
    }
  
    startControlEvents() {
        let _this = this;
        if (this.arrows) {
            document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener('click', (e) => {
                _this.slideLeft()
            })
            document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener('click', (e) => {
                _this.slideRight()
            })
        }
        if (this.dots) {
            document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
                el.addEventListener('click', function(e) {
                    let index = e.target.getAttribute('data-index');
                    _this.index = Number(index);
                    _this.slideIndex(_this.index);
                })
            })
        }
        if (!this.eventsCreated) {
            if (this.dots || this.arrows) {
                this.element.addEventListener("touchstart",function(event){
                    if(event.touches.length === 1)
                        _this.swipeControl = event.touches.item(0).clientX;
                    else
                        _this.swipeControl = null;
                }, {passive:true});
                
                this.element.addEventListener("touchend",function(event){
                    let offset = 100;
                    if(_this.swipeControl){
                        let end = event.changedTouches.item(0).clientX;

                        if(end > _this.swipeControl + offset){
                            _this.slideLeft();
                        }
                        if(end < _this.swipeControl - offset ){
                            _this.slideRight();
                        }
                    }
                }, {passive:true});
                this.eventsCreated = true;
            }
        }
    }
    async slideIndex() {
        if (!this.canSlide) return;
        this.canSlide = false;
        if (this.dots) {
            try {
                document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
                    el.classList.remove('selected');
                })
                document.querySelector(`.brousel-dot[id="${this.id}"][data-index="${this.index}"]`).classList.add('selected');
            } catch(e) { /* Don't have dots */}
        }
        this.element.scroll({
            left: this.contents[this.index].offsetLeft - this.element.offsetLeft,
            behavior: "smooth"
        });
        await new Promise(res => setTimeout(res, 600));
        this.canSlide = true;
        this.waitInteractionAndPlay();
    }
    slideLeft(){
        if ( (this.index + this.slidesCounter) == this.slidesCounter ) {
            this.index = this.contentsCount - this.slidesCounter;
        } else {
            this.index -= this.slidesCounter;
        }
        this.slideIndex( this.index );
    }
    slideRight(){
        if ( (this.index + this.slidesCounter) == this.contentsCount ) {
            this.index = 0;
        } else {
            this.index += this.slidesCounter;
        }
        this.slideIndex( this.index );
    }
}
