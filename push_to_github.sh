#!/data/data/com.termux/files/usr/bin/bash
# سكربت لرفع كل الملفات إلى GitHub مع أخذ رابط المشروع من repo_url.txt
# تأكد أن repo_url.txt يحتوي على رابط المستودع في سطر واحد

# مسار السكربت
SCRIPT_DIR="$(dirname "$0")"
cd "$SCRIPT_DIR" || exit 1

# ملف يحتوي على رابط المستودع
REPO_FILE="/storage/emulated/0/Download/trim/repo_url.txt"

if [ ! -f "$REPO_FILE" ]; then
    echo "خطأ: لم يتم العثور على الملف repo_url.txt في $REPO_FILE"
    exit 1
fi

# قراءة رابط المشروع
REPO_URL="$(cat "$REPO_FILE" | tr -d '\r\n')"

if [ -z "$REPO_URL" ]; then
    echo "خطأ: الملف repo_url.txt فارغ"
    exit 1
fi

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
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# التأكد من الفرع الرئيسي
git branch -M main

# سحب آخر التغييرات لتجنب مشاكل الرفض
git pull origin main --allow-unrelated-histories

# رفع الملفات إلى GitHub
git push -u origin main