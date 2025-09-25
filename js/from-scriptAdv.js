document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const inputs = document.querySelectorAll("#form input:not([type='hidden']), #form select");
    const progressBar = document.getElementById('progress-bar');
    const formMainTitle = document.getElementById('form-main-title');
    const totalInputs = inputs.length;

    // رسائل خطأ العمر
    const ageErrorMessages = [
        "عفوًا 😅 واضح إنك حضرت افتتاح أول مدرسة بالعالم! النظام ما يتحمل فوق 99 سنة... لو أكبر، لازم تدخل مع فريق الديناصورات في المتحف 🤭.",
        "عفوًا 😅 شكلك الوحيد اللي كان مع نوح في السفينة 🛶! النموذج ما يقبل فوق 99... إذا أكبر من كذا، متحف التاريخ الطبيعي فاتح لك ذراعيه 🤭.",
        "عفوًا 😅 إذا عمرك فوق 99، فهذا يعني إنك لعبت مع آدم في الحديقة 😂! النظام يتوقف هنا، والباقي يكمّلوه في المتحف 🤭.",
        "عفوًا 😅 واضح إنك كنت حاضر لحظة اختراع العجلة الأولى 🚲! عندنا حد أقصى 99 سنة، بعدها يتم تحويلك تلقائيًا إلى قسم الآثار 🤭.",
        "عفوًا 😅 يبدو أنك من جيل الأجداد الأوائل ! المؤسسة عندها سقف 99 سنة بس... يعني لو عمرك أكثر، لازم تسجل في متحف التاريخ الطبيعي بدل من هنا 🤭."
    ];

    // إخفاء كل رسائل الخطأ
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    // ضبط تاريخ التسجيل
    const registrationInput = document.getElementById("registration-date-input");
    registrationInput.value = new Date().toISOString();

    // ضبط اسم الدورة إذا فارغ
    const courseInput = document.getElementById("course-name-input");
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get("course");
    if (courseName) {
        const decodedCourseName = decodeURIComponent(courseName);
        courseInput.value = decodedCourseName;
        formMainTitle.innerHTML = `📘 أنت تسجل الآن في: <span style="color:var(--accent-color);">${decodedCourseName}</span>`;
    } else {
        courseInput.value = "دبلوم صناعة العباقرة";
    }

    // إضافة الدول العربية
    if (window.arabCountries && arabCountries.length) {
        const countrySelect = document.getElementById('country');
        arabCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    } else {
        console.error("❌ arabCountries غير معرف أو فارغ!");
    }

    // تحديث شريط التقدم
    const updateProgress = () => {
        let filledInputs = 0;
        inputs.forEach(input => {
            if (input.value && input.checkValidity() && input.value !== "") filledInputs++;
        });
        const progress = (filledInputs / totalInputs) * 100;
        progressBar.style.width = `${progress}%`;
    };

    // التحقق من كل مدخل عند الكتابة والبلور
    inputs.forEach(input => {
        const icon = input.closest('.input-with-icon')?.querySelector('.icon');
        const errorMessage = input.closest('.input-group')?.querySelector('.error-message');

        input.addEventListener("input", () => {
            if (input.id === 'age') {
                const ageValue = parseInt(input.value, 10);
                if (ageValue > 99 || input.value.length > 2) {
                    input.classList.add('is-invalid');
                    const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                    errorMessage.textContent = ageErrorMessages[randomIndex];
                    errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    errorMessage.style.display = 'none';
                }
            }

            if (input.checkValidity() && input.value !== "" && icon) {
                icon.style.color = "#28a745";
            } else if(icon) {
                icon.style.color = "var(--primary-color)";
            }

            updateProgress();
        });

        input.addEventListener("blur", () => {
            if (input.id === 'age') {
                const ageValue = parseInt(input.value, 10);
                if (input.value && (ageValue > 99)) {
                    input.classList.add('is-invalid');
                    const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                    errorMessage.textContent = ageErrorMessages[randomIndex];
                    errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    errorMessage.style.display = 'none';
                }
            } else {
                if (!input.checkValidity() && input.value !== "") {
                    input.classList.add('is-invalid');
                    errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    errorMessage.style.display = 'none';
                }
            }
        });
    });

    // إرسال الفورم
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isFormValid = form.checkValidity();
        const ageInput = document.getElementById('age');
        if (parseInt(ageInput.value, 10) > 99) isFormValid = false;

        if (!isFormValid) {
            inputs.forEach(input => {
                const errorMessage = input.closest('.input-group')?.querySelector('.error-message');
                if (!input.checkValidity() || (input.id === 'age' && parseInt(input.value, 10) > 99)) {
                    input.classList.add('is-invalid');
                    if (input.id === 'age') {
                        const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                        errorMessage.textContent = ageErrorMessages[randomIndex];
                    }
                    errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    errorMessage.style.display = 'none';
                }
            });
            return;
        }

        registrationInput.value = new Date().toLocaleString('ar-AE', { timeZone: 'Asia/Dubai' });

        const isConfirmed = confirm('هل أنت متأكد من صحة البيانات المدخلة؟');
        if (!isConfirmed) return;

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        formMessage.style.display = 'none';

        try {
            const formData = new FormData(form);
            const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });

            if (response.ok) {
                const data = Object.fromEntries(formData.entries());

                const messageBody = `
🎓 *تسجيل جديد في دبلوم صناعة العباقرة!*

📘 الدورة: ${data.CourseName}
👤 الاسم: ${data.name}
🧬 الجنس: ${data.gender}
🎂 العمر: ${data.age}
🌍 البلد: ${data.country}
📱 رقم الواتساب: ${data.phone}
✉️ البريد الإلكتروني: ${data.email}
💬 تيليجرام: ${data.telegram || 'غير محدد'}

🚀 تهانينا! تم تسجيلك في رحلتنا نحو التركيز الخارق وسرعة الحفظ المذهلة.  
✨ أنت الآن على أول خطوة لتحقيق التفوق الدراسي والقدرات العقلية الخارقة!

📩 سيتم التواصل معك قريبًا لتأكيد بياناتك والانطلاق في الدورة.
`;

                window.location.href = `https://wa.me/967778185189?text=${encodeURIComponent(messageBody)}`;

                form.reset();
                updateProgress();
                inputs.forEach(input => {
                    input.classList.remove('is-invalid');
                    const icon = input.closest('.input-with-icon')?.querySelector('.icon');
                    if(icon) icon.style.color = "var(--primary-color)";
                });

            } else {
                throw new Error('Form submission failed.');
            }

        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.className = 'error';
            formMessage.textContent = '❌ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});