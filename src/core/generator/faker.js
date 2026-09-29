import { fakerMethods } from "./fakerMethods";


/**
 * Faker 数据生成
 *
 * method:
 *
 * name.chineseName
 * company.companyName
 * address.city
 *
 */
export function generateByFaker(method) {


  const item = fakerMethods[method];


  if (!item) {

    return "";

  }


  return item.generate();


}
