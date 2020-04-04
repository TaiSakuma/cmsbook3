import { mutations } from "@/store/index.js";

const { set_title } = mutations;

describe("mutation", () => {
  it("set title", () => {
    const state = { title: "abc def" };
    set_title(state, 'xyz uvw')
    expect(state.title).toBe('xyz uvw')
  });
});
