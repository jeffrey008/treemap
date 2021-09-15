import {Component, OnInit} from '@angular/core';
import {JsonEditorOptions} from "ang-jsoneditor";
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

export const jsonValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const json = <FormArray>control.get('data');

  const error: ValidationErrors = {};
  if (json.length > 50) {
    error['tooLengthy'] = true
  }
  if (json.value.some((d:any) => typeof d.name !== 'string' || d.name.length >= 50)) {
    error['nameError'] = true
  }

  return error ? error : null;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  editorOptions: JsonEditorOptions;

  title = 'treemap';
  json: any = [{"name": "A", "weight": 3, "value": -0.02}, {
    "name": "B",
    "weight": 3,
    "value": 0.05123123
  }, {"name": "C", "weight": 5, "value": 0.015}, {"name": "D", "weight": 1, "value": -0.01}, {
    "name": "E",
    "weight": 3,
    "value": 0.01
  }];
  row: number = 4;
  rowHeight: number = 0;
  arr: any[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'tree'];
    this.editorOptions.expandAll = true;
    this.editorOptions.search = false;

    this.form = this.fb.group({
      data: [this.json,],
      row: 4
    }, { validators: jsonValidator });
  }

  ngOnInit() {
    this.onClick()
  }


  onClick() {
    if(!this.form.valid){
      return;
    }

    this.rowHeight = 100 / this.row;

    let sorted = this.json.sort((a: any, b: any) => {
      return b.weight - a.weight
    });
    this.arr = Array.from({length: this.row}, e => Array());
    for (let i = 0; i < sorted.length; i++) {
      let item = sorted[i];
      // fill each row with 1 item first
      if (i < this.row) {
        this.arr[i].push(item);
        continue;
      }
      // for remaining items, fill into row with least weight
      let leastWeightRowIndex = this.arr.reduce((least, row, index)=> row.reduce(((pre: any, cur: any) => pre + cur.weight), 0) < this.arr[least].reduce(((pre: any, cur: any) => pre + cur.weight), 0) ? index : least,0)
      this.arr[leastWeightRowIndex].push(item);
    }

    // calculate items' width
    let weights = this.arr.map(row => row.reduce(((pre: any, cur: any) => pre + cur.weight), 0));
    let weightPerRow = Math.max(...weights);
    for (let i = 0; i < this.arr.length; i++) {
      let row = this.arr[i];
      for (let j = 0; j < row.length; j++) {
        let item = row[j]
        item.width = item.weight / weightPerRow * 100;
      }
    }
    console.log(this.arr)
  }
}
