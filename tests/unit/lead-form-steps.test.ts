import { describe, expect, it } from "vitest";
import {
  fieldControlId,
  firstErrorField,
  stepForField,
  stepForFieldErrors,
} from "@/lib/forms/lead-form-steps";

describe("lead-form-steps helpers", () => {
  it("maps contact fields to step 1 and context fields to step 2", () => {
    expect(stepForField("segment")).toBe(1);
    expect(stepForField("name")).toBe(1);
    expect(stepForField("privacy_consent")).toBe(2);
    expect(stepForField("team_size")).toBe(2);
  });

  it("picks the earliest step that contains an error", () => {
    expect(stepForFieldErrors({ privacy_consent: "x" })).toBe(2);
    expect(stepForFieldErrors({ segment: "x", privacy_consent: "y" })).toBe(1);
    expect(stepForFieldErrors({ team_size: "x", name: "y" })).toBe(1);
  });

  it("returns the first error field in schema order", () => {
    expect(firstErrorField({ privacy_consent: "a", segment: "b" })).toBe("segment");
    expect(firstErrorField({ price_range: "a", team_size: "b" })).toBe("team_size");
  });

  it("builds stable field control ids", () => {
    expect(fieldControlId("segment")).toBe("lead-field-segment");
  });
});
