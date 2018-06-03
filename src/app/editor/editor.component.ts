import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiConfig } from '../../api.config';
import { EditorService } from './editor.service';
import { ApiParam } from './settings/apiparam';
declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [
    './editor.component.css',
    '../app.component.css'
  ]
})
export class EditorComponent implements OnInit {

  @ViewChild('editor', {read: ElementRef}) editorWrapper: ElementRef;

  initialLoading: boolean = true;
  loading: boolean = false;

  errorPreview: string = '';

  editor: any;

  apiResponse: any;
  previewUrl: any;
  token: string = ''; // = id for downloading

  params: string = '';
  reValidParams: RegExp;

  showSettings: boolean = false;

  validParams: ApiParam[] = [];
  selectedParams: ApiParam[] = [];

  constructor(
    private editorService: EditorService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    window.onbeforeunload = e => {
      if (this.hasChanges()) {
        const dialogText = 'Your text will be lost.';
        e.returnValue = dialogText;
        return dialogText;
      }
    };

    this.editorService.getValidParams()
      .subscribe(res => {
        this.validParams = res;

        // set defaults,
        // TODO: Make this less ugly later
        this.validParams
          .filter(x => x.name === 'from')
          .map(x => {
            const temp = x;
            temp.value = 'markdown';
            this.selectedParams.push(temp);
          });

        this.validParams
          .filter(x => x.name === 'to')
          .map(x => {
            const temp = x;
            temp.value = 'pdf';
            this.selectedParams.push(temp);
          });
      });
  }

  /**
   * Checks validity of input for CLI params
   *
   * @return     {boolean}  Whether valid or not
   */
  checkParams(): boolean {
    if (typeof this.reValidParams === 'undefined') return false;

    const valid = this.reValidParams.test(this.params);
    const error = valid ? '' : 'Invalid Param(s): ' + this.params
      .match(/\S+/g)
      .filter(p => !this.reValidParams.test(p))
      .join(',');

    // Assigning the error directly by not introducing
    // the 'error' variable results in a console error
    // because the calculation takes too long.
    this.errorPreview = error;

    return valid;
  }

  /**
   * Initializes the ACE editor.
   */
  initEditor(): void {
    this.editor = ace.edit(this.editorWrapper.nativeElement);
    const MarkdownMode = ace.require('ace/mode/markdown').Mode;
    this.editor.session.setMode(new MarkdownMode());
    this.editor.session.setUseWrapMode(true);
    this.editor.session.setTabSize(2);
    this.editor.setOption('cursorStyle', 'slim');
    this.editor.setOption('highlightActiveLine', false);
    this.editor.commands.addCommand({
      name: 'refresh-save',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S',
        sender: 'editor|cli'
      },
      exec: () => this.generate()
    });
  }

  /**
   * Downloads the current state of the document in the desired format.
   *
   * @param      {string}  extension  The extension
   */
  download(extension: string): void {
    if (!extension || !this.token) return;
    window.open(ApiConfig.API_URL + '/api/download/' + this.token + '/' + extension, '_blank');
  }

  /**
   * Loads preview for the current state of the document.
   */
  generate(evt = null): void {
    if (evt) evt.preventDefault();

    const text = this.editor.getValue();
    if (!text || this.loading) return;

    this.loading = true;
    const options = {
      text: text
    };

    this.selectedParams.map(x => options[x.name] = x.value);
    this.editorService.generate(options)
      .subscribe(
        res => {
          this.loading = false;
          this.errorPreview = '';
          this.apiResponse = res;
          // this.token = token;
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.previewLink);
        },
        err => {
          console.log("err", err);
          this.loading = false;

          if (err.error instanceof ErrorEvent) {
            this.errorPreview = 'Failed to connect to server: ' + err.error.message;
          } else {
            this.errorPreview = err.error;
          }
        }
      );
  }

  /**
   * Determines wether or not the user has written text in the editor.
   *
   * @return     {boolean}  True if editor text has changes, False otherwise.
   */
  hasChanges(): boolean {
    return this.editor && this.editor.getValue().length > 0;
  }

  /**
   * Update params string & refresh PDF after settings changed.
   *
   * @param      {string}  params  New params string
   */
  settingsChanged(params): void {
    this.params = params;
    this.generate();
  }

  ngOnInit() {
    // FIX: dirty way to fix https://github.com/olastor/paperify/issues/22
    setTimeout(() => this.initEditor(), 50);

    // check URL params
    const id = this.route.snapshot.params['id'];
    if (id) {
      // check for reserved id
      if (['quickstart'].includes(id)) {
        this.editorService
          .getLocalDoc(id)
          .subscribe(
            res => {
              this.initialLoading = false;
              this.params = res['params'];

              // needs to wait for editor to be loaded
              setTimeout(() => this.editor.setValue(res['text']), 75);
            },
            () => this.initialLoading = false
          );
      } else {
        this.initialLoading = false;
      }
    } else {
      this.initialLoading = false;
    }
  }
}
