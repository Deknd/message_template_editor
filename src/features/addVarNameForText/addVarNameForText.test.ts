import "@testing-library/jest-dom";
import {addVarNameToTextWithPosition} from "./addVarNameForText";

describe("addVarNameToTextWithPosition test", () => {
	it("Test for Insertion into an Existing Element", () => {
		const varName = "{varName}";
		const indexDataMap = new Map<string, string>().set("0", "test data");
		const indexFocusElement = "0";
		const positionCursor1 = 0;
		const positionCursor2 = 4;
		const positionCursor3 = 9;

		const result1 = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor1);
		const result2 = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor2);
		const result3 = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor3);

		expect(result1.updateData).not.toEqual(indexDataMap);
		expect(result1.updateData.get(indexFocusElement)).toBe("{varName}test data");
		expect(result1.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result1.newPositionCursor.positionCursor).toBe(positionCursor1 + varName.length);

		expect(result2.updateData).not.toEqual(indexDataMap);
		expect(result2.updateData.get(indexFocusElement)).toBe("test{varName} data");
		expect(result2.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result2.newPositionCursor.positionCursor).toBe(positionCursor2 + varName.length);

		expect(result3.updateData).not.toEqual(indexDataMap);
		expect(result3.updateData.get(indexFocusElement)).toBe("test data{varName}");
		expect(result3.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result3.newPositionCursor.positionCursor).toBe(positionCursor3 + varName.length);
	});
	it("Test for Insertion into a New Element", () => {
		const varName = "{varName}";
		const indexDataMap = new Map<string, string>();
		const indexFocusElement = "0";
		const positionCursor1 = 0;

		const result = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor1);

		expect(result.updateData).not.toEqual(indexDataMap);
		expect(result.updateData.get(indexFocusElement)).toBe("{varName}");
		expect(result.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result.newPositionCursor.positionCursor).toBe(positionCursor1 + varName.length);

	});
	it("Test for Cursor Position Beyond Text Bounds", function () {
		const varName = "{varName}";
		const indexDataMap = new Map<string, string>().set("0","test data");
		const indexFocusElement = "0";
		const positionCursor1 = -10;
		const positionCursor2 = 20;

		const result1 = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor1);
		const result2 = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor2);
		
		expect(result1.updateData).not.toEqual(indexDataMap);
		expect(result1.updateData.get(indexFocusElement)).toBe('{varName}test data');
		expect(result1.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result1.newPositionCursor.positionCursor).toBe(varName.length);

		expect(result2.updateData).not.toEqual(indexDataMap);
		expect(result2.updateData.get(indexFocusElement)).toBe('test data{varName}');
		expect(result2.newPositionCursor.indexElement).toBe(indexFocusElement);
		expect(result2.newPositionCursor.positionCursor).toBe(result2.updateData.get(indexFocusElement)!.length);
	});

	it("Test for Zero-Length varName", function () {
		const varName = "";
		const indexDataMap = new Map<string, string>().set("0","test data");
		const indexFocusElement = "0";
		const positionCursor = 4;

		const result = addVarNameToTextWithPosition(varName, indexDataMap, indexFocusElement, positionCursor);

		expect(result.updateData).toEqual(indexDataMap);
		expect(result.newPositionCursor.indexElement).toEqual(indexFocusElement);
		expect(result.newPositionCursor.positionCursor).toEqual(positionCursor);
	});
});