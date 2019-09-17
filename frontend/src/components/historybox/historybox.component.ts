import { Component, Input, Output, EventEmitter} from '@angular/core';
import { TranslateService } from '../../translate/translate.service';
import { HistoryModel } from '../../models/HistoryModel';


@Component({
    selector: 'historybox',
    templateUrl: './historybox.view.html',
    styleUrls: ['./historybox.style.scss']
})


export class HistoryBox {
    @Input() items: HistoryModel[] = [];
    @Output() clickItem: EventEmitter<HistoryModel> = new EventEmitter<HistoryModel>();
 

    public constructor(private _translate: TranslateService) {
    };


    public clickedItem(item: HistoryModel) {
    	this.clickItem.emit(item);
    };
};