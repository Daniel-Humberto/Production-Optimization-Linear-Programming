"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores en SSR (Server-Side Rendering)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, 
})


// Definir las propiedades esperadas en el componente
interface DemandForecastChartProps {
  timeframe: string // Período de tiempo seleccionado (weekly, monthly, quarterly, yearly)
  product: string // Producto seleccionado o 'all' para todos
}


// Definir el componente
export default function DemandForecastChart({ timeframe, product }: DemandForecastChartProps) {
  const [data, setData] = useState<any[]>([]) // Estado para los datos del gráfico
  const [layout, setLayout] = useState<any>({}) // Estado para la configuración del gráfico
  const [loading, setLoading] = useState(true) // Estado para indicar carga


  // Ejecutar esta función al montar el componente
  useEffect(() => {
    // Función para generar datos simulados
    const generateData = () => {
      setLoading(true)

      // Definir etiquetas del eje X según el período de tiempo seleccionado
      let xValues: string[] = []
      const currentYear = new Date().getFullYear()

      // Configuración del eje X según el período de tiempo seleccionado
      if (timeframe === "weekly") {
        xValues = Array.from({ length: 52 }, (_, i) => `Semana ${i + 1}`)
      } else if (timeframe === "monthly") {
        xValues = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      } else if (timeframe === "quarterly") {
        xValues = ["Q1", "Q2", "Q3", "Q4"]
      } else if (timeframe === "yearly") {
        xValues = Array.from({ length: 5 }, (_, i) => `${currentYear + i}`)
      }

      // Definir los productos a graficar
      const products = product === "all" ? ["DRAM", "SDRAM", "Flash", "SSD"] : [product.toUpperCase()]
      
      // Generación de datos de demanda con tendencia, estacionalidad y ruido aleatorio
      const traces = products.map((prod) => {
        
        // Valores base para cada producto
        const baseValue = prod === "DRAM" ? 1000 : prod === "SDRAM" ? 800 : prod === "Flash" ? 1200 : 600
        
        // Generación de valores de demanda con tendencia, estacionalidad y ruido aleatorio
        const yValues = xValues.map((_, i) => {
          const trend = i * (baseValue * 0.05) // Tendencia de crecimiento
          const seasonality = Math.sin((i / (xValues.length / 2)) * Math.PI) * (baseValue * 0.1) // Variación estacional
          const noise = (Math.random() - 0.5) * (baseValue * 0.2) // Variabilidad aleatoria
          return Math.max(0, baseValue + trend + seasonality + noise) // Evitar valores negativos
        })
        
        // Retornar los valores de demanda para el producto actual
        return {
          x: xValues,
          y: yValues,
          type: "scatter",
          mode: "lines+markers",
          name: prod,
          line: { width: 3 },
        }
      })
      
      // Actualizar los datos y la configuración del gráfico al generar los datos simulados
      setData(traces)

      // Configuración del diseño del gráfico
      setLayout({
        autosize: true,
        margin: { l: 50, r: 50, b: 50, t: 30, pad: 4 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "rgba(255, 255, 255, 0.8)" },
        xaxis: { title: "Período", gridcolor: "rgba(255, 255, 255, 0.1)" },
        yaxis: { title: "Unidades (miles)", gridcolor: "rgba(255, 255, 255, 0.1)" },
        legend: { orientation: "h", y: -0.2 },
        hovermode: "closest",
      })

      setLoading(false)
    }

    generateData()
  }, [timeframe, product])


  // Mostrar un esqueleto de carga si los datos aún no están listos
  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  // Renderizar el gráfico con los datos y el diseño configur
  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}