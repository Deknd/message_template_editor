import {getTextForElement, useElementDataMap} from "./dataTemplate";
import {act, renderHook } from "@testing-library/react";

describe("useElementDataMap", () => {
	it("should initialize useElementDataMap correctly", () => {
		const {result} = renderHook(() => useElementDataMap());
		const [indexDataMap, updateElementText, setElementDataMap] = result.current;
		expect(typeof indexDataMap.get).toBe("function");
		expect(typeof indexDataMap.set).toBe("function");
		expect(typeof indexDataMap.size).toBe("number");
		expect(typeof updateElementText).toBe("function");
		expect(updateElementText.length).toBe(2);
		expect(typeof setElementDataMap).toBe("function");
	});

	it("should correctly initialize data", () => {
		const index = "element1";
		const data = "data element";
		const {result} = renderHook(() => useElementDataMap(new Map().set(index, data)));
		expect(result.current[0].has(index)).toBe(true);
		expect(result.current[0].get(index)).toEqual(data);
		const text = getTextForElement(index, result.current[0]);
		expect(text).toEqual(data);
	});

	it("should update data correctly", function () {
		const index = "element1";
		const index2 = "element2";
		const data = "data element";
		const data2 = "data element2";
 		const { result } = renderHook(() => useElementDataMap());
		act(() => {
			result.current[2](new Map().set(index, data));
		});
		act(()=>{
			result.current[1](index2,data2);
		})
		expect(result.current[0].has(index)).toBe(true);
		expect(result.current[0].has(index2)).toBe(true);
		expect(result.current[0].get(index)).toEqual(data);
		expect(result.current[0].get(index2)).toEqual(data2);
		const text1 = getTextForElement(index, result.current[0]);
		const text2 = getTextForElement(index2, result.current[0]);
		expect(text1).toEqual(data);
		expect(text2).toEqual(data2);
		act(()=>{
			result.current[1](index2,data);
		})
		expect(result.current[0].get(index2)).toEqual(data);
		const text = getTextForElement(index2, result.current[0]);
		expect(text).toEqual(data);
	});

	it("should handle missing data", function () {
		const index = "element1";
		const data = "data element";
		const {result} = renderHook(() => useElementDataMap(new Map().set(index, data)));
		expect(result.current[0].has("test")).toBe(false);
		const noData = getTextForElement("test", result.current[0]);
		expect(noData).toEqual("");
	});

	it("should throw an error for invalid Map content", function () {
		const test = new Map().set("s",{s:1});
		expect(()=>{renderHook(() => useElementDataMap(test))}).toThrow(Error);
	});

	it("should throw an error when setting invalid Map content", function () {
		const test = new Map().set("s",{s:1});
		const { result } = renderHook(() => useElementDataMap());
		expect(()=>result.current[2](test)).toThrow(Error);
	});

	it("should handle multiple updates", () => {
		const { result } = renderHook(() => useElementDataMap());
		act(() => {
			result.current[1]("key1", "value1");
			});
		act(() => {
			result.current[1]("key2", "value2");
		});
		act(() => {
			result.current[1]("key1", "new-value1");
		});
		expect(result.current[0].get("key1")).toBe("new-value1");
		expect(result.current[0].get("key2")).toBe("value2");
	});

	it("should handle a large amount of data", () => {
		const { result } = renderHook(() => useElementDataMap());
		const largeData = new Map();
		for (let i = 0; i < 1000; i++) {
			largeData.set(`key${i}`, `value${i}`);
		}
		act(() => {
			result.current[2](largeData);
		});
		expect(result.current[0].size).toBe(1000);
	});
});
