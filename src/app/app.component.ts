import {Component, OnInit} from '@angular/core';
import {JsonEditorOptions} from "ang-jsoneditor";

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

  constructor() {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'tree'];
    this.editorOptions.expandAll = true;
    this.editorOptions.search = false;
  }

  ngOnInit() {
    this.onClick()
  }

  // onClick() {
  //   this.rowHeight = 100 / this.row;
  //   // sort items by weight desc
  //   let sorted = this.json.sort((a: any, b: any) => {
  //     return b.weight - a.weight
  //   });
  //   let totalWeight = sorted.reduce(((pre: any, cur: any) => pre + cur.weight), 0);
  //   let weightPerRow = Math.max(sorted[0].weight, Math.ceil(totalWeight / this.row));
  //   console.log('totalWeight', totalWeight)
  //   console.log('weightPerRow', weightPerRow)
  //   this.arr = Array.from({length: this.row}, e => Array());
  //   let j = 0;
  //   let remainingItemCount = sorted.length;
  //   for (let i = 0; i < this.arr.length; i++) {
  //     let row = this.arr[i];
  //     let currentWeight = 0
  //     while (j < sorted.length) {
  //       let item = sorted[j];
  //
  //       // if number of remaining EMPTY row == number of remaining items, fill empty row with 1 item
  //       if (this.arr.filter(a => a.length === 0).length === remainingItemCount) {
  //         if (row.length == 0) {
  //           item.filled = true
  //           item.width = item.weight / weightPerRow * 100;
  //           row.push(item);
  //           j++
  //           remainingItemCount--;
  //         }
  //         break;
  //       }
  //
  //       if (currentWeight + item.weight <= weightPerRow) {
  //         item.filled = true
  //         item.width = item.weight / weightPerRow * 100;
  //         row.push(item);
  //         j++
  //         remainingItemCount--;
  //         currentWeight += item.weight;
  //         // next row if current row is full
  //         if (currentWeight == weightPerRow) {
  //           break;
  //         }
  //       } else {
  //         break;
  //       }
  //     }
  //   }
  //   // it is possible that remaining item with smaller weight haven't filled
  //   if (remainingItemCount > 0) {
  //     for (let i = 0; i < sorted.length; i++) {
  //       let item = sorted[i];
  //
  //       if (item.filled) {
  //         continue;
  //       }
  //       for (let j = 0; j < this.arr.length; j++) {
  //         let row = this.arr[j];
  //         let currentWeight = row.reduce(((pre: any, cur: any) => pre + cur.weight), 0);
  //
  //         if (currentWeight + item.weight <= weightPerRow) {
  //           item.filled = true
  //           item.width = item.weight / weightPerRow * 100;
  //           row.push(item);
  //           remainingItemCount--;
  //           currentWeight += item.weight;
  //           break;
  //         }
  //       }
  //     }
  //     console.log(this.arr)
  //   }
  // }

  onClick() {
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
