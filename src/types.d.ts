declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement> & { alt?: string }>
  export default content
}
