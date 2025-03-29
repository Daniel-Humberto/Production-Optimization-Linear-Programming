"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores de renderizado en servidor (SSR)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, // Muestra un loader mientras se carga el gráfico
})


// Definir las propiedades esperadas del componente
interface CostOptimizationChartProps {
  timeframe: string
  product: string
  optimizationFactor: number
}


// Definir el componente
export default function CostOptimizationChart({ timeframe, product, optimizationFactor }: CostOptimizationChartProps) {
  const [data, setData] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({})
  const [loading, setLoading] = useState(true)


  // Ejecutar esta función al montar el componente
  useEffect(() => {
    // Función para generar datos de optimización de costos
    const generateData = () => {
      setLoading(true)


      // Definir productos y recursos
      const products = product === "all" ? ["DRAM", "SDRAM", "Flash", "SSD"] : [product.toUpperCase()]
      const resources = ["Silicio", "Mano de obra", "Energía", "Equipamiento", "Logística"]


      // Matriz para almacenar los costos
      const costMatrix: number[][] = []
      const zMin = 10 // Costo mínimo
      const zMax = 100 // Costo máximo


      // Generar matriz de costos para cada producto y recurso
      products.forEach((_, i) => {
        const row: number[] = []
        resources.forEach((_, j) => {
          let baseCost = zMin + Math.random() * (zMax - zMin) // Generar costo aleatorio
          baseCost = baseCost * (1 - (1 - optimizationFactor) * 0.3) // Aplicar factor de optimización
          row.push(Math.round(baseCost)) // Redondear costo
        })
        costMatrix.push(row)
      })


      // Configurar los datos del heatmap
      setData([
        {
          z: costMatrix,
          x: resources,
          y: products,
          type: "heatmap",
          colorscale: "Viridis",
          showscale: true,
          colorbar: {
            title: "Costo por unidad",
            titleside: "right",
          },
          hovertemplate: "Producto: %{y}<br>Recurso: %{x}<br>Costo: $%{z}<br><extra></extra>",
        },
      ])


      // Configurar el diseño del gráfico
      setLayout({
        autosize: true,
        margin: { l: 100, r: 50, b: 100, t: 30, pad: 4 },
        paper_bgcolor: "rgba(0,0,0,0)", // Fondo transparente
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        xaxis: {
          title: "Recursos",
          gridcolor: "rgba(255, 255, 255, 0.1)",
        },
        yaxis: {
          title: "Productos",
          gridcolor: "rgba(255, 255, 255, 0.1)",
        },
        annotations: products.flatMap((prod, i) =>
          resources.map((res, j) => ({
            x: res,
            y: prod,
            text: `$${costMatrix[i][j]}`, // Mostrar costo en cada celda
            showarrow: false,
            font: {
              color: costMatrix[i][j] > (zMax - zMin) / 2 + zMin ? "white" : "black", // Ajustar color del texto según el costo
            },
          }))
        ),
      })

      setLoading(false)
    }

    generateData()
  }, [timeframe, product, optimizationFactor]) // Ejecutar cuando cambien estos valores


  // Mostrar loader mientras se generan los datos
  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  // Renderizar el gráfico con los datos y el diseño configurado
  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}