import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'aca-hbdr-search',
  templateUrl: './hbdr-search.component.html',
  styleUrls: ['./hbdr-search.component.scss']
})
export class HbdrSearchComponent implements OnInit {
  ngOnInit(): void {
    let hbdrFormIndex;
    this.queryBuilder.searchForms.forEach(forms => {
      hbdrFormIndex = forms.find((form) => form.name=='HBDR 2.0')?.index;
    });    
    if(hbdrFormIndex!=undefined){
      this.queryBuilder.updateSelectedConfiguration(hbdrFormIndex);
      }
            
      this.router.navigateByUrl("/search;q=");
  }
  constructor(private router: Router, private queryBuilder: SearchQueryBuilderService){

  }
 
}

