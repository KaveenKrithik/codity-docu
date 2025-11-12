import { CodeBlock } from './code-block'

export const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="text-5xl font-bold mb-10 mt-0 tracking-tight scroll-mt-20 relative"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.9) 50%, hsl(var(--primary)) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      {...props}
    >
      {props.children}
      <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-primary to-primary/0 rounded-full" />
    </h1>
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-semibold mb-8 mt-16 tracking-tight first:mt-0 scroll-mt-20 text-foreground pb-3 border-b-2 border-border/30 relative"
      {...props}
    >
      <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-primary rounded-full" />
      {props.children}
    </h2>
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-semibold mb-5 mt-10 tracking-tight scroll-mt-20 text-foreground relative pl-4"
      {...props}
    >
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
      {props.children}
    </h3>
  ),
  h4: (props: any) => (
    <h4 className="text-lg font-semibold mb-3 mt-6 tracking-tight scroll-mt-20 text-foreground" {...props} />
  ),
  p: (props: any) => {
    const text = typeof props.children === 'string' ? props.children : ''
    if (text.startsWith('Figure') || text.startsWith('**Figure')) {
      return (
        <p className="mt-4 mb-2 text-sm text-muted-foreground font-normal">
          <span className="text-primary">📷</span> {props.children}
        </p>
      )
    }
    return <p className="mb-6 leading-7 text-foreground/90" {...props} />
  },
  img: (props: any) => {
    if (props.src === 'placeholder' || props.alt?.includes('placeholder')) {
      return (
        <div className="my-10 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-secondary/50 via-secondary/30 to-transparent p-20 flex items-center justify-center backdrop-blur-sm shadow-inner">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-40">🖼️</div>
            <p className="text-sm font-semibold text-muted-foreground">Image Placeholder</p>
            <p className="text-xs text-muted-foreground/50 mt-1.5">Screenshot will be added here</p>
          </div>
        </div>
      )
    }
    return (
      <img
        className="my-8 rounded-xl border border-border/50 shadow-xl w-full transition-all hover:shadow-2xl hover:scale-[1.01]"
        {...props}
      />
    )
  },
  ul: (props: any) => (
    <ul className="mb-6 ml-6 list-disc space-y-3 [&>li]:marker:text-primary" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-6 ml-6 list-decimal space-y-3 [&>li]:marker:text-primary [&>li]:marker:font-semibold" {...props} />
  ),
  li: (props: any) => <li className="leading-7 text-foreground/90" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-all font-medium hover:text-primary/90"
      {...props}
    />
  ),
  code: (props: any) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return (
      <code className="bg-secondary/80 px-2.5 py-1 rounded-lg text-sm font-mono text-foreground border border-border/40 shadow-sm">
        {props.children}
      </code>
    )
  },
  pre: (props: any) => <>{props.children}</>,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary/60 pl-8 italic my-10 text-foreground/85 bg-gradient-to-r from-primary/5 via-secondary/20 to-transparent py-5 pr-6 rounded-r-xl relative shadow-sm"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="my-10 overflow-x-auto rounded-xl border border-border/50 shadow-lg">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-4 py-3 bg-gradient-to-b from-secondary to-secondary/80 font-semibold text-left text-foreground border-b-2 border-border" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-3 text-foreground/90" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-10 border-border/50 relative" {...props} />
  ),
  strong: (props: any) => {
    const text = typeof props.children === 'string' ? props.children : ''
    if (text.startsWith('Figure')) {
      return (
        <strong className="block mt-4 mb-2 text-sm text-muted-foreground font-normal">
          <span className="text-primary">📷</span> {props.children}
        </strong>
      )
    }
    return <strong className="font-semibold text-foreground" {...props} />
  },
  em: (props: any) => (
    <em className="italic text-foreground/90" {...props} />
  ),
}

