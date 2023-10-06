import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {EditableTextBlock} from "./EditableTextBlock";

describe("EditableTextBlock", () => {
	it("renders correctly when indexElement exists in indexDataMap", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
			/>
		);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveValue(data);
	});

	it("calls updateElementText when the text is changed", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const newData = "New Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, {target: {value: newData}});
		expect(updateElementText).toHaveBeenCalledWith(indexElement, newData);
	});

	it("handles readOnly mode correctly", () => {
		const indexElement = "element1";
		const data = "Read-Only Text";
		const newData = "New Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
				isReadonly={true}
			/>
		);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		fireEvent.change(textarea, {target: {value: newData}});
		const textResult = textarea.value;
		expect(textarea).toHaveAttribute("readOnly");
		expect(updateElementText).not.toHaveBeenCalled();
		expect(textResult).toEqual(data);
	});

	it("calls setPositionCursor when arrow keys are pressed", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		const setPositionCursor = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
				setPositionCursor={setPositionCursor}
			/>
		);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		fireEvent.keyUp(textarea, {key: "ArrowRight"});
		expect(setPositionCursor).toHaveBeenCalledWith(indexElement, textarea.selectionStart);
	});

	it("sets the cursor position correctly when focusElement changes", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		const getPosition = jest.fn().mockReturnValue(5);
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
				getPosition={getPosition}
			/>
		);
		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
		expect(getPosition).toHaveBeenCalledWith("element1");
		expect(textarea.selectionStart).toBe(5);
	});

	it("calls updateElementText and setPositionCursor when the text is changed", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const newData = "New Text";
		const indexDataMap = new Map().set(indexElement, data);
		const updateElementText = jest.fn();
		const setPositionCursor = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
				setPositionCursor={setPositionCursor}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, {target: {value: newData}});
		expect(updateElementText).toHaveBeenCalledWith(indexElement, newData);
		expect(setPositionCursor).toHaveBeenCalledWith(indexElement, 8);
	});

	it("calls setPositionCursor when onFocus is triggered", () => {
		const indexElement = "element1";
		const indexDataMap = new Map().set(indexElement, "Initial Text");
		const setPositionCursor = jest.fn();
		const getPosition = jest.fn().mockReturnValue(10);
		const focusElement = "element2";
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				setPositionCursor={setPositionCursor}
				getPosition={getPosition}
				focusElement={focusElement}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.focus(textarea);
		expect(setPositionCursor).toHaveBeenCalledWith(indexElement, 10);
	});

	it("does not call setPositionCursor when focusElement is equal to indexElement", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const setPositionCursor = jest.fn();
		const focusElement = "element1";
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				setPositionCursor={setPositionCursor}
				focusElement={focusElement}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.focus(textarea);
		expect(setPositionCursor).not.toHaveBeenCalled();
	});

	it("changes the cursor position on click", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const setPositionCursor = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				setPositionCursor={setPositionCursor}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.click(textarea, {target: {selectionStart: 5, selectionEnd: 5}});
		expect(setPositionCursor).toHaveBeenCalledWith(indexElement, 5);
	});

	it("does not change the cursor position when focusElement is not equal to indexElement", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const setPositionCursor = jest.fn();
		const focusElement = "element2";
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				setPositionCursor={setPositionCursor}
				focusElement={focusElement}
			/>
		);
		const textarea = screen.getByRole("textbox");
		fireEvent.click(textarea, {target: {selectionStart: 5, selectionEnd: 5}});
		expect(setPositionCursor).not.toHaveBeenCalled();
	});

	it("renders correctly when indexElement is not in indexDataMap", () => {
		const indexElement = "element1";
		const otherElement = "otherElement";
		const otherData = "Other Text";
		const indexDataMap = new Map().set(otherElement, otherData);
		const updateElementText = jest.fn();
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				updateElementText={updateElementText}
			/>
		);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveValue("");
	});
	it("accepts and applies custom class names", () => {
		const indexElement = "element1";
		const data = "Initial Text";
		const indexDataMap = new Map().set(indexElement, data);
		const customClassName = "custom-class";
		render(
			<EditableTextBlock
				indexElement={indexElement}
				indexDataMap={indexDataMap}
				className={customClassName}
			/>
		);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveClass(customClassName);
	});


});
