import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiConfig } from '../../api.config';
import { EditorService } from './editor.service';
import { UserService } from '../shared/user.service';

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

  projectId: string;

  initialLoading: boolean = true;
  loading: boolean = false;

  errorPreview: string = '';

  editor: any;

  previewUrl: any;
  token: string = ''; // = id for downloading

  params = '';
  reValidParams: RegExp;

  lastSaved: {
    content: string,
    params: string,
    date: Date
  } = {
    content: '',
    params: '',
    date: null
  };

  showSettings: boolean = false;

  constructor(
    private editorService: EditorService,
    private location: Location,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {
    window.onbeforeunload = e => {
      if (this.hasUnsavedChanges()) {
        const dialogText = 'You have unsaved changes. Continue?';
        e.returnValue = dialogText;
        return dialogText;
      }
    };

    this.editorService
      .getValidParams()
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
      exec: () => this.update()
    });
  }

  hasUnsavedChanges(): boolean {
    const text = this.editor ? this.editor.getValue() : '';
    if (this.projectId) return this.lastSaved.content !== text || this.lastSaved.params !== this.params;
    return text.length > 0 || this.params;
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

  update(generate: boolean = true): void {
    this.params = this.params ? this.params : '';
    const text = this.editor.getValue();
    if (this.projectId) {
      this.userService.updateProject(this.projectId, text, this.params)
        .subscribe(
          () => {
            this.lastSaved = {
              content: text,
              params: this.params,
              date: new Date()
            };
            if (generate) this.generate(text);
          },
          err => this.errorPreview = 'Could not save text.'
        );
    }
  }
  /**
   * Loads preview for the current state of the document.
   */
  generate(text: string): void {
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
   * Update params string & refresh PDF after settings changed.
   *
   * @param      {string}  params  New params string
   */
  settingsChanged(params): void {
    this.params = params;
    this.update(false);
  }

  createProject(): void {
    if (!this.userService.isLoggedIn()) {
      this.initialLoading = false;
      return;
    }

    this.userService.createProject()
      .subscribe(
        projectId => {
          this.initialLoading = false;
          this.projectId = projectId;
          this.location.go('/edit/' + projectId);
        },
        err => {
          this.initialLoading = false;
          console.error(err);
        }
      );
  }

  ngOnInit() {
    this.initEditor();

    // check URL params
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.userService.getProject(id)
        .subscribe(
          res => {
            this.initialLoading = false;
            this.projectId = res.id;
            this.editor.setValue(res.content);
            this.params = res.compileOptions;
            this.lastSaved = {
              content: res.content,
              params: this.params,
              date: res.updatedAt
            };
          },
          err => {
            this.initialLoading = false;
            console.error(err);
          }
        );
    } else {
      this.createProject();
    }
  }
}
