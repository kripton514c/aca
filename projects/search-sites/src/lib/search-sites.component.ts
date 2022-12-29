import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContentTypeService, AspectListService } from '@alfresco/adf-content-services';
import { NodesApiService, SearchService, SitesService } from '@alfresco/adf-core';
import { TypeEntry } from '@alfresco/js-api/typings/src/api/model-rest-api/model/typeEntry';
import { Property } from '@alfresco/js-api/typings/src/api/content-rest-api/model/property';
import { PaginationModel } from '@alfresco/adf-core';
import { UploadService } from '@alfresco/adf-core';
import { MinimalNode, ResultSetPaging, SearchRequest, SiteEntry } from '@alfresco/js-api';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DownloadDialogComponent } from './dialogs/download-dialog/download-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { JsonExporter, CsvExporter, TextExporter } from './exporter/CustomExporter';
import { MatOption } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

interface ContentProperty {
  type: String;
  properties: Property[]
};

@Component({
  selector: 'lib-search-sites',
  templateUrl: 'search-sites.component.html',
  styleUrls: ['search-sites.component.css']
})

export class SearchSitesComponent implements OnInit {
  searchSitesForm: FormGroup;
  currentSiteId: string;
  currentSiteName: string;
  private paginator: MatPaginator;
  dataSource = new MatTableDataSource<any[]>();
  datatableSchema: any[];
  propertyCtrl = new FormControl();
  propertyFilterCtrl = new FormControl();
  typeFilterCtrl = new FormControl();
  sitesFilterCtrl = new FormControl();
  aspectFilterCtrl = new FormControl();
  folderFilterCtrl = new FormControl();
  dropdownList = [];
  downloadData = [];
  selectedSite = [];
  selectedContents = [];
  folderList = [];
  folderFilterList: any[];
  aspectsList: any[];
  aspectFilterList: any[];
  aspectProperties: any[];
  contentTypeList: TypeEntry[];
  contentProperties: ContentProperty[];
  propertyList: any[];
  selectedProperties = [];
  pagination: PaginationModel;
  paginationObj: {};
  searchRequestData: SearchRequest;
  displayedColumns: any[];
  length: any;
  pageIndex: any;
  selectedAspects: any[];
  pageSize = 10;
  sites: SiteEntry[];
  sitesFilterList: any[];
  propertyFilterList: any[];
  typeFilterList = [];
  loader: boolean;
  jsonExporter: JsonExporter;
  csvExporter: CsvExporter;
  textExporter: TextExporter;
  currentNode: MinimalNode;
  multiSiteSelect = true;
  folderReset = false;
  splChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  defaultColumns = [
    {
      id: 'cm:name',
      name: 'Name'
    },
    {
      id: 'cm:title',
      name: 'Title'
    },
    {
      id: 'cm:creator',
      name: 'Creator'
    },
    {
      id: 'cm:created',
      name: 'Created Date'
    },
    {
      id: 'size',
      name: 'Size'
    },
    {
      id: 'cm:modifier',
      name: 'Modifier'
    },
    {
      id: 'cm:modified',
      name: 'Modified Date'
    },
    {
      id: 'mimeType',
      name: 'MimeType'
    },
    {
      id: 'filePath',
      name: 'File Path'
    },
  ]


  @ViewChild('allProperty') private propertyAll: MatOption;
  @ViewChild('contentAll') private contentAll: MatOption;
  @ViewChild('aspectAll') private aspectAll: MatOption;
  // @ViewChild('typesSelect') private typesSelect: MatSelect;
  // @ViewChild('aspectsSelect') private aspectsSelect: MatSelect;

  downloadTypeList = [
    { type: "Csv", value: "csv" },
    { type: "Text", value: "txt" },
    { type: "Json", value: "json" },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private aspectListService: AspectListService,
    private snackBar: MatSnackBar,
    private contentTypeService: ContentTypeService,
    private sitesService: SitesService,
    private nodeApi: NodesApiService,
    private uploadService: UploadService,
    private searchService: SearchService,
    public dialog: MatDialog,
    private datePipe: DatePipe) {
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit(): void {

    this.searchSitesForm = this.fb.group({
      sites: [null, Validators.required],
      // folders: [null],
      types: [null],
      aspects: [null],
      properties: [null, Validators.required],
    });

    this.paginationObj = {
      maxItems: this.pageSize,
      skipCount: 0
    };

    this.loader = false;
    this.datatableSchema = [];
    this.jsonExporter = new JsonExporter();
    this.csvExporter = new CsvExporter();
    this.textExporter = new TextExporter();
    this.propertyList = [];
    const { route } = this;
    let nodeId: string;

    route.queryParamMap.subscribe(async (queryMap: Params) => {
      if (queryMap.params.node) {
        this.multiSiteSelect = false;
        nodeId = queryMap.params.node;
        this.currentNode = await this.getNodeById(nodeId);
        this.currentSiteId = this.currentNode.path.elements.find(path => path.nodeType === 'st:site').id;
        // this.getFolders(nodeId);
      }
      this.getSites();

    });

    // this.searchSitesForm.get('sites').valueChanges.subscribe((val) => {
    //   this.getFolders(val);
    // });

    this.searchSitesForm.get('types').valueChanges.subscribe((contents) => {
      contents = contents.filter((content) => content !== 0);
      let aspects = this.searchSitesForm.get('aspects').value;
      aspects = aspects ? aspects.filter((aspect) => aspect !== 0) : null;
      this.typeOrAspectsSelected(contents, aspects);
    });

    this.searchSitesForm.get('aspects').valueChanges.subscribe((aspects) => {
      aspects = aspects.filter((content) => content !== 0);
      let contents = this.searchSitesForm.get('types').value;
      contents = contents ? contents.filter((content) => content !== 0) : null;
      this.typeOrAspectsSelected(contents, aspects);
    });

    this.propertyFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterProperty();
      });

    this.typeFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterType();
      });

    this.aspectFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterAspects();
      });

    this.folderFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterFolder();
      });

    this.sitesFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterSites();
      });

    this.aspectListService.getCustomAspects().subscribe((aspects) => {
      this.aspectsList = aspects.map((aspect) => { return { aspect: aspect.entry.title, value: aspect.entry.id } });
      this.aspectFilterList = this.aspectsList.slice();
      this.aspectProperties = aspects.map((aspect) => {
        return {
          aspect: aspect.entry.id,
          properties: aspect.entry.properties
        }
      });
      if (nodeId) {
        let aspectsVal = [0, ...this.aspectFilterList.map((aspect) => aspect.value)];
        this.searchSitesForm.get('aspects').setValue(aspectsVal);
      }
    })

    this.contentTypeService.getContentTypeChildren('cm:content').subscribe((contentType) => {
      this.dropdownList = contentType.map((content) => { return { type: content.entry.title, value: content.entry.id } });
      this.typeFilterList = this.dropdownList.slice();
      this.contentProperties = contentType.map((content) => {
        return {
          type: content.entry.id,
          properties: content.entry.properties
        };
      });
      if (nodeId) {
        let contentVal = [0, ...this.typeFilterList.map((content) => content.value)];
        this.searchSitesForm.get('types').setValue(contentVal);
      }
    });
  }

  // onBreadcrumbNavigate(event: PathElement) {
  //   console.log(event);
  //   if (event.nodeType !== 'st:site') {
  //     let navigateUrl = `search/sites?node=${event.id}`;
  //     this.folderReset = false;
  //     this.router.navigateByUrl(navigateUrl);
  //   }
  // }

  getSites() {
    this.sitesService.getSites().toPromise().then((res) => {
      this.sites = res.list.entries;
      this.sitesFilterList = this.sites.slice();
      if (this.currentNode) {
        if (this.currentNode.nodeType === 'st:site') {
          this.currentSiteName = this.currentNode.name;
          this.searchSitesForm.get('sites').setValue(this.currentNode.name);
        }
        else {
          let sitePath = this.currentNode.path.elements.find((el) => (el.nodeType === 'st:site'));
          if (sitePath) {
            let site = this.sites.find((site) => (site.entry.guid === sitePath.id));
            this.searchSitesForm.get('sites').setValue(site.entry.id);
            this.currentSiteName = site.entry.id;
          }
        }
      }
    });
  }

  getNodeById(nodeId: string) {
    return this.nodeApi.getNode(nodeId).toPromise().then((node) => node);
  }

  createFolder(folderName: string) {
    return this.nodeApi.createFolder('-my-', { name: folderName }).toPromise().then((node) => node);
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.searchRequestData.paging = {
        maxItems: this.paginator.pageSize,
        skipCount: this.paginator.pageSize * this.paginator.pageIndex
      };
      this.searchFilesBySiteAndContentType();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DownloadDialogComponent, {
      width: '300px',
      height: '400px',
      data: this.downloadTypeList,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.startDownloadProcess(result);
    });
  }


  async startDownloadProcess(result) {
    if (!result)
      return;
    let filename = 'export';
    let folderNode: MinimalNode;
    if (!this.multiSiteSelect)
      filename = `${this.searchSitesForm.value.sites}-${this.currentNode.name}`;
    if (result.location === 'alfresco') {
      let today = new Date();
      let folderName = `Report-${this.datePipe.transform(today, 'yyyy-MM-dd-HH-mm-ss')}`;
      folderNode = await this.createFolder(folderName);
    }

    this.loader = true;
    this.downloadData = [];
    try {
      if (!result.allPages) {
        let file = `${filename}.${result.type}`;
        this.downloadData = this.dataSource.data;
        let data = this.createContent(`${filename}.${result.type}`, result.type);
        this.download(file, result.location, folderNode, data);
      } else {
        let size = 1000;
        // let chunkPage = 1;
        // let chunkSize = 10000;
        let page = 0;
        let skipCount = page * size;
        let totalLength = this.length;
        // let allData = [];
        while (skipCount < totalLength) {
          let searchReq = this.searchRequestData;
          let pagination = {
            maxItems: size,
            skipCount: skipCount
          };
          searchReq.paging = pagination;
          searchReq.sort = [
            {
              type: 'FIELD',
              field: 'cm:name',
              ascending: true
            }
          ];
          try {
            let response = await this.getContents(searchReq).then((res) => this.convertToDataSource(res));
            // this.downloadData.push([...response]);
            // page++;
            // if ((skipCount > 0 && skipCount % chunkSize === 0)
            //   || totalLength/chunkSize) {
            //   this.downloadFile(`${filename}-part-${chunkPage}.${result.type}`, result.type);
            //   this.downloadData = [];
            // }

            this.downloadData = response;
            page++;
            let file = `${filename}-part-${page}.${result.type}`;
            let data = this.createContent(file, result.type);
            this.download(file, result.location, folderNode, data);
            this.downloadData = [];
            skipCount = page * size;
          } catch (e) {
            let message = `The Current page - ${page} is error. So retrying to get the data.`;
            console.log(message);
          }
        }
      }
      if (result.location === 'alfresco') {
        let message = `All files are stored in the ${folderNode.name} folder.`;
        this.openSnackBar(message);
      }
      this.loader = false;
    }
    catch (err) {
      console.log(err);
      let message = 'Error while downloading data.';
      this.openSnackBar(message);
    }
  }


  selectOneProperty() {
    if (this.propertyAll.selected)
      this.propertyAll.deselect();

    if (this.searchSitesForm.get('properties').value.length === this.propertyFilterList.length)
      this.propertyAll.select();
  }

  allPropertySelection() {
    let property = [];
    if (this.propertyAll.selected)
      property = [0, ...this.propertyFilterList.map(item => item.id)];
    this.searchSitesForm.get('properties').patchValue(property);
  }

  selectOneAspect() {
    if (this.aspectAll.selected)
      this.aspectAll.deselect();

    if (this.searchSitesForm.get('aspects').value.length === this.aspectFilterList.length)
      this.aspectAll.select();
  }

  allAspectSelection() {
    let aspect = [];
    if (this.aspectAll.selected)
      aspect = [0, ...this.aspectFilterList.map(item => item.value)];
    this.searchSitesForm.get('aspects').patchValue(aspect);
  }

  selectOneContent() {
    if (this.contentAll.selected)
      this.contentAll.deselect();

    if (this.searchSitesForm.get('types').value.length === this.typeFilterList.length)
      this.contentAll.select();
  }

  allContentSelection() {
    let content = [];
    if (this.contentAll.selected)
      content = [0, ...this.typeFilterList.map(item => item.value)];
    this.searchSitesForm.get('types').patchValue(content);
  }

  createContent(filename: string, fileType: string) {
    let options = {
      fileName: filename
    };
    let header = {};
    for (let col of this.displayedColumns) {
      header[col] = col;
    }
    if (fileType !== 'json')
      this.downloadData = [header].concat(this.downloadData);
    let data: any;
    switch (fileType) {
      case 'csv':
      case 'xlsx':
        data = this.csvExporter.createContent(this.downloadData, options);
        break;
      case 'txt':
        data = this.textExporter.createContent(this.downloadData, options);
        break;
      case 'json':
        data = this.jsonExporter.createContent(this.downloadData, options);
        break;
    }
    return data;
  }

  download(filename: string, location: string, folderNode: MinimalNode, text: string) {
    if (location === 'local') {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      let nodeBody = {
        name: filename,
        nodeType: 'cm:content'
      };
      let file = new File([text], filename);
      this.uploadService.uploadApi.uploadFile(file, '', folderNode.id, nodeBody);

      // this.uploadService.uploadFile(file, '', folderNode.id, nodeBody);
      // this.nodeApi.createNode(folderNode.id, nodeBody);
    }
  }

  typeOrAspectsSelected(contents: string[], aspects: string[]) {
    this.propertyList = [...this.defaultColumns];
    if (contents) {
      for (let content of contents) {
        let contentType = this.contentProperties.find(type => type.type === content);
        this.propertyList.push(...contentType.properties.map((property) => {
          return {
            'id': property.id,
            'name': property.title
          }
        }));
      }
    }
    if (aspects) {
      for (let aspectVal of aspects) {
        let aspects = this.aspectProperties.find(aspect => aspect.aspect === aspectVal);
        this.propertyList.push(...aspects.properties.map((property) => {
          return {
            'id': property.id,
            'name': property.title
          }
        }));
      }
    }
    this.propertyList = [...new Map(this.propertyList.map((item) => [item["id"], item])).values()];
    this.propertyFilterList = this.propertyList.slice();
    if (this.currentNode) {
      let propertyVal = [0];
      propertyVal.push(...this.propertyFilterList.map(e => e.id));
      this.searchSitesForm.get('properties').setValue(propertyVal);
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
    this.loader = false;
  }

  validation() {
    let validation = true;
    let message = 'Please select';
    if (!this.selectedSite || this.selectedSite.length === 0) {
      validation = false;
      message = `${message} sites`;
    }
    if (this.selectedContents.length === 0) {
      message = `${message}${validation ? '' : ','} content types`;
      validation = false;
    }
    if (!this.propertyCtrl.value || (this.propertyCtrl.value && this.propertyCtrl.value.length === 0)) {
      message = `${message}${validation ? '' : ' and'} properties`;
      validation = false;
    }
    if (!validation) {
      this.openSnackBar(message);
      return validation;
    }
    return validation;
  }

  onSubmit() {
    let formVal = this.searchSitesForm.value;
    this.loader = true;
    // if (!this.validation())
    //   return;
    let properties = [];
    for (let property of formVal.properties) {
      if (property !== 0) {
        let val = this.propertyFilterList.find(e => e.id === property);
        if (val)
          properties.push(val);
      }
    }

    this.datatableSchema = properties.map((property) => {
      return {
        columnDef: property.id,
        header: property.id,
        cell: (element: any) => `${element[property.id]}`,
      }
    });
    this.displayedColumns = properties.map(p => p.id);
    // let sites: string;
    // let folders: string;
    let query = '';
    if (this.multiSiteSelect) {
      query = formVal.sites.map((site) => `SITE:'${site}'`).join(' OR ');
      // folders = formVal.folders.map((folder) => `PARENT:'workspace://SpacesStore/${folder}'`).join(' OR ');
    } else {
      // sites = `SITE:'${formVal.sites}'`;
      let folder = `/cm:${this.encode(this.currentNode.name)}//*'`;
      query = `PATH:'/app:company_home/st:sites`;
      for (let element of this.currentNode.path.elements) {
        let name = element.name;
        if (name !== 'Company Home' && name !== 'Sites')
          query += `/cm:${this.encode(name)}`;
      }
      query += folder;
    }
    query += ' AND ';
    let contents = formVal.types.filter((content) => content !== 0);
    let contentTypes = contents.map((content) => `TYPE:'${content}'`);
    query += `(${contentTypes.join(' OR ')})`;
    this.searchRequestData = {
      query: {
        query,
        language: 'afts'
      }, include: ['aspectNames', 'properties', 'path'],
      paging: this.paginationObj,
      sort: [
        {
          type: 'FIELD',
          field: 'cm:name',
          ascending: true
        }
      ]
    };
    this.searchFilesBySiteAndContentType();
  }

  getContents(searchData: SearchRequest) {
    return this.searchService.searchApi.search(searchData).then((res) => res);
  }

  convertToDataSource(res: ResultSetPaging) {
    let data = [];
    for (let entry of res.list.entries) {
      const nodeEntry = entry.entry;
      // let path = `PATH:'/app:company_home/st:sites`;
      // for (let element of nodeEntry.path.elements) {
      //   let name = element.name;
      //   if (name !== 'Company Home' && name !== 'Sites')
      //     path += `/cm:${this.encode(name)}`;
      // }
      // path += `/cm:${this.encode(nodeEntry.name)}`;
      let cols = {
        'cm:name': nodeEntry.name,
        'cm:title': nodeEntry.properties['cm:title'] || '--',
        'cm:creator': nodeEntry.createdByUser.displayName || '--',
        'cm:created': nodeEntry.createdAt || '--',
        'size': this.formatBytes(nodeEntry.content.sizeInBytes) || '--',
        'cm:modifier': nodeEntry.modifiedByUser.displayName || '--',
        'cm:modified': nodeEntry.modifiedAt || '--',
        'mimeType': nodeEntry.content.mimeType || '--',
        'filePath': `${nodeEntry.path.name}/${nodeEntry.name}`
      };
      let defaultCols = this.defaultColumns.map(col => col.id);
      for (let property of this.displayedColumns) {
        if (!defaultCols.includes(property))
          cols[property] = nodeEntry.properties[property] || "--";
      }
      data.push(cols);
    }
    return data;
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  searchFilesBySiteAndContentType() {
    this.loader = true;
    this.getContents(this.searchRequestData).then((response) => {
      let pagination = response.list.pagination;
      this.length = pagination.totalItems;
      this.dataSource.data = this.convertToDataSource(response);
      setTimeout(() => {
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.length = this.length;
      });
      this.loader = false;
    }).catch(() => {
      this.loader = false;
      let message = 'Error while calling Search API.';
      this.openSnackBar(message);
    });
  }

  protected filterProperty() {
    let search = this.propertyFilterCtrl.value;
    if (!search) {
      this.propertyFilterList = this.propertyList.slice();
      return;
    }
    search = search.toLowerCase();
    this.propertyFilterList =
      this.propertyList.filter(property => property.id.toLowerCase().indexOf(search) > -1);
  }

  protected filterType() {
    let search = this.typeFilterCtrl.value;
    if (!search) {
      this.typeFilterList = this.dropdownList.slice();
      return;
    }
    search = search.toLowerCase();
    this.typeFilterList =
      this.dropdownList.filter(type => type.type.toLowerCase().indexOf(search) > -1);
  }

  protected filterFolder() {
    let search = this.folderFilterCtrl.value;
    if (!search) {
      this.folderFilterList = this.folderList.slice();
      return;
    }
    search = search.toLowerCase();
    this.folderFilterList =
      this.folderList.filter(folder => folder.entry.name.toLowerCase().indexOf(search) > -1);
  }

  protected filterSites() {
    let search = this.sitesFilterCtrl.value;
    if (!search) {
      this.sitesFilterList = this.sites.slice();
      return;
    }
    search = search.toLowerCase();
    this.sitesFilterList =
      this.sites.filter(site => site.entry.title.toLowerCase().indexOf(search) > -1);
  }

  protected filterAspects() {
    let search = this.aspectFilterCtrl.value;
    if (!search) {
      this.aspectFilterList = this.aspectsList.slice();
      return;
    }
    search = search.toLowerCase();
    this.aspectFilterList =
      this.aspectsList.filter(aspect => aspect.aspect.toLowerCase().indexOf(search) > -1);
  }

  encode(str: any) {
    let encodedStr = str.charAt(0);
    if (!isNaN(encodedStr) || this.splChar.test(encodedStr))
      encodedStr = `_x00${Number(encodedStr.charCodeAt(0)).toString(16)}_`;
    for (let i = 0; i < str.length; i++) {
      if (i != 0) {
        let char = str.charAt(i);
        if (this.splChar.test(char))
          char = `_x00${Number(char.charCodeAt(0)).toString(16)}_`;
        encodedStr += char;
      }
    }
    return encodedStr;
  };
}
