export class RefCell<T>{

    constructor(value?: T) {
        this.value = value
    }

    value?: T
}