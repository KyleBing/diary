declare module "*.svg?url" {
    const content: any;
    export default content;
}

declare module "*.md" {
    const content: string;
    export default content;
}

declare module "marked" {
    export function parse(text: string): string;
    export function setOptions(options: Record<string, unknown>): void;
    export const marked: typeof parse;
}
