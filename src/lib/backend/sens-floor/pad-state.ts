import { PadPart } from "./pad-part";
import type { StepEvent } from "./sens-floor";

const threshold: number = 5;

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
    private readonly useAsPad: boolean;

    constructor(x: number, y: number, stepOn: StepEvent, stepOff: StepEvent, useAsPad: boolean) {
        this.x = x;
        this.y = y;
        this.stepOn = stepOn;
        this.stepOff = stepOff;
        this.useAsPad = useAsPad;
    }

    update(nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number, wnw: number, nnw: number): void {
        if (this.useAsPad) {
            this.updateAsPad(nno, ono, oso, sso, ssw, wsw, wnw, nnw);
        }
        else {
            this.updateAsParts(nno, ono, oso, sso, ssw, wsw, wnw, nnw);
        }
    }

    private updateAsPad(nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number, wnw: number, nnw: number): void {
        let steppedOnPad: boolean = false;

        // nno
        if (this.nno === 0 && nno > threshold) {
            steppedOnPad = true;
            this.nno = nno;
        } else if (this.nno > threshold && nno === 0) {
            this.nno = nno;
        }

        // ono
        if (this.ono === 0 && ono > threshold) {
            steppedOnPad = true;
            this.ono = ono;
        } else if (this.ono > threshold && ono === 0) {
            this.ono = ono;
        }

        // oso
        if (this.oso === 0 && oso > threshold) {
            steppedOnPad = true;
            this.oso = oso;
        } else if (this.oso > threshold && oso === 0) {
            this.oso = oso;
        }

        // sso
        if (this.sso === 0 && sso > threshold) {
            steppedOnPad = true;
            this.sso = sso;
        } else if (this.sso > threshold && sso === 0) {
            this.sso = sso;
        }

        // ssw
        if (this.ssw === 0 && ssw > threshold) {
            steppedOnPad = true;
            this.ssw = ssw;
        } else if (this.ssw > threshold && ssw === 0) {
            this.ssw = ssw;
        }

        // wsw
        if (this.wsw === 0 && wsw > threshold) {
            steppedOnPad = true;
            this.wsw = wsw;
        } else if (this.wsw > threshold && wsw === 0) {
            this.wsw = wsw;
        }

        // wnw
        if (this.wnw === 0 && wnw > threshold) {
            steppedOnPad = true;
            this.wnw = wnw;
        } else if (this.wnw > threshold && wnw === 0) {
            this.wnw = wnw;
        }

        // nnw
        if (this.nnw === 0 && nnw > threshold) {
            steppedOnPad = true;
            this.nnw = nnw;
        } else if (this.nnw > threshold && nnw === 0) {
            this.nnw = nnw;
        }

        // Check for step on or step off
        if (!this.isPadPressed && steppedOnPad) {
            this.stepOn(this.x, this.y, PadPart.NNO);
            this.isPadPressed = true;
        }
        else if (
            this.isPadPressed &&
            this.nno === 0 &&
            this.ono === 0 &&
            this.oso === 0 &&
            this.sso === 0 &&
            this.ssw === 0 &&
            this.wsw === 0 &&
            this.wnw === 0 &&
            this.nnw === 0
        ) {
            this.stepOff(this.x, this.y, PadPart.NNO);
            this.isPadPressed = false;
        }
    }

    private updateAsParts(nno: number, ono: number, oso: number, sso: number, ssw: number, wsw: number, wnw: number, nnw: number): void {
        // nno
        if (this.nno === 0 && nno > threshold) {
            this.stepOn(this.x, this.y, PadPart.NNO);
            this.nno = nno;
        } else if (this.nno > threshold && nno === 0) {
            this.stepOff(this.x, this.y, PadPart.NNO);
            this.nno = nno;
        }

        // ono
        if (this.ono === 0 && ono > threshold) {
            this.stepOn(this.x, this.y, PadPart.ONO);
            this.ono = ono;
        } else if (this.ono > threshold && ono === 0) {
            this.stepOff(this.x, this.y, PadPart.ONO);
            this.ono = ono;
        }

        // oso
        if (this.oso === 0 && oso > threshold) {
            this.stepOn(this.x, this.y, PadPart.OSO);
            this.oso = oso;
        } else if (this.oso > threshold && oso === 0) {
            this.stepOff(this.x, this.y, PadPart.OSO);
            this.oso = oso;
        }

        // sso
        if (this.sso === 0 && sso > threshold) {
            this.stepOn(this.x, this.y, PadPart.SSO);
            this.sso = sso;
        } else if (this.sso > threshold && sso === 0) {
            this.stepOff(this.x, this.y, PadPart.SSO);
            this.sso = sso;
        }

        // ssw
        if (this.ssw === 0 && ssw > threshold) {
            this.stepOn(this.x, this.y, PadPart.SSW);
            this.ssw = ssw;
        } else if (this.ssw > threshold && ssw === 0) {
            this.stepOff(this.x, this.y, PadPart.SSW);
            this.ssw = ssw;
        }

        // wsw
        if (this.wsw === 0 && wsw > threshold) {
            this.stepOn(this.x, this.y, PadPart.WSW);
            this.wsw = wsw;
        } else if (this.wsw > threshold && wsw === 0) {
            this.stepOn(this.x, this.y, PadPart.WSW);
            this.wsw = wsw;
        }

        // wnw
        if (this.wnw === 0 && wnw > threshold) {
            this.stepOn(this.x, this.y, PadPart.WNW);
            this.wnw = wnw;
        } else if (this.wnw > threshold && wnw === 0) {
            this.stepOff(this.x, this.y, PadPart.WNW);
            this.wnw = wnw;
        }

        // nnw
        if (this.nnw === 0 && nnw > threshold) {
            this.stepOn(this.x, this.y, PadPart.NNW);
            this.nnw = nnw;
        } else if (this.nnw > threshold && nnw === 0) {
            this.stepOff(this.x, this.y, PadPart.NNW);
            this.nnw = nnw;
        }
    }
}
