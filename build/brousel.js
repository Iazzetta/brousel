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
        this.canSlide = true;
        
        this.responsiveCheck( window );
        this.build();
        
        let _this = this;
        window.addEventListener('resize', function(e) {
            _this.responsiveCheck( e.target );
            _this.build();
        });
        return this;
    }
    
    build() {
        let _this = this;
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
        // console.log('parentElementWidth', parentElementWidth)
        this.contents = this.element.querySelectorAll('li');
        this.contentsCount = this.contents.length;
        this.contents.forEach((el) => {
            el.style.width = ((parentElementWidth / this.slidesCounter) - (this.margin_horizontal * 2)) + 'px';
            el.style.margin = `${this.margin_vertical}px ${this.margin_horizontal}px`;
        });
        this.element.style.height = this.contents[0].offsetHeight;
    }
  
    startControlEvents() {
        const _this = this;
        if (this.arrows) {
            document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener('click', (e) => {
                _this.slideLeft()
                _this.waitInteractionAndPlay();
            })
            document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener('click', (e) => {
                _this.slideRight()
                _this.waitInteractionAndPlay();
            })
        }
        if (this.dots) {
            document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
                el.addEventListener('click', (e) => {
                    let index = e.target.getAttribute('data-index');
                    _this.index = Number(index);
                    _this.slideIndex(_this.index);
                    _this.waitInteractionAndPlay();
                })
            })
        }
    }
    async slideIndex(index) {
        if (!this.canSlide) return;
        this.canSlide = false;
        this.index = index;
        if (this.dots) {
            try {
                document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
                    el.classList.remove('selected');
                })
                document.querySelector(`.brousel-dot[id="${this.id}"][data-index="${index}"]`).classList.add('selected');
            } catch(e) { /* Don't have dots */}
        }
        this.element.scrollTo({
            left: (this.index == 0 ? this.contents[index].clientLeft:this.contents[index].offsetLeft - 25),
            behavior: 'smooth'
        })
        await new Promise(res => setTimeout(res, 600));
        this.canSlide = true;
    }
    slideLeft(){
        let index = this.index;
        if ( (index + this.slidesCounter) == this.slidesCounter ) {
            index = this.contentsCount - this.slidesCounter;
        } else {
            index -= this.slidesCounter;
        }
        this.slideIndex( index );
    }
    slideRight(){
        let index = this.index;
        if ( (index + this.slidesCounter) == this.contentsCount ) {
            index = 0;
        } else {
            index += this.slidesCounter;
        }
        this.slideIndex( index );
    }
}
