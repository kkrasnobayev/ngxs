import {FactModel} from "../../models/fact.model";

export namespace Facts {
  export class Get {
    static readonly type = '[FACTS] Get';
  }

  export class Add {
    static readonly type = '[FACTS] Add'

    constructor(public payload: FactModel) {
    }
  }

  export class Remove {
    static readonly type = '[FACTS] Remove'

    constructor(public payload: FactModel) {
    }
  }
}

