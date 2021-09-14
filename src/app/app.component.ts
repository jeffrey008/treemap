import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'treemap';
  json: string = '';
  row: number = 1;
  arr: any[] = [];

  onClick() {
    this.arr = JSON.parse(this.json);
  }
}
