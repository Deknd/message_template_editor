import {addElement} from "./addIfThenElseBlock";
import {SkeletonStructure} from "../../entities/sceletonStructure";


describe("addIfThenElseBlock", () => {
	it("should correctly add an element and update data map and cursor position", () => {
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 5;
		const [struct, newMap, newPosition] = addElement(indexFocusElement, positionCursor, indexDataMap, structure);

		expect(structure === struct).toBe(false);
		// eslint-disable-next-line testing-library/no-node-access
		const children = struct.children;
		expect(children).not.toBeNull();
		expect(children?.length).toBe(3);
		expect(children![1].couldBeChildren).toBe(true);

		expect(newMap === indexDataMap).toBe(false);
		expect(newMap.size).toBe(2);
		const child1 = children![0].indexElement!;
		const child2 = children![2].indexElement!;
		expect(newMap.get(child1.join(","))).toBe("test ");
		expect(newMap.get(child2.join(","))).toBe("element");

		expect(indexFocusElement === newPosition.indexElement).toBe(false);
		// eslint-disable-next-line testing-library/no-node-access
		const newFocusElement = children![1].children![0];
		const indexNewFocusElement = newFocusElement.indexElement;
		expect(newPosition.indexElement).toBe(indexNewFocusElement?.join(","));
		expect(newPosition.positionCursor).toBe(0);
	});
	it("пробую вызвать с невалидной структурой", () => {
		const structure = new SkeletonStructure(false);
		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 5;

		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure)).toThrow(Error);

		const structure2 = new SkeletonStructure(true);
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure2)).toThrow(Error);

		const structure3 = new SkeletonStructure(true, null, new Array<SkeletonStructure>());
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure3)).toThrow(Error);

		const structure33 = new SkeletonStructure(true, [525], new Array<SkeletonStructure>());
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure33)).toThrow(Error);

		const structure4 = new SkeletonStructure(true, null, new Array<SkeletonStructure>(), "if");
		structure4.addBlockToParent("5");
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure4)).toThrow(Error);

		const structure5 = new SkeletonStructure(true, [2], new Array<SkeletonStructure>(),);
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure5)).toThrow(Error);

	});

	it(" когда indexFocusElement не является действительным индексом в структуре", () => {
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "13543";
		const positionCursor = 5;
		expect(()=>addElement(indexFocusElement, positionCursor, indexDataMap, structure)).toThrow(Error);
	});
	it("когда positionCursor равно 0", () => {
		const structure = SkeletonStructure.startStructure();

		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 0;
		const [struct, newMap, newPosition] = addElement(indexFocusElement, positionCursor, indexDataMap, structure);

		expect(struct).not.toEqual(structure);
		expect(struct.couldBeChildren).toBeTruthy();
		expect(struct.children!.length).toBe(3);

		const child1 = struct.children![0];
		const child2 = struct.children![2];
		const index1 = child1.indexElement;
		const index2 = child2.indexElement;
		expect(index1).not.toBeNull();
		expect(index2).not.toBeNull();

		expect(newMap).not.toEqual(indexDataMap);
		expect(newMap.size).toBe(2);
		expect(newMap.has(index1!.join(","))).toBeTruthy();
		expect(newMap.get(index1!.join(","))).toBe("");
		expect(newMap.has(index2!.join(","))).toBeTruthy();
		expect(newMap.get(index2!.join(","))).toBe("test element");

		expect(newPosition).not.toEqual(positionCursor);
		expect(newPosition.indexElement).toBe("2,0");
		expect(newPosition.positionCursor).toBe(0);
	});
	it("когда positionCursor равно длине текста", () => {
		const structure = SkeletonStructure.startStructure();

		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 12;
		const [struct, newMap, newPosition] = addElement(indexFocusElement, positionCursor, indexDataMap, structure);

		expect(struct).not.toEqual(structure);
		expect(struct.couldBeChildren).toBeTruthy();
		expect(struct.children!.length).toBe(3);

		const child1 = struct.children![0];
		const child2 = struct.children![2];
		const index1 = child1.indexElement;
		const index2 = child2.indexElement;
		expect(index1).not.toBeNull();
		expect(index2).not.toBeNull();

		expect(newMap).not.toEqual(indexDataMap);
		expect(newMap.size).toBe(2);
		expect(newMap.has(index1!.join(","))).toBeTruthy();
		expect(newMap.get(index1!.join(","))).toBe("test element");
		expect(newMap.has(index2!.join(","))).toBeTruthy();
		expect(newMap.get(index2!.join(","))).toBe("");

		expect(newPosition).not.toEqual(positionCursor);
		expect(newPosition.indexElement).toBe("2,0");
		expect(newPosition.positionCursor).toBe(0);
	});
	it("когда positionCursor выходит за пределы длины текста", () => {
		const structure = SkeletonStructure.startStructure();

		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 25;
		const [struct, newMap, newPosition] = addElement(indexFocusElement, positionCursor, indexDataMap, structure);

		expect(struct).not.toEqual(structure);
		expect(struct.couldBeChildren).toBeTruthy();
		expect(struct.children!.length).toBe(3);

		const child1 = struct.children![0];
		const child2 = struct.children![2];
		const index1 = child1.indexElement;
		const index2 = child2.indexElement;
		expect(index1).not.toBeNull();
		expect(index2).not.toBeNull();

		expect(newMap).not.toEqual(indexDataMap);
		expect(newMap.size).toBe(2);
		expect(newMap.has(index1!.join(","))).toBeTruthy();
		expect(newMap.get(index1!.join(","))).toBe("test element");
		expect(newMap.has(index2!.join(","))).toBeTruthy();
		expect(newMap.get(index2!.join(","))).toBe("");

		expect(newPosition).not.toEqual(positionCursor);
		expect(newPosition.indexElement).toBe("2,0");
		expect(newPosition.positionCursor).toBe(0);
	});
	it("когда positionCursor отрицателен", () => {
		const structure = SkeletonStructure.startStructure();

		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = -52;
		const [struct, newMap, newPosition] = addElement(indexFocusElement, positionCursor, indexDataMap, structure);

		expect(struct).not.toEqual(structure);
		expect(struct.couldBeChildren).toBeTruthy();
		expect(struct.children!.length).toBe(3);

		const child1 = struct.children![0];
		const child2 = struct.children![2];
		const index1 = child1.indexElement;
		const index2 = child2.indexElement;
		expect(index1).not.toBeNull();
		expect(index2).not.toBeNull();

		expect(newMap).not.toEqual(indexDataMap);
		expect(newMap.size).toBe(2);
		expect(newMap.has(index1!.join(","))).toBeTruthy();
		expect(newMap.get(index1!.join(","))).toBe("");
		expect(newMap.has(index2!.join(","))).toBeTruthy();
		expect(newMap.get(index2!.join(","))).toBe("test element");

		expect(newPosition).not.toEqual(positionCursor);
		expect(newPosition.indexElement).toBe("2,0");
		expect(newPosition.positionCursor).toBe(0);
	});
	it("когда добавляетсяя в 'if' блок",()=>{
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map<string, string>().set("0", "test element");
		const indexFocusElement = "0";
		const positionCursor = 5;
		const structNewMapNewPosition = addElement(indexFocusElement, positionCursor, indexDataMap, structure);
		const child = structNewMapNewPosition[0].children![1];
		const ifElement = child.children![0];
		const newIndexFocusElement = ifElement.indexElement;
		structNewMapNewPosition[1].set(newIndexFocusElement!.join(","),"test element block if")

		const [struct, newMap, newPosition] = addElement(newIndexFocusElement!.join(","), positionCursor, structNewMapNewPosition[1], structNewMapNewPosition[0]);

		expect(struct.children?.length).toBe(3);
		const childStruct = struct.children![1];
		expect(childStruct.children?.length).toBe(5);

		expect(newMap.get('0')).toBe('test ');
		expect(newMap.get('1')).toBe('element');
		expect(newMap.get(newIndexFocusElement!.join(","))).toBe('test element block if');

		expect(newPosition.positionCursor).toBe(0);
		expect(newPosition.indexElement).toBe("2,4,0")
	})
});