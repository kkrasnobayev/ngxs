import {Action, Selector, State, StateContext} from '@ngxs/store';
import {storageModelStates} from "../../globals/enums";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {FactModel} from "../../models/fact.model";
import {AddFact, GetFacts, RemoveFact} from "./facts.actions";
import {delay, of} from "rxjs";

export type FactsStateModel = {
  facts: FactModel[];         // holds available facts
  status: storageModelStates; // holds facts acquiring status that allows to determine whether they are already loaded or not
  error?: string;             // holds error message, if error happens (optional)
}

@State<FactsStateModel>({
  name: 'facts',
  defaults: {
    facts: [],
    status: storageModelStates.PENDING
  }
})
@Injectable()
export class FactsState {

  constructor(private http: HttpClient) {
  }

  @Selector()
  static get(state: FactsStateModel): FactsStateModel {
    return state
  }

  @Action(GetFacts) get(ctx: StateContext<FactsStateModel>): FactsStateModel {

    const state: FactsStateModel = ctx.getState();

    /**
     * if we have already requested facts from the backend - return their state
     */
    if (state.status !== storageModelStates.PENDING) {
      return state;
    }

    /**
     * set state to "loading"
     */
    ctx.setState({facts: [], status: storageModelStates.LOADING})

    /**
     * make http request to get data;
     * on success - store data to state and mark it as "loaded";
     * on error - mark state as "error", saving error message
     * NOTE: in order to "simulate" error, you can change the url to "https://cat-fact.herokuapp.com/facts2"
     */
    this.http.get<FactModel[]>('https://cat-fact.herokuapp.com/facts')
      .subscribe({
          next: (data: FactModel[]) => {
            ctx.setState({facts: data, status: storageModelStates.LOADED})
          },
          error: (error: unknown) => {

            ctx.setState({
              facts: [],
              status: storageModelStates.ERROR,
              error: (error instanceof HttpErrorResponse ? error.message : 'Something wend wrong')
            });

          }
        }
      )

    return state;

  }

  @Action(AddFact) add({getState, patchState}: StateContext<FactsStateModel>, {payload}: AddFact): void {

    /**
     * simulate backend request that will add new fact
     */
    of(true).pipe(delay(2000)).subscribe(() => {
      patchState({facts: [...getState().facts, payload]})
    });

  }

  @Action(RemoveFact) remove({getState, patchState}: StateContext<FactsStateModel>, {payload}: RemoveFact): void {

    /**
     * simulate backend request that will remove provided fact
     */
    of(true).pipe(delay(2000)).subscribe(() => {

      patchState({
        facts: getState().facts.filter(a => a !== payload)
      })

    });

  }

}
