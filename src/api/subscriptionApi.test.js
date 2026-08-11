import { describe, expect, it } from "vitest";
import { unwrapApiData } from "./subscriptionApi";

describe("subscription API contract", () => {
  it("returns data from the common success envelope", () => {
    expect(unwrapApiData({ success: true, data: [{ subscriptionId: 1 }] })).toEqual([
      { subscriptionId: 1 },
    ]);
  });

  it("rejects an error envelope instead of accepting legacy shapes", () => {
    expect(() =>
      unwrapApiData({ success: false, error: { message: "구독을 찾을 수 없습니다." } })
    ).toThrow("구독을 찾을 수 없습니다.");
  });
});

