import { BlogShell } from "~/components/blog/blog-shell";

export default function Page() {
  return (
    <BlogShell
      title={
        <>
          GPT-5.3 Codex vs. Opus 4.6:
          <br className="hidden md:block" />
          The Great Convergence
        </>
      }
      subtitle="We tested both models on real production work. Here is the head-to-head view."
      author="Dan Shipper"
      date="February 5, 2026"
    >
      <p>
        Today, OpenAI and Anthropic both shipped materially better coding models. After extensive
        internal testing across product and engineering work, one pattern kept repeating: the gap is
        shrinking.
      </p>

      <blockquote>The models are converging.</blockquote>

      <p>
        Opus keeps its creative ceiling and broad exploration style, while adding a more methodical
        execution path. Codex keeps its reliability and speed, while becoming notably warmer and
        more willing to take initiative in underspecified tasks.
      </p>

      <p>
        The practical result is simple: both models are moving toward the same target profile—highly
        technical, fast, autonomous, and still pleasant to collaborate with.
      </p>

      <h2>The verdict</h2>

      <p>
        There is no universal winner. Pick by task shape: open-ended and exploratory work still
        favors Opus; deterministic delivery and long autonomous runs often favor Codex.
      </p>

      <div className="my-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[10px] border border-[#cc785c]/30 bg-[#202020] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[#cc785c]" />
            <h3 className="m-0 text-[22px] text-white">Opus 4.6</h3>
          </div>
          <p className="mb-3 text-[15px] text-white/85">
            Better when you need upside on hard, open-ended tasks with room for creativity.
          </p>
          <p className="m-0 text-[15px] text-white/65">
            Higher ceiling, higher variance. Strong at parallel exploration and unconventional
            paths.
          </p>
        </div>

        <div className="rounded-[10px] border border-[#10a37f]/30 bg-[#202020] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[#10a37f]" />
            <h3 className="m-0 text-[22px] text-white">Codex 5.3</h3>
          </div>
          <p className="mb-3 text-[15px] text-white/85">
            Better when you want steady, reliable autonomous execution over long coding sessions.
          </p>
          <p className="m-0 text-[15px] text-white/65">
            Lower variance, faster cycle time, and fewer unrequested edits in production workflows.
          </p>
        </div>
      </div>

      <h2>How we use them</h2>

      <ul>
        <li>Planning and discovery: Opus-first for broad search and strategy.</li>
        <li>Execution and hardening: Codex-first for stable implementation.</li>
        <li>Review loops: whichever model did not write the code reviews it.</li>
      </ul>

      <h2>Why this matters</h2>

      <p>
        The same behaviors that make a model effective for software work—tool use, decomposition,
        parallelism, and good judgment—also make it effective for general knowledge work. This is
        why coding quality is becoming a proxy for broader agent usefulness.
      </p>
    </BlogShell>
  );
}
