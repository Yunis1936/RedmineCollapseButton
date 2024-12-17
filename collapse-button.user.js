// ==UserScript==
// @name         Redmine Collapse Button for Task and Comment Editors
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Добавляет кнопку Collapse в панель инструментов редакторов задач и комментариев на Redmine.
// @author       Ты
// @match        https://redmine.lachestry.tech/*
// @match        https://redmine.rigla.ru/*
// @icon         https://www.redmine.org/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function addCollapseButton(toolbar, textarea) {
        if (!toolbar || !textarea) {
            return;
        }

        if (toolbar.querySelector('.jstb_collapse')) {
            return;
        }

        const collapseButton = document.createElement('button');
        collapseButton.type = 'button';
        collapseButton.className = 'jstb_collapse';
        collapseButton.title = 'Добавить Collapse';

        // Стили кнопки
                Object.assign(collapseButton.style, {
            marginRight: '2px',
            width: '24px',   // Размер кнопки
            height: '24px',
            backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/15224/15224773.png")', 
            backgroundSize: 'cover', // Размер изображения по размеру кнопки
            backgroundPosition: 'center', // Центрируем изображение
            cursor: 'pointer',
            opacity: '1',  // Убираем прозрачность
        });

        collapseButton.addEventListener('click', function () {
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            const selectedText = textarea.value.substring(selectionStart, selectionEnd).trim();
            if (!selectedText) {
                alert('Пожалуйста, выделите текст для оборачивания в {{collapse}}.');
                return;
            }

            const collapseTitle = prompt('Введите заголовок для Collapse:', 'Скриншот');
            if (!collapseTitle) return;

            const wrappedText = `{{collapse(${collapseTitle})\n${selectedText}\n}}`;

            textarea.value =
                textarea.value.substring(0, selectionStart) +
                wrappedText +
                textarea.value.substring(selectionEnd);

            textarea.setSelectionRange(selectionStart, selectionStart + wrappedText.length);
            textarea.focus();
        });

        toolbar.appendChild(collapseButton);
    }

    function initCollapseButton() {
        const descriptionToolbar = document.querySelector('.jstElements');
        const descriptionTextarea = document.querySelector('#issue_description');
        if (descriptionToolbar && descriptionTextarea) {
            addCollapseButton(descriptionToolbar, descriptionTextarea);
        }

        const commentToolbar = document.querySelectorAll('.jstElements')[1];
        const commentTextarea = document.querySelector('#issue_notes');
        if (commentToolbar && commentTextarea) {
            addCollapseButton(commentToolbar, commentTextarea);
        }
    }

    const observer = new MutationObserver(initCollapseButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
