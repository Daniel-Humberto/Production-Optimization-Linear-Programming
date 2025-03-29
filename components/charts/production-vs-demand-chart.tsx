"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores en renderizado del lado del servidor (SSR)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, // Mostrar un esqueleto de carga mientras se carga Plotly
})


// Definir las propiedades esperadas en el componente para representar la producción vs demanda
interface ProductionVsDemandChartProps {
  timeframe: string // Período de tiempo seleccionado
  product: string  // Producto seleccionado
}


// Definir el componente para representar la producción vs demanda, utilizando Plotly.js
export default function ProductionVsDemandChart({ timeframe, product }: ProductionVsDemandChartProps) {
  const [data, setData] = useState<any[]>([]) // Estado para almacenar los datos del gráfico
  const [layout, setLayout] = useState<any>({}) // Estado para la configuración del diseño del gráfico
  const [loading, setLoading] = useState(true) // Estado para indicar si los datos están cargando

  // Ejecutar esta función al montar el componente
  useEffect(() => {
    
    // Función para generar datos simulados de producción y demanda
    const generateData = () => {
      setLoading(true) // Iniciar la carga

      // Generar valores aleatorios para producción y demanda
      let xValues: string[] = [] // Valores del eje X (tiempo)
      const currentYear = new Date().getFullYear()

      // Determinar los valores del eje X según el período seleccionado
      if (timeframe === "weekly") {
        xValues = Array.from({ length: 12 }, (_, i) => `Semana ${i + 1}`)
      } else if (timeframe === "monthly") {
        xValues = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      } else if (timeframe === "quarterly") {
        xValues = ["Q1", "Q2", "Q3", "Q4"]
      } else if (timeframe === "yearly") {
        xValues = Array.from({ length: 5 }, (_, i) => `${currentYear + i}`)
      }

      // Determinar los productos a mostrar
      const products = product === "all" ? ["DRAM", "SDRAM", "Flash", "SSD"] : [product.toUpperCase()]

      // Definir colores para cada producto
      const colors = {
        DRAM: "#4C9AFF",
        SDRAM: "#6554C0",
        Flash: "#00B8D9",
        SSD: "#36B37E",
      }

      const traces: any[] = [] // Almacenar las trazas del gráfico

      // Generar datos para cada producto seleccionado
      products.forEach((prod) => {
        
        // Definir valores base de producción y demanda según el producto
        const baseProduction = prod === "DRAM" ? 900 : prod === "SDRAM" ? 700 : prod === "Flash" ? 1100 : 500
        const baseDemand = prod === "DRAM" ? 1000 : prod === "SDRAM" ? 800 : prod === "Flash" ? 1200 : 600

        // Crear datos de producción con una variación estacional
        const productionData = xValues.map((_, i) => {
          const seasonality = Math.sin((i / (xValues.length / 2)) * Math.PI) * 50
          return Math.round(baseProduction + seasonality)
        })

        // Crear datos de demanda con tendencia y variabilidad
        const demandData = xValues.map((_, i) => {
          const trend = i * (baseDemand * 0.02) // Tendencia creciente
          const seasonality = Math.sin((i / (xValues.length / 2)) * Math.PI) * (baseDemand * 0.1)
          const noise = (Math.random() - 0.5) * (baseDemand * 0.1) // Ruido aleatorio
          return Math.max(0, Math.round(baseDemand + trend + seasonality + noise))
        })

        // Agregar trazas de producción al gráfico
        traces.push({
          x: xValues,
          y: productionData,
          type: "scatter",
          mode: "lines+markers",
          name: `${prod} (Producción)`,
          line: {
            color: colors[prod as keyof typeof colors],
            width: 3,
          },
          marker: {
            size: 8,
          },
        })

        // Agregar trazas de demanda al gráfico
        traces.push({
          x: xValues,
          y: demandData,
          type: "scatter",
          mode: "lines+markers",
          name: `${prod} (Demanda)`,
          line: {
            color: colors[prod as keyof typeof colors],
            width: 3,
            dash: "dash",
          },
          marker: {
            size: 8,
            symbol: "circle-open",
          },
        })

        // Calcular y agregar trazas de déficit (diferencia entre demanda y producción)
        const deficitData = xValues.map((_, i) => {
          return Math.max(0, demandData[i] - productionData[i])
        })

        // Agregar trazas de déficit al gráfico (barras)
        traces.push({
          x: xValues,
          y: deficitData,
          type: "bar",
          name: `${prod} (Déficit)`,
          marker: {
            color: colors[prod as keyof typeof colors],
            opacity: 0.3,
          },
          hovertemplate: "Déficit: %{y}<extra></extra>",
        })
      })

      // Guardar los datos generados en el estado
      setData(traces)

      // Configurar el diseño del gráfico
      setLayout({
        autosize: true,
        barmode: "stack",
        margin: { l: 50, r: 50, b: 50, t: 30, pad: 4 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        xaxis: {
          title: "Período",
          gridcolor: "rgba(255, 255, 255, 0.1)",
        },
        yaxis: {
          title: "Unidades (miles)",
          gridcolor: "rgba(255, 255, 255, 0.1)",
        },
        legend: {
          orientation: "h",
          y: -0.2,
        },
        hovermode: "closest",
      })

      setLoading(false) // Finalizar la carga
    }

    generateData()
  }, [timeframe, product]) // Ejecutar el efecto cuando cambie el período o producto seleccionado


  // Mostrar un esqueleto de carga si los datos aún se están generando
  if (loading) {
    return <Skeleton className="h-full w-full" /> // Mostrar esqueleto de carga mientras se generan los datos
  }

  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}