export const getUzbekistanTime = async (): Promise<string> => {
    // Опции для форматирования даты
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    // Получение текущей даты в Узбекистане
    const uzbekistanDate = new Intl.DateTimeFormat('ru-RU', options).format(
      new Date(),
    );

    return uzbekistanDate; // Возвращает дату в формате дд.мм.гггг
  }

