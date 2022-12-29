import { AppConfigService, NodesApiService } from '@alfresco/adf-core';
import { MinimalNode, ResultSetPaging } from '@alfresco/js-api';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'aca-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.scss']
})
export class BuildingInfoComponent implements  OnInit {
  data: ResultSetPaging;
  nodeId:string = '';
  node: MinimalNode;
  breadcrumbPath:string = '';
  bppsId: string = '';
  imgsId: string = '';
  supportingDocsId: string = '';
  zonePlansId: string = '';
  ecmHost: string;
  constructor(private appConfig: AppConfigService,private activatedRoute: ActivatedRoute,private nodeService: NodesApiService) {
    this.ecmHost = this.appConfig.get<string>('ecmHost');
    
   }
   @Input()
   showViewer: boolean = false;

   id: string;

   showPreview(event) {
       if (event.value.entry.isFile) {
           this.id = event.value.entry.id;
           this.showViewer = true;
       }
   }
   handleNodeClick(event: Event) {
    let nodeId = (event as CustomEvent).detail?.node.entry.id;
    console.log(nodeId);
    location.href  = '/#/edms/building-info;id=' + encodeURIComponent(nodeId) + '(viewer:view/'+nodeId+')';
    //alert('Document previwing....');
  }
  
  ngOnInit(): void {
    
    this.nodeId = this.activatedRoute.snapshot.params['id'];
    this.nodeService.getNode(this.nodeId).subscribe((entry: MinimalNode) => {
      let node: MinimalNode = entry;
      this.node = node;
      this.breadcrumbPath = node.path.name.replace('/','').split('/').join(" > ");
      this.nodeService.getNodeChildren(this.nodeId).subscribe((nodePaging) => {
        
        nodePaging.list.entries.forEach( (data) => {
          let name = data.entry.name;
          switch(name) { 
            case 'BPPs': { 
              this.bppsId = data.entry.id;
              break; 
            } 
            case 'Images': { 
              this.imgsId = data.entry.id; 
              break; 
            } 
            case 'Supporting Documents': { 
              this.supportingDocsId = data.entry.id; 
              break; 
           } 
            case 'Zone Plans': { 
              this.zonePlansId = data.entry.id;
              break; 
           } 
          }
      });
      });
        
    });
  }
  launchHbdrClassicView(){

    window.open(
      this.ecmHost+"/share/page/site/hbdr/documentlibrary#filter=path|"+encodeURIComponent(this.node.path.name.replace('/Company Home/Sites/hbdr/documentLibrary','')+'/'+this.node.name)+"|&page=1", "_blank");
  }
  goBack() {
    window.history.back();
  }
}
