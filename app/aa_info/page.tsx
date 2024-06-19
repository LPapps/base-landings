import css from "./styles.module.css";

export default function Informacion() {
  return (
    <div id="informacion" className={css.total}>
      <div className={css.card2}>
        <h2>COSTOS DEL SERVICIO</h2>
        <p>Los costos de una web simple son (en pesos argentinos y dólares):</p>
        <ul>
          <li>Construcción: $25000 o $25</li>
          <li>Compras necesarias: $25000 o $25</li>
          <li>Mantenimiento por mes: $5000 o $5</li>
        </ul>
        <p>TOTAL: $50000 o $50</p>
        <h3>Estos costos incluyen</h3>
        <p>El diseño y programación de tu web, la compra del dominio (por un año) y servicio de hosting.</p>
        <p>Un panel de administrador donde podés gestionar los formularios que te envían.</p>
        <p><b>Los datos del formulario están cifrados y cuentan con protocolos de seguridad, la información está encriptada.</b></p>
        <p>Es necesario que tengas un nombre pensado para tu dominio (puede ser tu nombre o el de tu emprendimiento) y preferentemente un logo.</p>
        <p>Esto es relativo al tipo de web.</p>
      </div>
    </div>
  );
}
