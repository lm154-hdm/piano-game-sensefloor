export default class PadState {
  readonly #x: number;
  readonly #y: number;
  #wnw: number = 0;
  #nnw: number = 0;
  #nno: number = 0;
  #ono: number = 0;
  #oso: number = 0;
  #sso: number = 0;
  #ssw: number = 0;
  #wsw: number = 0;

  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  update(
    wnw: number,
    nnw: number,
    nno: number,
    ono: number,
    oso: number,
    sso: number,
    ssw: number,
    wsw: number,
  ) {
    // wnw
    if (this.#wnw === 0 && wnw > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) wnw`);
    } else if (this.#wnw > 0 && wnw === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) wnw`);
    }
    this.#wnw = wnw;

    // nnw
    if (this.#nnw === 0 && nnw > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) nnw`);
    } else if (this.#nnw > 0 && nnw === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) nnw`);
    }
    this.#nnw = nnw;

    // nno
    if (this.#nno === 0 && nno > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) nno`);
    } else if (this.#nno > 0 && nno === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) nno`);
    }
    this.#nno = nno;

    // ono
    if (this.#ono === 0 && ono > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) ono`);
    } else if (this.#ono > 0 && ono === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) ono`);
    }
    this.#ono = ono;

    // oso
    if (this.#oso === 0 && oso > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) oso`);
    } else if (this.#oso > 0 && oso === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) oso`);
    }
    this.#oso = oso;

    // sso
    if (this.#sso === 0 && sso > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) sso`);
    } else if (this.#sso > 0 && sso === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) sso`);
    }
    this.#sso = sso;

    // ssw
    if (this.#ssw === 0 && ssw > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) ssw`);
    } else if (this.#ssw > 0 && ssw === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) ssw`);
    }
    this.#ssw = ssw;

    // wsw
    if (this.#wsw === 0 && wsw > 0) {
      console.log(`stepped on (${this.#x}|${this.#y}) wsw`);
    } else if (this.#wsw > 0 && wsw === 0) {
      console.log(`stepped off (${this.#x}|${this.#y}) wsw`);
    }
    this.#wsw = wsw;
  }
}
