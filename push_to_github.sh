#!/data/data/com.termux/files/usr/bin/bash
#!/bin/bash
# هذا السكربت يرفع كل الملفات إلى مستودع GitHub R

# الانتقال إلى مجلد المشروع
cd "$(dirname "$0")" || exit 1

# تأكيد أن المجلد آمن
git config --global --add safe.directory "$(pwd)"

# تهيئة المستودع إذا لم يكن موجود
if [ ! -d ".git" ]; then
  git init
fi

# إضافة كل الملفات
git add .

# إنشاء أول كوميت إذا لم يكن هناك كوميتات
if ! git log >/dev/null 2>&1; then
  git commit -m "Initial commit"
else
  git commit -m "Update files" || echo "لا توجد تغييرات جديدة"
fi

# إضافة المستودع البعيد أو تحديثه
git remote add origin https://github.com/BeYou20/R.git 2>/dev/null || git remote set-url origin https://github.com/BeYou20/R.git

# التأكد من الفرع الرئيسي
git branch -M main

# رفع الملفات إلى GitHub
git push -u origin main