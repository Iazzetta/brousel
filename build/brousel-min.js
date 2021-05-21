let _brouselList=[],timerToResize=null;const brouselManagerEvent=function(){clearTimeout(timerToResize),timerToResize=setTimeout(function(){if(_brouselList.length>0)for(let t in _brouselList)_brouselList[t].build()},150)};window.addEventListener("resize",brouselManagerEvent);var _window="undefined"!=typeof window?window:this;class Brousel{constructor(t,e){this.index=0,this.marginTop=e.marginTop||0,this.marginBottom=e.marginBottom||0,this.marginLeft=e.marginLeft||0,this.marginRight=e.marginRight||0,this.arrows=e.arrows,this.arrowSide=e.arrowSide||!1,this.dots=e.dots,this.autoplay=e.autoplay,this.speed=e.speed||3e3,this.toShow=e.toShow||1,this.toScroll=e.toScroll||1,this.prev_content=e.prev_content||"<",this.next_content=e.next_content||">",this.dot_content=e.dot_content||"-",this.bk={},Object.assign(this.bk,this),this.id=Math.random(),this.element=t,this.width=null,this.responsive=e.responsive||[],this.totalWidthContent=null,this.contents=null,this.contentsCount=null,this.animationTimeout=null,this.autoplayInterval=null,this.waitInteractionInterval=null,this.swipeControl=null,this.canSlide=!0,this.eventsCreated=!1,this.lastOffsetLeft=this.element.offsetLeft,this.parent=this.element.parentElement,this.debug=e.debug||!1,this.easing=function(t,e,i,s,n){return s*(e/=n)*e+i},this.build(),_brouselList.push(this)}build(){this.index=0,this.parent=this.element.parentElement,this.element.setAttribute("bid",this.id),this.element.style.cssText=`\n            white-space: nowrap;\n            overflow: hidden;\n            text-align: left;\n            ${this.arrows?"margin-top: 2em;":""}\n        `,this.calculateSizes();let t=this.contentsCount/this.toScroll;this.nIndexes=t>0?t-1:0;try{document.querySelector(`.brousel-control[id="${this.id}"]`).remove()}catch(t){}try{document.querySelector(`.brousel-prev[id="${this.id}"]`).remove()}catch(t){}try{document.querySelector(`.brousel-next[id="${this.id}"]`).remove()}catch(t){}if(this.nIndexes>1&&(this.arrows||this.dots)){let t="";if(this.dots)for(let e=0;e<=this.nIndexes;e++)t+=`<button data-index="${e*this.toScroll}" class="brousel-dot${0==e?" selected":""}" id="${this.id}">${this.dot_content}</button>`;let e="",i="";1==this.arrowSide&&(e=`style="position: relative;left:-${this.element.offsetWidth/2}px;top:-${this.element.offsetHeight/2+(this.contents[0].offsetHeight/2+16)}px;"`,i=`style="position: relative;left:${this.element.offsetWidth/2}px;top:-${this.element.offsetHeight/2+(this.contents[0].offsetHeight/2+16)}px;"`);let s=`\n                <div class="brousel-control" id="${this.id}">\n                    ${this.dots?t:""}\n                </div>\n            `;if(this.element.insertAdjacentHTML("afterend",s),this.arrows){let t=["prev","next"];for(let e in t){let i=document.createElement("div");i.id=this.id,i.innerHTML=this[`${t[e]}_content`],i.classList.add(`brousel-${t[e]}`),this.parent.insertBefore(i,this.element.nextSibling),"prev"==t[e]?i.style.float="left":i.style.float="right"}}this.startControlEvents()}this.slideIndex(this.index,!1),this.autoPlay()}getOffset(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,top:e.top+window.scrollY}}responsiveCheck(){this.width=this.element.offsetWidth;let t=!1;for(let e in this.responsive)if(window.screen.width<=this.responsive[e].breakpoint){t=!0;for(let t in this.responsive[e].settings)this[t]=this.responsive[e].settings[t]}if(!t)for(let t in this)t in this.bk&&(this[t]=this.bk[t]);this.debug&&console.log(this)}autoPlay(){if(this.autoplay&&this.nIndexes>1){let t=this;clearInterval(this.autoplayInterval),this.autoplayInterval=setInterval(function(){t.slideRight()},this.speed)}}waitInteractionAndPlay(){let t=this;clearInterval(this.autoplayInterval),clearInterval(this.waitInteractionInterval),this.waitInteractionInterval=setTimeout(function(){t.autoPlay()},3e3)}calculateSizes(){this.responsiveCheck(),this.contents=this.element.querySelectorAll("li"),this.contentsCount=this.contents.length,this.contents.forEach(t=>{let e=this.marginLeft+this.marginRight;this.marginTop,this.marginBottom;t.style.width=this.element.offsetWidth/this.toShow-e+"px",t.style.marginLeft=`${this.marginLeft}px`,t.style.marginRight=`${this.marginRight}px`,t.style.marginTop=`${this.marginTop}px`,t.style.marginBottom=`${this.marginBottom}px`}),this.element.style.height=this.contents[0].offsetHeight}startControlEvents(){let t=this;this.arrows&&(document.querySelector(`.brousel-prev[id="${this.id}"]`).addEventListener("click",e=>{t.slideLeft()}),document.querySelector(`.brousel-next[id="${this.id}"]`).addEventListener("click",e=>{t.slideRight()})),this.dots&&document.querySelectorAll(`.brousel-dot[id="${this.id}"]`).forEach(function(e){e.addEventListener("click",function(e){let i=e.target.getAttribute("data-index");t.index=Number(i),t.slideIndex(t.index)})}),this.eventsCreated||(this.dots||this.arrows)&&(this.parent.addEventListener("touchstart",function(e){1===e.touches.length?t.swipeControl=e.touches.item(0).clientX:t.swipeControl=null},{passive:!0}),this.parent.addEventListener("touchend",function(e){if(t.swipeControl){let i=e.changedTouches.item(0).clientX;i>t.swipeControl+40&&t.slideLeft(),i<t.swipeControl-40&&t.slideRight()}},{passive:!0}),this.eventsCreated=!0)}bscrollTo(t,e,i){var s=this,n=(new Date).getTime(),o=this.animate_id,l=function(){var r=(new Date).getTime()-n;s.element.scrollLeft=s.element.scrollLeft+(t-s.element.scrollLeft)*s.easing(0,r,0,1,e),r<e&&o===s.animate_id?_window.requestAnimationFrame(l):(s.element.scrollLeft=t,i&&i.call())};_window.requestAnimationFrame(l)}async slideIndex(){if(!this.canSlide)return;let t=this;clearTimeout(this.animationTimeout),this.animationTimeout=setTimeout(function(){t.animate_id=Math.random(),t.canSlide=!1,t.bscrollTo(t.contents[t.index].offsetLeft-t.element.offsetLeft-t.marginLeft,100,function(){if(t.dots)try{document.querySelectorAll(`.brousel-dot[id="${t.id}"]`).forEach(function(t){t.classList.remove("selected")}),document.querySelector(`.brousel-dot[id="${t.id}"][data-index="${t.index}"]`).classList.add("selected")}catch(t){}t.canSlide=!0,t.waitInteractionAndPlay()})},100)}slideLeft(){this.index+this.toScroll==this.toScroll?this.index=this.contentsCount-this.toScroll:this.index-=this.toScroll,this.slideIndex(this.index)}slideRight(){this.index+this.toScroll==this.contentsCount?this.index=0:this.index+=this.toScroll,this.slideIndex(this.index)}}