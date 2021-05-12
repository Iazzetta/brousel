class Brousel {
    constructor(element, settings) {
        this.element = element;
        this.index = 0;
        this.width = settings.width || '100%';
        this.margin_horizontal = settings.margin_horizontal || 0;
        this.margin_vertical = settings.margin_vertical || 0;
        this.arrows = settings.arrows || true;
        this.dots = settings.dots || false;
        this.autoplay = settings.autoplay || false;
        this.speed = settings.speed || 3000;
        this.slidesToShow = settings.slidesToShow || 3;
        this.responsiveToShow = settings.responsiveToShow || 1;
        this.jumpStep = settings.jumpStep || 1;
        this.totalWidthContent = null;
        this.contents = null;
        this.contentsCount = null;
        this.build();
    }
    
    build() {
        let _this = this;
        this.element.style.cssText = `
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            padding: 0em;
            margin: 0em;
            margin: 0em;
        `
        let parentElementWidth = this.element.parentElement.offsetWidth;
        if ( this.arrows ) {
            try { document.querySelector('.brousel-control').remove(); } catch(e) {}
            this.element.insertAdjacentHTML('afterend', `
                <div class="brousel-control">
                    <div class="brousel-prev"><</div>
                    <div class="brousel-next">></div>
                </div>
            `);
        }
        this.contents = this.element.querySelectorAll('li');
        this.contentsCount = this.contents.length;
        this.contents.forEach((el) => {
            el.style.width = ((parentElementWidth / this.slidesToShow) - (this.margin_horizontal * 2)) + 'px';
            el.style.margin = `${this.margin_vertical}px ${this.margin_horizontal}px`;
        });
        this.element.style.height = this.contents[0].offsetHeight;
        this.startEvents();
    }
  
    startEvents() {
        const _this = this;
        document.querySelector('.brousel-prev').addEventListener('click', (e) => {
            _this.slideLeft()
        })
        document.querySelector('.brousel-next').addEventListener('click', (e) => {
            _this.slideRight()
        })
    }
    slideIndex(index) {
        this.element.scrollTo({
            left: this.contents[index].offsetLeft - 10,
            behavior: 'smooth'
        });
    }
    slideLeft(){
        if ( (this.index + this.slidesToShow) == this.slidesToShow ) {
            this.index = this.contentsCount - this.slidesToShow;
        } else {
            this.index -= this.slidesToShow;
        }
        this.slideIndex( this.index );
    }
    slideRight(){
        if ( (this.index + this.slidesToShow) == this.contentsCount ) {
            this.index = 0;
        } else {
            this.index += this.slidesToShow;
        }
        this.slideIndex( this.index );
    }
}
let bro;
window.onload = function() {
    bro = new Brousel( document.querySelector('.brousel') , {
        arrows: true,
        slidesToShow: 3,
        autoplay: true,
        speed: 1000,
        margin_horizontal: 5
    })
}
