import React from "react";

interface VarNameButtonsProps {
	arrayVarName: Array<string>;
	addVarNameForText: (varName: string) => void;
}


export const VarNameButtons: React.FC<VarNameButtonsProps> = ({
	arrayVarName,
	addVarNameForText
}) => {
	return (
		<div>
			{arrayVarName.map((item, index) => (
				<span style={{margin: "0.5em"}}
					  key={index}>
					<button onClick={() => {
						addVarNameForText("{" + item + "}");
					}}>
					{"{" + item + "}"}
					</button>
				</span>
			))
			}
		</div>
	);

};