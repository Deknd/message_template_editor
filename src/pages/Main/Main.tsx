import React from 'react';

import style from './main.module.css';
import { MessageTemplateEditor, arrVarNames, template, callbackSave} from '../../widgets/MessageTemplateEditor';
import {createRoot} from "react-dom/client";


export const Main = () => {

	const toggleWidget = () => {
		const temp = template();
		const containerMain = document.getElementById("container_message_template_editor");
		const container = document.createElement("div");
		const messageTemplateEditor = (
			<MessageTemplateEditor arrVarNames={arrVarNames} template={temp} callbackSave={callbackSave} />
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


