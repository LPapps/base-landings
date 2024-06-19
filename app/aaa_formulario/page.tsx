'use client';
import { useState } from "react";
import css from "./styles.module.css";



export default function Formulario() {

  const [state, setState] = useState('Enviar Formulario');
  const [disabled, setDisabled] = useState(false);

  function boton(form:FormData){
    setDisabled(true);
    setState('Checkeando inputs');
    enviarForm(form);
  }

  const enviarForm = async (form: FormData) => {

    const data = {
      nombre : form.get("nombre")?.toString(),
      apellido : form.get("apellido")?.toString(),
      telefono : form.get("telefono")?.toString(),
      consulta : form.get("consulta")?.toString()
    };
    const r = await fetch("/api", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({evento: 'agregarFormulario', data}),
    });
    const rt = await r.json();
    if(rt.g)setState('Enviado con éxito!')
    if(rt.e){
      setDisabled(false);
      setState(`Error: ${rt.componente}`)}   
  };
  return (
    <div id="formulario" className={css.total}>
      <form action={boton} className={css.form}>
        <h2>CONTACTO</h2>
        <p>Nombre</p>
        <input type="text" name="nombre" />
        <p>Apellido</p>
        <input type="text" name="apellido" />
        <p>Teléfono</p>
        <input type="number" name="telefono" />
        <p>Consulta</p>
        <textarea name="consulta" />
        <input disabled={disabled} type="submit" value={state}/>
      </form>
    </div>
  );
}
