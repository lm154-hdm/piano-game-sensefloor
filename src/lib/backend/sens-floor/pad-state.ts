import { PadPart } from "./pad-part";
import type { StepCallback } from "./sens-floor";

const THRESHOLD: number = 5;

export default class PadState {
    #nno: number = 0;
    #ono: number = 0;
    #oso: number = 0;
    #sso: number = 0;
    #ssw: number = 0;
    #wsw: number = 0;
    #wnw: number = 0;
    #nnw: number = 0;

    readonly #x: number;
    readonly #y: number;
    readonly #stepOn: StepCallback;
    readonly #stepOff: StepCallback;

    constructor(x: number, y: number, stepOn: StepCallback, stepOff: StepCallback) {
        this.#x = x;
        this.#y = y;
        this.#stepOn = stepOn;
        this.#stepOff = stepOff;
    }

    update(nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number, wnw: number, nnw: number) {
        // nno
        if (this.#nno === 0 && nno > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.NNO);
            this.#nno = nno;
        } else if (this.#nno > THRESHOLD && nno === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.NNO);
            this.#nno = nno;
        }

        // ono
        if (this.#ono === 0 && ono > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.ONO);
            this.#ono = ono;
        } else if (this.#ono > THRESHOLD && ono === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.ONO);
            this.#ono = ono;
        }

        // oso
        if (this.#oso === 0 && oso > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.OSO);
            this.#oso = oso;
        } else if (this.#oso > THRESHOLD && oso === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.OSO);
            this.#oso = oso;
        }

        // sso
        if (this.#sso === 0 && sso > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.SSO);
            this.#sso = sso;
        } else if (this.#sso > THRESHOLD && sso === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.SSO);
            this.#sso = sso;
        }

        // ssw
        if (this.#ssw === 0 && ssw > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.SSW);
            this.#ssw = ssw;
        } else if (this.#ssw > THRESHOLD && ssw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.SSW);
            this.#ssw = ssw;
        }

        // wsw
        if (this.#wsw === 0 && wsw > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.WSW);
            this.#wsw = wsw;
        } else if (this.#wsw > THRESHOLD && wsw === 0) {
            this.#stepOn(this.#x, this.#y, PadPart.WSW);
            this.#wsw = wsw;
        }

        // wnw
        if (this.#wnw === 0 && wnw > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.WNW);
            this.#wnw = wnw;
        } else if (this.#wnw > THRESHOLD && wnw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.WNW);
            this.#wnw = wnw;
        }

        // nnw
        if (this.#nnw === 0 && nnw > THRESHOLD) {
            this.#stepOn(this.#x, this.#y, PadPart.NNW);
            this.#nnw = nnw;
        } else if (this.#nnw > THRESHOLD && nnw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.NNW);
            this.#nnw = nnw;
        }
    }
}
