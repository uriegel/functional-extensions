export class Resetter {
    constructor(action: () => void) { this.action = action }
    
    Reset() {
        if (this.action)
            this.action()
    } 
    
    SetResetAction(action: () => void) { this.action = action }
    
    private action?: () => void
}
