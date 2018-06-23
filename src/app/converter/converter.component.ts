import { Component, OnInit } from '@angular/core';
import { ConverterService } from './converter.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {

  constructor(
    private converterService: ConverterService
  ) { }

  inputText = '';

  optionsFrom = [
    { displayName: 'Markdown', value: 'markdown' },
    { displayName: 'HTML', value: 'html' },
    { displayName: 'LaTeX', value: 'latex' },
    { displayName: 'JSON', value: 'json' }
  ];

  optionsTo = [
    { displayName: 'PDF', value: 'pdf' },
    { displayName: 'PDF (Beamer Slides)', value: 'beamer' },
    { displayName: 'HTML', value: 'html' },
    { displayName: 'Markdown', value: 'markdown' },
    { displayName: 'LaTeX', value: 'latex' },
    { displayName: 'ODT', value: 'odt' },
    { displayName: 'Docx', value: 'docx' },
    { displayName: 'Epub', value: 'epub' },
    { displayName: 'JSON', value: 'json' }
  ];

  downloadOnlyOptions = ['pdf', 'beamer', 'epub', 'docx'];

  selectedFrom = '';
  selectedTo = '';

  loading = false;
  apiResult = null;
  outputText = '';

  ngOnInit() {
  }

  convert(evt): void {
    if (!this.selectedFrom || !this.selectedTo || !this.inputText) return;

    this.loading = true;
    this.converterService.convert(this.inputText, this.selectedFrom, this.selectedTo)
      .subscribe(
        res => {
          this.loading = false;
          this.apiResult = res;

          if (this.downloadOnlyOptions.includes(res.format)) {
            this.outputText = '';
          } else {
            this.outputText = res.text;
          }
        },
        err => {
          console.log('err', err);
          this.loading = false;
          this.apiResult = null;
        }
      );
  }
}
