import type { Resume } from "@workspace/data";

/** CV extends base resume – notes omitted since CV doesn't render it */
export interface CVResume extends Omit<Resume, "notes"> {}
