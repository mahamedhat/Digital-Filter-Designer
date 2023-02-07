function opentab() {
    document.getElementById("myNav").style.height = "90%";
  }
  
  function closetab() {
    document.getElementById("myNav").style.height = "0%";
  }





var swiper = new Swiper('.swiper-container', {
nextButton: '.swiper-button-next',
prevButton: '.swiper-button-prev',
slidesPerView: 5,
spaceBetween: 10,
autoplayDisableOnInteraction: false,
loop: true,
breakpoints: {
1024: {
    slidesPerView: 3,
    spaceBetween: 40
},
768: {
    slidesPerView: 3,
    spaceBetween: 30
},
640: {
    slidesPerView: 2,
    spaceBetween: 20
},
320: {
    slidesPerView: 1,
    spaceBetween: 10
}
}
});

