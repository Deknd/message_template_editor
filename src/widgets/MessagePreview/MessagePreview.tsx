import React, {useMemo} from "react";

import {messageGeneratorOnTemplate} from "../../features/messageGeneratorOnTemplate";
import {ShowVariables} from "../../features/ShowVariables";


import {Template} from "../../entities/Template";
import {useElementDataMap} from "../../entities/DataTemplate";
import {EditableTextBlock} from "../../entities/EditableTextBlock";

import styles from "./message_preview.module.css";

interface MessagePreviewProps {
	arrVarNames: Array<string>;
	template: Template;
}
/**
 * MessagePreview Component
 *
 * This component is a widget designed for previewing message templates. It allows users to input variables,
 * and the displayed text dynamically updates based on the template structure and the provided variables.
 *
 * Props:
 * - arrVarNames: An array of variable names that can be used in the message template.
 * - template: An object representing the message template structure.
 */
export const MessagePreview: React.FC<MessagePreviewProps> = ({arrVarNames, template}) => {

	const varNamesObjectArray: {[p: string]: string}[] = generationVarNameObjectArray(arrVarNames, template);

	function generationVarNameObjectArray(arrVarNamesFromProps: string[], template: Template): { [p: string]: string }[] {
		return template.arrVarName
			.filter(varName => arrVarNamesFromProps.includes(varName))
			.map(str => ({[str]:""}))
	}

	const [indexDataMap, updateElementText] = useElementDataMap();

	const dataTemplate: Map<string, string> = useMemo(() => {
		varNamesObjectArray.forEach(varName => {
			const [key]= Object.keys(varName);
			if (indexDataMap.has(key)) {
				const value = indexDataMap.get(key);
				varName[key] = value || "";
			}
		});
		return getMapForTemplate(messageGeneratorOnTemplate(template, varNamesObjectArray));
	}, [varNamesObjectArray, indexDataMap, template]);

	function getMapForTemplate(data: string): Map<string, string> {
		const mapText = new Map<string, string>();
		mapText.set("message", data);
		return mapText;
	}

	return (
		<div className={styles.preview_container}>
			<label className={`${styles.widget_title_font_size} ${styles.title_text_color}`}>
				Message Preview
			</label>
			<div className={styles.title_container}>
				<label className={`${styles.section_title_font_size} ${styles.title_text_color}`}>
					Message
				</label>
			</div>
			<EditableTextBlock className={styles.input_background} isReadonly={true} indexElement={"message"} indexDataMap={dataTemplate} />
			<div className={styles.title_container}>
				<label className={`${styles.section_title_font_size} ${styles.title_text_color}`}>
					Variables
				</label>
			</div>
			<ShowVariables arrVarNames={varNamesObjectArray} indexDataMap={indexDataMap}
						   updateElementText={updateElementText}/>
		</div>
	);
};
