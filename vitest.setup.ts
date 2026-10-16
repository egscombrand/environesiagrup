import '@testing-library/jest-dom/vitest';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// jsdom has no native IntersectionObserver; assign the mock directly.
global.IntersectionObserver = MockIntersectionObserver;

// jsdom doesn't implement <dialog>'s showModal()/close() (used by
// ConfirmDialog) — polyfill just enough of the native behavior for tests
// that open a dialog: toggle the `open` attribute and fire the spec's
// 'close' event.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom doesn't implement Element.scrollIntoView() — used by
// useRequiredFieldsValidation's "jump to this field" action.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// jsdom doesn't implement Range's layout geometry (getBoundingClientRect /
// getClientRects) — ProseMirror (the rich text editor, rich-text-editor.tsx)
// calls these on the current selection's Range on every keystroke to
// position the cursor. Without a stub, typing into it throws.
const EMPTY_RECT: DOMRect = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => EMPTY_RECT;
}
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () =>
    ({ length: 0, item: () => null, [Symbol.iterator]: () => [][Symbol.iterator]() }) as unknown as DOMRectList;
}
// Same reason: ProseMirror's mousedown handler looks up the clicked element
// by coordinates, which jsdom never implements.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
