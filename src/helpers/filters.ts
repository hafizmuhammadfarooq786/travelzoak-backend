import { Injectable } from "@nestjs/common";
import * as _ from "underscore";

@Injectable()
export class FilterService {
  filterData(property: string, value: string, data: any[]) {
    const filteredData = _.filter(data, (item) => item[property] === value);
    return filteredData;
  }
}
