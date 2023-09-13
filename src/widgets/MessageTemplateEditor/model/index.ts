import {Template} from "../../../entities/sceletonStructure";

function addVarNames(): Array<string>{
	const arrVarNames = localStorage.arrVarNames ? JSON.parse(localStorage.arrVarNames) : ['firstname', 'lastname', 'company', 'position'];
	return arrVarNames;
}
function callbackSave(){

}
function template(): Template{
	const template = localStorage.template  ? JSON.parse(localStorage.template) : null;
	return template;
}

export const model = { addVarNames, callbackSave, template};