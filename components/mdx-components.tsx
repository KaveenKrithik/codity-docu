import { CodeBlock } from './code-block'

export const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-bold mb-6 mt-8 scroll-mt-20"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-semibold mb-4 mt-8 pb-2 border-b border-border scroll-mt-20"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-semibold mb-3 mt-6 scroll-mt-20"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 scroll-mt-20" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-7 text-foreground/90" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
  ),
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary hover:underline underline-offset-4"
      {...props}
    />
  ),
  code: (props: any) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {props.children}
      </code>
    )
  },
  pre: (props: any) => <>{props.children}</>,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
}

