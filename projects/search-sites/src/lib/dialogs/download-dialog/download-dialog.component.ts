import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  type: string;
  value: string;
}

@Component({
  selector: 'aca-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {
  downloadLocation = 'local';
  downloadType: string;
  allPages = true;

  constructor(
    public dialogRef: MatDialogRef<DownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData[],
  ) { }

  ngOnInit(): void {
    this.downloadType = 'csv';
  }

  setDownloadType(event: any) {
    if (event.value)
      this.downloadType = event.value;
  }

  onChangeAllPage(event: any) {
    this.allPages = event.checked;
  }

  doAction() {
    console.log(this.allPages, this.downloadType, this.downloadLocation);
    this.dialogRef.close({ allPages: this.allPages, type: this.downloadType, location: this.downloadLocation });
  }
}