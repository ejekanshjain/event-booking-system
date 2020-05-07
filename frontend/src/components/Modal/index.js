import React from 'react'

import './style.css'

const Modal = props => (
    <div className="modal">
        <header className="modal-header">{props.title}</header>
        <section className="modal-content">
            {props.children}
        </section>
        <section className="modal-actions">
            {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
            {props.canConfirm && <button className="btn" onClick={props.onConfirm}>{props.confirmText ? props.confirmText : 'Confirm'}</button>}
        </section>
    </div>
)

export default Modal