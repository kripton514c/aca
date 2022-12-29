import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SitesDropdownModule, BreadcrumbModule, ContentModule } from '@alfresco/adf-content-services';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { ContextMenuModule, CoreModule, MaterialModule } from '@alfresco/adf-core';
import { SearchSitesComponent } from './search-sites.component';
import { SearchSitesService } from './search-sites.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DownloadDialogModule } from './dialogs/download-dialog/download-dialog.module';
import { CommonModule, DatePipe } from '@angular/common';
import { UploadApi } from '@alfresco/js-api';
import { HbdrSearchComponent } from './hbdr-search/hbdr-search.component';
import { EdmsModelComponent } from './edms-model/edms-model.component';
import { BuildingInfoComponent } from './building-info/building-info.component';
import { AppCommonModule } from '../../../../src/app/components/common/common.module';
import { DocumentListCustomComponentsModule } from '../../../../src/app/components/dl-custom-components/document-list-custom-components.module';
import { AppInfoDrawerModule } from '../../../../src/app/components/info-drawer/info.drawer.module';
import { AppLayoutModule } from '../../../../src/app/components/layout/layout.module';
import { AppToolbarModule } from '../../../../src/app/components/toolbar/toolbar.module';
import { DirectivesModule } from '../../../../src/app/directives/directives.module';
import { LockedByModule } from '../../../aca-shared/src/public-api';

export function components() {
  return [SearchSitesComponent, HbdrSearchComponent,EdmsModelComponent, BuildingInfoComponent];
}

@NgModule({
  imports: [CommonModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    AppCommonModule,
    AppInfoDrawerModule,
    AppToolbarModule,
    DirectivesModule,
    AppLayoutModule,
    ContextMenuModule,
    LockedByModule,
    DocumentListCustomComponentsModule,
    CoreModule, BreadcrumbModule, BrowserModule, FormsModule,
     MaterialModule, MatTableExporterModule, SitesDropdownModule,
      MatPaginatorModule, NgxMatSelectSearchModule, DownloadDialogModule],
  providers: [
    UploadApi,
    DatePipe,
    SearchSitesService,
    provideExtensionConfig(['search-sites.json']),
    HbdrSearchComponent,
    EdmsModelComponent,
    
  ],
  
  declarations: components(),
  exports: components(),
})

export class SearchSitesModule {
  constructor(extensions: ExtensionService, myService: SearchSitesService) {
    extensions.setComponents({
      'search-sites.main.component': SearchSitesComponent,
    });
    extensions.setComponents({
      'hbdr-search.main.component' : HbdrSearchComponent
    });
    extensions.setComponents({
      'edms-model.main.component' : EdmsModelComponent
    });
    extensions.setComponents({
      'edms-building-info.main.component' : BuildingInfoComponent
    });
    extensions.setEvaluators({
      'search-sitesr.disabled': () => !myService.mySmartViewerEnabled(),
    });
  }
}