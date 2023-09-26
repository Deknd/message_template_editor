import React from "react";
import styles from "./var_names_buttons.module.css";

interface VarNameButtonsProps {
	arrayVarName: Array<string>;
	addVarNameForText: (varName: string) => void;
}

/**
 * The `VarNameButtons` component is designed to display buttons with variable names
 * from the `arrayVarName` array. Each button, when clicked, triggers the `addVarNameForText` method.
 */
export const VarNameButtons: React.FC<VarNameButtonsProps> = ({
	arrayVarName,
	addVarNameForText
}) => {


	return (
		<div>
			{/* Section title: Variables */}
			<label className={`${styles.title_color} ${styles.section_title_font_size}`}>
				Variables
			</label>
			<div className={styles.container_variable}>
				{arrayVarName.map((item, index) => (
					<div key={`${index}${item}`}>
						{/* Button with variable name */}
						<button className={styles.variables} onClick={() => {
							// When the button is clicked, the `addVarNameForText` method is called,
							// passing the variable name enclosed in curly braces
							addVarNameForText("{" + item + "}");
						}}>
							{"{" + item + "}"}
						</button>
					</div>
				))
				}
			</div>
		</div>
	);
};