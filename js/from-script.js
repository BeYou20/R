const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSCBHJBlfAwm7ox8oHmiW5qQ64QVEbyQuElkuYoz8g4SfUdQhjM2mA0bcu13-aDS2ECQ/exec";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const inputs = document.querySelectorAll("#form input:not([type='hidden']), #form select");
    const progressBar = document.getElementById('progress-bar');
    const formMainTitle = document.getElementById('form-main-title');
    const totalInputs = inputs.length;

    const ageErrorMessages = [
        "عفوًا 😅 واضح إنك حضرت افتتاح أول مدرسة بالعالم! النظام ما يتحمل فوق 99 سنة... لو أكبر، لازم تدخل مع فريق الديناصورات في المتحف 🤭.",
        "عفوًا 😅 شكلك الوحيد اللي كان مع نوح في السفينة 🛶! النموذج ما يقبل فوق 99... إذا أكبر من كذا، متحف التاريخ الطبيعي فاتح لك ذراعيه 🤭.",
        "عفوًا 😅 إذا عمرك فوق 99، فهذا يعني إنك لعبت مع آدم في الحديقة 😂! النظام يتوقف هنا، والباقي يكمّلوه في المتحف 🤭.",
        "عفوًا 😅 واضح إنك كنت حاضر لحظة اختراع العجلة الأولى 🚲! عندنا حد أقصى 99 سنة، بعدها يتم تحويلك تلقائيًا إلى قسم الآثار 🤭.",
        "عفوًا 😅 يبدو أنك من جيل الأجداد الأوائل ! المؤسسة عندها سقف 99 سنة بس... يعني لو عمرك أكثر، لازم تسجل في متحف التاريخ الطبيعي بدل من هنا 🤭."
    ];

    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get("course");
    if (courseName) {
        const decodedCourseName = decodeURIComponent(courseName);
        document.getElementById("course-name-input").value = decodedCourseName;
        formMainTitle.innerHTML = `📘 أنت تسجل الآن في: <span style="color:var(--accent-color);">${decodedCourseName}</span>`;
    }

    const countrySelect = document.getElementById('country');
    arabCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    const updateProgress = () => {
        let filledInputs = 0;
        inputs.forEach(input => {
            if (input.value && input.checkValidity() && input.value !== "") {
                filledInputs++;
            }
        });
        const progress = (filledInputs / totalInputs) * 100;
        progressBar.style.width = `${progress}%`;
    };

    inputs.forEach(input => {
        const icon = input.closest('.input-with-icon').querySelector('.icon');
        const errorMessage = input.closest('.input-group').querySelector('.error-message');

        input.addEventListener("input", () => {
            if (input.id === 'age') {
                const ageValue = parseInt(input.value, 10);
                if (ageValue > 99 || input.value.length > 2) {
                    input.classList.add('is-invalid');
                    const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                    errorMessage.textContent = ageErrorMessages[randomIndex];
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            }

            if (input.checkValidity() && input.value !== "") {
                icon.style.color = "#28a745";
            } else {
                icon.style.color = "var(--primary-color)";
            }
            updateProgress();
        });

        input.addEventListener("blur", () => {
            if (input.id === 'age') {
                const ageValue = parseInt(input.value, 10);
                if (!input.checkValidity() && input.value && (ageValue > 99)) {
                    input.classList.add('is-invalid');
                    const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                    errorMessage.textContent = ageErrorMessages[randomIndex];
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            } else {
                if (!input.checkValidity() && input.value !== "") {
                    input.classList.add('is-invalid');
                    if (errorMessage) errorMessage.style.display = 'block';
                }
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isFormValid = form.checkValidity();
        const ageInput = document.getElementById('age');
        if (parseInt(ageInput.value, 10) > 99) {
            isFormValid = false;
        }

        if (!isFormValid) {
            inputs.forEach(input => {
                const errorMessage = input.closest('.input-group').querySelector('.error-message');
                if (!input.checkValidity() || (input.id === 'age' && parseInt(input.value, 10) > 99)) {
                    input.classList.add('is-invalid');
                    if (input.id === 'age') {
                        const randomIndex = Math.floor(Math.random() * ageErrorMessages.length);
                        errorMessage.textContent = ageErrorMessages[randomIndex];
                    }
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            });
            return;
        }

        document.getElementById('registration-date-input').value = new Date().toLocaleString('ar-AE', { timeZone: 'Asia/Dubai' });

        const isConfirmed = confirm('هل أنت متأكد من صحة البيانات المدخلة؟');
        if (!isConfirmed) return;

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        formMessage.style.display = 'none';

        try {
            // الخطوة 1: إرسال البيانات إلى قوقل شيت أولاً
            const formData = new FormData(form);
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            // إذا نجح الإرسال، ننتقل للخطوة الثانية
            if (response.ok) {
                // الخطوة 2: جمع البيانات لرسالة الواتساب
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }

                // الكود المعدل هنا:
                const messageBody = `
🎓 *تسجيل جديد في دورة ${data.CourseName}!*

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
                // نهاية الكود المعدل

                // الخطوة 3: توجيه المستخدم إلى واتساب
                window.location.href = `https://wa.me/967778185189?text=${encodeURIComponent(messageBody)}`;

                form.reset();
                updateProgress();
                inputs.forEach(input => {
                    input.classList.remove('is-invalid');
                    const icon = input.closest('.input-with-icon').querySelector('.icon');
                    if(icon) icon.style.color = "var(--primary-color)";
                });

            } else {
                 // إذا فشل الإرسال، نعرض رسالة خطأ
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
