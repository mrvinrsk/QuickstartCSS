const classPrefix = "qscss_";

$(function () {
    /* Tables */
    document.querySelectorAll('table').forEach(function (table) {
        console.log(table);
        table.outerHTML = '<div class="' + classPrefix + 'table-wrapper">' + table.outerHTML + '</div>';
    });
});