import { PadPart } from "./pad-part";
import type { StepCallback } from "./sens-floor";

export default class PadState {
    #wnw: number = 0;
    #nnw: number = 0;
    #nno: number = 0;
    #ono: number = 0;
    #oso: number = 0;
    #sso: number = 0;
    #ssw: number = 0;
    #wsw: number = 0;

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

    update(wnw: number, nnw: number, nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number) {
        // wnw
        if (this.#wnw === 0 && wnw > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.WNW);
        } else if (this.#wnw > 0 && wnw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.WNW);
        }
        this.#wnw = wnw;

        // nnw
        if (this.#nnw === 0 && nnw > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.NNW);
        } else if (this.#nnw > 0 && nnw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.NNW);
        }
        this.#nnw = nnw;

        // nno
        if (this.#nno === 0 && nno > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.NNO);
        } else if (this.#nno > 0 && nno === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.NNO);
        }
        this.#nno = nno;

        // ono
        if (this.#ono === 0 && ono > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.ONO);
        } else if (this.#ono > 0 && ono === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.ONO);
        }
        this.#ono = ono;

        // oso
        if (this.#oso === 0 && oso > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.OSO);
        } else if (this.#oso > 0 && oso === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.OSO);
        }
        this.#oso = oso;

        // sso
        if (this.#sso === 0 && sso > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.SSO);
        } else if (this.#sso > 0 && sso === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.SSO);
        }
        this.#sso = sso;

        // ssw
        if (this.#ssw === 0 && ssw > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.SSW);
        } else if (this.#ssw > 0 && ssw === 0) {
            this.#stepOff(this.#x, this.#y, PadPart.SSW);
        }
        this.#ssw = ssw;

        // wsw
        if (this.#wsw === 0 && wsw > 0) {
            this.#stepOn(this.#x, this.#y, PadPart.WSW);
        } else if (this.#wsw > 0 && wsw === 0) {
            this.#stepOn(this.#x, this.#y, PadPart.WSW);
        }
        this.#wsw = wsw;
    }
}
