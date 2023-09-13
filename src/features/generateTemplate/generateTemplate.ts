import {SkeletonStructure} from "../../entities/sceletonStructure";


export function generateTemplate(structure: SkeletonStructure, indexDataMap: Map<string,string>, arrVarNames: Array<string>){
	const arrayChildren = structure.children;
	if(arrayChildren === null){
		return;
	}
	const resultArray = getStructureTemplate(arrayChildren);
	const objectArray = arrVarNames.map<VarName>((str)=>{
		return {name: "{"+str+"}", value: ''}
	});
	const variableMap = createVarNameMap(objectArray);

	const stringArray = new Array<string>();
	const positionIdMap = new Map<number, string>();
	const idDataMap = new Map<string, Array<string | VarName>>();
	let count = 0;
	for (let i = 0; i < resultArray.length; i++) {
		const key = resultArray[i].join(",")
		if(indexDataMap.has(key)){
			const text = indexDataMap.get(key);
			if(text){
				stringArray.push(text)
				positionIdMap.set(count, key);
				idDataMap.set(key, splitText(variableMap, text))
				count++;
			}
		}
	}

	console.log("var names: ", arrVarNames)
	console.log("pos id: ", positionIdMap)
	console.log("id data: ", idDataMap)




}
interface VarName{
	name: string;
	value: string;
}
function createVarNameMap(arrayVarName: Array<VarName>, ) {
	const variableMap = new Map<string, VarName>();
	arrayVarName.forEach((variable) => {
		variableMap.set(variable.name, variable);
	})
	return variableMap;
}
function splitText(variableMap: Map<string, VarName>, text: string) {
	const parts = text.split(/(\{[^}]+\})/).map(part => {
		if (variableMap.has(part)) {
			return variableMap.get(part);
		} else {
			return part;
		}
	});

	// Удаление undefined значений
	const filteredParts = parts.filter(part => part !== undefined);

	return filteredParts as (string | VarName)[];
}

function getStructureTemplate(arrayChildren: Array<SkeletonStructure | null>):Array<Array<number>>{
	const resultArray = new Array<Array<number>>();
	for(let i =0; i<arrayChildren.length; i++){
		const childElement = arrayChildren[i];
		if(childElement !== null){
			if(!childElement.couldBeChildren){
				const index = childElement.indexElement;
				if(index !== null){
					resultArray.push(index);
				}
			} else{
				childrenRound(childElement, resultArray);
			}
		}

	}
	return resultArray;
}



function childrenRound(child:SkeletonStructure, resultArray: Array<Array<number>>){
	const arrayChildren = child.children;
	if(arrayChildren === null){
		return;
	}
	for(let i = 0; i<arrayChildren.length; i++){
		const childElement = arrayChildren[i];
		if(childElement !== null){
			if(!childElement.couldBeChildren){
				const index = childElement.indexElement;
				if(index !== null){
					resultArray.push(index);
				}
			}else{
				childrenRound(childElement, resultArray);
			}
		}
	}


}
