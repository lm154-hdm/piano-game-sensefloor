import { PadPart } from "./pad-part";
import type { StepEvent } from "./sens-floor";

const pressThreshold: number = 140;
const releaseThreshold: number = 136;

export default class PadState {
    private nne: number = 0;
    private ene: number = 0;
    private ese: number = 0;
    private sse: number = 0;
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

    update(nne: number, ene: number, ese: number, sse: number, ssw: number, wsw: number, wnw: number, nnw: number): void {
        let hasSteppedOnPad: boolean = false;
        let steppedPad: PadPart = PadPart.NNE;

        // nno
        if (this.nne < releaseThreshold && nne > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.NNE;
            this.nne = nne;
        } else if (this.nne > pressThreshold && nne < releaseThreshold) {
            this.nne = nne;
        }

        // ono
        if (this.ene < releaseThreshold && ene > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.ENE;
            this.ene = ene;
        } else if (this.ene > pressThreshold && ene < releaseThreshold) {
            this.ene = ene;
        }

        // oso
        if (this.ese < releaseThreshold && ese > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.ESE;
            this.ese = ese;
        } else if (this.ese > pressThreshold && ese < releaseThreshold) {
            this.ese = ese;
        }

        // sso
        if (this.sse < releaseThreshold && sse > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.SSE;
            this.sse = sse;
        } else if (this.sse > pressThreshold && sse < releaseThreshold) {
            this.sse = sse;
        }

        // ssw
        if (this.ssw < releaseThreshold && ssw > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.SSW;
            this.ssw = ssw;
        } else if (this.ssw > pressThreshold && ssw < releaseThreshold) {
            this.ssw = ssw;
        }

        // wsw
        if (this.wsw < releaseThreshold && wsw > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.WSW;
            this.wsw = wsw;
        } else if (this.wsw > pressThreshold && wsw < releaseThreshold) {
            this.wsw = wsw;
        }

        // wnw
        if (this.wnw < releaseThreshold && wnw > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.WNW;
            this.wnw = wnw;
        } else if (this.wnw > pressThreshold && wnw < releaseThreshold) {
            this.wnw = wnw;
        }

        // nnw
        if (this.nnw < releaseThreshold && nnw > pressThreshold) {
            hasSteppedOnPad = true;
            steppedPad = PadPart.NNW;
            this.nnw = nnw;
        } else if (this.nnw > pressThreshold && nnw < releaseThreshold) {
            this.nnw = nnw;
        }

        // The ese part of the pad at (4|1) is broken, so we filter it out
        // (this was approved by Mr. Zimmermann)
        let hasSteppedOffPad: boolean = this.isPadPressed &&
            this.nne <= releaseThreshold &&
            this.ene <= releaseThreshold &&
            this.sse <= releaseThreshold &&
            this.ssw <= releaseThreshold &&
            this.wsw <= releaseThreshold &&
            this.wnw <= releaseThreshold &&
            this.nnw <= releaseThreshold;

        if (this.x !== 1 || this.y !== 4) {
            hasSteppedOffPad = hasSteppedOffPad && this.ese < releaseThreshold;
        }

        // Check for step on or step off
        if (!this.isPadPressed && hasSteppedOnPad) {
            this.stepOn(this.x, this.y, steppedPad);
            this.isPadPressed = true;
        }
        else if (hasSteppedOffPad) {
            this.stepOff(this.x, this.y, steppedPad);
            this.isPadPressed = false;
        }
    }
}
