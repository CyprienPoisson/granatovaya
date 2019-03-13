import * as fs from 'fs';

export default function buildPage(
  pageName: string,
  language: string,
  replacements: Array<[string, RegExp]>
) {
  const pathPrefix = language === 'fr' ? '' : `${language}/`;
  let page: string = fs
    .readFileSync(`./pages/${pathPrefix}${pageName}.html`)
    .toString();
  for (const [text, regex] of replacements) {
    page = page.replace(regex, text);
  }

  return page;
}
