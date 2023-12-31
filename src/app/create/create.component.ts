import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {FactsState, FactsStateModel} from "../store/facts/facts.state";
import {Observable} from "rxjs";
import {Facts} from "../store/facts/facts.actions";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {

  @Select(FactsState.get) facts$?: Observable<FactsStateModel>;

  isAdding: boolean = false;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.facts$?.subscribe(() => this.isAdding = false);
  }

  add(text: string): void {
    this.isAdding = true;
    this.store.dispatch(new Facts.Add({text: text, _id: new Date().getTime().toString()}))
  }

}
