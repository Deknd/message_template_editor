import "@testing-library/jest-dom";
import {SkeletonStructure} from "../../entities/sceletonStructure";
import {deleteBlock} from "./deleteBlock";


describe("deleteBlock Test Suite", () => {
	let struct: SkeletonStructure;
	let indexDataMap: Map<string, string>;
	beforeEach(() => {
		struct = SkeletonStructure.startStructure();
		struct.addBlockToParent("0");
		// eslint-disable-next-line testing-library/no-node-access
		struct.children![1].addBlockToParent("2,1");
		indexDataMap = new Map()
			.set("0", "Element index '0'")
			.set("1", "Element index '1'")
			.set("2,0", "Element index 2,0")
			.set("2,1", "Element index 2,1")
			.set("2,2", "Element index 2,2")
			.set("2,3", "Element index 2,3")
			.set("2,4,0", "Element index 2,4,0")
			.set("2,4,1", "Element index 2,4,1")
			.set("2,4,2", "Element index 2,4,2");

	});
	it("should delete an element from the top level", function () {
		const [newIndexDataMap, newStruct, newPosition] = deleteBlock([2], indexDataMap, struct);

		expect(newStruct).not.toEqual(struct);
		// eslint-disable-next-line testing-library/no-node-access
		expect(newStruct.children!.length).toBe(1);
		// eslint-disable-next-line testing-library/no-node-access
		expect(newStruct.children![0].couldBeChildren).toBeFalsy();

		expect(newIndexDataMap).not.toEqual(indexDataMap);
		expect(newIndexDataMap.size).toBe(1);
		expect(newIndexDataMap.get("0")).toMatch(indexDataMap.get("0")! + indexDataMap.get("1")!);
		expect(newIndexDataMap.has("1")).toBeFalsy();

		// eslint-disable-next-line testing-library/no-node-access
		expect(newPosition.indexElement).toBe(newStruct.children![0].indexElement!.join(","));
		expect(newPosition.positionCursor).toBe(newIndexDataMap.get("0")!.length);
	});
	it("should delete an element from a sublevel",
		function () {
			const [newIndexDataMap, newStruct, newPosition] = deleteBlock([2, 4], indexDataMap, struct);

			expect(newIndexDataMap).not.toEqual(indexDataMap);
			expect(newIndexDataMap.get("2,1")!).toMatch(indexDataMap.get("2,1")! + indexDataMap.get("2,3")!);
			expect(newIndexDataMap.has("2,4,0") && newIndexDataMap.has("2,4,1") && newIndexDataMap.has("2,4,2"))
				.toBeFalsy();

			expect(newStruct).not.toEqual(struct);
			// eslint-disable-next-line testing-library/no-node-access
			expect(newStruct.children!.length).toBe(3);
			// eslint-disable-next-line testing-library/no-node-access
			const child = newStruct.children![1];
			expect(child.couldBeChildren).toBeTruthy();
			// eslint-disable-next-line testing-library/no-node-access
			expect(child.children!.length).toBe(3);
			// eslint-disable-next-line testing-library/no-node-access
			expect(child.children![0].couldBeChildren && child.children![1].couldBeChildren && child.children![2].couldBeChildren)
				.toBeFalsy();

			expect(newPosition.indexElement).toBe("2,1");
			expect(newPosition.positionCursor).toBe(newIndexDataMap.get(newPosition.indexElement)!.length);
		});
	it("should throw an error when called with an invalid structure", () => {
		const structure = new SkeletonStructure(false);

		let error;
		try {
			deleteBlock([2], indexDataMap, structure);
		} catch (err) {
			error = err;
		}
		expect(error).toBeInstanceOf(Error);

		let error2;
		const structure2 = new SkeletonStructure(true);
		try {
			deleteBlock([2], indexDataMap, structure2);
		} catch (err) {
			error2 = err;
		}
		expect(error2).toBeInstanceOf(Error);

		let error3;
		const structure3 = new SkeletonStructure(true, null, new Array<SkeletonStructure>());
		try {
			deleteBlock([2], indexDataMap, structure3);
		} catch (err) {
			error3 = err;
		}
		expect(error3).toBeInstanceOf(Error);

		let error33;
		const structure33 = new SkeletonStructure(true, [525], new Array<SkeletonStructure>());
		try {
			deleteBlock([2], indexDataMap, structure33);
		} catch (err) {
			error33 = err;
		}
		expect(error33).toBeInstanceOf(Error);

		let error4;
		const structure4 = new SkeletonStructure(true, null, new Array<SkeletonStructure>(), "if");
		structure4.addBlockToParent("5");
		try {
			deleteBlock([2], indexDataMap, structure4);
		} catch (err) {
			error4 = err;
		}
		expect(error4).toBeInstanceOf(Error);

		let error5;
		const structure5 = new SkeletonStructure(true, [2], new Array<SkeletonStructure>(),);
		try {
			deleteBlock([2], indexDataMap, structure5);
		} catch (err) {
			error5 = err;
		}
		expect(error5).toBeInstanceOf(Error);
	});
	it("should throw an error when trying to delete an element with a non-existing index", function () {
		const indexElement = [9, 4];
		let error;
		try {
			deleteBlock(indexElement, indexDataMap, struct);
		} catch (e) {
			error = e;
		}
		expect(error).toBeInstanceOf(Error);

		const indexElement2 = [2, 23];
		let error2;
		try {
			deleteBlock(indexElement2, indexDataMap, struct);
		} catch (e) {
			error2 = e;
		}
		expect(error2).toBeInstanceOf(Error);

		const indexElement3 = [2, 3];
		let error3;
		try {
			deleteBlock(indexElement3, indexDataMap, struct);
		} catch (e) {
			error3 = e;
		}
		expect(error3).toBeInstanceOf(Error);

	});
});

