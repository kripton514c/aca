import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Pagination} from '@alfresco/js-api';
import { ObjectDataTableAdapter, AlfrescoApiService, AppConfigService, ObjectDataRow} from '@alfresco/adf-core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'aca-edms-model',
  templateUrl: './edms-model.component.html',
  styleUrls: ['./edms-model.component.scss'],
  encapsulation: ViewEncapsulation.None
        
})
export class EdmsModelComponent implements OnInit {
  selected: string;
  types:any[] = [];
  results: any[] = [];
  data: ObjectDataTableAdapter;
  customTypesPrefixStringProcessed: any;
  ecmHost: string;
  pagination: Pagination = {
    skipCount: 0,
    maxItems: 5,
    totalItems:0
   };
   
  constructor(private appConfig: AppConfigService, private http: HttpClient, private alfrescoApi: AlfrescoApiService) { 
    this.ecmHost = this.appConfig.get<string>('ecmHost');
    this.data = new ObjectDataTableAdapter(
      [],
      []
  );
  this.loadContentTypes();
  }
  onPrevPage(pagination: Pagination): void {
    this.pagination.skipCount = pagination.skipCount;
    //console.log(pagination.skipCount);
    let resultsArray = this.results.slice(this.pagination.skipCount, this.pagination.skipCount +this.pagination.maxItems);
    this.data.setRows(resultsArray.map(item => {
  return new ObjectDataRow(item);
    }));
    }

onNextPage(pagination: Pagination): void {
    this.pagination.skipCount = pagination.skipCount;
    //console.log(pagination.skipCount);
    let resultsArray = this.results.slice(this.pagination.skipCount, this.pagination.skipCount +this.pagination.maxItems);
              this.data.setRows(resultsArray.map(item => {
            return new ObjectDataRow(item);
              }));
}
onDownload(){
  
    const element = document.createElement("a");
    let records = 'Name,Title,Data Type,Mandatory,Multi Valued\r\n';
    this.results.map(prop => {
      records+= prop.id+','+prop.title+','+prop.dataType+','+prop.isMandatory+','+prop.isMultiValued+'\r\n';
   });
    const file = new Blob([records], {
      type: "text/css",
    });
    element.href = URL.createObjectURL(file);
    element.download = this.selected.replace(':','_')+'.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

}
onChangePageSize(pagination: Pagination): void {
    const { maxItems, skipCount } = pagination;
    
    this.pagination.maxItems = maxItems;
    this.pagination.skipCount = skipCount;
    let resultsArray = this.results.slice(this.pagination.skipCount, this.pagination.skipCount +this.pagination.maxItems);
    this.data.setRows(resultsArray.map(item => {
  return new ObjectDataRow(item);
    }));
    //console.log(pagination.skipCount);
}

onChangePageNumber(pagination: Pagination): void {
    this.pagination.skipCount = pagination.skipCount;
   
    //console.log(pagination.skipCount);
    let resultsArray = this.results.slice(this.pagination.skipCount, this.pagination.skipCount +this.pagination.maxItems);
    this.data.setRows(resultsArray.map(item => {
  return new ObjectDataRow(item);
    }));
}
  selectContentType() {
    this.results = [];
      const ticket = this.alfrescoApi.getInstance().getTicketEcm();
      var countRes = this.http.get(
        this.ecmHost +
        '/alfresco/api/-default-/public/alfresco/versions/1/types/'+this.selected+'?skipCount=0&maxItems=100&alf_ticket=' + ticket, {
          responseType:"json"
        });
        
        countRes.subscribe(response => {
          //let results = [];
          for (var prop of response["entry"].properties) {
            //console.log(entry.entry.title);
            this.results.push({id:prop.id,title:prop.title,dataType:prop.dataType,isMandatory:prop.isMandatory,isMultiValued:prop.isMultiValued});
          }
          for (var aspect of response["entry"].mandatoryAspects) {
            //console.log(entry.entry.title);
            var countRes = this.http.get(
              this.ecmHost +
              '/alfresco/api/-default-/public/alfresco/versions/1/aspects/'+aspect+'?skipCount=0&include=properties&maxItems=100&alf_ticket=' + ticket, {
                responseType:"json"
              });
              countRes.subscribe(response => {
              for (var prop of response["entry"].properties) {
                //console.log(entry.entry.title);
                this.results.push({id:prop.id,title:prop.title,dataType:prop.dataType,isMandatory:prop.isMandatory,isMultiValued:prop.isMultiValued});
              }
              this.pagination = {count: this.results.length, maxItems: this.pagination.maxItems, skipCount: this.pagination.skipCount, totalItems: this.results.length};
              let resultsArray = this.results.slice(this.pagination.skipCount, this.pagination.maxItems);
              this.data.setRows(resultsArray.map(item => {
            return new ObjectDataRow(item);
         }));
            });
         }
      }); 
  }
  loadContentTypes() {
   
       const ticket = this.alfrescoApi.getInstance().getTicketEcm();
       
  var countRes = this.http.get(
    this.ecmHost +
    "/alfresco/api/-default-/public/alfresco/versions/1/types?where=(namespaceUri matches('http://www.acuitys.com/model/content/1.0'))&skipCount=0&maxItems=100&alf_ticket=" + ticket, {
      //"/alfresco/api/-default-/public/alfresco/versions/1/types?where=(namespaceUri matches('http://www.alfresco.org/model/content/1.0'))&skipCount=0&maxItems=100&alf_ticket=" + ticket, {
      responseType:"json"
    });
    
    countRes.subscribe(response => {
      
      for (var entry of response["list"].entries) {
        //console.log(entry.entry.title);
        this.types.push({id:entry.entry.id,title:entry.entry.title});
      }
     

    });
  }
  ngOnInit(): void {
   
  }
  
}
