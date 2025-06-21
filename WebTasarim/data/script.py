import csv
import uuid
import random
from datetime import datetime, timedelta

# Kullanıcılar (100 adet rastgele kullanıcı)
users = []
for i in range(1, 101):
    users.append({
        'user_id': i,
        'username': f'user{i}',
        'password': f'pass{i}'
    })

# Kategoriler (her kullanıcı için income ve expense kategorileri)
categories = []
category_types = ['income', 'expense']

for user in users:
    for ctype in category_types:
        for j in range(1, 4):  # Her kullanıcı için 3 kategori
            categories.append({
                'id': str(uuid.uuid4()),
                'user_id': user['user_id'],
                'type': ctype,
                'name': f'{ctype} kategori {j} - user{user["user_id"]}'
            })

# Yardımcı fonksiyon: İki tarih arasında rastgele tarih üret
def random_date(start, end):
    delta = end - start
    int_delta = delta.days
    random_day = random.randint(0, int_delta)
    return start + timedelta(days=random_day)

# Belirli kullanıcı ve kategori tipine göre rastgele kategori getir
def get_random_category(user_id, ctype):
    filtered = [c for c in categories if c['user_id'] == user_id and c['type'] == ctype]
    if not filtered:
        return None
    return random.choice(filtered)

transactions = []
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 6, 21)

# Gelir işlemleri (100 adet)
for _ in range(100):
    while True:
        user = random.choice(users)
        cat = get_random_category(user['user_id'], 'income')
        if cat is not None:
            break
    transactions.append({
        'id': str(uuid.uuid4()),
        'user_id': user['user_id'],
        'date': random_date(start_date, end_date).strftime('%Y-%m-%d'),
        'type': 'income',
        'category_id': cat['id'],
        'amount': round(random.uniform(100, 5000), 2),
        'note': 'otomatik gelir'
    })

# Gider işlemleri (100 adet)
for _ in range(100):
    while True:
        user = random.choice(users)
        cat = get_random_category(user['user_id'], 'expense')
        if cat is not None:
            break
    transactions.append({
        'id': str(uuid.uuid4()),
        'user_id': user['user_id'],
        'date': random_date(start_date, end_date).strftime('%Y-%m-%d'),
        'type': 'expense',
        'category_id': cat['id'],
        'amount': round(random.uniform(10, 2000), 2),
        'note': 'otomatik gider'
    })

# CSV dosyalarını yaz
with open('users.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['user_id', 'username', 'password'])
    writer.writeheader()
    writer.writerows(users)

with open('categories.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['id', 'user_id', 'type', 'name'])
    writer.writeheader()
    writer.writerows(categories)

with open('transactions.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['id', 'user_id', 'date', 'type', 'category_id', 'amount', 'note'])
    writer.writeheader()
    writer.writerows(transactions)

print('CSV dosyaları başarıyla oluşturuldu!')
