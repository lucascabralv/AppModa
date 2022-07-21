function appModa(){
  /**
   * Roupa Atual
   */
  class CurrentRoupa{
    constructor(cabelo, pCima, pBaixo, sapato){
      this.cabelo = cabelo;
      this.pCima = pCima;
      this.pBaixo = pBaixo;
      this.sapato = sapato;
    }
    updateCabelo(c){
      this.cabelo = c;
    }
    updatePCima(pc){
      this.pCima = pc;
    }
    updatePBaixo(pb){
      this.pBaixo = pb;
    }
    updateSapato(s){
      this.sapato = s;
    }
    getCabelo(){
      return this.cabelo;
    }
    getPCima(){
      return this.pCima;
    }
    getPBaixo(){
      return this.pBaixo;
    }
    getSapato(){
      return this.sapato;
    }

  }
  // Evento de click na roupa pronta
  let eventRoupa = new CustomEvent("clickMinhaRoupa", { "detail": "Clicking existing clothes" });
  // Inicializa a Roupa Atual
  let cRoupa = new CurrentRoupa(0,0,0,0);

  /**
   * Cria sliders
   * @param {HtmlElement} slides 
   * @param {HtmlElement} leftControl 
   * @param {HtmlElement} rightControl 
   * @param {HtmlElement} controlWrapper 
   * @param {Roupa Getter} setRoupa 
   * @param {Roupa Setter} getRoupa 
   */
  function createSlider(slides, leftControl, rightControl, controlWrapper, setRoupa, getRoupa){
    if(slides.length > 1){
      const slider = slides.parent();
      const MIN = 0;
      const MAX = slides.length; 
      let WIDTH = slider.width();
      let index = 0;
      
      function moveSlide(){ slides.css("right", index * WIDTH + "px"); setRoupa(index); }
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
      // CLIQUE NA ROUPA
      document.addEventListener("clickMinhaRoupa", function(){
        index = getRoupa();
        moveSlide();
      });

    } else {
      leftControl.remove();
      rightControl.remove();
    }
  };

  /*
   * SLIDER INITIALIZER
   */
  // Slider CABELO
  createSlider($(".c-item-cabelos"), $(".pagination.l.cabelo"), $(".pagination.r.cabelo"), $(".wrapper-pag.cabelo"), cRoupa.updateCabelo.bind(cRoupa), cRoupa.getCabelo.bind(cRoupa));
  // Slider P CIMA
  createSlider($(".c-item-p-cima"), $(".pagination.l.p-cima"), $(".pagination.r.p-cima"), $(".wrapper-pag.p-cima"), cRoupa.updatePCima.bind(cRoupa), cRoupa.getPCima.bind(cRoupa));
  // Slider P BAIXO
  createSlider($(".c-item-p-baixo"), $(".pagination.l.p-baixo"), $(".pagination.r.p-baixo"), $(".wrapper-pag.p-baixo"), cRoupa.updatePBaixo.bind(cRoupa), cRoupa.getPBaixo.bind(cRoupa));
  // Slider SAPATO
  createSlider($(".c-item-sapato"), $(".pagination.l.sapato"), $(".pagination.r.sapato"), $(".wrapper-pag.sapato"), cRoupa.updateSapato.bind(cRoupa), cRoupa.getSapato.bind(cRoupa));


  /**
   * Cria o canvas com a roupa pronta
   * @param {Integer} cabeloIndex 
   * @param {Integer} pCimaIndex 
   * @param {Integer} pBaixoIndex 
   * @param {Integer} sapatoIndex 
   * @param {Boolean} saveLS: true => salva no localStorage
   */
  function createCanvasRoupas(cabeloIndex, pCimaIndex, pBaixoIndex, sapatoIndex, saveLS){
    let c_corpo = loadImage($(".imagem-corpo").attr("src"), drawRoupa);
    let c_cabelo = loadImage($(".imagem-cabelo").eq(cabeloIndex).attr("src"), drawRoupa);
    let c_pCima = loadImage($(".imagem-p-cima").eq(pCimaIndex).attr("src"), drawRoupa);
    let c_pBaixo = loadImage($(".imagem-p-baixo").eq(pBaixoIndex).attr("src"), drawRoupa);
    let c_sapato = loadImage($(".imagem-sapato").eq(sapatoIndex).attr("src"), drawRoupa);

    // Retorna obj img do src
    function loadImage(src, onload) {
      let img = new Image();
      img.onload = onload;
      img.src = src;
      return img;
    }

    let imagesLoaded = 0;
    let canvas;
    let ctx;
    
    // Desenha no canvas a roupa montada
    function drawRoupa() {
      imagesLoaded++;
      if(imagesLoaded == 5) {
        addRoupa();
        ctx.drawImage(c_corpo, 0, 0, c_corpo.width, c_corpo.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(c_sapato, 0, 0, c_sapato.width,c_sapato.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(c_pBaixo, 0, 0, c_pBaixo.width, c_pBaixo.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(c_pCima, 0, 0, c_pCima.width, c_pCima.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(c_cabelo, 0, 0, c_cabelo.width, c_cabelo.height, 0, 0, canvas.width, canvas.height);
      }
    }
    // Adiciona roupa às roupas prontas
    function addRoupa(){
      let id = "roupa-" + $(".canvas-roupa-pronta").length;
      let roupaCode = cabeloIndex + ',' + pCimaIndex + ',' + pBaixoIndex + ',' + sapatoIndex;
      if(saveLS){ 
        saveRoupa(roupaCode);
      }
      let content = '<div class="roupa-pronta" roupa="'+ roupaCode +'"><canvas class="canvas-roupa-pronta" id="' + id + '"></canvas></div>';
      $("#minhas-roupas").append(content);
      
      canvas = document.getElementById(id);
      ctx = canvas.getContext("2d");
    }

    // Salva roupas no localStorage
    function saveRoupa(roupa){
      if(roupa){
        const savedRoupas = getSavedRoupas();
        savedRoupas.insert(roupa);
        localStorage.setItem('roupas', JSON.stringify(savedRoupas));
      }
    }
  } //END createCanvasRoupas

  // Recupera roupas do localStorage
  function getSavedRoupas(){
    if(localStorage.roupas){
      return JSON.parse(localStorage.roupas);
    } else {
      return [];
    }
  } //END getSavedRoupas

  // Carrega roupas prontas do localStorage
  $(document).ready(()=>{
    let savedRoupas = getSavedRoupas();
    for(let i = 0; i < savedRoupas.length; i++){
      roupaIndexs = savedRoupas[i].split(',');
      createCanvasRoupas(roupaIndexs[0], roupaIndexs[1], roupaIndexs[2], roupaIndexs[3], false);
    }
  });

  // Visualiza roupa já montado
  $(document).on('click', ".roupa-pronta", function(){
    let roupaCodes = $(this).attr("roupa").split(",");
    cRoupa.updateCabelo(roupaCodes[0]);
    cRoupa.updatePCima(roupaCodes[1]);
    cRoupa.updatePBaixo(roupaCodes[2]);
    cRoupa.updateSapato(roupaCodes[3]);
    document.dispatchEvent(eventRoupa);
  });

  // Save Button Handler
  $("#save-button").click(()=>{
    createCanvasRoupas(cRoupa.cabelo, cRoupa.pCima, cRoupa.pBaixo, cRoupa.sapato, true);
  });

  /**
   * Menu Handler Actions
   * @param {HtmlElement} btn 
   * @param {HtmlElement} menu 
   */
  function menu(btn, menu){
    let toggleMenu = (menu)=>{
      menu.toggleClass("open");
    }
    btn.click(()=>{toggleMenu(menu)});

    $(".menu-link").click(function(){
      $(".menu-link.current").removeClass("current");
      $(this).addClass("current");
      let index = $(this).attr("index");
      $(".card").css("right", index * 100 + "%");
      toggleMenu(menu);
    });
    
    $("#save-button").click(()=>{
    	$(".menu-link.current").removeClass("current");
      $("#link-minhas-roupas").addClass("current");
      let index = $("#link-minhas-roupas").attr("index");
      $(".card").css("right", index * 100 + "%");
      toggleMenu(menu);
    });
    
    $("#delete-button").click(()=>{
    	localStorage.removeItem("roupas");
      $(".roupa-pronta").remove();
    	$(".menu-link.current").removeClass("current");
      $("#link-minhas-roupas").addClass("current");
      let index = $("#link-minhas-roupas").attr("index");
      $(".card").css("right", index * 100 + "%");
      toggleMenu(menu);
    });
    
    $(document).on('click', ".roupa-pronta", function(){
    	$(".menu-link.current").removeClass("current");
      $("#link-customizar").addClass("current");
      let index = $("#link-customizar").attr("index");
      $(".card").css("right", index * 100 + "%");
      toggleMenu(menu);
      
    });

  } // END menu

  // Customização de roupas
  function categoryCustomize(){
    $(".custom-category-select").click(function(){
      $(".custom-category-select").removeClass("current");
      $(this).addClass("current");
      let categ = $(this).attr("category");
      $(".wrapper-pag").css("display", "none");
      $(".wrapper-pag"+"."+categ).css("display", "flex");
    });
  }

  // Identifica o tamanho da tela
  function isDevice(devices){
    function currentDevice(){
      let device = undefined;
      $(".device-wrapper").children('div').each(function(){
        if($(this).css("display") === 'block'){ device = $(this).attr('device'); } });
      return device;
    }
    const cDevice = currentDevice();
    if(devices == cDevice){ return true; } 
    else { for(let i = 0; i < devices.length; i++){
      if(devices[i] == cDevice){
        return true; } } }
    return false;
  }

  // Inicializa a customização
  categoryCustomize();
  // Inicializa o menu
  menu($("#menu-btn"), $("#menu"));

};