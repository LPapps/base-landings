import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

    type Login = {
      user: string,
      password: string
    }
    type Backend = {
      id: string,
      hash: string
    }
const nombre = z.string().min(3, {message : "nombre incorrecto"});
const apellido = z.string().min(3, {message : "apellido incorrecto"});
const telefono = z.string().min(9, {message : "telefono incorrecto"});
const consulta = z.string().min(5, {message : "consulta incorrecta"});

export async function POST( req: NextRequest ) {
    const { evento, data, token, id } = await req.json();
    // ------------------------------------------------------------------
    // CRIPTOGRAFIA
    // ------------------------------------------------------------------
    const cr = new Cryptr(`${process.env.HASH}`);
    // ------------------------------------------------------------------
    // SOLICITUD AL BACKEND
    // ------------------------------------------------------------------
    async function enviarDatos (evento: string, hash: string) {
      try {
        const url = `${process.env.APIURL}/api/${evento}`
        const r = await fetch(url, {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({ hash }),
        });
        const rta = await r.json();
        return rta;        
      } catch (error) {
        return { error: 'error en fetch'}
      }
    };
    // ------------------------------------------------------------------
    // FUNCIONES 
    // ------------------------------------------------------------------
    function encriptar (obj : object ) {
      const hash = cr.encrypt(JSON.stringify(obj));
      return hash;
    }
    function desencriptar (hash: string){
      const o = cr.decrypt(hash);
      return o;
    }
    function armarToken () {
      const crToken = new Cryptr(process.env.TOKEN || 'error_env')
      const cincoMinutos = new Date().getTime() + 300000
      const token = crToken.encrypt(cincoMinutos.toString());
      return token;
    }
    function login (data: Login) {
      const { user, password } = data;
      if(user === process.env.USER && password === process.env.PASSWORD){
        const token = armarToken();
        return token;
      } else {
        return false
      }
    }
    // ------------------------------------------------------------------
    // MANEJANDO EVENTOS
    // ------------------------------------------------------------------
    if(evento == 'login'){
      const token = login(data);
      if(token) return NextResponse.json({ token })
      return NextResponse.json({ error: 'credenciales incorrectas' })
    }
    if(evento == 'agregarFormulario'){
      try {
        nombre.parse(data.nombre);
        apellido.parse(data.apellido);
        telefono.parse(data.telefono);
        consulta.parse(data.consulta);  
      } catch (error : any) {
        return NextResponse.json({ e: true, componente: JSON.parse(error.message)[0].message})
      }
      
      const o = {
        evento,
        formulario: data,
        web: process.env.WEB
      };
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true })
      if(rta.g) return NextResponse.json({ g: true });
    }
    if(evento == 'checkearPapelera'){
      const o = {
        evento,
        token,
        web: process.env.WEB
      };
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true });
      if(rta.h){
        const arrayDesencriptado = JSON.parse(desencriptar(rta.h));
        const itemsLegibles = arrayDesencriptado.map(( item: string ) => {
        const formDesencriptado = JSON.parse(desencriptar(item));
        return formDesencriptado;
      });
      return NextResponse.json({ p: itemsLegibles});
      }
    }
    if(evento == 'pedirFormularios'){
      const o = {
        evento,
        token,
        web: process.env.WEB
      }
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true });
      if(rta.h){
      const arrayDesencriptado = JSON.parse(desencriptar(rta.h));
      const itemsLegibles = arrayDesencriptado.map(( item: Backend ) => {
        const formDesencriptado = desencriptar(item.hash);
        return ({ id: item.id, form: JSON.parse(formDesencriptado) })
      });
      return NextResponse.json({ d: itemsLegibles });}
    }
    if(evento == 'eliminarFormulario'){
      const o = {
        evento,
        token,
        id,
        web: process.env.WEB
      }
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true })
      if(rta.x) return NextResponse.json({ x: true });
    }
    if(evento == 'check'){
      if(!token) return NextResponse.json({e: 'token error'});

      const o = { evento, token, web: process.env.WEB };
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true });
      return NextResponse.json({ estado: rta.estado });
    }
    if(evento == 'antiSleep'){
      const o = { evento, token, web: process.env.WEB, url: process.env.WEBURL };
      const hash = encriptar(o);
      const rta = await enviarDatos(evento, hash);
      if(rta.e) return NextResponse.json({ e: true });
      if(rta.a) return NextResponse.json({ a: true });
      return NextResponse.json({ a: false });
    }
  // respuesta default si no se cumpe ninguna condicion
  return NextResponse.json({ r: true });
}
export async function GET( req: NextRequest ) {
    return NextResponse.json({200:200});
}