/**
 * Cualquier otra ruta vacía el slot. Sin esto, al navegar desde el modal a otra
 * página el modal seguiría visible (así funcionan los parallel routes).
 */
export default function ModalCatchAll() {
  return null;
}
