import { Resetter } from "./Resetter"
import { RefCell } from "./refcell"

type MemoizationType<T> = {
    value?: T
    isValid: boolean
}

export const memoize = <T>(funToMemoize: () => T, resetter?: Resetter) => {
    const refCell = new RefCell<MemoizationType<T>>({ isValid: false })
    resetter?.SetResetAction(() => refCell.value!.isValid = false)
    
    return () => {
        if (refCell.value!.isValid)
            return refCell.value!.value!
        else {
            refCell.value!.value = funToMemoize()
            refCell.value!.isValid = true
            return refCell.value!.value!
        }
    }
}

export const memoizeAsync = <T>(funToMemoize: () => Promise<T>, resetter?: Resetter) => {
    const refCell = new RefCell<MemoizationType<T>>({ isValid: false })
    resetter?.SetResetAction(() => refCell.value!.isValid = false)

    return async () => {
        if (refCell.value!.isValid)
            return refCell.value!.value!
        else {
            refCell.value!.value = await funToMemoize()
            refCell.value!.isValid = true
            return refCell.value!.value!
        }
    }
}
