// الدالة العامة لتشغيل أي سلايدر
function initializeSlider(containerId, slideClassName, dotClassName) {
    const slidesContainer = document.getElementById(containerId);
    // إذا لم يتم العثور على العنصر، توقف عن التنفيذ
    if (!slidesContainer) return;

    // الحصول على شرائح السلايدر والدوائر
    const slides = slidesContainer.getElementsByClassName(slideClassName);
    const dots = slidesContainer.getElementsByClassName(dotClassName);
    let slideIndex = 0;
    let autoSlideInterval;

    // إذا لم تكن هناك شرائح، قم بإخفاء القسم بأكمله
    if (slides.length === 0) {
        slidesContainer.parentElement.style.display = 'none';
        return;
    }

    // دالة عرض الشريحة الحالية وإخفاء الباقي
    function showSlides(n) {
        // إعادة تعيين المؤشر إذا وصل إلى النهاية
        if (n >= slides.length) { slideIndex = 0; }
        if (n < 0) { slideIndex = slides.length - 1; }

        // إخفاء جميع الشرائح
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        // إزالة حالة النشاط من جميع الدوائر
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        
        // عرض الشريحة الحالية وتفعيل الدائرة المقابلة لها
        slides[slideIndex].style.display = "block";
        dots[slideIndex].className += " active";
    }

    // دالة للتنقل إلى الشريحة التالية/السابقة
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    
    // دالة الانتقال إلى شريحة معينة عند النقر على الدائرة
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    // دالة بدء التمرير التلقائي
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval); // إيقاف التمرير الحالي أولاً
        autoSlideInterval = setInterval(() => {
            plusSlides(1);
        }, 5000); // تغيير الشريحة كل 5 ثوانٍ
    }
    
    // إضافة مستمعي الأحداث لكل دائرة
    Array.from(dots).forEach(dot => {
        dot.addEventListener('click', (event) => {
            const index = parseInt(event.target.dataset.slideIndex);
            currentSlide(index);
        });
    });

    // تشغيل السلايدر عند تحميل الصفحة
    showSlides(slideIndex);
    startAutoSlide();
}

// دالة عامة لتشغيل جميع السلايدرات
// تم تغييرها لتكون دالة منفصلة يتم استدعاؤها من index.html
window.startSliders = function() {
    initializeSlider('instructors-slider', 'instructor-slide', 'dot');
    initializeSlider('testimonials-slider', 'testimonial-slide', 'dot');
};
