class Brousel {
    constructor(element, settings) {
        this.element = element;
        this.index = 0;
        this.width = settings.width || '100%';
        this.padding = settings.padding || 16;
        this.arrows = settings.arrows || true;
        this.dots = settings.dots || false;
        this.autoplay = settings.autoplay || false;
        this.speed = settings.speed || 3000;
        this.slidesToShow = settings.slidesToShow || 3;
        this.responsiveToShow = settings.responsiveToShow || 1;
        this.jumpStep = settings.jumpStep || 1;
        this.totalWidthContent = null;
        this.start();
        this.startEvents();
    }
    
    start() {
        let _this = this;
        this.element.style.cssText = `
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            padding: 0em;
            margin: 0em;
            margin: 0em;
        `
        let parentElementWidth = this.element.parentElement.clientWidth;
        this.totalWidthContent = parentElementWidth + ((parentElementWidth / this.slidesToShow) / this.slidesToShow);
        if ( this.arrows ) {
            this.element.insertAdjacentHTML('afterend', `
                <div class="boursel-arrow-left"><</div>
                <div class="boursel-arrow-right">></div>
            `);
        }
        const contents = this.element.querySelectorAll('li');
        const slidesToShow = this.element.clientWidth / (contents.length - 1);
        console.log('width com padding', contents[0].offsetWidth)
        contents.forEach((el) => {
            el.style.width = ((parentElementWidth / this.slidesToShow) - ((this.padding * 2) * this.slidesToShow)) + 'px';
        });
        this.element.style.height = contents[0].clientHeight;
    }
  
    startEvents() {
        const _this = this;
        document.querySelector('.boursel-arrow-left').addEventListener('click', (e) => {
            console.log('click arrow left')
            _this.slideLeft()
        })
        document.querySelector('.boursel-arrow-right').addEventListener('click', (e) => {
            console.log('click arrow right')
            _this.slideRight()
        })
    }
    slideLeft(){
        console.log(this.totalWidthContent)
        this.element.scrollTo({
            left: this.totalWidthContent,
            behavior: 'smooth'
        });
    }
    slideRight(){
        this.element.scrollTo({
            left: -this.totalWidthContent,
            behavior: 'smooth'
        });
    }
  
}

window.onload = function() {
    let $brousel = document.querySelector('.brousel');
    new Brousel($brousel, {
        arrows: true,
        width: '600px',
        slidesToShow: 3,
        autoplay: true,
        speed: 1000,
        padding: 16
    })
}
