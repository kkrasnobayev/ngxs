import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {FactsState, FactsStateModel} from "../store/facts/facts.state";
import {FactModel} from "../models/fact.model";
import {Facts} from "../store/facts/facts.actions";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

  isDeleting: boolean = false;

  @Select(FactsState.get) facts$?: Observable<FactsStateModel>;

  constructor(private store: Store) {
    this.store.dispatch(new Facts.Get());
  }

  ngOnInit(): void {
    this.facts$?.subscribe(() => this.isDeleting = false);
  }

  delete(fact: FactModel): void {

    this.isDeleting = true;

    this.store.dispatch(new Facts.Remove(fact));

  }

}
