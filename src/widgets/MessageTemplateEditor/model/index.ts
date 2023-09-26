import {Template} from "../../../entities/Template";

// Retrieve an array of variable names from localStorage or set a default value
export const arrVarNames =  localStorage.arrVarNames ? JSON.parse(localStorage.arrVarNames) : ["firstname", "lastname", "company", "position"];

// Function for saving a template to localStorage
export function callbackSave(template: Template) {
	try {
		const templateJSON = JSON.stringify(template);
		localStorage.setItem('template', templateJSON);
	} catch (error) {
		console.error("Error while saving the template:", error);
	}
}
// Retrieve a template from localStorage or set a default value
export function template() {
	return localStorage.template ? JSON.parse(localStorage.template) : null;
}


