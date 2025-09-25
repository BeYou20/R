AOS.init({ 
    duration: 1200, 
    easing: "ease-in-out", 
    once: true 
});

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 'auto',            
    spaceBetween: 10,             
    loop: true,                    
    autoplay: {
        delay: 4000,                 
        disableOnInteraction: false, 
    },
    pagination: {
        el: ".swiper-pagination",    
        clickable: true,             
    },
    navigation: {
        nextEl: ".swiper-button-next", 
        prevEl: ".swiper-button-prev", 
    },
});
