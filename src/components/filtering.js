import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);


export function initFiltering(elements, indexes) {
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;  
                            
                            return option;
                      })
        )
     })
    return (data, state, action) => {
        if (action && action.name === 'clear') {
            // Получаем имя поля из data-field кнопки
            const fieldName = action.dataset.field;
            
            if (fieldName) {
                // Находим родительский элемент кнопки
                const parent = action.closest('form') || action.parentElement;
                
                // Ищем поле ввода в родительском элементе
                const input = parent.querySelector(`[name="${fieldName}"]`);
                
                if (input) {
                    // Сбрасываем значение поля
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else {
                        input.value = '';
                    }
                    
                    // Обновляем состояние
                    state[fieldName] = '';
                }
            }
        }
        
        // @todo: #4.5 — применить фильтрацию
        return data.filter(row => compare(row, state));
    };
}