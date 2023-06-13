import {Action, Selector, State, StateContext} from '@ngxs/store';
import {storageModelStates} from "../../globals/enums";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {FactModel} from "../../models/fact.model";
import {catchError, delay, map, Observable, of} from "rxjs";
import {Facts} from "./facts.actions";

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

    @Action(Facts.Get) get(ctx: StateContext<FactsStateModel>): Observable<FactsStateModel>|FactsStateModel {

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
        return this.http.get<FactModel[]>('https://cat-fact.herokuapp.com/facts').pipe(
            catchError((error: unknown) => {

                ctx.setState({
                    facts: [],
                    status: storageModelStates.ERROR,
                    error: (error instanceof HttpErrorResponse ? error.message : 'Something wend wrong')
                });

                return []

            }),
            map(data => {

                ctx.setState({facts: data, status: storageModelStates.LOADED});

                return ctx.getState()

            })
        );

    }

    @Action(Facts.Add) add({getState, patchState}: StateContext<FactsStateModel>, {payload}: Facts.Add): void {

        /**
         * simulate backend request that will add new fact
         */
        of(true).pipe(delay(2000)).subscribe(() => {
            patchState({facts: [...getState().facts, payload]})
        });

    }

    @Action(Facts.Remove) remove({getState, patchState}: StateContext<FactsStateModel>, {payload}: Facts.Remove): void {

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
