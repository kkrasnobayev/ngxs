import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {FactsState, FactsStateModel} from "../store/facts/facts.state";
import {storageModelStates} from "../globals/enums";
import {Facts} from "../store/facts/facts.actions";

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {

  @Select(FactsState.get) facts$?: Observable<FactsStateModel>

  count?: number

  constructor(private store: Store) {
    this.store.dispatch(new Facts.Get());
  }

  ngOnInit(): void {

    this.facts$?.subscribe((data: FactsStateModel) => {

      /**
       * only update count is state is loaded
       */
      if (data.status === storageModelStates.LOADED) {
        this.count = data.facts.length;
      }

    });

  }

}
