from pulp import *
import matplotlib.pyplot as plt


def optimize_production(
    initial_stock,
    demands,
    yield_percentage,
    density,
    max_productivity,
    safety_stocks=None,
    objective="min"  # "min" to minimize productivity or "max" to maximize
):
    num_periods = len(demands)

    if safety_stocks is None:
        safety_stocks = [0] * num_periods
    elif len(safety_stocks) != num_periods:
        raise ValueError("Length of safety_stocks must equal the number of periods.")

    # 1. Create problem
    direction = LpMinimize if objective == "min" else LpMaximize
    prob = LpProblem("Production_Optimization", direction)

    # 2. Decision variables
    production_vars = [LpVariable(f"P_{t}", 0, max_productivity) for t in range(num_periods)]

    # 3. Objective function
    prob += lpSum(production_vars), "Total_Production"

    # 4. Constraints
    stock = initial_stock
    stock_vars = []  # Track ending stock levels for plotting

    for t in range(num_periods):
        # Inventory balance calculation
        new_stock = stock + (production_vars[t] * yield_percentage * density) - demands[t]
        prob += new_stock >= safety_stocks[t], f"Safety_Stock_{t}"
        stock_vars.append(new_stock)
        stock = new_stock  # Carry forward stock

    # Final stock must be zero
    prob += stock == 0, "Final_Stock_Zero"

    # 5. Solve
    prob.solve()

    # 6. Extract results
    optimal_value = value(prob.objective)
    production_levels = [value(var) for var in production_vars]
    ending_stocks = [value(s) for s in stock_vars]

    return {
        'optimal_value': optimal_value,
        'production_levels': production_levels,
        'ending_stocks': ending_stocks,
        'status': LpStatus[prob.status]
    }


def plot_results(demands, production, stocks):
    periods = list(range(1, len(demands)+1))

    plt.figure(figsize=(10, 6))

    plt.plot(periods, production, marker='o', label="Producción")
    plt.plot(periods, demands, marker='s', linestyle='--', label="Demanda")
    plt.plot(periods, stocks, marker='^', linestyle=':', label="Stock Final")

    plt.title("Optimización de Producción")
    plt.xlabel("Periodo")
    plt.ylabel("Unidades")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.show()


# --- Uso del sistema ---
if __name__ == "__main__":
    # Parámetros de ejemplo
    initial_stock = 100
    demands = [150, 200, 180, 220]
    yield_percentage = 0.8
    density = 0.9
    max_productivity = 300
    safety_stocks = [20, 20, 20, 0]
    objective_mode = "min"  # Puedes cambiar a "max"

    # Ejecutar optimización
    try:
        result = optimize_production(
            initial_stock,
            demands,
            yield_percentage,
            density,
            max_productivity,
            safety_stocks,
            objective=objective_mode
        )

        print(f"\nEstado de la Optimización: {result['status']}")
        if result['status'] == 'Optimal':
            print(f"Valor Óptimo ({'mínimo' if objective_mode == 'min' else 'máximo'}): {result['optimal_value']}")
            print("Producción por periodo:", result['production_levels'])
            print("Stock final por periodo:", result['ending_stocks'])

            # Mostrar gráficas
            plot_results(demands, result['production_levels'], result['ending_stocks'])

        else:
            print("No se pudo encontrar una solución viable.")

    except ValueError as e:
        print(f"Error en parámetros: {e}")
