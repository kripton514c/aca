import { Options, CsvExporterService, JsonExporterService, TxtExporterService } from 'mat-table-exporter';

export class CsvExporter extends CsvExporterService {
  public createContent(rows: Array<any>, options?: Options): any {
    return super.createContent(rows, options);
  }
}

export class JsonExporter extends JsonExporterService {
  public createContent(rows: Array<any>, options?: Options): any {
    return super.createContent(rows, options);
  }
}

export class TextExporter extends TxtExporterService {
  public createContent(rows: Array<any>, options?: Options): any {
    return super.createContent(rows, options);
  }
}
