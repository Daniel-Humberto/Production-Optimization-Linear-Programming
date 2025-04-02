# Production Optimization With Linear Programming

![Imagen 1](Imagenes/1.png)

Este proyecto forma parte de la propuesta para el **Genius Arena Hackathon 2025** de **Talent Land**, en el track **"Production Planning: Linear Programming and automation through Python"** presentado por **Micron**. La propuesta consiste en:

> **System in Python that automates the necessary calculations to balance production with demand, allowing more precise and efficient planning and reducing costs, using linear programming modeling.**


---


## 📌 Características Principales

Esta propuesta consta de un sistema en Python que automatizara los cálculos necesarios para equilibrar la producción con la demanda mediante programación lineal, y Machine Learning, lo que permitira automatizar la planificación de producción. Se estructuraria en tres áreas clave: Data, BackEnd, y FrontEnd. 

El área de **Data** consta de la limpieza, preprocesamiento, y generacion de Data Sets, mediante EDA. El área de **BackEnd** consta de algoritmos en Python de Machine Learning como Random Forest para estimar la demanda futura, y programación lineal para para optimizar la planificación de la producción. Mientras que el área de **FrontEnd** consta de un Dashboard interactivo con Next.js, React, Shadcn/ui, Tailwind CSS, y Plotly, con un diseño elegante y minimalista, que permite una visualización interactiva y dinámica de los resultados.

Para garantizar un desarrollo modular, iterativo, y eficiente, utilizaremos como metodología principal SCRUM para la gestión del equipo, y CRISP-DM para estructurar el análisis de datos, Machine Learning, y optimización, asegurando una integración efectiva entre las áreas técnicas y analíticas del proyecto.


---


### 🏗️  Metodologias de Desarrollo

Dado que el proyecto abarca desde la planificación de producción, hasta la optimización con programación lineal y machine learning, **SCRUM + CRISP-DM** es la mejor opción. Ya que permite manejar un desarrollo modular con SCRUM, y estructurar la parte de Data Science de manera iterativa y adaptable con CRISP-DM.


- SCRUM

- CRISP-DM


---


### 📦  Data

El área de Data se encargara de la limpieza, el preprocesamiento, y la generación de Data Sets, que alimentarán los modelos analíticos y de optimización, mediante EDA (Análisis Exploratorio de Datos). Dado que aún no se definen las fuentes de datos, se plantea trabajar con al menos una de estas fuentes de datos:


- Bases de Datos SQL

- Archivos JSON

- Archivos CSV


---


### 🔙 BackEnd

El BackEnd se desarrollaria en Python y estaría enfocado principalmente en **programación lineal**. Se contempla el uso de otras tecnicas de Data Science y Machine Learning en caso de ser posible y necesario:


1. **Random Forest** : Con los datos ya depurados y comprendidos, se entrena y valida un modelo para estimar la demanda futura. 

2. **Programación Lineal**: Utilizando los datos depurados y comprendidos, y las predicciones de demanda, se aplica programación lineal para automatizar los cálculos necesarios para equilibrar la producción conforme la demanda.

3. **Bootstrapping** (Opcional): Medición de la estabilidad del modelo.


---


### 🧮  Modelo de Programación Lineal

El modelo de programación lineal propuesto estaría desarrollado en **Python**, utilizando las librerías **SciPy**, **PuLP**, y **Scikit-Learn**, entre otras. El modelo buscara equilibrar la producción con la demanda, respetando todas las restricciones, necesidades, y objetivos, que se planteen. Por ejemplo:


- Restricciones de recursos (silicio, mano de obra, energía, equipamiento y logística).

- Costos de producción asociados a cada tipo de semiconductor.

- Beneficios por unidad producida.

- Demanda máxima por producto.


---


### 🎨 FrontEnd

Interfaz moderna, elegante, e interactiva, para la visualización de resultados:


- **React y Next.js**: Estructura y funcionalidad del FrontEnd.

- **Tailwind CSS**: Diseño y estilo visual.

- **Shadcn/ui**: Componentes de interfaz modernos.

- **Plotly.js**: Creación de visualizaciones interactivas.


---


### 📊 Beneficios del Dashboard

- **Planificación Estratégica**: Permitiría comparar la demanda con la capacidad productiva, mejorando la toma de decisiones a largo plazo.

- **Decisiones Informadas**: Mostraría el impacto de diferentes estrategias de optimización de forma clara.

- **Optimización de Recursos**: Se podria identificar la mejor distribución de recursos en la producción.

- **Visualización Intuitiva**: Facilitaría la comprensión y análisis de datos complejos.


---


## 📐  Diagrama de la aplicación

<p align="center">
  <img src="Diagrama/1.png" alt="Diagrama 1">
</p>

<p align="center">
  <img src="Diagrama/2.png" alt="Diagrama 2">
</p>


---


# 📊 Propuesta de Dashboard

![Imagen 1](Imagenes/1.png)  

![Imagen 2](Imagenes/2.png)  

![Imagen 3](Imagenes/3.png)  

![Imagen 4](Imagenes/4.png)  

![Imagen 5](Imagenes/5.png)  

![Imagen 6](Imagenes/6.png)


---
