import React, { Component } from "react";
export default function Model(props) {
  return (
    <div className="backshadow">
      <div className="custon-model">
        <div className="delete-icon" onClick={() => props.setModel(false)}>
            X
        </div>
        {
            props.resuma !=null&&(
                
                <embed type="application/pdf" src={props.resuma} className="pdf" />
            )
        }
        
      </div>
    </div>
  );
}
