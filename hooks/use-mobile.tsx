// Este hook comprueba si la ventana gráfica actual es de tamaño móvil.
import * as React from "react"


// Define el ancho máximo para dispositivos móviles (768px) y el ancho mínimo para dispositivos tablet (992px).
const MOBILE_BREAKPOINT = 768


// Este hook devuelve un booleano que indica si la vista actual es de tamaño móvil.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}