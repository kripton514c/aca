/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ThumbnailService, TranslationService } from '@alfresco/adf-core';


@Component({
  selector: 'aca-custom-thumbnail-column',
  templateUrl: './thumbnail-column.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ThumbnailColumnComponent {
  @Input()
  context: any;

  constructor(private translation: TranslationService, public thumbnailService: ThumbnailService) {}

  getThumbnail({ data, row, col }): string {

    //let url = this.thumbnailService.getDocumentThumbnailUrl(row.node.entry['id']);
    console.log(data+ col);
    
    //console.log('url is :'+url);
    if(row.node.entry['nodeType'] == 'cm:folder'){
    return data.getValue(row, col);
    }else{
   return this.thumbnailService.getDocumentThumbnailUrl(row.node.entry['id']);
    }
  }


  getToolTip({ row }): string {
    const user = row.node?.entry?.properties && row.node.entry.properties['cm:lockOwner'] && row.node.entry.properties['cm:lockOwner'].displayName;
    return user ? `${this.translation.instant('APP.LOCKED_BY')} ${user}` : '';
  }
}
