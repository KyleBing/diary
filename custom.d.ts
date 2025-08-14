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
}
