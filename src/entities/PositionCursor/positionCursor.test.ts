import {act, renderHook} from "@testing-library/react";
import {usePositionCursor} from "./usePositionCursor";

describe("usePositionCursor", () => {
	it("returns initial cursor state", () => {
		const {result} = renderHook(() => usePositionCursor());

		const [indexElement, getPosition, setPosition, deletePosition] = result.current;

		expect(indexElement).toBe("0");
		expect(getPosition("0")).toBe(0);
		expect(setPosition).toBeInstanceOf(Function);
		expect(deletePosition).toBeInstanceOf(Function);
	});

	it("sets and gets cursor position", () => {
		const indexElement = "element1";
		const positionForIndexElement = 5;
		const {result} = renderHook(() => usePositionCursor());

		act(() => {
			result.current[2](indexElement, positionForIndexElement);
		});
		const resultPosition = result.current[1](indexElement);
		expect(resultPosition).toBe(positionForIndexElement);
	});

	it("deletes cursor position for a specific element", () => {
		const {result} = renderHook(() => usePositionCursor());
		act(() => {
			result.current[2]([0].join(","), 5);
		});
		act(() => {
			result.current[2]([2].join(","), 6);
		});
		act(() => {
			result.current[2]([1, 0].join(","), 10);
		});
		act(() => {
			result.current[2]([1, 1].join(","), 15);
		});
		act(() => {
			result.current[2]([1, 2].join(","), 52);
		});
		const focusElement = result.current[0];
		const positionCursor = result.current[1](focusElement);
		expect(focusElement).toEqual([1, 2].join(","));
		expect(positionCursor).toEqual(52);

		act(() => {
			result.current[3]([1], [2].join(","), 3);
		});
		const focusElementResult = result.current[0];
		const positionCursorResult = result.current[1](focusElementResult);

		expect(focusElementResult).toEqual([2].join(","));
		expect(positionCursorResult).toEqual(3);

		const positionCursorDelete10 = result.current[1]([1, 0].join(","));
		const positionCursorDelete11 = result.current[1]([1, 1].join(","));
		const positionCursorDelete12 = result.current[1]([1, 2].join(","));
		expect(positionCursorDelete10).toEqual(0);
		expect(positionCursorDelete11).toEqual(0);
		expect(positionCursorDelete12).toEqual(0);
		act(() => {
			result.current[3]([], "test id", 3);
		});
		const positionCursorDelete0 = result.current[1]([0].join(","));
		const positionCursorDelete2 = result.current[1]([2].join(","));
		expect(positionCursorDelete0).toEqual(0);
		expect(positionCursorDelete2).toEqual(0);
	});
	it("returns the default cursor position for a non-existing element", () => {
		const indexElement = "element1";
		const {result} = renderHook(() => usePositionCursor());

		const resultPosition = result.current[1](indexElement);
		expect(resultPosition).toBe(0);
	});
	it("updates the cursor position when using setPosition", () => {
		const indexElement = "element1";
		const newPosition = 10;
		const {result} = renderHook(() => usePositionCursor());

		act(() => {
			result.current[2](indexElement, newPosition);
		});

		const resultPosition = result.current[1](indexElement);
		expect(resultPosition).toBe(newPosition);
	});
	it("deletes the cursor position for an element and sets a new position", () => {
		const {result} = renderHook(() => usePositionCursor());

		act(() => {
			result.current[2]([1, 0].join(","), 5);
		});

		act(() => {
			result.current[3]([1], [1, 1].join(","), 10);
		});

		const positionCursorDeleted = result.current[1]([1, 0].join(","));
		const positionCursorNew = result.current[1]([1, 1].join(","));
		expect(positionCursorDeleted).toBe(0);
		expect(positionCursorNew).toBe(10);
	});

});
