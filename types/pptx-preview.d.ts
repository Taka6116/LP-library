declare module "pptx-preview" {
  export interface PreviewerOptions {
    renderer?: string;
    width?: number;
    height?: number;
    mode?: "list" | "slide";
  }
  export interface PPTXPreviewer {
    readonly slideCount: number;
    preview(file: ArrayBuffer): Promise<unknown>;
    load(file: ArrayBuffer): Promise<unknown>;
    renderSingleSlide(slideIndex: number): void;
    destroy(): void;
  }
  export function init(dom: HTMLElement, options: PreviewerOptions): PPTXPreviewer;
}
