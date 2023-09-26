import {act,  renderHook} from "@testing-library/react";
import { useElementDataMap, getTextForElement } from './dataTemplate'; // Замените на путь к вашему файлу хука

describe('useElementDataMap', () => {
	it('updates and retrieves element data correctly', () => {
		const { result } = renderHook(() => useElementDataMap());

		const [elementDataMap, updateElementText, setElementDataMap] = result.current;

		// Update data for an element
		act(() => {
			console.log("run?")
			updateElementText('element1', 'Text for element 1');
			console.log(elementDataMap)
		});

		// Verify that data was updated correctly
		//expect(elementDataMap.get('element1')).toBe('Text for element 1');

		console.log("map: ",elementDataMap)
		// Retrieve data using getTextForElement function
		const text = getTextForElement('element1', elementDataMap);
		console.log(text);
		// Verify that retrieved data matches the updated data
		expect(text).toBe('Text for element 1');
	});




});
