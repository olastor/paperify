import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiConfig } from '../../api.config';
import { EditorService } from './editor.service';

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
  errorParams: string = '';

  editor: any;

  previewUrl: any;
  token: string = ''; // = id for downloading

  params: string = '';
  reValidParams: RegExp;

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
      .subscribe(res => this.reValidParams = new RegExp('^(\\s*|' + res.join('|') + ')*$'));
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
    this.errorParams = error;

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
    window.open(ApiConfig.url + '/api/download/' + this.token + '/' + extension, '_blank');
  }

  /**
   * Loads preview for the current state of the document.
   */
  generate(evt = null): void {
    if (evt) evt.preventDefault();

    const text = this.editor.getValue();
    if (!this.checkParams() || !text || this.loading) return;

    this.loading = true;
    this.editorService.generate(text, this.params)
      .subscribe(
        token => {
          this.loading = false;
          this.errorPreview = '';
          this.token = token;
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ApiConfig.url + '/temp/' + token + '.pdf');
        },
        err => {
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

  ngOnInit() {
    this.initEditor();

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
              this.editor.setValue(res['text']);
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
