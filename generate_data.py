import os
import json

# Путь к папке с изображениями
IMAGES_DIR = 'images'
# Имя файла, куда будут сохраняться данные
OUTPUT_FILE = 'data.json'

models_data = []

# Проверяем, существует ли папка images
if not os.path.isdir(IMAGES_DIR):
    print(f"Ошибка: Папка '{IMAGES_DIR}' не найдена. Создайте ее и добавьте папки с моделями.")
    exit()

# Получаем список папок-моделей
model_folders = [f for f in os.listdir(IMAGES_DIR) if os.path.isdir(os.path.join(IMAGES_DIR, f))]

for model_name_raw in model_folders:
    model_path = os.path.join(IMAGES_DIR, model_name_raw)
    
    # Получаем список файлов изображений
    try:
        images = [os.path.join(model_path, img).replace("\\", "/") for img in os.listdir(model_path)]
    except OSError:
        continue # Пропускаем файлы, которые не являются папками

    # Формируем данные для одной модели
    model_info = {
        "id": model_name_raw,
        # Заменяем подчеркивания на пробелы для красивого отображения
        "name": model_name_raw.replace('_', ' '),
        # Вы можете вручную добавить сюда описания для каждой модели
        "description": f"Это примеры генераций для модели {model_name_raw.replace('_', ' ')}. Она отлично подходит для создания артов в своем уникальном стиле.",
        "images": images,
        "likes": 0 # Начальное значение лайков
    }
    models_data.append(model_info)

# Записываем все данные в JSON файл
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(models_data, f, ensure_ascii=False, indent=4)

print(f"✅ Готово! Файл '{OUTPUT_FILE}' успешно создан/обновлен с {len(models_data)} моделями.")