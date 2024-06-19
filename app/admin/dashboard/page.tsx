'use client'
import { useEffect, useState, useRef } from "react"
import { redirect } from "next/navigation"
import css from './page.module.css';
import Notificaciones from "../../componentes/notificaciones";
type FormData = {
    id: string,
    form: Form
}

type Form = {
    nombre: string,
    apellido: string,
    telefono: String,
    consulta: String
}

function Formulario ( { data, consulta } : { data: FormData, consulta: Function } ) {
    return <div className={css.formulario}>
        <p><b>NUEVA CONSULTA</b></p>
        <p>id: {data.id}</p>
        <p>nombre: {data.form.nombre}</p>
        <p>apellido: {data.form.apellido}</p>
        <p>tel: {data.form.telefono}</p>
        <p>consulta: {data.form.consulta}</p>
        <button onClick={()=>consulta('eliminarFormulario', data.id)}> Eliminar </button>
    </div>
}
function Papelera ( { data } : { data: Form } ) {
    return <div className={css.formulario}>
        <p><b>ARCHIVO DE PAPELERA</b></p>
        <p>nombre: {data.nombre}</p>
        <p>apellido: {data.apellido}</p>
        <p>tel: {data.telefono}</p>
        <p>consulta: {data.consulta}</p>
    </div>
}
export default function Dashboard () {
    const [ token, setToken ] = useState('');
    const [ forms, setForms ] = useState([]);
    const [ papelera, setPapelera ] = useState([]);
    const [ state, setState ] = useState({model: 'not load', db: 'not load'});
    const [ viewData, setViewData ] = useState('');
    const [ notificacion, setNotificacion ] = useState('');
    const [ sidebar, setSidebar ] = useState(false);

    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        if(!token) redirect('/');
        setToken(token);
    },[]);
    useEffect(()=>{consulta('check')},[token]);
    const sb = useRef<any>(null);
    
    const Formularios = () => (<>{forms.map((data, index) => <Formulario key={ index } data={ data } consulta={ consulta }/>)}</>);
    const Papeleras = () => (<>{papelera.map((data, index) => <Papelera key={ index } data={ data } />)}</>);
    function notificar( notif: string){
        setNotificacion(notif);
        setTimeout(()=>setNotificacion(''),1900);
    }
    async function fullCheck(){
        let i = undefined;
        try {
        const test_forms = [
            {
                nombre: 'test1',
                apellido: 'test1',
                tel: '123123',
                salida: 'test1',
                destino: 'test1',
                fecha: '2000-02-20'
            },
            {
                nombre: 'test2',
                apellido: 'test2',
                tel: '123123',
                salida: 'test2',
                destino: 'test2',
                fecha: '2000-02-20'
            },
            {
                nombre: 'test3',
                apellido: 'test3',
                tel: '123123',
                salida: 'test3',
                destino: 'test3',
                fecha: '2000-02-20'
            },
            {
                nombre: 'test4',
                apellido: 'test4',
                tel: '123123',
                salida: 'test4',
                destino: 'test4',
                fecha: '2000-02-20'
            },
            {
                nombre: 'test5',
                apellido: 'test5',
                tel: '123123',
                salida: 'test5',
                destino: 'test5',
                fecha: '2000-02-20'
            }];
        console.log('agregando formularios...')
        i = 0;
        for(let x of test_forms){
            i++;
            const rta = await consulta('agregarFormulario', undefined, true, x);
            if(rta.g) console.log(`formulario ${i} correcto`);
        }
        console.log('pidiendo formularios...');
        const { d } = await consulta('pedirFormularios', undefined, true);
        console.log('formularios correctos');
        console.log(d);
        i = [];
        for(let x of d){
            console.log(x);
            if(x.form.tel == '123123') i.push(x.id)
        }
        console.log('eliminando formularios...')
        for(let id of i){
            const rta = await consulta('eliminarFormulario', id, true);
            if(rta.x) console.log(`${id} eliminado correcto` );
        }
        console.log('checkeando papelera de reciclaje...')
        const rta = await consulta('checkearPapelera', undefined, true);
        if(rta.p)console.log('papelera correcta: ')
        console.log(rta.p);
        console.log('----------------------');
        console.log('PRUEBAS CORRECTAS');
        console.log('----------------------');
        } catch (error) { console.log('ERROR EN PRUEBAS: '+error)}
    }
    async function consulta (evento: string, id?: string, t?: boolean, data?: object) {
        if(!token) return false;
        if(evento == 'pedirFormularios' && !t ) notificar('Pidiendo formularios...');
        if(evento == 'eliminarFormulario' && !t) notificar('Eliminando formulario...');
        if(evento == 'checkearPapelera' && !t) notificar('Checkeando papelera...');


        const res = await fetch('/api',{
            method: 'POST',
            headers: new Headers({'content-type':'application/json'}),
            body: JSON.stringify({ evento, token, id, data })
        })
        const rta = await res.json();

        if(rta.r) notificar('evento default, hubo algun error');
        // MANEJANDO EVENTOS DE LA RESPUESTA DEL BACKEND
        if(t){
            return rta;
        }
        if(evento == 'pedirFormularios'){
            if(rta.e) notificar('Error al pedir formularios');
            if(rta.d && rta.d.length < 1) {notificar('Sin Formularios :(')};
            setViewData('formularios');
            setForms(rta.d);
        }
        if(evento == 'eliminarFormulario'){
            if(rta.e) notificar('Error al eliminar formulario');
            if(rta.x) {
                const formus = forms;
                const updateInterfaz = formus.filter((data: FormData ) => data.id != id);
                setForms(updateInterfaz);
            }
        }
        if(evento == 'checkearPapelera'){
            if(rta.e) notificar('Error checkeando papelera');
            setViewData('papeleras');
            setPapelera(rta.p);
        }
        if(evento == 'check'){
            if(rta.e) notificar('Error checkeando los datos');
            if(rta.estado) setState(rta.estado);
        }
        if(evento == 'antiSleep'){
            if(rta.e) notificar('Error al añadir web al loop');
            if(rta.a) notificar('Web añadida al loop de ping');
            if(!rta.a) notificar('La web ya estaba en el loop de ping');
        }
    }
    function changeSideBar(){
        if(!sidebar){
        sb.current.style.width = '80%';
        } else {
        sb.current.style.width = '0';
        }
        setSidebar(!sidebar);
    }

    return <div className={css.total}>
        { token && <>
        { notificacion && <Notificaciones notificacion={ notificacion } />}
        <div className={css.nav}>
            <button onClick={changeSideBar}>≡</button>
        </div>
        <div ref={sb} className={css.comandos}>
            <h1>ADMIN</h1>
            <p>db: {state.db}</p>
            <p>md: {state.model}</p>
            <button onClick={()=>{consulta('pedirFormularios')}}> Formularios </button>
            <button onClick={()=>{consulta('checkearPapelera')}}> Papelera </button>
            <button onClick={()=>{consulta('antiSleep')}}> Anti Sleep </button>
            <button onClick={()=>{fullCheck()}}> Full check </button>
        </div>
        <div className={css.data}>
            {viewData == 'formularios' && forms != undefined ? <Formularios /> : viewData == 'papeleras' && papelera != undefined ? <Papeleras /> : 'Nada aun...'}
        </div>
        </>}
    </div>
}