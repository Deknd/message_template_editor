import React from "react";
import { DynamicHeightInput } from "../DynamicHeightInput/DynamicHeightInput";
import { PositionCursor } from "../MessageTemplateEditor";


export interface IfThenElseProps{
    NestedComponentThen?: React.FC<IfThenElseProps> | null
    NestedComponentElse?: React.FC<IfThenElseProps> | null
}

export const IfThenElse: React.FC<IfThenElseProps> = ({NestedComponentElse = null, NestedComponentThen = null })=>{



    return(
        <div>
            <div style={{
                margin: '0.4em',
                display: 'flex',
                justifyContent: 'space-between'
                }} >
                
                <div>
                    <label style={{
                        borderRadius: '0.3em',
                        paddingLeft: '0.3em',
                        paddingRight: '0.3em',
                        paddingTop: '0.1em',
                        paddingBottom: '0.1em',
                        backgroundColor: 'green'
                        }} 
                        htmlFor="">
                        IF
                    </label>
                </div>
                    
                <div style={{
                        width: "85%"
                    }}>
                        <DynamicHeightInput  
                        arrVarName={''}
                        setArrVarName={()=>{}}
                        indexElement={1}
                        positionCursor={new PositionCursor(0,0)} 
                        setPositionCursor={()=>{}}  />
                </div>
                
            </div>
            <div style={{
                margin: '0.4em',
                display: 'flex',
                justifyContent: 'space-between'
            }} >
                
                <div>
                    <label style={{
                        borderRadius: '0.3em',
                        paddingLeft: '0.3em',
                        paddingRight: '0.3em',
                        paddingTop: '0.1em',
                        paddingBottom: '0.1em',
                        backgroundColor: 'green'
                        }} 
                        htmlFor="">
                        THEN
                    </label>
                </div>
                    
                <div style={{
                        width: "85%"
                    }}>
                        <DynamicHeightInput 
                        indexElement={1} 
                        arrVarName={''}
                        setArrVarName={()=>{}}

                        positionCursor={new PositionCursor(0,0)} 
                        setPositionCursor={()=>{}}  />
                        <div>
                            {NestedComponentThen ? < NestedComponentThen /> : null}
                        </div>
                </div>
                
            </div>
            <div style={{
                margin: '0.4em',
                display: 'flex',
                justifyContent: 'space-between'
            }} >
                
                <div>
                    <label style={{
                        borderRadius: '0.3em',
                        paddingLeft: '0.3em',
                        paddingRight: '0.3em',
                        paddingTop: '0.1em',
                        paddingBottom: '0.1em',
                        backgroundColor: 'green'
                        }} 
                        htmlFor="">
                        ELSE
                    </label>
                </div>
                    
                <div style={{
                        width: "85%"
                    }}>
                        <DynamicHeightInput
                        arrVarName={''}
                        indexElement={1}  
                        setArrVarName={()=>{}}

                        positionCursor={new PositionCursor(0,0)} 
                        setPositionCursor={()=>{}}  />
                        <div>
                            {NestedComponentElse ? < NestedComponentElse /> : null}
                        </div>
                </div>
                
            </div>
           
        </div>
    )
}