import { Container, Label, Section, Text } from "@v7/ui";

export function PageIntro({ label, statement }: { label: string; statement: string }) {
  return (
    <Section className="pt-12 sm:pt-16">
      <Container className="mx-auto">
        <Label as="h1">{label}</Label>
        <Text as="p" variant="heading" className="mt-4 text-primary">
          {statement}
        </Text>
      </Container>
    </Section>
  );
}
