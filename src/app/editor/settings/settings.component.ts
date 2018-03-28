import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../app.component.css']
})
export class SettingsComponent implements OnChanges {
  @Input() currentParams: string;
  @Output() public close: EventEmitter<any> = new EventEmitter<any>();
  @Output() public update: EventEmitter<any> = new EventEmitter<any>();

  customParams: string = '';
  flags = {
    '--number-sections': false,
    '--table-of-contents': false,
    '--listings': false,
    '--standalone': false,
    '--no-highlight': false,
    '--to=beamer': false,
    '--incremental': false,
  };

  constructor() { }

  ngOnChanges(): void {
    if (this.currentParams) {
      let temp = this.currentParams;
      Object.keys(this.flags).map(p => {
        if (temp.includes(p)) {
          this.flags[p] = true;
          temp = temp.replace(p, '');
        }
      });
      this.customParams = temp.trim();
    }
  }

  /**
   * Generates whole parameters string and triggers update in parent component.
   */
  triggerUpdate(): void {
    this.update.emit(
      Object.keys(this.flags).filter(x => this.flags[x]).join(' ') + ' ' + this.customParams
    );
  }
}
