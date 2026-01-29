import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    if (before && before.length > 0) {
        before.reverse().forEach(templateId => {
            root[templateId] = cloneTemplate(templateId);
            root.container.prepend(root[templateId].container);
        });
    } 

    if (after && after.length > 0) {
        after.forEach(templateId => {
            root[templateId] = cloneTemplate(templateId);
            root.container.append(root[templateId].container);
        });
    }

    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();

        onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    const element = row.elements[key];
                    const tagName = element.tagName;

                    if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
                        element.value = item[key];
                    } else {
                        element.textContent = item[key];
                    }
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}