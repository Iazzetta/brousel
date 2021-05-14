class Brousel {
    constructor(element, settings) {
        this.id = Math.random();
        this.element = element;
        this.index = 0;
        this.width = settings.width || '100%';
        this.margin_horizontal = settings.margin_horizontal || 0;
        this.margin_vertical = settings.margin_vertical || 0;
        this.arrows = settings.arrows || true;
        this.dots = settings.dots || false;
        this.autoplay = settings.autoplay || false;
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
        
        this.build();
        
        let _this = this;
        window.addEventListener('resize', function(e) {
            _this.responsiveCheck( e.target );
            _this.index = 0;
            _this.slideIndex(_this.index);
            _this.calculateSizes();
            _this.build();
        });
    }
    
    build() {
        let _this = this;
        this.element.setAttribute('id', this.id);
        this.element.style.cssText = `
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            padding: 0em;
            margin: 0em;
            margin: 0em;
        `
        
        // responsive check
        this.responsiveCheck( window );
        
        this.calculateSizes();
        
        // get number of indexes
        let nIndexes = (this.contentsCount / this.slidesCounter) - 1;
        
        // dots and arrows if more than 1 index
        try { document.querySelector('.brousel-control').remove(); } catch(e) { /* don't exist */ }
        if (nIndexes > 1) {
            //dots
            let dots = null;
            if ( this.dots && nIndexes > 1 ) {
                dots = "";
                for(let i = 0; i <= nIndexes; i++)
                dots += `<button data-index="${i*this.slidesCounter}" class="brousel-dot${i == 0 ? ' selected':''}" id="${this.id}">${this.dot_content}</button>`;
            }
            
            //arros
            if ( this.arrows ) {
                this.element.insertAdjacentHTML('afterend', `
                <div class="brousel-control">
                    <div class="brousel-prev" id="${this.id}">${this.prev_content}</div>
                    ${dots?dots:''}
                    <div class="brousel-next" id="${this.id}">${this.next_content}</div>
                </div>
                `);
            }
            
            // start controll events
            this.startControlEvents();
        }
        
        this.autoPlay();
        
    }
    responsiveCheck( target ) {
        if (target.outerWidth <= this.responsiveSizeToChange)
            this.slidesCounter = this.responsiveToShow;
        else
            this.slidesCounter = this.slidesToShow;
    }
    autoPlay() {
        if (this.autoplay) {
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
        let parentElementWidth = this.element.parentElement.offsetWidth;
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
        document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener('click', (e) => {
            _this.slideLeft()
            _this.waitInteractionAndPlay();
        })
        document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener('click', (e) => {
            _this.slideRight()
            _this.waitInteractionAndPlay();
        })
        document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(el){
            el.addEventListener('click', (e) => {
                let index = e.target.getAttribute('data-index');
                _this.index = Number(index);
                _this.slideIndex(_this.index);
                _this.waitInteractionAndPlay();
            })
        })
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
            left: this.contents[index].offsetLeft - 10,
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
let bro;
window.onload = function() {
    bro = new Brousel( document.querySelector('.brousel') , {
        arrows: true,
        dots: true,
        slidesToShow: 3,
        autoplay: true,
        speed: 5000,
        margin_horizontal: 5,
        responsiveToShow: 1,
        responsiveSizeToChange: 600
    })
}
