#!/data/data/com.termux/files/usr/bin/bash
# سكربت نهائي لرفع كل الملفات إلى GitHub
# رابط المشروع يُقرأ من ملف repo_url.txt

# --- إعدادات ---
REPO_URL_FILE="/storage/emulated/0/Download/trim/repo_url.txt"

# التأكد أن الملف موجود
if [ ! -f "$REPO_URL_FILE" ]; then
  echo "ملف repo_url.txt غير موجود في $REPO_URL_FILE"
  exit 1
fi

# قراءة رابط المستودع من الملف
REPO_URL=$(cat "$REPO_URL_FILE" | tr -d '\r\n')

# الانتقال إلى مجلد السكربت
cd "$(dirname "$0")" || exit 1

# التأكد أن المجلد آمن
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
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# التأكد من الفرع الرئيسي
git branch -M main

# دمج أي تغييرات موجودة في المستودع البعيد
git pull origin main --allow-unrelated-histories --rebase=false

# رفع الملفات إلى GitHub
git push -u origin main