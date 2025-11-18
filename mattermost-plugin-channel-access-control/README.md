# Channel Access Control Plugin для Mattermost

Плагин для ограничения доступа к каналам на основе белого списка пользователей.

## Описание

Этот плагин позволяет администраторам Mattermost ограничивать возможность отправки сообщений в определенные каналы только для пользователей из белого списка. Все настройки управляются через удобный интерфейс в консоли администратора.

## Основные возможности

- **Ограничение доступа к каналам**: Настройка белых списков пользователей для каждого канала
- **Удобный интерфейс в админ-панели**: Визуальное управление правилами доступа
- **Гибкая настройка**: Различные настройки для каждого канала
- **Обход для администраторов**: Опциональная возможность для системных администраторов обходить ограничения
- **Настраиваемые сообщения**: Возможность изменить текст сообщения об отказе в доступе

## Требования

- Mattermost Server 5.20.0 или выше
- Go 1.19 или выше (для сборки)
- Node.js 16+ и npm (для сборки веб-приложения)

## Установка

### Вариант 1: Из готового пакета

1. Скачайте файл `.tar.gz` из релизов
2. Войдите в Mattermost как системный администратор
3. Перейдите в **Консоль системы > Плагины > Управление плагинами**
4. Нажмите **Выбрать файл** и загрузите скачанный `.tar.gz` файл
5. Нажмите **Загрузить**
6. Активируйте плагин, нажав **Включить**

### Вариант 2: Сборка из исходников

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-org/mattermost-plugin-channel-access-control.git
cd mattermost-plugin-channel-access-control
```

2. Соберите плагин:
```bash
make build
```

3. Создайте пакет для установки:
```bash
make package
```

4. Установите созданный пакет через консоль администратора (см. Вариант 1, шаги 2-6)

## Настройка

После установки перейдите в **Консоль системы > Плагины > Channel Access Control**:

### Основные настройки

1. **Enable Plugin** - Включить/выключить плагин
2. **Block Message** - Сообщение, которое увидят пользователи при попытке написать в ограниченный канал
3. **Allow System Admins to Bypass** - Разрешить системным администраторам обходить ограничения

### Настройка правил доступа

В разделе **Channel Access Rules** вы можете:

1. **Добавить новое правило**:
   - Введите Channel ID (ID канала)
   - Введите User ID (ID пользователя)
   - Нажмите "Add User"

2. **Удалить пользователя из белого списка**:
   - Найдите нужный канал в списке
   - Нажмите кнопку × рядом с ID пользователя

3. **Удалить весь канал из ограничений**:
   - Нажмите "Remove Channel" рядом с ID канала

### Как получить ID канала и ID пользователя

#### ID канала (Channel ID):
1. Откройте канал в Mattermost
2. Нажмите на название канала в заголовке
3. Выберите "Информация о канале"
4. Скопируйте ID канала

#### ID пользователя (User ID):
1. Откройте профиль пользователя
2. ID будет в URL: `/admin_console/user_management/user/{user_id}`
3. Или используйте API: `GET /api/v4/users/username/{username}`

## Примеры использования

### Пример 1: Ограничить канал "announcements" для всех кроме менеджеров

1. Получите ID канала "announcements" (например: `abc123def456`)
2. Получите ID всех менеджеров (например: `user1id`, `user2id`, `user3id`)
3. В админ-панели добавьте правила:
   - Channel ID: `abc123def456`, User ID: `user1id` - Add User
   - Channel ID: `abc123def456`, User ID: `user2id` - Add User
   - Channel ID: `abc123def456`, User ID: `user3id` - Add User

Теперь только эти три пользователя смогут писать в канал "announcements".

### Пример 2: Создать приватный канал для команды разработки

1. Создайте канал "dev-team"
2. Получите его ID (например: `xyz789ghi012`)
3. Добавьте ID всех разработчиков в белый список
4. Теперь только разработчики могут писать в этот канал

## Формат JSON конфигурации

Если вы предпочитаете редактировать конфигурацию напрямую в JSON формате:

```json
{
  "channel_id_1": ["user_id_1", "user_id_2", "user_id_3"],
  "channel_id_2": ["user_id_4", "user_id_5"],
  "channel_id_3": ["user_id_1"]
}
```

## Разработка

### Структура проекта

```
mattermost-plugin-channel-access-control/
├── plugin.json                 # Манифест плагина
├── Makefile                    # Скрипты сборки
├── server/                     # Серверная часть (Go)
│   ├── plugin.go              # Основная логика плагина
│   └── go.mod                 # Go зависимости
└── webapp/                     # Веб-приложение (React)
    ├── src/
    │   ├── index.jsx          # Точка входа
    │   └── components/
    │       └── channel_rules_settings.jsx  # UI компонент настроек
    ├── package.json           # npm зависимости
    └── webpack.config.js      # Конфигурация сборки
```

### Запуск в режиме разработки

1. Настройте переменные окружения:
```bash
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=your_admin_token
```

2. Запустите в режиме разработки:
```bash
make deploy
```

### Тестирование

```bash
make test
```

## Техническая документация

### Серверные хуки

Плагин использует следующие хуки Mattermost:

- **MessageWillBePosted**: Перехватывает сообщения перед отправкой и проверяет права доступа
- **MessageWillBeUpdated**: Применяет те же ограничения к редактированию сообщений
- **OnConfigurationChange**: Обновляет конфигурацию при изменении настроек
- **OnActivate**: Инициализация при активации плагина

### Логика работы

1. Когда пользователь пытается отправить сообщение, срабатывает хук `MessageWillBePosted`
2. Плагин проверяет, есть ли ограничения для данного канала
3. Если ограничений нет, сообщение разрешается
4. Если есть ограничения, плагин проверяет:
   - Включен ли обход для администраторов и является ли пользователь администратором
   - Находится ли пользователь в белом списке для этого канала
5. Если проверка не пройдена, сообщение блокируется с настраиваемым текстом ошибки

## Устранение неполадок

### Плагин не блокирует сообщения

1. Убедитесь, что плагин включен в настройках
2. Проверьте, что ID канала указан правильно
3. Проверьте логи сервера: `Консоль системы > Логи`
4. Убедитесь, что пользователь не является системным администратором (если включен обход)

### Ошибки при загрузке плагина

1. Проверьте минимальную версию Mattermost (5.20.0+)
2. Убедитесь, что загрузка плагинов включена: `Консоль системы > Плагины > Управление плагинами > Enable Plugin Uploads`
3. Проверьте логи сервера на наличие ошибок

### Изменения в настройках не применяются

1. Убедитесь, что нажали "Save" в консоли администратора
2. Попробуйте деактивировать и активировать плагин заново
3. Проверьте формат JSON в настройках (должен быть валидный JSON)

## Лицензия

Apache License 2.0

## Поддержка

- Создайте issue в GitHub репозитории
- Напишите в сообществе Mattermost

## Благодарности

Плагин создан на основе официальной документации Mattermost и использует лучшие практики разработки плагинов.

---

# Channel Access Control Plugin for Mattermost (English)

A Mattermost plugin to restrict channel posting access to whitelisted users.

## Description

This plugin allows Mattermost administrators to restrict the ability to post messages in specific channels to only users from a whitelist. All settings are managed through a user-friendly interface in the system console.

## Key Features

- **Channel Access Restrictions**: Configure user whitelists for each channel
- **Admin Console UI**: Visual management of access rules
- **Flexible Configuration**: Different settings for each channel
- **Admin Bypass**: Optional ability for system administrators to bypass restrictions
- **Customizable Messages**: Ability to change the access denied message text

## Requirements

- Mattermost Server 5.20.0 or higher
- Go 1.19 or higher (for building)
- Node.js 16+ and npm (for building webapp)

## Installation

### Option 1: From Pre-built Package

1. Download the `.tar.gz` file from releases
2. Log into Mattermost as a system administrator
3. Go to **System Console > Plugins > Plugin Management**
4. Click **Choose File** and upload the downloaded `.tar.gz` file
5. Click **Upload**
6. Activate the plugin by clicking **Enable**

### Option 2: Build from Source

1. Clone the repository:
```bash
git clone https://github.com/your-org/mattermost-plugin-channel-access-control.git
cd mattermost-plugin-channel-access-control
```

2. Build the plugin:
```bash
make build
```

3. Create installation package:
```bash
make package
```

4. Install the created package via system console (see Option 1, steps 2-6)

## Configuration

After installation, go to **System Console > Plugins > Channel Access Control**:

### Basic Settings

1. **Enable Plugin** - Enable/disable the plugin
2. **Block Message** - Message users will see when trying to post in a restricted channel
3. **Allow System Admins to Bypass** - Allow system administrators to bypass restrictions

### Configuring Access Rules

In the **Channel Access Rules** section you can:

1. **Add a new rule**:
   - Enter Channel ID
   - Enter User ID
   - Click "Add User"

2. **Remove a user from whitelist**:
   - Find the channel in the list
   - Click the × button next to the user ID

3. **Remove entire channel from restrictions**:
   - Click "Remove Channel" next to the channel ID

## Development

For development instructions, see the Russian section above.

## License

Apache License 2.0
