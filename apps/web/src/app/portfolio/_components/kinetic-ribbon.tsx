type Props = {
  label: string;
  id: string;
};

const COUNT = 10;

function token(props: Props): string {
  return `${props.label} / Variant ${props.id} / Engineered Interface /`;
}

function list(props: Props): string[] {
  return Array.from({ length: COUNT }, () => token(props));
}

export function KineticRibbon(props: Props) {
  return (
    <section aria-hidden className="portfolio-ribbon">
      <div className="portfolio-ribbon-track">
        {list(props).map((item, index) => (
          <p
            key={`${item}-${index}`}
            className="portfolio-tech text-[10px] tracking-[0.28em] uppercase"
          >
            {item}
          </p>
        ))}
      </div>
      <div className="portfolio-ribbon-track portfolio-ribbon-reverse">
        {list(props).map((item, index) => (
          <p
            key={`${item}-alt-${index}`}
            className="portfolio-tech text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase"
          >
            sequence / 15 scenes / 4 demos /
          </p>
        ))}
      </div>
    </section>
  );
}
