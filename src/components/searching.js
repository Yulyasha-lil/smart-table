import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    const compare = createComparison(
        skipEmptyTargetValues,  // пропускаем пустые значения
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );
    return (data, state, action) => {
        // Если есть текст для поиска - фильтруем
        if (state[searchField]) {
            return data.filter(row => compare(row, state));
        }
        // Если нет текста - возвращаем все данные
        return data;
    }
}