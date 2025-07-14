import { PadPart } from "./pad-part";
import type { StepEvent } from "./sens-floor";

const pressThreshold: number = 140;
const releaseThreshold: number = 136;

export default class PadState {
    private nno: number = 0;
    private ono: number = 0;
    private oso: number = 0;
    private sso: number = 0;
    private ssw: number = 0;
    private wsw: number = 0;
    private wnw: number = 0;
    private nnw: number = 0;

    private isPadPressed: boolean = false;

    private readonly x: number;
    private readonly y: number;
    private readonly stepOn: StepEvent;
    private readonly stepOff: StepEvent;

    constructor(x: number, y: number, stepOn: StepEvent, stepOff: StepEvent) {
        this.x = x;
        this.y = y;
        this.stepOn = stepOn;
        this.stepOff = stepOff;
    }

    update(nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number, wnw: number, nnw: number): void {
        let steppedOnPad: boolean = false;

        // nno
        if (this.nno <= releaseThreshold && nno >= pressThreshold) {
            steppedOnPad = true;
            this.nno = nno;
        } else if (this.nno > pressThreshold && nno <= releaseThreshold) {
            this.nno = nno;
        }

        // ono
        if (this.ono <= releaseThreshold && ono > pressThreshold) {
            steppedOnPad = true;
            this.ono = ono;
        } else if (this.ono > pressThreshold && ono <= releaseThreshold) {
            this.ono = ono;
        }

        // oso
        if (this.oso <= releaseThreshold && oso > pressThreshold) {
            steppedOnPad = true;
            this.oso = oso;
        } else if (this.oso > pressThreshold && oso <= releaseThreshold) {
            this.oso = oso;
        }

        // sso
        if (this.sso <= releaseThreshold && sso > pressThreshold) {
            steppedOnPad = true;
            this.sso = sso;
        } else if (this.sso > pressThreshold && sso <= releaseThreshold) {
            this.sso = sso;
        }

        // ssw
        if (this.ssw <= releaseThreshold && ssw > pressThreshold) {
            steppedOnPad = true;
            this.ssw = ssw;
        } else if (this.ssw > pressThreshold && ssw <= releaseThreshold) {
            this.ssw = ssw;
        }

        // wsw
        if (this.wsw <= releaseThreshold && wsw > pressThreshold) {
            steppedOnPad = true;
            this.wsw = wsw;
        } else if (this.wsw > pressThreshold && wsw <= releaseThreshold) {
            this.wsw = wsw;
        }

        // wnw
        if (this.wnw <= releaseThreshold && wnw > pressThreshold) {
            steppedOnPad = true;
            this.wnw = wnw;
        } else if (this.wnw > pressThreshold && wnw <= releaseThreshold) {
            this.wnw = wnw;
        }

        // nnw
        if (this.nnw <= releaseThreshold && nnw > pressThreshold) {
            steppedOnPad = true;
            this.nnw = nnw;
        } else if (this.nnw > pressThreshold && nnw <= releaseThreshold) {
            this.nnw = nnw;
        }

        // The oso part of the pad at (4|1) is broken, so we filter it out
        // (this was approved by Mr. Zimmermann)
        let steppedOffPad: boolean = this.isPadPressed &&
            this.nno <= releaseThreshold &&
            this.ono <= releaseThreshold &&
            this.sso <= releaseThreshold &&
            this.ssw <= releaseThreshold &&
            this.wsw <= releaseThreshold &&
            this.wnw <= releaseThreshold &&
            this.nnw <= releaseThreshold;

        if (this.x !== 1 || this.y !== 4) {
            steppedOffPad = steppedOffPad && this.oso <= releaseThreshold;
        }

        // Check for step on or step off
        if (!this.isPadPressed && steppedOnPad) {
            this.stepOn(this.x, this.y, PadPart.NNO);
            this.isPadPressed = true;
        }
        else if (steppedOffPad) {
            this.stepOff(this.x, this.y, PadPart.NNO);
            this.isPadPressed = false;
        }
    }
}
