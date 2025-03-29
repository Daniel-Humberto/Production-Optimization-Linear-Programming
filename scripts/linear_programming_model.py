# Importar librerías
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog


# Definir productos
products = ["DRAM", "SDRAM", "Flash", "SSD"]
n_products = len(products)


# Definir recursos
resources = ["Silicio", "Mano de obra", "Energía", "Equipamiento", "Logística"]
n_resources = len(resources)


# Parámetros del modelo
np.random.seed(42)  # Para reproducibilidad


# Beneficio por unidad de cada producto (en dólares)
profit_per_unit = np.array([15, 12, 18, 25])


# Demanda máxima de cada producto (en miles de unidades)
max_demand = np.array([1000, 800, 1200, 600])


# Matriz de uso de recursos por unidad de producto. Cada fila es un recurso, cada columna es un producto
resource_usage = np.array([
    [2.5, 2.0, 3.0, 4.0],  # Silicio
    [1.0, 0.8, 1.2, 1.5],  # Mano de obra
    [3.0, 2.5, 3.5, 4.5],  # Energía
    [0.5, 0.4, 0.6, 0.8],  # Equipamiento
    [0.2, 0.2, 0.3, 0.4]   # Logística
])


# Disponibilidad máxima de cada recurso
resource_capacity = np.array([5000, 2000, 7000, 1000, 500])


# Costos de producción por unidad (en dólares)
production_cost = np.array([10, 8, 12, 18])


# Función objetivo: maximizar beneficio (negativo para minimización)
c = -(profit_per_unit - production_cost)


# Restricciones de recursos (A_ub * x <= b_ub)
A_ub = resource_usage
b_ub = resource_capacity


# Restricciones de demanda máxima
A_demand = np.eye(n_products)
b_demand = max_demand


# Combinar todas las restricciones
A_ub_full = np.vstack([A_ub, A_demand])
b_ub_full = np.concatenate([b_ub, b_demand])


# Restricciones de no negatividad
bounds = [(0, None) for _ in range(n_products)]


# Resolver el problema de programación lineal
result = linprog(c, A_ub=A_ub_full, b_ub=b_ub_full, bounds=bounds, method="highs")




# Mostrar resultados
if result.success:


    # Obtener producción óptima e beneficio total
    optimal_production = result.x
    total_profit = -result.fun


    # Mostrar resultados de la solución óptima
    print("Solución óptima encontrada:")
    print("---------------------------")
    for i, prod in enumerate(products):
        print(f"{prod}: {optimal_production[i]:.2f} miles de unidades")
    print("\nBeneficio total: ${:.2f} millones".format(total_profit / 1000))


    # Calcular uso de recursos
    resource_utilization = resource_usage @ optimal_production
    resource_utilization_percent = resource_utilization / resource_capacity * 100


    # Mostrar resultados de la utilización de recursos
    print("\nUtilización de recursos:")
    print("------------------------")
    for i, res in enumerate(resources):
        print(f"{res}: {resource_utilization[i]:.2f} ({resource_utilization_percent[i]:.2f}%)")


    # Visualizar resultados
    plt.figure(figsize=(12, 8))


    # Gráfico de producción óptima
    plt.subplot(2, 2, 1)
    plt.bar(products, optimal_production, color='skyblue')
    plt.title('Producción Óptima (miles de unidades)')
    plt.xticks(rotation=45)
    plt.tight_layout()


    # Gráfico de utilización de recursos
    plt.subplot(2, 2, 2)
    plt.bar(resources, resource_utilization_percent, color='lightgreen')
    plt.axhline(y=100, color='r', linestyle='--')
    plt.title('Utilización de Recursos (%)')
    plt.xticks(rotation=45)
    plt.tight_layout()


    # Gráfico de beneficio por producto
    plt.subplot(2, 2, 3)
    product_profit = optimal_production * (profit_per_unit - production_cost)
    plt.pie(product_profit, labels=products, autopct='%1.1f%%', startangle=90)
    plt.title('Distribución del Beneficio por Producto')
    plt.tight_layout()


    # Gráfico de comparación con demanda máxima
    plt.subplot(2, 2, 4)
    x = np.arange(len(products))
    width = 0.35
    plt.bar(x - width/2, optimal_production, width, label='Producción Óptima')
    plt.bar(x + width/2, max_demand, width, label='Demanda Máxima')
    plt.xticks(x, products, rotation=45)
    plt.title('Producción vs. Demanda Máxima')
    plt.legend()
    plt.tight_layout()

    # Mostrar gráficos
    plt.show()


    # Análisis de sensibilidad
    print("\nAnálisis de sensibilidad:")
    print("-----------------------")

    # Efecto de cambios en la capacidad de recursos
    print("Efecto de aumentar la capacidad de recursos en un 10%:")




    # Aumentar la capacidad de recursos en un 10%
    for i, res in enumerate(resources):
        if resource_utilization_percent[i] >= 99:  # Recurso limitante
            print(f"  {res}: Recurso limitante, un aumento del 10% podría incrementar la producción")
        else:
            print(f"  {res}: No es un recurso limitante actualmente ({resource_utilization_percent[i]:.2f}%)")

else:
    print("No se pudo encontrar una solución óptima.")
    print("Mensaje:", result.message)