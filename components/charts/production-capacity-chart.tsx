"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores de SSR
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, // Placeholder mientras carga
})


// Definir propiedades del componente
interface ProductionCapacityChartProps {
  timeframe: string
  product: string
  optimizationFactor: number
}


// Definir el componente
export default function ProductionCapacityChart({
  timeframe,
  product,
  optimizationFactor,
}: ProductionCapacityChartProps) {
  const [data, setData] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Ejecutar esta función al montar el componente
  useEffect(() => {

    // Función para generar los datos del gráfico
    const generateData = () => {
      setLoading(true)

      // Definir etiquetas del eje X según el periodo seleccionado
      let xValues: string[] = []
      const currentYear = new Date().getFullYear()

      if (timeframe === "weekly") {
        xValues = Array.from({ length: 12 }, (_, i) => `Semana ${i + 1}`)
      } else if (timeframe === "monthly") {
        xValues = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      } else if (timeframe === "quarterly") {
        xValues = ["Q1", "Q2", "Q3", "Q4"]
      } else if (timeframe === "yearly") {
        xValues = Array.from({ length: 5 }, (_, i) => `${currentYear + i}`)
      }

      // Definir los productos a mostrar
      const products = product === "all" ? ["DRAM", "SDRAM", "Flash", "SSD"] : [product.toUpperCase()]

      // Colores asociados a cada producto
      const colors = {
        DRAM: "#4C9AFF",
        SDRAM: "#6554C0",
        Flash: "#00B8D9",
        SSD: "#36B37E",
      }

      // Generar datos de capacidad actual por producto
      const currentCapacity = products.map((prod) => {
        const baseCapacity = prod === "DRAM" ? 900 : prod === "SDRAM" ? 700 : prod === "Flash" ? 1100 : 500

        return {
          x: xValues,
          y: xValues.map((_, i) => {
            // Variación basada en el factor de optimización y estacionalidad
            const optimizationBoost = optimizationFactor * 200
            const seasonality = Math.sin((i / (xValues.length / 2)) * Math.PI) * 50
            return Math.round(baseCapacity + optimizationBoost + seasonality)
          }),
          type: "bar",
          name: `${prod} (Actual)`,
          marker: { color: colors[prod as keyof typeof colors] },
        }
      })

      // Generar datos de capacidad máxima (línea de referencia)
      const maxCapacity = products.map((prod) => {
        const baseMaxCapacity = prod === "DRAM" ? 1200 : prod === "SDRAM" ? 1000 : prod === "Flash" ? 1400 : 800

        return {
          x: xValues,
          y: xValues.map(() => baseMaxCapacity),
          type: "scatter",
          mode: "lines",
          name: `${prod} (Máx)`,
          line: { color: colors[prod as keyof typeof colors], width: 2, dash: "dot" },
        }
      })

      // Configurar los datos y el diseño del gráfico
      setData([...currentCapacity, ...maxCapacity])
      setLayout({
        autosize: true,
        barmode: "group", // Agrupar barras
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
  }, [timeframe, product, optimizationFactor])


  // Mostrar un loader mientras se cargan los datos
  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  // Renderizar el gráfico con los datos generados
  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}