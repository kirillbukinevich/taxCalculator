import {Component, OnInit} from "@angular/core";
import {HttpService} from "../http.service";
import {IncomeTax} from "../../interface/income-tax.interface";
import {Response} from "@angular/http";


@Component({
  selector: 'income-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [HttpService]
})
export class IncomeTaxTableComponent implements OnInit {


  incomeTaxes: IncomeTax[] = [];

  public columns: Array<any> = [
    {title: 'period', name: 'period', filtering: {filterString: '', placeholder: 'search criteria'}},
    {title: 'goods profit', name: 'profitFromGoods'},
    {title: 'other profit', name: 'profitOther'},
    {title: 'has work', name: 'hasWork'},
    {title: 'benefits', name: 'hasBenefits'},
    {title: 'family benefits', name: 'hasFamilyBenefits'},
    {title: 'number of minors', name: 'numberOfMinors'},
    {title: 'disabled children', name: 'disabledChildren'},
    {title: 'dependents', name: 'dependents'},
    {title: 'insurance cost', name: 'insuranceCost'},
    {title: 'educational cost', name: 'educationalCost'},
    {title: 'housing cost', name: 'housingCost'},
    {title: 'business cost', name: 'businessCost'},
  ];


  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.httpService.getData().subscribe((data: Response) => {
      console.dir(data);
      console.log(data);
      console.log(data.json());
      this.incomeTaxes = data.json();
      console.log(this.incomeTaxes);
      this.onChangeTable(this.config);
      this.length = this.incomeTaxes.length;

    });



  }


  onNotify(person_info: IncomeTax): void {
    alert(person_info.businessCost);
    console.dir('person_info: ' + person_info.period);
    console.log(this.httpService.saveIncomeTax(person_info));
    this.incomeTaxes.push(person_info);
    this.onChangeTable(this.config);

  }

  public rows: Array<any> = [];

  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  public changePage(page: any, data: Array<any> = this.incomeTaxes): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config: any, page: any = {page: this.page, itemsPerPage: this.itemsPerPage}): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.incomeTaxes, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    console.log(data);
  }
}
