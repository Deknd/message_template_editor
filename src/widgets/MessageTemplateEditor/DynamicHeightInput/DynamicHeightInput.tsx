import React, { useEffect, useRef, useState } from "react";
import { PositionCursor } from "../MessageTemplateEditor";

//пропсы
export interface DynamicHeightInputProps {
  //данные для старта
  startValue?: string
  // //вторая часть сообщения
  // partValue: (partValue: string) => void
  //переменные приходящие из ArrVarName
  arrVarName: string | null
  //функция для стирания переменной, когда она скопирована в текст
  setArrVarName: (varNames: string | null) => void
  //идекс элемента
  indexElement: number
  //позиция курсора и номер фокусного эелемента
  positionCursor: PositionCursor,
  //функция для редактирования позиции курсора
  setPositionCursor: ( position: PositionCursor) => void,
}

export const DynamicHeightInput: React.FC<DynamicHeightInputProps> = ({ 
  startValue,
  indexElement, 
  arrVarName,
  setArrVarName,
  positionCursor, 
  setPositionCursor}) => {
//состояние данных
const [ valueTextArea, setValueTextArea ] = useState<string>(startValue? startValue: '');
//реф ссылка на данный объект
const textarea = useRef<HTMLTextAreaElement | null>(null);

//меняет размер взависимости от текста
 function autoResize( elementHTML:HTMLTextAreaElement): void {
  elementHTML.style.height = 'auto';
  elementHTML.style.height = elementHTML.scrollHeight + 'px';
 }


  //передает положение курсора и последнего выбраного поля ввода
  const setCursorP = (ref: React.MutableRefObject<HTMLTextAreaElement | null>) =>{
      if(ref.current){
        const elem = ref.current;
        setPositionCursor(new PositionCursor(indexElement,elem.selectionStart ) )
      }
  }


//следит за изменением текста и ставит курсор по позиции, востанавливает фокус
 useEffect(()=>{
   if(indexElement === positionCursor.indexElement){
    if(textarea.current){
      const elementTextarea = textarea.current;
      autoResize(elementTextarea)
      elementTextarea.setSelectionRange(positionCursor.positionCursor, positionCursor.positionCursor)
      elementTextarea.focus();
    }
  }
 },[valueTextArea, positionCursor.indexElement])


//записывает данные в состояние, меняет позицию курсора
 const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setCursorP(textarea)
  setValueTextArea(e.target.value);
 }
//добавляет переменные в текст
 useEffect(()=>{
  if(arrVarName != null){
    if(indexElement === positionCursor.indexElement){
      addVarNameForTemplase(arrVarName);
      setArrVarName(null)
    }
  }
 },[arrVarName])
 //вставляет переменные вместо, где установлен курсор, меняет позицию курсора, обновляет данные в состоянии
 const addVarNameForTemplase = (varName: string) =>{
  let newText: string;
      if(valueTextArea.length !== 0){
          newText =
          valueTextArea.slice(0, positionCursor.positionCursor) +
          varName+
          valueTextArea.slice(positionCursor.positionCursor);
      }else{ newText = varName}
  setPositionCursor(new PositionCursor(indexElement, positionCursor.positionCursor+varName.length))
  setValueTextArea(newText) 
}


 


  return (
    <div onClick={()=> setCursorP(textarea) 
    }>
      <textarea ref={textarea} style={{
        width: "100%",
        resize: 'none'
      }} 
      onChange={handleTextChange}
      value={valueTextArea}/>
    </div>
  );
};


