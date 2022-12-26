import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { CoreModule, MaterialModule } from '@alfresco/adf-core';
import { DownloadDialogComponent } from './download-dialog.component';

@NgModule({
  imports: [CoreModule, BrowserModule, FormsModule, MaterialModule, MatInputModule],
  declarations: [DownloadDialogComponent],
  exports: [DownloadDialogComponent]
})
export class DownloadDialogModule { }