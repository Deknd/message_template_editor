import React, {  useState } from "react";
import { DynamicHeightInput, DynamicHeightInputProps } from "./DynamicHeightInput/DynamicHeightInput";
import { ArrVarName } from "./ArrVarName";
//import { IfThenElse, IfThenElseProps } from "./IfThenElse/IfThenElse";

export class PositionCursor{
    indexElement: number
    positionCursor: number
    constructor(indexElement: number, positionCursor: number){
        this.indexElement=indexElement;
        this.positionCursor=positionCursor;
    }
}

export const MessageTemplateEditor = ()=>{

    const [ positionCursor, setPositionCursor ] = useState<PositionCursor>(new PositionCursor(0,0));
    const [ arrVarName, setArrVarName ] = useState<string | null>(null);

  
    const [elements, setElements] = useState<Array<DynamicElement>>([]);
    const [ countIndex, setCountIndex ] = useState<number>(1);
    
    function addElements() {
        const indexElement = countIndex;
        setCountIndex(countIndex+1)
        
        const dynamicElement = new DynamicElement(DynamicHeightInput, indexElement) 
        setElements([...elements,  dynamicElement]);
      }
     
      
    
    

    return(
        <div 
        style={{
            height: '100%',

            backgroundColor: 'blue',
            paddingTop: '1em',
            paddingLeft: '1em',
            paddingRight: "1em",

            borderColor: 'red',
            borderWidth: '2px',
            borderStyle: 'solid'
            
        }}>
            {positionCursor.positionCursor}
            {" index: "+positionCursor.indexElement}
            <ArrVarName setArrVarName={setArrVarName} />
            <button onClick={addElements}>{'Click to add: IF {some_variable} THEN [then_value] ELSE [else_value]'}</button>
            <DynamicHeightInput 
                indexElement={0}
                arrVarName={arrVarName}
                setArrVarName={setArrVarName}
                positionCursor={positionCursor} 
                setPositionCursor={setPositionCursor} />
            {elements.map((Element, index)=> (
                Element ? (<div key={index}> {Element.renderDHI(positionCursor, setPositionCursor, arrVarName, setArrVarName)} </div>) : null
                
            ))}
           
        </div>
    )
} 


class DynamicElement{
   private reactElement: React.FC<DynamicHeightInputProps>
   private indexElement: number
    constructor( reactElement: React.FC<DynamicHeightInputProps>, indexElement: number){
        this.reactElement = reactElement
        this.indexElement = indexElement
    }
    public renderDHI(
        positionCursor: PositionCursor,
        setPositionCursor: (position: PositionCursor) => void,
        arrVarName: string | null,
        setArrVarName: (varNames: string | null) => void
      ): JSX.Element {
        const DHI = this.reactElement;
        return (
          <DHI
            arrVarName={arrVarName}
            setArrVarName={setArrVarName}
            indexElement={this.indexElement}
            positionCursor={positionCursor}
            setPositionCursor={setPositionCursor}
          />
        );
      }
}