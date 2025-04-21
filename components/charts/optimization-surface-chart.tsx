"use client"


// Importaciones de React y componentes de UI
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"


// Importar Plotly dinámicamente para evitar errores en SSR (Server-Side Rendering)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />, // Placeholder mientras se carga
})


// Definir las propiedades esperadas en el componente
interface OptimizationSurfaceChartProps {
  optimizationFactor: number
  product: string
}


// Definir el componente
export default function OptimizationSurfaceChart({ optimizationFactor, product }: OptimizationSurfaceChartProps) {
  const [data, setData] = useState<any[]>([]) // Estado para los datos del gráfico
  const [layout, setLayout] = useState<any>({}) // Estado para la configuración del gráfico
  const [loading, setLoading] = useState(true) // Estado de carga

  // Ejecutar esta función al montar el componente
  useEffect(() => {

    // Función para generar los datos de la superficie de optimización
    const generateData = () => {
      setLoading(true)
      const n = 50 // Número de puntos en cada eje
      const prodMin = 500, prodMax = 1500 // Rango de producción
      const demandMin = 500, demandMax = 1500 // Rango de demanda

      // Generar valores para producción y demanda
      const production = Array.from({ length: n }, (_, i) => prodMin + (prodMax - prodMin) * (i / (n - 1)))
      const demand = Array.from({ length: n }, (_, i) => demandMin + (demandMax - demandMin) * (i / (n - 1)))

      // Matriz Z para almacenar los costos
      const z: number[][] = []

      // Calcular el costo total para cada combinación de producción y demand
      for (let i = 0; i < n; i++) {
        const row: number[] = []
        for (let j = 0; j < n; j++) {
          const prod = production[i]
          const dem = demand[j]
          const diff = Math.abs(prod - dem) // Diferencia entre producción y demanda
          const baseCost = prod * 0.5 // Costo base por unidad producida
          let penaltyCost = diff * 1.5 // Penalización por desajuste
          if (prod < dem) penaltyCost *= 2 // Mayor penalización por subproducción
          const optimizationDiscount = baseCost * optimizationFactor * 0.3 // Descuento por optimización
          const totalCost = baseCost + penaltyCost - optimizationDiscount // Costo total
          row.push(totalCost)
        }
        z.push(row)
      }

      // Encontrar el punto de menor costo
      let minCost = Number.POSITIVE_INFINITY, optimalI = 0, optimalJ = 0
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (z[i][j] < minCost) {
            minCost = z[i][j]
            optimalI = i
            optimalJ = j
          }
        }
      }

      // Configurar los datos del gráfico
      setData([
        {
          type: "surface",
          x: production,
          y: demand,
          z: z,
          colorscale: "Viridis",
          showscale: true,
          colorbar: { title: "Costo Total", titleside: "right" },
        },
        {
          type: "scatter3d",
          mode: "markers",
          x: [production[optimalI]],
          y: [demand[optimalJ]],
          z: [z[optimalI][optimalJ]],
          marker: { size: 8, color: "red" },
          name: "Punto Óptimo",
          text: [`Producción: ${Math.round(production[optimalI])}<br>Demanda: ${Math.round(demand[optimalJ])}<br>Costo: ${Math.round(z[optimalI][optimalJ])}`],
          hoverinfo: "text",
        },
      ])

      // Configurar el diseño del gráfico
      setLayout({
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 30, pad: 4 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "rgba(255, 255, 255, 0.8)" },
        scene: {
          xaxis: { title: "Producción (unidades)" },
          yaxis: { title: "Demanda (unidades)" },
          zaxis: { title: "Costo Total" },
          camera: { eye: { x: 1.5, y: 1.5, z: 1 } },
        },
        hovermode: "closest",
      })

      setLoading(false)
    }

    generateData()
  }, [optimizationFactor, product]) // Se ejecuta cuando cambian estos valores


  // Mostrar un loader mientras se generan los datos
  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  // Renderizar el gráfico 3D
  return <Plot data={data} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "100%" }} />
}