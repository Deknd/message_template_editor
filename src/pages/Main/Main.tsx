import React, { useState } from 'react';
import style from "./main.module.css"
import { MessageTemplateEditor } from '../../widgets';

export const Main = () => {
  const [widgetActive, setWidgetActive] = useState(false);

  const activateWidget = () => {
    setWidgetActive(!widgetActive);
  };
  return (
    <div>
      <button className={style.button} onClick={activateWidget} >Message Editor</button>
      <div style={{
        position: 'fixed',
        top: '0',
        bottom: '0',
        right: widgetActive ?  '0%' : '-100%',
        width: '85%',
        height: '100%',
        transition: 'right 1s ease'

      }}  >
         <MessageTemplateEditor/>
      </div>
    </div>
  );
};
