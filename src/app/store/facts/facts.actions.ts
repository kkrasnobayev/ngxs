import {FactModel} from "../../models/fact.model";

export class GetFacts {
  static readonly type = '[FACTS] Get';
}

export class AddFact {
  static readonly type = '[FACTS] Add'

  constructor(public payload: FactModel) {
  }
}

export class RemoveFact {
  static readonly type = '[FACTS] Remove'

  constructor(public payload: FactModel) {
  }
}
