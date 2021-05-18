let _brouselList=[],timerToResize=null;const brouselManagerEvent=function(){clearTimeout(timerToResize),timerToResize=setTimeout(function(){if(_brouselList.length>0)for(let t in _brouselList)_brouselList[t].build()},600)};window.addEventListener("resize",brouselManagerEvent);var _window="undefined"!=typeof window?window:this;class Brousel{constructor(t,e){this.id=Math.random(),this.element=t,this.index=0,this.width=e.width||"100%",this.margin_horizontal=e.margin_horizontal||0,this.margin_vertical=e.margin_vertical||0,this.arrows=e.arrows,this.dots=e.dots,this.autoplay=e.autoplay,this.speed=e.speed||3e3,this.speed=e.speed||3e3,this.toScroll=null,this.slidesToShow=e.slidesToShow||3,this.slidesToScroll=e.slidesToScroll||this.slidesToShow,this.responsiveToShow=e.responsiveToShow||1,this.responsiveToScroll=e.responsiveToScroll||this.responsiveToShow,this.responsiveSizeToChange=e.responsiveSizeToChange||400,this.prev_content=e.prev_content||"<",this.next_content=e.next_content||">",this.dot_content=e.dot_content||"-",this.totalWidthContent=null,this.contents=null,this.contentsCount=null,this.animationTimeout=null,this.autoplayInterval=null,this.waitInteractionInterval=null,this.swipeControl=null,this.canSlide=!0,this.eventsCreated=!1,this.lastOffsetLeft=this.element.offsetLeft,this.parent=this.element.parentElement,this.toShow=this.slidesToShow,this.toScroll=this.slidesToScroll,this.easing=function(t,e,i,s,n){return s*(e/=n)*e+i},this.build(),_brouselList.push(this)}build(){this.responsiveCheck(window),this.index=0,this.parent=this.element.parentElement,this.element.setAttribute("id",this.id),this.element.style.cssText="\n            white-space: nowrap;\n            overflow: hidden;\n            text-align: left;\n            padding: 0em;\n            margin: 0em;\n            margin: 0em;\n        ",this.calculateSizes();let t=this.contentsCount/this.toScroll;this.nIndexes=t>0?t-1:0;try{document.querySelector(`.brousel-control[id="${this.id}"]`).remove()}catch(t){}if(this.nIndexes>1&&(this.arrows||this.dots)){let t="";if(this.dots)for(let e=0;e<=this.nIndexes;e++)t+=`<button data-index="${e*this.toScroll}" class="brousel-dot${0==e?" selected":""}" id="${this.id}">${this.dot_content}</button>`;let e=`\n                <div class="brousel-control" id="${this.id}">\n                    ${this.arrows?`<div class="brousel-prev" id="${this.id}">${this.prev_content}</div>`:""}\n                    ${this.dots?t:""}\n                    ${this.arrows?`<div class="brousel-next" id="${this.id}">${this.next_content}</div>`:""}\n                </div>\n            `;this.element.insertAdjacentHTML("afterend",e),this.startControlEvents()}this.slideIndex(this.index,!1),this.autoPlay()}responsiveCheck(t){t.outerWidth<=this.responsiveSizeToChange?(this.toScroll=this.responsiveToScroll,this.toShow=this.responsiveToShow):(this.toScroll=this.slidesToScroll,this.toShow=this.slidesToShow)}autoPlay(){if(this.autoplay&&this.nIndexes>1){let t=this;clearInterval(this.autoplayInterval),this.autoplayInterval=setInterval(function(){t.slideRight()},this.speed)}}waitInteractionAndPlay(){let t=this;clearInterval(this.autoplayInterval),clearInterval(this.waitInteractionInterval),this.waitInteractionInterval=setTimeout(function(){t.autoPlay()},3e3)}calculateSizes(){let t=this.element.offsetWidth;this.contents=this.element.querySelectorAll("li"),this.contentsCount=this.contents.length,this.contents.forEach(e=>{e.style.width=t/this.toShow-2*this.margin_horizontal+"px",e.style.margin=`${this.margin_vertical}px ${this.margin_horizontal}px`}),this.element.style.height=this.contents[0].offsetHeight}startControlEvents(){let t=this;this.arrows&&(document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener("click",e=>{t.slideLeft()}),document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener("click",e=>{t.slideRight()})),this.dots&&document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(e){e.addEventListener("click",function(e){let i=e.target.getAttribute("data-index");t.index=Number(i),t.slideIndex(t.index)})}),this.eventsCreated||(this.dots||this.arrows)&&(this.parent.addEventListener("touchstart",function(e){1===e.touches.length?t.swipeControl=e.touches.item(0).clientX:t.swipeControl=null},{passive:!0}),this.parent.addEventListener("touchend",function(e){if(t.swipeControl){let i=e.changedTouches.item(0).clientX;i>t.swipeControl+40&&t.slideLeft(),i<t.swipeControl-40&&t.slideRight()}},{passive:!0}),this.eventsCreated=!0)}bscrollTo(t,e,i){var s=this,n=(new Date).getTime(),o=s.animate_id,l=function(){var h=(new Date).getTime()-n;s.element.scrollLeft=s.element.scrollLeft+(t-s.element.scrollLeft)*s.easing(0,h,0,1,e),h<e&&o===s.animate_id?_window.requestAnimationFrame(l):(s.element.scrollLeft=t,i&&i.call())};_window.requestAnimationFrame(l)}async slideIndex(){if(!this.canSlide)return;let t=this;clearTimeout(this.animationTimeout),this.animationTimeout=setTimeout(function(){t.animate_id=Math.random(),t.canSlide=!1,t.bscrollTo(t.contents[t.index].offsetLeft-t.element.offsetLeft,100,function(){if(t.dots)try{document.querySelectorAll(`.brousel-dot[id="${t.id}"]`).forEach(function(t){t.classList.remove("selected")}),document.querySelector(`.brousel-dot[id="${t.id}"][data-index="${t.index}"]`).classList.add("selected")}catch(t){}t.canSlide=!0,t.waitInteractionAndPlay()})},100)}slideLeft(){this.index+this.toScroll==this.toScroll?this.index=this.contentsCount-this.toScroll:this.index-=this.toScroll,this.slideIndex(this.index)}slideRight(){this.index+this.toScroll==this.contentsCount?this.index=0:this.index+=this.toScroll,this.slideIndex(this.index)}}