import type React from "react"

function slugify(text: string): string {
	const str =
		typeof text === "string"
			? text
			: String(text ?? "")
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
}

function getTextContent(node: React.ReactNode): string {
	if (typeof node === "string") return node
	if (typeof node === "number") return String(node)
	if (!node) return ""
	if (Array.isArray(node)) return node.map(getTextContent).join("")
	if (typeof node === "object" && "props" in node) {
		const element = node as { props: { children?: React.ReactNode } }
		return getTextContent(element.props.children)
	}
	return ""
}

type Props = { children?: React.ReactNode; className?: string; href?: string; [key: string]: unknown }

export const components: Record<string, React.FC<Props>> = {
	h2: (props) => {
		const id = slugify(getTextContent(props.children))
		return (
			<h2
				id={id}
				className="flex items-center gap-3 font-sans text-base font-medium tracking-tight text-foreground mt-10 mb-4 first:mt-0"
			>
				{props.children}
				<span className="flex-1 h-px bg-border" />
			</h2>
		)
	},

	h3: (props) => (
		<h3 className="font-sans text-sm font-medium tracking-tight text-foreground mt-8 mb-3 first:mt-0">
			{props.children}
		</h3>
	),

	p: (props) => (
		<p className="text-sm leading-[1.65] tracking-[0.005em] text-foreground/80 [&+&]:mt-4">
			{props.children}
		</p>
	),

	a: (props) => (
		<a
			href={props.href}
			className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-foreground/50"
			{...props}
		>
			{props.children}
		</a>
	),

	strong: (props) => (
		<strong className="font-medium text-foreground">{props.children}</strong>
	),

	em: (props) => <em className="italic">{props.children}</em>,

	blockquote: (props) => (
		<blockquote className="border-l-2 border-border pl-4 text-sm leading-[1.65] text-foreground/60 italic my-4">
			{props.children}
		</blockquote>
	),

	ul: (props) => (
		<ul className="flex flex-col gap-1 pl-4 my-3 list-disc marker:text-foreground/25">
			{props.children}
		</ul>
	),

	ol: (props) => (
		<ol className="flex flex-col gap-1 pl-4 my-3 list-decimal marker:text-foreground/25">
			{props.children}
		</ol>
	),

	li: (props) => (
		<li className="text-sm leading-[1.65] tracking-[0.005em] text-foreground/80 pl-1">
			{props.children}
		</li>
	),

	code: (props) => {
		if (
			typeof props.className === "string" &&
			props.className.includes("language-")
		) {
			return <code {...props} />
		}
		return (
			<code className="font-mono text-xs bg-foreground/[0.04] px-1.5 py-0.5 rounded-md text-foreground/75">
				{props.children}
			</code>
		)
	},

	pre: (props) => (
		<pre className="font-mono text-xs leading-[1.55] bg-foreground/[0.03] border border-border rounded-lg p-4 overflow-x-auto my-4 whitespace-pre-wrap break-words">
			{props.children}
		</pre>
	),

	hr: () => <hr className="border-t border-border my-8" />,
}
