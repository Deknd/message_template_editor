import React, { useEffect, useState } from "react";

interface ArrVarNameProps{
   
    setArrVarName: (varNames: string | null) => void,
}

export const ArrVarName: React.FC<ArrVarNameProps> = ({setArrVarName}) => {
const [ arrayCod ] = useState<Array<string>>([])

useEffect(() => {
    const storedArrVarNames = localStorage.getItem("arrVarNames");
    if(arrayCod.length === 0)
    if (storedArrVarNames) {
        let resultArray: Array<string>
        resultArray = JSON.parse(storedArrVarNames);
        arrayCod.push(...resultArray);
      
    } else {
        arrayCod.push(...['firstname', 'lastname', 'company', 'position']);
        
    }
  
  }, []);
  
    return(
        <div>
            {arrayCod.map((item, index) => (
                <span style={{margin: '0.5em'}} key={index}>
                    <button onClick={()=>{setArrVarName(`{${item}}`)}}>
                        {`{${item}}`}
                    </button>        
                </span>
            ))}
        </div>
    )
}