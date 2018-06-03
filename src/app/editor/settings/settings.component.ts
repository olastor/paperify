import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import {FormControl} from '@angular/forms';
import { EditorService } from '../editor.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ApiParam} from './apiparam';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../app.component.css']
})
export class SettingsComponent implements OnChanges {
  @Input() selectedParams: ApiParam[];
  @Input() validParams: ApiParam[];
  @Output() public close: EventEmitter<any> = new EventEmitter<any>();
  @Output() public update: EventEmitter<any> = new EventEmitter<any>();

  validParamsNames: string[] = [];
  addingParamName = '';
  addingParamValue: any;

  addingParam: ApiParam;

  optionsCtrl: FormControl;
  filteredOptions: Observable<any[]>;

  constructor(
    private editorService: EditorService
  ) {
    if (!this.validParamsNames) {
      this.validParamsNames = this.validParams.map(x => x.name);
    }

    this.optionsCtrl = new FormControl();
    this.filteredOptions = this.optionsCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.validParams.slice())
      );
  }

  ngOnChanges(): void {
  }

  addNewParam(evt): void {
    evt.preventDefault();

    let newParam = this.validParams.filter(x => x.name === this.addingParamName);

    if (!newParam) {
      return;
    }

    const selectedParam = JSON.parse(JSON.stringify(newParam[0]));

    if (selectedParam.values) {
      selectedParam.value = selectedParam.values[0];
    } else if (selectedParam.type === 'string') {
      selectedParam.value = '';
    } else if (selectedParam.type === 'number') {
      selectedParam.value = 0;
    } else if (selectedParam.type === 'boolean') {
      selectedParam.value = true;
    }

    this.selectedParams.push(selectedParam);
    this.addingParamName = '';
  }

  removeParam(target: ApiParam): void {
    for (let i = 0; i < this.selectedParams.length; i++) {
      if (this.selectedParams[i].name === target.name) {
        this.selectedParams.splice(i, 1);
        return;
      }
    }
  }

  filterStates(name: string) {
    return this.validParams.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
}
