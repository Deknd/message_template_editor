import {getTemplate} from "./Template";
import {SkeletonStructure} from "../sceletonStructure";

describe('getTemplate', () => {
	it('should create a Template object with variables used in the text', () => {

		const arrVarName = ['variable1', 'variable2', 'variable3'];
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map();
		indexDataMap.set([0].join(","), 'This is element 1 {variable1}');

		const template = getTemplate(arrVarName, structure, indexDataMap);

		expect(template).toEqual({
			arrVarName: ['variable1'],
			structure,
			indexDataArray: [['0', 'This is element 1 {variable1}']],
		});
	});
	it('should create a Template object where variables are not used in the text', () => {

		const arrVarName = ['1', '2', '3'];
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map();
		indexDataMap.set([0].join(","), 'This is element 1 {variable1}');

		const template = getTemplate(arrVarName, structure, indexDataMap);

		expect(template).toEqual({
			arrVarName: [],
			structure,
			indexDataArray: [['0', 'This is element 1 {variable1}']],
		});
	});

	it('should create an empty Template object for empty data', () => {
		const arrVarName: string[] = [];
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map();

		const template = getTemplate(arrVarName, structure, indexDataMap);

		expect(template).toEqual({
			arrVarName: [],
			structure,
			indexDataArray: [],
		});
	});
	it("should handle text without variables", function () {
		const arrVarName: string[] = [];
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map();
		indexDataMap.set([0].join(","), 'This is element 1 {variable1}');

		const template = getTemplate(arrVarName, structure, indexDataMap);

		expect(template).toEqual({
			arrVarName: [],
			structure,
			indexDataArray: [['0', 'This is element 1 {variable1}']],
		});
	});
	it("should handle elements that do not exist in the structure", function () {
		const arrVarName = ['variable1', 'variable2', 'variable3'];
		const structure = SkeletonStructure.startStructure();
		const indexDataMap = new Map();
		indexDataMap.set([5].join(","), 'This is element 1 {variable1}');

		const template = getTemplate(arrVarName, structure, indexDataMap);

		expect(template).toEqual({
			arrVarName: [],
			structure,
			indexDataArray: [],
		});
	});
});
