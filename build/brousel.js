/*
    @name Brousel
    @author Guilherme Iazzetta
*/
let _brouselList = [];
let timerToResize = null;
const brouselManagerEvent = function(){
    clearTimeout(timerToResize);
    timerToResize = setTimeout(function(){
        if (_brouselList.length > 0) {
            for (let i in _brouselList) {
                _brouselList[i].build();
            }
        }
    }, 150);
}
window.addEventListener('resize', brouselManagerEvent);
var _window = typeof window !== 'undefined' ? window : this;
class Brousel {
    constructor(element, settings) {
        this.id = Math.random();
        this.element = element;
        this.index = 0;
        this.width = null;
        this.marginTop = settings.marginTop || 0;
        this.marginBottom = settings.marginBottom || 0;
        this.marginLeft = settings.marginLeft || 0;
        this.marginRight = settings.marginRight || 0;
        this.arrows = settings.arrows;
        this.dots = settings.dots;
        this.autoplay = settings.autoplay;
        this.speed = settings.speed || 3000;
        this.speed = settings.speed || 3000;
        this.toScroll = null;
        this.responsive = settings.responsive || [];
        this.slidesToShow = settings.slidesToShow || 3;
        this.slidesToScroll = settings.slidesToScroll || this.slidesToShow;
        this.prev_content = settings.prev_content || '<';
        this.next_content = settings.next_content || '>';
        this.dot_content = settings.dot_content || '-';
        this.totalWidthContent = null;
        this.contents = null;
        this.contentsCount = null;
        this.animationTimeout = null;
        this.autoplayInterval = null;
        this.waitInteractionInterval = null;
        this.swipeControl = null;
        this.canSlide = true;
        this.eventsCreated = false;
        this.lastOffsetLeft = this.element.offsetLeft;
        this.parent = this.element.parentElement;
        this.toShow = this.slidesToShow;
        this.toScroll = this.slidesToScroll;
        this.debug = settings.debug || false;
        this.easing = function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        }
        
        this.build();
        _brouselList.push(this);
    }
    
    build() {
        let _ = this;
        this.index = 0;
        this.parent = this.element.parentElement;
        this.element.setAttribute('bid', this.id);
        this.element.style.cssText = `
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
        `
        
        // calc sizes of parent and build items size
        this.calculateSizes();
        
        // get number of indexes
        let nidx = (this.contentsCount / this.toScroll);
        this.nIndexes = nidx > 0 ? nidx-1:0;
        
        // dots and arrows if more than 1 index
        try { document.querySelector(`.brousel-control[id="${this.id}"]`).remove(); } catch(e) { /* don't exist */ }
        if (this.nIndexes > 1 && (this.arrows || this.dots)) {
            // build dots
            let dots = "";
            if ( this.dots ) {
                for(let i = 0; i <= this.nIndexes; i++)
                dots += `<button data-index="${i*this.toScroll}" class="brousel-dot${i == 0 ? ' selected':''}" id="${this.id}">${this.dot_content}</button>`;
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
        
        this.slideIndex(this.index, false);
        this.autoPlay();
    }
    
    responsiveCheck() {
        // update width
        this.width = this.element.offsetWidth;
        
        // default
        this.toScroll = this.slidesToScroll;
        this.toShow = this.slidesToShow;
        
        // check responsive
        for (let i in this.responsive) {
            if ( window.screen.width <= this.responsive[i].breakpoint ) {
                for (let key in this.responsive[i].settings) this[key] = this.responsive[i].settings[key];
            }
        }
        if (this.debug) {
            console.log(this)
        }
    }
    /* If autoplays true, number of Dots > 0, start slide! */
    autoPlay() {
        if (this.autoplay && this.nIndexes > 1) {
            let _ = this;
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(function(){
                _.slideRight();
            }, this.speed);
        }
    }
    
    waitInteractionAndPlay() {
        let _ = this;
        clearInterval(this.autoplayInterval);
        clearInterval(this.waitInteractionInterval);
        this.waitInteractionInterval = setTimeout(function(){
            _.autoPlay();
        }, 3000);
    }
    
    calculateSizes() {
        this.responsiveCheck();
        this.contents = this.element.querySelectorAll('li');
        this.contentsCount = this.contents.length;
        this.contents.forEach((el) => {
            let margin_horizontal = this.marginLeft + this.marginRight;
            let margin_vertical = this.marginTop + this.marginBottom;
            el.style.width = ((this.width / this.toShow) - margin_horizontal) + 'px';
            el.style.marginLeft = `${this.marginLeft}px`;
            el.style.marginRight = `${this.marginRight}px`;
            el.style.marginTop = `${this.marginTop}px`;
            el.style.marginBottom = `${this.marginBottom}px`;
        });
        this.element.style.height = this.contents[0].offsetHeight;
    }
  
    startControlEvents() {
        let _ = this;
        if (this.arrows) {
            document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener('click', (e) => {
                _.slideLeft()
            })
            document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener('click', (e) => {
                _.slideRight()
            })
        }
        if (this.dots) {
            document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
                el.addEventListener('click', function(e) {
                    let index = e.target.getAttribute('data-index');
                    _.index = Number(index);
                    _.slideIndex(_.index);
                })
            })
        }
        if (!this.eventsCreated) {
            if (this.dots || this.arrows) {
                this.parent.addEventListener("touchstart",function(event){
                    if(event.touches.length === 1)
                        _.swipeControl = event.touches.item(0).clientX;
                    else
                        _.swipeControl = null;
                }, {passive:true});
                
                this.parent.addEventListener("touchend",function(event){
                    let offset = 40;
                    if(_.swipeControl){
                        let end = event.changedTouches.item(0).clientX;

                        if(end > _.swipeControl + offset){
                            _.slideLeft();
                        }
                        if(end < _.swipeControl - offset ){
                            _.slideRight();
                        }
                    }
                }, {passive:true});
                this.eventsCreated = true;
            }
        }
    }
    
    bscrollTo(scrollTarget, scrollDuration, callback) {
        var _ = this;
        var start = new Date().getTime()
        var animateIndex = this.animate_id;
        var animate = function () {
            var now = new Date().getTime() - start
            _.element.scrollLeft =
                _.element.scrollLeft +
                (scrollTarget - _.element.scrollLeft) *
                _.easing(0, now, 0, 1, scrollDuration)
                if (now < scrollDuration && animateIndex === _.animate_id) {
                    _window.requestAnimationFrame(animate)
                } else {
                    _.element.scrollLeft = scrollTarget
                    callback && callback.call()
                }
        }
        _window.requestAnimationFrame(animate)
    }

    async slideIndex() {
        if (!this.canSlide) return;
        let _ = this;
        clearTimeout(this.animationTimeout);
        this.animationTimeout = setTimeout(function(){
            _.animate_id = Math.random();
            _.canSlide = false;
            _.bscrollTo(_.contents[_.index].offsetLeft - _.element.offsetLeft, 100, function(){
                if (_.dots) {
                    try {
                        document.querySelectorAll(`.brousel-dot[id="${_.id}"]`).forEach(function(el){
                            el.classList.remove('selected');
                        })
                        document.querySelector(`.brousel-dot[id="${_.id}"][data-index="${_.index}"]`).classList.add('selected');
                    } catch(e) { /* Don't have dots */}
                }
                _.canSlide = true;
                _.waitInteractionAndPlay();
            })
        }, 100)
    }
    slideLeft(){
        if ( (this.index + this.toScroll) == this.toScroll ) {
            this.index = this.contentsCount - this.toScroll;
        } else {
            this.index -= this.toScroll;
        }
        this.slideIndex( this.index );
    }
    slideRight(){
        if ( (this.index + this.toScroll) == this.contentsCount ) {
            this.index = 0;
        } else {
            this.index += this.toScroll;
        }
        this.slideIndex( this.index );
    }
}
