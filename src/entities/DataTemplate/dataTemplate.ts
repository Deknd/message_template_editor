import {useState} from "react";

export function useDataTemplate(){
	const [ indexDataMap, setIndexDataMap ] = useState<Map<string,string>>(new Map());
	function updateIndexDataMap(indexElement: string, dataText: string){
		const newMap = new Map<string, string>();
		const entriesArray = Array.from(indexDataMap.entries());
		for (const [key, value] of entriesArray) {
			newMap.set(key, value);
		}
		newMap.set(indexElement, dataText);
		setIndexDataMap(newMap);
	}
	return [indexDataMap, updateIndexDataMap, setIndexDataMap] as const;

}
export function getTextFromFocusElement(indexElement: string, mapIndexData: Map<string, string>) {
	if (mapIndexData.has(indexElement)) {
		const focusText = mapIndexData.get(indexElement);
		if (focusText) {
			return focusText;
		}
	}
	return "";
}
