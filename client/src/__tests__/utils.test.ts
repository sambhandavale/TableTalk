import { formatDate, truncateText } from "@/lib/utils";

describe("Utils", () => {
  describe("formatDate", () => {
    it("formats a valid ISO date string correctly", () => {
      expect(formatDate("2024-03-15T10:00:00Z")).toBe("Mar 15, 2024");
    });

    it("returns empty string for missing date", () => {
      expect(formatDate("")).toBe("");
    });

    it("returns original string for invalid date", () => {
      expect(formatDate("invalid-date")).toBe("invalid-date");
    });
  });

  describe("truncateText", () => {
    it("truncates long text and appends ellipsis", () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
    });

    it("returns original text if shorter than max length", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });

    it("returns empty string for empty input", () => {
      expect(truncateText("", 10)).toBe("");
    });
  });
});
