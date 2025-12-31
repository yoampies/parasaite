import '@testing-library/jest-dom';
import { vi } from 'vitest';

class WorkerMock {
  url: string;
  onmessage: (msg: unknown) => void;
  postMessage: (msg: unknown) => void;
  terminate: () => void;

  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = () => {};
    this.postMessage = () => {};
    this.terminate = () => {};
  }
}

(globalThis as any).Worker = WorkerMock;

globalThis.URL.createObjectURL = vi.fn();
