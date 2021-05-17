let _brouselList=[],_brouselDebounce=function(t,e,i){var s;return function(){const n=this,o=arguments,l=i&&!s;clearTimeout(s),s=setTimeout(function(){s=null,i||t.apply(n,o)},e),l&&t.apply(n,o)}};window.addEventListener("resize",_brouselDebounce(function(t){if(_brouselList.length>0)for(let t in _brouselList)_brouselList[t].build()},200,!1),!1);class Brousel{constructor(t,e){this.id=Math.random(),this.element=t,this.index=0,this.width=e.width||"100%",this.margin_horizontal=e.margin_horizontal||0,this.margin_vertical=e.margin_vertical||0,this.arrows=e.arrows,this.dots=e.dots,this.autoplay=e.autoplay,this.speed=e.speed||3e3,this.slidesCounter=null,this.slidesToShow=e.slidesToShow||3,this.responsiveToShow=e.responsiveToShow||1,this.responsiveSizeToChange=e.responsiveSizeToChange||400,this.prev_content=e.prev_content||"<",this.next_content=e.next_content||">",this.dot_content=e.dot_content||"-",this.totalWidthContent=null,this.contents=null,this.contentsCount=null,this.autoplayInterval=null,this.swipeControl=null,this.canSlide=!0,this.eventsCreated=!1,this.build(),_brouselList.push(this)}build(){this.responsiveCheck(window),this.index=0,this.parent=this.element.parentElement,this.element.setAttribute("id",this.id),this.element.style.cssText="\n            white-space: nowrap;\n            overflow: hidden;\n            text-align: left;\n            padding: 0em;\n            margin: 0em;\n            margin: 0em;\n        ",this.calculateSizes();let t=this.contentsCount/this.slidesCounter;this.nIndexes=t>0?t-1:0;try{document.querySelector(`.brousel-control[id="${this.id}"]`).remove()}catch(t){}if(this.nIndexes>1&&(this.arrows||this.dots)){let t="";if(this.dots)for(let e=0;e<=this.nIndexes;e++)t+=`<button data-index="${e*this.slidesCounter}" class="brousel-dot${0==e?" selected":""}" id="${this.id}">${this.dot_content}</button>`;let e=`\n                <div class="brousel-control" id="${this.id}">\n                    ${this.arrows?`<div class="brousel-prev" id="${this.id}">${this.prev_content}</div>`:""}\n                    ${this.dots?t:""}\n                    ${this.arrows?`<div class="brousel-next" id="${this.id}">${this.next_content}</div>`:""}\n                </div>\n            `;this.element.insertAdjacentHTML("afterend",e),this.startControlEvents()}this.slideIndex(this.index),this.autoPlay()}responsiveCheck(t){t.outerWidth<=this.responsiveSizeToChange?this.slidesCounter=this.responsiveToShow:this.slidesCounter=this.slidesToShow}autoPlay(){if(this.autoplay&&this.nIndexes>1){let t=this;clearInterval(this.autoplayInterval),this.autoplayInterval=setInterval(function(){t.slideRight()},this.speed)}}waitInteractionAndPlay(){let t=this;clearInterval(this.autoplayInterval),setTimeout(function(){t.autoPlay()},3e3)}calculateSizes(){let t=this.parent.offsetWidth;this.contents=this.element.querySelectorAll("li"),this.contentsCount=this.contents.length,this.contents.forEach(e=>{e.style.width=t/this.slidesCounter-2*this.margin_horizontal+"px",e.style.margin=`${this.margin_vertical}px ${this.margin_horizontal}px`}),this.element.style.height=this.contents[0].offsetHeight}startControlEvents(){let t=this;this.arrows&&(document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener("click",e=>{t.slideLeft()}),document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener("click",e=>{t.slideRight()})),this.dots&&document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(e){e.addEventListener("click",function(e){let i=e.target.getAttribute("data-index");t.index=Number(i),t.slideIndex(t.index)})}),this.eventsCreated||(this.dots||this.arrows)&&(this.element.addEventListener("touchstart",function(e){1===e.touches.length?t.swipeControl=e.touches.item(0).clientX:t.swipeControl=null},{passive:!0}),this.element.addEventListener("touchend",function(e){if(t.swipeControl){let i=e.changedTouches.item(0).clientX;i>t.swipeControl+50&&t.slideLeft(),i<t.swipeControl-50&&t.slideRight()}},{passive:!0}),this.eventsCreated=!0)}async slideIndex(){if(this.canSlide){if(this.canSlide=!1,this.dots)try{document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(t){t.classList.remove("selected")}),document.querySelector(`.brousel-dot[id="${this.id}"][data-index="${this.index}"]`).classList.add("selected")}catch(t){}this.element.scrollTo({left:this.contents[this.index].offsetLeft-this.element.offsetLeft,behavior:"smooth"}),await new Promise(t=>setTimeout(t,600)),this.canSlide=!0,this.waitInteractionAndPlay()}}slideLeft(){this.index+this.slidesCounter==this.slidesCounter?this.index=this.contentsCount-this.slidesCounter:this.index-=this.slidesCounter,this.slideIndex(this.index)}slideRight(){this.index+this.slidesCounter==this.contentsCount?this.index=0:this.index+=this.slidesCounter,this.slideIndex(this.index)}}