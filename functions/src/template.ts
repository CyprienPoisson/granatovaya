import * as fs from 'fs';
import Handlebars from 'handlebars';

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

export default function buildTemplate(
  templateName: string,
  language: string,
  data: any
): string {
  const pathPrefix = language === 'fr' ? '' : `${language}/`;
  const templateString = fs
    .readFileSync(`./templates/${pathPrefix}${templateName}.hbs`)
    .toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction: Function = Handlebars.compile(templateString);

  const mergedTemplate: string = templateFunction(data);

  return mergedTemplate;
}
