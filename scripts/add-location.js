#!/usr/bin/env node

/**
 * Скрипт для добавления новых местоположений участников
 * Использование: node scripts/add-location.js "Город" "Страна" количество_участников широта долгота
 * Пример: node scripts/add-location.js "Павлодар" "Казахстан" 35 52.2833 76.9500
 */

const fs = require('fs');
const path = require('path');

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length !== 5) {
  console.log('Использование: node scripts/add-location.js "Город" "Страна" количество_участников широта долгота');
  console.log('Пример: node scripts/add-location.js "Павлодар" "Казахстан" 35 52.2833 76.9500');
  process.exit(1);
}

const [city, country, participants, lat, lng] = args;

// Валидация данных
if (isNaN(participants) || isNaN(lat) || isNaN(lng)) {
  console.error('Ошибка: количество участников, широта и долгота должны быть числами');
  process.exit(1);
}

// Путь к файлу с данными
const dataFilePath = path.join(__dirname, '..', 'src', 'data', 'participants-locations.ts');

try {
  // Читаем существующий файл
  let fileContent = fs.readFileSync(dataFilePath, 'utf8');
  
  // Создаем новую запись
  const newLocation = `  {
    city: '${city}',
    country: '${country}',
    lat: ${parseFloat(lat)},
    lng: ${parseFloat(lng)},
    participants: ${parseInt(participants)}
  }`;

  // Находим место для вставки (перед закрывающей скобкой массива)
  const insertPosition = fileContent.lastIndexOf('];');
  
  if (insertPosition === -1) {
    throw new Error('Не удалось найти массив participantsLocations в файле');
  }

  // Вставляем новую запись
  const beforeArray = fileContent.substring(0, insertPosition);
  const afterArray = fileContent.substring(insertPosition);
  
  // Добавляем запятую если нужно
  const needsComma = beforeArray.trim().endsWith('}');
  const comma = needsComma ? ',' : '';
  
  fileContent = beforeArray + comma + '\n' + newLocation + '\n' + afterArray;
  
  // Записываем обновленный файл
  fs.writeFileSync(dataFilePath, fileContent, 'utf8');
  
  console.log(`✅ Успешно добавлено местоположение: ${city}, ${country} (${participants} участников)`);
  console.log(`📍 Координаты: ${lat}, ${lng}`);
  
} catch (error) {
  console.error('❌ Ошибка при добавлении местоположения:', error.message);
  process.exit(1);
}