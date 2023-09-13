//достает данные из Мапы по индексу
export function updateDate( indexElement: string, indexDataMap: Map<string, string> ): string {
	if (indexDataMap.has(indexElement)) {
		const data = indexDataMap.get(indexElement);
		if (data) {
			return data;
		}
	}
	return "";
}