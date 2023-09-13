export class SkeletonStructure {
	readonly couldBeChildren: boolean;
	readonly indexElement: Array<number> | null
	readonly children: Array<SkeletonStructure | null> | null;
	constructor(couldBeChildren: boolean, index: Array<number> | null = null, children?: Array<SkeletonStructure | null> | null) {
		this.indexElement=index;
		this.couldBeChildren = couldBeChildren;
		if(children){
			this.children = children;
		}else {
			if(couldBeChildren){
				this.children = new Array<SkeletonStructure | null>();
			}else{
				this.children = null;
			}
		}
	}
	public addAfterThen(){
		if(this.children !== null && this.indexElement !== null){
			this.children[2] = new SkeletonStructure(true, [...this.indexElement, 2], [
				new SkeletonStructure(false, [...[...this.indexElement, 2],0]),
				new SkeletonStructure(false, [...[...this.indexElement, 2],1]),
				null,
				new SkeletonStructure(false, [...[...this.indexElement, 2],3]),
				null
			])
		}
	}
	public addAfterElse(){
		if(this.children !== null && this.indexElement !== null){
			this.children[4] = new SkeletonStructure(true, [...this.indexElement, 4], [
				new SkeletonStructure(false, [...[...this.indexElement, 4],0]),
				new SkeletonStructure(false, [...[...this.indexElement, 4],1]),
				null,
				new SkeletonStructure(false, [...[...this.indexElement, 4],3]),
				null
			])
		}
	}
	public findPositionElementInTemplateStructure( focusIndex: string ): number {
		if(this.children === null){
			return 0;
		}
		return this.children.findIndex((element) => {
			if (element !== null) {
				return element.indexElement?.join(",") === focusIndex;
			}
			return false;
		});

	}
	public findTwoNextElements(positionElementInArray: number ): { indexElementOneString: string, indexElementTwoString: string } {
		if(this.children === null){
			return {indexElementOneString: "", indexElementTwoString: ""};
		}
		const elementOne = this.children[positionElementInArray + 1];
		const elementTwo = this.children[positionElementInArray + 2];
		if (elementOne !== null && elementTwo !== null) {
			const indexElementOneString = getIndexString(elementOne.indexElement);
			const indexElementTwoString = getIndexString(elementTwo.indexElement);
			return {indexElementOneString, indexElementTwoString};
		} else return {indexElementOneString: "", indexElementTwoString: ""};

	}
	public findParentElementByPath( focusElement: Array<number> ) {

		const numberIndexElementParent = focusElement.length - 2;
		let parentElement: SkeletonStructure | null = this;
		let doneWay: Array<number> = [];
		let targetIndex: number | null = null;
		for (let i = 0; i <= numberIndexElementParent; i++) {
			doneWay = [...doneWay, focusElement[i]];
			if (parentElement === null) {
				return;
			}
			targetIndex = parentElement.findPositionElementInTemplateStructure(doneWay.join(","));
			if (targetIndex === null) {
				return;
			}
			const arrayCompsF: (SkeletonStructure | null)[] | null = parentElement.children;
			if (arrayCompsF === null) {
				return;
			}
			const targetF: SkeletonStructure | null = arrayCompsF[targetIndex];
			if (targetF === null) {
				return;
			}
			if (targetF.couldBeChildren) {
				parentElement = targetF;
			}
		}
		return parentElement;
	}
	public deleteAfterThen() {
		if (this.children !== null && this.indexElement !== null) {
			this.children[2] = null;
		}
	}
	public deleteAfterElse() {
		if (this.children !== null && this.indexElement !== null) {
			this.children[4] = null;

		}
	}


}
function getIndexString(indexElement: string | Array<number> | null) {
	if (indexElement !== null) {
		if (typeof indexElement === "string") {
			return indexElement;
		} else {
			return indexElement.join(",");
		}
	}
	return "";
}
export interface Template{
	arrVarName: Array<string>;
	structure: SkeletonStructure;
	indexDataMap: Array<Array<string>>;
}