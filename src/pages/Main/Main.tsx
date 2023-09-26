import React, {useState} from "react";

import style from './main.module.css';
import { MessageTemplateEditor } from '../../widgets/MessageTemplateEditor';
import {createRoot} from "react-dom/client";
import {getTemplate, Template} from "../../entities/Template";


export const Main = () => {

	const [arrVarNames] = useState<Array<string>>(localStorage.arrVarNames ? JSON.parse(localStorage.arrVarNames) : ["firstname", "lastname", "company", "position"]);
	const [ template ] = useState<Template>(localStorage.template ? JSON.parse(localStorage.template) : null)
	function callbackSave(template: Template) {
		try {
			const templateJSON = JSON.stringify(template);
			localStorage.setItem('template', templateJSON);
		} catch (error) {
			console.error("Error while saving the template:", error);
		}
	}
	const toggleWidget = () => {
		const containerMain = document.getElementById("container_message_template_editor");
		const container = document.createElement("div");
		const messageTemplateEditor = (
			<MessageTemplateEditor arrVarNames={arrVarNames} template={template} callbackSave={callbackSave} />
		);
		const root = createRoot(container);
		root.render(messageTemplateEditor);
		if(containerMain){
			containerMain.appendChild(container);
		}
	};

	return (
		<div>
			<button className={style.button} onClick={toggleWidget}>
				Message Template Editor
			</button>
			<div id={"container_message_template_editor"}>
			</div>
		</div>
	);
};


