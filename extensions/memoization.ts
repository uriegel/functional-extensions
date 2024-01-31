import { Resetter } from "./Resetter"
import { RefCell } from "./refcell"

type MemoizationType<T> = {
    Value: T
    isValid: boolean
}

export const memoize = <T>(funToMemoize: () => T, resetter?: Resetter) => {
    const refCell = new RefCell<MemoizationType<T>>()
    resetter?.SetResetAction(() => refCell.value!.isValid = false)
    
    return () => {
        if (refCell.value!.isValid)
            return refCell.value!.Value
        else {
            refCell.value!.Value = funToMemoize()
            refCell.value!.isValid = true
            return refCell.value!.Value
        }
    }
}

export const memoizeAsync = <T>(funToMemoize: () => Promise<T>, resetter?: Resetter) => {
    const refCell = new RefCell<MemoizationType<T>>()
    resetter?.SetResetAction(() => refCell.value!.isValid = false)

    return async () => {
        if (refCell.value!.isValid)
            return refCell.value!.Value
        else {
            refCell.value!.Value = await funToMemoize()
            refCell.value!.isValid = true
            return refCell.value!.Value
        }
    }
}
