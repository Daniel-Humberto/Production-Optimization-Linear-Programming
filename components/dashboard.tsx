"use client"


// Importaciones de React y componentes de UI
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"


// Importaciones de componentes de gráficos personalizados
import DemandForecastChart from "@/components/charts/demand-forecast-chart"
import ProductionCapacityChart from "@/components/charts/production-capacity-chart"
import CostOptimizationChart from "@/components/charts/cost-optimization-chart"
import ProductionVsDemandChart from "@/components/charts/production-vs-demand-chart"
import ProductDistributionChart from "@/components/charts/product-distribution-chart"
import OptimizationSurfaceChart from "@/components/charts/optimization-surface-chart"


// Importaciones de componentes de UI adicionales
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// Importaciones de datos de ejemplo. Estados para gestionar la configuración del dashboard
export default function Dashboard() {
    const { theme, setTheme } = useTheme() // Control del tema (oscuro/claro)
    const [timeframe, setTimeframe] = useState("monthly") // Período de tiempo de los datos
    const [optimizationFactor, setOptimizationFactor] = useState([0.5]) // Factor de optimización
    const [selectedProduct, setSelectedProduct] = useState("all") // Producto seleccionado


// Estados para gestionar los gráficos y la carga de datos
    return (
        <div className="min-h-screen bg-background">


                {/* Encabezado con título y botón de cambio de tema */}
            <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <h1 className="text-xl font-bold">Dashboard de Optimización de Semiconductores</h1>
                    <div className="flex items-center gap-4">

                            {/* Botón para cambiar entre tema oscuro y claro */}
                        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            <span className="sr-only">Cambiar tema</span>
                        </Button>

                    </div>
                </div>
            </header>


                {/* Sección de controles de configuración */}
            <main className="container py-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">


                        {/* Selector de período de tiempo */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Período de Tiempo</CardTitle>
                            <CardDescription>Selecciona el período para los datos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={timeframe} onValueChange={setTimeframe}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensual</SelectItem>
                                    <SelectItem value="quarterly">Trimestral</SelectItem>
                                    <SelectItem value="yearly">Anual</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>


                        {/* Selector de Factor de Optimización */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Factor de Optimización</CardTitle>
                            <CardDescription>Ajusta el balance entre costo y producción</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Slider value={optimizationFactor} min={0} max={1} step={0.01} onValueChange={setOptimizationFactor} />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Priorizar Costo</span>
                                    <span>{Math.round(optimizationFactor[0] * 100)}%</span>
                                    <span>Priorizar Producción</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                        {/* Selector del tipo de Producto */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Producto</CardTitle>
                            <CardDescription>Filtra por tipo de producto</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="dram">DRAM</SelectItem>
                                    <SelectItem value="sdram">SDRAM</SelectItem>
                                    <SelectItem value="flash">Memoria Flash</SelectItem>
                                    <SelectItem value="ssd">SSD</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>



                    {/* Pestañas de navegación del dashboard */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="demand">Demanda</TabsTrigger>
                        <TabsTrigger value="production">Producción</TabsTrigger>
                        <TabsTrigger value="costs">Costos</TabsTrigger>
                        <TabsTrigger value="optimization">Optimización</TabsTrigger>
                        <TabsTrigger value="distribution">Distribución</TabsTrigger>
                    </TabsList>


                        {/* Contenido de cada pestaña */}
                    <TabsContent value="overview" className="space-y-4">


                            {/* Pronóstico de Demanda vs. Capacidad de Producción de la pestaña resumen */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Pronóstico de Demanda vs. Capacidad de Producción</CardTitle>
                                    <CardDescription>
                                        Comparación entre la demanda proyectada y la capacidad de producción actual
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ProductionVsDemandChart timeframe={timeframe} product={selectedProduct} />
                                </CardContent>
                            </Card>


                                {/* Distribución de Productos de la pestaña resumen */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribución de Productos</CardTitle>
                                    <CardDescription>Distribución óptima de producción por tipo de producto</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ProductDistributionChart optimizationFactor={optimizationFactor[0]} />
                                </CardContent>
                            </Card>


                                {/* Superficie de Optimización de la pestaña resumen */}
                            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Superficie de Optimización</CardTitle>
                                    <CardDescription>
                                        Visualización 3D del espacio de solución para la optimización de producción
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <OptimizationSurfaceChart optimizationFactor={optimizationFactor[0]} product={selectedProduct} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>


                        {/* Pronóstico de Demanda de la pestaña Demanda */}
                    <TabsContent value="demand" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pronóstico de Demanda</CardTitle>
                                <CardDescription>Proyección de demanda para los próximos períodos</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <DemandForecastChart timeframe={timeframe} product={selectedProduct} />
                            </CardContent>
                        </Card>
                    </TabsContent>


                        {/* Capacidad de Producción de la pestaña Producción */}
                    <TabsContent value="production" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Capacidad de Producción</CardTitle>
                                <CardDescription>Análisis de la capacidad de producción por tipo de producto</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <ProductionCapacityChart
                                    timeframe={timeframe}
                                    product={selectedProduct}
                                    optimizationFactor={optimizationFactor[0]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>


                        {/* Optimización de Costos de la pestaña Costos */}
                    <TabsContent value="costs" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Optimización de Costos</CardTitle>
                                <CardDescription>Mapa de calor de costos por unidad de producción</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <CostOptimizationChart
                                    timeframe={timeframe}
                                    product={selectedProduct}
                                    optimizationFactor={optimizationFactor[0]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>


                        {/* Superficie de Optimización de la pestaña Optimización */}
                    <TabsContent value="optimization" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Superficie de Optimización</CardTitle>
                                <CardDescription>
                                    Visualización 3D del espacio de solución para la optimización de producción
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[600px]">
                                <OptimizationSurfaceChart optimizationFactor={optimizationFactor[0]} product={selectedProduct} />
                            </CardContent>
                        </Card>
                    </TabsContent>


                        {/* Distribución de Productos de la pestaña Distribución */}
                    <TabsContent value="distribution" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribución de Productos</CardTitle>
                                <CardDescription>Distribución óptima de producción por tipo de producto</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <ProductDistributionChart optimizationFactor={optimizationFactor[0]} />
                            </CardContent>
                        </Card>
                    </TabsContent>



                </Tabs>
            </main>
        </div>
    )
}