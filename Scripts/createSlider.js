/** createSlider for App Moda
 * Creates Slider in Div
 * Moves only one slide per click
 * @param {Element} slides 
 * @param {Element} leftControl 
 * @param {Element} rightControl 
 * @param {Element} controlWrapper
 */
function createSlider(slides, leftControl, rightControl, controlWrapper){
  if(slides.length > 1){
    const slider = slides.parent();
    const MIN = 0;
    const MAX = slides.length; 
    let WIDTH = slider.width();
    let index = 0;
    
    function moveSlide(){ slides.css("right", index * WIDTH + "px"); }
    function nextSlide(){
      if(index + 1 < MAX){
        index++;
        moveSlide(); 
      } else { 
        index = MIN;
        moveSlide(); 
      }
    }
    function prevSlide(){
      if(index - 1 >= MIN){
        index--;
        moveSlide(); 
      } 
      else {
        index = MAX-1;
        moveSlide(); 
      }
    }
    // CONTROLS CLICK EVENT
    leftControl.click(function(){ prevSlide(); });
    rightControl.click(function(){ nextSlide(); });

    // RESIZE HANDLE
    function getCardWidth(){ WIDTH = slider.width(); moveSlide() }
    $(window).resize(getCardWidth);

    // MOBILE FINGER SWIPE DETECTION
    controlWrapper.on("touchstart", handleTouchStart);    
    controlWrapper.on('touchmove', handleTouchMove);
    let xDown = null;                                                        
    let yDown = null;
    function getTouches(evt) {
      return evt.touches ||         // browser API
        evt.originalEvent.touches; // jQuery
    }                                                     
    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];                                      
      xDown = firstTouch.clientX;                                      
      yDown = firstTouch.clientY;                                      
    };                                                
    function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) { return; }
      let xUp = evt.touches[0].clientX;                                    
      let yUp = evt.touches[0].clientY;
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) { nextSlide(); }
        else { prevSlide(); }                       
      }
      /* reset values */
      xDown = null;
      yDown = null;                                             
    };
  } else {
    leftControl.remove();
    rightControl.remove();
  }
};