import { SkeletonStructure } from './SkeletonStructure';

describe('SkeletonStructure', () => {
	it('should create a new structure with the specified properties', () => {
		const structure = SkeletonStructure.startStructure();
		expect(structure.couldBeChildren).toBe(true);
		expect(structure.indexElement).toEqual(null);
		expect(Array.isArray(structure.children)).toBe(true);
		expect(structure.children?.length).toBe(1)
		expect(structure.block).toBe(null);
	});

	it('should add a block to the parent element', () => {
		const structure = SkeletonStructure.startStructure();
		structure.addBlockToParent([0].join())
		expect(structure.children?.length).toBe(3);
		const oneElement = structure.children![1];
		expect(oneElement.couldBeChildren).toBe(true);
		expect(oneElement.children?.length).toBe(3);

		const childrenOneElement = oneElement.children;
		const oneChild = childrenOneElement![0];
		expect(oneChild.couldBeChildren).toBe(false)
		expect(oneChild.block).toBe("if")

		const twoChild = childrenOneElement![1];
		expect(twoChild.couldBeChildren).toBe(false)
		expect(twoChild.block).toBe("then")

		const threeChild = childrenOneElement![2];
		expect(threeChild.couldBeChildren).toBe(false)
		expect(threeChild.block).toBe("else")

		const twoElement = structure.children![2];
		expect(twoElement.couldBeChildren).toBe(false);
		expect(twoElement.children).toBe(null);


	});
	it("should not add blocks to a parent that cannot have children", function () {
		const structure = SkeletonStructure.startStructure();
		const child = structure.children![0];
		expect(child.couldBeChildren).toBe(false);
		child.addBlockToParent([1].join(","));
		expect(child.children).toBe(null)
	});

	it("should add a block to an element with an 'if' block",function () {
		const structure = SkeletonStructure.startStructure();
		structure.addBlockToParent([0].join());
		const child = structure.children![1];
		const children = child.children;
		const childBlockIf = children![0];
		expect(childBlockIf.block).toBe("if");
		const index = childBlockIf.indexElement?.join(",");
		child.addBlockToParent(index!);
		expect(children?.length).toBe(5)
		const oneChild = children![0];
		expect(oneChild.couldBeChildren).toBe(false);
		expect(oneChild.block).toBe("if");
		expect(oneChild.children).toBe(null);
		const twoChild = children![1];
		expect(twoChild.couldBeChildren).toBe(false);
		expect(twoChild.block).toBe("then");
		expect(twoChild.children).toBe(null);
		const threeChild = children![2];
		expect(threeChild.couldBeChildren).toBe(true);
		expect(threeChild.block).toBe(null);
		expect(threeChild.children?.length).toBe(3);
		const fourChild = children![3];
		expect(fourChild.couldBeChildren).toBe(false);
		expect(fourChild.block).toBe(null);
		expect(fourChild.children).toBe(null);
		const fiveChild = children![4];
		expect(fiveChild.couldBeChildren).toBe(false);
		expect(fiveChild.block).toBe("else");
		expect(fiveChild.children).toBe(null);
	});
	it("should create a copy of the structure", function () {
		const structure = SkeletonStructure.startStructure();
		structure.addBlockToParent([0].join());
		const child = structure.children![1];
		const children = child.children;
		const childBlockIf = children![0];
		expect(childBlockIf.block).toBe("if");
		const index = childBlockIf.indexElement?.join(",");
		child.addBlockToParent(index!);

		const newStructure = SkeletonStructure.getNewStruct(structure);
		expect(newStructure == structure).toBe(false)
		expect(newStructure).toEqual(structure);
	});
	it("should find the position in the array", function () {
		const structure = SkeletonStructure.startStructure();
		structure.addBlockToParent([0].join());
		const element = structure.children![1];
		const index = element.indexElement;
		let position: number | undefined;
		if(index){
			position = structure.findPositionElementInTemplateStructure(index?.join(","))
		}
		expect(position).toBe(1)
	});
	it("should find the position of an element with no children", function () {
		const structure = SkeletonStructure.startStructure();
		const child = structure.children![0];
		const positionChild = child.findPositionElementInTemplateStructure("1");
		expect(positionChild).toBe(-1);
		structure.addBlockToParent([0].join(","));
		const twoChild = structure.children![1];
		const positionTwoChild = twoChild.findPositionElementInTemplateStructure("12312412");
		expect(positionTwoChild).toBe(-1);
	});
	it("should find the parent element", function () {
		const structure = SkeletonStructure.startStructure();
		structure.addBlockToParent([0].join(","));
		const parent = structure.children![1];
		const index = parent.indexElement;
		const childIndex = parent.children![0].indexElement;
		let resultParent
		if(childIndex){
			resultParent = structure.findParentElementByPath(childIndex);
		}
		expect(resultParent).toEqual(parent);
		if(index){
			resultParent = structure.findParentElementByPath(index);
		}
		expect(resultParent).toEqual(structure);
		resultParent = structure.findParentElementByPath([9,2,123])
		expect(resultParent).toBe(undefined);

	});

});
