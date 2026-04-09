# Быстрая инструкция по переносу на VM

## 1. Подготовительные шаги (на локальной машине)

```bash
# Убедись, что все изменения закоммичены
git status
git add .
git commit -m "fix: correct workout ID retrieval after insert"

# Запушь изменения на GitHub
git push origin main
```

## 2. Деплой на VM

```bash
# Подключись к VM по SSH
ssh user@your-vm-ip

# Установи Node.js (если еще не установлен)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Клонируй репозиторий
cd ~
git clone https://github.com/samirshakirov6/se-toolkit-project.git
cd se-toolkit-project

# Установи зависимости
npm run install-all

# Настрой переменные окружения
cp .env.example .env
nano .env  # Измени JWT_SECRET на случайную строку

# Собери клиентскую часть
cd client && npm run build && cd ..

# Запусти сервер (для тестирования)
npm start

# Для продакшена используй PM2:
sudo npm install -g pm2
pm2 start server/index.js --name workout-tracker
pm2 save
pm2 startup systemd  # следуй инструкции
```

## 3. Проверка

Открой браузер и перейди по адресу:
```
http://your-vm-ip:5000
```

## 4. Настройка Nginx (опционально, для продакшена)

```bash
# Установи Nginx
sudo apt install -y nginx

# Создай конфигурацию
sudo nano /etc/nginx/sites-available/workout-tracker
```

Вставь:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # или IP адрес VM

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активируй сайт
sudo ln -s /etc/nginx/sites-available/workout-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Открой порт
sudo ufw allow 'Nginx Full'
```

## 5. SSL сертификат (опционально)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Важные файлы для бэкапа

- `data/workouts.db` - база данных с тренировками пользователей
- `.env` - переменные окружения (JWT_SECRET)

## Обновление проекта на VM

```bash
cd ~/se-toolkit-project
git pull
npm install
cd client && npm install && npm run build && cd ..
pm2 restart workout-tracker
```
