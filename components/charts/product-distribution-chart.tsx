"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores de SSR
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, 
})


// Definir propiedades del componente
interface ProductDistributionChartProps {
  optimizationFactor: number
}


// Definir el componente
export default function ProductDistributionChart({ optimizationFactor }: ProductDistributionChartProps) {
  const [data, setData] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Ejecutar esta función al montar el componente
  useEffect(() => {

    // Generar datos para la distribución de productos
    const generateData = () => {
      setLoading(true)

      // Lista de productos
      const products = ["DRAM", "SDRAM", "Flash", "SSD"]

      // Colores asignados a cada producto
      const colors = {
        DRAM: "#4C9AFF",
        SDRAM: "#6554C0",
        Flash: "#00B8D9",
        SSD: "#36B37E",
      }

      // Asignar valores de distribución según el factor de optimización
      let values: number[] = []
      if (optimizationFactor < 0.3) {
        values = [40, 25, 20, 15] // Distribución desigual
      } else if (optimizationFactor < 0.7) {
        values = [35, 25, 25, 15] // Distribución intermedia
      } else {
        values = [30, 25, 25, 20] // Distribución óptima
      }

      // Agregar variación aleatoria
      values = values.map((v) => Math.max(5, v + (Math.random() - 0.5) * 5))

      // Normalizar valores para que sumen 100%
      const sum = values.reduce((a, b) => a + b, 0)
      values = values.map((v) => (v / sum) * 100)

      // Crear gráfico de pastel
      setData([
        {
          values: values,
          labels: products,
          type: "pie",
          textinfo: "label+percent",
          textposition: "inside",
          automargin: true,
          marker: {
            colors: products.map((p) => colors[p as keyof typeof colors]),
          },
          hoverinfo: "label+percent+value",
          hole: 0.4, // Hacerlo tipo gráfico de dona
        },
      ])

      // Configuración del diseño del gráfico
      setLayout({
        autosize: true,
        showlegend: false,
        margin: { l: 20, r: 20, b: 20, t: 20, pad: 0 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        annotations: [
          {
            font: {
              size: 14,
              color: "rgba(255, 255, 255, 0.8)",
            },
            showarrow: false,
            text: "Distribución<br>Óptima",
            x: 0.5,
            y: 0.5,
          },
        ],
      })

      setLoading(false)
    }

    generateData()
  }, [optimizationFactor])


  // Mostrar carga mientras se generan los datos
  if (loading) {
    return <Skeleton className="h-full w-full" />
  }


  // Renderizar el gráfico de Plotly
  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}