document.addEventListener('DOMContentLoaded', () => {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbz-aQP3uFhrNpu4Wa3xeKNA2BcaiODEdRQmvh4ceQVH6z7FrN-i7C1qwf1GROlecBz4/exec';

    const testimonialsHTML = `
        <div class="section" data-aos="fade-up">
            <h2>آراء طلابنا</h2>
            <div class="slider-container">
                <div id="testimonials-container"></div>
                <div class="slider-dots"></div>
            </div>
        </div>
    `;
    document.getElementById('testimonials-section').innerHTML = testimonialsHTML;

    async function fetchTestimonials() {
        try {
            const response = await fetch(webAppUrl);
            const data = await response.json();
            const container = document.getElementById('testimonials-container');
            const dotsContainer = document.querySelector('.slider-dots');
            container.innerHTML = '';
            dotsContainer.innerHTML = '';

            let slideIndex = 0;
            const allTestimonials = [];

            // كل صف في data يحتوي على عمود واحد باسم testimonials
            data.forEach(row => {
                if (row.testimonials) {
                    // تقسيم النص على | للحصول على كل شهادة منفصلة
                    const entries = row.testimonials.split('|');
                    entries.forEach(entry => {
                        const parts = entry.split(' - ');
                        if (parts.length >= 2) {
                            allTestimonials.push({
                                text: parts[0].trim(),
                                name: parts[1].trim()
                            });
                        }
                    });
                }
            });

            // إنشاء الشرائح والنقاط
            allTestimonials.forEach((testimonial, index) => {
                const div = document.createElement('div');
                div.classList.add('testimonial');
                if (index === 0) div.classList.add('active');
                div.textContent = `${testimonial.text} – ${testimonial.name}`;
                container.appendChild(div);

                if (index < 10) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => showSlide(index));
                    dotsContainer.appendChild(dot);
                }
            });

            const testimonials = document.querySelectorAll('.testimonial');
            const dots = document.querySelectorAll('.dot');

            function showSlide(index) {
                testimonials.forEach(t => t.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                testimonials[index].classList.add('active');
                if (index < 10) dots[index].classList.add('active');
                slideIndex = index;
            }

            function nextSlide() {
                showSlide((slideIndex + 1) % testimonials.length);
            }

            setInterval(nextSlide, 4000);

        } catch (error) {
            console.error('Error fetching testimonials:', error);
            document.getElementById('testimonials-container').innerHTML = '<p style="text-align:center;">تعذر تحميل الآراء. حاول مرة أخرى لاحقًا.</p>';
        }
    }

    fetchTestimonials();
});