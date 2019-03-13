"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const handlebars_1 = require("handlebars");
const subsidiaryLogos = {
    'Akela Interim': 'akela.jpg',
    'Axel Duval': 'axel_duval.jpg',
    'Axel Sud': 'axel_sud.jpg',
    'Brein Transports': 'brein_transports.jpg',
    'Groupe Poisson': 'entite_groupepoisson.png',
    'Marcel Equipment': 'logo-marcel-equipment-limited.jpg',
    'Maintenance Service': 'maintenance_service.jpg',
    Morel: 'morel.jpg',
    'Poisson Formation': 'poisson_formation.jpg',
    'Select Civil': 'select_civil.jpg',
    SNDM: 'sndm.jpg',
    'Terre-durable': 'terre_durable.jpg',
    'Terre-net': 'terre_net.jpg'
};
function buildTemplate(templateName, language, data) {
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    const templateString = fs
        .readFileSync(`./templates/${pathPrefix}${templateName}.hbs`)
        .toString();
    handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
        return subsidiaryLogos[subsidiary];
    });
    const templateFunction = handlebars_1.default.compile(templateString);
    const mergedTemplate = templateFunction(data);
    return mergedTemplate;
}
exports.default = buildTemplate;
//# sourceMappingURL=template.js.map